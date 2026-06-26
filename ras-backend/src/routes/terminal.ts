import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { execCommand } from '../controllers/terminalController';

const router = Router();

router.post('/exec', requireAuth, execCommand);

export default router;
