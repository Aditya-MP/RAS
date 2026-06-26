require('dotenv').config();
const https = require('https');

const sql = `
-- 1. Alter jobs table to add status and assessment link
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
ADD COLUMN IF NOT EXISTS assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL;

-- 2. Create job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- 3. Enable RLS on job applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 4. Policies for job applications
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
`;

// Extract project ref from SUPABASE_URL
const url = new URL(process.env.SUPABASE_URL);
const projectRef = url.hostname.split('.')[0];

const body = JSON.stringify({ query: sql });

const options = {
  hostname: 'api.supabase.com',
  path: `/v1/projects/${projectRef}/database/query`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(body);
req.end();
