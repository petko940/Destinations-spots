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

  saveTokens(token: any) {
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7);
    document.cookie = `${this.accessTokenKey}=${token.access}; expires=${expiresDate.toUTCString()}; path=/`;
    document.cookie = `${this.refreshTokenKey}=${token.refresh}; expires=${expiresDate.toUTCString()}; path=/`;
  }

  updateTokens(newUsername: string) {
    const refreshToken = this.getCookie(this.refreshTokenKey);
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7);

    this.http.post(this.apiUrl + 'token-refresh/', { refresh: refreshToken })
      .subscribe((response: any) => {
        if (refreshToken) {
          const newRefreshToken = response.refresh;
          const decodedToken: any = jwtDecode(newRefreshToken);

          decodedToken.username = newUsername;

          const updatedPayload = this.encodePayload(decodedToken);
          const [header, signature] = refreshToken.split('.');
          const newToken = `${header}.${updatedPayload}.${signature}`;

          document.cookie = `${this.accessTokenKey}=${newToken}; expires=${expiresDate.toUTCString()}; path=/`;
          document.cookie = `${this.refreshTokenKey}=${newRefreshToken}; expires=${expiresDate.toUTCString()}; path=/`;
        }
      }, (error) => {
        console.log(error);
      })
  }

  private encodePayload(payload: any): string {
    const encodedPayload = btoa(JSON.stringify(payload)); // Encoding payload using base64
    return this.base64urlEncode(encodedPayload);
  }

  private base64urlEncode(input: string): string {
    return input.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  logout() {
    document.cookie = `${this.accessTokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${this.refreshTokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    this.router.navigate(['/']);
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

  fetchUser(userId: number) {
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
