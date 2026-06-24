import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { score, getReport, getTeamReportsList } from '../controllers/scoringController';

const router = Router();

// POST /api/scoring/score-team/:teamId – trigger scoring (employer/admin)
router.post('/score-team/:teamId', requireAuth, requireRole(['employer', 'admin']), score);

// GET /api/scoring/report/:candidateId – get candidate's report
router.get('/report/:candidateId', requireAuth, getReport);

// GET /api/scoring/team/:teamId – get all reports for a team (employer)
router.get('/team/:teamId', requireAuth, requireRole(['employer', 'admin']), getTeamReportsList);

export default router;
