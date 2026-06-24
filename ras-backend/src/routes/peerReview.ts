import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { submit, getTeamReviewsList, getCandidateReviewsList, getCalibratedPeerScore } from '../controllers/peerReviewController';

const router = Router();

router.post('/submit', requireAuth, submit);
router.get('/team/:teamId', requireAuth, getTeamReviewsList);
router.get('/candidate/:candidateId', requireAuth, getCandidateReviewsList);
router.get('/calibrated/:candidateId/team/:teamId', requireAuth, getCalibratedPeerScore);

export default router;
