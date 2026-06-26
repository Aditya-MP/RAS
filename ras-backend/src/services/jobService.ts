import { supabaseAdmin } from '../config/supabase';
import { createTeam } from './teamService';
import { createNotification } from './notificationService';
import { generatePersonalizedNotification } from './geminiService';
import { createAssessment } from './assessmentService';
import logger from '../utils/logger';

export interface JobPayload {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  tags: string[];
  tech_track: string;
  seniority_level: string;
  assessment_id?: string;
  deadline?: string;
}

export const createJob = async (employerId: string, payload: JobPayload) => {
  const { title, company, location, salary, description, tags, tech_track, seniority_level, assessment_id, deadline } = payload;

  if (!title || !company || !description) {
    throw new Error('Missing required fields: title, company, description');
  }

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .insert([{ 
      employer_id: employerId, 
      title, 
      company, 
      location, 
      salary, 
      description, 
      tags, 
      tech_track, 
      seniority_level,
      assessment_id: assessment_id || null,
      status: 'open',
      deadline: deadline || null
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getJobs = async (employerId?: string) => {
  let query = supabaseAdmin
    .from('jobs')
    .select('*, employer:profiles!jobs_employer_id_fkey(full_name, email), job_applications(candidate_id)')
    .order('created_at', { ascending: false });

  if (employerId) query = query.eq('employer_id', employerId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return data.map((job: any) => {
    let currentStatus = job.status;
    if (job.status === 'open' && job.deadline && new Date() > new Date(job.deadline)) {
      currentStatus = 'closed';
      supabaseAdmin
        .from('jobs')
        .update({ status: 'closed' })
        .eq('id', job.id)
        .then(({ error: updateErr }) => {
          if (updateErr) logger.error(`Failed to auto-expire job ${job.id}: ${updateErr.message}`);
          else logger.info(`Auto-expired job ${job.id} on deadline match`);
        });
    }
    const apps = job.job_applications || [];
    return {
      ...job,
      status: currentStatus,
      applicationCount: apps.length,
      job_applications: undefined
    };
  });
};

export const deleteJob = async (jobId: string, employerId: string) => {
  const { error } = await supabaseAdmin
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('employer_id', employerId);

  if (error) throw new Error(error.message);
};

export const createJobApplication = async (jobId: string, candidateId: string) => {
  // Check if job exists and is open
  const { data: job, error: jobErr } = await supabaseAdmin
    .from('jobs')
    .select('id, status, deadline')
    .eq('id', jobId)
    .single();

  if (jobErr || !job) {
    throw new Error('Job not found');
  }

  if (job.status === 'closed' || (job.deadline && new Date() > new Date(job.deadline))) {
    throw new Error('This job posting is closed and no longer accepting applications');
  }

  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .insert([{ job_id: jobId, candidate_id: candidateId }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('You have already applied to this job');
    }
    throw new Error(error.message);
  }
  return data;
};

export const getApplicationsForCandidate = async (candidateId: string) => {
  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .select('*, job:jobs(title, company, location, salary, status)')
    .eq('candidate_id', candidateId);

  if (error) throw new Error(error.message);
  return data;
};

export const closeJob = async (jobId: string, employerId: string) => {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .update({ status: 'closed' })
    .eq('id', jobId)
    .eq('employer_id', employerId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const scheduleJobAndFormTeams = async (
  jobId: string,
  employerId: string,
  timeSlot: string
) => {
  // 1. Fetch job
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .select('*, employer:profiles!jobs_employer_id_fkey(full_name, email)')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    throw new Error('Job not found');
  }

  if (job.employer_id !== employerId) {
    throw new Error('You do not own this job posting');
  }

  // Automatically create a tailored assessment challenge for this job posting if none is linked
  if (!job.assessment_id) {
    const autoAssessment = await createAssessment(employerId, {
      title: `${job.title} Assessment Challenge`,
      description: `Automatically generated assessment challenge for the position of ${job.title}.`,
      jd_text: job.description || 'Job description assessment challenge',
      seniority_level: job.seniority_level || 'mid',
      tech_track: job.tech_track || 'fullstack',
      max_candidates: 5
    });

    // Link it to the job
    const { error: updateError } = await supabaseAdmin
      .from('jobs')
      .update({ assessment_id: autoAssessment.id })
      .eq('id', jobId);
    
    if (updateError) throw new Error(updateError.message);
    job.assessment_id = autoAssessment.id;
  }

  // 2. Fetch candidates who applied
  const { data: applications, error: appsError } = await supabaseAdmin
    .from('job_applications')
    .select('candidate_id')
    .eq('job_id', jobId);

  if (appsError) {
    throw new Error(appsError.message);
  }

  const candidateIds = (applications || []).map((app: any) => app.candidate_id);

  if (candidateIds.length === 0) {
    throw new Error('No candidates have applied to this job posting yet');
  }

  // 3. Shuffle candidate list for random team formation
  const shuffledCandidates = [...candidateIds];
  for (let i = shuffledCandidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCandidates[i], shuffledCandidates[j]] = [shuffledCandidates[j], shuffledCandidates[i]];
  }

  // 4. Determine division/group size
  const N = shuffledCandidates.length;
  let k = Math.round(N / 4);
  if (k < 1) k = 1;

  const groups: string[][] = [];
  const baseSize = Math.floor(N / k);
  const remainder = N % k;
  let startIndex = 0;
  for (let i = 0; i < k; i++) {
    const groupSize = baseSize + (i < remainder ? 1 : 0);
    groups.push(shuffledCandidates.slice(startIndex, startIndex + groupSize));
    startIndex += groupSize;
  }

  // Fetch profiles of candidates to get their full names
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')
    .in('id', candidateIds);

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  const profileMap = new Map<string, string>();
  for (const p of (profiles || [])) {
    profileMap.set(p.id, p.full_name || 'Candidate');
  }

  const createdTeams = [];

  // 5. Form teams and notify candidates
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const team = await createTeam(job.assessment_id, group, employerId);

    // Create notifications for each participant in the group
    for (const candidateId of group) {
      const candidateName = profileMap.get(candidateId) || 'Candidate';
      
      // Call AI to generate personalized notification title/message
      const aiNotif = await generatePersonalizedNotification(
        candidateName,
        job.title,
        job.company,
        timeSlot,
        team.id
      );

      await createNotification(employerId, {
        recipient_id: candidateId,
        title: aiNotif.title,
        message: aiNotif.message,
        type: 'alert',
        metadata: {
          uid: team.id,
          time_slot: timeSlot,
          job_id: jobId,
          job_title: job.title
        }
      });
    }

    createdTeams.push(team);
  }

  // 6. Close the job posting since scheduling is done
  await supabaseAdmin
    .from('jobs')
    .update({ status: 'closed' })
    .eq('id', jobId);

  return {
    teams: createdTeams,
    candidateCount: N,
    teamCount: createdTeams.length,
    assessmentId: job.assessment_id
  };
};

