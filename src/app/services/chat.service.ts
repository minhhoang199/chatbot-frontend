import { Injectable } from '@angular/core';
import { Room } from '../models/room.model';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private rooms: Room[] = [
    {
      id: '1',
      name: 'Emily Woods',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      lastMessage: {
        id: '1',
        content: "I'm looking forward to it",
        senderId: '1',
        senderName: 'Emily Woods',
        timestamp: new Date(Date.now() - 1000 * 60 * 65), // 1 hour 5 minutes ago
        isRead: true,
        type: 'text'
      },
      lastSeen: 'last seen today at 08:55 AM',
      unreadCount: 0,
      isOnline: false,
      participants: ['current-user', '1']
    },
    {
      id: '2',
      name: 'Beate Lemoine',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      lastMessage: {
        id: '2',
        content: 'Hey Quan, if you are free now we can meet tonight ?',
        senderId: '2',
        senderName: 'Beate Lemoine',
        timestamp: new Date(Date.now() - 1000 * 60 * 99), // 1 hour 39 minutes ago
        isRead: false,
        type: 'text'
      },
      lastSeen: 'last seen today at 09:15 PM',
      unreadCount: 2,
      isOnline: true,
      participants: ['current-user', '2']
    },
    {
      id: '3',
      name: 'Tessa Nau',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
      lastMessage: {
        id: '3',
        content: "No that's everything, thanks...",
        senderId: '3',
        senderName: 'Tessa Nau',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4 - 1000 * 60 * 39), // 4 hours 39 minutes ago
        isRead: true,
        type: 'text'
      },
      lastSeen: 'last seen today at 04:21 PM',
      unreadCount: 0,
      isOnline: false,
      participants: ['current-user', '3']
    },
    {
      id: '4',
      name: 'Eric Campos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      lastMessage: {
        id: '4',
        content: "So cool, I'll let you know if...",
        senderId: '4',
        senderName: 'Eric Campos',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5 - 1000 * 60 * 13), // 5 hours 13 minutes ago
        isRead: true,
        type: 'text'
      },
      lastSeen: 'last seen today at 03:47 PM',
      unreadCount: 0,
      isOnline: false,
      participants: ['current-user', '4']
    }
  ];

  private messages: { [roomId: string]: Message[] } = {
    '2': [
      {
        id: '1',
        content: "I'm glad we had time to meet up.",
        senderId: '2',
        senderName: 'Beate Lemoine',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 6), // 2 hours 6 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '2',
        content: ':)',
        senderId: 'current-user',
        senderName: 'You',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 3), // 2 hours 3 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '3',
        content: "Me too. So, what's going on?",
        senderId: 'current-user',
        senderName: 'You',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 - 1000 * 60 * 3), // 2 hours 3 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '4',
        content: 'Oh, not much. You?',
        senderId: '2',
        senderName: 'Beate Lemoine',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 55), // 1 hour 55 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '5',
        content: "Not much. Hey, how did your interview go? Wasn't that today?",
        senderId: 'current-user',
        senderName: 'You',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 54), // 1 hour 54 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '6',
        content: "Oh, yeah. I think it went well. I don't know the job yet, but they said they would call in a few days.",
        senderId: '2',
        senderName: 'Beate Lemoine',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 51), // 1 hour 51 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '7',
        content: "Well, I'm sure you did great. Good luck.",
        senderId: 'current-user',
        senderName: 'You',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 48), // 1 hour 48 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '8',
        content: "Thanks. I'm just happy that it's over. I was really nervous about it.",
        senderId: '2',
        senderName: 'Beate Lemoine',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 44), // 1 hour 44 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '9',
        content: 'I can understand that. I get nervous before interviews, too',
        senderId: 'current-user',
        senderName: 'You',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 39), // 1 hour 39 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '10',
        content: 'Well, thanks for being supportive. I appreciate it.',
        senderId: '2',
        senderName: 'Beate Lemoine',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1 - 1000 * 60 * 36), // 1 hour 36 minutes ago
        isRead: true,
        type: 'text'
      },
      {
        id: '11',
        content: 'Hey Quan, if you are free now we can meet tonight ?',
        senderId: '2',
        senderName: 'Beate Lemoine',
        timestamp: new Date(Date.now() - 1000 * 60 * 99), // 1 hour 39 minutes ago
        isRead: false,
        type: 'text'
      }
    ]
  };

  constructor() {}

  getRooms(): Room[] {
    return this.rooms.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || new Date(0);
      const bTime = b.lastMessage?.timestamp || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  }

  getMessagesForRoom(roomId: string): Message[] {
    return this.messages[roomId] || [];
  }

  sendMessage(roomId: string, message: Message): void {
    if (!this.messages[roomId]) {
      this.messages[roomId] = [];
    }
    this.messages[roomId].push(message);

    // Update room's last message
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.lastMessage = message;
    }
  }

  markMessagesAsRead(roomId: string): void {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      room.unreadCount = 0;
    }

    const messages = this.messages[roomId];
    if (messages) {
      messages.forEach(message => {
        if (message.senderId !== 'current-user') {
          message.isRead = true;
        }
      });
    }
  }
}