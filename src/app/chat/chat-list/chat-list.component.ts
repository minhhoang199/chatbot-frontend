import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../model/room.model';
import { Router } from '@angular/router';
import { Message } from '../../model/message.model';
import { WebsocketService } from '../../service/websocket.service';
import { NotificationService } from '../../service/notification.service';

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

  @Input() unreadMessagesByRoom: Record<number, number> = {};
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router,
    private websocketService: WebsocketService,
    private notificationService: NotificationService
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
            this.sortRoomsByLastMessageTime(
              index,
              room.lastMessageContent,
              room.lastMessageTime,
            );
          });

        this.navigateToRoom(this.rooms[0]); // Mở phòng đầu tiên khi vào trang chat
      }
    });

    this.websocketService.messageReceived$.subscribe((message: Message) => {
      console.log('Received message:', message);
      this.onNewMessage(message);
    });

    // Listen for room updates (e.g., name changes)
    this.roomService.onRoomUpdated().subscribe((update) => {
      if (!update) return;
      const idx = this.rooms.findIndex((r) => r.id === update.roomId);
      if (idx !== -1) {
        this.rooms[idx] = { ...this.rooms[idx], name: update.name } as Room;
        this.setActiveTab(this.activeTab);
      }
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

  navigateToRoom(room: Room): void {
    this.selectedRoomId = room.id;
    this.notificationService.readRoomMessages(room.id).subscribe({
      next: (code) => {
        if (code === 'TD-000') {
          this.unreadMessagesByRoom[room.id] = 0;
        }
      },
      error: () => {}
    });
    this.router.navigate(['/chat', room.id], { state: { room } });
  }

  setActiveTab(emojiKey: string): void {
    this.activeTab = emojiKey;
    if (emojiKey === 'All') {
      this.filteredRooms = this.rooms;
    } else if (emojiKey === 'Private') {
      this.filteredRooms = this.rooms.filter(
        (room) => room.roomType === 'PRIVATE_CHAT',
      );
    } else if (emojiKey === 'Groups') {
      this.filteredRooms = this.rooms.filter(
        (room) => room.roomType === 'GROUP_CHAT',
      );
    } else {
      this.filteredRooms = [];
    }
  }

  onNewMessage(message: Message): void {
    const index = this.rooms.findIndex((r) => r.id === message.roomId);
    if (index === -1) {
      this.roomService.getRoomDetail(message.roomId).subscribe({
        next: (room) => {
          if (room) {
            room.lastMessageContent = message.content;
            room.lastMessageTime = message.createdAt;
            this.rooms.unshift(room);
          }
        },
      });
      return;
    }

    if (message.type === 'REMOVE' && message.removedEmails) {
      const emailsToRemove = message.removedEmails.split('-');
      if (emailsToRemove.includes(this.authService.getEmail())) {
        this.rooms.splice(index, 1);
      }
      return;
    }
    this.sortRoomsByLastMessageTime(index, message.content, message.createdAt);
  }

  sortRoomsByLastMessageTime(
    index: number,
    lastMessageContent: string,
    lastMessageTime: string,
  ): void {
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

  onRoomLeave(leaveId: number) {
    this.rooms = this.rooms.filter((r) => r.id !== leaveId);
    this.filteredRooms = this.filteredRooms.filter((r) => r.id !== leaveId);
  }
}
