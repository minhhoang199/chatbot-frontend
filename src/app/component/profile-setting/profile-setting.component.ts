import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../service/local-storage.service';
import { NgbAccordionItem } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css'],
})
export class ProfileSettingComponent implements OnInit {
  loading = true;
  error: string | null = null;
  selectedTab: 'personal' | 'privacy' = 'personal';

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  selectTab(tab: 'personal' | 'privacy'): void {
    this.selectedTab = tab;
  }

  logout(): void {
    this.localStorageService.clear(); // Clear all data
    this.router.navigate(['/sign-in']); // Navigate to sign-in page
  }

  goToChat(): void {
    this.router.navigate(['/chat']);
  }
}
