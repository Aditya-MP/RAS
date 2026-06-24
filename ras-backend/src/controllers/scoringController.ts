import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { scoreTeam, getCandidateReport, getTeamReports } from '../services/scoringService';

export const score = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId as string;

    const { data: team, error } = await supabaseAdmin
      .from('teams')
      .select('assessment:assessments!inner(employer_id)')
      .eq('id', teamId)
      .single();

    if (error || !team) return res.status(404).json({ error: 'Team not found' });

    const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
    if (assessment.employer_id !== (req.user!.id as string)) {
      return res.status(403).json({ error: 'You do not own this assessment' });
    }

    const results = await scoreTeam(teamId);
    res.json({ message: 'Scoring completed successfully', teamId, candidates_scored: results.length, results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const candidateId = req.params.candidateId as string;
    const report = await getCandidateReport(candidateId, req.user!.id as string);
    res.json({ report });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getTeamReportsList = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId as string;
    const reports = await getTeamReports(teamId, req.user!.id as string);
    res.json({ reports });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};
