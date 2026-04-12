import { Friendship } from './../model/friendship.model';
import { Room } from '../model/room.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetRoomsResponse } from '../model/get-rooms-response';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GetRoomDetailResponse } from '../model/get-room-detail-response';
import { RoomRequest } from '../model/room-request.model';
import { environment } from '../../environments/environment';
import { GetFriendshipDetailResponse } from '../model/get-friendship-detail-response';
import { GetFriendshipsResponse } from '../model/get-friendships-response';

const friendshipAPIUrl = environment.apiBaseUrl + '/v1/friendships/';
@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  constructor(private httpClient: HttpClient) {}

  public addNewFriendship(requestEmail: string,acceptedEmail: string): Observable<Friendship | null> {
    return this.httpClient
    .post<GetFriendshipDetailResponse>(friendshipAPIUrl, { requestEmail: requestEmail, acceptedEmail: acceptedEmail})
    .pipe(map((response) => response.data));
  }

  public changeStatus(id: number, friendshipStatus: string): Observable<Friendship> {
    return this.httpClient
    .patch<GetFriendshipDetailResponse>(friendshipAPIUrl, { id: id, friendshipStatus: friendshipStatus })
    .pipe(map((response) => response.data));
  }

  public getIncomingRequest(): Observable<Friendship[]> {
    return this.httpClient.get<GetFriendshipsResponse>(friendshipAPIUrl + "incoming-requests")
    .pipe(map((response) => response.data));
  }

  public getOutgoingRequest(): Observable<Friendship[]> {
    return this.httpClient.get<GetFriendshipsResponse>(friendshipAPIUrl + "outgoing-requests")
    .pipe(map((response) => response.data));
  }

  public getAcceptedFriend(findingEmail: string): Observable<Friendship[]> {
    const params = {
          findingEmail: findingEmail
        };
        return this.httpClient
          .get<GetFriendshipsResponse>(friendshipAPIUrl + "accepted-friends", { params })
          .pipe(map((response) => response.data));
  }

  public getBlockedFriend(findingEmail: string): Observable<Friendship[]> {
    const params = {
          findingEmail: findingEmail
        };
        return this.httpClient
          .get<GetFriendshipsResponse>(friendshipAPIUrl + "blocked-friends", { params })
          .pipe(map((response) => response.data));
  }
}
