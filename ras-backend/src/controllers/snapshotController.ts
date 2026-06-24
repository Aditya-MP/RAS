import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { saveSnapshot, getSnapshotsByTeam, getSnapshotById } from '../services/snapshotService';

export const save = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id as string;
    const { teamId, files } = req.body;

    if (!teamId) return res.status(400).json({ error: 'teamId required' });
    if (!files || typeof files !== 'object' || Array.isArray(files)) {
      return res.status(400).json({ error: 'files must be an object (path → content)' });
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

    const snapshot = await saveSnapshot(teamId, candidateId, files);
    res.status(201).json({ message: 'Snapshot saved', snapshot });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

import { generateAssessmentProject } from '../services/geminiService';

export const listByTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId as string;
    const requesterId = req.user!.id as string;
    let snapshots = await getSnapshotsByTeam(teamId, requesterId);

    if (snapshots.length === 0) {
      // Fetch team details and assessment context to trigger project generation
      const { data: team } = await supabaseAdmin
        .from('teams')
        .select('*, assessment:assessments!inner(*)')
        .eq('id', teamId)
        .single();

      if (team) {
        const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
        if (assessment) {
          const generatedFiles = await generateAssessmentProject(
            assessment.title,
            assessment.tech_track,
            assessment.seniority_level,
            assessment.jd_text || ''
          );
          // Save and store initial generated files as the first code snapshot
          const firstSnapshot = await saveSnapshot(teamId, requesterId, generatedFiles);
          snapshots = [firstSnapshot];
        }
      }
    }

    res.json({ snapshots });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const snapshotId = req.params.snapshotId as string;
    const snapshot = await getSnapshotById(snapshotId, req.user!.id as string);
    res.json({ snapshot });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
