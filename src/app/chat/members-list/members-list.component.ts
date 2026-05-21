import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent implements OnInit {
  @Input() roomId!: number;
  @Output() close = new EventEmitter<void>();
  members: User[] = [];
  searchingEmail = '';
  suggestions: User[] = [];
  loading = false;

  groupName: string = '';
  searchEmail: string = '';
  activeTab: string = 'all';
  currentEmail: string = '';
  filteredMembers!: User[];
  selectedMembers: User[] = [];

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentEmail = this.authService.getEmail();
    this.filteredMembers = [];
    this.roomService.getMembers(this.roomId).subscribe((members) => {
      this.members = members;
      this.filteredMembers = members;
    });
  }

  onSearchChange() {
    console.log('Search changed:', this.searchEmail);
    this.filteredMembers = this.filterMembers();
  }

  filterMembers() {
    if (!this.searchEmail) return this.members;
    return this.members.filter((f) =>
      f.email.toLowerCase().includes(this.searchEmail.toLowerCase()),
    );
  }

  updateSelected() {
    this.selectedMembers = this.members.filter((f) => f.selected);
  }

  removeSelected(member: User) {
    member.selected = false;
    this.updateSelected();
  }

  closePopup() {
    this.close.emit();
  }

  removeMember() {
    this.roomService
      .removeMembers(
        this.roomId,
        this.selectedMembers.map((m) => m.email),
      )
      .subscribe((response) => {
        if (response === 'TD-000') {
          this.members = this.members.filter(
            (m) => !this.selectedMembers.includes(m),
          );
          this.filteredMembers = this.filterMembers();
          this.selectedMembers = [];
        } else {
          // Handle error case, e.g., show a notification
          this.closePopup();
        }
      });
  }

  toggleSelect(user: User) {
    if (this.selectedMembers.includes(user)) {
      this.selectedMembers = this.selectedMembers.filter((f) => f !== user);
    } else {
      this.selectedMembers.push(user);
    }
  }

  isSelected(user: User) {
    return this.selectedMembers.includes(user);
  }
}
