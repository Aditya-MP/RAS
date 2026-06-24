const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000/ws?teamId=test-team-123');

ws.on('open', () => {
  console.log('✅ Connected to WebSocket server');

  // Send a test telemetry batch
  ws.send(JSON.stringify({
    events: [
      { event_class: 'EV_KBD', event_data: { timestamp_ms: Date.now(), key: 'a', dwell_time_ms: 80 } },
      { event_class: 'EV_KBD', event_data: { timestamp_ms: Date.now() + 100, key: 'b', dwell_time_ms: 75 } },
      { event_class: 'EV_PRM', event_data: { timestamp_ms: Date.now() + 200, prompt: 'how do I sort an array?' } },
    ]
  }));
});

ws.on('message', (data) => {
  console.log('📨 Server response:', JSON.parse(data.toString()));
});

ws.on('error', (err) => {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', (code, reason) => {
  console.log(`🔌 Connection closed — code: ${code}, reason: ${reason.toString()}`);
});

// Close after 3 seconds
setTimeout(() => ws.close(), 3000);
