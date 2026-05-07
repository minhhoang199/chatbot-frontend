import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-find-user-dialog',
  templateUrl: './find-user-dialog.component.html',
  styleUrl: './find-user-dialog.component.css'
})
export class FindUserDialogComponent implements OnInit {
  selectedUserName: string = '';
  searchEmail: string = '';
  activeTab: string = 'all';
  currentEmail: string = '';

  @Output() close = new EventEmitter<void>();
  searchResult!: User[];

  selectedUser: User = {} as User;

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.currentEmail = this.authService.getEmail();
    this.searchResult = [];
  }

  updateSelected() {
    this.selectedUser = this.searchResult.filter((f) => f.selected)[0];
  }

  removeSelected(friend: User) {
    friend.selected = false;
    this.updateSelected();
  }

  closePopup() {
    this.close.emit();
  }

  createGroup() {
    this.roomService.createRoom(this.selectedUser.username + '-' + this.currentEmail, 'PRIVATE_CHAT', [this.selectedUser.email, this.currentEmail]).subscribe({
      next: (room) => {
        console.log('Room created:', room);
        // this.roomService.notifyRoomCreated(room);
        this.closePopup();
      },
      error: (error) => {
        console.error('Error creating room:', error);
      }
    });
  }

  loading = false;
  onSearch() {
    if (!this.searchEmail.trim()) return;
    this.loading = true;
    this.userService.searchUsers(this.searchEmail).subscribe({
      next: (res) => {
        this.searchResult = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
