import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { create, list, getOne } from '../controllers/assessmentController';

const router = Router();

// POST /api/assessments – create (employer only)
router.post('/', requireAuth, requireRole(['employer', 'admin']), create);

// GET /api/assessments – list (anyone)
router.get('/', requireAuth, list);

// GET /api/assessments/:id – get one (anyone)
router.get('/:id', requireAuth, getOne);

export default router;