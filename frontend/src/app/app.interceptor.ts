import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['/404']);
        }
        else if (error.status === 401) {
          if (this.authService.isRefreshTokenExpired()) {
            this.authService.logout();
            return throwError('Token expired');

          } else {
            return this.refreshToken(request, next);

          }
        }
        return throwError(error);
      })
    )
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap((data) => {
        const newToken = data.access;

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });

        this.authService.saveAccessToken(newToken);

        return next.handle(request);
      }),
      catchError((error) => {
        this.authService.logout();
        return throwError(error);
      })
    );
  }

}

