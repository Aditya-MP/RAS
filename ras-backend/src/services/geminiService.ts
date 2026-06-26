import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import Redis from 'ioredis';
import logger from '../utils/logger';
import { challengeSearch, SearchResult } from './vectorSearch';
import { getSocraticFromOllama } from './ollamaService';

const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Define models for Round 1 (Flash-Lite) and Round 2 (Pro)
const modelFlash = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash-lite' }) || null;
const modelPro = genAI?.getGenerativeModel({ model: 'gemini-2.5-pro' }) || null;

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
}

export const getSocraticResponse = async (params: SocraticRequest): Promise<string> => {
  const { userPrompt, context = '', sessionId = 'default', round = 1 } = params;

  // Try local Ollama first (fast, private, zero-cost)
  try {
    const ollamaReply = await getSocraticFromOllama(userPrompt, context, round);
    if (ollamaReply) {
      await setCached(sessionId, `User asked: "${userPrompt}". AI responded.`);
      return ollamaReply;
    }
  } catch (ollamaError) {
    logger.warn('Ollama unavailable, falling back to Gemini:', (ollamaError as Error).message);
  }

  // Fallback to Gemini
  if (!modelFlash || !modelPro) {
    throw new Error('AI service unavailable: no Ollama or Gemini configured');
  }

  const SOCRATIC_SYSTEM_INSTRUCTION = `
You are the Ambient Tech Lead (ATL R1) representing the hiring company's engineering leadership.
Your role is to act as a Socratic Guide for Round 1 of the assessment.

SOCRATIC GUIDELINES:
1. Explain the task clearly at the start.
2. NEVER PROVIDE DIRECT CODE or ANSWERS. Do not output refactored code blocks, variables, or functions.
3. Observe progress and provide conceptual, Socratic hints to guide the candidate. Ask questions that prompt logical analysis.
4. Encourage collaboration and monitor engagement.
5. Your tone should be friendly, empathetic, but guiding. Never solve the problem directly.
`;

  const STRICT_MANAGER_SYSTEM_INSTRUCTION = `
You are the Senior Technical Lead and Evaluator (ATL R2) for Round 2 of the assessment.
Your role is to act as a Strict Senior Manager and Evaluator.

STRICT MANAGER GUIDELINES:
1. Present the complex problem at the start.
2. Act as a strict evaluator. Probe deep architectural decisions.
3. Never give any hints or direct answers under any circumstances.
4. Ask deep architectural questions, probe edge cases, performance, security, and scalability constraints.
5. Do not help the candidate code. Your evaluation is mathematical and extremely strict. Getting 60% or higher is very hard.
6. Your tone is professional, critical, challenging, direct, and authoritative.
`;

  const isRound2 = round === 2;
  const sysInstruction = isRound2 ? STRICT_MANAGER_SYSTEM_INSTRUCTION : SOCRATIC_SYSTEM_INSTRUCTION;
  const modelToUse = isRound2 ? modelPro : modelFlash;

  let fullPrompt = sysInstruction + '\n\n';

  const cached = await getCached(sessionId);
  if (cached) {
    fullPrompt += `[Previous Context: ${cached}]\n\n`;
  }

  if (context) {
    fullPrompt += `[Current Context from Workspace]:\n${context}\n\n`;
  }

  fullPrompt += `[Candidate Question/Input]:\n${userPrompt}\n\n`;
  fullPrompt += `[Response]: Provide your response now matching the guidelines.`;

  try {
    const result = await modelToUse.generateContent(fullPrompt);
    const text = result.response.text();

    await setCached(sessionId, `User asked: "${userPrompt}". AI responded.`);

    return text.trim();
  } catch (error: any) {
    const safeMsg = error.message?.replace(/[\r\n]/g, ' ');
    logger.error('Gemini API error:', safeMsg);
    throw new Error(`AI service error: ${error.message}`);
  }
};

export const clearContextCache = async (sessionId: string) => {
  await deleteCached(sessionId);
};

export const generateAssessmentProject = async (
  title: string,
  track: string,
  seniority: string,
  jdText: string
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
  if (modelFlash && modelPro) {
    const isSenior = seniority === 'senior';
    const modelToUse = isSenior ? modelPro : modelFlash;
    const difficulty = isSenior ? 'Senior (Round 2)' : 'Junior/Mid (Round 1)';

    const prompt = `You are a Technical Interview coding project generator for a ${difficulty}-level coding round.
Generate a coding project matching the following position details:
Position Title: ${title}
Track: ${track}
Seniority: ${seniority}
Job Description context: ${jdText}

Requirements:
1. Provide a multi-file workspace solution:
   - README.md: clear problem statement, constraints, and test scenarios.
   - index.js: boilerplate starter code.
   - utils.js: boilerplate utility helper code.
   - test.js: simple unit test assertions that the candidate can run.
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

  // Try Ollama first
  try {
    const { ollamaClient } = await import('./ollamaService');
    if (ollamaClient.isAvailable()) {
      const result = await ollamaClient.generate(fullPrompt, undefined, { temperature: 0.3, maxTokens: 1024 });
      let cleaned = result.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }
      const parsed = JSON.parse(cleaned) as JobDetails;
      logger.info(`✅ Ollama job generation SUCCESS`);
      return parsed;
    }
  } catch (ollamaError) {
    logger.warn('Ollama job generation failed, trying Gemini:', (ollamaError as Error).message);
  }

  // Fallback to Gemini
  if (!modelFlash || !modelPro) {
    throw new Error('AI service unavailable: no Ollama or Gemini configured');
  }

  const modelsToTry = [
    { model: modelFlash, name: 'gemini-2.5-flash-lite' },
    { model: modelPro, name: 'gemini-2.5-pro' }
  ];
  let lastError: any = null;

  for (const { model, name } of modelsToTry) {
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

  // Try Ollama first
  try {
    const { ollamaClient } = await import('./ollamaService');
    if (ollamaClient.isAvailable()) {
      const result = await ollamaClient.generate(prompt, undefined, { temperature: 0.5, maxTokens: 512 });
      let cleaned = result.trim();
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
    }
  } catch (ollamaError) {
    logger.warn('Ollama notification generation failed:', (ollamaError as Error).message);
  }

  // Fallback to Gemini
  if (!modelFlash) {
    // Static fallback
    return {
      title: `Round 1 Assessment Scheduled: ${jobTitle}`,
      message: `Dear ${candidateName},\n\nYou have been selected and scheduled for the Round 1 Sandbox Assessment for the job "${jobTitle}" at "${companyName}". Your team chamber UID is "${uid}". Please copy this UID, click "Verify & Join" in the assessment tab, and join the sandbox during your scheduled time slot: ${timeSlot}.`
    };
  }

  try {
    const result = await modelFlash.generateContent(prompt);
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
