import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, tap, throwError } from 'rxjs';
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

    getUserIdByUsername(username: string) {
        return this.http.get<any>(`${this.apiUrl}user/${username}`);
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

    getAccessToken(): string | null {
        return this.getCookie(this.accessTokenKey);
    }

    refreshToken() {
        const refreshToken = this.getCookie(this.refreshTokenKey);
        return this.http.post<any>(`${this.apiUrl}token-refresh/`, { refresh: refreshToken }).pipe();
    }

    isRefreshTokenExpired(): boolean {
        const refreshToken = this.getCookie(this.refreshTokenKey);
        if (refreshToken) {
            const decodedToken: any = jwtDecode(refreshToken);
            const expirationDate = new Date(0);
            expirationDate.setUTCSeconds(decodedToken.exp);
            return expirationDate < new Date();
        }
        return true;
    }
    
    saveAccessToken(token: string) {
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + 7);
        document.cookie = `${this.accessTokenKey}=${token}; expires=${expiresDate.toUTCString()}; path=/`;
    }
}
