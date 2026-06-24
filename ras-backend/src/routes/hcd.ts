import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { uploadResume, getCandidateResume, listInjectionAttempts, uploadMiddleware } from '../controllers/hcdController';

const router = Router();

// Order matters: specific routes before param routes
router.get('/injections/list', requireAuth, requireRole(['employer', 'admin']), listInjectionAttempts);
router.post('/upload', requireAuth, uploadMiddleware, uploadResume);
router.get('/:candidateId', requireAuth, getCandidateResume);

export default router;
