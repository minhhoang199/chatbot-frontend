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
  constructor(private roomService: RoomService, private authService: AuthService, private router: Router){}
  ngOnInit(): void {
    const id = this.authService.getId();
    this.roomService.getAllRooms(id).subscribe((rooms) => this.rooms = rooms);
    console.log("rooms: " + this.rooms);
  }

  navigateToRoom(roomId: number): void {
    this.router.navigate(['/chat', roomId]);
  }
}
