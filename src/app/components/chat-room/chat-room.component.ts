import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Room } from '../../models/room.model';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnChanges {
  @Input() selectedRoom: Room | null = null;
  
  messages: Message[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRoom'] && this.selectedRoom) {
      this.loadMessages();
    }
  }

  loadMessages(): void {
    if (this.selectedRoom) {
      this.messages = this.chatService.getMessagesForRoom(this.selectedRoom.id);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedRoom) {
      const message: Message = {
        id: Date.now().toString(),
        content: this.newMessage.trim(),
        senderId: 'current-user', // This would come from auth service
        senderName: 'You',
        timestamp: new Date(),
        isRead: false,
        type: 'text'
      };

      this.chatService.sendMessage(this.selectedRoom.id, message);
      this.messages.push(message);
      this.newMessage = '';
    }
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isMessageFromCurrentUser(message: Message): boolean {
    return message.senderId === 'current-user';
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }
}