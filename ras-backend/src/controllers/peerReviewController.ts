import { Request, Response } from 'express';
import { submitReview, getTeamReviews, getCandidateReviews, getCalibratedScore } from '../services/peerReviewService';

export const submit = async (req: Request, res: Response) => {
  try {
    const { teamId, targetId, technicalContribution, communicationRigor, problemSolvingSupport, comments } = req.body;
    if (!teamId || !targetId) return res.status(400).json({ error: 'teamId and targetId are required' });

    const review = await submitReview(req.user!.id, { teamId, targetId, technicalContribution, communicationRigor, problemSolvingSupport, comments });
    res.status(201).json({ message: 'Review submitted', review });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTeamReviewsList = async (req: Request, res: Response) => {
  try {
    const reviews = await getTeamReviews(req.params.teamId as string, req.user!.id);
    res.json({ reviews });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const getCandidateReviewsList = async (req: Request, res: Response) => {
  try {
    const reviews = await getCandidateReviews(req.params.candidateId as string, req.user!.id);
    res.json({ reviews });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const getCalibratedPeerScore = async (req: Request, res: Response) => {
  try {
    const candidateId = req.params.candidateId as string;
    const teamId = req.params.teamId as string;
    const result = await getCalibratedScore(candidateId, teamId);
    res.json({ ...result, candidateId, teamId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
