import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { send, list } from '../controllers/notificationController';

const router = Router();

// GET /api/notifications – public to all authenticated users
router.get('/', requireAuth, list);

// POST /api/notifications – employer only
router.post('/', requireAuth, requireRole(['employer', 'admin']), send);

export default router;
