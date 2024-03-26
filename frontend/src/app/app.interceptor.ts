import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    if (token) {
      if (this.isTokenExpired(token)) {
        this.authService.logout();
        return throwError('Token expired');
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request)
  }

  private isTokenExpired(token: string): boolean {
    const tokenExpiration = this.getTokenExpiration(token);
    return tokenExpiration !== null && tokenExpiration <= new Date();
  }

  private getTokenExpiration(token: string): any {
    const decodedToken: any = jwtDecode(token);
    if (!decodedToken.exp) return null;
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }
}

