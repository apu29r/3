import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send, Paperclip, Mic, Phone, Video } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { getChatDetails } from '@/services/chatService';
import { formatMessageTime } from '@/utils/dateUtils';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { messages, loading, sending, sendMessage } = useMessages(id!, user?.id || '');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id) {
      getChatDetails(id).then(setChatInfo).catch(console.error);
    }
  }, [id]);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      try {
        await sendMessage(inputText);
        setInputText('');
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (!user || !chatInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Get chat display info
  const displayName = chatInfo.type === 'individual' 
    ? chatInfo.participants.find((p: any) => p.user.id !== user.id)?.user.name || 'Unknown'
    : chatInfo.name;
  
  const displayAvatar = chatInfo.type === 'individual'
    ? chatInfo.participants.find((p: any) => p.user.id !== user.id)?.user.avatar_url
    : chatInfo.avatar_url;

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[
      styles.messageContainer,
      item.sender_id === user.id ? styles.userMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender_id === user.id ? styles.userMessageText : styles.otherMessageText
      ]}>
        {item.content}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={[
          styles.timestamp,
          item.sender_id === user.id ? styles.userTimestamp : styles.otherTimestamp
        ]}>
          {formatMessageTime(new Date(item.created_at))}
        </Text>
        {item.sender_id === user.id && (
          <View style={styles.statusIndicator}>
            <Text style={styles.statusText}>
              {item.status === 'sent' ? '✓' : item.status === 'delivered' ? '✓✓' : '✓✓'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerContent}>
              <Image 
                source={{ 
                  uri: displayAvatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100' 
                }} 
                style={styles.headerAvatar} 
              />
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>{displayName}</Text>
                <Text style={styles.headerStatus}>অনলাইন</Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <Video size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <Phone size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Paperclip size={20} color="#8e8e93" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="বার্তা লিখুন..."
          placeholderTextColor="#8e8e93"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        {inputText.trim() ? (
          <TouchableOpacity 
            style={[styles.sendButton, sending && styles.sendingButton]} 
            onPress={handleSendMessage}
            disabled={sending}
          >
            <Send size={20} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.voiceButton, isRecording && styles.recordingButton]}
            onPressIn={() => setIsRecording(true)}
            onPressOut={() => setIsRecording(false)}
          >
            <Mic size={20} color={isRecording ? "#ffffff" : "#8e8e93"} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  headerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerStatus: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginLeft: 16,
    padding: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#25D366',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  otherMessageText: {
    color: '#000000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    marginRight: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#8e8e93',
  },
  statusIndicator: {
    marginLeft: 4,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  sendButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendingButton: {
    opacity: 0.6,
  },
  voiceButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#f8f8f8',
  },
  recordingButton: {
    backgroundColor: '#ff3b30',
  },
});