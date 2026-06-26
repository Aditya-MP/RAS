import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { create, list, remove, apply, listApplied, close, schedule, getMatch } from '../controllers/jobController';

const router = Router();

// GET /api/jobs – public to all authenticated users
router.get('/', requireAuth, list);

// GET /api/jobs/applications – list candidate's applications
router.get('/applications', requireAuth, listApplied);

// POST /api/jobs – employer only
router.post('/', requireAuth, requireRole(['employer', 'admin']), create);

// GET /api/jobs/:id/match – get resume match score for a job
router.get('/:id/match', requireAuth, getMatch);

// POST /api/jobs/:id/apply – apply to a job
router.post('/:id/apply', requireAuth, apply);

// POST /api/jobs/:id/close – close a job
router.post('/:id/close', requireAuth, requireRole(['employer', 'admin']), close);

// POST /api/jobs/:id/schedule – schedule job and form teams
router.post('/:id/schedule', requireAuth, requireRole(['employer', 'admin']), schedule);

// DELETE /api/jobs/:id – employer only
router.delete('/:id', requireAuth, requireRole(['employer', 'admin']), remove);

export default router;

