import { Room } from './../model/room.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetRoomsResponse } from '../model/get-rooms-response';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GetRoomDetailResponse } from '../model/get-room-detail-response';
import { RoomRequest } from '../model/room-request.model';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../model/base-response';

const roomAPIUrl = environment.apiBaseUrl + '/v1/rooms/';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private roomsUpdated = new BehaviorSubject<Room | null>(null);
  private roomUpdated = new BehaviorSubject<{ roomId: number; name: string } | null>(null);
  constructor(private httpClient: HttpClient) {}

  public getAllRooms(userId: number): Observable<Room[]> {
    return this.httpClient
      .get<GetRoomsResponse>(roomAPIUrl + 'users/' + userId)
      .pipe(map((response) => response.data));
  }

  public getRoomDetail(roomId: number): Observable<Room | null> {
    return this.httpClient
      .get<GetRoomDetailResponse>(roomAPIUrl + roomId)
      .pipe(map((response) => response.data || null));
  }

  public createRoom(name: string, roomType: string, emails: string[]): Observable<Room> {
    return this.httpClient.post<GetRoomDetailResponse>(roomAPIUrl, new RoomRequest(name, roomType, emails)).pipe(map((response) => response.data));
  }

  public notifyRoomCreated(room: Room) {
    this.roomsUpdated.next(room);
  }

  public onRoomCreated() {
    return this.roomsUpdated.asObservable();
  }

  public notifyRoomUpdated(roomId: number, name: string) {
    this.roomUpdated.next({ roomId, name });
  }

  public onRoomUpdated() {
    return this.roomUpdated.asObservable();
  }

  getRoomByEmail(selectedEmail: string): Observable<Room | null> {
    return this.httpClient
      .get<GetRoomDetailResponse>(roomAPIUrl + 'get-by-email?email=' + selectedEmail)
      .pipe(map((response) => response.data || null));
  }

  public updateRoomName(roomId: number, newName: string): Observable<String> {
    return this.httpClient.put<BaseResponse>(roomAPIUrl + roomId + '/change-name', { name: newName }).pipe(map((response) => response.code));
  }

  // Members management
  public getMembers(roomId: number): Observable<any[]> {
    return this.httpClient
      .get<any>(roomAPIUrl + roomId + '/members')
      .pipe(map((response) => response.data || []));
  }

  public addMembers(roomId: number, emails: string[]): Observable<string> {
    return this.httpClient
      .put<BaseResponse>(roomAPIUrl + 'add-users', { roomId: roomId, emails: emails })
      .pipe(map((response) => response.code));
  }

  public removeMembers(roomId: number, emails: string[]): Observable<string> {
    return this.httpClient
      .put<BaseResponse>(roomAPIUrl + 'remove-users', { roomId: roomId, emails: emails })
      .pipe(map((response) => response.code));
  }

  public leaveRoom(roomId: number): Observable<string> {
    return this.httpClient
      .put<BaseResponse>(roomAPIUrl+ roomId + '/outRoom', {})
      .pipe(map((response) => response.code));
  }
}
