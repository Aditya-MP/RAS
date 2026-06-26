# Engineering Autonomous Recruitment:

# Transitioning Collaborative Technical

# Assessments to Multi-Agent AI

# Orchestration

Traditional technical assessment methodologies frequently impose significant manual overhead on hiring teams while failing to accurately capture the nuances of developer

1

behavior. In a standard evaluation cycle, engineering leaders must manually draft role-specific challenges, coordinate schedules, manage applicant pipelines, and observe live coding

2

sessions to evaluate teamwork and soft skills. This high level of manual involvement introduces operational bottlenecks, limits the scalability of the hiring process, and increases the likelihood

2

of human bias.

The transition to a fully autonomous, agentic technical recruitment platform eliminates these

2

manual touchpoints. By replacing manual triggers with a network of coordinating artificial intelligence agents, the recruitment lifecycle becomes a self-orchestrating, event-driven

3

pipeline.

This report outlines a comprehensive architecture to transition a collaborative, high-touch recruitment workflow into an automated system. It provides an analysis of legacy process bottlenecks, maps out an agent-driven architectural framework, evaluates the collaborative core technology stack, and defines the mathematical and telemetry structures required to

1

evaluate human-AI collaboration fluency and typing biometrics.

## Comparative Analysis of Recruitment Workflows

Evaluating the operational efficiency of the recruitment workflow reveals that manual intervention points—such as closing postings, coordinating interview times, and live-watching

2

candidates—severely limit throughput. Transitioning these manual actions to an autonomous multi-agent state machine removes administrative friction while maintaining rigorous standards

2

of evaluation.

Legacy Recruitment Flow Re-Engineered Core Automation (Manual Framework) Recruitment Flow Mechanism

(Autonomous Framework)

Manual Posting Close: The Event-Driven Intake Cap: State monitoring systems hiring manager must The Application Review match candidate profiles manually monitor applicant Agent tracks applicant against minimum semantic

volumes and click "Close volumes and triggers a qualifications (Posting" when a sufficient state transition to close the

).

pool is established. posting once a target

threshold is met.

Manual Schedule Calendar API Negotiation: Cal.com API-first Request: The hiring The Scheduling Agent scheduling combined with manager inputs specific negotiates meeting times Nylas multi-provider time slots (e.g., "Tomorrow directly with candidates, calendar integration to at 3:00 PM") and finding overlapping manage timezone

7

broadcasts invitation emails availability among all differences.

3 3

to candidates. participants.

Delayed Task Scaffolding: Proactive Challenge Generative LLMs parse the An LLM reads the React Scaffolding: Upon role job description, using Native job description only creation, the Job Creation abstract syntax trees to after the round is manually Agent compiles the build custom unit tests and

11

triggered, creating starter description into sandbox environments.

3

files on the fly. requirements, generating

challenges and test suites

3

immediately.

Manual Room Asynchronous Room Server-Sent Events (SSE) Coordination: Candidates Provisioning: The trigger dynamic room must wait for a manually Engagement Agent creation and generate shared Chamber UID and manages candidate secure workspace links

3

copy-paste it to enter the communications, automatically.

3

collaborative space. dispatching dynamic

workspace access links via

3

SMS and email.

Active Live Monitoring: Passive Telemetry and Monaco Editor event The hiring manager must Replay: The platform interceptors combine with observe the live coding silently logs candidate real-time keystroke session in real-time to actions, and the AI dynamics and AI manually evaluate Evaluator analyzes collaboration velocity

3 1

teamwork and soft skills. collaboration and integrity analysis.

1

metrics out-of-band.

Manual Score Evaluation: Threshold-Based Algorithmic The hiring manager Advancement: The multi-dimensional score manually reviews code platform automatically

contributions and decides aggregates candidate

synthesis () ranks

who moves forward to the metrics and advances top

3 candidates and updates the

final round. performers based on

3 ATS.

objective thresholds.

## Technical Architecture of the Collaborative

## Assessment Chamber

To assess candidate capabilities under realistic conditions, the live evaluation chamber must

16

mirror a professional development environment. The architecture relies on an integrated browser-based IDE coupled with real-time collaboration engines, sandboxed compilation, and

1

out-of-band telemetry logging.

[Monaco Editor Interface (Client)]

│

┌───────────────────────┴───────────────────────┐ ▼ (Local Input Sync) ▼ (Telemetry Logging)

│ │ (WebSocket Sync) (Secure WebSocket) ▼ ▼

│ │ ▼ ▼ [AI Evaluator & Grader Agent]

- Nix Package Manager - Keystroke Dynamics Classifier
- Judge0 Execution API - Collaboration Fluency Index
- Jest & Maestro Test Suites - Unified Score Aggregator

The unified technology stack for the live collaborative assessment chamber is detailed in the table below:

Layer Recommended Technical Rationale

Technology

Frontend Editor Monaco Editor (React / Delivers a developer

TypeScript wrapper) experience identical to

Visual Studio Code, complete with native IntelliSense, syntax highlighting, and

6

customizable keybindings.

Collaboration Engine Yjs CRDTs via Node.js Moving beyond simple raw

6

WebSocket Server WebSocket message

broadcasts, Yjs Conflict-Free Replicated Data Types (CRDTs) provide decentralized, conflict-free, sub-50ms synchronization with separate undo/redo

6

stacks.

18

System Virtualization Nix Package Manager Nix ensures highly

reproducible development environments, installing system packages and multiple language runtimes on-demand via declarative

18

configuration files.

Sandboxed Execution Docker Containers Code execution is isolated

combined with Judge0 API within transient,

3

or local Epicbox resource-constrained,

non-privileged Docker containers, neutralizing malicious system calls while

6

running tests.

Terminal Streaming Node-PTY Shell Wrapper & Renders a fully functional,

1

xterm.js interactive terminal in the

browser, capturing stdout, stderr, exit codes, and

1

execution timestamps.

## Real-Time Synchronization with Yjs and WebSockets

Traditional shared editors that rely on centralized locking or HTTP polling suffer from substantial

synchronization lag and high bandwidth consumption. The collaborative chamber utilizes a persistent TCP connection via WebSockets to bind Monaco instances to a shared Yjs document.

Because Yjs is built on CRDT math, conflict resolution is computed entirely on the client,

6

minimizing the synchronization payload to roughly 1 KB per document edit. This enables multiple candidates to co-author code in real-time with latency consistently below 100

20

milliseconds.

## Automated Challenge Scaffolding and Dynamic

## Sandbox Setup

To scale the technical evaluation of a role—such as a Senior React Native Developer—the platform must programmatically compile and run test suites within isolated container

24

environments.

The Job Creation Agent converts the core job description into a structured directory template,

3

generating starter code files and comprehensive test cases. For a React Native application, the agent constructs an environment that includes both static syntax checkers and dynamic

27

verification suites.

JSON {"challenge_metadata": {"track": "React Native", "seniority": "Senior", "target_files":

}, "required_packages": {"react-native": "0.74.0", "@testing-library/react-native": "12.5.0", "jest": "29.7.0"}}

## Static Analysis and Code Quality Verifications

Before running dynamic tests, the platform triggers a static code-quality check directly on the AST:

● Lexical and Syntax Parsing: The environment runs ESLint, analyzing the structure of the React Native components to flag common issues like unused variables, missing imports, or syntax violations.

● SonarQube Quality Gate: The code is scanned by SonarScanner to evaluate code complexity, find duplicate logic blocks, identify security vulnerabilities (such as

26

hardcoded API keys), and ensure compliance with coding standards.

## Dynamic Testing with Jest and Maestro

Once candidates submit their solution, the platform runs automated testing frameworks inside

3

the sandboxed container:

1. Unit and Integration Testing (Jest): The sandbox executes Jest test cases to verify

24

business logic and component behavior. These tests run in memory, mock external API

24

endpoints, and simulate user interactions via React Native Testing Library (RNTL):

TypeScript import {render, fireEvent} from '@testing-library/react-native';

import UserProfile from '../UserProfile';

it('verifies that the update button updates text styling on submit', () => {const mockUpdate = jest.fn();

const {getByTestId} = render(<UserProfile onUpdate={mockUpdate} />);

fireEvent.changeText(getByTestId('username-input'), 'Maya');

fireEvent.press(getByTestId('update-button'));

expect(mockUpdate).toHaveBeenCalledWith({username: 'Maya'});

});

2. End-to-End (E2E) UI Testing (Maestro): To verify layout behaviors and multi-step user

24

flows, the container boots a headless virtual emulator. Maestro parses the view

24

hierarchy and executes testing sequences defined in YAML:

YAML appId: com.assessment.reactnative ---

- launchApp
- assertVisible: "welcome-header"
- tapOn: "username-input"
- inputText: "Alex"
- tapOn: "submit-button"
- assertVisible: "dashboard-container"

Maestro then outputs comprehensive execution logs and view-hierarchy details to the grading engine.

## Telemetry Capture and Behavioral Scoring Models

A primary challenge of technical recruitment is capturing actual development behavior without resorting to invasive proctoring techniques. The platform implements a proxy daemon directly in the sandboxed runtime to capture event streams, mapping candidate actions to robust

1

behavioral and performance metrics.

Key telemetry logging specifications are detailed in the table below:

Telemetry Event Sample Frequency Captured Metrics Technical Logging Type & Trigger & Data Fields Mechanism

EV_KBD (Keystroke Continuous, Key character Intercepts native Dynamics) event-driven codes, modifier key keydown and keyup

(sampling states (Shift, Ctrl, events in Monaco

1

resolution < 1 ms). Cmd), Editor, buffering up

keydown/keyup to 50 entries before timestamps, cursor dispatching binary

1

coordinates, and frames.

1

active file path.

EV_PST (Paste Event-triggered Length of pasted Uses Monaco Event) upon clipboard text string, SHA-256 Editor's paste event

1

operation. hash of clipboard handler, blocking

payload, active file default browser target cursor paste behavior to coordinates, and extract pasted block AST meta-attributes

1 1

node count. before streaming.

EV_BLR (Focus Event-triggered Total blur duration Window object Loss) upon window focus in milliseconds, focus and blur

1

state transition. target application listeners capture

frame name, tab switching and current active tab application context

1

index, and blur changes.

start/end

1

timestamps.

EV_TRM (Terminal Event-triggered Executed command Wrapped PTY shell Executions) upon terminal strings, called execution streams

process binary parameters, capture exit

termination. stdout and stderr lifecycles directly

output streams, within the container exit sandboxed codes, and total run runtime.

1

duration.

EV_PRM (AI Event-triggered Complete prompt A local API proxy Assistant Prompts) upon query strings, LLM intercepts calls to

1

submission. parameters, active the assistant before

file context routing them to the

1

reference URIs, and model service.

highlighted cursor

1

selections.

EV_ACP (AI Code Event-triggered Length of Monaco inline Acceptances) upon editor autocomplete suggestion and

autocomplete insertion, accepted autocompletion

1

insertion. code delta diff providers map code

block, lines of code insertions to file accepted (system change

1

events.

), and

duration before

1

editing.

## AI Collaboration Fluency Index ()

Evaluating technical talent in an environment where AI assistant tools are ubiquitous requires

1

measuring human-AI interaction fluency rather than syntax recall. The platform implements an

AI Collaboration Fluency Index () which balances the candidate's reliance on AI

1

suggestions against their active code verification and debugging behavior:

Where:

● (AI Dependency Ratio): Quantifies the scale of AI-generated code relative to manual changes:

Where represents the total lines of code inserted directly from the AI

assistant, is the subset of those lines subsequently deleted during

refactoring, is the cumulative lines added to the codebase, and is a

1

mathematical stabilizer preventing division-by-zero.

● (Verification Loop Velocity): Measures how actively a developer validates

1

their environment:

Where is the count of local test executions, is the count of debugging

operations (e.g., console logs or debug configurations), represents the

volume of manual edits within files containing AI suggestions, and is the active

1

development time in hours. The hyperbolic tangent () function scales the velocity

1

metric to a bounded, non-linear interval.

● (Self-Correction Rate): Evaluates a candidate's capacity to intercept AI

1

hallucinations and compilation errors:

Where represents occurrences where accepted AI

blocks trigger compilation or test failures, and

1

represents the subset of those issues manually resolved by the candidate.

● (Context Steering Fluency): Quantifies whether candidates selectively reference specific, scoped code blocks in prompts rather than overloading the model context window.

● Weights: Standardized empirical weight parameters are defined as,

,, and.

## Keystroke Dynamics Analysis for Plagiarism and Injection Detection

1

Using raw keystroke events (EV_KBD), the system calculates two kinetic timing features:

1

1. Dwell Time (): The duration a key is held down:

1

2. Flight Time (): The interval between consecutive key presses:

These measurements are analyzed on a 50-keystroke sliding window, categorizing typing

1

patterns into three distinct behaviors:

● State 1: Fluent Coding (Manual Composition): Typists pause at syntactic and semantic

1

boundaries (e.g., variable declarations or bracket openings) due to cognitive chunking.

1

The inter-key delay is modeled via a multi-modal Gaussian Mixture Model (GMM):

Where and represent the unique kinetic signature of the candidate, and

1

represents the mixing proportion of each cognitive typing state.

● State 2: Copy-Typing (Visual Duplication): When copying code from an external

1

monitor or physical document, semantic boundary pauses disappear. Typing is instead

1

interrupted by regular, extended visual lookup intervals:

Where represents average copying flight time, is the context-switching

frequency, and models the visual lookup interval, typically bounded

between and.

● State 3: Automated Script Injection: Automated macro tools or virtual keyboard

emulators exhibit deterministic execution, lacking natural physiological muscle variance.

This behavior is modeled via a Dirac delta function:

1

Where is a constant delay parameter. If the script attempts to introduce random jitter

1

to mimic a human, a highly peaked, low-variance Gaussian distribution is observed:

1

Where approaches negligible variance, exposing the automated input.

## Multi-Dimensional Evaluation Matrix and Autonomous

## Decisioning

To provide B2B clients with a unified talent signal, the platform compiles diverse behavioral,

1

structural, and performance metrics into a single, global percentile score ():

The component percentiles () are calculated by mapping raw metric values to their

corresponding Cumulative Distribution Functions () based on the platform's historical candidate dataset:

The weights are distributed to balance functional correctness, code execution speed,

1

collaboration fluency, and integrity verification:

● Coding Correctness (): Weight. Measures the percentage of

1

unit and integration tests passed, scaled by test difficulty.

● AI Collaboration Fluency (): Weight. Evaluates human-AI synergy and active verification behavior.

● Code Execution Performance (): Weight. Measures computational performance metrics (execution speed and memory footprint) of the submitted code

inside the sandbox environment.

● Keystroke Integrity (): Weight. The statistical probability that typing behavior represents manual coding rather than copy-typing or automated

1

injections.

## Cognitive Collaboration Classification

28

The platform uses these metrics to map candidates to distinct collaboration profiles. This classification categorizes developer behaviors based on their interaction patterns with the AI

28

assistant.

[High Conceptual Verification]

▲ │

[Generation-then-Comprehension] (Optimal)

│

[Low Automation] ──────────────┼──────────────► [High Automation]

│

(Cognitive Decay)

│ ▼

(Inefficient)

By tracking these profiles, the platform can distinguish between candidates who use AI

1

effectively and those who rely on it as a cognitive crutch:

● Generation-then-Comprehension (Optimal): These candidates use AI to scaffold

28

structures and then verify the code by asking clarifying questions. This pattern indicates

28

strong conceptual understanding, resulting in clean, verified code submissions.

● Progressive AI Reliance (Cognitive Decay): These candidates start with manual input

28

but gradually delegate all code writing to the AI. They fail to verify the outputs, making

28

them highly susceptible to AI hallucinations.

● Iterative AI Debugging (Inefficient): These candidates delegate debugging entirely to

28

the AI, moving in slow, iterative circles. This pattern represents high dependency and

28

low conceptual clarity, resulting in slower task completion.

## Next-Generation Calendar Scheduling Architecture

The platform uses developer-focused scheduling APIs to eliminate manual calendar

coordination. This setup handles timezones, panel coordination, and conflict resolution automatically.

The scheduling capabilities of the leading APIs are detailed in the table below:

Feature / Criteria Cal.com API Nylas Calendar Cronofy API

API

Primary API-first booking Unified abstraction Enterprise-grade Architectural Fit infrastructure with layer for real-time calendar

7

embeddable UI multi-provider sync.

7 7

components. synchronization.

Multi-Provider Native Google, Deep Google, Bidirectional sync Integration Outlook, and Apple Exchange, and with real-time

7 sync. Office 365 enterprise

7 7

integrations. platforms.

Real-Time Server-side conflict Command-line and Real-time

7

Availability detection and API-based availability checks.

9

buffer find-time queries.

7

management.

UI Customization Built-in React Requires Out-of-the-box

Component Library custom-built UI on widgets with limited

7

("Cal Atoms"). top of API custom styling.

endpoints.

Agentic Capability Webhook triggers Autonomous Webhooks with

for booking account model for deep status logs.

7

lifecycle events. agent-owned

9

meetings.

Recommendation Selected Core Selected Retained for large

Platform: Cal.com's Integration Layer: enterprise React integration Used alongside environments with and webhook Cal.com to manage on-premise depth make it the complex email configurations.

7 7

ideal engine. routing.

## Autonomous Scheduling Engine Logic

To achieve hands-off scheduling, the Interview Scheduling Agent automates the entire booking

lifecycle:

│ ▼

[Query Interviewer Calendar Availability via Cal.com]

│ ▼

│ ▼

│ ▼

│ ▼

│ ▼

1. Availability Aggregation: When a candidate advances, the scheduling agent queries

Cal.com to pull real-time availability for the interviewers, automatically accounting for

7

pre-configured buffers, focus blocks, and timezone differences.

2. Multi-Timezone Coordination: The Nylas find-time engine maps availability across

international borders, identifying overlapping windows that align with everyone's working 8 hours.

3. Conversational Communication: Instead of sending a static booking page link, the

Engagement Agent contacts candidates via SMS or chat, suggests several optimal time

9

slots, and books the selected time directly.

4. Environment Provisioning: Once the slot is confirmed, the scheduling agent creates the

calendar event, generates the secure Chamber UID, provisions the virtual sandbox

3

container, and sends the calendar invites to all parties.

5. Real-Time Conflict Resolution: The scheduling agent continuously monitors all calendar

webhooks. If an interviewer adds a conflict (e.g., an urgent team meeting), the system detects the overlap, calculates alternative times, and automatically coordinates a reschedule with the candidate.

## Step-by-Step Implementation Roadmap

Transitioning the legacy recruitment pipeline to a fully autonomous, agentic system is structured into three iterative engineering phases.

- Implement Cal.com and Nylas API scheduling.
- Deploy Yjs WebSockets and Monaco Editor.
- Establish sandboxed environments with Docker and Judge0.

│ ▼

- Deploy telemetry proxy daemon for event logging.
- Integrate ESLint, SonarQube, and Jest/Maestro.
- Configure scoring formulas for $F_{collab}$ and $S_{global}$.

│ ▼

- Orchestrate coordinating agents via message broker.
- Automate candidate sourcing and application screening.
- Establish human-in-the-loop validation dashboards.

## Phase 1: Core Collaborative Pipeline (Weeks 1–6)

This initial phase establishes the foundational infrastructure needed to host real-time,

6

sandboxed collaborative coding sessions.

● Deploy the Shared Editor: Build a React-based Monaco Editor workspace synchronized

6

with a Node.js WebSocket server using Yjs CRDTs. This setup enables smooth,

20

multi-cursor collaborative editing with latency under 100 milliseconds.

● Implement Sandboxed Compilation: Set up transient, resource-constrained Docker

3

containers managed via the Judge0 API to compile and execute candidate code.

● Integrate Scheduling APIs: Connect Cal.com and Nylas to handle automatic booking

7

and calendar synchronization, mapping availability across timezones.

## Phase 2: Telemetry Capture and Testing Suites (Weeks 7–12)

This phase deploys the background tracking systems and automated testing frameworks inside the virtual workspace.

● Configure Telemetry Interceptors: Install event listeners in the Monaco Editor to record keystroke dynamics (EV_KBD), clipboard activity (EV_PST), window focus losses (EV_BLR), and terminal commands (EV_TRM).

● Integrate React Native Verification Tools: Set up Jest for in-memory unit tests and

24

configure Maestro E2E execution inside virtual container emulators.

● Deploy Scoring Engines: Program the telemetry processor to calculate the AI

Collaboration Fluency Index (), classify candidate typing profiles, and aggregate

1

metrics into the global percentile score ().

## Phase 3: Autonomous Multi-Agent Orchestration (Weeks 13–18)

The final phase orchestrates individual microservices into a continuous multi-agent loop,

2

minimizing the administrative work required by hiring teams.

● Implement the Event Broker: Set up Azure Service Bus or RabbitMQ to manage

3

asynchronous messaging between the specialized agents.

● Deploy Autonomous Agents: Launch the Sourcing, Application Review, Engagement, and Scheduling agents to handle candidate screening, communication, and calendar

3

booking.

● Build the Verification Dashboard: Deliver a structured dashboard for hiring managers that presents pre-screened, validated candidate shortlists along with detailed behavioral

2

reports. This changes the recruiter's role from a manual operator to a final validator,

2

creating a highly efficient, data-driven technical recruitment lifecycle.

Works cited

1. Technical Recruitment Assessment Platform Design.md
2. Autonomous Hiring Workflow | AI Agents That Deliver Shortlists in Day -

shortlistd.io, accessed on June 25, 2026, https://www.shortlistd.io/autonomous-hiring

3. Autonomous Recruitment Multi-Agent AI Systems Orchestrating End-to-End

Hiring - Everest Consultants Inc., accessed on June 25, 2026, https://everestinc.com/autonomous-recruitment-multi-agent-ai-systems-orchest rating-end-to-end-hiring/

4. Agentic AI: Your Autonomous Partner in Modern Recruitment, accessed on June

25, 2026, https://recruitmentsmart.com/blogs/agentic-ai-your-autonomous-partner-in-mo dern-recruitment

5. Metaview: AI recruiting platform | Notetaker, Reports, Job Posts & Candidate

Search, accessed on June 25, 2026, https://www.metaview.ai/

6. CoDevSpace – Real-Time Collaborative Code Editor & Execution Engine -

GitHub, accessed on June 25, 2026, https://github.com/dev-ankit-mishra/collab-code-editor

7. 7 Best Appointment Scheduling API for Developers - Cal.com, accessed on June

25, 2026, https://cal.com/blog/best-appointment-scheduling-api

8. How Calendar Integrations Enable Automated Interview Scheduling -

candidate.fyi, accessed on June 25, 2026, https://candidate.fyi/post/calendar-integrations-automated-interview-scheduling

9. Give Your AI Agent a Managed Calendar - Nylas CLI, accessed on June 25, 2026,

https://cli.nylas.com/guides/agent-account-calendar

10. AI-Powered Coding Exam: The Future of Skill Assessment - TestInvite, accessed

on June 25, 2026, https://www.testinvite.com/dy/en/pages/blog/ai-coding-test

11. Automatic Assessment Tools for Grading Coding Assignments: A Systematic

Literature Review - MDPI, accessed on June 25, 2026, https://www.mdpi.com/2076-3417/16/11/5658

12. CodEv: An Automated Grading Framework Leveraging Large Language Models

for Consistent and Constructive Feedback - arXiv, accessed on June 25, 2026, https://arxiv.org/pdf/2501.10421

13. Static Code Analysis: Top 7 Methods, Pros/Cons and Best Practices - Oligo

Security, accessed on June 25, 2026, https://www.oligo.security/academy/static-code-analysis

14. Automate Recruiting Tasks: Eliminate Busy Work with AI | Humanly, accessed on

June 25, 2026, https://www.humanly.io/blog/automate-recruiting-tasks

15. HackerEarth | AI Powered Interviews and Assessment, accessed on June 25,

2026, https://www.hackerearth.com/

16. Collaborative IDE with integrated terminal - CoderPad, accessed on June 25,

2026, https://coderpad.io/features/collaborative-ide/

17. AI-Coding - Assessfy, accessed on June 25, 2026, https://assessfy.com/ai-coding/
18. CodePair | Live Coding Interviews in Real Dev Environments - CodeSubmit,

accessed on June 25, 2026, https://www.codesubmit.io/codepair

19. abdul2801/Collaborative-code-editor - GitHub, accessed on June 25, 2026,

https://github.com/abdul2801/Collaborative-code-editor

20. Real-Time Collaborative Code Editor Using WebSockets - International Journal of

Scientific Research and Engineering Trends, accessed on June 25, 2026, https://ijsret.com/wp-content/uploads/IJSRET_V12_issue3_196.pdf

21. Collaborative Code Editor with real-time features: Good for master's thesis? -

Reddit, accessed on June 25, 2026, https://www.reddit.com/r/learnprogramming/comments/1hxkptd/collaborative_co de_editor_with_realtime_features/

22. Sandboxed Evaluations of LLM-Generated Code - Promptfoo, accessed on June

25, 2026, https://www.promptfoo.dev/docs/guides/sandboxed-code-evals/

23. Monaco - Yjs Docs, accessed on June 25, 2026,

https://beta.yjs.dev/docs/ecosystem/editor-bindings/monaco/

24. React Native Automation: Setup Guide - Maestro, accessed on June 25, 2026,

https://maestro.dev/insights/react-native-automation-setup-guide

25. Introduction to Testing React Native Apps - Appcircle Blog, accessed on June 25,

2026, https://appcircle.io/blog/introduction-to-testing-react-native-apps

26. Improving React Native App quality & performance with SonarQube, accessed on

June 25, 2026,

https://www.nextbraintech.com/blog/improving-react-native-app-quality-and-pe rformance-with-sonarqube

27. Testing - React Native, accessed on June 25, 2026,

https://reactnative.dev/docs/testing-overview

28. How AI assistance impacts the formation of coding skills - Anthropic, accessed

on June 25, 2026, https://www.anthropic.com/research/AI-assistance-coding-skills