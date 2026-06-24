import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { trigger, resolve, listByTeam, metrics, listEventTypes } from '../controllers/chaosController';

const router = Router();

router.post('/trigger', requireAuth, requireRole(['employer', 'admin']), trigger);
router.post('/resolve/:eventId', requireAuth, resolve);
router.get('/team/:teamId', requireAuth, listByTeam);
router.get('/metrics/:teamId', requireAuth, metrics);
router.get('/events', requireAuth, listEventTypes);

export default router;
