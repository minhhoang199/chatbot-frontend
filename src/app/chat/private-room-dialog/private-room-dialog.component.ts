import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-private-room-dialog',
  templateUrl: './private-room-dialog.component.html',
  styleUrl: './private-room-dialog.component.css'
})
export class PrivateRoomDialogComponent {
 email: string = '';
   @Output() close = new EventEmitter<void>();
  friendSuggestions = [
    { name: 'Nguyễn Văn C', avatar: 'https://via.placeholder.com/40' },
    { name: 'Lê Thị D', avatar: 'https://via.placeholder.com/40' },
  ];

  closePopup() {
    this.close.emit();
  }

  searchFriend() {
    console.log("Tìm bạn với email:", this.email);
  }

  addFriend(friend: any) {
    console.log("Kết bạn với:", friend.name);
  }
}
