import { supabaseAdmin } from '../config/supabase';

interface ReviewInput {
  teamId: string;
  targetId: string;
  technicalContribution: number;
  communicationRigor: number;
  problemSolvingSupport: number;
  comments?: string;
}

export const submitReview = async (reviewerId: string, input: ReviewInput) => {
  const { teamId, targetId, technicalContribution, communicationRigor, problemSolvingSupport, comments } = input;

  for (const val of [technicalContribution, communicationRigor, problemSolvingSupport]) {
    if (val < 1 || val > 5) throw new Error('All ratings must be between 1 and 5');
  }

  if (reviewerId === targetId) throw new Error('You cannot review yourself');

  const [{ data: reviewerTeam, error: rError }, { data: targetTeam, error: tError }] = await Promise.all([
    supabaseAdmin.from('team_members').select('id').eq('team_id', teamId).eq('candidate_id', reviewerId).single(),
    supabaseAdmin.from('team_members').select('id').eq('team_id', teamId).eq('candidate_id', targetId).single(),
  ]);

  if (rError || !reviewerTeam) throw new Error('Reviewer is not a member of this team');
  if (tError || !targetTeam) throw new Error('Target is not a member of this team');

  const { data, error } = await supabaseAdmin
    .from('peer_reviews')
    .upsert([{
      team_id: teamId,
      reviewer_id: reviewerId,
      target_id: targetId,
      technical_contribution: technicalContribution,
      communication_rigor: communicationRigor,
      problem_solving_support: problemSolvingSupport,
      comments: comments || '',
    }], { onConflict: 'team_id,reviewer_id,target_id' })
    .select('*, reviewer:profiles!peer_reviews_reviewer_id_fkey(email, full_name)')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getTeamReviews = async (teamId: string, requesterId: string) => {
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('assessment:assessments!inner(employer_id)')
    .eq('id', teamId)
    .single();

  if (teamError || !team) throw new Error('Team not found');

  const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
  const isEmployer = assessment.employer_id === requesterId;

  const { data: member, error: memberError } = await supabaseAdmin
    .from('team_members').select('id').eq('team_id', teamId).eq('candidate_id', requesterId).single();

  if (!isEmployer && (memberError || !member)) throw new Error('Access denied');

  const { data, error } = await supabaseAdmin
    .from('peer_reviews')
    .select('*, reviewer:profiles!peer_reviews_reviewer_id_fkey(email, full_name), target:profiles!peer_reviews_target_id_fkey(email, full_name)')
    .eq('team_id', teamId);

  if (error) throw new Error(error.message);
  return data;
};

export const getCandidateReviews = async (candidateId: string, requesterId: string) => {
  if (candidateId !== requesterId) {
    const { data: reviews, error } = await supabaseAdmin
      .from('peer_reviews')
      .select('team:teams!inner(assessment:assessments!inner(employer_id))')
      .eq('target_id', candidateId)
      .limit(1);

    if (error || !reviews || reviews.length === 0) throw new Error('No reviews found or access denied');

    const team = reviews[0].team as any;
    const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
    if (assessment.employer_id !== requesterId) throw new Error('Access denied');
  }

  const { data, error } = await supabaseAdmin
    .from('peer_reviews')
    .select('*, reviewer:profiles!peer_reviews_reviewer_id_fkey(email, full_name)')
    .eq('target_id', candidateId);

  if (error) throw new Error(error.message);
  return data;
};

export const calculateBiasQuotient = async (reviewerId: string, teamId: string): Promise<number> => {
  const { data: allReviews, error } = await supabaseAdmin
    .from('peer_reviews')
    .select('reviewer_id, technical_contribution, communication_rigor, problem_solving_support')
    .eq('team_id', teamId);

  if (error || !allReviews || allReviews.length === 0) return 0;

  const reviewerAvg: { [key: string]: number } = {};
  for (const rev of allReviews) {
    const a = (rev.technical_contribution + rev.communication_rigor + rev.problem_solving_support) / 3;
    reviewerAvg[rev.reviewer_id] = (reviewerAvg[rev.reviewer_id] || 0) + a;
  }
  for (const key of Object.keys(reviewerAvg)) {
    reviewerAvg[key] /= allReviews.filter(r => r.reviewer_id === key).length;
  }

  const teamAvg = Object.values(reviewerAvg).reduce((a, b) => a + b, 0) / Object.values(reviewerAvg).length;
  const deviation = Math.abs((reviewerAvg[reviewerId] ?? teamAvg) - teamAvg) / 4;
  return Math.min(deviation, 1.0);
};

export const getCalibratedScore = async (candidateId: string, teamId: string) => {
  const { data: reviews, error } = await supabaseAdmin
    .from('peer_reviews')
    .select('reviewer_id, technical_contribution, communication_rigor, problem_solving_support')
    .eq('team_id', teamId)
    .eq('target_id', candidateId);

  if (error || !reviews || reviews.length === 0) return { score: 0, raw: 0, biasAdjustment: 0 };

  const rawAvg = reviews.reduce((sum, r) =>
    sum + (r.technical_contribution + r.communication_rigor + r.problem_solving_support) / 3, 0) / reviews.length;

  const biases = await Promise.all(reviews.map(r => calculateBiasQuotient(r.reviewer_id, teamId)));
  const adjustedAvg = reviews.reduce((sum, r, i) => {
    const a = (r.technical_contribution + r.communication_rigor + r.problem_solving_support) / 3;
    return sum + a * (1 - biases[i] * 0.5);
  }, 0) / reviews.length;

  return {
    score: Math.min(adjustedAvg / 5, 1.0),
    raw: rawAvg / 5,
    biasAdjustment: (rawAvg - adjustedAvg) / 5,
  };
};
