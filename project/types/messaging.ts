export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: string;
  lastSeen?: Date;
  isOnline: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  type: 'individual' | 'group';
  name?: string; // For group chats
  avatar?: string; // For group chats
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  timestamp: Date;
  replyTo?: string; // Message ID being replied to
  metadata?: {
    fileName?: string;
    fileSize?: number;
    duration?: number; // For audio/video
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface CallRecord {
  id: string;
  participantIds: string[];
  type: 'voice' | 'video';
  status: 'incoming' | 'outgoing' | 'missed';
  duration?: number; // in seconds
  timestamp: Date;
}

export interface StatusUpdate {
  id: string;
  userId: string;
  type: 'text' | 'image' | 'video';
  content: string;
  backgroundColor?: string; // For text status
  timestamp: Date;
  expiresAt: Date;
  viewedBy: string[]; // User IDs who viewed this status
}