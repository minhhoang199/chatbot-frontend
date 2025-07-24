import { AuthService } from './auth.service';
import { WebsocketService } from './websocket.service';
import { Message } from './../model/message.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '../model/get-messages-response';
import { Observable, map } from 'rxjs';
import { MessageDto } from '../model/message-dto.model';

const messageAPIUrl = 'http://localhost:8030/api/v1/messages/'; 
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpClient: HttpClient, private websocketService: WebsocketService, private authService: AuthService) { }

  public getAllMessagesInRoom(roomId: number): Observable<Message[]> {
    return this.httpClient.get<MessageResponse>(messageAPIUrl + roomId).pipe(map(response => response.data));
  }

  public sendMessage(content: string, roomId: number){
    let senderId:number = this.authService.getId();
    let sender:string = this.authService.getEmail();
    const message = new MessageDto(content, sender, senderId, roomId, 'ACTIVE', 'CHAT');
    this.websocketService.sendMessage(message);
  }
}
