import { AttachedFileService } from './attached-file.service';
import { AuthService } from './auth.service';
import { WebsocketService } from './websocket.service';
import { Message } from './../model/message.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '../model/message-response';
import { GetMessagesResponse } from '../model/get-messages-response';
import { Observable, map } from 'rxjs';
import { MessageDto } from '../model/message-dto.model';
import { BaseResponse } from '../model/base-response';

const messageAPIUrl = 'http://localhost:8030/api/v1/messages/'; 
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpClient: HttpClient, private websocketService: WebsocketService, private authService: AuthService, private attachedFileService: AttachedFileService) { }

  public getAllMessagesInRoom(roomId: number, before: Date, limit: number): Observable<Message[]> {
    const params = { roomId: roomId.toString(), before: before.toISOString(), limit: limit.toString() };
    return this.httpClient.get<GetMessagesResponse>(messageAPIUrl, { params }).pipe(map(response => response.data));
  }

  public sendMessage(content: string, roomId: number, replyId: number | null): void {
    let senderId:number = this.authService.getId();
    let sender:string = this.authService.getEmail();
    const message = new MessageDto(null, content, sender, senderId, roomId, 'ACTIVE', 'CHAT', replyId, null);
    this.websocketService.sendMessage(message);
  }

    public editMessage(message: Message): Observable<MessageResponse> {
    let senderId:number = this.authService.getId();
    let sender:string = this.authService.getEmail();
    const editedMessage = new MessageDto(message.id, message.content, sender, senderId, message.roomId, 
      message.messageStatus, message.type, null, message.emoji);
    return this.httpClient.put<MessageResponse>(messageAPIUrl, editedMessage);
  }

    public deleteMessage(messageId: number): Observable<BaseResponse> {
    return this.httpClient.delete<BaseResponse>(messageAPIUrl + messageId);
  }
}
