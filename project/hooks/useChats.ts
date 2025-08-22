import { useState, useEffect } from 'react';
import { supabase, subscribeToChatList } from '@/lib/supabase';
import { getUserChats, createChat } from '@/services/chatService';
import type { ChatData } from '@/services/chatService';

interface Chat {
  id: string;
  name?: string;
  type: 'individual' | 'group';
  avatar_url?: string;
  updated_at: string;
  last_message?: {
    id: string;
    content: string;
    created_at: string;
    sender: {
      name: string;
    };
  };
  participants: Array<{
    user: {
      id: string;
      name: string;
      avatar_url?: string;
      is_online: boolean;
      last_seen: string;
    };
  }>;
  unread_count?: number;
}

export function useChats(userId: string) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user chats
  useEffect(() => {
    if (!userId) return;

    const loadChats = async () => {
      try {
        setLoading(true);
        const data = await getUserChats(userId);
        const formattedChats = data.map(item => ({
          ...item.chats,
          // For individual chats, use the other participant's info
          name: item.chats.type === 'individual' 
            ? item.chats.participants.find(p => p.user.id !== userId)?.user.name || 'Unknown'
            : item.chats.name,
          avatar_url: item.chats.type === 'individual'
            ? item.chats.participants.find(p => p.user.id !== userId)?.user.avatar_url
            : item.chats.avatar_url,
        }));
        setChats(formattedChats);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [userId]);

  // Subscribe to chat updates
  useEffect(() => {
    if (!userId) return;

    const subscription = subscribeToChatList(userId, (payload) => {
      // Reload chats when there are changes
      getUserChats(userId).then(data => {
        const formattedChats = data.map(item => ({
          ...item.chats,
          name: item.chats.type === 'individual' 
            ? item.chats.participants.find(p => p.user.id !== userId)?.user.name || 'Unknown'
            : item.chats.name,
          avatar_url: item.chats.type === 'individual'
            ? item.chats.participants.find(p => p.user.id !== userId)?.user.avatar_url
            : item.chats.avatar_url,
        }));
        setChats(formattedChats);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const createNewChat = async (chatData: ChatData, participantIds: string[]) => {
    try {
      const newChat = await createChat(chatData, [...participantIds, userId]);
      
      // Reload chats to include the new one
      const data = await getUserChats(userId);
      const formattedChats = data.map(item => ({
        ...item.chats,
        name: item.chats.type === 'individual' 
          ? item.chats.participants.find(p => p.user.id !== userId)?.user.name || 'Unknown'
          : item.chats.name,
        avatar_url: item.chats.type === 'individual'
          ? item.chats.participants.find(p => p.user.id !== userId)?.user.avatar_url
          : item.chats.avatar_url,
      }));
      setChats(formattedChats);
      
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  return {
    chats,
    loading,
    createChat: createNewChat,
  };
}