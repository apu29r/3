import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Real-time subscription helper
export const subscribeToMessages = (chatId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      callback
    )
    .subscribe();
};

// Real-time chat list subscription
export const subscribeToChatList = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`chats:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_participants',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

// Online presence
export const updateUserPresence = async (userId: string, isOnline: boolean) => {
  const { error } = await supabase
    .from('users')
    .update({ 
      is_online: isOnline, 
      last_seen: new Date().toISOString() 
    })
    .eq('id', userId);
  
  if (error) console.error('Error updating presence:', error);
};