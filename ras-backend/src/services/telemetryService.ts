import { supabaseAdmin } from '../config/supabase';

// Event class enum for validation
export const EVENT_CLASSES = [
  'EV_KBD',   // Keystroke
  'EV_PST',   // Paste
  'EV_BLR',   // Focus Loss (Blur)
  'EV_TRM',   // Terminal Execution
  'EV_PRM',   // AI Prompt
  'EV_ACP'    // AI Code Acceptance
] as const;

export type EventClass = typeof EVENT_CLASSES[number];

interface TelemetryEvent {
  event_class: EventClass;
  event_data: {
    timestamp_ms: number;
    [key: string]: any; // flexible metadata
  };
}

export const ingestEvents = async (
  teamId: string,
  candidateId: string,
  events: TelemetryEvent[]
) => {
  if (!events || events.length === 0) {
    throw new Error('No events provided');
  }

  // Validate each event
  for (const event of events) {
    if (!EVENT_CLASSES.includes(event.event_class as any)) {
      throw new Error(`Invalid event_class: ${event.event_class}`);
    }
    if (!event.event_data || typeof event.event_data !== 'object') {
      throw new Error('event_data must be an object');
    }
  }

  // Prepare rows for insertion
  const rows = events.map(event => ({
    team_id: teamId,
    candidate_id: candidateId,
    event_class: event.event_class,
    event_data: event.event_data
  }));

  // Batch insert
  const { data, error } = await supabaseAdmin
    .from('telemetry_events')
    .insert(rows)
    .select();

  if (error) {
    console.error('Telemetry insert error:', error);
    throw new Error(`Failed to insert telemetry: ${error.message}`);
  }

  return data;
};

export const getTelemetryByTeam = async (teamId: string, requesterId: string) => {
  // Verify requester is either:
  // 1. A member of this team, OR
  // 2. The employer who owns the assessment
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select(`
      id,
      assessment:assessments!inner(employer_id)
    `)
    .eq('id', teamId)
    .single();

  if (teamError || !team) {
    throw new Error('Team not found');
  }

  // Check if requester is the employer
  const isEmployer = (team.assessment as any).employer_id === requesterId;

  // Check if requester is a team member
  const { data: member, error: memberError } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('candidate_id', requesterId)
    .single();

  const isMember = !memberError && !!member;

  if (!isEmployer && !isMember) {
    throw new Error('You do not have access to this team\'s telemetry');
  }

  // Fetch telemetry
  const { data, error } = await supabaseAdmin
    .from('telemetry_events')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const getTelemetryByCandidate = async (candidateId: string) => {
  const { data, error } = await supabaseAdmin
    .from('telemetry_events')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};