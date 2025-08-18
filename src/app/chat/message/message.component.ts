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
} from '@angular/core';
import { parse } from 'date-fns';

const dateFormat = 'yyyy-MM-dd';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit {
  @Input() message!: Message;
  @Input() activeMenuId: number | null = null;
  @Input() activeEmojiMenuId: number | null = null;
  isOutgoingMessage: boolean = false;
  currentOpenMenu: string | null = null;
  activeEmojiPopupId: number | null = null;
  reactionMap: Map<string, Emoji[]> = new Map();
  activeTab = 'All';
  reactionList: Emoji[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // console.log('Message:', this.message);
    // console.log('Message emoji:', this.message.emoji);
    // console.log('Before: ' + this.message.createdAt);
    this.message.createdAt = this.convertCreateAt(this.message.createdAt);
    // console.log('After: ' + this.message.createdAt);
    this.cdr.detectChanges();
    // console.log("msgId:" + this.message.senderId);
    // console.log("storageId:" + this.authService.getId());
    this.isOutgoingMessage = this.authService.getId() != this.message.senderId;
    this.activeEmojiMenuId = null; // Reset emoji menu when initializing
    this.activeMenuId = null; // Reset main menu when initializing
    this.setEmojiString();
    this.setReactionMap();
    this.reactionList = this.reactionMap.get(this.activeTab) || [];
  }

  convertCreateAt(createdAt: string): string {
    // Create a Date object from the createdAt string
    const dateObject = new Date(createdAt);

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

  toggleMenu(id: number) {
    console.log('Selected id:', id);
    this.activeMenuId = this.activeMenuId === id ? null : id;
    this.activeEmojiMenuId = null; // close emoji menu when toggling main menu
  }

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

  deleteMessage() {
    this.activeMenuId = null;
    throw new Error('Method not implemented.');
  }

  editMessage() {
    this.activeMenuId = null;
    this.messageService.editMessage(this.message).subscribe(
      (response) => {
        // If login successful, navigate to page2
        if (
          response &&
          response.data &&
          response.code &&
          response.code === 'TD-000'
        ) {
          console.log(response.data);
          this.message.content = response.data.content;
          this.message.emoji = response.data.emoji;
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
    this.reply.emit(this.message);
  }

  changeEmoji(emojiStr: string | null): void {
    const id = this.authService.getId();
    const username = this.authService.getUserName();
    console.log('USER id:', id);
    if (!emojiStr && !this.message.emoji) {
      console.log('case:' + 1);
      //do nothing
      return;
    }

    if (!emojiStr && this.message.emoji) {
      console.log('case:' + 2);
      //remove current emoji of user before add new one
      this.message.emoji = this.message.emoji.filter((e) => e.userId != id);
      return;
    } else if (emojiStr) {
      if (!this.message.emoji) {
        console.log('case:' + 3);
        //create new list
        this.message.emoji = [];
      } else {
        console.log('case:' + 4);
        //remove current emoji of user before add new one
        this.message.emoji = this.message.emoji.filter((e) => e.userId != id);
        console.log('after remove' + this.message.emoji);
      }
      //add new one
      const emoji = new Emoji(id, username, emojiStr);
      this.message.emoji.push(emoji);
    }
  }

  setEmojiString(): void {
    if (this.message.emoji && this.message.emoji.length > 0) {
      const uniqueEmojis = Array.from(
        new Set(this.message.emoji.map((e) => e.emoji))
      );
      this.message.emojiString = uniqueEmojis.join('');
      this.message.emojiString =
        this.message.emojiString + this.message.emoji.length;
    }
  }

  // popup show emoji
  setReactionMap() {
    this.reactionMap.clear();
    this.reactionMap.set('All', this.message.emoji || []);
    if (this.message.emoji && this.message.emoji.length > 0) {
      for (const r of this.message.emoji) {
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
    this.activeTab = "All";
    this.reactionList = this.reactionMap.get(this.activeTab) || [];
  }

   setActiveTab(emoji: string) {
    this.activeTab = emoji;
    this.reactionList = this.reactionMap.get(this.activeTab) || [];
  }
}
