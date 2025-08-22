import { useState, useEffect, useCallback } from 'react';
import { supabase, subscribeToMessages } from '@/lib/supabase';
import { getMessages, sendMessage, markMessagesAsRead } from '@/services/messageService';
import type { MessageData } from '@/services/messageService';

interface Message extends MessageData {
  id: string;
  created_at: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  sender: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export function useMessages(chatId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load initial messages
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(chatId);
        setMessages(data);
        
        // Mark messages as read
        await markMessagesAsRead(chatId, userId);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId, userId]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chatId) return;

    const subscription = subscribeToMessages(chatId, (payload) => {
      const { eventType, new: newMessage, old: oldMessage } = payload;

      if (eventType === 'INSERT' && newMessage) {
        // Add new message
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });

        // Mark as read if not sent by current user
        if (newMessage.sender_id !== userId) {
          markMessagesAsRead(chatId, userId);
        }
      } else if (eventType === 'UPDATE' && newMessage) {
        // Update message (status change, edit, etc.)
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
          )
        );
      } else if (eventType === 'DELETE' && oldMessage) {
        // Remove deleted message
        setMessages(prev => prev.filter(msg => msg.id !== oldMessage.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, userId]);

  const sendNewMessage = useCallback(async (content: string, type: 'text' | 'image' | 'audio' = 'text') => {
    if (!content.trim() || sending) return;

    try {
      setSending(true);
      
      const messageData: MessageData = {
        chat_id: chatId,
        sender_id: userId,
        content: content.trim(),
        message_type: type,
      };

      await sendMessage(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  }, [chatId, userId, sending]);

  return {
    messages,
    loading,
    sending,
    sendMessage: sendNewMessage,
  };
}