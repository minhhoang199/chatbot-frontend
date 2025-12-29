import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, OnInit } from '@angular/core';
import { Room } from '../../model/room.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Message } from '../../model/message.model';
import { WebsocketService } from '../../service/websocket.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent implements OnInit {
  rooms!: Room[];
  filteredRooms!: Room[];
  roomSubscriptions: any[] = [];
  selectedRoomId!: number | null;
  activeTab: string = 'All';
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router,
    private websocketService: WebsocketService
  ) {}
  ngOnInit(): void {
    const id = this.authService.getId();
    this.roomService.getAllRooms(id).subscribe((rooms) => {
      this.rooms = rooms;
      this.filteredRooms = rooms;
      if (this.rooms.length > 0) {
        //connect websocket for each room
        this.websocketService.connectWebSocket().subscribe(() => {
          this.websocketService.subscribeAllRooms(this.rooms);
        });

        //connect websocket for user to listen new room created
        this.websocketService
          .connectAndSubscribeUserIdTopic(id)
          .subscribe((room: Room) => {
            console.log('New room:', room);
            room.lastMessageContent = room.name + ' was created';
            this.rooms.push(room);
            const index = this.rooms.findIndex((r) => r.id === room.id);
            this.sortRoomsByLastMessageTime(index, room.lastMessageContent, room.lastMessageTime);
          });
      }
    });

    this.websocketService.messageReceived$.subscribe((message: Message) => {
      console.log('Received message:', message);
      this.onNewMessage(message);
    });

    // this.roomService.onRoomCreated().subscribe((newRoom) => {
    //   if (newRoom) {
    //     this.rooms = [newRoom, ...this.rooms];
    //     this.filteredRooms = [newRoom, ...this.filteredRooms];
    //     this.filteredRooms.sort(
    //       (a, b) =>
    //         new Date(b.lastMessageTime).getTime() -
    //         new Date(a.lastMessageTime).getTime()
    //     );
    //     const subscription =
    //       this.websocketService.connectAndSubscribeRoomIdTopic(
    //         newRoom.id,
    //         false,
    //         ''
    //       );
    //     this.roomSubscriptions.push(subscription);
    //   }
    // });
  }

  navigateToRoom(roomId: number): void {
    this.selectedRoomId = roomId;
    this.router.navigate(['/chat', roomId]);
  }

  setActiveTab(emojiKey: string): void {
    this.activeTab = emojiKey;
    if (emojiKey === 'All') {
      this.filteredRooms = this.rooms;
    } else if (emojiKey === 'Groups') {
      this.filteredRooms = this.rooms.filter(
        (room) => room.roomType === 'GROUP_CHAT'
      );
    } else {
      this.filteredRooms = [];
    }
  }

  onNewMessage(message: Message): void {
    const index = this.rooms.findIndex((r) => r.id === message.roomId);
    console.log('Room index for new message:', index);
    if (index === -1) return;

    this.sortRoomsByLastMessageTime(
      index,
      message.content,
      message.createdAt
    );
  }

  sortRoomsByLastMessageTime(index: number, lastMessageContent: string, lastMessageTime: string): void {
    const updatedRoom = {
      ...this.rooms[index],
      lastMessageContent: lastMessageContent,
      lastMessageTime: lastMessageTime,
    };

    // Xóa room cũ và thêm lại lên đầu
    this.rooms.splice(index, 1); // xoá vị trí cũ
    this.rooms.unshift(updatedRoom); // thêm vào đầu danh sách
    this.setActiveTab(this.activeTab); // Cập nhật filteredRooms dựa trên tab hiện tại
  }
}
