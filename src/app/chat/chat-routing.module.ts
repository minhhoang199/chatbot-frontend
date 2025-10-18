import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth-guard.guard';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatModule } from './chat.module';
import { ChatComponent } from './chat.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ChatComponent,
    children:[
      {path: ':roomId', component: ChatWindowComponent},
    ]
  },
  { path: 'call/:roomId', component: VideoCallComponent },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/sign-in' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
