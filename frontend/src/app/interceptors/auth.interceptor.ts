import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  // Use Angular's dependency injection to get the AuthService
  const authService = inject(AuthService);
  const token = authService.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get a 401 Unauthorized error, try refreshing the token
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            // Store the new token and clone the request with it
            localStorage.setItem('access_token', response.access_token);
            const clonedRequest = req.clone({
              setHeaders: { Authorization: `Bearer ${response.access_token}` }
            });
            return next(clonedRequest);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
