-- 1. Add application deadline to jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;

-- 2. Add round to teams table (defaulting to Round 1)
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS round INT DEFAULT 1 CHECK (round IN (1, 2));

-- 3. Add progression status tracking to job_applications table
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'applied' 
  CHECK (status IN ('applied', 'pre_qualified', 'round1_scheduled', 'round1_completed', 'round2_scheduled', 'round2_completed', 'shortlisted_for_hr', 'rejected'));
