import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string = environment.dbApiUrl;

  constructor(
    private http: HttpClient
  ) { }

  editUsername(userId: number, newUsername: string, refreshToken: any) {
    return this.http.put<any>(`${this.apiUrl}user/${userId}/change-username/`, { username: newUsername, refresh_token: refreshToken })
  }
}
