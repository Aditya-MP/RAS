import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import Redis from 'ioredis';

const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);

// Define models for Round 1 (Flash-Lite) and Round 2 (Pro)
const modelFlash = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
const modelPro = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

// Redis cache — falls back to in-memory Map if Redis is not configured
let redis: Redis | null = null;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, enableOfflineQueue: false });
  redis.on('error', () => { redis = null; }); // silently disable if unavailable
}

const memoryCache = new Map<string, { context: string; timestamp: number }>();
const CACHE_TTL_SEC = 3600; // 1 hour
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

interface SocraticRequest {
  userPrompt: string;
  context?: string;
  sessionId?: string;
  round?: 1 | 2;
}

export const getSocraticResponse = async (params: SocraticRequest): Promise<string> => {
  const { userPrompt, context = '', sessionId = 'default', round = 1 } = params;

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
    console.error('Gemini API error:', safeMsg);
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
    
    // strip markdown code block wrappers if present
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
    console.error("Gemini project generation failed, falling back to boilerplate:", error);
    return {
      "README.md": `# Coding Challenge: ${title}\n\nBuild a robust solution for a ${seniority} ${track} developer.\nVerify using test.js.\n`,
      "index.js": "// Write your solution here\n\nfunction main() {\n  console.log('Starter template');\n}\nmain();\n",
      "utils.js": "// Helper functions\nexport function add(a, b) {\n  return a + b;\n}\n",
      "test.js": "// Simple test runner\nimport { add } from './utils';\nconsole.log('Running test assertions...');\n"
    };
  }
};
