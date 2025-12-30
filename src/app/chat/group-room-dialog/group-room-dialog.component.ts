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
  friends: User[] = [];

  filteredFriends!: User[];

  selectedFriends: User[] = [];

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.currentEmail = this.authService.getEmail();
    this.filteredFriends = [];
    this.userService.getFriends().subscribe((users) => {
      this.friends = users;
      this.filteredFriends = users;
    });
  }

  onSearchChange() {
    console.log('Search changed:', this.searchEmail);
    this.filteredFriends = this.filterFriends();
  }

  filterFriends() {
    if (!this.searchEmail) return this.friends;
    return this.friends.filter((f) =>
      f.email.toLowerCase().includes(this.searchEmail.toLowerCase())
    );
  }

  updateSelected() {
    this.selectedFriends = this.friends.filter((f) => f.selected);
  }

  removeSelected(friend: User) {
    friend.selected = false;
    this.updateSelected();
  }

  closePopup() {
    this.close.emit();
  }

  createGroup() {
    this.roomService.createRoom(this.groupName, 'GROUP_CHAT', [...this.selectedFriends.map(f => f.email), this.currentEmail]).subscribe({
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

  toggleSelect(user: User) {
    if (this.selectedFriends.includes(user)) {
      this.selectedFriends = this.selectedFriends.filter((f) => f !== user);
    } else {
      this.selectedFriends.push(user);
    }
  }

  isSelected(user: User) {
    return this.selectedFriends.includes(user);
  }
}

