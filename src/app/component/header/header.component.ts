import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '../../service/local-storage.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  unreadMessagesCount = 0;
  unreadNotificationsCount = 0;
  showNotificationsPopup = false;
  private destroy$ = new Subject<void>();
  @ViewChild('notificationsTrigger', { read: ElementRef }) notificationsTrigger?: ElementRef<HTMLElement>;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    interval(5000)
      .pipe(startWith(0), takeUntil(this.destroy$))
      .subscribe(() => this.loadNotificationCounts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNotificationCounts(): void {
    this.notificationService.unreadMessagesCount().subscribe({
      next: (count) => (this.unreadMessagesCount = count ?? 0),
      error: () => (this.unreadMessagesCount = 0)
    });

    this.notificationService.unreadCount().subscribe({
      next: (count) => (this.unreadNotificationsCount = count ?? 0),
      error: () => (this.unreadNotificationsCount = 0)
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
    this.showNotificationsPopup = false;
  }

  logout(): void {
    this.localStorageService.clear();
    this.router.navigate(['/sign-in']);
  }

  toggleNotificationsPopup(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.showNotificationsPopup = !this.showNotificationsPopup;
  }

  closeNotificationsPopup(): void {
    this.showNotificationsPopup = false;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.showNotificationsPopup) {
      return;
    }

    if (this.notificationsTrigger?.nativeElement.contains(target)) {
      return;
    }

    this.showNotificationsPopup = false;
  }
}
