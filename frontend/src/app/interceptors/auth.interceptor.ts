import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        if (!response?.access_token) {
          handleLogout(authService);
          return throwError(() => new Error("Invalid refresh token response"));
        }

        const newToken = response.access_token;
        localStorage.setItem('access_token', newToken);
        refreshTokenSubject.next(newToken);
        isRefreshing = false;

        return next(request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        handleLogout(authService);
        return throwError(() => err);
      })
    );

  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        if (!token) {
          handleLogout(authService);
          return throwError(() => new Error("No token available after refresh"));
        }
        return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
      })
    );
  }
}

function handleLogout(authService: AuthService) {
  authService.clearLocalStorage();
}

