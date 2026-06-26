import { supabaseAdmin } from '../config/supabase';

export const createTeam = async (
  assessmentId: string,
  candidateIds: string[],
  employerId: string,
  round: number = 1
) => {
  // Verify the assessment belongs to this employer and has matching round
  let assessment: any = null;
  let assessError: any = null;

  const initialQuery = await supabaseAdmin
    .from('assessments')
    .select('id, employer_id, max_candidates, round, title')
    .eq('id', assessmentId)
    .single();

  if (initialQuery.error && initialQuery.error.message.includes('round')) {
    // Fallback if 'round' column is missing from the database
    const fallbackQuery = await supabaseAdmin
      .from('assessments')
      .select('id, employer_id, max_candidates, title')
      .eq('id', assessmentId)
      .single();
    
    if (fallbackQuery.error) {
      assessError = fallbackQuery.error;
    } else {
      assessment = {
        ...fallbackQuery.data,
        round: 1 // Default to round 1 if missing
      };
    }
  } else {
    assessError = initialQuery.error;
    assessment = initialQuery.data;
  }

  if (assessError || !assessment) {
    throw new Error('Assessment not found');
  }

  if (assessment.employer_id !== employerId) {
    throw new Error('You do not own this assessment');
  }

  // Validate round consistency: assessment round must match team round
  const isAssessmentRound2 = assessment.title?.includes('Round 2');
  const effectiveAssessmentRound = isAssessmentRound2 ? 2 : (assessment.round || 1);
  if (effectiveAssessmentRound !== round) {
    throw new Error(`Assessment round (${effectiveAssessmentRound}) does not match requested team round (${round}). Use the correct assessment for this round.`);
  }

  // Validate round progression: candidates must have completed Round 1 before joining Round 2
  if (round === 2) {
    const { data: jobApps } = await supabaseAdmin
      .from('job_applications')
      .select('candidate_id, status')
      .in('candidate_id', candidateIds);

    if (jobApps) {
      for (const app of jobApps) {
        if (!['round1_completed', 'round2_scheduled'].includes(app.status)) {
          throw new Error(`Candidate ${app.candidate_id} has not completed Round 1 (status: ${app.status}). Round 2 requires prior Round 1 completion.`);
        }
      }
    }
  }

  // Check candidate count
  if (candidateIds.length > assessment.max_candidates) {
    throw new Error(`Maximum ${assessment.max_candidates} candidates allowed per team`);
  }

  if (candidateIds.length < 1) {
    throw new Error('At least 1 candidate is required to form a team');
  }

  // Create the team
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .insert([{
      assessment_id: assessmentId,
      status: 'pending',
      round: round
    }])
    .select()
    .single();

  if (teamError || !team) {
    throw new Error(teamError?.message || 'Error creating team');
  }

  // Map candidates to team_members
  const members = candidateIds.map(candidateId => ({
    team_id: team.id,
    candidate_id: candidateId
  }));

  const { error: membersError } = await supabaseAdmin
    .from('team_members')
    .insert(members);

  if (membersError) {
    // Rollback: delete the team if members insertion fails
    await supabaseAdmin.from('teams').delete().eq('id', team.id);
    throw new Error(membersError.message);
  }

  // Return team with members
  return getTeamById(team.id);
};

export const getTeamById = async (teamId: string) => {
  let team: any = null;
  let error: any = null;

  const initialQuery = await supabaseAdmin
    .from('teams')
    .select(`
      *,
      assessment:assessments!inner(title, tech_track, seniority_level, files, round),
      members:team_members(
        candidate:profiles!team_members_candidate_id_fkey(id, email, full_name)
      )
    `)
    .eq('id', teamId)
    .single();

  if (initialQuery.error && initialQuery.error.message.includes('round')) {
    // Fallback if 'round' column is missing from assessments
    const fallbackQuery = await supabaseAdmin
      .from('teams')
      .select(`
        *,
        assessment:assessments!inner(title, tech_track, seniority_level, files),
        members:team_members(
          candidate:profiles!team_members_candidate_id_fkey(id, email, full_name)
        )
      `)
      .eq('id', teamId)
      .single();

    if (!fallbackQuery.error && fallbackQuery.data) {
      team = fallbackQuery.data;
      if (team && team.assessment) {
        team.assessment.round = 1;
      }
    } else {
      error = fallbackQuery.error;
    }
  } else {
    team = initialQuery.data;
    error = initialQuery.error;
  }

  if (error) throw new Error(error.message);
  return team;
};

export const startSession = async (teamId: string, employerId: string) => {
  const { data: team, error: getError } = await supabaseAdmin
    .from('teams')
    .select('assessment:assessments!inner(employer_id)')
    .eq('id', teamId)
    .single();

  if (getError || !team) throw new Error('Team not found');
  const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
  if (assessment.employer_id !== employerId) {
    throw new Error('You do not own this assessment');
  }

  // Update status to active
  const { data, error } = await supabaseAdmin
    .from('teams')
    .update({
      status: 'active',
      session_start: new Date().toISOString()
    })
    .eq('id', teamId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const endSession = async (teamId: string, employerId: string) => {
  const { data: team, error: getError } = await supabaseAdmin
    .from('teams')
    .select('assessment:assessments!inner(employer_id)')
    .eq('id', teamId)
    .single();

  if (getError || !team) throw new Error('Team not found');
  const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
  if (assessment.employer_id !== employerId) {
    throw new Error('You do not own this assessment');
  }

  // Update status to completed
  const { data, error } = await supabaseAdmin
    .from('teams')
    .update({
      status: 'completed',
      session_end: new Date().toISOString()
    })
    .eq('id', teamId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getTeamsByAssessment = async (assessmentId: string, employerId: string) => {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .select(`
      *,
      members:team_members(
        candidate:profiles!team_members_candidate_id_fkey(id, email, full_name)
      )
    `)
    .eq('assessment_id', assessmentId);

  if (error) throw new Error(error.message);

  // Verify ownership (optional – we can filter server-side)
  return data;
};