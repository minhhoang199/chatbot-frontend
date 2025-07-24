import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../model/room.model';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent implements OnInit{
  @Input() room!: Room;
  lastMessageTime!: string;
  ngOnInit(): void {
    this.lastMessageTime = this.room.lastMessageTime == null ? '' : this.convertLastMessageTime(this.room.lastMessageTime);
  }

  //TODO: set lại lastMessageTime mỗi khi thêm mới message
  convertLastMessageTime(lastMessageTime: string): string {
    // Create a Date object from the createdAt string
    const dateObject = new Date(lastMessageTime);
    const currentDate = new Date();

    // Extract date in 'YYYY-MM-DD' format
    const dateString = dateObject.toISOString().substring(0, 10);

    //TÍnh số giây giữa thời điểm hiện tại và lastMessageTime
    const diffInMilliseconds:number = Math.abs(currentDate.getTime() - dateObject.getTime());
    // Convert milliseconds to seconds
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    let convertedDate = '';
    //Nếu thời gian nhỏ hơn 1 phút -> hiển thị 'a minute ago'
    if(diffInSeconds <= 120) {
      convertedDate = 'a minute ago';
    }
    //Nếu thời gian lớn hơn 1 phút -> hiển thị '$minutes minutes ago'
    else if(diffInSeconds > 120 && diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      convertedDate = minutes + ' minutes ago';
    }
    //Nếu thời gian lớn hơn 1 giờ -> hiển thị '$hours hours ago'
    else if(diffInSeconds >= 3600 && diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      convertedDate = hours + hours >= 2 ? ' hours ago' : ' hour ago';
    }
    //Nếu thời gian lớn hơn 1 ngày -> hiển thị ngày đó
    else {convertedDate = dateString;}
    return convertedDate;
  }
}
