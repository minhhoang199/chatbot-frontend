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
import { Message } from '../../model/message.model';
import { AttachedFileService } from '../../service/attached-file.service';
import { AttachedFile } from '../../model/attached-file.model';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  messages!: any[];
  chatForm!: FormGroup;
  roomId!: number;
  private routeSub!: Subscription;
  private previousMessageCount = 0;
  attachedFiles: AttachedFile[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private messageService: MessageService,
    private attachedFileService: AttachedFileService
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
        this.websocketService.disconnect();
        this.websocketService
          .connect(this.roomId, false, '')
          .subscribe((message: any) => {
            console.log('Received message:', message);
            const index = this.messages.findIndex(
              (msg) => msg.id === message.id
            );
            if (index !== -1) {
              this.messages[index] = { ...this.messages[index], ...message };
            } else {
              this.messages.push(message);
            }
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
    this.scrollToBottom();
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

  cancelReply() {
    this.replyingMessage = null;
  }

  // file upload
  onFileSelected(event: Event) {
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
    console.log('Selected files:', this.attachedFiles);
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
}
