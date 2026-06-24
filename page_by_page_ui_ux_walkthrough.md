# **Redrob Ambient Sandbox (RAS): Page-by-Page UI/UX and Functional Walkthrough**

This document details the visual style, interface layouts, and functional behavior of the platform’s web application from the perspective of both the **Candidate** and the **Hiring Manager/Recruiter**.

---

## **Design System & Aesthetics**
*   **Theme:** Modern Premium Dark Mode. Slate grey backgrounds (`#0B0F19`), dark border boundaries (`#1E293B`), and vibrant neon accents (electric teal `#0D9488` and deep indigo `#6366F1` gradients).
*   **Typography:** Google Fonts *Outfit* for headers and headings; *Inter* for body text; *Fira Code* for terminals and the code editor.
*   **Effects:** Soft glassmorphism (`backdrop-filter: blur(12px)`), thin glowing borders, and smooth transition states.

---

## **Page 1: The Landing Portal & Job Board**
*The entry point where candidates browse roles and companies that utilize the sandbox assessment funnel.*

```
+---------------------------------------------------------------------------------+
|  [Logo] Redrob Sandbox                                   [Login] [Register]     |
+---------------------------------------------------------------------------------+
|                                                                                 |
|       Assessments Redefined: Prove Your Technical Flow, Not Memorization.       |
|                                                                                 |
|   +-------------------------------------------------------------------------+   |
|   |  Search Jobs...                      [ Filter: Stack ]   [ Filter: Exp ] |   |
|   +-------------------------------------------------------------------------+   |
|                                                                                 |
|   +--------------------------+ +--------------------------+ +----------------+   |
|   | Company A | Devops Eng   | | Company B | Django Eng   | | Company C ...  |   |
|   | Stack: Docker, AWS       | | Stack: Python, Postgres  | |                |   |
|   | Assessment: Required     | | Assessment: Required     | |                |   |
|   | [Apply via Sandbox]      | | [Apply via Sandbox]      | |                |   |
|   +--------------------------+ +--------------------------+ +----------------+   |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### **UX & Interactions:**
*   **Visual Style:** Cards float slightly on hover with a teal border glow. A background mesh gradient slowly shifts color in the hero section.
*   **How it Works:** 
    1.  The candidate browses open roles.
    2.  Each card clearly states that the role mandates a **TaaS Collaborative Sandbox Assessment** instead of resume-filtering.
    3.  Clicking **"Apply via Sandbox"** slides the page transition to Page 2.

---

## **Page 2: Document Ingestion & Verification Portal**
*Where the candidate uploads their resume, and the platform scans for secure ingestion.*

```
+---------------------------------------------------------------------------------+
|  < Back to Job Board                                                            |
+---------------------------------------------------------------------------------+
|                                                                                 |
|                        Upload Your Professional Resume                          |
|                                                                                 |
|             +-----------------------------------------------------+             |
|             |             Drag and drop your PDF here             |             |
|             |                         or                          |             |
|             |                    [Browse Files]                   |             |
|             +-----------------------------------------------------+             |
|                                                                                 |
|         [ Scanning Resume for Security & prompt Injection... 65% ]              |
|                                                                                 |
|         [✔] Auto-Approved: Verified Candidate profile Created.                  |
|                                                                                 |
|         [ Select Sandbox Slot: Tomorrow 10:00 AM ]  [ Confirm Application ]     |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### **UX & Interactions:**
*   **Visual Style:** The drag-and-drop zone has a dashed border that glows indigo when a file is hovered over.
*   **How it Works:**
    1.  The candidate drops their resume PDF.
    2.  A scanning progress bar sweeps across the container.
    3.  In the background, the **Hybrid Cascade Detector (HCD)** scans the document to strip hidden text prompt injections.
    4.  The system auto-approves the candidate, parses their raw profile metadata, and prompts them to book their collaborative Stage 1 sandbox session.

---

## **Page 3: Round 1 Collaborative Sandbox IDE (90 Minutes)**
*The core collaborative workspace where the candidate team codes together under ATL guidance.*

```
+---------------------------------------------------------------------------------+
| [Logo] Django Backend Challenge             [ Run Tests ]  [ Submit ]  [ 01:22:15 ] |
+------------------------------------+--------------------------+-----------------+
| FILE TREE                          | MONACO CODE EDITOR       | COLLAB & AI     |
| - src/                             | 1: import os             | +-------------+ |
|   - models.py                      | 2: from db import connection  | | Team Chat   | |
|   - views.py                       | 3:                       | |             | |
|   - [glowing] server.js            | 4: def save_user():      | | User B: Hey | |
|                                    | 5:   # Candidate A typing| | User C: Fix | |
|                                    | 6:   pass                | |             | |
|                                    |                          | +-------------+ |
|                                    +--------------------------+ | ATL Socratic| |
|                                    | TERMINAL STDOUT / PREVIEW| |             | |
|                                    | $ npm run test           | | ATL: Look   | |
|                                    | > 3 tests passed, 1 fail | | at line 4   | |
|                                    |                          | |             | |
+------------------------------------+--------------------------+-----------------+
```

### **UX & Interactions:**
*   **Visual Style:** 3-column layout. The Monaco Editor features multiplayer cursors (each labeled with a glowing tag of the typing candidate's name). The file tree highlights which file is currently being edited by other team members.
*   **How it Works:**
    1.  The candidates read the instructions and coordinate in the **Team Chat** sidebar to delegate files.
    2.  They write code and trigger terminal execution runs via the **"Run Tests"** button.
    3.  If they remain stuck for over 10 minutes, the **ATL Socratic Chat** panel flashes, offering a conceptual question.
    4.  At the 80-minute mark, a **"System Emergency Chaos Alert"** banner drops down, requiring the team to fix a database connectivity crash before the session locks.

---

## **Page 4: The Performance & Scheduling Dashboard**
*Where candidates view their behavioral telemetry results and schedule the final stack challenge.*

```
+---------------------------------------------------------------------------------+
|  Dashboard > Assessment Results                                                 |
+---------------------------------------------------------------------------------+
|                                                                                 |
|     Congratulations! You scored in the top 10% of applicants for Company B.     |
|                                                                                 |
|   +------------------------------------+  +---------------------------------+   |
|   |       BEHAVIORAL TELEMETRY MAP     |  |       CANDIDATE LOGISTICS       |   |
|   |            Prompting               |  |                                 |   |
|   |               /\                 |  |  Round 1 Score: 92nd Percentile |   |
|   |   Context    /  \   Verification   |  |  Team Coordination: Excellent   |   |
|   |   Steering  /____\  Loop           |  |  AI Fluency Index: High         |   |
|   |             \    /                 |  |                                 |   |
|   |              \  /                  |  |  [ Schedule Round 2 Sandbox ]   |   |
|   |               \/                   |  |                                 |   |
|   |            Self-Correction         |  |                                 |   |
|   +------------------------------------+  +---------------------------------+   |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

### **UX & Interactions:**
*   **Visual Style:** Contains an interactive Radar Chart visualizing the 5 dimensions of their AI Collaboration Fluency and team communication profile.
*   **How it Works:**
    1.  The candidate checks their scores and notes where they excelled.
    2.  They click **"Schedule Round 2"** to select a time slot for their custom company codebase sandbox.

---

## **Page 5: Round 2 Stack-Specific Sandbox IDE (2 Hours)**
*A single-player, high-stress microservice sandbox tailored to the hiring company’s codebase.*

```
+---------------------------------------------------------------------------------+
| Redrob Engine Codebase                     [ Run Suite ]           [ 02:00:00 ] |
+------------------------------------+--------------------------+-----------------+
| CODE FILE LIST                     | MONACO SINGLE EDITOR     | SOCRATIC PRO    |
| - config/                          | 1: from cache import redis| [Style Check]   |
|   - settings.py                    | 2:                       | ATL: You are    |
| - api/                             | 3: def get_user_data(id):| querying DB     |
|   - endpoints.py                   | 4:   # Code goes here    | in controller.  |
|                                    | 5:                       | Refactor this.  |
|                                    +--------------------------+ +---------------+ |
|                                    | CACHE PERFORMANCE MONITOR| | system Chaos  | |
|                                    | [|||||||---------------] | | Traffic Test  | |
|                                    | Cache Hit Rate: 35%      | | Cache Misses  | |
|                                    | DB Query Time: 215ms     | | detected!     | |
+------------------------------------+--------------------------+-----------------+
```

### **UX & Interactions:**
*   **Visual Style:** The center-bottom pane features a real-time **Cache Performance Monitor** displaying hit/miss rates as the simulation runs. The right column holds the company style guides and the Gemini 2.5 Pro-powered ATL agent.
*   **How it Works:**
    1.  The candidate works independently to solve a microservice ticket.
    2.  The **Cache Performance Monitor** alerts the candidate visually if their SQL database cache-miss rates are too high.
    3.  If they try to bypass company guidelines, the **Socratic Pro** assistant triggers inline style alerts.
    4.  At submission, the system packages their Git history, AST changes, and API tests to compile the final playback report.

---

## **Page 6: Recruiter Leaderboard & Candidate Playback Dashboard**
*The B2B hiring interface where recruiters evaluate and review candidate behaviors.*

```
+---------------------------------------------------------------------------------+
|  Redrob Recruiter Dashboard                                                     |
+---------------------------------------------------------------------------------+
|  RANK  CANDIDATE      ROUND 1    ROUND 2    INTEGRITY   ACTION                  |
|  1.    Candidate A    96%        92%        99%         [ Review Playback ]     |
|  2.    Candidate B    94%        88%        95%         [ Review Playback ]     |
|  3.    Candidate C    91%        85%        81%         [ Review Playback ]     |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  |  CANDIDATE A: VECTOR PLAYBACK & TELEMETRY AUDIT                            |  |
|  |  +---------------------------------+  +---------------------------------+  |  |
|  |  | [▶] Playback Video (2x Speed)   |  | AI PROMPT LOGS                  |  |  |
|  |  |                                 |  | 10:12 - "Create Redis handler"  |  |  |
|  |  | (Reconstructs line-by-line      |  | 10:14 - "Correct timeout err"   |  |  |
|  |  |  cursor movements and edits)    |  |                                 |  |  |
|  |  +---------------------------------+  +---------------------------------+  |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

### **UX & Interactions:**
*   **Visual Style:** A high-data-density dashboard. The Playback player utilizes lightweight vector logs (simulating typing cadences in video format) with speed toggle buttons (1x, 2x, 4x) and timeline markers highlighting focus blur events or copy-paste actions.
*   **How it Works:**
    1.  The recruiter opens the portal to see the automated candidate rankings.
    2.  Clicking **"Review Playback"** loads a candidate's file changes, chat logs, and their exact AI assistant prompting history.
    3.  The recruiter reviews their problem-solving path in minutes and clicks **"Schedule HR Interview."**
