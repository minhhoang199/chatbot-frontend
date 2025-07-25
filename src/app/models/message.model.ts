export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file' | 'emoji';
  attachmentUrl?: string;
}