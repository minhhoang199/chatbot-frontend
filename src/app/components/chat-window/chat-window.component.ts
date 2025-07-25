import { Component } from '@angular/core';
import { Room } from '../../models/room.model';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  selectedRoom: Room | null = null;

  onRoomSelected(room: Room): void {
    this.selectedRoom = room;
  }
}