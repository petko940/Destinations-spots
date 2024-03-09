import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  tokenKey: string = 'token';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(credentials: { username: string, password: string }) {
    const apiUrl: string = environment.dbApiUrl;
    return this.http.post(apiUrl + 'login/', credentials).pipe(
      tap((response: any) => {
        document.cookie = `token=${response.token}; path=/`;
        this.isLoggedIn = true;
      })
    );
  }

  register(data: any) {
    const apiUrl: string = environment.dbApiUrl;
    return this.http.post(apiUrl + 'register/', data);
  }

  logout() {
    this.isLoggedIn = false;
    document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

    console.log("logged out");
    this.router.navigate(['/']);
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
