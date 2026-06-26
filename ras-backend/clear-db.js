require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function clear() {
  console.log("=== Starting Database Cleanup (Transaction Data) ===");
  
  // Tables in dependency order (children first, then parents)
  const tables = [
    { name: 'notifications', pkType: 'uuid' },
    { name: 'peer_reviews', pkType: 'uuid' },
    { name: 'reports', pkType: 'uuid' },
    { name: 'chaos_events', pkType: 'uuid' },
    { name: 'chat_messages', pkType: 'bigint' },
    { name: 'telemetry_events', pkType: 'bigint' },
    { name: 'code_snapshots', pkType: 'bigint' },
    { name: 'resumes', pkType: 'uuid' },
    { name: 'team_members', pkType: 'uuid' },
    { name: 'teams', pkType: 'uuid' },
    { name: 'job_applications', pkType: 'uuid' },
    { name: 'jobs', pkType: 'uuid' },
    { name: 'assessments', pkType: 'uuid' }
  ];

  for (const table of tables) {
    try {
      console.log(`Clearing table: ${table.name}...`);
      
      let query = supabase.from(table.name).delete();
      
      if (table.pkType === 'uuid') {
        // Match all except a dummy UUID to delete all rows
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      } else {
        // For bigserial/bigint primary keys
        query = query.gte('id', 0);
      }
      
      const { error } = await query;
      if (error) {
        console.error(`❌ Error clearing ${table.name}:`, error.message);
      } else {
        console.log(`✅ Cleared ${table.name} successfully.`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error on table ${table.name}:`, err.message);
    }
  }
  
  console.log("=== Database Cleanup Complete ===");
}

clear();
