import { supabaseAdmin } from '../config/supabase';
import { getCalibratedScore } from './peerReviewService';
import { getChaosMetrics } from './chaosService';
import { getCandidateInfluenceScores } from './gitAnalysisService';

export const getDialogueStats = async (teamId: string, candidateId: string) => {
  const { data, error } = await supabaseAdmin
    .from('chat_messages')
    .select('dialogue_act, telemetry_correlation')
    .eq('team_id', teamId)
    .eq('candidate_id', candidateId);

  if (error) throw new Error(error.message);

  const stats = {
    total: data.length,
    offers: data.filter(d => d.dialogue_act === 'OFFER').length,
    requests: data.filter(d => d.dialogue_act === 'REQUEST_CLARIFICATION').length,
    justifications: data.filter(d => d.dialogue_act === 'JUSTIFICATION').length,
    acknowledgments: data.filter(d => d.dialogue_act === 'ACKNOWLEDGMENT').length,
    avg_correlation: data.reduce((acc, d) => acc + (d.telemetry_correlation || 0), 0) / (data.length || 1),
  };

  const softSkillScore = (
    (stats.offers * 0.3) +
    (stats.justifications * 0.3) +
    (stats.acknowledgments * 0.2) +
    (stats.avg_correlation * 0.2)
  ) / (stats.total + 1) * 10;

  return { stats, softSkillScore };
};

interface ScoringMetrics {
  coding_correctness: number;
  ai_collaboration_fluency: number;
  keystroke_integrity: number;
  final_percentile: number;
  report_json: any;
}

// Internal fetch — skips auth check, used only by scoring engine
const fetchTeamTelemetry = async (teamId: string) => {
  const { data, error } = await supabaseAdmin
    .from('telemetry_events')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

export const scoreTeam = async (teamId: string): Promise<ScoringMetrics[]> => {
  const telemetryEvents = await fetchTeamTelemetry(teamId);

  // Group events by candidate
  const eventsByCandidate: { [candidateId: string]: any[] } = {};
  for (const event of telemetryEvents) {
    if (!eventsByCandidate[event.candidate_id]) {
      eventsByCandidate[event.candidate_id] = [];
    }
    eventsByCandidate[event.candidate_id].push(event);
  }

  // Pre-fetch influence scores once for the whole team (outside candidate loop)
  let influenceMap = new Map<string, number>();
  try {
    const influenceScores = await getCandidateInfluenceScores(teamId);
    influenceMap = new Map(influenceScores.map(s => [s.candidateId, s.score]));
  } catch { /* no snapshots yet */ }

  const results: ScoringMetrics[] = [];

  for (const candidateId of Object.keys(eventsByCandidate)) {
    const events = eventsByCandidate[candidateId];

    // --- Coding Correctness ---
    const testEvents = events.filter(e =>
      e.event_class === 'EV_TRM' &&
      (e.event_data.command?.includes('test') ||
        e.event_data.command?.includes('pytest') ||
        e.event_data.command?.includes('jest'))
    );
    let testPasses = 0, testFails = 0;
    for (const ev of testEvents) {
      if (ev.event_data.exit_code === 0) testPasses++;
      else if (ev.event_data.exit_code !== undefined) testFails++;
    }
    const totalTests = testPasses + testFails;
    const codingCorrectness = totalTests > 0 ? testPasses / totalTests : 0.5;

    // --- AI Collaboration Fluency ---
    const promptEvents = events.filter(e => e.event_class === 'EV_PRM');
    const acceptEvents = events.filter(e => e.event_class === 'EV_ACP' && e.event_data.acceptance === true);
    const manualEdits = events.filter(e => e.event_class === 'EV_KBD');
    const totalPrompts = promptEvents.length;
    const totalAccepts = acceptEvents.length;

    let aiFluency = 0.5;
    if (totalPrompts > 0) {
      const acceptRatio = Math.min(totalAccepts / totalPrompts, 1.0);
      const firstAcceptTs = acceptEvents[0]?.event_data?.timestamp_ms || 0;
      const manualAfterAccept = events.filter(e =>
        e.event_class === 'EV_KBD' && e.event_data.timestamp_ms > firstAcceptTs
      ).length;
      const verificationScore = Math.min(manualAfterAccept / (totalAccepts + 1), 0.3);
      aiFluency = 0.4 + 0.3 * acceptRatio + 0.3 * verificationScore;
    }

    // --- Keystroke Integrity ---
    const kbdEvents = events.filter(e => e.event_class === 'EV_KBD');
    const dwellTimes: number[] = [];
    const flightTimes: number[] = [];
    for (let i = 0; i < kbdEvents.length; i++) {
      const ev = kbdEvents[i];
      if (ev.event_data.dwell_time_ms) dwellTimes.push(ev.event_data.dwell_time_ms);
      if (i > 0 && ev.event_data.timestamp_ms && kbdEvents[i - 1].event_data.timestamp_ms) {
        flightTimes.push(ev.event_data.timestamp_ms - kbdEvents[i - 1].event_data.timestamp_ms);
      }
    }
    let integrity = 0.5;
    if (flightTimes.length > 10) {
      const mean = avg(flightTimes);
      const variance = flightTimes.reduce((a, b) => a + (b - mean) ** 2, 0) / flightTimes.length;
      integrity = 0.2 + 0.7 * Math.min(variance / 200, 1);
    }

    // --- Dialogue Stats ---
    let softSkillScore = 0.5;
    let dialogueStats = null;
    try {
      const dialogue = await getDialogueStats(teamId, candidateId);
      softSkillScore = Math.min(dialogue.softSkillScore / 10, 1.0);
      dialogueStats = dialogue.stats;
    } catch { /* no chat messages yet */ }

    // --- Peer Review Score ---
    let peerScore = { score: 0.5, raw: 0.5, biasAdjustment: 0 };
    try {
      peerScore = await getCalibratedScore(candidateId, teamId);
    } catch { /* no peer reviews yet */ }

    // --- Chaos Resilience ---
    let chaosResilience = 0.5;
    let chaosStats = null;
    try {
      const chaos = await getChaosMetrics(teamId);
      chaosResilience = Math.min(chaos.resolutionRate * 0.6 + Math.min(1 - chaos.avgResponseTimeMs / 300000, 1) * 0.4, 1.0);
      chaosStats = chaos;
    } catch { /* no chaos events yet */ }

    // --- Architectural Influence ---
    const influenceScore = influenceMap.get(candidateId) ?? 0;

    // --- Final Percentile ---
    const finalPercentile = Math.round(
      (codingCorrectness * 0.25 +
       aiFluency * 0.20 +
       integrity * 0.15 +
       softSkillScore * 0.10 +
       peerScore.score * 0.15 +
       chaosResilience * 0.10 +
       influenceScore * 0.05) * 100
    );

    // --- Report JSON ---
    const reportJson = {
      candidate_id: candidateId,
      team_id: teamId,
      metrics: { coding_correctness: codingCorrectness, ai_collaboration_fluency: aiFluency, keystroke_integrity: integrity, soft_skill_score: softSkillScore, peer_score: peerScore.score, chaos_resilience: chaosResilience, influence_score: influenceScore, final_percentile: finalPercentile },
      details: {
        total_events: events.length,
        test_passes: testPasses,
        test_fails: testFails,
        ai_prompts: totalPrompts,
        ai_acceptances: totalAccepts,
        manual_edits: manualEdits.length,
        avg_dwell_time: avg(dwellTimes),
        avg_flight_time: avg(flightTimes),
        dialogue: dialogueStats,
        peer_review: { raw: peerScore.raw, calibrated: peerScore.score, bias_adjustment: peerScore.biasAdjustment },
        chaos: chaosStats,
        influence: { score: influenceScore, rank: influenceMap.size > 0 ? [...influenceMap.values()].sort((a, b) => b - a).indexOf(influenceScore) + 1 : null },
      },
      generated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from('reports').upsert([{
      team_id: teamId,
      candidate_id: candidateId,
      final_percentile: finalPercentile,
      coding_correctness: codingCorrectness,
      ai_collaboration_fluency: aiFluency,
      keystroke_integrity: integrity,
      soft_skill_score: softSkillScore,
      peer_score: peerScore.score,
      chaos_resilience: chaosResilience,
      influence_score: influenceScore,
      report_json: reportJson,
    }], { onConflict: 'team_id,candidate_id' });

    if (error) throw new Error(`Failed to save report: ${error.message}`);

    results.push({ coding_correctness: codingCorrectness, ai_collaboration_fluency: aiFluency, keystroke_integrity: integrity, final_percentile: finalPercentile, report_json: reportJson, soft_skill_score: softSkillScore } as any);
  }

  await supabaseAdmin.from('teams').update({ status: 'completed' }).eq('id', teamId);

  return results;
};

export const getCandidateReport = async (candidateId: string, requesterId: string) => {
  const { data: report, error } = await supabaseAdmin
    .from('reports')
    .select('*, team:teams!inner(assessment:assessments!inner(employer_id))')
    .eq('candidate_id', candidateId)
    .single();

  if (error || !report) throw new Error('Report not found');

  const assessment = Array.isArray(report.team.assessment) ? report.team.assessment[0] : report.team.assessment;
  if (candidateId !== requesterId && assessment.employer_id !== requesterId) {
    throw new Error('Access denied: only the candidate or their employer can view this report');
  }

  return report;
};

export const getTeamReports = async (teamId: string, employerId: string) => {
  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .select('assessment:assessments!inner(employer_id)')
    .eq('id', teamId)
    .single();

  if (error || !team) throw new Error('Team not found');

  const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
  if (assessment.employer_id !== employerId) throw new Error('You do not own this assessment');

  const { data, error: reportsError } = await supabaseAdmin
    .from('reports')
    .select('*, candidate:profiles!reports_candidate_id_fkey(email, full_name)')
    .eq('team_id', teamId);

  if (reportsError) throw new Error(reportsError.message);
  return data;
};
