import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { ChatRoutingModule } from "./chat-routing.module";
import { ChatRoomComponent } from "./chat-room/chat-room.component";
import { ChatListComponent } from "./chat-list/chat-list.component";
import { ChatWindowComponent } from "./chat-window/chat-window.component";
import { MessageComponent } from "./message/message.component";
import { ChatComponent } from './chat.component';
import { FileTypePipe } from "../pipe/file-type.pipe";

@NgModule({
    declarations: [
      ChatRoomComponent, 
      ChatListComponent, 
      ChatWindowComponent, 
      MessageComponent, 
      ChatComponent,
      FileTypePipe
    ],
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule,
        ChatRoutingModule,
      ],
})
export class ChatModule{}