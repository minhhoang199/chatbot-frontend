import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() roomId!: number;

  @Output() close = new EventEmitter<void>();
  searchResult: User[] = [];

  selectedPeople: User[] = [];

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.currentEmail = this.authService.getEmail();
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

  filterPeople() {
    if (!this.searchEmail) return this.searchResult;
    return this.searchResult.filter((f) =>
      f.email.toLowerCase().includes(this.searchEmail.toLowerCase())
    );
  }

  updateSelected() {
    this.selectedPeople = this.searchResult.filter((f) => f.selected);
  }

  removeSelected(people: User) {
    people.selected = false;
    this.updateSelected();
  }

  closePopup() {
    this.close.emit();
  }

  addPeople() {
    this.roomService.addMembers(this.roomId, this.selectedPeople.map((m) => m.email)).subscribe({
          next: (res) => {
            if(res === 'TD-000') {
              this.close.emit();
            }
          }
        });
  }

  toggleSelect(user: User) {
    if (this.isSelected(user)) {
      this.selectedPeople = this.selectedPeople.filter((u) => u.id !== user.id);
    } else {
      this.selectedPeople.push(user);
    }
  }

  isSelected(user: User) {
    return this.selectedPeople.filter((u) => u.id === user.id).length > 0;
  }
}
