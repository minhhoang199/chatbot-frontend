import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  constructor(private localStorageService: LocalStorageService, private router: Router){}
  logout(): void {
    this.localStorageService.clear(); // Clear all data
    this.router.navigate(['/sign-in']); // Navigate to sign-in page
  }
  isCreatingGroupRoom: boolean = false;

  openCreateGroupRoom(): void {
    this.isCreatingGroupRoom = true;
  }

  closeCreateGroupRoom(): void {
    this.isCreatingGroupRoom = false;
  }
}
