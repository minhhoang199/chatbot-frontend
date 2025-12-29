import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { WebsocketService } from '../../service/websocket.service';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Message } from '../../model/message.model';
import { AttachedFileService } from '../../service/attached-file.service';
import { AttachedFile } from '../../model/attached-file.model';
import { Room } from '../../model/room.model';
import { RoomService } from '../../service/room.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  room!: Room | null;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
  messages!: Message[];
  chatForm!: FormGroup;
  roomId!: number;
  private routeSub!: Subscription;
  private previousMessageCount = 0;
  isVideoCallActive = false;
  currentUserName: string = '';
  attachedFiles: AttachedFile[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private messageService: MessageService,
    private attachedFileService: AttachedFileService,
    private roomService: RoomService,
    private authService: AuthService
  ) {}

  ngAfterViewChecked(): void {
    if (this.messages && this.previousMessageCount != this.messages.length) {
      this.previousMessageCount = this.messages.length;
      this.scrollToBottom();
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
      if (this.roomId != null) {
        this.roomService.getRoomDetail(this.roomId).subscribe((room) => {
          if (room) {
            this.room = room;
          }
          console.log('Fetched room details:', this.room);
        });
      }
      if (this.roomId != null) {
        this.websocketService.disconnect();
        this.websocketService
          .connectAndSubscribeRoomIdTopic(this.roomId, false, '')
          .subscribe((message: Message) => {
            console.log('Received message:', message);
            const index = this.messages.findIndex(
              (msg) => msg.id === message.id
            );
            if (index !== -1) {
              // Delete message
              if (message.delFlag) {
                this.messages.splice(index, 1);
              } else {
                // Update the existing message
                this.messages[index] = { ...this.messages[index], ...message };
                this.messages = this.messages.map((m) =>
                  m.id === message.id ? message : m
                );
              }
            } else {
              this.messages.push(message);
              this.websocketService.handleIncomingMessage(message);
            }
          });
        this.messageService
          .getLimitMessagesInRoom(this.roomId, new Date(), 30)
          .subscribe((messages) => (this.messages = messages));
      }
      this.chatForm = this.fb.group({
        contentMessage: [''],
      });
    });
    console.log('Initial messages:', this.messages);
    if (this.messages) {
      this.previousMessageCount = this.messages.length;
    }
    this.scrollToBottom();
    this.currentUserName = this.authService.getUserName();
  }

  sendMessage() {
    console.log('message:' + this.chatForm.get('contentMessage')?.value);
    console.log(
      'repId:' + (this.replyingMessage ? this.replyingMessage.id : null)
    );
    let valueContent = this.chatForm.get('contentMessage')?.value;
    if (valueContent && valueContent.trim() !== '') {
      this.messageService.sendMessage(
        valueContent,
        this.roomId,
        this.replyingMessage ? this.replyingMessage.id : null
      );
    }
    if (this.attachedFiles.length > 0) {
      this.attachedFiles.forEach((attachedFile) => {
        this.attachedFileService
          .uploadFile(this.roomId, attachedFile.file)
          .subscribe({
            next: (response) => {
              console.log('File uploaded successfully:', response);
              // Handle the response if needed
            },
            error: (error) => {
              console.error('Error uploading file:', error);
            },
          });
      });
    }
    this.chatForm.reset();
    this.cancelReply();
    this.attachedFiles = [];
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
    this.routeSub.unsubscribe();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (error) {
      console.error('Scrolling to bottom failed', error);
    }
  }

  // reply
  replyingMessage: Message | null = null;

  onReplyMessage(message: Message) {
    this.replyingMessage = message;
    setTimeout(() => {
      const input = document.querySelector(
        'input[formControlName="contentMessage"]'
      ) as HTMLInputElement;
      if (input) input.focus();
    }, 0);
  }

  scrollToReplyMessage(message: Message) {
    console.log('Scroll to reply message:', message);
    if (message.replyId && message.replyCreatedDate) {
      this.jumpToMessage(message.replyId, message.replyCreatedDate);
    }
  }

  cancelReply() {
    this.replyingMessage = null;
  }

  // file upload
  onFileSelected(event: Event) {
    console.log('File selection event:', event);
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const previewUrl = URL.createObjectURL(file); // tạo URL tạm
        this.attachedFiles.push({
          id: null,
          messageId: null,
          linkFile: previewUrl,
          fileName: file.name,
          linkPreview: previewUrl,
          extension: file.name.split('.').pop() || '',
          roomId: this.roomId,
          file: file,
        } as AttachedFile);
      });
    }
    setTimeout(() => {
      this.chatInput.nativeElement.focus();
    }, 0);
  }

  removeFile(index: number) {
    this.attachedFiles.splice(index, 1);
  }

  openPreview(url: string): void {
    window.open(url, '_blank');
  }

  trackByMessageId(index: number, message: any): string {
    return message.id;
  }

  // load more messages
  loadOlderMessages() {
    const container = this.messageContainer.nativeElement;
    const oldHeight = container.scrollHeight;

    const oldest: Message = this.messages[0]; // lấy message cũ nhất
    if (!oldest) {
      return; // không có message nào
    }
    const before = new Date(oldest.createdAt);
    this.messageService
      .getLimitMessagesInRoom(this.roomId, before, 20)
      .subscribe((res) => {
        this.messages = [...res, ...this.messages];

        // giữ vị trí scroll
        setTimeout(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - oldHeight;
        });
      });
  }

  onScroll(event: any) {
    console.log('Scroll event:', event);
    const element = event.target;
    if (element.scrollTop === 0) {
      this.loadOlderMessages();
    }
  }
  // scroll to message
  jumpToMessage(messageId: number, messageCreatedAt: string) {
    const index = this.messages.findIndex((msg) => msg.id === messageId);
    if (index !== -1) {
      // Message is already loaded
      setTimeout(() => this.scrollToMessage(messageId), 0);
      return;
    }
    // Message is not loaded yet, fetch it
    const oldest: Message = this.messages[0]; // lấy message cũ nhất
    if (!oldest) {
      return; // không có message nào
    }
    const from = new Date(oldest.createdAt);
    this.messageService
      .getAllMessagesInRoomFromTo(this.roomId, from, new Date(messageCreatedAt))
      .subscribe((res) => {
        this.messages = [...res, ...this.messages];
        this.messages = res; // BE trả về list có chứa message cần tìm
        setTimeout(() => this.scrollToMessage(messageId), 0);
      });
  }

  scrollToMessage(messageId: number) {
    const el = document.getElementById('msg-' + messageId);
    console.log('Scrolling to element:', el);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight');
      setTimeout(() => el.classList.remove('highlight'), 5000);
    }
  }

  //search
  showPopup = false;

  openSearchPopup() {
    this.showPopup = true;
  }

  closeSearchPopup() {
    this.showPopup = false;
  }

  scrollToMessageFromSearchPopup(message: Message) {
    this.closeSearchPopup();
    this.jumpToMessage(message.id, message.createdAt);
  }

  // video call
  startVideoCall(): void {
    // const callUrl = `${window.location.origin}/chat/call/${this.roomId}`;
    const callUrl = `https://192.168.1.180:8443/${this.roomId}`;
    this.openCenteredWindow(callUrl, 'Video Call', 1400, 800);
  }

  // end call
  endVideoCall(): void {
    this.isVideoCallActive = false;
  }

  openCenteredWindow(url: string, title: string, w: number, h: number) {
  // Lấy kích thước màn hình
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;

  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

  // Tính vị trí giữa màn hình
  const left = width / 2 - w / 2 + dualScreenLeft;
  const top = height / 2 - h / 2 + dualScreenTop;

  // Mở cửa sổ
  const newWindow = window.open(
    url,
    title,
    `
      scrollbars=yes,
      width=${w},
      height=${h},
      top=${top},
      left=${left}
    `
  );

  // Focus cửa sổ mới
  if (newWindow && newWindow.focus) {
    newWindow.focus();
  }
}
}
