import { Message } from './message.model';

export interface Room {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  lastSeen: string;
  unreadCount: number;
  isOnline: boolean;
  participants: string[];
}