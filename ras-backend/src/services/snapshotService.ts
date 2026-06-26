import { supabaseAdmin } from '../config/supabase';

interface SnapshotFiles {
  [filePath: string]: string;
}

export const saveSnapshot = async (teamId: string, candidateId: string, files: SnapshotFiles) => {
  if (!files || Object.keys(files).length === 0) throw new Error('No files provided');

  const { data, error } = await supabaseAdmin
    .from('code_snapshots')
    .insert([{ team_id: teamId, candidate_id: candidateId, files }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getSnapshotsByTeam = async (teamId: string, requesterId: string) => {
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('assessment:assessments!inner(employer_id)')
    .eq('id', teamId)
    .single();

  if (teamError || !team) throw new Error('Team not found');

  const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
  const isEmployer = assessment.employer_id === requesterId;

  const { data: member, error: memberError } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('candidate_id', requesterId)
    .single();

  if (!isEmployer && (memberError || !member)) throw new Error('Access denied');

  const { data, error } = await supabaseAdmin
    .from('code_snapshots')
    .select('*')
    .eq('team_id', teamId)
    .order('snapshot_time', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getSnapshotById = async (snapshotId: string, requesterId: string) => {
  const { data, error } = await supabaseAdmin
    .from('code_snapshots')
    .select('*, team:teams!inner(assessment:assessments!inner(employer_id))')
    .eq('id', snapshotId)
    .single();

  if (error || !data) throw new Error('Snapshot not found');

  const assessment = Array.isArray(data.team.assessment) ? data.team.assessment[0] : data.team.assessment;

  const { data: member, error: memberError } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('team_id', data.team_id)
    .eq('candidate_id', requesterId)
    .single();

  const isMember = !memberError && !!member;

  if (assessment.employer_id !== requesterId && !isMember) throw new Error('Access denied');

  return data;
};
