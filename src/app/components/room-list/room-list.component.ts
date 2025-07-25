import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Room } from '../../models/room.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  @Output() roomSelected = new EventEmitter<Room>();
  
  rooms: Room[] = [];
  searchQuery: string = '';
  selectedRoomId: string | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.rooms = this.chatService.getRooms();
  }

  selectRoom(room: Room): void {
    this.selectedRoomId = room.id;
    this.roomSelected.emit(room);
  }

  get filteredRooms(): Room[] {
    if (!this.searchQuery) {
      return this.rooms;
    }
    return this.rooms.filter(room => 
      room.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      room.lastMessage?.content.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (diffInHours < 48) {
      return 'yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
}