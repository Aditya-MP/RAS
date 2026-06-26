require('dotenv').config();
const https = require('https');

const sql = `
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
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Employers can manage own jobs" ON public.jobs;
CREATE POLICY "Employers can manage own jobs"
  ON public.jobs FOR ALL USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Anyone can read jobs" ON public.jobs;
CREATE POLICY "Anyone can read jobs"
  ON public.jobs FOR SELECT USING (true);
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
