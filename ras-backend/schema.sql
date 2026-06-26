-- =============================================================
-- RAS – Redrob Ambient Sandbox
-- Complete Schema
-- Strategy: create ALL tables first, then ALL policies
-- =============================================================

-- ─────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'employer', 'admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  jd_text TEXT,
  extracted_skills TEXT[],
  seniority_level TEXT CHECK (seniority_level IN ('junior', 'mid', 'senior', 'lead')),
  tech_track TEXT CHECK (tech_track IN ('frontend', 'backend', 'devops', 'fullstack')),
  max_candidates INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ,
  session_end TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'aborted')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS public.telemetry_events (
  id BIGSERIAL PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_class TEXT NOT NULL CHECK (event_class IN ('EV_KBD', 'EV_PST', 'EV_BLR', 'EV_TRM', 'EV_PRM', 'EV_ACP')),
  event_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.code_snapshots (
  id BIGSERIAL PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  snapshot_time TIMESTAMPTZ DEFAULT now(),
  files JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  dialogue_act TEXT CHECK (dialogue_act IN ('OFFER', 'REQUEST_CLARIFICATION', 'JUSTIFICATION', 'ACKNOWLEDGMENT')),
  cognitive_state TEXT CHECK (cognitive_state IN ('SURE', 'CONFUSED', 'STUCK', 'AVOIDING_THOUGHT')),
  telemetry_correlation NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.peer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  technical_contribution INT CHECK (technical_contribution BETWEEN 1 AND 5),
  communication_rigor INT CHECK (communication_rigor BETWEEN 1 AND 5),
  problem_solving_support INT CHECK (problem_solving_support BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, reviewer_id, target_id)
);

CREATE TABLE IF NOT EXISTS public.chaos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  triggered_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'failed')),
  response_time_ms INT,
  candidate_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  final_percentile NUMERIC,
  coding_correctness NUMERIC,
  ai_collaboration_fluency NUMERIC,
  keystroke_integrity NUMERIC,
  soft_skill_score NUMERIC,
  peer_score NUMERIC,
  chaos_resilience NUMERIC,
  influence_score NUMERIC,
  report_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  original_filename TEXT,
  sanitized_text TEXT,
  has_injection BOOLEAN DEFAULT false,
  injection_detected_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(candidate_id)
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  salary TEXT DEFAULT '',
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  tech_track TEXT CHECK (tech_track IN ('frontend', 'backend', 'devops', 'fullstack')),
  seniority_level TEXT CHECK (seniority_level IN ('junior', 'mid', 'senior', 'lead')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- ─────────────────────────────────────────
-- ENABLE RLS ON ALL TABLES
-- ─────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chaos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- POLICIES — PROFILES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ─────────────────────────────────────────
-- POLICIES — ASSESSMENTS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Employers can manage own assessments" ON assessments;
CREATE POLICY "Employers can manage own assessments"
  ON assessments FOR ALL USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Anyone can read assessments" ON assessments;
CREATE POLICY "Anyone can read assessments"
  ON assessments FOR SELECT USING (true);

-- ─────────────────────────────────────────
-- POLICIES — TEAMS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Employers can manage teams" ON teams;
CREATE POLICY "Employers can manage teams"
  ON teams FOR ALL USING (
    EXISTS (SELECT 1 FROM assessments WHERE assessments.id = teams.assessment_id AND assessments.employer_id = auth.uid())
  );

DROP POLICY IF EXISTS "Candidates can read their teams" ON teams;
CREATE POLICY "Candidates can read their teams"
  ON teams FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = teams.id AND team_members.candidate_id = auth.uid())
  );

-- ─────────────────────────────────────────
-- POLICIES — TEAM MEMBERS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Employers can manage team members" ON team_members;
CREATE POLICY "Employers can manage team members"
  ON team_members FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = team_members.team_id AND assessments.employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Candidates can read own membership" ON team_members;
CREATE POLICY "Candidates can read own membership"
  ON team_members FOR SELECT USING (auth.uid() = candidate_id);

-- ─────────────────────────────────────────
-- POLICIES — TELEMETRY EVENTS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can insert own telemetry" ON telemetry_events;
CREATE POLICY "Candidates can insert own telemetry"
  ON telemetry_events FOR INSERT WITH CHECK (
    auth.uid() = candidate_id AND
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = telemetry_events.team_id AND team_members.candidate_id = auth.uid())
  );

DROP POLICY IF EXISTS "Team members and employers can read telemetry" ON telemetry_events;
CREATE POLICY "Team members and employers can read telemetry"
  ON telemetry_events FOR SELECT USING (
    auth.uid() = candidate_id OR
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = telemetry_events.team_id AND assessments.employer_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- POLICIES — CODE SNAPSHOTS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can insert snapshots" ON code_snapshots;
CREATE POLICY "Candidates can insert snapshots"
  ON code_snapshots FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = code_snapshots.team_id AND team_members.candidate_id = auth.uid())
  );

DROP POLICY IF EXISTS "Team members and employers can read snapshots" ON code_snapshots;
CREATE POLICY "Team members and employers can read snapshots"
  ON code_snapshots FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = code_snapshots.team_id AND team_members.candidate_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = code_snapshots.team_id AND assessments.employer_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- POLICIES — CHAT MESSAGES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Team members can insert chat messages" ON chat_messages;
CREATE POLICY "Team members can insert chat messages"
  ON chat_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = chat_messages.team_id AND team_members.candidate_id = auth.uid())
  );

DROP POLICY IF EXISTS "Team members and employers can read chat" ON chat_messages;
CREATE POLICY "Team members and employers can read chat"
  ON chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = chat_messages.team_id AND team_members.candidate_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = chat_messages.team_id AND assessments.employer_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- POLICIES — PEER REVIEWS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can submit reviews" ON peer_reviews;
CREATE POLICY "Candidates can submit reviews"
  ON peer_reviews FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = peer_reviews.team_id AND team_members.candidate_id = auth.uid()) AND
    reviewer_id != target_id
  );

DROP POLICY IF EXISTS "Candidates can view own reviews" ON peer_reviews;
CREATE POLICY "Candidates can view own reviews"
  ON peer_reviews FOR SELECT USING (auth.uid() = target_id OR auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Employers can view all reviews" ON peer_reviews;
CREATE POLICY "Employers can view all reviews"
  ON peer_reviews FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = peer_reviews.team_id AND assessments.employer_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- POLICIES — CHAOS EVENTS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Employers can trigger chaos events" ON chaos_events;
CREATE POLICY "Employers can trigger chaos events"
  ON chaos_events FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = chaos_events.team_id AND assessments.employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team members and employers can view chaos events" ON chaos_events;
CREATE POLICY "Team members and employers can view chaos events"
  ON chaos_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = chaos_events.team_id AND team_members.candidate_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = chaos_events.team_id AND assessments.employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Candidates can resolve chaos events" ON chaos_events;
CREATE POLICY "Candidates can resolve chaos events"
  ON chaos_events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = chaos_events.team_id AND team_members.candidate_id = auth.uid())
  );

-- ─────────────────────────────────────────
-- POLICIES — REPORTS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can read own report" ON reports;
CREATE POLICY "Candidates can read own report"
  ON reports FOR SELECT USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Employers can read team reports" ON reports;
CREATE POLICY "Employers can read team reports"
  ON reports FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams
      JOIN assessments ON teams.assessment_id = assessments.id
      WHERE teams.id = reports.team_id AND assessments.employer_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- POLICIES — RESUMES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can upload own resume" ON resumes;
CREATE POLICY "Candidates can upload own resume"
  ON resumes FOR INSERT WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Candidates can view own resume" ON resumes;
CREATE POLICY "Candidates can view own resume"
  ON resumes FOR SELECT USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Employers can view resumes of their candidates" ON resumes;
CREATE POLICY "Employers can view resumes of their candidates"
  ON resumes FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members
      JOIN teams ON teams.id = team_members.team_id
      JOIN assessments ON assessments.id = teams.assessment_id
      WHERE team_members.candidate_id = resumes.candidate_id
      AND assessments.employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Candidates can update own resume" ON resumes;
CREATE POLICY "Candidates can update own resume"
  ON resumes FOR UPDATE USING (auth.uid() = candidate_id);

-- ─────────────────────────────────────────
-- POLICIES — JOBS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Employers can manage own jobs" ON jobs;
CREATE POLICY "Employers can manage own jobs"
  ON jobs FOR ALL USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Anyone can read jobs" ON jobs;
CREATE POLICY "Anyone can read jobs"
  ON jobs FOR SELECT USING (true);

-- ─────────────────────────────────────────
-- POLICIES — JOB APPLICATIONS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Candidates can create applications" ON public.job_applications;
CREATE POLICY "Candidates can create applications"
  ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Users can read own applications" ON public.job_applications;
CREATE POLICY "Users can read own applications"
  ON public.job_applications FOR SELECT USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Employers can read applications of their own jobs" ON public.job_applications;
CREATE POLICY "Employers can read applications of their own jobs"
  ON public.job_applications FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE public.jobs.id = job_applications.job_id
      AND public.jobs.employer_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────
-- REALTIME
-- ─────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE telemetry_events;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chaos_events;
