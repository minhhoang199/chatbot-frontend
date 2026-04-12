import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user.model';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrl: './profile-setting.component.css'
})
export class ProfileSettingComponent implements OnInit {
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
