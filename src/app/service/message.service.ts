import { AttachedFileService } from './attached-file.service';
import { AuthService } from './auth.service';
import { WebsocketService } from './websocket.service';
import { Message } from './../model/message.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '../model/message-response';
import { GetMessagesResponse } from '../model/get-messages-response';
import { Observable, map } from 'rxjs';
import { MessageRequest } from '../model/message-request.model';
import { BaseResponse } from '../model/base-response';
import { environment } from '../../environments/environment';

const messageAPIUrl = environment.apiBaseUrl + '/v1/messages/';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private httpClient: HttpClient,
    private websocketService: WebsocketService,
    private authService: AuthService,
    private attachedFileService: AttachedFileService
  ) {}

  public getLimitMessagesInRoom(roomId: number, before: Date, limit: number): Observable<Message[]> {
    const params = {
      roomId: roomId.toString(),
      before: before.toISOString(),
      limit: limit.toString(),
    };
    return this.httpClient
      .get<GetMessagesResponse>(messageAPIUrl + 'limit', { params })
      .pipe(map((response) => response.data));
  }

    public searchByContent(roomId: number, content: string): Observable<Message[]> {
    const params = {
roomId: roomId.toString(),
      content: content
    };
    return this.httpClient
      .get<GetMessagesResponse>(messageAPIUrl + 'search-by-content', { params })
      .pipe(map((response) => response.data));
  }

  public getAllMessagesInRoomFromTo(roomId: number, before: Date | null, after: Date | null): Observable<Message[]> {
    let params = new HttpParams().set('roomId', roomId.toString());

    if (before) {
      params = params.set('before', before.toISOString());
    }
    if (after) {
      params = params.set('after', after.toISOString());
    }

    return this.httpClient
      .get<GetMessagesResponse>(messageAPIUrl + 'all', { params })
      .pipe(map((response) => response.data));
  }

  public sendMessage(content: string, roomId: number, replyId: number | null): void {
    let senderId: number = this.authService.getId();
    let sender: string = this.authService.getEmail();
    const message = new MessageRequest(
      null,
      content,
      sender,
      senderId,
      roomId,
      'ACTIVE',
      'CHAT',
      replyId,
      null
    );
    this.websocketService.sendMessage(message);
  }

  public editMessage(message: Message): Observable<MessageResponse> {
    let senderId: number = this.authService.getId();
    let sender: string = this.authService.getEmail();
    const editedMessage = new MessageRequest(
      message.id,
      message.content,
      sender,
      senderId,
      message.roomId,
      message.messageStatus,
      message.type,
      null,
      message.emoji
    );
    return this.httpClient.put<MessageResponse>(messageAPIUrl, editedMessage);
  }

  public deleteMessage(messageId: number): Observable<BaseResponse> {
    return this.httpClient.delete<BaseResponse>(messageAPIUrl + messageId);
  }
}
