import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { WebsocketService } from '../../service/websocket.service';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewChecked{
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  messages!: any[];
  chatForm!: FormGroup;
  roomId!: number;
  private routeSub!: Subscription;
  private previousMessageCount = 0;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private messageService: MessageService
  ) {}

  ngAfterViewChecked(): void {
    if(this.messages && this.previousMessageCount != this.messages.length) {
      this.previousMessageCount = this.messages.length;
      this.scrollToBottom();
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
      if (this.roomId != null) {
        this.websocketService.disconnect();
        this.websocketService
          .connect(this.roomId, false, '')
          .subscribe((message: any) => {
            this.messages.push(message);
          });
        this.messageService
          .getAllMessagesInRoom(this.roomId)
          .subscribe((messages) => (this.messages = messages));
      }
      this.chatForm = this.fb.group({
        contentMessage: [''],
      });
    });
    if (this.messages) {
      this.previousMessageCount = this.messages.length;
    }
    // this.scrollToBottom();
  }

  sendMessage() {
    console.log('message:' + this.chatForm.get('contentMessage')?.value);
    this.messageService.sendMessage(
      this.chatForm.get('contentMessage')?.value,
      this.roomId
    );
    this.chatForm.reset();
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
    this.routeSub.unsubscribe();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (error) {
      console.error('Scrolling to bottom failed', error);
    }
  }
}
