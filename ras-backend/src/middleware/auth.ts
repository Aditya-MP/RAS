import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import logger from '../utils/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const DEV_MODE = process.env.NODE_ENV === 'development';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      // In dev mode, allow mock user when Supabase auth fails
      if (DEV_MODE && token === 'dev-mock-token') {
        req.user = { id: 'dev-user-id', email: 'dev@example.com', role: 'candidate' };
        logger.info('Authenticated mock user in dev mode');
        return next();
      }
      logger.warn(`Auth failed for token: ${error?.message || 'User not found'}`);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    let role = user.user_metadata?.role;
    if (!role) {
      // Fallback: Query profiles table
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile) {
        role = profile.role;
      }
    }

    req.user = { id: user.id, email: user.email, role };
    logger.info(`Authenticated user: id=${user.id}, email=${user.email}, role=${role}`);
    next();
  } catch (err: any) {
    logger.error('Auth service error:', err.message);
    // In dev mode, allow mock user when Supabase is unreachable
    if (DEV_MODE) {
      req.user = { id: 'dev-user-id', email: 'dev@example.com', role: 'candidate' };
      return next();
    }
    return res.status(503).json({ error: 'Authentication service temporarily unavailable' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};