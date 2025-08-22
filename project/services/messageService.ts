import { supabase } from '@/lib/supabase';
import { sendPushNotification } from './notificationService';

export interface MessageData {
  id?: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document';
  reply_to?: string;
  metadata?: any;
}

export async function sendMessage(messageData: MessageData) {
  try {
    // Insert message into database
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        ...messageData,
        created_at: new Date().toISOString(),
        status: 'sent',
      })
      .select()
      .single();

    if (error) throw error;

    // Update chat's last message
    await supabase
      .from('chats')
      .update({
        last_message_id: message.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageData.chat_id);

    // Get chat participants for notifications
    const { data: participants } = await supabase
      .from('chat_participants')
      .select('user_id, users(name)')
      .eq('chat_id', messageData.chat_id)
      .neq('user_id', messageData.sender_id);

    // Get sender info
    const { data: sender } = await supabase
      .from('users')
      .select('name')
      .eq('id', messageData.sender_id)
      .single();

    // Send push notifications to all participants
    if (participants && sender) {
      for (const participant of participants) {
        await sendPushNotification(
          participant.user_id,
          sender.name,
          messageData.content,
          {
            chatId: messageData.chat_id,
            messageId: message.id,
            type: 'message',
          }
        );
      }
    }

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getMessages(chatId: string, limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users(id, name, avatar_url)
    `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data.reverse(); // Return in chronological order
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'read' })
    .eq('chat_id', chatId)
    .neq('sender_id', userId)
    .neq('status', 'read');

  if (error) {
    console.error('Error marking messages as read:', error);
  }
}

export async function deleteMessage(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
}