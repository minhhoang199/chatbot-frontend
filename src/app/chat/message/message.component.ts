import { AuthService } from './../../service/auth.service';
import { Message } from '../../model/message.model';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { parse } from 'date-fns';

const dateFormat = 'yyyy-MM-dd';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit {
  @Input() message!: Message;
  isOutgoingMessage: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('Before: ' + this.message.createdAt);
    this.message.createdAt = this.convertCreateAt(this.message.createdAt);
    console.log('After: ' + this.message.createdAt);
    this.cdr.detectChanges();
    // console.log("msgId:" + this.message.senderId);
    // console.log("storageId:" + this.authService.getId());
    this.isOutgoingMessage = this.authService.getId() != this.message.senderId;
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
}
