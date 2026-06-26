require('dotenv').config();
const https = require('https');

const sql = `
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('alert', 'info', 'success')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Candidates can read their own notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);

-- Policy: Employers can read notifications they sent
DROP POLICY IF EXISTS "Senders can read sent notifications" ON public.notifications;
CREATE POLICY "Senders can read sent notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = sender_id);

-- Policy: Employers can create notifications
DROP POLICY IF EXISTS "Senders can create notifications" ON public.notifications;
CREATE POLICY "Senders can create notifications"
  ON public.notifications FOR INSERT WITH CHECK (auth.uid() = sender_id);
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
