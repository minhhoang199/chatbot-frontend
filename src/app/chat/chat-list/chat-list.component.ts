import { AuthService } from './../../service/auth.service';
import { RoomService } from './../../service/room.service';
import { Component, OnInit } from '@angular/core';
import { Room } from '../../model/room.model';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit {
  rooms!: Room[];
  selectedRoomId!: number | null;
  constructor(private roomService: RoomService, private authService: AuthService, private router: Router){}
  ngOnInit(): void {
    const id = this.authService.getId();
    this.roomService.getAllRooms(id).subscribe((rooms) => this.rooms = rooms);
  }

  navigateToRoom(roomId: number): void {
    this.selectedRoomId = roomId;
    this.router.navigate(['/chat', roomId]);
  }
}
