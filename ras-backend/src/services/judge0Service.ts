import axios from 'axios';

const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';
const PISTON_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

// Piston language map: Judge0 language_id -> Piston {language, version}
const pistonLanguageMap: { [key: number]: { language: string; version: string } } = {
  63:  { language: 'javascript', version: '18.15.0' },
  71:  { language: 'python',     version: '3.10.0'  },
  62:  { language: 'java',       version: '15.0.2'  },
  50:  { language: 'c',          version: '10.2.0'  },
  54:  { language: 'c++',        version: '10.2.0'  },
  51:  { language: 'csharp',     version: '6.12.0'  },
  60:  { language: 'go',         version: '1.16.2'  },
  73:  { language: 'rust',       version: '1.50.0'  },
  72:  { language: 'ruby',       version: '3.0.1'   },
  74:  { language: 'typescript', version: '5.0.3'   },
  78:  { language: 'kotlin',     version: '1.8.20'  },
};

export const languageMap: { [key: string]: number } = {
  javascript: 63,
  python: 71,
  python3: 71,
  java: 62,
  c: 50,
  cpp: 54,
  csharp: 51,
  go: 60,
  rust: 73,
  ruby: 72,
  php: 68,
  swift: 83,
  typescript: 74,
  kotlin: 78,
};

export const languageNameMap: { [key: number]: string } = Object.keys(languageMap).reduce(
  (acc, key) => {
    acc[languageMap[key]] = key;
    return acc;
  },
  {} as { [key: number]: string }
);

interface SubmissionParams {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

interface SubmissionResponse {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string;
  memory: number;
  status: {
    id: number;
    description: string;
  };
}

const judge0Headers = {
  'X-Auth-Token': JUDGE0_API_KEY,
  'Content-Type': 'application/json',
};

export const submitCode = async (params: SubmissionParams): Promise<SubmissionResponse> => {
  try {
    return await submitViaJudge0(params);
  } catch (error: any) {
    // Fallback to Piston on rate limit (429) or Judge0 unavailable
    if (error.response?.status === 429 || error.message?.includes('not responding')) {
      console.warn('Judge0 unavailable, falling back to Piston');
      return await submitViaPiston(params);
    }
    throw error;
  }
};

const submitViaJudge0 = async (params: SubmissionParams): Promise<SubmissionResponse> => {
  try {
    const response = await axios.post(
      `${JUDGE0_URL}/submissions`,
      {
        source_code: params.source_code,
        language_id: params.language_id,
        stdin: params.stdin || '',
        expected_output: params.expected_output || '',
        cpu_time_limit: params.cpu_time_limit || 2,
        memory_limit: params.memory_limit || 128,
      },
      {
        params: { base64_encoded: false, wait: true },
        headers: judge0Headers,
        timeout: 15000,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Judge0 error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Judge0 service is not responding. Please try again later.');
    }
    throw new Error(`Execution error: ${error.message}`);
  }
};

const submitViaPiston = async (params: SubmissionParams): Promise<SubmissionResponse> => {
  const lang = pistonLanguageMap[params.language_id];
  if (!lang) throw new Error(`Piston fallback: unsupported language_id ${params.language_id}`);

  try {
    const response = await axios.post(
      `${PISTON_URL}/execute`,
      {
        language: lang.language,
        version: lang.version,
        files: [{ content: params.source_code }],
        stdin: params.stdin || '',
      },
      { timeout: 15000 }
    );

    const run = response.data.run;
    const compile = response.data.compile;

    return {
      stdout: run?.stdout || null,
      stderr: run?.stderr || compile?.stderr || null,
      compile_output: compile?.output || null,
      message: run?.signal || null,
      time: String(run?.cpu_time || '0'),
      memory: run?.memory || 0,
      status: {
        id: run?.code === 0 ? 3 : 11,  // 3=Accepted, 11=Runtime Error
        description: run?.code === 0 ? 'Accepted' : 'Runtime Error',
      },
    };
  } catch (error: any) {
    throw new Error(`Piston fallback error: ${error.message}`);
  }
};

export const getSupportedLanguages = async () => {
  try {
    const response = await axios.get(`${JUDGE0_URL}/languages`, { headers: judge0Headers });
    return response.data;
  } catch {
    return Object.keys(languageMap).map(key => ({ id: languageMap[key], name: key }));
  }
};
