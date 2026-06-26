import { supabaseAdmin } from '../config/supabase';
import { computeTFIDFSimilarity } from './vectorSearch';
import logger from '../utils/logger';

const TECH_SKILL_EMBEDDINGS: Record<string, string[]> = {
  frontend: ['react', 'vue', 'angular', 'typescript', 'javascript', 'html', 'css', 'webpack', 'babel', 'redux', 'nextjs', 'nuxt', 'svelte', 'tailwind', 'bootstrap', 'sass', 'less', 'jquery', 'figma'],
  backend: ['node', 'express', 'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'go', 'rust', 'ruby', 'rails', 'php', 'laravel', 'csharp', 'dotnet', 'graphql', 'rest'],
  devops: ['docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'github', 'gitlab', 'ci', 'cd', 'aws', 'azure', 'gcp', 'linux', 'nginx', 'prometheus', 'grafana'],
  fullstack: ['react', 'node', 'typescript', 'javascript', 'postgres', 'mongodb', 'redis', 'docker', 'aws', 'graphql', 'rest', 'css', 'html'],
  mobile: ['react', 'native', 'flutter', 'dart', 'swift', 'kotlin', 'android', 'ios', 'xcode', 'app', 'mobile', 'swiftui', 'jetpack'],
};

export interface MatchResult {
  overallScore: number;
  skillScore: number;
  semanticScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeText: string;
}

export async function computeResumeMatch(
  resumeText: string,
  jobTags: string[],
  jobDescription: string,
  techTrack: string
): Promise<MatchResult> {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const trackSkills = TECH_SKILL_EMBEDDINGS[techTrack] || [];
  const allRequiredSkills = new Set([...jobTags.map(t => t.toLowerCase()), ...trackSkills]);

  // Skill matching
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of allRequiredSkills) {
    if (resumeLower.includes(skill.toLowerCase()) || jdLower.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const totalSkills = allRequiredSkills.size;
  const skillScore = totalSkills > 0 ? matchedSkills.length / totalSkills : 0;

  // Semantic TF-IDF similarity between resume and job description
  const semanticScore = computeTFIDFSimilarity(resumeText, jdDescription(jobDescription, jobTags));

  // Experience/Tenure heuristic
  const yearMatches = resumeLower.match(/\b(\d+)\+?\s*(?:years?|yrs?)\b/gi);
  const yearsExp = yearMatches
    ? Math.max(...yearMatches.map(m => parseInt(m.match(/\d+/)?.[0] || '0', 10)))
    : 0;

  const seniorityBonus = yearsExp >= 5 ? 0.1 : yearsExp >= 2 ? 0.05 : 0;

  // Overall score (weighted)
  const overallScore = Math.min(
    skillScore * 0.6 + semanticScore * 0.3 + seniorityBonus,
    1.0
  );

  return {
    overallScore: Math.round(overallScore * 100),
    skillScore: Math.round(skillScore * 100),
    semanticScore: Math.round(semanticScore * 100),
    matchedSkills,
    missingSkills,
    resumeText: resumeText.substring(0, 500),
  };
}

function jdDescription(description: string, tags: string[]): string {
  return `${description} ${tags.join(' ')}`.trim();
}

export async function getResumeMatchForJob(
  candidateId: string,
  jobId: string
): Promise<MatchResult | null> {
  try {
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('sanitized_text')
      .eq('candidate_id', candidateId)
      .single();

    if (!resume?.sanitized_text) return null;

    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('description, tags, tech_track')
      .eq('id', jobId)
      .single();

    if (!job) return null;

    return computeResumeMatch(
      resume.sanitized_text,
      job.tags || [],
      job.description || '',
      job.tech_track || 'fullstack'
    );
  } catch (err) {
    logger.error('Resume match error:', err);
    return null;
  }
}

export async function getResumeMatchForAssessment(
  candidateId: string,
  assessmentId: string
): Promise<MatchResult | null> {
  try {
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('sanitized_text')
      .eq('candidate_id', candidateId)
      .single();

    if (!resume?.sanitized_text) return null;

    const { data: assessment } = await supabaseAdmin
      .from('assessments')
      .select('jd_text, extracted_skills, tech_track')
      .eq('id', assessmentId)
      .single();

    if (!assessment) return null;

    return computeResumeMatch(
      resume.sanitized_text,
      assessment.extracted_skills || [],
      assessment.jd_text || '',
      assessment.tech_track || 'fullstack'
    );
  } catch (err) {
    logger.error('Resume match error:', err);
    return null;
  }
}
