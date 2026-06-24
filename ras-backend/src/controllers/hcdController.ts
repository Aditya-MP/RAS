import { Request, Response } from 'express';
import multer from 'multer';
import { scanPDF, storeResume, getResume, getInjectionAttempts } from '../services/hcdService';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files are allowed'));
  },
}).single('resume');

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const scanResult = await scanPDF(req.file.buffer);
    if (!scanResult.metadata.isResume) {
      return res.status(400).json({
        error: 'Uploaded file does not appear to be a valid resume. The workspace scanner detected that this is another document type, lacking standard resume keywords (like Education, Experience, or Skills). Verification failed.'
      });
    }
    const stored = await storeResume(req.user!.id, req.file.originalname, scanResult);

    res.status(201).json({
      message: scanResult.hasInjection ? '⚠️ Suspicious content detected and sanitized' : 'Resume uploaded and scanned',
      has_injection: scanResult.hasInjection,
      suspicious_parts: scanResult.suspiciousParts.slice(0, 5),
      metadata: scanResult.metadata,
      resume: stored,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCandidateResume = async (req: Request, res: Response) => {
  try {
    const resume = await getResume(req.params.candidateId as string, req.user!.id);
    res.json({ resume });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
};

export const listInjectionAttempts = async (req: Request, res: Response) => {
  try {
    const attempts = await getInjectionAttempts(req.user!.id);
    res.json({ total: attempts.length, attempts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
