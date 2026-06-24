# **Redrob Ambient Sandbox (RAS): Novelty Analysis, Failure Mode Mitigation, and Cost-Optimized Serverless Architecture for AI-Agentic Technical Assessment**

## **Uniqueness and Competitive Landscape**

The rapid advancement of generative artificial intelligence has altered the professional coding landscape, introducing a critical evaluation dilemma. Traditional technical assessment and screening platforms focus strictly on post-hoc evaluation, invasive cheating proctoring, and static test execution metrics.1 Conversely, collaborative development environments prioritize high-throughput multiplayer document synchronization with minimal consideration of developer authenticity or soft-skill assessment.3 The proposed system, **Redrob Ambient Sandbox (RAS)**, establishes a new paradigm at the intersection of these domains. It functions as a real-time collaborative pre-employment sandbox that uses decentralized conflict-free replicated data types (CRDTs), fine-grained developer telemetry, and active, machine-learning-driven Socratic scaffolding guided by an **Ambient Tech Lead (ATL)**.5  

Evaluating the Redrob Ambient Sandbox against the prevailing industry offerings reveals a clear structural gap. Commercial assessment platforms are designed primarily to filter candidates for enterprise hiring pipelines.1 These tools rely on heavy-handed security mechanisms—including webcam proctoring, active browser-tab lockouts, and retroactively applied plagiarism scripts—to identify cheating after it has occurred.2 While platforms like CodeSignal and HackerRank offer structured environments, their pedagogical and evaluation model is fundamentally passive.8 The environment presents a problem, the candidate writes code, and the backend evaluates correctness via deterministic test suites.8  

This evaluation-centric approach does not measure real-world collaboration. When candidates encounter obstacles, they often turn to commercial chat interfaces, copying code directly into the workspace.7 This behavior bypasses the deep cognitive processes necessary to build true software engineering competency.7  

Multiplayer text editors, such as VS Code Live Share, CodeShare, or basic WebSocket-based collaborative tools, resolve concurrent editing conflicts but lack semantic understanding of the session.3 These platforms serve as passive communication channels, transferring keystrokes across connected clients without interpreting the developer's intent, team dynamics, or behavioral trajectory.4  

RAS addresses these limitations by introducing a Socratic coaching loop directed by the **Ambient Tech Lead (ATL)** directly into the collaborative editing session.7 Instead of functioning as an answer generator, the built-in ATL agent acts as an interactive technical manager.7 It classifies candidate intent in real-time and provides calibrated, step-by-step hints, guiding questions, and conceptual scaffolds.13  

Simultaneously, RAS runs a continuous telemetry capture system that models the developer’s actions, including typing cadence, deletion patterns, copy-paste anomalies, and active editor focus shifts.5 This allows the platform to verify the authenticity of the code generation process without invasive surveillance, while providing recruiting teams with a detailed qualitative overview of a candidate's problem-solving methodology, team cohesion, and AI collaboration fluency.5

| Platform Category | Core Representatives | Primary Use Case | Evaluation Model | Plagiarism Defense Strategy | Real-Time Sync |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Technical Assessment** | CodeSignal, HackerRank, Codility 1 | High-volume corporate recruitment 8 | Passive; run-and-grade testing 8 | Webcam, browser lockouts, post-hoc similarity 2 | No; single-player workspace 8 |
| **Skills Screening** | Adaface, TestGorilla, Byteboard 1 | Initial candidate evaluation 2 | Non-interactive; multi-aptitude tests 2 | Tab tracking, copy-paste bans, IP logging 2 | No; static forms 2 |
| **Multiplayer Editors** | CodeShare, CoderPad, yjs-demos 9 | Collaborative coding, pair interviewing 8 | Unstructured; peer-to-peer execution 8 | Basic plagiarism flags 9 | Yes; WebSocket or WebRTC 4 |
| **Redrob Ambient Sandbox (RAS)** | **Proposed Architecture** | **In-context AI-collaboration & authentic assessment** | **Active; Socratic ATL coaching & chat telemetry** 7 | **Keystroke dynamics anomaly detection & focus tracking** 5 | **Yes; serverless CRDT over Supabase** 6 |

---

## **Strategic Mitigations for Structural Failure Modes**

Submitting a collaborative sandbox prototype to a hackathon requires careful consideration of potential failure points. Many educational and collaborative prototypes fail to compile or suffer from severe latency during live judging. Recognizing these risks early allows developers to implement robust technical workarounds.

### **The Cold-Start Conundrum in Free Container Hosting**
Many student projects rely on free cloud container platforms like Render or Koyeb to run persistent backend services.20 On free hosting tiers, these services automatically spin down after 15 minutes of inactivity to conserve resources.20  
When a hackathon judge loads the project, the system can suffer a 30-to-60-second cold start delay.20 In a fast-paced evaluation environment, this latency is often interpreted as a system crash.  
To mitigate this risk, RAS bypasses persistent container dependencies for its real-time sync engine.6 By using the `y-supabase` provider, the system establishes direct peer-to-peer coordination over serverless Supabase Realtime broadcast channels.6 This setup ensures an immediate connection with zero cold start delays, maintaining responsiveness even on free tiers.6

### **The Code Execution Rate-Limit Wall**
Integrating a browser-based code compilation and execution engine is a common feature in coding platforms.11 However, public APIs like Piston have updated their access policies. As of February 15, 2026, the public Piston API requires manual authorization via Discord, restricting access to low-volume use cases.23  
Similarly, public Judge0 CE endpoints on RapidAPI restrict free accounts to 2,000 requests per day, a threshold that can easily be exceeded during concurrent testing by hackathon judges and users.24 If the API key is rate-limited during a live demonstration, the core execution environment will fail.  
To ensure reliability, the backend orchestrator is configured with a dynamic fallback routing structure. If the default RapidAPI Judge0 endpoint returns a rate-limit error (HTTP status code 429), the system automatically reroutes compilation tasks to a self-hosted instance of Piston or Judge0 CE.22 This fallback container is deployed on SnapDeploy's free tier, which supports native Docker environments and auto-wakes within 10 to 30 seconds.20

### **Generative AI Quota Depletion Under Agentic Workloads**
The conversational Socratic tutoring loop requires high semantic context.7 The LLM system prompt must contain strict pedagogical rules, complete task files, reference solutions, and active candidate code.15  
Under a standard chat architecture, sending this massive payload on every keystroke or chat turn quickly exhausts API limits.26 Free-tier API quotas are highly restrictive; Google’s Gemini 2.5 Flash-Lite, for instance, enforces a daily ceiling of 1,500 requests.27 During testing, a few users engaged in continuous dialogue can deplete this quota within hours.26  
To prevent service interruptions, RAS leverages Gemini's **Explicit Context Caching**.27 By caching the heavy static context—including the system prompt, coding instructions, and reference solutions—on Google's edge nodes with an explicit 60-minute Time-To-Live (TTL), the active input token footprint is reduced by up to 90%.28 This optimization preserves daily free tier requests and ensures the application remains fully operational throughout the hackathon judging process.26

---

## **Architectural Framework of a Free Production-Grade Stack**

To construct a scalable, real-time application on a student budget, RAS uses a carefully optimized selection of free developer tiers.12 By combining these services, the platform achieves low-latency performance and high concurrency without requiring paid subscriptions.12

```
                +-------------------------------------------------+  
                |               Candidate Browser UI              |  
                |  +-------------------------------------------+  |  
                |  |           React / TypeScript UI           |  |  
                |  |   [Vite Compilation / Cloudflare Pages]   |  |  
                |  +---------------------+---------------------+  |  
                |                        |                        |  
                |  +---------------------v---------------------+  |  
                |  |            Monaco Code Editor             |  |  
                |  +---------------------+---------------------+  |  
                |                        |                        |  
                |  +---------------------v---------------------+  |  
                |  |                 Yjs CRDT                  |  |  
                |  +---------------------+---------------------+  |  
                +------------------------|------------------------+  
                                         |  
                       Sync & Telemetry  |  Real-Time Peer Broadcast  
                        (HTTPS / WSS)    |   (y-supabase Provider)  
                                         |  
                                         |  
                +------------------------v------------------------+  
                |                Supabase Backend                 |  
                |  +-------------------------------------------+  |  
                |  |             Supabase Realtime             |  |  
                |  +---------------------+---------------------+  |  
                |                        |                        |  
                |  +---------------------v---------------------+  |  
                |  |          Supabase PostgreSQL DB           |  |  
                |  +---------------------+---------------------+  |  
                |                        |                        |  
                |  +---------------------v---------------------+  |  
                |  |               Supabase Auth               |  |  
                |  +-------------------------------------------+  |  
                +------------------------+------------------------+  
                                         |  
                                         |  JSON Requests  
                                         |  & Secure Proxies  
                                         |  
                +------------------------v------------------------+  
                |           Vercel Serverless Functions            |  
                +----+----------------------------------------+---+  
                     |                                        |  
       Sandboxed     |                                        |  API Queries  
       Code Execution|                                        |  (Context Cached)  
                     |                                        |  
+--------------------v-------------------+    +---------------v--------------------+  
|          Judge0 CE Sandbox             |    |       Google AI Studio Edge        |  
|      [Network Disabled via gVisor]     |    |       [Gemini 2.5 Flash-Lite]      |  
+--------------------+-------------------+    +---------------+--------------------+  
                     |                                        |  
                     | Fallback Routing                       | Caches Static Context  
                     | (429 Rate-Limit)                       | (90% Input Discount)  
                     |                                        |  
+--------------------v-------------------+                    |  
|       Self-Hosted Piston API           |                    |  
|      [SnapDeploy Free Container]       |<-------------------+  
+----------------------------------------+
```

The system components are organized across distinct cloud providers, each selected for their generous free tiers and reliable performance 12:

*   **Frontend and Hosting Environment:** The client-side application is built using React and TypeScript, compiled via Vite, and deployed on Cloudflare Pages.12 Cloudflare Pages offers unlimited bandwidth, automatic SSL, global edge delivery, and 500 free builds per month.12 The UI is designed using Tailwind CSS components.12  
*   **Decentralized Synchronization Layer:** Collaborative multiplayer editing is achieved using Yjs, an open-source conflict-free replicated data type (CRDT) engine.4 clients sync state changes through Supabase Realtime broadcast channels.6 When a user enters a room, the binary state vector of the document is loaded from Supabase PostgreSQL storage.6 As edits are made, the binary changes are merged locally and broadcast to connected peers, with Supabase throttling database updates to optimize network usage.6  
*   **Backend API and Serverless Routing:** To avoid persistent server costs, the platform's backend operations are hosted as Vercel Serverless Functions.20 Vercel's free tier provides 100 GB-hours of execution time. These serverless functions act as secure proxy handlers, routing telemetry data, sanitizing user submissions, managing Judge0 execution contexts, and handling Gemini API calls without exposing API keys to the frontend.11  
*   **Code Execution Sandbox:** Program execution is handled by Judge0 CE, which isolates and compiles untrusted user code across 60+ runtimes.22 The platform connects to Judge0 CE via its free RapidAPI tier.22 If RapidAPI limits are exceeded, the orchestrator redirects the payload to a self-hosted Piston container running on SnapDeploy.20  
*   **Ambient Tech Lead (ATL) Engine:** The Socratic tutoring dialogue is powered by Google's Gemini 2.5 Flash-Lite.27 This model is selected for its high processing speed, extensive 1-million-token context window, and generous free-tier allocation of 1,500 requests per day.26 Gemini's native support for JSON output modes ensures robust integration with the platform's structured dialogue act classification system.17

---

## **Real-Time Developer Telemetry and Advanced Plagiarism Prevention**

To support authentic assessments and protect academic integrity, RAS runs a passive, event-driven telemetry collection engine.5 Rather than using invasive proctoring tools like webcam monitoring or strict browser-tab lockouts, the system records fine-grained events directly inside the Monaco Editor.2 This approach captures key behavioral indicators without disrupting the developer's workspace.5

```
                 Continuous Event Stream (Keystroke Dynamics)  
   [User Editing] -------------------------------------------------+  
                                                                   |  
                                                                   v  
+-----------------------------------------------------------------+  
|                    Event Parser & Classifier                    |  
|                                                                 |  
|  +-----------------------------------------------------------+  |  
|  |           INSERTION (Keystroke / Sug. Accept)             |  |  
|  |  * Captures timestamp, text length, line number           |  |  
|  +-----------------------------------------------------------+  |  
|  |                    DELETION (Backspace)                   |  |  
|  |  * Captures deletion length, backspace velocity           |  |  
|  +-----------------------------------------------------------+  |  
|  |                 COPY-PASTE (External Load)                |  |  
|  |  * Captures pasted string, original tab context           |  |  
|  +-----------------------------------------------------------+  |  
|  |                 FOCUS SHIFT (Window Blur)                 |  |  
|  |  * Captures out-of-tab timestamps and duration            |  |  
|  +-----------------------------------------------------------+  |  
+-----------------------------------------------------------------+  
                                |  
                                | Structured Event Chunks  
                                |  
+-------------------------------+---------------------------------+  
|            Keystroke Dynamics & Telemetry Engine                |  
|                                                                 |  
|  * Processes event timelines with millisecond precision         |  
|  * Analyzes key dwell time and flight time variance (KDA)      |  
|  * Flags robotic automated input and split-screen copy-typing   |  
|  * Computes the Assessment Integrity Score (I)                  |  
+-------------------------------+---------------------------------+  
                                |  
                                | Real-Time Metrics & Score  
                                |  
+-------------------------------+---------------------------------+  
|                       Vercel API Proxy                          |  
+-----------------------------------------------------------------+
```

The telemetry engine monitors and categorizes user events into four distinct types 5:
*   **Insertions:** Triggered when characters are added to the editor.5 The system records the precise timestamp, characters inserted, and current line position.5 This metric tracks typing cadence, structural progression, and code generation speed.5  
*   **Deletions:** Triggered when backspaces or block cuts remove content.5 The engine logs the deleted text, the deletion timestamp, and the duration of consecutive deletions.5 These events help map debugging behavior and identify points of confusion.5  
*   **Copy-Paste Interactions:** Logged whenever external text blocks containing more than 3 characters are introduced.5 The telemetry engine captures the exact pasted string, its length, and formatting properties.5 This helps identify anomalous blocks of code copied from external sources.2  
*   **Focus Shifts:** Triggered when the user clicks away from the editor window or switches browser tabs.5 The engine records the exact duration of the out-of-focus event in milliseconds.5 This reveals active research cycles and correlations with external lookups.5

### **The Keystroke Dynamics Solution to Second-Screen Cheating**
Candidates can bypass simple tab-focus tracking by using a second physical monitor or split-screening their OS, copy-typing code line-by-line without triggering a window blur event. To counter this, the telemetry engine evaluates **Keystroke Dynamics Analysis (KDA)**:
*   **Dwell Time ($D_t$):** The time a key is held down.
*   **Flight Time ($F_t$):** The time between releasing one key and pressing the next.

Natural human typing exhibits significant variance in flight times ($\sigma_k^2$). However:
1.  **AI Code Generation/Automation Bots:** Exhibit a flat, uniform flight time distribution (e.g., exactly 20ms between characters, $\sigma_k^2 \approx 0$).
2.  **Copy-Typing from a Second Screen:** Exhibits high, block-like pauses. The candidate reads a segment of code (resulting in a long pause of 1.5–3 seconds), followed by a rapid burst of typing, followed by another long pause. This creates a multi-modal distribution distinct from fluent, logical coding.

The telemetry engine processes these continuous events to generate an algorithmic **Assessment Integrity Score ($I$)**:

$$I = \left( 1 - \frac{P_c}{T_c} \right) \cdot e^{-\lambda \left( T_f + \sigma_k \right)}$$

Where:
*   $P_c$ is the cumulative count of characters introduced via paste events.5  
*   $T_c$ is the total character length of the active source file.5  
*   $T_f$ is the cumulative out-of-focus time logged during the session in seconds.5  
*   $\sigma_k$ is the keystroke flight-time anomaly coefficient (measuring uniformity or copy-type pauses).
*   $\lambda$ is a system-defined decay constant (typically set to $0.005$) that calibrates the impact of browser-tab switching and cadence anomalies.5

---

## **Multiplayer Sync Security & Peer Sabotage Prevention**

In a collaborative development sandbox, a major security threat is **peer sabotage**. Because Yjs merges CRDT states peer-to-peer, an adversarial team member could broadcast a massive deletion vector, wiping out their team’s entire project right before submission. 

### **Scope-Locked CRDTs (Supabase Realtime Authorization Proxy)**
To secure the collaboration layer, RAS implements **Author-Based Scope Locking** within the Yjs coordinate map:
*   **File Ownership Binding:** In the workspace database, files or directory paths are bound to specific candidate IDs (e.g., Candidate A owns `database.js`; Candidate B owns `routes.js`).
*   **Broadcast Verification:** When a client broadcasts a binary update vector over the Supabase Realtime channel, the Supabase connection proxy intercepts the update payload.
*   **Authorization Check:** The proxy checks the sender’s auth token against the file boundary mappings. If Client B attempts to send a delete vector modifying a file owned by Client A, the update is blocked, and a security warning is logged.
*   **Shared Workspace:** For shared files (like `README.md`), only non-destructive insertion vectors are permitted from multiple authors; mass-deletion updates (defined as deletions exceeding 20% of the document in a single update slice) are flagged for manual review or blocked.

---

## **Secure Sandboxed Execution (gVisor Kernel-Space Isolation)**

Running untrusted candidate code on a shared host container introduces container escape risks. If a candidate runs a malicious shell script that gains root access to the Docker daemon, they could compromise the evaluation network.

### **gVisor Container Sandbox Kernel Isolation**
To protect the self-hosted compilation endpoints (fallback Piston/Judge0 containers on SnapDeploy), RAS enforces **gVisor** kernel-space virtualization:
*   **User-Space Kernel:** gVisor runs a user-space kernel (called the "Sentry") that intercepts all system calls made by the running candidate code. Instead of executing calls directly on the host Linux kernel, the Sentry virtualizes them.
*   **Privilege Restriction:** The sandbox container runs under a strict non-root execution profile (`nobody`).
*   **Resource Cgroups:** Container CPU usage is capped at 0.5 cores, memory is restricted to 128MB, and process creation limit (pids-limit) is capped at 128 to prevent fork-bomb attacks.
*   **Network Isolation:** Outbound internet access inside the execution sandbox is entirely disabled via Docker network configuration, preventing data exfiltration or reverse-shell connections.

---

## **Agentic Socratic Dialogue and Context Caching Architecture**

RAS uses Socratic tutoring principles through the **Ambient Tech Lead (ATL)** to encourage deeper problem-solving.7 Rather than serving as an automated code generator, the system supports a guided evaluation loop.7 

```
Candidate Input ----> [Vercel API Gateway]   
                           |  
                           v  
            +------------------------------+  
            |  Dialogue Act Classifier     |  <-- Zero-Shot Prompt   
            +--------------+---------------+  
                           |  
                           v  
            Parsed Category & Cognitive State  
                           |  
                           v  
            +------------------------------+  
            |    Socratic Hint Planner     |  <-- Reference Solution Repo   
            +--------------+---------------+  
                           |  
        +-------------------+-------------------+  
        |                   |                   |  
        v                   v                   v  
             
   * Guiding           * Conceptual        * Minimal Code  
     Question            Hint                Outline  
        |                   |                   |  
        +-------------------+-------------------+  
                           |  
                           v  
            +------------------------------+  
            |   Gemini 2.5 Flash-Lite      |  <-- Explicit Context Cache   
            +--------------+---------------+  
                           |  
                           v  
                    Socratic Response
```

The platform's Socratic coaching system operates on a calibrated three-tier escalation matrix 15:
*   **Level 1 (Low Scaffold - Guiding Question):** The initial response to candidate confusion.15 The ATL avoids explaining the bug or suggesting code changes.15 Instead, it asks a targeted question designed to prompt the candidate to inspect their logic (e.g., *"What do you think happens to the index variable when the loop reaches its final iteration?"*).13  
*   **Level 2 (Medium Scaffold - Conceptual Hint):** If the candidate remains stuck, the ATL provides a conceptual explanation.13 This explains the underlying programming pattern or logical relationship without providing code syntax.13  
*   **Level 3 (High Scaffold - Minimal Code Outline):** If the candidate is still unable to progress, the ATL provides a minimal, illustrative code structure.15 This output uses generic placeholders or simplified patterns, showing the candidate how to structure their logic without directly revealing the solution.15

### **Dialogue Act Classification Module**
To ensure Socratic responses are relevant to the candidate's progress, the system first passes the candidate's input through a Dialogue Act Classification (DAC) module.17 This module categorizes the candidate's intent and cognitive state using a zero-shot prompt structure 17:

```json
{  
  "system_instruction": "You are the specialized intent classification component of an advanced Socratic technical recruitment system. Your role is to analyze the candidate's latest input, categorize its Dialogue Act (DA), and assess their current cognitive state to determine the appropriate pedagogical response.[7, 33, 34]",  
  "allowed_dialogue_acts": {  
    "GREETING": "Standard conversational pleasantries.",  
    "OBSERVATION": "The candidate describes a runtime behavior, error, or program output without asking a direct question.",  
    "CORRECTION": "The candidate explains a modification they made to their code to fix a bug.",  
    "INFORMATION_QUESTION": "The candidate asks a conceptual question about language syntax, libraries, or computer science theory.",  
    "DIRECTION_QUESTION": "The candidate asks for immediate instructions on what coding step to take next.",  
    "CONFIRMATION_QUESTION": "The candidate asks if their logic, code, or reasoning is correct.",  
    "UNDERSTANDING_FEEDBACK": "The candidate explicitly confirms they understand the previous hint or conceptual explanation."  
  },  
  "required_output_format": {  
    "dialogue_act": "STRING (Must be one of the allowed keys)",  
    "reasoning_brief": "STRING (Concise explanation of the classification)",  
    "cognitive_state": "SURE | CONFUSED | STUCK | AVOIDING_THOUGHT",  
    "recommended_scaffold_level": "LOW_HINT | MID_QUESTION | HIGH_GUIDE"  
  }  
}
```

This classification step helps the ATL engine understand how to frame its Socratic responses.33 For instance, if a candidate submits a `DIRECTION_QUESTION` seeking direct code answers, the classifier identifies this as `AVOIDING_THOUGHT` and recommends a `LOW_HINT` response, prompting the ATL to guide the candidate back to active analysis.7

### **Context Caching Optimization Setup**
To keep API usage entirely free during the hackathon, the platform implements Explicit Context Caching via Google AI Studio.27 When a coding challenge is loaded, the orchestrator constructs a static context block containing:
1.  The complete system instruction set (Socratic guidelines).
2.  The target programming challenge repository framework.
3.  The reference execution test files.

This static block is written to Gemini's context cache.28 For subsequent candidate queries, the orchestrator references this cached content, passing only the active workspace code, telemetry streams, and the latest conversation turn as dynamic variables.28 This strategy bypasses the token limits of free tiers, reduces latency, and cuts inputs costs by up to 90%.27

---

## **Architectural Data Flow and Integration Blueprint**

RAS connects multiple independent, serverless components into a unified execution flow.6 The system coordinates these services across editing, state synchronization, sandboxed code execution, and Socratic tutoring actions.6

```
+---------+         +--------+         +----------+         +--------+         +--------+         +---------+  
|Candidate|         | Monaco |         | Supabase |         | Vercel |         | Judge0 |         | Gemini  |  
| Browser |         | Editor |         | Realtime |         | Server |         | Sandbox|         | AI Edge |  
+----+----+         +----+---+         +----+-----+         +----+---+         +----+---+         +----+----+  
     |                   |                  |                    |                  |                  |  
     | Type Keystrokes   |                  |                    |                  |                  |  
     +------------------>+                  |                    |                  |                  |  
     |                   | Send Binary Sync |                    |                  |                  |  
     |                   +----------------->+                    |                  |                  |  
     |                   |                  | Verify & Sync      |                  |                  |  
     |                   |                  +------------------->+                  |                  |  
     |                   |                  |                    |                  |                  |  
     | Trigger Code Run  |                  |                    |                  |                  |  
     +---------------------------------------------------------->+                  |                  |  
     |                   |                  |                    | Execute Sandbox  |                  |  
     |                   |                  |                    +----------------->+                  |  
     |                   |                  |                    | (gVisor Kernel)  |                  |  
     |                   |                  |                    |                  |                  |  
     |                   |                  |                    | Return Outputs   |                  |  
     |                   |                  |                    +<-----------------+                  |  
     | Display Sandbox Output               |                    |                  |                  |  
     +<----------------------------------------------------------+                  |                  |  
     |                   |                  |                    |                  |                  |  
     | Request Socratic Help                |                    |                  |                  |  
     +---------------------------------------------------------->+                  |                  |  
     |                   |                  |                    | Fetch DB Context |                  |  
     |                   |                  |                    +----------------->+                  |  
     |                   |                  |                    |                  | Parse Intent (DAC)  
     |                   |                  |                    +------------------------------------>+  
     |                   |                  |                    |                  |                  |  
     |                   |                  |                    |                  | Generate Hint    |  
     |                   |                  |                    +<------------------------------------+  
     | Render Socratic Hint                 |                    |                  |                  |  
     +<----------------------------------------------------------+                  |                  |
```

The system processes three primary execution pathways to coordinate collaboration, compilation, and instruction:

1.  **Real-Time Editing and Synchronization Pathway:** As a developer edits code, the Monaco Editor intercepts keystroke events and updates the local Yjs document model.35 The `y-supabase` provider intercepts this update, serializes it into a binary update slice, and broadcasts it across active Supabase Realtime channels to other connected clients.6 Concurrently, the Supabase provider flushes the updated binary state vector to a dedicated PostgreSQL database table, ensuring document states persist reliably across browser refreshes.6
2.  **Sandboxed Code Execution Pathway:** When a developer clicks the "Run Code" button, the client-side UI serializes the source code and references its language configurations.11 This payload is routed to a Vercel Serverless Function, which acts as a proxy to forward compilation requests to the sandboxed Judge0 CE container.11 Judge0 compiles the source code inside an isolated, network-disabled gVisor container and returns the execution results (including standard output, standard error, execution time, and status codes) back to Vercel.11 Vercel processes these outputs and updates the developer UI, showing compile-time diagnostics or execution results.11
3.  **Socratic Mentoring Dialogue Pathway:** When a developer requests help from the AI tutor, the client triggers an API call to a Vercel Serverless Function.11 The function retrieves the active code state and active chat history from the Supabase database.6 It queries the Gemini 2.5 Flash-Lite API, referencing the pre-cached Socratic system instructions.27 Gemini processes the candidate's message through the Dialogue Act Classification prompt to identify their cognitive state and intent.17 The system then uses the classified intent and active code state to generate a Socratic response.15 The response is sent back to the client interface and displayed as a structured, conversational hint, helping the candidate identify the bug through targeted analysis.13

---

## **Strategic Conclusions and Hackathon Roadmap**

RAS presents an innovative, zero-cost, and scalable architecture designed for hackathons, educational environments, and technical assessments.6 By merging peer-to-peer real-time document synchronization with Socratic coaching loops and passive developer telemetry tracking, the platform addresses key hiring evaluation needs while ensuring high operational reliability.5 This architecture avoids persistent server dependencies, optimizing resource usage on free tiers and preventing API quota exhaustion.20  

The platform is designed for rapid development within a standard 36-to-48-hour hackathon timeline, structured around four distinct execution phases:

```
+---------------------------------------------------------------------------------------+  
| PHASE 1: Synchronization Layer Setup (Hours 0 - 12)                                    |  
| * Configure a Supabase project and enable Realtime Broadcast channels.  |  
| * Build the React frontend with Vite, Tailwind CSS, and Monaco Editor.[30, 36]  |  
| * Integrate the y-supabase provider to enable multiplayer editing.            |  
+---------------------------------------------------------------------------------------+  
                                           |  
                                           v  
+---------------------------------------------------------------------------------------+  
| PHASE 2: Code Execution and Telemetry Capture (Hours 12 - 24)                         |  
| * Build the Vercel API routes to proxy compilation requests to Judge0.  |  
| * Implement event listeners in Monaco to capture keystrokes, dwell times, & blur events|  
| * Configure author-based scope locking in CRDT synchronization channels.              |  
+---------------------------------------------------------------------------------------+  
                                           |  
                                           v  
+---------------------------------------------------------------------------------------+  
| PHASE 3: Socratic Tutoring Engine Integration (Hours 24 - 36)                         |  
| * Set up Google AI Studio and configure Gemini 2.5 Flash-Lite.                        |  
| * Write Socratic prompt templates and the Dialogue Act Classifier.                    |  
| * Implement Explicit Context Caching to optimize token and API usage.                 |  
+---------------------------------------------------------------------------------------+  
                                           |  
                                           v  
+---------------------------------------------------------------------------------------+  
| PHASE 4: Refinement, Verification, and Deployment (Hours 36 - 48)                     |  
| * Set up gVisor kernel virtualization for self-hosted execution fallback.             |  
| * Deploy the compiled frontend directly to Cloudflare Pages.                          |  
| * Verify fallback compilation configurations to ensure operational uptime.            |  
+---------------------------------------------------------------------------------------+
```

By completing this roadmap, developers can build an interactive, production-ready platform that stands out for its technical execution, security infrastructure, and pedagogical novelty.6

#### **Works cited**

1. Top 10 Byteboard Alternatives & Competitors in 2026 - G2, accessed June 21, 2026, [https://www.g2.com/products/byteboard/competitors/alternatives](https://www.g2.com/products/byteboard/competitors/alternatives)  
2. Top 10 Byteboard Alternatives & Competitors to Consider, accessed June 21, 2026, [https://www.adaface.com/byteboard-alternatives/](https://www.adaface.com/byteboard-alternatives/)  
3. Tutorial : Make a Real-Time Code-Editor in React using yjs (Code-N-Collab) - Mohd Athar, accessed June 21, 2026, [https://atharmohammad.medium.com/tutorial-make-a-real-time-code-editor-in-react-using-yjs-code-n-collab-d843fad6661](https://atharmohammad.medium.com/tutorial-make-a-real-time-code-editor-in-react-using-yjs-code-n-collab-d843fad6661)  
4. Some notes on editor frameworks (eg. Monaco, Lexical, Codemirror, etc) + collaborative editing/conflict resolution technologies (eg. OT, CRDT, etc) - Gist, accessed June 21, 2026, [https://gist.github.com/0xdevalias/2fc3d66875dcc76d5408ce324824deab](https://gist.github.com/0xdevalias/2fc3d66875dcc76d5408ce324824deab)  
5. CodeWatcher: IDE Telemetry Data Extraction Tool for Understanding Coding Interactions with LLMs - arXiv, accessed June 21, 2026, [https://arxiv.org/html/2510.11536v1](https://arxiv.org/html/2510.11536v1)  
6. supabase-community/y-supabase: A Yjs connection provider that enables real-time collaboration through Supabase Realtime - GitHub, accessed June 21, 2026, [https://github.com/supabase-community/y-supabase](https://github.com/supabase-community/y-supabase)  
7. SocraticAI: Transforming LLMs into Guided CS Tutors Through Scaffolded Interaction - arXiv, accessed June 21, 2026, [https://arxiv.org/html/2512.03501](https://arxiv.org/html/2512.03501)  
8. Top Byteboard alternatives for technical hiring in 2026 - CodeSignal, accessed June 21, 2026, [https://codesignal.com/blog/top-byteboard-alternatives-for-technical-hiring-in-2026/](https://codesignal.com/blog/top-byteboard-alternatives-for-technical-hiring-in-2026/)  
9. The 20 Best Online Coding Interview Tools [Updated for 2026] - CodeSubmit, accessed June 21, 2026, [https://www.codesubmit.io/blog/online-coding-interview-tools?](https://www.codesubmit.io/blog/online-coding-interview-tools)  
10. Top Coding Interview Platforms 2026 - HackerEarth, accessed June 21, 2026, [https://assessment.hackerearth.com/blog/top-coding-interview-platforms-2026](https://assessment.hackerearth.com/blog/top-coding-interview-platforms-2026)  
11. Implementation Documentation: Judge0 in Frontend Projects | by Victor C Okoye | Medium, accessed June 21, 2026, [https://medium.com/@victor.c.okoye/implementation-documentation-judge0-in-frontend-projects-58a14a68e3fa](https://medium.com/@victor.c.okoye/implementation-documentation-judge0-in-frontend-projects-58a14a68e3fa)  
12. The Best AI Coding Tool Stack for Students in 2026 - Vibe Coder Blog, accessed June 21, 2026, [https://blog.vibecoder.me/best-ai-coding-tool-stack-for-students-2026](https://blog.vibecoder.me/best-ai-coding-tool-stack-for-students-2026)  
13. The Socratic Method Meets Machine Learning: How AI Tutoring Tools Are Teaching Students to Think, Not Just Answer, accessed June 21, 2026, [https://www.evelynlearning.com/blog/the-socratic-method-meets-machine-learning-how-ai-tutoring-tools-are-teaching-students-to-think-not-just-answer](https://www.evelynlearning.com/blog/the-socratic-method-meets-machine-learning-how-ai-tutoring-tools-are-teaching-students-to-think-not-just-answer)  
14. Best Node.js WebSocket Libraries Compared - Velt, accessed June 21, 2026, [https://velt.dev/blog/best-nodejs-websocket-libraries](https://velt.dev/blog/best-nodejs-websocket-libraries)  
15. GitHub - benrosche/socratic-tutor-public: A Socratic AI tutor for VS Code that hints instead of solving, accessed June 21, 2026, [https://github.com/benrosche/socratic-tutor-public](https://github.com/benrosche/socratic-tutor-public)  
16. Experiment (Ep 10): I built an AI tutor. The kids immediately tried to cheat. - Reddit, accessed June 21, 2026, [https://www.reddit.com/r/notebooklm/comments/1s60ckt/experiment_ep_10_i_built_an_ai_tutor_the_kids/](https://www.reddit.com/r/notebooklm/comments/1s60ckt/experiment_ep_10_i_built_an_ai_tutor_the_kids/)  
17. Act2P: LLM-Driven Online Dialogue Act Classification for Power Analysis - ACL Anthology, accessed June 21, 2026, [https://aclanthology.org/2025.findings-acl.1052.pdf](https://aclanthology.org/2025.findings-acl.1052.pdf)  
18. From Git Log to Insights: Evaluating Team Contributions in GitHub Projects | by Chan Meng, accessed June 21, 2026, [https://chanmeng666.medium.com/from-git-log-to-insights-evaluating-team-contributions-in-github-projects-aca645b45ef1](https://chanmeng666.medium.com/from-git-log-to-insights-evaluating-team-contributions-in-github-projects-aca645b45ef1)  
19. Monaco - Yjs Docs, accessed June 21, 2026, [https://beta.yjs.dev/docs/ecosystem/editor-bindings/monaco/](https://beta.yjs.dev/docs/ecosystem/editor-bindings/monaco/)  
20. 7 Free Backend Hosting Platforms for APIs — Tested [2026] - SnapDeploy, accessed June 21, 2026, [https://snapdeploy.dev/blog/free-backend-hosting-2026-apis-servers](https://snapdeploy.dev/blog/free-backend-hosting-2026-apis-servers)  
21. Platforms with a real free tier for developers in 2026 - Render, accessed June 21, 2026, [https://render.com/articles/platforms-with-a-real-free-tier-for-developers-in-2026](https://render.com/articles/platforms-with-a-real-free-tier-for-developers-in-2026)  
22. Judge0 CE - API Docs, accessed June 21, 2026, [https://ce.judge0.com/](https://ce.judge0.com/)  
23. engineer-man/piston: A high performance general purpose code execution engine. - GitHub, accessed June 21, 2026, [https://github.com/engineer-man/piston](https://github.com/engineer-man/piston)  
24. Judge0 - Code Execution Made Simple for Every Business, accessed June 21, 2026, [https://judge0.com/](https://judge0.com/)  
25. Code runner with Piston - Pedro Netto, accessed June 21, 2026, [https://pnetto.com/logs/code-runner/](https://pnetto.com/logs/code-runner/)  
26. Gemini API Free Tier 2026: Limits, Quotas, and More - PE Collective, accessed June 21, 2026, [https://pecollective.com/tools/gemini-free-tier-guide/](https://pecollective.com/tools/gemini-free-tier-guide/)  
27. Gemini API Pricing: Free Tier + Caching $0.50/M Read (May 2026) | FindSkill.ai — Learn AI for Your Job, accessed June 21, 2026, [https://findskill.ai/blog/gemini-api-pricing-guide/](https://findskill.ai/blog/gemini-api-pricing-guide/)  
28. Context caching overview | Gemini Enterprise Agent Platform | Google Cloud Documentation, accessed June 21, 2026, [https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/context-cache/context-cache-overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/context-cache/context-cache-overview)  
29. Best Free Developer Tools in 2026: The Complete Guide - DEV Community, accessed June 21, 2026, [https://dev.to/_d7eb1c1703182e3ce1782/best-free-developer-tools-in-2026-the-complete-guide-1i7h](https://dev.to/_d7eb1c1703182e3ce1782/best-free-developer-tools-in-2026-the-complete-guide-1i7h)  
30. ‍ CoDevSpace – Real-Time Collaborative Code Editor & Execution Engine - GitHub, accessed June 21, 2026, [https://github.com/dev-ankit-mishra/collab-code-editor](https://github.com/dev-ankit-mishra/collab-code-editor)  
31. Yjs Docs: Introduction, accessed June 21, 2026, [https://docs.yjs.dev/](https://docs.yjs.dev/)  
32. Rate limits | Gemini API - Google AI for Developers, accessed June 21, 2026, [https://ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits)  
33. A Tutorial Dialogue System for Real-Time Evaluation of Unsupervised Dialogue Act Classifiers: Exploring System Outcomes - LearnDialogue, accessed June 21, 2026, [https://learndialogue.org/pdf/LearnDialogue-EzenCan-AIED-2015.pdf](https://learndialogue.org/pdf/LearnDialogue-EzenCan-AIED-2015.pdf)  
34. Get started with a Monaco code editor using Liveblocks and React | Quickstart, accessed June 21, 2026, [https://liveblocks.io/docs/get-started/yjs-monaco-react](https://liveblocks.io/docs/get-started/yjs-monaco-react)  
35. Make your Monaco editor collaborative in minutes - Liveblocks, accessed June 21, 2026, [https://liveblocks.io/technology/collaborative-monaco-editor](https://liveblocks.io/technology/collaborative-monaco-editor)  
36. 50 AI Hackathon Project Ideas for 2026 That Judges Actually Love - Reskilll Blogs, accessed June 21, 2026, [https://blogs.reskilll.com/50-ai-hackathon-project-ideas-for-2026-that-judges-actually-love/](https://blogs.reskilll.com/50-ai-hackathon-project-ideas-for-2026-that-judges-actually-love/)
37. Redrob AI & TechGraph. (2026). *Redrob AI Launches Professional AI Platform for India's Workforce*. TechGraph. [https://techgraph.co/ai/redrob-ai-launches-professional-ai-platform-for-india-workforce/](https://techgraph.co/ai/redrob-ai-launches-professional-ai-platform-for-india-workforce/)