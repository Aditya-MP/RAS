require('dotenv').config();
const https = require('https');

const sql = `
-- Drop existing constraints if they exist
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_seniority_level_check;
ALTER TABLE public.assessments DROP CONSTRAINT IF EXISTS assessments_seniority_level_check;

-- Add updated check constraints allowing 'lead'
ALTER TABLE public.jobs ADD CONSTRAINT jobs_seniority_level_check 
  CHECK (seniority_level IN ('junior', 'mid', 'senior', 'lead'));
ALTER TABLE public.assessments ADD CONSTRAINT assessments_seniority_level_check 
  CHECK (seniority_level IN ('junior', 'mid', 'senior', 'lead'));
`;

// Extract project ref from SUPABASE_URL
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

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
