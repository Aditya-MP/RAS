import { supabaseAdmin } from '../config/supabase';
import { getCalibratedScore } from './peerReviewService';
import { getChaosMetrics } from './chaosService';
import { getCandidateInfluenceScores } from './gitAnalysisService';
import { createTeam } from './teamService';
import { analyzeKeystrokeAnomaly, KeystrokeFeatures } from './anomalyDetectionService';
import { createAssessment } from './assessmentService';

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
  // Fetch team details first
  const { data: team, error: teamError } = await supabaseAdmin
    .from('teams')
    .select('round, assessment_id, assessment:assessments(id, employer_id, title, description, jd_text, seniority_level, tech_track, extracted_skills, max_candidates)')
    .eq('id', teamId)
    .single();

  if (teamError || !team) {
    throw new Error('Team not found or error loading details');
  }

  const assessment = Array.isArray(team.assessment) ? team.assessment[0] : team.assessment;
  const employerId = assessment.employer_id;
  const teamRound = team.round || 1;

  // Fetch job matching this assessment to update applications
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .select('id, title, company, employer_id')
    .eq('assessment_id', assessment.id)
    .single();

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
    const events = eventsByCandidate[candidateId];    // Helper to safely extract event_data from either flat or parent-child structures
    const getEventData = (e: any) => {
      if (e.event_data && e.event_data.child && e.event_data.child.data) {
        return e.event_data.child.data;
      }
      return e.event_data || {};
    };

    // --- Coding Correctness ---
    const testEvents = events.filter(e =>
      e.event_class === 'EV_TRM' &&
      (getEventData(e).command?.includes('test') ||
        getEventData(e).command?.includes('pytest') ||
        getEventData(e).command?.includes('jest'))
    );
    let testPasses = 0, testFails = 0;
    for (const ev of testEvents) {
      const data = getEventData(ev);
      if (data.exit_code === 0) testPasses++;
      else if (data.exit_code !== undefined) testFails++;
    }
    const totalTests = testPasses + testFails;
    const codingCorrectness = totalTests > 0 ? testPasses / totalTests : 0.5;

    // --- AI Collaboration Fluency ---
    // Count only parent prompts (those that do not have a parent_id field)
    const promptEvents = events.filter(e => e.event_class === 'EV_PRM' && !e.event_data?.parent_id);
    const acceptEvents = events.filter(e => {
      const data = getEventData(e);
      return e.event_class === 'EV_ACP' && data.acceptance === true;
    });
    const manualEdits = events.filter(e => 
      e.event_class === 'EV_KBD' || e.event_data?.child?.activity_category === 'keystroke'
    );
    const totalPrompts = promptEvents.length;
    const totalAccepts = acceptEvents.length;

    let aiFluency = 0.5;
    if (totalPrompts > 0) {
      const acceptRatio = Math.min(totalAccepts / totalPrompts, 1.0);
      const firstAcceptTs = getEventData(acceptEvents[0] || {}).timestamp_ms || 0;
      const manualAfterAccept = events.filter(e => {
        const isKbd = e.event_class === 'EV_KBD' || e.event_data?.child?.activity_category === 'keystroke';
        return isKbd && (getEventData(e).timestamp_ms || 0) > firstAcceptTs;
      }).length;
      const verificationScore = Math.min(manualAfterAccept / (totalAccepts + 1), 0.3);
      aiFluency = 0.4 + 0.3 * acceptRatio + 0.3 * verificationScore;
    }

    // --- Keystroke Integrity (ML-based anomaly detection) ---
    const kbdEvents = events.filter(e => e.event_class === 'EV_KBD' || e.event_data?.child?.activity_category === 'keystroke');
    const pasteEvents = events.filter(e => e.event_class === 'EV_PST' || e.event_data?.child?.activity_category === 'paste');
    const blurEvents = events.filter(e => e.event_class === 'EV_BLR' || e.event_data?.child?.activity_category === 'focus_loss');

    const dwellTimes: number[] = [];
    const flightTimes: number[] = [];
    for (let i = 0; i < kbdEvents.length; i++) {
      const ev = kbdEvents[i];
      const data = getEventData(ev);
      if (data.dwell_time_ms) dwellTimes.push(data.dwell_time_ms);
      if (i > 0) {
        const prevData = getEventData(kbdEvents[i - 1]);
        if (data.timestamp_ms && prevData.timestamp_ms) {
          flightTimes.push(data.timestamp_ms - prevData.timestamp_ms);
        }
      }
    }

    const focusLossCount = blurEvents.filter(e => getEventData(e).blur_duration_ms).length;
    const focusLossDuration = blurEvents.reduce((acc, e) => acc + (getEventData(e).blur_duration_ms || 0), 0);
    const domInjections = blurEvents.filter(e => getEventData(e).untrusted_injection === true).length;
    const hardwareEvent = blurEvents.find(e => getEventData(e).target_app === 'hardware_signature');
    const fingerprint = hardwareEvent ? (getEventData(hardwareEvent).hardware_fingerprint || '') : '';
    const isVm = /virtualbox|vmware|swiftshader|software|basic render/i.test(fingerprint);

    const features: KeystrokeFeatures = {
      dwellTimes,
      flightTimes,
      pasteEvents: pasteEvents.length,
      totalEvents: kbdEvents.length,
      focusLossCount,
      focusLossDuration,
      domInjections,
      virtualMachineHash: isVm
    };

    const anomalyResult = analyzeKeystrokeAnomaly(features);
    const integrity = anomalyResult.integrityScore;

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
        proctoring: {
          focus_loss_count: focusLossCount,
          focus_loss_duration_ms: focusLossDuration,
          dom_injections_detected: domInjections,
          is_virtual_machine: isVm,
          fingerprint: fingerprint
        },
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

    // Update job application status and notify candidates autonomously
    if (job) {
      const isPromoted = finalPercentile >= 80;
      let newStatus = 'rejected';
      
      if (isPromoted) {
        newStatus = teamRound === 1 ? 'round2_scheduled' : 'shortlisted_for_hr';
      }

      if (newStatus === 'round2_scheduled') {
        // First set proper status transitions
        await supabaseAdmin
          .from('job_applications')
          .update({ status: 'round1_completed' })
          .eq('job_id', job.id)
          .eq('candidate_id', candidateId);

        // Create a NEW Round 2-specific assessment with harder AI-generated challenges
        const r2Assessment = await createAssessment(employerId, {
          title: `${job.title} - Round 2 (Advanced)`,
          description: `Advanced Round 2 assessment for ${job.title}. The candidate scored ${finalPercentile}% in Round 1.`,
          jd_text: assessment.jd_text || job.title || '',
          seniority_level: assessment.seniority_level || 'mid',
          tech_track: assessment.tech_track || 'fullstack',
          max_candidates: 5,
          round: 2
        });

        // Form a Round 2 Team chamber linked to the new Round 2 assessment
        const r2Team = await createTeam(r2Assessment.id, [candidateId], job.employer_id || employerId, 2);

        // Update job application to round2_scheduled
        await supabaseAdmin
          .from('job_applications')
          .update({ status: 'round2_scheduled' })
          .eq('job_id', job.id)
          .eq('candidate_id', candidateId);
        
        await supabaseAdmin.from('notifications').insert([{
          sender_id: job?.employer_id || employerId,
          recipient_id: candidateId,
          title: `Promoted to Round 2: ${job.title}`,
          message: `Congratulations! You scored ${finalPercentile}% in Round 1. AI HireHub has scheduled you for Round 2 (Advanced Stack-Specific Sandbox). Join Sandbox with UID: ${r2Team.id}.`,
          type: 'success',
          metadata: {
            uid: r2Team.id,
            assessment_id: r2Assessment.id,
            job_id: job.id,
            job_title: job.title,
            round: 2
          }
        }]);
      } else if (newStatus === 'shortlisted_for_hr') {
        // Set status to round2_completed first before shortlisting
        await supabaseAdmin
          .from('job_applications')
          .update({ status: 'round2_completed' })
          .eq('job_id', job.id)
          .eq('candidate_id', candidateId);

        await supabaseAdmin
          .from('job_applications')
          .update({ status: 'shortlisted_for_hr' })
          .eq('job_id', job.id)
          .eq('candidate_id', candidateId);

        await supabaseAdmin.from('notifications').insert([{
          sender_id: job?.employer_id || employerId,
          recipient_id: candidateId,
          title: `Shortlisted for HR Round: ${job.title}`,
          message: `Outstanding! You scored ${finalPercentile}% in Round 2 Advanced Sandbox. Your application has been shortlisted for the final HR round.`,
          type: 'success',
          metadata: {
            job_id: job.id,
            job_title: job.title
          }
        }]);
      } else {
        // Rejected — set proper completion status before rejection
        const completedStatus = teamRound === 1 ? 'round1_completed' : 'round2_completed';
        await supabaseAdmin
          .from('job_applications')
          .update({ status: completedStatus })
          .eq('job_id', job.id)
          .eq('candidate_id', candidateId);

        await supabaseAdmin
          .from('job_applications')
          .update({ status: 'rejected' })
          .eq('job_id', job.id)
          .eq('candidate_id', candidateId);

        await supabaseAdmin.from('notifications').insert([{
          sender_id: job?.employer_id || employerId,
          recipient_id: candidateId,
          title: `Application Update: ${job.title}`,
          message: `Thank you for completing the Round ${teamRound} evaluation. Unfortunately, your profile was not promoted. Feedback: Focus on improving collaboration fluency and telemetry consistency.`,
          type: 'info',
          metadata: {
            job_id: job.id,
            job_title: job.title
          }
        }]);
      }
    }

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
