import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// For user‑scoped operations (uses RLS)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// For admin operations (bypasses RLS) – use only on backend
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);