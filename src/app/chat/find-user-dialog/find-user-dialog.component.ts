import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentEmail = this.authService.getEmail();
    this.searchResult = [];
  }

  closePopup() {
    this.close.emit();
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

  openChat(selectedEmail: string) {
    this.roomService.getRoomByEmail(selectedEmail).subscribe({
      next: (room) => {
        if (room) {
          this.router.navigate(['/chat', room.id]);
          this.closePopup();
        } else {
          console.warn('No existing room found for', selectedEmail);
        }
      }
    });
  }
}
