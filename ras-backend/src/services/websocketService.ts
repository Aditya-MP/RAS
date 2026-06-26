import { WebSocketServer, WebSocket } from 'ws';
import { supabaseAdmin } from '../config/supabase';
import logger from '../utils/logger';

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  teamId: string;
}

const clients: Map<string, ClientConnection> = new Map();

const DEV_MOCK_USER_ID = 'dev-user-id'; // matches MOCK_USER in middleware/auth.ts

export const setupWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws: WebSocket, req: any) => {
    try {
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      const teamId = url.searchParams.get('teamId');

      if (!teamId) {
        ws.close(1008, 'Missing teamId');
        return;
      }

      // Dev mode: use mock user if no token provided
      // In production: validate token via supabaseAdmin.auth.getUser(token)
      let userId = DEV_MOCK_USER_ID;

      if (token) {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !user) {
          ws.close(1008, 'Invalid token');
          return;
        }
        userId = user.id;
      }

      const clientId = `${userId}:${teamId}`;
      clients.set(clientId, { ws, userId, teamId });
      logger.info(`WebSocket connected: ${clientId}`);

      // Automatically activate team session if it's currently pending
      try {
        const { data: teamData } = await supabaseAdmin
          .from('teams')
          .select('status')
          .eq('id', teamId)
          .single();
        
        if (teamData && teamData.status === 'pending') {
          await supabaseAdmin
            .from('teams')
            .update({
              status: 'active',
              session_start: new Date().toISOString()
            })
            .eq('id', teamId);
          logger.info(`Automatically activated team session for team ${teamId} upon candidate connection`);
        }
      } catch (err: any) {
        logger.error(`Error auto-activating team session: ${err.message}`);
      }

      ws.send(JSON.stringify({ status: 'connected', teamId, userId }));

      ws.on('message', async (data: any) => {
        try {
          const payload = JSON.parse(data.toString());
          const events = payload.events;

          if (!Array.isArray(events) || events.length === 0) {
            ws.send(JSON.stringify({ error: 'events must be a non-empty array' }));
            return;
          }

          // Scope-lock verification: reject events referencing files not in team's snapshot
          const { data: snapshots } = await supabaseAdmin
            .from('code_snapshots')
            .select('files')
            .eq('team_id', teamId)
            .order('snapshot_time', { ascending: false })
            .limit(1);

          const knownFiles: Set<string> = new Set();
          if (snapshots && snapshots.length > 0) {
            Object.keys(snapshots[0].files || {}).forEach(f => knownFiles.add(f));
          }

          const rows = events
            .filter((event: any) => {
              // Only scope-lock file-related events (EV_KBD, EV_PST)
              if (!['EV_KBD', 'EV_PST'].includes(event.event_class)) return true;
              const filePath = event.event_data?.file_path;
              // Allow if no snapshot exists yet or file is known
              if (knownFiles.size === 0 || !filePath) return true;
              if (!knownFiles.has(filePath)) {
                logger.warn(`Scope-lock: ${userId} attempted edit on unlocked file: ${filePath}`);
                ws.send(JSON.stringify({ warning: `Scope violation: ${filePath} is not in team scope` }));
                return false;
              }
              return true;
            })
            .map((event: any) => ({
              team_id: teamId,
              candidate_id: userId,
              event_class: event.event_class,
              event_data: event.event_data,
            }));

          const { error: insertError } = await supabaseAdmin
            .from('telemetry_events')
            .insert(rows);

          if (insertError) {
            logger.error('WebSocket insert error:', insertError.message);
            ws.send(JSON.stringify({ error: 'Failed to store events' }));
          } else {
            ws.send(JSON.stringify({ status: 'ok', count: rows.length }));

            // Check if submission event is present
            const isSubmitted = rows.some(
              r => r.event_class === 'EV_ACP' && r.event_data?.submitted === true
            );
            if (isSubmitted) {
              logger.info(`Detected EV_ACP submission event for team ${teamId}, triggering scoreTeam instantly...`);
              import('./scoringService').then(async ({ scoreTeam }) => {
                try {
                  const results = await scoreTeam(teamId);
                  logger.info(`Successfully completed instant scoring for team ${teamId}`);
                  broadcastToTeam(teamId, { event: 'assessment_scored', teamId, results });
                } catch (err: any) {
                  logger.error(`Error scoring team ${teamId} instantly: ${err.message}`);
                }
              });
            }
          }
        } catch (err: any) {
          logger.error('WebSocket message error:', err.message);
          ws.send(JSON.stringify({ error: 'Invalid payload' }));
        }
      });

      ws.on('close', () => {
        clients.delete(clientId);
        logger.info(`WebSocket disconnected: ${clientId}`);
      });

      ws.on('error', (err: Error) => {
        logger.error(`WebSocket error for ${clientId}:`, err.message);
        clients.delete(clientId);
      });

    } catch (err: any) {
      logger.error('WebSocket connection error:', err.message);
      ws.close(1011, 'Internal error');
    }
  });

  const port = process.env.PORT || 5000;
  logger.info(`WebSocket server ready at ws://localhost:${port}/ws`);
  return wss;
};

// Utility: broadcast a message to all clients in a team
export const broadcastToTeam = (teamId: string, message: object) => {
  for (const [, client] of clients) {
    if (client.teamId === teamId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
};

export const getConnectedClients = () => clients.size;
