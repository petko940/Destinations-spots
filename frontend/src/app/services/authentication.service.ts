import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  setCurrentUser(user: any): void {
    // localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  register(data: any) {
    // const apiUrl: string = environment.dbApiUrl;
    // return this.http.post(apiUrl + 'register/', data);
  }
}
