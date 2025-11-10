import { LocalStorageService } from './local-storage.service';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignInResponse } from '../model/sign-in-response';
import { environment } from '../../environments/environment';

const signInURL = environment.apiBaseUrl + '/security/auth/login';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {}

  signIn(email:string, password: string):Observable<SignInResponse>{
    return this.httpClient.post<SignInResponse>(signInURL, { email: email, password: password});
  }

  getToken(): string{
    return this.localStorageService.getString('token');
  }

  getRole(): string{
    return this.localStorageService.getString('role');
  }

  getUserName(): string{
    return this.localStorageService.getString('username');
  }

  getEmail(): string{
    return this.localStorageService.getString('email');
  }

  getId(): number{
    return this.localStorageService.getNumber('id');
  }

  setToken(userInfo: SignInResponse): void{
    this.localStorageService.set('token', userInfo.data.token);
    this.localStorageService.set('role', userInfo.data.role);
    this.localStorageService.set('username', userInfo.data.username);
    this.localStorageService.set('id', userInfo.data.id);
    this.localStorageService.set("email", userInfo.data.email)
  }
}
