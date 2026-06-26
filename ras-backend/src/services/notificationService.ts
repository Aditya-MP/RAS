import { supabaseAdmin } from '../config/supabase';

export interface NotificationPayload {
  recipient_id: string;
  title: string;
  message: string;
  type?: 'alert' | 'info' | 'success';
  metadata?: any;
}

export const createNotification = async (senderId: string, payload: NotificationPayload) => {
  const { recipient_id, title, message, type = 'info', metadata = {} } = payload;

  if (!recipient_id || !title || !message) {
    throw new Error('Missing required fields: recipient_id, title, message');
  }

  const { data, error } = await supabaseAdmin
    .from('notifications')
    .insert([{
      sender_id: senderId,
      recipient_id,
      title,
      message,
      type,
      metadata
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getNotificationsForUser = async (userId: string, role: string) => {
  let query = supabaseAdmin
    .from('notifications')
    .select('*, sender:profiles!notifications_sender_id_fkey(full_name, email), recipient:profiles!notifications_recipient_id_fkey(full_name, email)')
    .order('created_at', { ascending: false });

  if (role === 'candidate') {
    query = query.eq('recipient_id', userId);
  } else if (role === 'employer') {
    query = query.eq('sender_id', userId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};
