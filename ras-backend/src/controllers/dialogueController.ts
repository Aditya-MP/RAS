import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import {
  storeChatMessage,
  getTeamMessages,
  classifyMessage,
  computeTelemetryCorrelation,
} from '../services/dialogueService';
import { broadcastToTeam } from '../services/websocketService';
import { getSocraticResponse } from '../services/geminiService';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const candidateId = req.user!.id as string;
    const { teamId, message } = req.body;

    if (!teamId) return res.status(400).json({ error: 'teamId required' });
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'message required' });
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('team_id', teamId)
      .eq('candidate_id', candidateId)
      .single();

    if (memberError || !member) {
      return res.status(403).json({ error: 'Not a member of this team' });
    }

    // Run classification and TCI in parallel
    const [classification, correlation] = await Promise.all([
      classifyMessage(message),
      computeTelemetryCorrelation(teamId, candidateId, message),
    ]);

    const stored = await storeChatMessage(teamId, candidateId, message, classification, correlation);

    // Broadcast candidate's message to the team in real-time
    broadcastToTeam(teamId, {
      type: 'chat_message',
      message: stored
    });

    // Trigger AI response asynchronously
    setImmediate(async () => {
      let employerId: string | null = null;
      try {
        const { data: teamData } = await supabaseAdmin
          .from('teams')
          .select('round, assessment:assessments!inner(employer_id)')
          .eq('id', teamId)
          .single();

        if (!teamData) return;
        const round = teamData.round as 1 | 2;
        const assessment = Array.isArray(teamData.assessment) ? teamData.assessment[0] : teamData.assessment;
        employerId = assessment?.employer_id;

        if (!employerId) return;

        // Get latest files snapshot context
        const { data: snapshots } = await supabaseAdmin
          .from('code_snapshots')
          .select('files')
          .eq('team_id', teamId)
          .order('snapshot_time', { ascending: false })
          .limit(1);

        let context = '';
        if (snapshots && snapshots.length > 0) {
          context = Object.entries(snapshots[0].files || {})
            .map(([filename, content]) => `File: ${filename}\n\`\`\`\n${content}\n\`\`\``)
            .join('\n\n');
        }

        // Build conversation history from prior chat messages
        const { data: priorMessages } = await supabaseAdmin
          .from('chat_messages')
          .select('candidate_id, message')
          .eq('team_id', teamId)
          .order('created_at', { ascending: true })
          .limit(30);

        const chatHistory = (priorMessages || []).map((m: any) => ({
          role: (m.candidate_id === employerId ? 'model' : 'user') as 'user' | 'model',
          text: m.message
        }));

        // Call Gemini Socratic Response with conversation history
        const reply = await getSocraticResponse({
          userPrompt: message,
          context,
          sessionId: `${teamId}-ai`,
          round,
          history: chatHistory
        });

        // Store AI reply under employer's profile ID
        const aiClassification = { dialogue_act: 'REQUEST_CLARIFICATION', cognitive_state: 'SURE', confidence: 1.0 };
        const aiStored = await storeChatMessage(teamId, employerId, reply, aiClassification as any, 1.0);

        // Broadcast the Socratic reply to all team members over WebSocket
        broadcastToTeam(teamId, {
          type: 'chat_message',
          message: {
            ...aiStored,
            sender_name: 'Sarah',
            classification: aiClassification,
            telemetry_correlation: 1.0
          }
        });
      } catch (err: any) {
        console.error('Sarah AI response failed:', err.message);
        // Send a graceful fallback message so the user isn't left hanging
        if (!employerId) return;
        try {
          const fallbackReply = "Hey! I'm having a brief connectivity issue right now — give me a moment and try sending your message again. 🙂";
          const fallbackClassification = { dialogue_act: 'ACKNOWLEDGMENT', cognitive_state: 'SURE', confidence: 1.0 };
          const fallbackStored = await storeChatMessage(teamId, employerId, fallbackReply, fallbackClassification as any, 0.5);
          broadcastToTeam(teamId, {
            type: 'chat_message',
            message: {
              ...fallbackStored,
              sender_name: 'Sarah',
              classification: fallbackClassification,
              telemetry_correlation: 0.5
            }
          });
        } catch (fallbackErr: any) {
          console.error('Failed to send fallback message:', fallbackErr.message);
        }
      }
    });

    res.status(201).json({
      message: 'Message stored',
      data: stored,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.teamId as string;
    const candidateId = req.user!.id as string;
    let messages = await getTeamMessages(teamId, candidateId);

    if (messages.length === 0) {
      try {
        const { data: teamData } = await supabaseAdmin
          .from('teams')
          .select('round, assessment:assessments!inner(id, title, tech_track, seniority_level, employer_id)')
          .eq('id', teamId)
          .single();

        if (teamData) {
          const { data: profileData } = await supabaseAdmin
            .from('profiles')
            .select('full_name')
            .eq('id', candidateId)
            .single();

          const assessment = Array.isArray(teamData.assessment) ? teamData.assessment[0] : teamData.assessment;
          const employerId = assessment?.employer_id;
          const candidateName = profileData?.full_name || 'there';
          const challengeTitle = assessment?.title || 'this challenge';
          const roundNum = teamData.round || 1;

          if (employerId) {
            const welcomeText = `Hey ${candidateName}! 🙂 I'm Sarah, your dev buddy for this sandbox. I've set up the workspace for the "${challengeTitle}" challenge. Ready to dive into Round ${roundNum}? Let's write some cool code! 🚀`;
            const classification = { dialogue_act: 'OFFER', cognitive_state: 'SURE', confidence: 1.0 };
            await storeChatMessage(teamId, employerId, welcomeText, classification as any, 1.0);
            messages = await getTeamMessages(teamId, candidateId);
          }
        }
      } catch (err: any) {
        console.error('Error seeding welcome message:', err.message);
      }
    }

    res.json({ messages });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const classifySingle = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message required' });
    }
    const classification = await classifyMessage(message);
    res.json({ classification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
