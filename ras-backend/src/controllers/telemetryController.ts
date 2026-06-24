import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import {
  ingestEvents,
  getTelemetryByTeam,
  getTelemetryByCandidate
} from '../services/telemetryService';

export const ingest = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id;
    const { teamId, events } = req.body;

    if (!teamId) {
      return res.status(400).json({ error: 'teamId is required' });
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'events array is required and cannot be empty' });
    }

    // Verify candidate is actually a member of this team
    const { data: member, error: memberError } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('candidate_id', candidateId)
      .single();

    if (memberError || !member) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    const result = await ingestEvents(teamId, candidateId, events);
    res.status(201).json({
      message: `Ingested ${result.length} events`,
      ingested: result.length
    });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getForTeam = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user!.id as string;
    const teamId = req.params.teamId as string;

    const events = await getTelemetryByTeam(teamId, requesterId);
    res.json({ events, count: events.length });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const getForCandidate = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id;
    // Only allow user to get their own telemetry
    const events = await getTelemetryByCandidate(candidateId);
    res.json({ events, count: events.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};