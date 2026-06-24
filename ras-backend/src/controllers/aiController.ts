import { Request, Response } from 'express';
import { getSocraticResponse } from '../services/geminiService';
import { supabaseAdmin } from '../config/supabase';

export const ask = async (req: Request, res: Response) => {
  try {
    const { prompt, context, sessionId, teamId } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'prompt is required and must be a non-empty string' });
    }

    let round: 1 | 2 = 1;
    if (teamId) {
      const { data: team } = await supabaseAdmin
        .from('teams')
        .select('assessment:assessments!inner(seniority_level)')
        .eq('id', teamId)
        .single();
      
      if (team) {
        const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
        if (assessment && (assessment as any).seniority_level === 'senior') {
          round = 2;
        }
      }
    }

    const reply = await getSocraticResponse({
      userPrompt: prompt,
      context: context || '',
      sessionId: sessionId || req.user?.id || 'default',
      round
    });

    res.json({ success: true, reply, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
