import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { analyzeTeam, getScores } from '../controllers/gitAnalysisController';

const router = Router();

router.post('/analyze/:teamId', requireAuth, requireRole(['employer', 'admin']), analyzeTeam);
router.get('/scores/:teamId', requireAuth, getScores);

export default router;
