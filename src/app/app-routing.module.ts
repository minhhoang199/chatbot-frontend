import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './component/sign-in/sign-in.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { OtpVerificationComponent } from './component/otp-verification/otp-verification.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { HomeComponent } from './component/home/home.component';
import { ProfileSettingComponent } from './component/profile-setting/profile-setting.component';
import { FriendListComponent } from './component/friend-list/friend-list.component';

const routes: Routes = [
  {
    path: "sign-in",
    component: SignInComponent
  },
  {
    path: "verify-otp/:email",
    component: OtpVerificationComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "settings",
    component: ProfileSettingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "friends",
    component: FriendListComponent,
    canActivate: [AuthGuard]
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
