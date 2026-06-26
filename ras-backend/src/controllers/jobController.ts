import { Request, Response } from 'express';
import { createJob, getJobs, deleteJob, createJobApplication, getApplicationsForCandidate, closeJob, scheduleJobAndFormTeams } from '../services/jobService';
import { getResumeMatchForJob } from '../services/resumeMatchingService';

export const create = async (req: Request, res: Response) => {
  try {
    const job = await createJob(req.user!.id, req.body);
    res.status(201).json({ message: 'Job created', job });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const employerIdParam = req.query.employerId;
    let employerId: string | undefined = undefined;
    
    if (typeof employerIdParam === 'string') {
      employerId = employerIdParam;
    } else if (Array.isArray(employerIdParam) && employerIdParam.length > 0) {
      employerId = String(employerIdParam[0]);
    }
    
    const jobs = await getJobs(employerId);
    res.json({ jobs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteJob(jobId, req.user!.id);
    res.json({ message: 'Job deleted' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const apply = async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const application = await createJobApplication(jobId, req.user!.id);
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listApplied = async (req: Request, res: Response) => {
  try {
    const detailed = await getApplicationsForCandidate(req.user!.id);
    const ids = detailed.map((app: any) => app.job_id);
    res.json({ applications: ids, detailedApplications: detailed });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const close = async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const job = await closeJob(jobId, req.user!.id);
    res.json({ message: 'Job closed successfully', job });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMatch = async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const candidateId = req.user!.id;
    const match = await getResumeMatchForJob(candidateId, jobId);
    res.json({ match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const schedule = async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { timeSlot } = req.body;
    if (!timeSlot) {
      throw new Error('Missing required field: timeSlot');
    }
    const result = await scheduleJobAndFormTeams(jobId, req.user!.id, timeSlot);
    res.json({ message: 'Job scheduled and teams formed successfully', ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

