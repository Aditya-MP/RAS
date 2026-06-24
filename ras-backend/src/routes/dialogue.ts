import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { sendMessage, getMessages, classifySingle } from '../controllers/dialogueController';

const router = Router();

// POST /api/chat/message – send and classify a chat message
router.post('/message', requireAuth, sendMessage);

// GET /api/chat/team/:teamId – get all messages for a team
router.get('/team/:teamId', requireAuth, getMessages);

// POST /api/chat/classify – classify a message without storing it
router.post('/classify', requireAuth, classifySingle);

export default router;
