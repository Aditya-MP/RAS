import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  ingest,
  getForTeam,
  getForCandidate
} from '../controllers/telemetryController';

const router = Router();

// POST /api/telemetry/ingest – ingest events (candidate only)
router.post('/ingest', requireAuth, ingest);

// GET /api/telemetry/team/:teamId – get telemetry for a team
router.get('/team/:teamId', requireAuth, getForTeam);

// GET /api/telemetry/me – get current user's telemetry
router.get('/me', requireAuth, getForCandidate);

export default router;