import { supabaseAdmin } from '../config/supabase';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;
import { classifyInjection } from './injectionClassifier';

export interface ScanResult {
  hasInjection: boolean;
  cleanText: string;
  suspiciousParts: string[];
  metadata: {
    totalPages: number;
    wordCount: number;
    isResume: boolean;
    injectionConfidence?: number;
    injectionType?: string;
    semanticScore?: number;
  };
}

export const scanPDF = async (pdfBuffer: Buffer): Promise<ScanResult> => {
  const data = await pdfParse(pdfBuffer);
  const text = data.text || '';

  // Use ML-based classifier
  const classifierResult = classifyInjection(text);
  const suspiciousParts = classifierResult.suspiciousParts;
  let cleanText = suspiciousParts.length > 0
    ? suspiciousParts.reduce((t, part) => t.replace(part, ''), text)
    : text;

  const lowercaseText = text.toLowerCase();
  const resumeKeywords = ['experience', 'education', 'skills', 'projects', 'work', 'employment', 'cv', 'resume', 'history', 'academic', 'qualification', 'certifications', 'summary'];
  const keywordCount = resumeKeywords.filter(k => lowercaseText.includes(k)).length;
  const isResume = keywordCount >= 3;

  return {
    hasInjection: classifierResult.isInjection,
    cleanText: cleanText.trim(),
    suspiciousParts,
    metadata: {
      totalPages: data.numpages || 1,
      wordCount: text.split(/\s+/).filter((w: string) => w.length > 0).length,
      isResume,
      injectionConfidence: classifierResult.confidence,
      injectionType: classifierResult.injectionType || undefined,
      semanticScore: classifierResult.semanticScore,
    },
  };
};

export const storeResume = async (candidateId: string, originalFilename: string, scanResult: ScanResult) => {
  const { data, error } = await supabaseAdmin
    .from('resumes')
    .upsert([{
      candidate_id: candidateId,
      original_filename: originalFilename,
      sanitized_text: scanResult.cleanText,
      has_injection: scanResult.hasInjection,
      injection_detected_at: scanResult.hasInjection ? new Date().toISOString() : null,
      metadata: { ...scanResult.metadata, suspicious_parts: scanResult.suspiciousParts },
    }], { onConflict: 'candidate_id' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getResume = async (candidateId: string, requesterId: string) => {
  if (candidateId !== requesterId) {
    const { data: membership, error } = await supabaseAdmin
      .from('team_members')
      .select('teams!inner(assessment:assessments!inner(employer_id))')
      .eq('candidate_id', candidateId)
      .limit(1);

    if (error || !membership || membership.length === 0) throw new Error('Access denied');

    const teams = membership[0].teams as any;
    const assessment = Array.isArray(teams.assessment) ? teams.assessment[0] : teams.assessment;
    if (assessment.employer_id !== requesterId) throw new Error('Access denied');
  }

  const { data, error } = await supabaseAdmin
    .from('resumes').select('*').eq('candidate_id', candidateId).single();

  if (error) throw new Error(error.message);
  return data;
};

export const getInjectionAttempts = async (employerId: string) => {
  // Get candidate IDs belonging to this employer's assessments
  const { data: members, error: memberError } = await supabaseAdmin
    .from('team_members')
    .select('candidate_id, teams!inner(assessment:assessments!inner(employer_id))')
    .eq('teams.assessment.employer_id', employerId);

  if (memberError) throw new Error(memberError.message);
  if (!members || members.length === 0) return [];

  const candidateIds = [...new Set(members.map((m: any) => m.candidate_id))];

  const { data, error } = await supabaseAdmin
    .from('resumes')
    .select('*, candidate:profiles!resumes_candidate_id_fkey(email, full_name)')
    .eq('has_injection', true)
    .in('candidate_id', candidateIds);

  if (error) throw new Error(error.message);
  return data;
};
