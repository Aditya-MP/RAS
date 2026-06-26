import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { ask, generateJob } from '../controllers/aiController';

const router = Router();

// POST /api/ai/ask – ask Socratic assistant (authenticated)
router.post('/ask', requireAuth, ask);

// POST /api/ai/generate-job – AI job description generator (employer only)
router.post('/generate-job', requireAuth, requireRole(['employer', 'admin']), generateJob);

export default router;
