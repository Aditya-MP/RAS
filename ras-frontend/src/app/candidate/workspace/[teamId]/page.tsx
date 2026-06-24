"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/shared/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Folder,
  FileCode,
  Terminal,
  MessageSquare,
  Cpu,
  Zap,
  Play,
  Save,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  Check
} from "lucide-react";

interface CodeFiles {
  [path: string]: string;
}

interface ChatMessage {
  id: string;
  candidate_id: string;
  message: string;
  dialogue_act: string | null;
  cognitive_state: string | null;
  telemetry_correlation: number | null;
  created_at: string;
  sender_name?: string;
}

interface ChaosEvent {
  id: string;
  event_type: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "active" | "resolved" | "failed";
}

export default function CandidateWorkspacePage() {
  const { teamId } = useParams() as { teamId: string };
  const { profile, token, apiFetch } = useAuth();
  const router = useRouter();

  // Workspace File States
  const [files, setFiles] = useState<CodeFiles>({
    "index.js": "// Write your collaborative solutions here\nfunction main() {\n  console.log('Sandbox initialized');\n}\nmain();\n",
    "utils.js": "// Helper functions\nexport function add(a, b) {\n  return a + b;\n}",
    "README.md": "# Redrob Collaborative Sandbox Challenge\nWrite a clean solution and verify code execution."
  });
  const [activeFile, setActiveFile] = useState("index.js");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [savingFiles, setSavingFiles] = useState(false);

  const LANGUAGE_BOILERPLATES: { [key: string]: { filename: string; content: string } } = {
    javascript: {
      filename: "index.js",
      content: "// Write your collaborative solutions here\nfunction main() {\n  console.log('Sandbox initialized');\n}\nmain();\n"
    },
    python: {
      filename: "index.py",
      content: "# Write your collaborative solutions here\ndef main():\n    print('Sandbox initialized')\n\nif __name__ == '__main__':\n    main()\n"
    },
    cpp: {
      filename: "index.cpp",
      content: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Sandbox initialized\" << endl;\n    return 0;\n}\n"
    },
    java: {
      filename: "Main.java",
      content: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Sandbox initialized\");\n    }\n}\n"
    },
    go: {
      filename: "index.go",
      content: "package main\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Sandbox initialized\")\n}\n"
    },
    rust: {
      filename: "index.rs",
      content: "fn main() {\n    println!(\"Sandbox initialized\");\n}\n"
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const boilerplate = LANGUAGE_BOILERPLATES[lang];
    if (boilerplate) {
      setFiles((prev) => {
        const newFiles: CodeFiles = {
          [boilerplate.filename]: boilerplate.content,
          "README.md": prev["README.md"] || "# Redrob Collaborative Sandbox Challenge\nWrite a clean solution and verify code execution."
        };
        if (lang === "javascript") {
          newFiles["utils.js"] = "// Helper functions\nexport function add(a, b) {\n  return a + b;\n}";
        } else if (lang === "python") {
          newFiles["utils.py"] = "# Helper functions\ndef add(a, b):\n    return a + b";
        }
        return newFiles;
      });
      setActiveFile(boilerplate.filename);
    }
  };

  // Terminal State
  const [terminalOutput, setTerminalOutput] = useState<string>("sandbox@redrob:~$ \nSystem initialized. Select a file and click 'Run Code' above.\n");
  const [runningCode, setRunningCode] = useState(false);

  // Sidebar Tabs: "chat" | "ai" | "chaos"
  const [activeTab, setActiveTab] = useState<"chat" | "ai" | "chaos">("chat");

  // Chat message feed
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // AI assistant chat
  const [aiPrompts, setAiPrompts] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [askingAI, setAskingAI] = useState(false);

  // Active Chaos failures
  const [chaosEvents, setChaosEvents] = useState<ChaosEvent[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // WebSocket / Connection status
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  // Assessment Submission Modal States
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [hostedUrl, setHostedUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  // Gutter & Textarea refs for synced line numbering scroll
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditorScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Keyboard Biometrics telemetry buffer
  const telemetryBuffer = useRef<any[]>([]);
  const lastKeyTimeRef = useRef<number | null>(null);
  const keyPressTimestamps = useRef<Map<string, number>>(new Map());

  // Fetch initial snapshots, chat, and chaos events
  const loadWorkspaceDetails = useCallback(async () => {
    try {
      // 1. Get latest snapshot files
      const snapshotRes = await apiFetch(`/api/snapshots/team/${teamId}`);
      if (snapshotRes.ok) {
        const snapData = await snapshotRes.json();
        if (snapData.snapshots && snapData.snapshots.length > 0) {
          const snapshotFiles = snapData.snapshots[0].files || {};
          setFiles(snapshotFiles);
          // Set first file as active
          const firstFile = Object.keys(snapshotFiles)[0];
          if (firstFile) {
            setActiveFile(firstFile);
            // Auto detect language from extension
            const ext = firstFile.split(".").pop()?.toLowerCase();
            const extToLangMap: { [key: string]: string } = {
              js: "javascript",
              py: "python",
              cpp: "cpp",
              java: "java",
              go: "go",
              rs: "rust"
            };
            if (ext && extToLangMap[ext]) {
              setSelectedLanguage(extToLangMap[ext]);
            }
          }
        } else {
          // If no snapshot exists yet, save initial files to database
          await apiFetch("/api/snapshots", {
            method: "POST",
            body: JSON.stringify({ teamId, files }),
          });
        }
      }

      // 2. Get chat history
      const chatRes = await apiFetch(`/api/chat/team/${teamId}`);
      if (chatRes.ok) {
        const chatData = await chatRes.json();
        setMessages(chatData.messages || []);
      }

      // 3. Get active chaos events
      const chaosRes = await apiFetch(`/api/chaos/team/${teamId}`);
      if (chaosRes.ok) {
        const chaosData = await chaosRes.json();
        setChaosEvents(chaosData.events || []);
      }
    } catch (err) {
      console.error("Error loading workspace logs:", err);
    }
  }, [teamId, apiFetch]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    loadWorkspaceDetails();
  }, [token, router, loadWorkspaceDetails]);

  // Establish WebSocket connection for real-time telemetry stream
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let flushInterval: ReturnType<typeof setInterval> | null = null;
    let ws: WebSocket | null = null;

    const connect = () => {
      if (!isMounted) return;

      const wsUrl = `ws://localhost:5000/ws?token=${token}&teamId=${teamId}`;
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) { ws?.close(); return; }
        setSocketConnected(true);
        reconnectAttempts = 0;
        console.log("WebSocket telemetry stream connected");
      };

      ws.onclose = (e) => {
        if (!isMounted) return;
        setSocketConnected(false);
        // Only reconnect if this wasn't an intentional close (code 1000 = normal)
        if (e.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          reconnectAttempts++;
          console.log(`WebSocket closed (code ${e.code}). Reconnecting in ${delay}ms... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
          reconnectTimer = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        // Only log if component is still mounted — StrictMode cleanup triggers this
        if (isMounted) {
          console.warn("WebSocket connection error — will auto-reconnect.");
        }
      };

      // Buffer flushing timer
      if (flushInterval) clearInterval(flushInterval);
      flushInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN && telemetryBuffer.current.length > 0) {
          ws.send(
            JSON.stringify({
              events: telemetryBuffer.current,
            })
          );
          telemetryBuffer.current = [];
        }
      }, 4000);
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (flushInterval) clearInterval(flushInterval);
      if (ws) {
        ws.onclose = null; // Prevent reconnection on intentional close
        ws.onerror = null; // Prevent noisy error on StrictMode unmount
        ws.close(1000, "Component unmounted");
      }
      socketRef.current = null;
    };
  }, [token, teamId]);

  // Telemetry event helper
  const recordTelemetry = (eventClass: string, eventData: object) => {
    const event = {
      event_class: eventClass,
      event_data: eventData,
    };
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      telemetryBuffer.current.push(event);
    }
  };

  // Keyboard Biometrics telemetry hook
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key;
    const now = performance.now();
    keyPressTimestamps.current.set(key, now);

    // Calculate flight time (time between keydown of previous key and keydown of current key)
    let flightTime = 0;
    if (lastKeyTimeRef.current !== null) {
      flightTime = Math.round(now - lastKeyTimeRef.current);
    }
    lastKeyTimeRef.current = now;

    // We stream details on keyUp
    e.currentTarget.dataset.flightTime = flightTime.toString();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key;
    const now = performance.now();
    const keyDownTime = keyPressTimestamps.current.get(key);

    let dwellTime = 0;
    if (keyDownTime) {
      dwellTime = Math.round(now - keyDownTime);
      keyPressTimestamps.current.delete(key);
    }

    const flightTime = parseInt(e.currentTarget.dataset.flightTime || "0", 10);

    // Record Telemetry EV_KBD
    recordTelemetry("EV_KBD", {
      key: key.substring(0, 10), // truncate long keys like Backspace
      dwell_time_ms: dwellTime,
      flight_time_ms: flightTime,
      file_path: activeFile,
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("Text") || "";
    recordTelemetry("EV_PST", {
      paste_length: pastedText.length,
      file_path: activeFile,
      paste_hash: pastedText.substring(0, 20), // short preview
    });
  };

  // Focus and Blur Telemetry hooks
  useEffect(() => {
    let blurStart: number | null = null;

    const handleWindowBlur = () => {
      blurStart = performance.now();
    };

    const handleWindowFocus = () => {
      if (blurStart !== null) {
        const blurDuration = Math.round(performance.now() - blurStart);
        recordTelemetry("EV_BLR", {
          blur_duration_ms: blurDuration,
          target_app: "external_window",
        });
        blurStart = null;
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  // Modify Active File Content
  const handleContentChange = (content: string) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: content,
    }));
  };

  // Save Code snapshot manually
  const handleSaveFiles = async () => {
    setSavingFiles(true);
    try {
      const res = await apiFetch("/api/snapshots", {
        method: "POST",
        body: JSON.stringify({ teamId, files }),
      });
      if (res.ok) {
        setTerminalOutput((prev) => `${prev}system@sandbox:~$ Snapshot saved successfully!\n`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingFiles(false);
    }
  };

  // Execute Code inside Judge0Sandbox
  const handleRunCode = async () => {
    setRunningCode(true);
    setTerminalOutput((prev) => `${prev}sandbox@judge0:~$ run ${activeFile}\nCompiling and running on Judge0 CE sandboxed runtime...\n`);

    try {
      // Determine language from extension
      const ext = activeFile.split(".").pop()?.toLowerCase();
      const extToLangMap: { [key: string]: string } = {
        js: "javascript",
        py: "python",
        cpp: "cpp",
        java: "java",
        go: "go",
        rs: "rust"
      };
      const language = (ext && extToLangMap[ext]) ? extToLangMap[ext] : "javascript";

      const res = await apiFetch("/api/execution/run", {
        method: "POST",
        body: JSON.stringify({
          language,
          source_code: files[activeFile],
        }),
      });

      const data = await res.json();

      let output = "";
      if (data.compile_output) output += `${data.compile_output}\n`;
      if (data.stderr) output += `${data.stderr}\n`;
      if (data.stdout) output += `${data.stdout}\n`;
      if (!output) output += "Process exited with 0 (no output)\n";

      setTerminalOutput((prev) => `${prev}${output}`);

      // Telemetry EV_TRM
      recordTelemetry("EV_TRM", {
        command: `run ${activeFile}`,
        exit_code: data.status?.id === 3 ? 0 : 1,
        stdout: data.stdout || "",
        stderr: data.stderr || "",
      });
    } catch (err: any) {
      setTerminalOutput((prev) => `${prev}Sandbox error: ${err.message}\n`);
    } finally {
      setRunningCode(false);
    }
  };

  // Send message to Team Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingMsg) return;

    setSendingMsg(true);
    const msgText = chatInput.trim();
    setChatInput("");

    try {
      const res = await apiFetch("/api/chat/message", {
        method: "POST",
        body: JSON.stringify({
          teamId,
          message: msgText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Append message
        setMessages((prev) => [...prev, data.data]);
        loadWorkspaceDetails(); // Refresh logs to get calibrated stats
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  // Ask Socratic AI Assistant
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || askingAI) return;

    setAskingAI(true);
    const promptText = aiInput.trim();
    setAiInput("");

    setAiPrompts((prev) => [...prev, { role: "user", text: promptText }]);

    try {
      const res = await apiFetch("/api/ai/ask", {
        method: "POST",
        body: JSON.stringify({
          prompt: promptText,
          context: files[activeFile] || "",
          sessionId: profile?.id || "session",
          teamId: teamId, // dynamically matched in backend
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiPrompts((prev) => [...prev, { role: "model", text: data.reply }]);

        // Telemetry EV_PRM
        recordTelemetry("EV_PRM", {
          prompt: promptText,
          model: "gemini-2.5-flash-lite",
        });
      }
    } catch (err: any) {
      setAiPrompts((prev) => [...prev, { role: "model", text: `Error: ${err.message}` }]);
    } finally {
      setAskingAI(false);
    }
  };

  // Resolve Chaos Event
  const handleResolveChaos = async (eventId: string) => {
    setResolvingId(eventId);

    try {
      const res = await apiFetch(`/api/chaos/resolve/${eventId}`, {
        method: "POST",
      });

      if (res.ok) {
        // Refresh logs
        loadWorkspaceDetails();
      }
    } catch (err) {
      console.error("Error resolving chaos:", err);
    } finally {
      setResolvingId(null);
    }
  };

  // Simulated Teammates Interactions
  useEffect(() => {
    // Teammate chat messages simulation
    const chatSim = setTimeout(() => {
      const mockMsg: ChatMessage = {
        id: Math.random().toString(),
        candidate_id: "simulated- Sarah",
        message: "Sarah (AI Teammate): Checking the requirements in README.md. I'll define standard helper exports inside utils.js.",
        dialogue_act: "OFFER",
        cognitive_state: "SURE",
        telemetry_correlation: 0.95,
        created_at: new Date().toISOString(),
        sender_name: "Sarah (Teammate)"
      };
      setMessages((prev) => [...prev, mockMsg]);
    }, 15000);

    const chatSim2 = setTimeout(() => {
      const mockMsg: ChatMessage = {
        id: Math.random().toString(),
        candidate_id: "simulated-Alex",
        message: "Alex (AI Teammate): Should we connect index.js to run test cases now? Let me know if you want me to add test scripts.",
        dialogue_act: "REQUEST_CLARIFICATION",
        cognitive_state: "CONFUSED",
        telemetry_correlation: 0.88,
        created_at: new Date().toISOString(),
        sender_name: "Alex (Teammate)"
      };
      setMessages((prev) => [...prev, mockMsg]);
    }, 45000);

    return () => {
      clearTimeout(chatSim);
      clearTimeout(chatSim2);
    };
  }, []);

  // Poll chaos events every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (token) {
        apiFetch(`/api/chaos/team/${teamId}`)
          .then((res) => res.json())
          .then((data) => setChaosEvents(data.events || []))
          .catch((err) => console.error("Poll chaos error:", err));
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [teamId, token, apiFetch]);

  // Check if any chaos failure is active
  const activeChaos = chaosEvents.filter((c) => c.status === "active");

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAssessment(true);
    
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`ras_submission_${teamId}`, JSON.stringify({
          submittedAt: new Date().toISOString(),
          zipFileName: zipFile ? zipFile.name : "project_archive.zip",
          hostedUrl: hostedUrl || "http://my-agentic-sandbox-app.vercel.app",
          videoUrl: videoUrl || "https://drive.google.com/file/d/123456789/view"
        }));
      }
      
      await apiFetch("/api/snapshots", {
        method: "POST",
        body: JSON.stringify({ teamId, files }),
      });

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          events: [{
            event_class: "EV_ACP",
            event_data: {
              submitted: true,
              zipFile: zipFile ? zipFile.name : "project_archive.zip",
              hostedUrl,
              videoUrl
            },
            created_at: new Date().toISOString()
          }]
        }));
      }

      setTimeout(() => {
        setSubmittingAssessment(false);
        setShowSubmitModal(false);
        router.push(`/candidate/workspace/${teamId}/review`);
      }, 1500);

    } catch (err) {
      console.error("Submission snapshot save failed:", err);
      setSubmittingAssessment(false);
      router.push(`/candidate/workspace/${teamId}/review`);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col h-screen overflow-hidden">
      
      {/* Workspace Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-[#0d1117] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center font-bold text-black text-xs font-outfit">
            R
          </div>
          <span className="font-extrabold font-outfit text-white text-sm">
            Redrob <span className="text-accent">Sandbox</span>
          </span>
          <span className="text-[9px] font-mono font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest">
            IDE Workspace
          </span>

          {/* WebSocket stream status */}
          <div className="flex items-center gap-1.5 ml-4 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-lg">
            <span className={`w-2 h-2 rounded-full ${socketConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
            <span className="text-[10px] font-mono text-slate-500">
              {socketConnected ? "Telemetry stream active" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Global Chaos Warning bar */}
        {activeChaos.length > 0 && (
          <div className="hidden md:flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3.5 py-1.5 rounded-full animate-pulse font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Chamber Alert: System Fault Injected! Resolve in the panel.</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold font-outfit text-xs rounded-xl shadow-lg shadow-rose-600/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            End Assessment Session
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: IDE and Terminal console */}
        <div className="flex-1 flex flex-col border-r border-white/5 bg-[#090d13] overflow-hidden">
          
          {/* Action Row */}
          <div className="px-6 py-3 bg-[#0d1117]/60 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {Object.keys(files).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                    activeFile === filename
                      ? "bg-slate-900 border-white/10 text-accent shadow"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  {filename}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-900 border border-white/10 focus:border-accent rounded-lg text-xs font-mono text-slate-300 focus:outline-none transition-all cursor-pointer"
              >
                <option value="javascript">JavaScript (.js)</option>
                <option value="python">Python (.py)</option>
                <option value="cpp">C++ (.cpp)</option>
                <option value="java">Java (.java)</option>
                <option value="go">Go (.go)</option>
                <option value="rust">Rust (.rs)</option>
              </select>

              <button
                onClick={handleSaveFiles}
                disabled={savingFiles}
                className="py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {savingFiles ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Snapshot
                  </>
                )}
              </button>

              <button
                onClick={handleRunCode}
                disabled={runningCode}
                className="py-1.5 px-3 bg-accent hover:bg-accent-hover text-black font-extrabold font-outfit text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-md shadow-accent/10 cursor-pointer disabled:opacity-50"
              >
                {runningCode ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black text-black" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* IDE Editor Area with Line Numbers */}
          <div className="flex-1 flex overflow-hidden font-mono p-2 bg-[#090d13]">
            {/* Gutter */}
            <div
              ref={gutterRef}
              className="select-none text-right pr-3 pl-2 text-slate-600 border-r border-white/5 text-xs leading-6 overflow-hidden shrink-0"
              style={{ maxHeight: '100%' }}
            >
              {(files[activeFile] || "").split("\n").map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={files[activeFile] || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onPaste={handlePaste}
              onScroll={handleEditorScroll}
              className="flex-1 h-full pl-3 bg-transparent text-slate-200 focus:outline-none resize-none leading-6 font-mono text-xs select-text overflow-y-auto"
              spellCheck="false"
            />
          </div>

          {/* Terminal Console */}
          <div className="h-[220px] bg-[#02040a] border-t border-white/5 flex flex-col overflow-hidden shrink-0">
            <div className="px-5 py-2 bg-[#090d13] border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Console Output
              </div>
              <button
                onClick={() => setTerminalOutput("sandbox@redrob:~$ \n")}
                className="hover:underline text-[9px]"
              >
                Clear Log
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap select-text selection:bg-accent selection:text-black">
              {terminalOutput}
            </div>
          </div>
        </div>

        {/* Right Side: Navigation panel widgets */}
        <div className="w-[380px] bg-[#0d1117] flex flex-col overflow-hidden shrink-0">
          
          {/* Tab Selection */}
          <div className="grid grid-cols-3 border-b border-white/5 bg-[#090d13] shrink-0 p-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`py-3 text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-xl ${
                activeTab === "chat"
                  ? "bg-[#0d1117] text-white border border-white/5 shadow-md"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`py-3 text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-xl ${
                activeTab === "ai"
                  ? "bg-[#0d1117] text-white border border-white/5 shadow-md"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Socratic
            </button>
            <button
              onClick={() => setActiveTab("chaos")}
              className={`py-3 text-xs font-bold font-outfit flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-xl relative ${
                activeTab === "chaos"
                  ? "bg-[#0d1117] text-white border border-white/5 shadow-md"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              Chaos
              {activeChaos.length > 0 && (
                <span className="absolute top-2.5 right-4 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </button>
          </div>

          {/* TAB CONTENT WIDGETS */}
          <div className="flex-grow flex flex-col overflow-hidden relative">
            
            {/* TAB: Chat */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-600 italic text-center py-12">No chat communication logged.</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex flex-col gap-1 text-xs text-left">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-white font-outfit">
                            {msg.sender_name || (msg.candidate_id === profile?.id ? "You" : "Teammate")}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-900 border border-white/5 rounded-2xl leading-relaxed text-slate-300 font-sans">
                          {msg.message}
                        </div>

                        {/* Dialogue Act Classification indicators */}
                        {(msg.dialogue_act || msg.cognitive_state) && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {msg.dialogue_act && (
                              <span className="text-[8px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                {msg.dialogue_act}
                              </span>
                            )}
                            {msg.cognitive_state && (
                              <span className="text-[8px] font-mono bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                {msg.cognitive_state}
                              </span>
                            )}
                            {msg.telemetry_correlation !== null && (
                              <span className="text-[8px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full tracking-wider font-bold">
                                TCI: {msg.telemetry_correlation.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-[#090d13] border-t border-white/5 flex gap-2 shrink-0">
                  <input
                    type="text"
                    required
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Discuss tasks with teammates..."
                    className="flex-1 px-4 py-2.5 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none transition-all placeholder-slate-600"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="p-2.5 bg-accent hover:bg-accent-hover text-black rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: Socratic AI */}
            {activeTab === "ai" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
                  {aiPrompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-3">
                      <HelpCircle className="w-8 h-8 text-slate-600" />
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Need architectural guidance? Ask the Ambient Tech Lead. Responses are wrapped in Socratic prompts to guide you conceptually rather than giving simple solutions.
                      </p>
                    </div>
                  ) : (
                    aiPrompts.map((chat, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col gap-1 text-xs text-left ${
                          chat.role === "user" ? "items-end text-right" : ""
                        }`}
                      >
                        <span className="font-bold text-white font-outfit uppercase tracking-wider text-[10px] text-slate-500">
                          {chat.role === "user" ? "You" : "Socratic ATL"}
                        </span>
                        <div
                          className={`p-3.5 border rounded-2xl leading-relaxed text-slate-300 font-sans ${
                            chat.role === "user"
                              ? "bg-white/[0.02] border-white/10 rounded-tr-none"
                              : "bg-accent/[0.02] border-accent/20 rounded-tl-none font-medium"
                          }`}
                        >
                          {chat.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAskAI} className="p-4 bg-[#090d13] border-t border-white/5 flex gap-2 shrink-0">
                  <input
                    type="text"
                    required
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask ATL conceptual help..."
                    className="flex-1 px-4 py-2.5 bg-slate-950/50 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white focus:outline-none transition-all placeholder-slate-600"
                  />
                  <button
                    type="submit"
                    disabled={askingAI}
                    className="p-2.5 bg-accent hover:bg-accent-hover text-black rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  >
                    {askingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* TAB: Chaos Status */}
            {activeTab === "chaos" && (
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Infrastructure Diagnostics</h3>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                      activeChaos.length > 0
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {activeChaos.length > 0 ? "Fault Active" : "Operational"}
                  </span>
                </div>

                {activeChaos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                    <p className="text-xs text-slate-500 leading-normal">
                      Infrastructure running within acceptable latency parameters. No active anomalies injected.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {activeChaos.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 bg-amber-500/[0.02] border border-amber-500/20 rounded-2xl flex flex-col gap-3 text-left animate-pulse"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                          <span className="font-extrabold font-mono text-white text-xs uppercase tracking-wider">
                            {event.event_type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-normal font-sans">
                          {event.description}
                        </p>
                        
                        <button
                          onClick={() => handleResolveChaos(event.id)}
                          disabled={resolvingId === event.id}
                          className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-black font-bold font-outfit text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow shadow-amber-500/10 cursor-pointer disabled:opacity-50 mt-1"
                        >
                          {resolvingId === event.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Applying Diagnostics...
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 text-black" />
                              Apply System Resolution
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PHASE 3: SUBMISSION MODAL OVERLAY */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 border border-white/10 rounded-3xl shadow-2xl flex flex-col gap-6 relative text-left bg-[#0d1117]/95">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[9px] font-mono font-bold bg-rose-500/15 border border-rose-500/25 px-2 py-0.5 rounded text-rose-400 uppercase tracking-widest">
                Phase 3: Final Submission
              </span>
              <h2 className="text-base font-bold font-outfit text-white mt-3 mb-1">
                Submit Your Collaborative Sandbox
              </h2>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Upload your workspace source package (Zip), live preview link, and video walkthrough to finalize. Submission will complete and lock the IDE workspace chamber.
              </p>
            </div>

            <form onSubmit={handleSubmitAssessment} className="flex flex-col gap-4">
              {/* Zip Upload Input */}
              <div className="flex flex-col gap-1.5 font-sans text-xs">
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Project Archive (.zip)</label>
                <div className="border border-dashed border-white/10 hover:border-accent/40 bg-slate-950/40 rounded-xl p-4 transition-all flex flex-col items-center justify-center cursor-pointer text-center relative group">
                  <input
                    type="file"
                    accept=".zip"
                    required
                    onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-slate-300">
                    {zipFile ? zipFile.name : "Select or drag workspace .zip here"}
                  </span>
                  <span className="text-[8px] text-slate-500 mt-0.5">Zip files only (Max size 25MB)</span>
                </div>
              </div>

              {/* Hosted Deployment Link */}
              <div className="flex flex-col gap-1 font-sans">
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Hosted Application Link</label>
                <input
                  type="url"
                  required
                  value={hostedUrl}
                  onChange={(e) => setHostedUrl(e.target.value)}
                  placeholder="https://my-deployment-preview.vercel.app"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none"
                />
              </div>

              {/* 2-3 Min Video Drive Link */}
              <div className="flex flex-col gap-1 font-sans">
                <label className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Video Walkthrough (Drive Link)</label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/5 focus:border-accent/40 rounded-xl text-xs text-white placeholder-slate-655 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold font-outfit text-xs rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssessment}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold font-outfit text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingAssessment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      Locking Sandbox...
                    </>
                  ) : (
                    <>
                      Confirm & Submit Assessment
                      <Check className="w-3.5 h-3.5 text-white" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
