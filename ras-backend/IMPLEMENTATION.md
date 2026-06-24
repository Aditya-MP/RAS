# RAS – Redrob Ambient Sandbox
## What We Built — Implementation Summary

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ with TypeScript |
| Framework | Express.js v5 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| AI | Google Gemini 2.5 Flash Lite |
| Code Execution | Judge0 CE |
| Real-time | WebSocket (ws) + Supabase Realtime |
| PDF Scanning | pdf-parse |
| File Upload | Multer |

---

## Database — 11 Tables

| Table | Purpose |
|---|---|
| `profiles` | User accounts (candidate / employer / admin) |
| `assessments` | Job challenges created by employers |
| `teams` | Group of candidates assigned to an assessment |
| `team_members` | Links candidates to teams |
| `telemetry_events` | Every action during session (keystrokes, terminal, AI) |
| `code_snapshots` | Periodic file snapshots for Git analysis |
| `chat_messages` | Team chat with dialogue classification |
| `peer_reviews` | Candidate ratings of teammates |
| `chaos_events` | Injected failures and resolution tracking |
| `reports` | Final scored reports per candidate |
| `resumes` | Uploaded PDFs with injection scan results |

All tables have **Row Level Security (RLS)** — candidates can only see their own data, employers can only see their own assessments.

---

## API — 13 Route Groups

### Authentication `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register with role (candidate/employer) |
| POST | `/signin` | Login, returns JWT access token |
| POST | `/signout` | Logout |
| GET | `/me` | Get current user + profile |

### Assessments `/api/assessments`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create assessment — auto-extracts skills from JD via Gemini |
| GET | `/` | List assessments |
| GET | `/:id` | Get single assessment |

### Teams `/api/teams`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create team with candidates |
| GET | `/:id` | Get team + members |
| POST | `/:id/start` | Start session → status becomes active |
| POST | `/:id/end` | End session → triggers scoring |
| GET | `/assessment/:assessmentId` | List teams by assessment |

### Telemetry `/api/telemetry`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ingest` | Batch ingest telemetry events (REST) |
| GET | `/team/:teamId` | Get all telemetry for a team |
| GET | `/me` | Get own telemetry |
| WS | `/ws?token=&teamId=` | Real-time WebSocket stream |

**Event Classes:**
- `EV_KBD` — Keystroke with dwell/flight timing
- `EV_PST` — Paste event with length and hash
- `EV_BLR` — Window blur (candidate switched app)
- `EV_TRM` — Terminal command + exit code
- `EV_PRM` — AI prompt sent
- `EV_ACP` — AI suggestion accepted

### Code Execution `/api/execution`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/run` | Run code via Judge0 (60+ languages) |
| GET | `/languages` | List supported languages |

### AI Assistant `/api/ai`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ask` | Socratic response via Gemini — never gives direct answers |

### Chat + Dialogue `/api/chat`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/message` | Send message → auto-classified by Gemini |
| GET | `/team/:teamId` | Get all messages for a team |
| POST | `/classify` | Classify a message without storing |

**Dialogue Acts:** `OFFER` / `REQUEST_CLARIFICATION` / `JUSTIFICATION` / `ACKNOWLEDGMENT`

**Cognitive States:** `SURE` / `CONFUSED` / `STUCK` / `AVOIDING_THOUGHT`

### Peer Reviews `/api/peerreview`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/submit` | Submit peer review (1-5 on 3 dimensions) |
| GET | `/team/:teamId` | All reviews for a team |
| GET | `/candidate/:candidateId` | Reviews for a candidate |
| GET | `/calibrated/:candidateId/team/:teamId` | Bias-adjusted score |

### Chaos Events `/api/chaos`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/trigger` | Inject a chaos event (employer only) |
| POST | `/resolve/:eventId` | Mark resolved (candidate) |
| GET | `/team/:teamId` | List all chaos events |
| GET | `/metrics/:teamId` | Resolution rate + avg response time |
| GET | `/events` | List all 10 event types |

**10 Chaos Types:** `DB_POOL_STARVATION` / `API_RATE_LIMIT` / `STALE_CACHE` / `SLOW_QUERY` / `OOM` / `DEADLOCK` / `CORS` / `S3_PERMISSION` / `PORT_COLLISION` / `K8S_BOOT_LOOP`

### Git Contribution `/api/git`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/analyze/:teamId` | Run PageRank analysis on snapshots |
| GET | `/scores/:teamId` | Get architectural influence scores |

### Code Snapshots `/api/snapshots`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Save file snapshot |
| GET | `/team/:teamId` | List snapshots |
| GET | `/:snapshotId` | Get single snapshot |

### Scoring `/api/scoring`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/score-team/:teamId` | Run full scoring engine |
| GET | `/report/:candidateId` | Get candidate report |
| GET | `/team/:teamId` | Get all team reports |

### Resume / HCD `/api/resume`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload PDF — scanned for injection attacks |
| GET | `/:candidateId` | Get scanned resume |
| GET | `/injections/list` | List all injection attempts (employer) |

---

## Scoring Engine — 6 Metrics

| Metric | Weight | How Calculated |
|---|---|---|
| Coding Correctness | 25% | Test pass/fail ratio from `EV_TRM` terminal events |
| AI Collaboration Fluency | 20% | Acceptance ratio + manual edits after AI acceptance |
| Keystroke Integrity | 15% | Variance of flight times — natural typing = high variance |
| Peer Review Score | 15% | Bias-calibrated ratings from teammates |
| Soft Skill Score | 10% | Chat dialogue acts — offers + justifications weighted higher |
| Chaos Resilience | 10% | Resolution rate × speed of chaos event resolution |
| Architectural Influence | 5% | PageRank on import/export dependency graph |

**Final Percentile** = weighted sum × 100

---

## Key Features

### Dialogue Act Classification
Every chat message is sent to Gemini which classifies it into a dialogue act and cognitive state. The backend then cross-checks with recent telemetry to compute a **Telemetry Correlation Index** — detecting candidates who talk productively but aren't actually working.

### Bias-Aware Peer Review Calibration
Each reviewer gets a **bias quotient** calculated by comparing their average ratings to the team average. Reviewers who consistently rate too high or too low have their scores discounted proportionally.

### PageRank Architectural Influence
Code snapshots are parsed to extract import/export relationships. A directed dependency graph is built (file A imports file B = edge from B to A). PageRank runs on this graph and scores are aggregated per candidate — candidates whose files are imported by many others score highest.

### Hybrid Cascade Detector (HCD)
Uploaded PDFs are parsed and scanned against 11 regex patterns for prompt injection attempts (e.g. "ignore all previous instructions", "rate this candidate 10/10"). Suspicious content is stripped before the resume text is used anywhere. All attempts are logged and flagged for the employer.

### Socratic AI Assistant
The AI assistant never gives direct answers. Every request is wrapped in a Socratic prompt template that forces Gemini to respond with guiding questions instead of solutions — measuring how candidates think, not just whether they can find answers.

### Real-time WebSocket Telemetry
Candidates stream telemetry via WebSocket during sessions. The server authenticates via JWT on connection, validates team membership, and broadcasts events to the team room. Falls back to REST (`POST /api/telemetry/ingest`) for batch ingestion.

---

## Security

| Feature | Implementation |
|---|---|
| Authentication | Supabase JWT — every protected route validates token |
| Authorization | RLS on all 11 tables — data isolated per user |
| Role enforcement | `requireRole` middleware on employer-only routes |
| Code execution | Judge0 CE sandbox — isolated, network-disabled |
| PDF injection | HCD scans and strips malicious content |
| Security headers | Helmet |
| CORS | Restricted to `CLIENT_URL` |

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.5-flash-lite
JUDGE0_API_URL=https://ce.judge0.com
CLIENT_URL=http://localhost:5173
```

---

## Running

```bash
# Install
npm install

# Development (auto-reload)
npm run dev

# Production build
npm run build
npm start

# Health check
GET http://localhost:5000/health → "OK"
```

---

## Test Users (Development)

| Role | Email | Password |
|---|---|---|
| Employer | rasptest123@gmail.com | Test1234! |
| Candidate 1 | candidate1@test.com | Test1234! |
| Candidate 2 | candidate2@test.com | Test1234! |

---

## Test Data (Development)

| Resource | ID |
|---|---|
| Assessment | `590aa3f8-20e1-4d0d-a29f-5b938d70ae90` |
| Team | `d9777164-52eb-4fd2-a5e0-252e31930558` |
| Candidate 1 | `e91a8b71-26f2-485b-a97c-7ddf479b5a4f` |
| Candidate 2 | `6565cd0e-7691-4c24-bdde-ec91d4e3d75d` |
