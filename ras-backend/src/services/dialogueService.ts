import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '../config/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite' });

export const DIALOGUE_ACTS = {
  OFFER: 'OFFER',
  REQUEST_CLARIFICATION: 'REQUEST_CLARIFICATION',
  JUSTIFICATION: 'JUSTIFICATION',
  ACKNOWLEDGMENT: 'ACKNOWLEDGMENT',
} as const;

export type DialogueAct = typeof DIALOGUE_ACTS[keyof typeof DIALOGUE_ACTS];

export interface ClassifiedMessage {
  message: string;
  dialogue_act: DialogueAct;
  cognitive_state: string;
  confidence: number;
}

export const classifyMessage = async (message: string): Promise<ClassifiedMessage> => {
  const prompt = `You are a Dialogue Act Classifier for a technical team chat.

Classify this message into ONE category:
- OFFER: Proposing an idea, task, or solution
- REQUEST_CLARIFICATION: Asking for clarification
- JUSTIFICATION: Explaining why something was done
- ACKNOWLEDGMENT: Confirming understanding

Also assess cognitive state:
- SURE: Confident and clear
- CONFUSED: Uncertain but asking
- STUCK: Blocked, need help
- AVOIDING_THOUGHT: Asking for direct code/solution

Return ONLY valid JSON, no markdown:
{"dialogue_act":"OFFER|REQUEST_CLARIFICATION|JUSTIFICATION|ACKNOWLEDGMENT","cognitive_state":"SURE|CONFUSED|STUCK|AVOIDING_THOUGHT","confidence":0.0}

Message: "${message.replace(/"/g, '\\"')}"`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      message,
      dialogue_act: parsed.dialogue_act || 'REQUEST_CLARIFICATION',
      cognitive_state: parsed.cognitive_state || 'CONFUSED',
      confidence: parsed.confidence || 0.5,
    };
  } catch {
    return { message, dialogue_act: 'REQUEST_CLARIFICATION', cognitive_state: 'CONFUSED', confidence: 0.3 };
  }
};

export const storeChatMessage = async (
  teamId: string,
  candidateId: string,
  message: string,
  classification: ClassifiedMessage,
  telemetryCorrelation: number
) => {
  const { data, error } = await supabaseAdmin
    .from('chat_messages')
    .insert([{
      team_id: teamId,
      candidate_id: candidateId,
      message,
      dialogue_act: classification.dialogue_act,
      cognitive_state: classification.cognitive_state,
      telemetry_correlation: telemetryCorrelation,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getTeamMessages = async (teamId: string, requesterId: string) => {
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
    .from('chat_messages')
    .select('*, candidate:profiles!chat_messages_candidate_id_fkey(email, full_name)')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const computeTelemetryCorrelation = async (
  teamId: string,
  candidateId: string,
  message: string
): Promise<number> => {
  const keywords = message.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: events, error } = await supabaseAdmin
    .from('telemetry_events')
    .select('event_data')
    .eq('team_id', teamId)
    .eq('candidate_id', candidateId)
    .gte('created_at', fiveMinutesAgo)
    .limit(50);

  if (error || !events || events.length === 0) return 0.3;

  const eventContent = events
    .map((ev: any) => [ev.event_data.file_path, ev.event_data.command, ev.event_data.prompt].filter(Boolean).join(' '))
    .join(' ')
    .toLowerCase();

  const matches = keywords.filter(k => eventContent.includes(k)).length;
  return keywords.length > 0 ? Math.min(matches / keywords.length, 1.0) : 0.5;
};
