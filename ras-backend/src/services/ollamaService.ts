import axios from 'axios';
import logger from '../utils/logger';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3:8b';
const OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT || '30000', 10);

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
}

export class OllamaClient {
  private baseUrl: string;
  private model: string;
  private timeout: number;

  constructor(baseUrl?: string, model?: string, timeout?: number) {
    this.baseUrl = (baseUrl || OLLAMA_BASE_URL).replace(/\/+$/, '');
    this.model = model || OLLAMA_MODEL;
    this.timeout = timeout || OLLAMA_TIMEOUT;
  }

  public isAvailable(): boolean {
    return !!process.env.OLLAMA_BASE_URL || false;
  }

  public async generate(
    prompt: string,
    system?: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<string> {
    const request: OllamaGenerateRequest = {
      model: this.model,
      prompt,
      stream: false,
      options: {
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
        top_p: 0.9,
      },
    };

    if (system) {
      request.system = system;
    }

    try {
      logger.info(`Ollama: generating with model ${this.model}`);
      const response = await axios.post<OllamaGenerateResponse>(
        `${this.baseUrl}/api/generate`,
        request,
        { timeout: this.timeout }
      );

      const text = response.data.response?.trim() || '';
      logger.info(`Ollama: generation complete (${text.length} chars)`);
      return text;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Unknown error';
      logger.error(`Ollama API error: ${message}`);
      throw new Error(`Ollama service error: ${message}`);
    }
  }

  public async isModelAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
      const models = response.data?.models || [];
      return models.some((m: any) => m.name?.startsWith(this.model));
    } catch {
      return false;
    }
  }
}

export const ollamaClient = new OllamaClient();

export async function getSocraticFromOllama(
  userPrompt: string,
  context: string,
  round: 1 | 2
): Promise<string> {
  const isRound2 = round === 2;

  const SYSTEM_INSTRUCTION = isRound2
    ? `You are the Senior Technical Lead and Evaluator (ATL R2) for Round 2 of the assessment.
Your role is to act as a Strict Senior Manager and Evaluator.

STRICT MANAGER GUIDELINES:
1. Present the complex problem at the start.
2. Act as a strict evaluator. Probe deep architectural decisions.
3. Never give any hints or direct answers under any circumstances.
4. Ask deep architectural questions, probe edge cases, performance, security, and scalability constraints.
5. Do not help the candidate code. Your evaluation is mathematical and extremely strict. Getting 60% or higher is very hard.
6. Your tone is professional, critical, challenging, direct, and authoritative.`
    : `You are the Ambient Tech Lead (ATL R1) representing the hiring company's engineering leadership.
Your role is to act as a Socratic Guide for Round 1 of the assessment.

SOCRATIC GUIDELINES:
1. Explain the task clearly at the start.
2. NEVER PROVIDE DIRECT CODE or ANSWERS. Do not output refactored code blocks, variables, or functions.
3. Observe progress and provide conceptual, Socratic hints to guide the candidate. Ask questions that prompt logical analysis.
4. Encourage collaboration and monitor engagement.
5. Your tone should be friendly, empathetic, but guiding. Never solve the problem directly.`;

  let fullPrompt = '';
  if (context) {
    fullPrompt += `[Current Context from Workspace]:\n${context}\n\n`;
  }
  fullPrompt += `[Candidate Question/Input]:\n${userPrompt}\n\n`;
  fullPrompt += `[Response]: Provide your response now matching the guidelines.`;

  return ollamaClient.generate(fullPrompt, SYSTEM_INSTRUCTION, {
    temperature: isRound2 ? 0.3 : 0.7,
    maxTokens: isRound2 ? 2048 : 1024,
  });
}
