import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#25D366',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId,
      })).data;
      
      console.log('Push token:', token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function savePushToken(userId: string, token: string) {
  const { error } = await supabase
    .from('user_push_tokens')
    .upsert({
      user_id: userId,
      push_token: token,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error saving push token:', error);
  }
}

export async function sendPushNotification(
  recipientId: string,
  title: string,
  body: string,
  data?: any
) {
  try {
    const { data: tokenData, error } = await supabase
      .from('user_push_tokens')
      .select('push_token')
      .eq('user_id', recipientId)
      .single();

    if (error || !tokenData?.push_token) {
      console.error('No push token found for user:', recipientId);
      return;
    }

    const message = {
      to: tokenData.push_token,
      sound: 'default',
      title,
      body,
      data: data || {},
      channelId: 'default',
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push notification sent:', result);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

// Handle notification received while app is running
export function handleNotificationReceived(notification: Notifications.Notification) {
  console.log('Notification received:', notification);
  // You can add custom logic here
}

// Handle notification tapped
export function handleNotificationResponse(response: Notifications.NotificationResponse) {
  console.log('Notification tapped:', response);
  const data = response.notification.request.content.data;
  
  // Navigate to specific chat if notification contains chat data
  if (data.chatId) {
    // Navigation logic will be added in the component
    return data.chatId;
  }
}