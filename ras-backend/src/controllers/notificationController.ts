import { Request, Response } from 'express';
import { createNotification, getNotificationsForUser } from '../services/notificationService';

import logger from '../utils/logger';

export const send = async (req: Request, res: Response) => {
  try {
    const senderId = req.user!.id;
    const notification = await createNotification(senderId, req.body);
    res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role; // candidate, employer, admin
    logger.info(`Fetching notifications for userId=${userId}, role=${role}`);
    const notifications = await getNotificationsForUser(userId, role);
    logger.info(`Found ${notifications?.length} notifications for userId=${userId}`);
    res.json({ notifications });
  } catch (error: any) {
    logger.error(`Error listing notifications: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
