import { supabaseAdmin } from '../config/supabase';
import { scheduleJobAndFormTeams } from './jobService';
import logger from '../utils/logger';

export const startJobExpiryScheduler = () => {
  logger.info('Starting Autonomous Job Expiry and Scheduling Daemon...');
  
  setInterval(async () => {
    try {
      const now = new Date().toISOString();
      // Fetch open jobs whose deadline has passed
      const { data: expiredJobs, error } = await supabaseAdmin
        .from('jobs')
        .select('id, employer_id, title')
        .eq('status', 'open')
        .lt('deadline', now);

      if (error) {
        logger.error(`Error querying expired jobs: ${error.message}`);
        return;
      }

      if (expiredJobs && expiredJobs.length > 0) {
        for (const job of expiredJobs) {
          // Immediately close the job posting in the database to prevent duplicate scheduling
          const { error: closeErr } = await supabaseAdmin
            .from('jobs')
            .update({ status: 'closed' })
            .eq('id', job.id);

          if (closeErr) {
            logger.error(`Autonomous Orchestrator: Failed to close/lock job ${job.id}: ${closeErr.message}`);
            continue;
          }

          logger.info(`Autonomous Orchestrator: Job "${job.title}" (${job.id}) has reached its deadline. Auto-scheduling assessments...`);
          try {
            // Check if there are applications before scheduling
            const { data: apps, error: countErr } = await supabaseAdmin
              .from('job_applications')
              .select('id')
              .eq('job_id', job.id);

            if (countErr) {
              logger.error(`Failed to check applications for job ${job.id}: ${countErr.message}`);
              continue;
            }

            if (apps && apps.length > 0) {
              const timeSlot = "Tomorrow at 10:00 AM";
              const result = await scheduleJobAndFormTeams(job.id, job.employer_id, timeSlot);
              logger.info(`Autonomous Orchestrator: Successfully scheduled job "${job.title}". Formed ${result.teamCount} teams for ${result.candidateCount} candidates.`);
            } else {
              logger.info(`Autonomous Orchestrator: Closed job "${job.title}" (no applicants).`);
            }
          } catch (schedErr: any) {
            logger.error(`Autonomous Orchestrator: Failed to schedule job ${job.id}: ${schedErr.message}`);
          }
        }
      }
    } catch (err: any) {
      logger.error(`Job expiry daemon error: ${err.message}`);
    }
  }, 10000); // Check every 10 seconds
};
