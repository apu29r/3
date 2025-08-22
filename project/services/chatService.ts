import { supabase } from '@/lib/supabase';

export interface ChatData {
  id?: string;
  name?: string;
  type: 'individual' | 'group';
  avatar_url?: string;
  created_by: string;
}

export async function createChat(chatData: ChatData, participantIds: string[]) {
  try {
    // Create chat
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert({
        ...chatData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (chatError) throw chatError;

    // Add participants
    const participants = participantIds.map(userId => ({
      chat_id: chat.id,
      user_id: userId,
      joined_at: new Date().toISOString(),
    }));

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participants);

    if (participantsError) throw participantsError;

    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

export async function getUserChats(userId: string) {
  const { data, error } = await supabase
    .from('chat_participants')
    .select(`
      chat_id,
      chats (
        id,
        name,
        type,
        avatar_url,
        updated_at,
        last_message:messages!chats_last_message_id_fkey (
          id,
          content,
          created_at,
          sender:users(name)
        ),
        participants:chat_participants (
          user:users (
            id,
            name,
            avatar_url,
            is_online,
            last_seen
          )
        )
      )
    `)
    .eq('user_id', userId)
    .order('chats(updated_at)', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getChatDetails(chatId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      participants:chat_participants (
        user:users (
          id,
          name,
          avatar_url,
          is_online,
          last_seen
        )
      )
    `)
    .eq('id', chatId)
    .single();

  if (error) throw error;
  return data;
}

export async function leaveChat(chatId: string, userId: string) {
  const { error } = await supabase
    .from('chat_participants')
    .delete()
    .eq('chat_id', chatId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function addParticipants(chatId: string, userIds: string[]) {
  const participants = userIds.map(userId => ({
    chat_id: chatId,
    user_id: userId,
    joined_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('chat_participants')
    .insert(participants);

  if (error) throw error;
}