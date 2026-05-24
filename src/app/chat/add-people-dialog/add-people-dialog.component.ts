import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-add-people-dialog',
  templateUrl: './add-people-dialog.component.html',
  styleUrls: ['./add-people-dialog.component.css'],
})
export class AddPeopleDialogComponent implements OnInit {
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
    this.userService.getRecentUserChat().subscribe((users) => {
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

  addPeople() {
    console.log('Adding people:', this.selectedFriends);
    // Add people to existing room logic
    this.closePopup();
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
