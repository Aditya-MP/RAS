import { supabaseAdmin } from '../config/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite' });

// Fallback static skill extraction if Gemini fails
function extractSkillsStatic(text: string): string[] {
  const skillKeywords = [
    'react', 'nextjs', 'vue', 'angular', 'typescript', 'javascript',
    'node', 'express', 'nestjs', 'python', 'django', 'flask', 'fastapi',
    'java', 'spring', 'go', 'rust',
    'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'git', 'ci/cd', 'jenkins', 'terraform',
    'graphql', 'rest', 'websocket', 'kafka', 'rabbitmq'
  ];
  const lower = text.toLowerCase();
  return skillKeywords.filter(skill => lower.includes(skill));
}

// Gemini-powered skill extraction
async function extractSkillsWithGemini(jdText: string): Promise<string[]> {
  const prompt = `Extract a list of technical skills from the following job description.
Return ONLY a JSON array of lowercase skill strings. No explanation, no markdown.
Example: ["react","node","postgres","redis"]

Job Description:
${jdText}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No array in response');
    const skills = JSON.parse(match[0]);
    if (!Array.isArray(skills)) throw new Error('Not an array');
    return skills.map((s: string) => s.toLowerCase().trim()).filter(Boolean);
  } catch {
    // Fallback to static extraction if Gemini fails
    return extractSkillsStatic(jdText);
  }
}

export const createAssessment = async (employerId: string, payload: any) => {
  const {
    title,
    description,
    jd_text,
    seniority_level,
    tech_track,
    max_candidates
  } = payload;

  // Validate required fields
  if (!title || !jd_text || !seniority_level || !tech_track) {
    throw new Error('Missing required fields: title, jd_text, seniority_level, tech_track');
  }

  // Extract skills from job description using Gemini
  const extractedSkills = await extractSkillsWithGemini(jd_text);

  const assessmentData = {
    employer_id: employerId,
    title,
    description: description || '',
    jd_text,
    extracted_skills: extractedSkills,
    seniority_level,
    tech_track,
    max_candidates: max_candidates || 5,
  };

  const { data, error } = await supabaseAdmin
    .from('assessments')
    .insert([assessmentData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getAssessments = async (filters?: { employerId?: string }) => {
  let query = supabaseAdmin.from('assessments').select('*');

  if (filters?.employerId) {
    query = query.eq('employer_id', filters.employerId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getAssessmentById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('assessments')
    .select('*, employer:profiles!assessments_employer_id_fkey(email, full_name)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};