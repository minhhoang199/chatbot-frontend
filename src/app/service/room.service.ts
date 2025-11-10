import { Room } from './../model/room.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetRoomsResponse } from '../model/get-rooms-response';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GetRoomDetailResponse } from '../model/get-room-detail-response';
import { RoomRequest } from '../model/room-request.model';
import { environment } from '../../environments/environment';

const roomAPIUrl = environment.apiBaseUrl + '/v1/rooms/';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private roomsUpdated = new BehaviorSubject<Room | null>(null);
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
}
