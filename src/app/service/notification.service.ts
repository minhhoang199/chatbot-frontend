import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetFriendshipDetailResponse } from '../model/get-friendship-detail-response';
import { GetNotificationResponse, GetNumberNotificationResponse } from '../model/get-friendships-response';
import { BaseResponse } from '../model/base-response';

const friendshipAPIUrl = environment.apiBaseUrl + '/v1/notifications';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private httpClient: HttpClient) {}

  public getLimitNotificationByUserId(): Observable<Notification[]> {
    return this.httpClient.get<GetNotificationResponse>(friendshipAPIUrl)
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
