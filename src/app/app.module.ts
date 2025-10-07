import { NgModule, Component } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './component/sign-in/sign-in.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { PrivateRoomDialogComponent } from './chat/private-room-dialog/private-room-dialog.component';
import { GroupRoomDialogComponent } from './chat/group-room-dialog/group-room-dialog.component';
import { MatIcon } from "@angular/material/icon";
import { MatDialogActions, MatDialogContent } from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatIcon,
    MatDialogActions,
    MatDialogContent
],
  providers: [
    provideClientHydration(), provideHttpClient(withFetch()), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
