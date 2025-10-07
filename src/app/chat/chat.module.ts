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
import { SearchPopupComponent } from "./search-popup/search-popup.component";
import { MatRadioButton } from "@angular/material/radio";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { MatIconButton } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { PrivateRoomDialogComponent } from "./private-room-dialog/private-room-dialog.component";
import { GroupRoomDialogComponent } from "./group-room-dialog/group-room-dialog.component";
import { MatDialogActions, MatDialogContent } from "@angular/material/dialog";

@NgModule({
    declarations: [
      ChatRoomComponent, 
      ChatListComponent, 
      ChatWindowComponent, 
      MessageComponent, 
      ChatComponent,
      FileTypePipe,
      SearchPopupComponent,
      PrivateRoomDialogComponent,
      GroupRoomDialogComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatRoutingModule,
    MatRadioButton,
    MatFormField,
    MatLabel,
    MatOption,
    MatError,
    MatIconButton,
    MatIconModule,
    MatInputModule,
    MatDialogActions,
    MatDialogContent
],
})
export class ChatModule{}