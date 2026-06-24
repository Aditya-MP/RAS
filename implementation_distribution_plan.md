# **Redrob Ambient Sandbox (RAS): 3-Part Parallel Implementation & Integration Plan**

To ensure smooth parallel development, the platform is divided into **three independent modules** with **strict, immutable API contracts**. This design allows three developers to work concurrently and merge their components seamlessly at the end of the hackathon.

```
       +-------------------------------------------------------------+
       |             PART 1: COLLABORATIVE FRONTEND & IDE            |
       |  - React + Tailwind UI                                      |
       |  - Monaco Editor + Yjs Binding                              |
       |  - Keystroke Telemetry Logger                               |
       +------------------------------+------------------------------+
                                      |
                                      | [Sync: Supabase Realtime WSS]
                                      | [HTTP: REST API Contracts]
                                      |
       +------------------------------v------------------------------+
       |             PART 2: SERVERLESS BACKEND & STORAGE            |
       |  - Supabase Database & Realtime Auth Proxy                  |
       |  - Vercel Serverless Functions                              |
       |  - CRDT Scope-Locking Validation Middleware                 |
       +------------------------------+------------------------------+
                                      |
                                      | [JSON Payloads over Secure API]
                                      |
       +------------------------------v------------------------------+
       |           PART 3: SECURE COMPILER & AI SOCRATIC ENGINE      |
       |  - Sandboxed Judge0/Piston Execution (gVisor Hardened)      |
       |  - Gemini 2.5 Flash-Lite Prompt Cache                       |
       |  - Zero-Shot Dialogue Act Classifier (DAC)                  |
       +-------------------------------------------------------------+
```

---

## **PART 1: The Collaborative Frontend & Editor Layer (Developer A)**

*   **Objective:** Build the workspace interface, configure the editor instance, and capture developer interaction telemetry.
*   **Key Responsibilities:**
    1.  **Vite + React Setup:** Initialize the React application with Tailwind CSS and construct the layout (Multiplayer Editor on the left, Socratic chat panel and terminal stdout/stderr panel on the right).
    2.  **Monaco Editor Integration:** Mount the Monaco Editor instance, configure it for multiple languages, and bind it to the local Yjs document instance (`y-monaco` binding).
    3.  **Telemetry Logging Daemon:** Attach event listeners to Monaco's `onDidChangeModelContent` and window focus events.
        *   Log character counts, backspaces, paste lengths, and focus shift timestamps.
        *   Send telemetry updates to Part 2 API at a debounced rate of 5 seconds.
    4.  **Team Chat UI:** Create the chat interface enabling developers to communicate with each other and receive Socratic messages from the ATL.

---

## **PART 2: Serverless Backend, DB, & Auth Proxy (Developer B)**

*   **Objective:** Manage the data storage, proxy client requests securely, and enforce sync access control.
*   **Key Responsibilities:**
    1.  **Supabase Provisioning:** Design and initialize the PostgreSQL tables (`rooms`, `documents`, `telemetry_logs`, `chat_history`).
    2.  **Yjs Sync Authorization Proxy:** Configure Supabase Realtime broadcast channels and write row-level security (RLS) policies.
        *   Implement **Scope Locking** validation. Verify that a user has edit permissions for a specific file path before broadcasting the binary sync vector.
    3.  **Serverless Routing Gateway (Vercel):** Implement secure API endpoints that:
        *   Receive telemetry payloads from Part 1, store them, and calculate the **Assessment Integrity Score ($I$)**.
        *   Proxy code compilation requests from Part 1 to Part 3 (sandboxed execution).
        *   Proxy chat messages to the Socratic Engine (Part 3) and return Socratic hints.

---

## **PART 3: Sandboxed Compiler & AI Socratic Engine (Developer C)**

*   **Objective:** Compile untrusted code securely and manage Socratic dialogue acts.
*   **Key Responsibilities:**
    1.  **gVisor Sandbox Compilation (SnapDeploy):** Configure a self-hosted instance of Judge0 or Piston Docker container.
        *   Hard-configure container runtimes under a gVisor sandboxed kernel (`runsc`).
        *   Enforce read-only volumes, disable outbound internet connectivity, and apply strict limits (128MB RAM, 3s timeout).
    2.  **Socratic Prompt Engineering & Context Cache:** Build the Gemini 2.5 Flash-Lite pipeline using Google AI Studio.
        *   Configure **Explicit Context Caching** for the system's core instructions and reference solutions.
    3.  **Dialogue Act Classifier (DAC):** Write the zero-shot JSON classifier prompt to process incoming chat messages and recommend hint scaffold levels (`LOW_HINT`, `MID_QUESTION`, `HIGH_GUIDE`).

---

## **Integration Contracts (The Glue)**

To ensure all three parts merge immediately without compatibility failures, developers must adhere to these strict API JSON schemas:

### **Contract A: Telemetry Payload (Part 1 $\to$ Part 2)**
*   **Method:** `POST`
*   **Endpoint:** `/api/telemetry`
*   **Payload Schema:**
```json
{
  "room_id": "string-uuid",
  "candidate_id": "string-uuid",
  "dwell_times": [45, 112, 98, 88], // Key press-to-release (ms)
  "flight_times": [120, 3400, 150, 180], // Release-to-press (ms)
  "paste_events": [
    {
      "pasted_length": 450,
      "timestamp": 1782348200
    }
  ],
  "focus_shifts": [
    {
      "blurred_at": 1782348100,
      "focused_at": 1782348115 // 15 seconds blur
    }
  ]
}
```

### **Contract B: Code Compilation Proxy (Part 2 $\leftrightarrow$ Part 3)**
*   **Method:** `POST`
*   **Endpoint:** `/api/compile`
*   **Request Schema:**
```json
{
  "language_id": 63, // Python
  "source_code": "def hello():\n    return 'world'",
  "stdin": ""
}
```
*   **Response Schema:**
```json
{
  "stdout": "world\n",
  "stderr": "",
  "status": "Accepted",
  "time": "0.015s",
  "memory": "4096KB"
}
```

### **Contract C: Socratic Mentoring Agent (Part 2 $\leftrightarrow$ Part 3)**
*   **Method:** `POST`
*   **Endpoint:** `/api/chat`
*   **Request Schema:**
```json
{
  "room_id": "string-uuid",
  "candidate_id": "string-uuid",
  "message": "I don't know why my binary search is infinite-looping",
  "active_code_state": "def binary_search(arr, val):\n    low = 0\n    high = len(arr)-1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == val:\n            return mid\n        elif arr[mid] < val:\n            low = mid\n        # high = mid was used by user causing loop"
}
```
*   **Response Schema:**
```json
{
  "dialogue_act": "INFORMATION_QUESTION",
  "cognitive_state": "CONFUSED",
  "scaffold_level": "LOW_HINT",
  "socratic_response": "Look closely at the loop boundaries inside your conditional blocks. When 'arr[mid] < val' updates 'low = mid', is there a scenario where 'low' never increases past 'mid'?"
}
```

---

## **48-Hour Hackathon Merge Checklist**

*   [ ] **Hour 12 Checkpoint:** Developer A has the React UI loading with Monaco Editor. Developer B has the Supabase tables built and auth operational.
*   [ ] **Hour 24 Checkpoint (Sync Validation):** Developer A integrates `y-supabase`. Developer B tests that updates are syncing across two browsers, and that scope locking blocks unauthorized edits.
*   [ ] **Hour 36 Checkpoint (Code & Chat Validation):** Developer B connects the Vercel endpoints to Developer C's gVisor compiler and Socratic Gemini API. Real-time compilation and AI hints should now functional in the UI.
*   [ ] **Hour 44 Checkpoint (Polish):** Run edge-case tests (simulating rate limits to verify fallback, pasting huge files to test telemetry classification, and testing multilingual chat parsing).
