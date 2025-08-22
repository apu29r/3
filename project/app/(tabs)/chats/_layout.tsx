import { Stack } from 'expo-router';

export default function ChatsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Sohoj Calling',
          headerStyle: {
            backgroundColor: '#25D366',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }} 
      />
      <Stack.Screen 
        name="chat/[id]" 
        options={{ 
          headerShown: true,
          headerStyle: {
            backgroundColor: '#25D366',
          },
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="new-chat" 
        options={{ 
          title: 'New Chat',
          headerStyle: {
            backgroundColor: '#25D366',
          },
          headerTintColor: '#ffffff',
        }} 
      />
    </Stack>
  );
}