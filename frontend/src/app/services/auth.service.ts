import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, catchError, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiAuthUrl;
  private apiAuditUrl = environment.apiAuditLogUrl;
  private authStatus = new BehaviorSubject<boolean>(this.getToken() ? true : false);

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      switchMap((response: any) => {
        const token = response.access_token;
        const currentUser = response.user;
        if (!token) {
          return throwError(() => 'Login response did not include access token');
        }
        return this.http.post(`${this.apiAuditUrl}/log-login`, { user_id: response.user_id }, {
          headers: { Authorization: `Bearer ${token}` }
        }).pipe(
          tap(() => {
            localStorage.setItem('access_token', token);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.authStatus.next(true);
          }),
          catchError(err => throwError(() => err.error.error))
        );
      }),
      catchError(err => throwError(() => err.error.error))
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh`, {}).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.authStatus.next(true); 
      }),
      catchError(err => {
        this.authStatus.next(false); 
        return throwError(() => err.error.error);
      })
    );
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError(err => throwError(() => err.error.error))
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError(() => 'No access token found.');
    }

    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      switchMap(() => {
        return this.http.post(`${this.apiAuditUrl}/log-logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        }).pipe(
          tap(() => {
            localStorage.removeItem('access_token');
            this.authStatus.next(false);
          }),
          catchError(err => {
            console.error('Log-logout failed:', err);
            return throwError(() => err.error.error);
          })
        );
      }),
      catchError(err => {
        console.error('Logout failed:', err);
        return throwError(() => err.error.error);
      })
    );
  }

  updateInfo(data: { name: string; email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/update`, data).pipe(
      catchError(err => throwError(() => err.error.error))
    );
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/change-password`, passwordData).pipe(
      catchError(err => throwError(() => err.error.error))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  getUserEmail(): string {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return '';
    try {
      const user = JSON.parse(userString);
      return user?.email || '';
    } catch (error) {
      return '';
    }
  }

  getUserName(): string {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return '';
    try {
      const user = JSON.parse(userString);
      return user?.name || '';
    } catch (error) {
      return '';
    }
  }

  getUserId(): string {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return '';
    try {
      const user = JSON.parse(userString);
      return user?.id || '';
    } catch (error) {
      return '';
    }
  }

  getUserPermissions(): string[] {
    const decoded = this.decodeToken();
    return decoded?.permissions || [];
  }

  clearLocalStorage(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.authStatus.next(false);
  }  
}
