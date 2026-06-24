RAS – Redrob Ambient Sandbox

Complete Backend Implementation Documentation

Table of Contents

1. Project Overview
2. System Architecture
3. Technology Stack
4. Database Schema
5. API Reference
6. Implementation Details
7. Setup & Running
8. Testing Guide
9. Security Features
10. Deployment
11. What's Next
1. Project Overview

The Problem

Traditional technical hiring is broken:

- LeetCode - style tests measure memorization, not real - world engineering
- AI video interviews introduce bias against neurodivergent and non - native speakers
- Keyword filtering rejects talented developers from Tier - 2/Tier - 3 colleges
- Static resumes don't reveal actual problem - solving ability

Our Solution

The Redrob Ambient Sandbox (RAS) is a Trust - as - a - Service (TaaS) hiring platform that:

- Replaces static tests with collaborative development sandboxes (3 - 5 candidates per

team)

- Uses an Ambient Tech Lead (ATL) – an AI agent that observes, guides, and injects

chaos

- Captures fine - grained telemetry (keystrokes, terminal commands, AI prompts, chat)
- Scores candidates on AI Collaboration Fluency and real - world engineering behavior
- Democratizes hiring by evaluating skills over labels and

supporting multilingual communication

2. System Architecture

Key Components

Component Responsibility

Express API REST endpoints, WebSocket server, business logic

Supabase PostgreSQL database, auth, real - time, RLS

Judge0 CE Sandboxed code execution (60+ languages)

Gemini 2.5 Flash - Lite Socratic AI assistant + Dialogue Act Classification

WebSocket Server Real - time telemetry streaming

Scoring Engine Offline report generation (correctness, AI fluency, integrity)

3. Technology Stack

Backend

- Node.js 18+ with TypeScript
- Express.js – REST framework
- Supabase – PostgreSQL + Auth + Realtime
- Judge0 CE – Code execution sandbox
- Google Gemini API – AI assistant
- ws – WebSocket server
- pdf - parse – PDF scanning
- morgan & winston – Logging
- helmet & cors – Security

Frontend (Teammate's responsibility)

- React / TypeScript
- Monaco Editor
- Yjs for collaboration
- Supabase Realtime
4. Database Schema (9 Tables)
4. 1 profiles

Column Type Description

id UUID (PK) Links to auth.users

email TEXT Unique

role TEXT candidate / employer / admin

full_name TEXT Display name

created_at TIMESTAMPTZ Default now()

4. 2 assessments

Column Type Description

id UUID (PK) Auto - generated

employer_id UUID (FK) From profiles

Column Type Description

title TEXT Challenge name

description TEXT Details

jd_text TEXT Raw job description

extracted_skills TEXT[] E.g., ['react', 'postgres']

seniority_level TEXT junior / mid / senior

tech_track TEXT frontend / backend / devops

max_candidates INT Default 5

4. 3 teams

Column Type Description

id UUID (PK) Auto - generated

assessment_id UUID (FK) References assessments

session_start TIMESTAMPTZ When session began

session_end TIMESTAMPTZ When session ended

status TEXT pending / active / completed / aborted

4. 4 team_members

Column Type Description

id UUID (PK) Auto - generated

Column Type Description

team_id UUID (FK) References teams

candidate_id UUID (FK) References profiles

joined_at TIMESTAMPTZ Default now()

4. 5 telemetry_events

Column Type Description

id BIGSERIAL (PK) Auto - increment

team_id UUID (FK) References teams

candidate_id UUID (FK) References profiles

event_class TEXT EV_KBD, EV_PST, EV_BLR, EV_TRM, EV_PRM, EV_ACP

event_data JSONB Full event payload

created_at TIMESTAMPTZ Default now()

4. 6 code_snapshots

Column Type Description

id BIGSERIAL (PK) Auto - increment

team_id UUID (FK) References teams

snapshot_time TIMESTAMPTZ Default now()

files JSONB {"path": "content",...}

4. 7 chat_messages

Column Type Description

BIGSERIAL

id Auto - increment

(PK)

team_id UUID (FK) References teams

candidate_id UUID (FK) References profiles

message TEXT Raw chat content

dialogue_act TEXT OFFER / REQUEST_CLARIFICATION / JUSTIFICATION / ACKNOW

cognitive_state TEXT SURE / CONFUSED / STUCK / AVOIDING_THOUGHT

telemetry_correlation NUMERIC 0 - 1 score

created_at TIMESTAMPTZ Default now()

4. 8 chaos_events

Column Type Description

id UUID (PK) Auto - generated

team_id UUID (FK) References teams

event_type TEXT DB_POOL_STARVATION, API_RATE_LIMIT, etc.

description TEXT Human - readable

severity TEXT low / medium / high

Column Type Description

triggered_at TIMESTAMPTZ Default now()

resolved_at TIMESTAMPTZ When resolved

status TEXT active / resolved / failed

response_time_ms INT Time to resolve

candidate_id UUID (FK) Who resolved it

metadata JSONB Additional context

4. 9 reports

Column Type Description

id UUID (PK) Auto - generated

team_id UUID (FK) References teams

candidate_id UUID (FK) References profiles

final_percentile NUMERIC 0 - 100

coding_correctness NUMERIC 0 - 1

ai_collaboration_fluency NUMERIC 0 - 1

keystroke_integrity NUMERIC 0 - 1

report_json JSONB Full playback report

Column Type Description

created_at TIMESTAMPTZ Default now()

4. 10 peer_reviews

Column Type Description

id UUID (PK) Auto - generated

team_id UUID (FK) References teams

reviewer_id UUID (FK) References profiles

target_id UUID (FK) References profiles

technical_contribution INT 1 - 5

communication_rigor INT 1 - 5

problem_solving_support INT 1 - 5

comments TEXT Optional feedback

created_at TIMESTAMPTZ Default now()

4. 11 resumes

Column Type Description

id UUID (PK) Auto - generated

candidate_id UUID (FK) References profiles

original_filename TEXT Uploaded file name

Column Type Description

sanitized_text TEXT Cleaned resume text

has_injection BOOLEAN Injection detected?

injection_detected_at TIMESTAMPTZ Timestamp

metadata JSONB Font sizes, color distances, etc.

created_at TIMESTAMPTZ Default now()

5. API Reference
5. 1 Authentication (/api/auth)

Method Endpoint Description Auth

POST /signup Register user

POST /signin Login

POST /signout Logout

GET /me Get current user + profile

5. 2 Assessments (/api/assessments)

Method Endpoint Description Auth

POST / Create assessment Employer

GET / List all assessments

Method Endpoint Description Auth

GET /:id Get one assessment

5. 3 Teams (/api/teams)

Method Endpoint Description Auth

POST / Create team Employer

GET /:id Get team + members

POST /:id/start Start session Employer

POST /:id/end End session Employer

GET /assessment/:assessmentId List teams by assessment Employer

5. 4 Telemetry (/api/telemetry)

Method Endpoint Description Auth

POST /ingest Ingest events (REST) Candidate

GET /team/:teamId Get telemetry for team Candidate/Employer

GET /me Get own telemetry Candidate

WS /ws?token=...&teamId=... WebSocket stream Candidate

5. 5 Code Execution (/api/execution)

Method Endpoint Description Auth

POST /run Run code

Method Endpoint Description Auth

GET /languages List supported languages

5. 6 AI Assistant (/api/ai)

Method Endpoint Description Auth

POST /ask Ask Socratic question

5. 7 Chat / Dialogue (/api/chat)

Method Endpoint Description Auth

POST /message Send chat message Candidate

GET /team/:teamId Get team messages Candidate/Employer

POST /classify Classify a message

5. 8 Chaos Events (/api/chaos)

Method Endpoint Description Auth

POST /trigger Trigger chaos event Employer

POST /resolve/:eventId Resolve chaos event Candidate

GET /team/:teamId List chaos events

GET /metrics/:teamId Get chaos metrics

GET /events List event types

5. 9 Peer Reviews (/api/peerreview)

Metho Descriptio

Endpoint Auth

d n

Submit

POST /submit peer Candidate

review

Get team

GET /team/:teamId Employer

reviews

Get

Candidate/Employe

GET /candidate/:candidateId candidate

r

reviews

Get

/calibrated/:candidateId/team/:teamI

GET calibrated

d

score

5. 10 Git Contribution (/api/git)

Method Endpoint Description Auth

POST /analyze/:teamId Run PageRank analysis Employer

GET /scores/:teamId Get influence scores

5. 11 Code Snapshots (/api/snapshots)

Method Endpoint Description Auth

POST / Save snapshot Candidate

GET /team/:teamId List snapshots Candidate/Employer

GET /:snapshotId Get one snapshot Candidate/Employer

5. 12 Scoring (/api/scoring)

Method Endpoint Description Auth

POST /score - team/:teamId Score team Employer

GET /report/:candidateId Get candidate report Candidate/Employer

GET /team/:teamId Get all team reports Employer

5. 13 Resume / HCD (/api/resume)

Method Endpoint Description Auth

POST /upload Upload resume (PDF) Candidate

GET /:candidateId Get scanned resume Candidate/Employer

GET /injections/list List injection attempts Employer

6. Implementation Details
6. 1 Ambient Tech Lead (ATL) States

State Trigger Behavior

Stalk Default Silent observation, telemetry collec

Chill High momentum (passing tests, active edits) Remains silent to preserve flow

Compiler deadlock >10 min or collaboration freeze >15

Help Socratic questioning via Gemini

min

Injects chaos events (DB pool, rate

Guide Milestone reached

etc.)

6. 2 Scoring Metrics
1. Coding Correctness – Ratio of test passes to total test executions (from terminal

telemetry)

2. AI Collaboration Fluency – Combines AI acceptance ratio, manual edits after AI,

prompt quality

3. Keystroke Integrity – Variance of inter - key flight times (natural typing = high

variance)

4. Peer Score – Bias - calibrated peer ratings (Technical Contribution + Communication +

Problem Solving)

5. Architectural Influence – PageRank - style score from Git dependency graph
6. Chaos Resilience – Chaos event resolution rate and response time

Final Percentile – Weighted combination:

math

Final = 0.25*Correctness + 0.20*AI_Fluency + 0.15*Integrity + 0.20*Peer + 0.20*Influence

6. 3 Telemetry Event Classes

Event Class Description Key Data Fields

EV_KBD Keystroke character, dwell_time_ms, flight_time_ms, file_path

EV_PST Paste paste_length, paste_hash, ast_node_count

EV_BLR Focus Loss blur_duration_ms, target_app

EV_TRM Terminal command, exit_code, stdout, stderr

EV_PRM AI Prompt prompt, model, temperature

EV_ACP AI Acceptance loc_accepted, file_path, delta_lines

7. Setup & Running
7. 1 Prerequisites
- Node.js 18+
- Supabase account (free tier)
- Google Gemini API key (free tier)
- (Optional) Judge0 API key – public endpoint works without one
7. 2 Clone & Install

bash

git clone <your - repo>

cd ras - backend

npm install

7. 3 Environment Variables

Create.env:

env

PORT=5000

NODE_ENV=development

SUPABASE_URL=https://your - project.supabase.co

SUPABASE_ANON_KEY=your - anon - key

SUPABASE_SERVICE_ROLE_KEY=your - service - role - key

GEMINI_API_KEY=your - gemini - key

GEMINI_MODEL=gemini - 2.5 - flash - lite

JUDGE0_API_URL=https://ce.judge0.com

JUDGE0_API_KEY=

CLIENT_URL=http://localhost:5173

7. 4 Run

bash

# Development (auto - reload)

npm run dev

# Production

npm run build

npm start

7. 5 Supabase Setup
1. Create a new project in Supabase
2. Run the SQL schema from docs/schema.sql (included in the project)
3. Enable Realtime for telemetry_events and chat_messages
8. Testing Guide
8. 1 Quick Flow Test

bash

# 1. Sign up employer

curl - X POST http://localhost:5000/api/auth/signup \

- H "Content - Type: application/json" \
- d '{"email":"e@test.com","password":"Test123!","full_name":"Emp","role":"employer"}'

# 2. Sign in and copy token

curl - X POST http://localhost:5000/api/auth/signin \

- H "Content - Type: application/json" \
- d '{"email":"e@test.com","password":"Test123!"}'

# 3. Create assessment (use employer token)

curl - X POST http://localhost:5000/api/assessments \

- H "Authorization: Bearer <token>" \
- H "Content - Type: application/json" \
- d '{"title":"Dev Challenge","jd_text":"React, Node,

Postgres","seniority_level":"mid","tech_track":"frontend"}'

8. 2 Run Full End - to - End

See testing/e2e.sh (you can create this script).

8. 3 WebSocket Test

js

const ws = new WebSocket('ws://localhost:5000/ws?token=<candidate - token>&teamId=<team - id>');

ws.onopen = () => ws.send(JSON.stringify({

events: [{event_class: 'EV_KBD', event_data: {key: 'a', dwell_time_ms: 85}}]

}));

ws.onmessage = (e) => console.log(e.data);

9. Security Features

Feature Implementation

Authentication Supabase Auth (JWT)

Authorization RLS policies on every table

Code Isolation Judge0 CE sandbox (network - disabled)

Prompt Injection Hybrid Cascade Detector (HCD) scans PDFs

Plagiarism Keystroke dynamics analysis (dwell/flight times)

API Rate Limiting express - rate - limit

Security Headers Helmet

CORS Restricted to CLIENT_URL

Feature Implementation

Environment.env with validation

10. Deployment
10. 1 Render (Recommended)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Build command: npm run build
5. Start command: npm start
6. Add environment variables
10. 2 Railway
1. railway init
2. railway up
3. Add environment variables in dashboard
10. 3 Vercel (Serverless)

Requires vercel.json configuration – ask if needed.

11. What's Next

Completed

- All 11 database tables with RLS
- Authentication (signup, signin, /me)
- Assessment creation with skill extraction
- Team formation & session management
- REST + WebSocket telemetry
- Judge0 code execution
- Gemini Socratic assistant
- Dialogue Act Classification
- Peer review system with bias calibration
- Chaos events (10 types)
- Git Contribution Analysis (PageRank)
- Hybrid Cascade Detector (PDF injection)
- Scoring engine (6 metrics)
- Code snapshots API

Future Enhancements

- Advanced plagiarism – GMM clustering for copy - typing detection
- Real - time scoring – Stream scores during session
- gVisor sandbox – Self - hosted isolated execution
- Redis context caching – For Gemini (90% cost reduction)
- Mobile app – For on - the - go assessments
- ATS integration – Direct sync with Greenhouse, Lever, etc.
- Multilingual UI – Full support for 30+ Indian languages
12. Contributing
1. Fork the repository
2. Create feature branch (git checkout - b feature/amazing)
3. Commit changes (git commit - m 'Add amazing feature')
4. Push (git push origin feature/amazing)
5. Open Pull Request
13. License

MIT – free for commercial and personal use.