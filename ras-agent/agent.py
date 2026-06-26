import sys
import time
import json
import sqlite3
import threading
import argparse
import websocket
import psutil
import pyperclip
from pynput import keyboard

# Attempt to import pygetwindow for focus tracking
try:
    import pygetwindow as gw
except ImportError:
    gw = None

# Arguments
parser = argparse.ArgumentParser(description="RAS OS Monitoring Agent")
parser.add_argument("--ws-url", required=True, help="Backend WebSocket URL (e.g. ws://localhost:5000/ws?token=X&teamId=Y)")
parser.add_argument("--db-path", default="telemetry_buffer.db", help="Path to local SQLite buffer database")
args = parser.parse_args()

DB_PATH = args.db_path
WS_URL = args.ws_url

print(f"Starting OS Monitoring Agent...")
print(f"WebSocket Destination: {WS_URL}")
print(f"SQLite Buffer DB: {DB_PATH}")

# Database initialization
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS telemetry_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_class TEXT NOT NULL,
            event_data TEXT NOT NULL,
            timestamp_ms INTEGER NOT NULL,
            synced INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

def log_event(event_class, event_data):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        timestamp_ms = event_data.get('timestamp_ms', int(time.time() * 1000))
        c.execute(
            "INSERT INTO telemetry_events (event_class, event_data, timestamp_ms, synced) VALUES (?, ?, ?, 0)",
            (event_class, json.dumps(event_data), timestamp_ms)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Agent] SQLite insert error: {e}", file=sys.stderr)

# Global states for key capture
press_times = {}
last_release_time = None

def on_press(key):
    global press_times
    try:
        key_name = key.char if hasattr(key, 'char') else str(key)
    except Exception:
        key_name = str(key)
    
    if key_name and key_name not in press_times:
        press_times[key_name] = time.time()

def on_release(key):
    global press_times, last_release_time
    try:
        key_name = key.char if hasattr(key, 'char') else str(key)
    except Exception:
        key_name = str(key)

    if key_name and key_name in press_times:
        press_time = press_times[key_name]
        dwell_time_ms = (time.time() - press_time) * 1000
        del press_times[key_name]
        
        # Log EV_KBD event (duration only, no text logged for privacy)
        log_event('EV_KBD', {
            'timestamp_ms': int(time.time() * 1000),
            'dwell_time_ms': int(dwell_time_ms)
        })
    last_release_time = time.time()

# Clipboard Monitor Polling Loop
def clipboard_monitor_loop():
    last_clip = ""
    while True:
        try:
            curr_clip = pyperclip.paste()
            if curr_clip and curr_clip != last_clip:
                last_clip = curr_clip
                # Log EV_PST paste event length (not actual text, for privacy)
                log_event('EV_PST', {
                    'timestamp_ms': int(time.time() * 1000),
                    'content_length': len(curr_clip)
                })
        except Exception:
            pass
        time.sleep(1.0)

# Process Monitor Polling Loop
def process_monitor_loop():
    monitored_processes = {
        'cmd', 'powershell', 'bash', 'zsh', 'terminal', 'cmd.exe', 
        'powershell.exe', 'vscodium', 'code', 'git', 'sourcetree'
    }
    running_monitored = set()
    while True:
        try:
            current_monitored = set()
            for proc in psutil.process_iter(['name']):
                name = proc.info['name']
                if name:
                    name_lower = name.lower()
                    for p in monitored_processes:
                        if p in name_lower:
                            current_monitored.add(name)
            
            # Detect new process launches
            new_procs = current_monitored - running_monitored
            for proc_name in new_procs:
                log_event('EV_TRM', {
                    'timestamp_ms': int(time.time() * 1000),
                    'command': f'Active local shell/editor detected: {proc_name}',
                    'exit_code': 0,
                    'source': 'OS_AGENT_PROCESS_MONITOR'
                })
            
            running_monitored = current_monitored
        except Exception:
            pass
        time.sleep(5.0)

# Window Focus Blur Polling Loop
def focus_monitor_loop():
    if not gw:
        print("[Agent] pygetwindow not available. Focus monitor disabled.")
        return

    last_title = ""
    last_switch_time = time.time()
    while True:
        try:
            active_win = gw.getActiveWindow()
            if active_win:
                title = active_win.title
                if title and title != last_title:
                    now = time.time()
                    duration_ms = int((now - last_switch_time) * 1000)
                    
                    if last_title:
                        # Log EV_BLR event (switched away from this window)
                        log_event('EV_BLR', {
                            'timestamp_ms': int(now * 1000),
                            'blur_duration_ms': duration_ms,
                            'target_app': last_title
                        })
                    
                    last_title = title
                    last_switch_time = now
        except Exception:
            pass
        time.sleep(1.0)

# WebSocket & Sync management
ws_client = None
ws_connected = False

def on_open(ws):
    global ws_connected
    ws_connected = True
    print("[Agent] WebSocket connection established.")

def on_message(ws, message):
    try:
        data = json.loads(message)
        if data.get('status') == 'ok':
            count = data.get('count', 0)
            if count > 0:
                # Mark count rows as synced
                conn = sqlite3.connect(DB_PATH)
                c = conn.cursor()
                c.execute("SELECT id FROM telemetry_events WHERE synced = 0 ORDER BY id ASC LIMIT ?", (count,))
                ids = [r[0] for r in c.fetchall()]
                if ids:
                    c.execute(f"UPDATE telemetry_events SET synced = 1 WHERE id IN ({','.join('?' for _ in ids)})", ids)
                    conn.commit()
                conn.close()
                print(f"[Agent] Synced {count} events with server.")
    except Exception as e:
        print(f"[Agent] Error handling message from server: {e}", file=sys.stderr)

def on_error(ws, error):
    print(f"[Agent] WebSocket error: {error}", file=sys.stderr)

def on_close(ws, close_status_code, close_msg):
    global ws_connected
    ws_connected = False
    print(f"[Agent] WebSocket connection closed: {close_msg} ({close_status_code})")

def websocket_worker():
    global ws_client
    while True:
        try:
            ws_client = websocket.WebSocketApp(
                WS_URL,
                on_open=on_open,
                on_message=on_message,
                on_error=on_error,
                on_close=on_close
            )
            ws_client.run_forever()
        except Exception as e:
            print(f"[Agent] Connection error: {e}", file=sys.stderr)
        time.sleep(5.0)

def database_sync_worker():
    global ws_connected, ws_client
    while True:
        if ws_connected and ws_client:
            try:
                conn = sqlite3.connect(DB_PATH)
                c = conn.cursor()
                c.execute("SELECT id, event_class, event_data FROM telemetry_events WHERE synced = 0 ORDER BY id ASC LIMIT 100")
                rows = c.fetchall()
                conn.close()

                if rows:
                    events = []
                    for row in rows:
                        events.append({
                            'event_class': row[1],
                            'event_data': json.loads(row[2])
                        })
                    
                    payload = json.dumps({'events': events})
                    ws_client.send(payload)
            except Exception as e:
                print(f"[Agent] Database sync worker error: {e}", file=sys.stderr)
        time.sleep(2.0)

# Main Entrypoint
if __name__ == "__main__":
    init_db()

    # Start keyboard hooks
    print("[Agent] Hooking keyboard listener...")
    kbd_listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    kbd_listener.start()

    # Start monitoring threads
    print("[Agent] Launching polling monitors...")
    threading.Thread(target=clipboard_monitor_loop, daemon=True).start()
    threading.Thread(target=process_monitor_loop, daemon=True).start()
    threading.Thread(target=focus_monitor_loop, daemon=True).start()

    # Start sync and connection routines
    print("[Agent] Launching sync and network daemon...")
    threading.Thread(target=database_sync_worker, daemon=True).start()
    
    # Run websocket loop on main thread (auto-reconnects)
    websocket_worker()
