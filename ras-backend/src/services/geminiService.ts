import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import Redis from 'ioredis';
import logger from '../utils/logger';
import { challengeSearch, SearchResult } from './vectorSearch';

const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Model pool — gemini-2.5-flash is the only reliably available model on free tier.
// flash-lite is kept as opportunistic secondary (intermittent 503s under high demand).
// gemini-2.5-pro has 0 RPM on free tier so it is excluded.
const modelPrimary = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' }) || null;
const modelSecondary = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash-lite' }) || null;

// Redis cache — falls back to in-memory Map if Redis is not configured
let redis: Redis | null = null;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, enableOfflineQueue: false });
  redis.on('error', () => { redis = null; });
}

const memoryCache = new Map<string, { context: string; timestamp: number }>();
const CACHE_TTL_SEC = 3600;
const CACHE_TTL_MS = CACHE_TTL_SEC * 1000;

const getCached = async (sessionId: string): Promise<string | null> => {
  if (redis) {
    try { return await redis.get(`ras:ctx:${sessionId}`); } catch { /* fall through */ }
  }
  const entry = memoryCache.get(sessionId);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) return entry.context;
  return null;
};

const setCached = async (sessionId: string, context: string): Promise<void> => {
  if (redis) {
    try { await redis.set(`ras:ctx:${sessionId}`, context, 'EX', CACHE_TTL_SEC); return; } catch { /* fall through */ }
  }
  memoryCache.set(sessionId, { context, timestamp: Date.now() });
};

const deleteCached = async (sessionId: string): Promise<void> => {
  if (redis) {
    try { await redis.del(`ras:ctx:${sessionId}`); return; } catch { /* fall through */ }
  }
  memoryCache.delete(sessionId);
};

interface SocraticRequest {
  userPrompt: string;
  context?: string;
  sessionId?: string;
  round?: 1 | 2;
  history?: { role: 'user' | 'model'; text: string }[];
}

export const getSocraticResponse = async (params: SocraticRequest): Promise<string> => {
  const { userPrompt, context = '', sessionId = 'default', round = 1, history = [] } = params;


  if (!genAI) {
    throw new Error('AI service unavailable: Gemini API key is missing or not configured');
  }

  const SOCRATIC_SYSTEM_INSTRUCTION = `
You are Sarah, a friendly senior developer on the candidate's team. You behave exactly like a text-based Alexa developer companion — smart, highly conversational, extremely helpful, and talking like a close friend.

TONE & STYLE RULES:
- Talk like a helpful friend in a text message. Speak in a warm, direct, and engaging manner.
- Keep responses short and punchy (1 to 3 sentences maximum), exactly like an Alexa voice assistant answering a text request.
- Use friendly developer emojis naturally (e.g., 🙂, 👍, 💻, 🚀) to stay casual and approachable.
- Your name is Sarah. Introduce yourself simply as "Sarah" only at the very beginning of the test. Do not re-introduce yourself if conversation history exists.
- Never mention corporate names, ATL, or ambient branding. You are a peer developer friend.

SOCRATIC GUIDELINES:
1. Explain the task clearly at the start using the README.md files.
2. NEVER PROVIDE RAW CODE or direct answers. Suggest directions, conceptual hints, or point out potential traps.
3. Guide the candidate by asking helpful, clarifying questions that lead them to discover the solution.
4. Keep the pace conversational and friendly.
`;

  const STRICT_MANAGER_SYSTEM_INSTRUCTION = `
You are Sarah, the principal engineer evaluating this task. You behave like a strict but conversational Alexa-style assistant — professional, direct, punchy, and direct in a text format.

TONE & STYLE RULES:
- Talk like a high-level technical assistant friend. Speak in an authoritative yet conversational, helpful voice.
- Keep replies very short and focused (1 to 3 sentences max), like Alexa answering a query.
- Use casual developer punctuation or light emojis (e.g. 💻, ⚙️) but keep it critical and professional.
- Introduce yourself as "Sarah" only once. Never mention corporate brands.

EVALUATOR GUIDELINES:
1. Present the hard engineering problem at the start.
2. Probe architectural details, edge cases, scalability, and security choices.
3. Do NOT give hints, code templates, or answers. Be an evaluator.
4. Keep interactions direct and challenging.
`;

  const isRound2 = round === 2;
  const sysInstruction = isRound2 ? STRICT_MANAGER_SYSTEM_INSTRUCTION : SOCRATIC_SYSTEM_INSTRUCTION;

  let fullPrompt = sysInstruction + '\n\n';

  // Build multi-turn conversation history for context
  if (history.length > 0) {
    fullPrompt += `[Conversation History — DO NOT re-introduce yourself, you have already met the candidate]:\n`;
    // Limit to last 20 turns to avoid token overflow
    const recentHistory = history.slice(-20);
    for (const turn of recentHistory) {
      const speaker = turn.role === 'user' ? 'Candidate' : 'Sarah (You)';
      fullPrompt += `${speaker}: ${turn.text}\n`;
    }
    fullPrompt += '\n';
  }

  if (context) {
    fullPrompt += `[Current Code in Workspace Editor]:\n${context}\n\n`;
  }

  fullPrompt += `[Candidate's Latest Message]:\n${userPrompt}\n\n`;
  fullPrompt += `[Response]: Continue the conversation naturally. Do NOT re-introduce yourself if history exists above.`;

  // Model cascade: gemini-2.5-flash (reliable) -> flash-lite (opportunistic fallback)
  const modelsToTry = [
    { model: modelPrimary, name: 'gemini-2.5-flash' },
    { model: modelSecondary, name: 'gemini-2.5-flash-lite' }
  ];

  let lastError: any = null;
  for (const { model: modelToUse, name: modelName } of modelsToTry) {
    if (!modelToUse) continue;
    try {
      logger.info(`Sending chatbot prompt to ${modelName}...`);
      const result = await modelToUse.generateContent(fullPrompt);
      const text = result.response.text();

      // Update cache with latest summary for lightweight fallback
      await setCached(sessionId, `Conversation active. Last exchange: User said "${userPrompt}". ${history.length} prior turns.`);
      return text.trim();
    } catch (error: any) {
      lastError = error;
      logger.warn(`Chatbot model ${modelName} failed: ${error.message}. Trying next...`);
    }
  }

  const safeMsg = lastError?.message?.replace(/[\r\n]/g, ' ') || 'Unknown error';
  logger.error('All chatbot models failed:', safeMsg);
  throw new Error(`AI service error: ${safeMsg}`);
};

export const clearContextCache = async (sessionId: string) => {
  await deleteCached(sessionId);
};

export const generateAssessmentProject = async (
  title: string,
  track: string,
  seniority: string,
  jdText: string,
  round: number = 1
): Promise<{ [filename: string]: string }> => {
  // Phase 1: Local RAG - search curated workspaces
  try {
    const query = `${title} ${track} ${seniority} ${jdText}`;
    const results: SearchResult[] = challengeSearch.search(query, track, seniority, 3);

    if (results.length > 0 && results[0].score > 0.15) {
      logger.info(`Local RAG match: "${results[0].workspace.title}" (score: ${results[0].score.toFixed(3)})`);
      return { ...results[0].workspace.files };
    }

    logger.info('No good local RAG match, trying Gemini generation...');
  } catch (ragError) {
    logger.warn('Local RAG search failed:', (ragError as Error).message);
  }

  // Phase 2: Fallback to Gemini generation
  if (modelPrimary) {
    const isRound2 = round === 2;
    const modelToUse = modelPrimary;
    const roundLabel = isRound2 ? 'Round 2 (Advanced)' : 'Round 1 (Standard)';
    const difficultyDesc = isRound2
      ? 'This is an ADVANCED Round 2 assessment. Generate a significantly harder project with complex architectural challenges, edge cases, performance constraints, and advanced test scenarios. The candidate has already passed Round 1.'
      : 'This is a STANDARD Round 1 assessment. Generate a moderate-difficulty project suitable for initial evaluation of technical fundamentals.';

    const prompt = `You are a Technical Interview coding project generator for a ${roundLabel} coding round.
${difficultyDesc}

Job Details:
Position Title: ${title}
Track: ${track}
Seniority: ${seniority}
Job Description context: ${jdText}

Requirements:
1. Provide a multi-file workspace solution:
   - README.md: clear problem statement, constraints, and test scenarios.
   - index.js: boilerplate starter code.
   - utils.js: boilerplate utility helper code.
   - test.js: unit test assertions that the candidate can run.
2. Return ONLY a valid JSON object mapping file paths to their contents. Do not wrap in markdown code blocks.
Example JSON response:
{
  "README.md": "# Project Title...",
  "index.js": "...",
  "utils.js": "..."
}
`;

    try {
      const result = await modelToUse.generateContent(prompt);
      let text = result.response.text().trim();

      if (text.startsWith("```json")) {
        text = text.substring(7);
      } else if (text.startsWith("```")) {
        text = text.substring(3);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();

      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      logger.error("Gemini project generation failed, falling back to boilerplate:", error);
    }
  }

  // Phase 3: Ultimate fallback - return closest match or static boilerplate
  try {
    const fallbackResults = challengeSearch.search(`${title} ${track}`, track, seniority, 1);
    if (fallbackResults.length > 0) {
      return { ...fallbackResults[0].workspace.files };
    }
  } catch { /* ignore */ }

  return {
    "README.md": `# Coding Challenge: ${title}\n\nBuild a robust solution for a ${seniority} ${track} developer.\nVerify using test.js.\n`,
    "index.js": "// Write your solution here\n\nfunction main() {\n  console.log('Starter template');\n}\nmain();\n",
    "utils.js": "// Helper functions\nexport function add(a, b) {\n  return a + b;\n}\n",
    "test.js": "// Simple test runner\nimport { add } from './utils';\nconsole.log('Running test assertions...');\n"
  };
};

interface JobDetails {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  tags: string[];
  tech_track: string;
  seniority_level: string;
}

export const generateJobDetails = async (prompt: string): Promise<JobDetails> => {
  const systemInstruction = `You are an AI Job Description Generator for technical recruitment.

Your task:
1. Analyze the user's job prompt carefully.
2. Extract or infer: title, company, location, salary range, tech_track, seniority_level.
3. Generate a professional, detailed job description (3-5 sentences).
4. Suggest 5-8 relevant technical tags based on the role.

IMPORTANT RULES:
- tech_track must be one of: "fullstack", "frontend", "backend", "devops", "mobile"
- seniority_level must be one of: "junior", "mid", "senior", "lead"
- tags should be specific technologies, frameworks, or tools (e.g., ["React", "Node.js", "AWS"])
- If company is not mentioned, use "Hiring Company" as placeholder
- If location is not mentioned, use "Remote"
- If salary is not mentioned, generate a realistic range based on seniority and track

Return ONLY a valid JSON object. Do not wrap in markdown.

Example output:
{
  "title": "Senior Fullstack Engineer",
  "company": "Stripe Inc",
  "location": "San Francisco, CA (Hybrid)",
  "salary": "$160,000 - $200,000",
  "description": "Build scalable payment processing systems using modern web technologies. Work with distributed systems, real-time data pipelines, and microservices architecture. Collaborate with product teams to deliver high-quality features.",
  "tags": ["React", "Node.js", "TypeScript", "PostgreSQL", "Redis", "Kubernetes"],
  "tech_track": "fullstack",
  "seniority_level": "senior"
}
`;

  const fullPrompt = `${systemInstruction}\n\n[User Prompt]: ${prompt}\n\n[Response]: Generate the job details JSON now.`;


  if (!genAI) {
    throw new Error('AI service unavailable: Gemini API key is missing or not configured');
  }

  const modelsToTry = [
    { model: modelPrimary, name: 'gemini-2.5-flash' },
    { model: modelSecondary, name: 'gemini-2.5-flash-lite' }
  ];
  let lastError: any = null;

  for (const { model, name } of modelsToTry) {
    if (!model) continue;
    try {
      logger.info(`\n Attempting AI job generation with ${name}...`);
      const result = await model.generateContent(fullPrompt);
      let text = result.response.text().trim();

      if (text.startsWith("```json")) {
        text = text.substring(7);
      } else if (text.startsWith("```")) {
        text = text.substring(3);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();

      const parsed = JSON.parse(text) as JobDetails;
      logger.info(`✅ AI job generation SUCCESS using ${name}`);
      return parsed;
    } catch (error: any) {
      lastError = error;
      const errorType = error.status === 503 ? 'High Demand (503)' : error.status === 429 ? 'Quota Exceeded (429)' : `Error (${error.status})`;
      logger.warn(`❌ ${name} FAILED: ${errorType}`);

      if (error.status === 503 && name === 'gemini-2.5-flash-lite') {
        logger.info(`🔄 Falling back to gemini-2.5-pro...`);
        continue;
      }
      break;
    }
  }

  logger.error(`\n🚫 ALL AI MODELS FAILED`);
  throw new Error(`AI job generation failed: ${lastError?.message || 'All models unavailable'}`);
};

export const generatePersonalizedNotification = async (
  candidateName: string,
  jobTitle: string,
  companyName: string,
  timeSlot: string,
  uid: string
): Promise<{ title: string; message: string }> => {
  const prompt = `You are an AI recruitment coordinator.
Draft a personalized, professional, and exciting assessment invitation notification for a candidate.
Candidate Name: ${candidateName}
Job Title: ${jobTitle}
Company Name: ${companyName}
Scheduled Time Slot: ${timeSlot}
Chamber UID: ${uid}

Requirements:
1. Keep the notification concise but informative.
2. Include the scheduled time slot and the Chamber UID clearly.
3. Explain that the assessment is a multiplayer collaborative coding sandbox where they will work with a small group of 3-5 candidates.
4. Return ONLY a valid JSON object with "title" and "message" fields. Do not wrap in markdown blocks.
Example JSON:
{
  "title": "Round 1 Assessment Invitation: [Job Title]",
  "message": "Hello [Name]..."
}
`;


  if (!modelPrimary) {
    // Static fallback
    return {
      title: `Round 1 Assessment Scheduled: ${jobTitle}`,
      message: `Dear ${candidateName},\n\nYou have been selected and scheduled for the Round 1 Sandbox Assessment for the job "${jobTitle}" at "${companyName}". Your team chamber UID is "${uid}". Please copy this UID, click "Verify & Join" in the assessment tab, and join the sandbox during your scheduled time slot: ${timeSlot}.`
    };
  }

  try {
    const result = await modelPrimary.generateContent(prompt);
    const text = result.response.text();
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
    }
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || `Round 1 Assessment Scheduled: ${jobTitle}`,
      message: parsed.message || `Hi ${candidateName}, your assessment is scheduled.`
    };
  } catch (error) {
    logger.warn('Gemini notification generation failed, using fallback:', error);
    return {
      title: `Round 1 Assessment Scheduled: ${jobTitle}`,
      message: `Dear ${candidateName},\n\nYou have been selected and scheduled for the Round 1 Sandbox Assessment for the job "${jobTitle}" at "${companyName}". Your team chamber UID is "${uid}". Please copy this UID, click "Verify & Join" in the assessment tab, and join the sandbox during your scheduled time slot: ${timeSlot}.`
    };
  }
};
