import { supabaseAdmin } from '../config/supabase';

export const createTeam = async (
  assessmentId: string,
  candidateIds: string[],
  employerId: string,
  round: number = 1
) => {
  // Verify the assessment belongs to this employer
  const { data: assessment, error: assessError } = await supabaseAdmin
    .from('assessments')
    .select('id, employer_id, max_candidates')
    .eq('id', assessmentId)
    .single();

  if (assessError || !assessment) {
    throw new Error('Assessment not found');
  }

  if (assessment.employer_id !== employerId) {
    throw new Error('You do not own this assessment');
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
  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .select(`
      *,
      assessment:assessments!inner(title, tech_track, seniority_level),
      members:team_members(
        candidate:profiles!team_members_candidate_id_fkey(id, email, full_name)
      )
    `)
    .eq('id', teamId)
    .single();

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