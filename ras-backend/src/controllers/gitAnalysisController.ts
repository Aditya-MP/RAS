import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { getCandidateInfluenceScores, storeInfluenceScores } from '../services/gitAnalysisService';

export const analyzeTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId as string;

    const { data: team, error } = await supabaseAdmin
      .from('teams').select('assessment:assessments!inner(employer_id)').eq('id', teamId).single();

    if (error || !team) return res.status(404).json({ error: 'Team not found' });

    const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
    if (assessment.employer_id !== req.user!.id) return res.status(403).json({ error: 'You do not own this assessment' });

    const scores = await getCandidateInfluenceScores(teamId);
    await storeInfluenceScores(teamId, scores);

    res.json({ message: 'Analysis complete', teamId, scores });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getScores = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId as string;
    const scores = await getCandidateInfluenceScores(teamId);
    res.json({ teamId, scores });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
