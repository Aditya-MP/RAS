import { Request, Response } from 'express';
import {
  createTeam,
  getTeamById,
  startSession,
  endSession,
  getTeamsByAssessment
} from '../services/teamService';

export const create = async (req: Request, res: Response) => {
  try {
    const employerId = req.user!.id;
    const { assessmentId, candidateIds } = req.body;

    if (!assessmentId || !candidateIds || !Array.isArray(candidateIds)) {
      return res.status(400).json({ error: 'assessmentId and candidateIds array required' });
    }

    const team = await createTeam(assessmentId, candidateIds, employerId);
    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const team = await getTeamById(id);
    res.json({ team });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const start = async (req: Request, res: Response) => {
  try {
    const employerId = req.user!.id as string;
    const id = req.params.id as string;
    const team = await startSession(id, employerId);
    res.json({ message: 'Session started', team });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const end = async (req: Request, res: Response) => {
  try {
    const employerId = req.user!.id as string;
    const id = req.params.id as string;
    const team = await endSession(id, employerId);
    res.json({ message: 'Session ended', team });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listByAssessment = async (req: Request, res: Response) => {
  try {
    const employerId = req.user!.id as string;
    const assessmentId = req.params.assessmentId as string;
    const teams = await getTeamsByAssessment(assessmentId, employerId);
    res.json({ teams });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};