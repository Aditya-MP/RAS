import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { supabaseAdmin } from '../config/supabase';
import {
  create,
  getOne,
  start,
  end,
  listByAssessment
} from '../controllers/teamController';

const router = Router();

// POST /api/teams – create (employer only)
router.post('/', requireAuth, requireRole(['employer', 'admin']), create);

// GET /api/teams/my-teams – list teams for the logged-in candidate
router.get('/my-teams', requireAuth, async (req, res) => {
  try {
    const candidateId = req.user!.id;
    const { data: memberships, error } = await supabaseAdmin
      .from('team_members')
      .select(`
        team:teams(
          id,
          status,
          session_start,
          session_end,
          assessment:assessments(id, title, tech_track, seniority_level)
        )
      `)
      .eq('candidate_id', candidateId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const teams = memberships ? memberships.map((m: any) => m.team).filter(Boolean) : [];
    res.json({ teams });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/teams/:id – get team details (any authenticated user)
router.get('/:id', requireAuth, getOne);

// POST /api/teams/:id/start – start session (employer only)
router.post('/:id/start', requireAuth, requireRole(['employer', 'admin']), start);

// POST /api/teams/:id/end – end session (employer only)
router.post('/:id/end', requireAuth, requireRole(['employer', 'admin']), end);

// GET /api/teams/assessment/:assessmentId – list teams by assessment (employer only)
router.get('/assessment/:assessmentId', requireAuth, requireRole(['employer', 'admin']), listByAssessment);

export default router;