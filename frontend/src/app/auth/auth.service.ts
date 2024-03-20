import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.dbApiUrl;

  accessTokenKey: string = 'access_token';
  refreshTokenKey: string = 'refresh_token';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { };

  login(credentials: { username: string, password: string }) {
    return this.http.post(this.apiUrl + 'login/', credentials).pipe(
      tap((response: any) => {
        this.saveTokens(response);
      })
    );
  }

  register(data: any) {
    return this.http.post(this.apiUrl + 'register/', data);
  }

  logout() {
    document.cookie = `${this.accessTokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${this.refreshTokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    this.router.navigate(['/']);
  }

  saveTokens(token: any) {
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7);
    document.cookie = `${this.accessTokenKey}=${token.access}; expires=${expiresDate.toUTCString()}; path=/`;
    document.cookie = `${this.refreshTokenKey}=${token.refresh}; expires=${expiresDate.toUTCString()}; path=/`;
  }

  getCurrentUserId() {
    const token = this.getCookie(this.accessTokenKey);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.user_id;
    }
    return null;
  }

  getCurrentUsername(): string | null {
    const token = this.getCookie(this.accessTokenKey);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.username;
    }
    return null;
  }

  isLoggedIn() {
    return !!this.getCookie(this.accessTokenKey);
  }

  getUsername(userId: number) {
    return this.http.get<any>(`${this.apiUrl}user/${userId}`);
  }

  getCookie(name: string) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  updateUsername(userId: string, newUsername: string) {
    return this.http.put(`${this.apiUrl}user/${userId}/change-username/`, { username: newUsername });
  }
}
