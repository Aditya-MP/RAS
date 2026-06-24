import { Request, Response } from 'express';
import { submitCode, languageMap, getSupportedLanguages } from '../services/judge0Service';

export const runCode = async (req: Request, res: Response) => {
  try {
    const { language, source_code, stdin, expected_output } = req.body;

    if (!language) return res.status(400).json({ error: 'language is required' });
    if (!source_code) return res.status(400).json({ error: 'source_code is required' });

    const languageId = languageMap[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({
        error: `Unsupported language: ${language}`,
        supported: Object.keys(languageMap),
      });
    }

    const result = await submitCode({
      source_code,
      language_id: languageId,
      stdin: stdin || '',
      expected_output: expected_output || '',
    });

    res.json({
      language,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      message: result.message || '',
      time: result.time || '0',
      memory: result.memory || 0,
      status: result.status,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listLanguages = async (_req: Request, res: Response) => {
  try {
    const languages = await getSupportedLanguages();
    res.json({ languages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
