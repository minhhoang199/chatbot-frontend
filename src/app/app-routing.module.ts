import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './component/sign-in/sign-in.component';
import { AuthGuard } from './guard/auth-guard.guard';

const routes: Routes = [
  {
    path: "sign-in",
    component: SignInComponent
  },
  {
    path: "chat",
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/sign-in' } // Redirect to login for unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
