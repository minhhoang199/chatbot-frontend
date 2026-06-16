import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '../../service/local-storage.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;
  unreadMessagesCount = 0;
  unreadNotificationsCount = 0;
  showNotificationsPopup = false;
  private destroy$ = new Subject<void>();
  @ViewChild('notificationsTrigger', { read: ElementRef }) notificationsTrigger?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToChat(): void {
    this.router.navigate(['/chat']);
  }
}
