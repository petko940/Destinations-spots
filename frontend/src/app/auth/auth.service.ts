import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenKey: string = 'token';
  userKey: string = 'userid';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(credentials: { username: string, password: string }) {
    const apiUrl: string = environment.dbApiUrl;
    return this.http.post(apiUrl + 'login/', credentials).pipe(
      tap((response: any) => {
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + 7);

        const encodedUsedId = encodeURIComponent(response.user_id);
        document.cookie = `token=${response.token}; expires=${expiresDate.toUTCString()}; path=/`;
        document.cookie = `userid=${encodedUsedId}; expires=${expiresDate.toUTCString()}; path=/`;
        document.cookie = `username=${encodeURIComponent(response.username)}; expires=${expiresDate.toUTCString()}; path=/`; // Saving the username in a cookie
      })
    );
  }

  register(data: any) {
    const apiUrl: string = environment.dbApiUrl;
    return this.http.post(apiUrl + 'register/', data);
  }

  logout() {
    document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${this.userKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    this.router.navigate(['/']);
  }

  getCurrentUserId() {
    return this.getCookie('userid');
  }

  getCurrentUsername() {
    return this.getCookie('username');
  }

  isLoggedIn() {
    return !!this.getCookie(this.tokenKey);
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
}
