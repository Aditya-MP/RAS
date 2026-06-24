import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import {
  storeChatMessage,
  getTeamMessages,
  classifyMessage,
  computeTelemetryCorrelation,
} from '../services/dialogueService';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id as string;
    const { teamId, message } = req.body;

    if (!teamId) return res.status(400).json({ error: 'teamId required' });
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message required' });
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('candidate_id', candidateId)
      .single();

    if (memberError || !member) {
      return res.status(403).json({ error: 'Not a member of this team' });
    }

    // Run classification and TCI in parallel
    const [classification, correlation] = await Promise.all([
      classifyMessage(message),
      computeTelemetryCorrelation(teamId, candidateId, message),
    ]);

    const stored = await storeChatMessage(teamId, candidateId, message, classification, correlation);

    res.status(201).json({
      message: 'Message stored',
      data: { ...stored, classification, telemetry_correlation: correlation },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId as string;
    const messages = await getTeamMessages(teamId, req.user!.id as string);
    res.json({ messages });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const classifySingle = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message required' });
    }
    const classification = await classifyMessage(message);
    res.json({ classification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
