import { RoomService } from './../../service/room.service';
import { Room } from './../../model/room.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-name-dialog',
  templateUrl: './chat-name-dialog.component.html',
  styleUrls: ['./chat-name-dialog.component.css'],
})
export class ChatNameDialogComponent {
  @Input() chatName: string = '';
  @Input() roomId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  constructor(
    private roomService: RoomService
  ) {}
  
  closePopup() {
    this.close.emit();
  }

  saveName() {
    const name = this.chatName.trim();
    if (name) {
        this.roomService.updateRoomName(this.roomId, name).subscribe({
          next: (res) => {
            if(res === 'TD-000') {
              this.save.emit(name);
              this.close.emit();
            }
          }
        });
    }
  }
}
