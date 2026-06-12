import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetNotificationResponse, GetNumberNotificationResponse } from '../model/get-notification-response';
import { BaseResponse } from '../model/base-response';
import { Notification } from '../model/notification.model';

const friendshipAPIUrl = environment.apiBaseUrl + '/v1/notifications';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private httpClient: HttpClient) {}

  public getLimitNotificationByUserId(before?: Date): Observable<Notification[]> {
    const options: { params?: { before: string } } = {};
    if (before) {
      options.params = { before: before.toISOString() };
    }
    return this.httpClient.get<GetNotificationResponse>(friendshipAPIUrl, options)
      .pipe(map((response) => response.data));
  }

  public unreadCount(): Observable<number> {
    return this.httpClient.get<GetNumberNotificationResponse>(friendshipAPIUrl + "/unread-count")
    .pipe(map((response) => response.data));
  }

  public unreadMessagesCount(): Observable<number> {
    return this.httpClient.get<GetNumberNotificationResponse>(friendshipAPIUrl + "/messages/unread-count")
    .pipe(map((response) => response.data));
  }

  public readNotification(id: number): Observable<string> {
    return this.httpClient
    .put<BaseResponse>(friendshipAPIUrl + "/" + id + "/read", {})
    .pipe(map((response) => response.code));
  }
}
