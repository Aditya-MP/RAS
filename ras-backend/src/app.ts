import 'dotenv/config'; // Must be first!
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import assessmentRoutes from './routes/assessments';
import teamRoutes from './routes/teams';
import telemetryRoutes from './routes/telemetry';
import executionRoutes from './routes/execution';
import aiRoutes from './routes/ai';
import scoringRoutes from './routes/scoring';
import snapshotRoutes from './routes/snapshots';
import dialogueRoutes from './routes/dialogue';
import peerReviewRoutes from './routes/peerReview';
import chaosRoutes from './routes/chaos';
import gitAnalysisRoutes from './routes/gitAnalysis';
import hcdRoutes from './routes/hcd';
import jobRoutes from './routes/jobs';
import notificationRoutes from './routes/notifications';
import terminalRoutes from './routes/terminal';
import { setupWebSocketServer } from './services/websocketService';
import { startJobExpiryScheduler } from './services/orchestratorService';
import { challengeSearch } from './services/vectorSearch';
import logger from './utils/logger';

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({
  origin: [clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/chat', dialogueRoutes);
app.use('/api/peerreview', peerReviewRoutes);
app.use('/api/chaos', chaosRoutes);
app.use('/api/git', gitAnalysisRoutes);
app.use('/api/resume', hcdRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/terminal', terminalRoutes);

const server = http.createServer(app);
setupWebSocketServer(server);

// Start listening on configured port
server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  challengeSearch.initialize();
  startJobExpiryScheduler();
});