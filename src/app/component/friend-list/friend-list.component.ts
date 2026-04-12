import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.css'
})
export class FriendListComponent implements OnInit {
  loading = true;
  error: string | null = null;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.localStorageService.clear(); // Clear all data
    this.router.navigate(['/sign-in']); // Navigate to sign-in page
  }

  goToChat(): void {
    this.router.navigate(['/chat']);
  }
}
