import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { ask } from '../controllers/aiController';

const router = Router();

// POST /api/ai/ask – ask Socratic assistant (authenticated)
router.post('/ask', requireAuth, ask);

export default router;
