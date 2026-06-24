import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { save, listByTeam, getOne } from '../controllers/snapshotController';

const router = Router();

// POST /api/snapshots – save snapshot (team member)
router.post('/', requireAuth, save);

// GET /api/snapshots/team/:teamId – list snapshots for a team
router.get('/team/:teamId', requireAuth, listByTeam);

// GET /api/snapshots/:snapshotId – get a specific snapshot
router.get('/:snapshotId', requireAuth, getOne);

export default router;
