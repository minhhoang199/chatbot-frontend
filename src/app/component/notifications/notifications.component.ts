import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../model/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  notifications: Notification[] = [];
  loading = false;
  loadingMore = false;
  finished = false;
  error: string | null = null;
  selectedTab: 'all' | 'unread' = 'all';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const before = this.getLastNotificationCreatedAt();
    this.notificationService.getLimitNotificationByUserId(before).subscribe({
      next: (response) => {
        const items = response || [];
        this.notifications = [...this.notifications, ...items];
        
        if (items.length === 0 || items.length < 20) {
          this.finished = true;
        }
        this.loading = false;
        this.loadingMore = false;
      },
      error: () => {
        this.error = 'Unable to load notifications. Please try again.';
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  private getLastNotificationCreatedAt(): Date | undefined {
    const last = this.notifications[this.notifications.length - 1];
    if (!last?.createdAt) {
      return undefined;
    }
    return new Date(last.createdAt);
  }

//   onScroll(event: Event): void {
//     const target = event.target as HTMLElement;
//     if (this.loading || this.loadingMore || this.finished) {
//       return;
//     }

//     if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
//       this.loadNotifications();
//     }
//   }

  onScroll(event: any) {
    const element = event.target;
    console.log('Scroll event:', {
      scrollTop: element.scrollTop,
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight
    });
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 1) {
      this.loadNotifications();
    }
  }

  selectTab(tab: 'all' | 'unread'): void {
    this.selectedTab = tab;
  }

  get filteredNotifications(): Notification[] {
    return this.selectedTab === 'unread'
      ? this.notifications.filter((notification) => !this.isNotificationRead(notification))
      : this.notifications;
  }

  markAsRead(notification: Notification): void {
    if (notification.isRead) {
      return;
    }

    this.notificationService.readNotification(notification.id).subscribe({
      next: (code) => {
        if (code === 'TD-000') {
          notification.isRead = true;
        }
      },
      error: () => {
        this.error = 'Unable to mark notification as read.';
      }
    });
  }

  isNotificationRead(notification: Notification): boolean {
    return notification.isRead === true;
  }

  trackByNotification(index: number, notification: Notification): number {
    return notification.id;
  }
}
