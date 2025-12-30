import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  username: string = '';

  constructor(private localStorageService: LocalStorageService, private router: Router){}
  ngOnInit(): void {
    this.username = this.localStorageService.getString('username') || '';
  }
  logout(): void {
    this.localStorageService.clear(); // Clear all data
    this.router.navigate(['/sign-in']); // Navigate to sign-in page
  }

  // Profile menu state and handlers
  profileMenuOpen: boolean = false;

  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.profileMenuOpen = false;
    }
  }

  isCreatingGroupRoom: boolean = false;

  openCreateGroupRoom(): void {
    this.isCreatingGroupRoom = true;
  }

  closeCreateGroupRoom(): void {
    this.isCreatingGroupRoom = false;
  }
}
