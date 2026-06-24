import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { runCode, listLanguages } from '../controllers/executionController';

const router = Router();

// POST /api/execution/run – execute code (authenticated)
router.post('/run', requireAuth, runCode);

// GET /api/execution/languages – list supported languages
router.get('/languages', requireAuth, listLanguages);

export default router;
