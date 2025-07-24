import { Message } from './../model/message.model';
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { MessageService } from './message.service';
import { Observable, Subject } from 'rxjs';
import { MessageDto } from '../model/message-dto.model';

const serverUrl = 'http://localhost:8030/ws';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient!: Stomp.Client;
  private messageService!: MessageService;

  public connect1(
    roomId: number,
    isNewClient: boolean,
    username: string
  ): Observable<any> {
    return new Observable<any>((observer) => {
      const socket = new SockJS(serverUrl);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, () => {
        console.log('connect completed');
        this.subscribe(roomId, isNewClient, username).subscribe({
          next: (message) => observer.next(message),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      });
    });
  }

  public connect(
    roomId: number,
    isNewClient: boolean,
    username: string
  ):  Observable<any> {
    const socket = new SockJS(serverUrl);
    this.stompClient = Stomp.over(socket);
    
    return new Observable<any>((observer) => {
      this.stompClient.connect({}, () => {
        console.log('connect completed');
        this.subscribe(roomId, isNewClient, username).subscribe({
          next: (message) => observer.next(message),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      });
    });
  }

  public subscribe(
    roomId: number, //lấy từ url
    isNewClient: boolean, //gọi API từ Backend check xem user hiện tại có phải là user mới ko, nếu có trả ra thêm username
    username: string //lấy từ API phía trên
  ): Observable<any> {
    const subject = new Subject<any>();
    // Subscribe to the Public Topic
    this.stompClient.subscribe(
      '/topic/room/'+ roomId,
      (payload: any) => {subject.next(JSON.parse(payload.body));}
    );

    // Tell your username to the server
    if (isNewClient && username.length > 0) {
      this.stompClient.send(
        '/app/chat.addUser',
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
      );
    }
    return subject.asObservable();
  }

  public sendMessage(message: MessageDto):void {
    if(this.isConnected()){
      this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message))
      console.log('message send to server')
    }
  }

  public isConnected(): boolean {
    return this.stompClient && this.stompClient.connected;
  }

  public disconnect(): void {
    if (this.isConnected()) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }
}
