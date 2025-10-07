import { Room } from './../model/room.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetRoomsResponse } from '../model/get-rooms-response';
import { Observable, map } from 'rxjs';
import { GetRoomDetailResponse } from '../model/get-room-detail-response';

const getAllRoomAPIUrl = 'http://localhost:8030/api/v1/rooms/'; 
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private httpClient: HttpClient) { }

  public getAllRooms(userId: number): Observable<Room[]>{
      return this.httpClient.get<GetRoomsResponse>(getAllRoomAPIUrl + "users/" + userId).pipe(map(response => response.data));
  }

  public getRoomDetail(roomId: number): Observable<Room | null> {
    return this.httpClient.get<GetRoomDetailResponse>(getAllRoomAPIUrl + roomId).pipe(
      map(response => response.data || null)
    );
  }
}
