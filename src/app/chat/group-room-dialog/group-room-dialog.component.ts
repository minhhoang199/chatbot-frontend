import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-group-room-dialog',
  templateUrl: './group-room-dialog.component.html',
  styleUrls: ['./group-room-dialog.component.css'],
})
export class GroupRoomDialogComponent implements OnInit {
  groupName: string = '';
  searchEmail: string = '';
  activeTab: string = 'all';
  currentEmail: string = '';

  @Output() close = new EventEmitter<void>();
  searchResult: User[] = [];

  selectedUsers: User[] = [];

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentEmail = this.authService.getEmail();
    // this.userService.getRecentUserChat().subscribe((users) => {
    //   this.searchResult = users;
    // });
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
      error: () => (this.loading = false),
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  filterUsers() {
    if (!this.searchEmail) return this.searchResult;
    return this.searchResult.filter((f) =>
      f.email.toLowerCase().includes(this.searchEmail.toLowerCase()),
    );
  }

  updateSelected() {
    this.selectedUsers = this.searchResult.filter((f) => f.selected);
  }

  removeSelected(User: User) {
    User.selected = false;
    this.updateSelected();
  }

  closePopup() {
    this.close.emit();
  }

  createGroup() {
    this.roomService
      .createRoom(this.groupName, 'GROUP_CHAT', [
        ...this.selectedUsers.map((f) => f.email),
        this.currentEmail,
      ])
      .subscribe({
        next: (room) => {
          console.log('Room created:', room);
          // this.roomService.notifyRoomCreated(room);
          this.closePopup();
        },
        error: (error) => {
          console.error('Error creating room:', error);
        },
      });
  }

  toggleSelect(user: User) {
    if (this.isSelected(user)) {
      this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
    } else {
      this.selectedUsers.push(user);
    }
  }

  isSelected(user: User) {
    return this.selectedUsers.filter((u) => u.id === user.id).length > 0;
  }
}
