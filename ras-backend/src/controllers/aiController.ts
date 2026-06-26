import { Request, Response } from 'express';
import { getSocraticResponse, generateJobDetails } from '../services/geminiService';
import { supabaseAdmin } from '../config/supabase';
import logger from '../utils/logger';

export const ask = async (req: Request, res: Response) => {
  try {
    const { prompt, context, sessionId, teamId, history } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'prompt is required and must be a non-empty string' });
    }

    let round: 1 | 2 = 1;
    if (teamId) {
      const { data: team } = await supabaseAdmin
        .from('teams')
        .select('round')
        .eq('id', teamId)
        .single();
      
      if (team && team.round) {
        round = team.round as 1 | 2;
      }
    }

    const reply = await getSocraticResponse({
      userPrompt: prompt,
      context: context || '',
      sessionId: sessionId || req.user?.id || 'default',
      round,
      history: Array.isArray(history) ? history : []
    });

    res.json({ success: true, reply, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const generateJob = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'prompt is required and must be a non-empty string' });
    }

    logger.info(`\n💼 JOB GENERATION REQUEST`);
    logger.info(`   Prompt: "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"}`);
    
    const jobDetails = await generateJobDetails(prompt);
    
    logger.info(`\n🚀 JOB GENERATION COMPLETE - Sending to frontend`);
    res.json({ success: true, jobDetails });
  } catch (error: any) {
    // If quota exceeded or service unavailable, return user-friendly error
    if (error.status === 429 || error.status === 503) {
      logger.warn(`\n⚠️  FALLBACK TO MANUAL ENTRY - AI unavailable`);
      return res.status(503).json({ 
        error: 'AI service temporarily unavailable due to high demand or quota limits. Please use manual entry.',
        fallback: true 
      });
    }
    logger.error(`\n❌ JOB GENERATION ERROR:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
