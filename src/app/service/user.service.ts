import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../model/user.model';
import { GetUsersResponse } from '../model/get-users-response';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const userAPIUrl = environment.apiBaseUrl + '/v1/users/'; 
@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public getFriends(): Observable<User[]>{
      return this.httpClient.get<GetUsersResponse>(userAPIUrl + "friends").pipe(map(response => response.data));
  }

  public getRecentUserChat(): Observable<User[]>{
      return this.httpClient.get<GetUsersResponse>(userAPIUrl + "recent-chat-user").pipe(map(response => response.data));
  }

  public searchUsers(email: string): Observable<User[]> {
    return this.httpClient.get<GetUsersResponse>(userAPIUrl + 'search-by-email?email=' + email).pipe(map(response => response.data));
  }
}
