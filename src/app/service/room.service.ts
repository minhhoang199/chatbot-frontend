import { Room } from './../model/room.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetRoomsResponse } from '../model/get-rooms-response';
import { Observable, map } from 'rxjs';

const getAllRoomAPIUrl = 'http://localhost:8030/api/v1/rooms/'; 
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private httpClient: HttpClient) { }

  public getAllRooms(userId: number): Observable<Room[]>{
      return this.httpClient.get<GetRoomsResponse>(getAllRoomAPIUrl + userId).pipe(map(response => response.data));
  }
}
