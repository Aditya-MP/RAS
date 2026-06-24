import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { triggerChaosEvent, resolveChaosEvent, getTeamChaosEvents, getChaosMetrics, CHAOS_EVENTS, ChaosEventType } from '../services/chaosService';

export const trigger = async (req: Request, res: Response) => {
  try {
    const employerId = req.user!.id;
    const { teamId, eventType, metadata } = req.body;

    if (!teamId) return res.status(400).json({ error: 'teamId required' });
    if (!eventType) return res.status(400).json({ error: 'eventType required' });

    const { data: team, error } = await supabaseAdmin
      .from('teams').select('assessment:assessments!inner(employer_id)').eq('id', teamId).single();

    if (error || !team) return res.status(404).json({ error: 'Team not found' });

    const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
    if (assessment.employer_id !== employerId) return res.status(403).json({ error: 'You do not own this assessment' });

    const event = await triggerChaosEvent(teamId, eventType as ChaosEventType, metadata);
    res.status(201).json({ message: `Chaos event triggered: ${eventType}`, event, available_events: Object.keys(CHAOS_EVENTS) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const resolve = async (req: Request, res: Response) => {
  try {
    const event = await resolveChaosEvent(req.params.eventId as string, req.user!.id);
    res.json({ message: 'Chaos event resolved', event, response_time_ms: event.response_time_ms });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listByTeam = async (req: Request, res: Response) => {
  try {
    const events = await getTeamChaosEvents(req.params.teamId as string, req.user!.id);
    res.json({ events });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const metrics = async (req: Request, res: Response) => {
  try {
    const result = await getChaosMetrics(req.params.teamId as string);
    res.json({ metrics: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listEventTypes = (_req: Request, res: Response) => {
  res.json({ event_types: CHAOS_EVENTS });
};
