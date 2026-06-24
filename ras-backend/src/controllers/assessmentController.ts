import { Request, Response } from 'express';
import {
  createAssessment,
  getAssessments,
  getAssessmentById
} from '../services/assessmentService';

export const create = async (req: Request, res: Response) => {
  try {
    const employerId = req.user!.id;
    const assessment = await createAssessment(employerId, req.body);
    res.status(201).json({ message: 'Assessment created successfully', assessment });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const employerId = Array.isArray(req.query.employerId) ? req.query.employerId[0] as string : req.query.employerId as string | undefined;
    const assessments = await getAssessments({ employerId });
    res.json({ assessments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const assessment = await getAssessmentById(id);
    res.json({ assessment });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};