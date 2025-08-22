import { supabase } from '@/lib/supabase';
import { registerForPushNotificationsAsync, savePushToken } from './notificationService';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  avatar_url?: string;
  status_message?: string;
  is_online: boolean;
  last_seen: string;
}

export async function signUpWithPhone(phone: string, password: string, name: string) {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      phone,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          phone,
          name,
          status_message: 'Available',
          is_online: true,
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Register for push notifications
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await savePushToken(authData.user.id, pushToken);
      }
    }

    return authData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signInWithPhone(phone: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Update online status
      await supabase
        .from('users')
        .update({
          is_online: true,
          last_seen: new Date().toISOString(),
        })
        .eq('id', data.user.id);

      // Update push token
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await savePushToken(data.user.id, pushToken);
      }
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Update offline status
      await supabase
        .from('users')
        .update({
          is_online: false,
          last_seen: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) throw profileError;
    return profile;
  }
  
  return null;
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}