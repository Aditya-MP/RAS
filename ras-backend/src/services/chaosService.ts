import { supabaseAdmin } from '../config/supabase';

export const CHAOS_EVENTS = {
  DB_POOL_STARVATION: { type: 'DB_POOL_STARVATION', description: 'Database connection pool exhausted. API timeouts occurring.', severity: 'high' },
  API_RATE_LIMIT: { type: 'API_RATE_LIMIT', description: 'External payment API returning HTTP 429 rate limit errors.', severity: 'medium' },
  STALE_CACHE: { type: 'STALE_CACHE', description: 'Redis cache failing to update when primary DB values change. Stale data returned.', severity: 'medium' },
  SLOW_QUERY: { type: 'SLOW_QUERY', description: 'Database query execution time exceeds 250ms. Slow query logs detected.', severity: 'low' },
  OOM: { type: 'OOM', description: 'Container memory exceeded. Out of Memory (OOM) kill triggered.', severity: 'high' },
  DEADLOCK: { type: 'DEADLOCK', description: 'Two asynchronous worker processes deadlocked waiting for mutual resource locks.', severity: 'high' },
  CORS: { type: 'CORS', description: 'CORS policy error: Access-Control-Allow-Origin header missing.', severity: 'low' },
  S3_PERMISSION: { type: 'S3_PERMISSION', description: 'S3 permission drift: Access-Denied error on file upload.', severity: 'medium' },
  PORT_COLLISION: { type: 'PORT_COLLISION', description: 'API port collision: EADDRINUSE error on port binding.', severity: 'low' },
  K8S_BOOT_LOOP: { type: 'K8S_BOOT_LOOP', description: 'Liveness probe failed. Container restarting in boot loop.', severity: 'high' },
} as const;

export type ChaosEventType = keyof typeof CHAOS_EVENTS;

export const triggerChaosEvent = async (
  teamId: string,
  eventType: ChaosEventType,
  metadata?: Record<string, any>
) => {
  const event = CHAOS_EVENTS[eventType];
  if (!event) throw new Error(`Invalid chaos event type: ${eventType}`);

  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams').select('status').eq('id', teamId).single();

  if (teamError || !team) throw new Error('Team not found');
  if (team.status !== 'active') throw new Error('Cannot trigger chaos on inactive team');

  const { data, error } = await supabaseAdmin
    .from('chaos_events')
    .insert([{
      team_id: teamId,
      event_type: eventType,
      description: event.description,
      severity: event.severity,
      status: 'active',
      metadata: metadata || {},
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const resolveChaosEvent = async (eventId: string, candidateId: string) => {
  const { data: event, error: getError } = await supabaseAdmin
    .from('chaos_events').select('*').eq('id', eventId).single();

  if (getError || !event) throw new Error('Chaos event not found');
  if (event.status === 'resolved') throw new Error('Event already resolved');

  const { data: member, error: memberError } = await supabaseAdmin
    .from('team_members').select('id')
    .eq('team_id', event.team_id).eq('candidate_id', candidateId).single();

  if (memberError || !member) throw new Error('You are not a member of this team');

  const resolvedAt = new Date();
  const responseTimeMs = resolvedAt.getTime() - new Date(event.triggered_at).getTime();

  const { data, error } = await supabaseAdmin
    .from('chaos_events')
    .update({ status: 'resolved', resolved_at: resolvedAt.toISOString(), response_time_ms: responseTimeMs, candidate_id: candidateId })
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getTeamChaosEvents = async (teamId: string, requesterId: string) => {
  if (requesterId !== 'system') {
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams').select('assessment:assessments!inner(employer_id)').eq('id', teamId).single();

    if (teamError || !team) throw new Error('Team not found');

    const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
    const isEmployer = assessment.employer_id === requesterId;

    const { data: member, error: memberError } = await supabaseAdmin
      .from('team_members').select('id').eq('team_id', teamId).eq('candidate_id', requesterId).single();

    if (!isEmployer && (memberError || !member)) throw new Error('Access denied');
  }

  const { data, error } = await supabaseAdmin
    .from('chaos_events').select('*').eq('team_id', teamId)
    .order('triggered_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getChaosMetrics = async (teamId: string) => {
  const { data: events, error } = await supabaseAdmin
    .from('chaos_events').select('status, response_time_ms, event_type').eq('team_id', teamId);

  if (error) throw new Error(error.message);
  if (!events || events.length === 0) return { total: 0, resolved: 0, unresolved: 0, resolutionRate: 0, avgResponseTimeMs: 0, eventsByType: {} };

  const resolved = events.filter(e => e.status === 'resolved');
  const avgResponseTime = resolved.filter(e => e.response_time_ms)
    .reduce((acc, e) => acc + e.response_time_ms, 0) / (resolved.length || 1);

  return {
    total: events.length,
    resolved: resolved.length,
    unresolved: events.length - resolved.length,
    resolutionRate: events.length > 0 ? resolved.length / events.length : 0,
    avgResponseTimeMs: avgResponseTime,
    eventsByType: events.reduce((acc, e) => {
      acc[e.event_type] = (acc[e.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};
