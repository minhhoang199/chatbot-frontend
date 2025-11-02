import { MessageService } from './../../service/message.service';
import { AuthService } from './../../service/auth.service';
import { Emoji, Message } from '../../model/message.model';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { parse } from 'date-fns';
import { AttachedFile } from '../../model/attached-file.model';
import { AttachedFileService } from '../../service/attached-file.service';
import { FormBuilder, FormGroup } from '@angular/forms';

const dateFormat = 'yyyy-MM-dd';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit, OnDestroy {
    _message!: Message;

  @Input() set message(value: Message) {
    this._message = value;
    this.processMessage();
  }

  @Input() activeMenuId: number | null = null;
  @Input() activeEmojiMenuId: number | null = null;
  isOutgoingMessage: boolean = false;
  currentOpenMenu: string | null = null;
  activeEmojiPopupId: number | null = null;
  reactionMap: Map<string, Emoji[]> = new Map();
  activeTab = 'All';
  reactionList: Emoji[] = [];
  refreshTimer: any;
  activeEditPopupId: number | null = null;
  editedMessage: string | null = null;
  activeDeletePopupId: number | null = null;
  createdAtFormatted: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private messageService: MessageService,
    private attachedFileService: AttachedFileService,
  ) {}

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  processMessage() {
    console.log('Processing message:', this._message);
      this.createdAtFormatted = this.convertCreateAt();
      this.isOutgoingMessage = this.authService.getId() != this._message.senderId;
      this.activeEmojiMenuId = null; // Reset emoji menu when initializing
      this.activeMenuId = null; // Reset main menu when initializing
      this.setTypeMessage();
      this.setLinkPreview();
      this.setEmojiString();
      this.setReactionMap();
      this.reactionList = this.reactionMap.get(this.activeTab) || [];
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }

  convertCreateAt(): string {
    // console.log('Before: ' + this._message.createdAt);
    // Create a Date object from the createdAt string
    const dateObject = new Date(this._message.createdAt);

    // Extract time in 'HH:mm' format
    const time = dateObject.toTimeString().substring(0, 5);

    // Extract date in 'YYYY-MM-DD' format
    const dateString = dateObject.toISOString().substring(0, 10);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setHours(currentDate.getHours());
    const date = dateObject < currentDate ? dateString : 'Today';
    const convertedDate = `${time}    |    ${date}`;
    return convertedDate;
  }

  convertCreateAt2(createdAt: string): string {
    // Create a Date object from the createdAt string
    const dateObject = new Date(createdAt);

    // Extract time in 'HH:mm' format
    const time = dateObject.toTimeString().substring(0, 5);

    // Extract date in 'YYYY-MM-DD' format
    const dateString = dateObject.toISOString().substring(0, 10);

    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    // currentDate.setHours(currentDate.getHours() + 7);

    // Compare the created date with the current date
    const date = dateObject < currentDate ? dateString : 'Today';

    // Construct the final date-time string
    const convertedDate = `${time}    |    ${date}`;
    return convertedDate;
  }

  showMenu(id: number) {
    this.activeMenuId = id;
    this.activeEmojiMenuId = null;
  }

  hideMenu() {
    this.activeMenuId = null;
  }
  // toggleMenu(id: number) {
  //   this.activeMenuId = this.activeMenuId === id ? null : id;
  //   this.activeEmojiMenuId = null; // close emoji menu when toggling main menu
  // }

  openEmojiMenu(id: number) {
    this.activeMenuId = null;
    this.activeEmojiMenuId = this.activeEmojiMenuId === id ? null : id;
  }

  selectEmoji(emoji: string | null) {
    // handle emoji selection
    this.activeEmojiMenuId = null;
    this.changeEmoji(emoji);
    this.setEmojiString();
    this.editMessage();
    this.setReactionMap();
  }

  // Lắng nghe click ở bất kỳ đâu trên window
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.message-menu') && !target.closest('.message')) {
      this.activeMenuId = null;
      this.activeEmojiMenuId = null;
    }
  }

  @Output() reply = new EventEmitter<Message>();
  @Output() replyClick = new EventEmitter<Message>();

  editMessage() {
    this.activeMenuId = null;
    this.messageService.editMessage(this._message).subscribe(
      (response) => {
        // If login successful, navigate to page2
        if (
          response &&
          response.data &&
          response.code &&
          response.code === 'TD-000'
        ) {
          console.log(response.data);
          this._message.content = response.data.content;
          this._message.emoji = response.data.emoji;
          this.setTypeMessage();
          this.setLinkPreview();
        } else {
          // this.errorMessage = ""
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }

  replyMessage() {
    this.activeMenuId = null;
    this.reply.emit(this._message);
  }

  scrollToReplyMessage() {
    this.replyClick.emit(this._message);
  }

  changeEmoji(emojiStr: string | null): void {
    const id = this.authService.getId();
    const username = this.authService.getUserName();
    console.log('USER id:', id);
    if (!emojiStr && !this._message.emoji) {
      console.log('case:' + 1);
      //do nothing
      return;
    }

    if (!emojiStr && this._message.emoji) {
      console.log('case:' + 2);
      //remove current emoji of user before add new one
      this._message.emoji = this._message.emoji.filter((e) => e.userId != id);
      return;
    } else if (emojiStr) {
      if (!this._message.emoji) {
        console.log('case:' + 3);
        //create new list
        this._message.emoji = [];
      } else {
        console.log('case:' + 4);
        //remove current emoji of user before add new one
        this._message.emoji = this._message.emoji.filter((e) => e.userId != id);
      }
      //add new one
      const emoji = new Emoji(id, username, emojiStr);
      this._message.emoji.push(emoji);
    }
  }

  setEmojiString(): void {
    if (this._message.emoji && this._message.emoji.length > 0) {
      const uniqueEmojis = Array.from(
        new Set(this._message.emoji.map((e) => e.emoji))
      );
      this._message.emojiString = uniqueEmojis.join('');
      this._message.emojiString =
        this._message.emojiString + this._message.emoji.length;
    }
  }

  // popup show emoji
  setReactionMap() {
    this.reactionMap.clear();
    this.reactionMap.set('All', this._message.emoji || []);
    if (this._message.emoji && this._message.emoji.length > 0) {
      for (const r of this._message.emoji) {
        if (!this.reactionMap.has(r.emoji)) {
          this.reactionMap.set(r.emoji, []);
        }
        this.reactionMap.get(r.emoji)!.push(r);
      }
    }
  }

  toggleEmojiPopup(id: number, event: MouseEvent) {
    console.log('Open popup');
    event.stopPropagation();
    this.activeEmojiPopupId = this.activeEmojiPopupId === id ? null : id;
  }

  closePopup() {
    this.activeEmojiPopupId = null;
    this.activeMenuId = null;
    this.activeEditPopupId = null;
    this.activeTab = 'All';
    this.editedMessage = null;
    this.activeDeletePopupId = null;
    this.reactionList = this.reactionMap.get(this.activeTab) || [];
  }

  setActiveTab(emoji: string) {
    this.activeTab = emoji;
    this.reactionList = this.reactionMap.get(this.activeTab) || [];
  }

  // attached file
  openPreview(): void {
    if (!this._message.attachedFile || !this._message.attachedFile.id) return;
    // Cách đơn giản mở modal / tab mới để xem ảnh
    window.open(this._message.attachedFile.linkPreview, '_blank');
  }

  downloadFile() {
    if (!this._message.attachedFile || !this._message.attachedFile.id) return;
    this.attachedFileService.downloadFile(
      this._message.roomId,
      this._message.attachedFile.id,
      this._message.attachedFile.fileName
    );
  }

  setTypeMessage() {
    if (!this._message.attachedFile) return;

    const name = this._message.attachedFile.fileName.toLowerCase();
    const type = this._message.attachedFile.extension.toLowerCase();
    if (type.startsWith('image/')) {
      this._message.attachedFile.type = 'image';
    } else if (type.startsWith('video/')) {
      this._message.attachedFile.type = 'video';
    } else if (type.startsWith('application/pdf')) {
      this._message.attachedFile.type = 'pdf';
    } else if (
      type.startsWith('application/msword') ||
      name.endsWith('.doc') ||
      name.endsWith('.docx')
    ) {
      this._message.attachedFile.type = 'word';
    } else if (
      type.startsWith('application/vnd.ms-excel') ||
      type.startsWith(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) ||
      name.endsWith('.xls') ||
      name.endsWith('.xlsx')
    ) {
      this._message.attachedFile.type = 'excel';
    } else if (
      type.startsWith('application/vnd.ms-powerpoint') ||
      name.endsWith('.pptx')
    ) {
      this._message.attachedFile.type = 'powerpoint';
    } else {
      this._message.attachedFile.type = 'other';
    }
  }

  setLinkPreview(): void {
    if (this._message.attachedFile === null) return;
    this.attachedFileService
      .genPreviewLinkUpload(this._message.roomId, this._message.attachedFile.id)
      .subscribe(
        (response) => {
          if (
            response &&
            response.data &&
            response.code &&
            response.code === 'TD-000'
          ) {
            console.log(response.data);
            if (this._message.attachedFile)
              this._message.attachedFile.linkPreview = response.data;

            // Refresh cố định mỗi 5 phút
            this.refreshTimer = setTimeout(
              () => this.setLinkPreview(),
              5 * 60 * 60 * 1000
            );
          } else {
            // this.errorMessage = ""
          }
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );
  }

  //Edit message content
  toggleEditPopup(id: number, event: MouseEvent) {
    console.log('Open popup');
    event.stopPropagation();
    this.activeEditPopupId = this.activeEditPopupId === id ? null : id;
    this.editedMessage = this._message.content;
  }

  editMessageConfirm() {
    if (!this._message.id) return;
    if (!this.editedMessage || this.editedMessage.trim() === '') return;
    this._message.content = this.editedMessage;
    this.editMessage();
    this.activeEditPopupId = null;
    this.editedMessage = null;
  }

  //Delete message
  toggleDeletePopup(id: number, event: MouseEvent) {
    console.log('Open popup');
    event.stopPropagation();
    this.activeDeletePopupId = this.activeDeletePopupId === id ? null : id;
  }

  deleteMessage() {
    this.activeDeletePopupId = null;
    this.messageService.deleteMessage(this._message.id).subscribe(
      (response) => {
          if (
            response &&
            response.data &&
            response.code &&
            response.code === 'TD-000'
          ) {
            console.log("Deleted message :" + this._message.id);
          } else {
            // this.errorMessage = ""
          }
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );
  }
}
