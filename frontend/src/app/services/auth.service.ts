import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, catchError, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost/auth-api';
  private authStatus = new BehaviorSubject<boolean>(this.getToken() ? true : false);

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      switchMap((response: any) => {
        const token = response.access_token;
        const currentUser = response.user;
        if (!token) {
          return throwError(() => new Error('Login response did not include access token'));
        }
        return this.http.post('https://localhost/ip-api/audit-logs/log-login', { user_id: response.user_id }, {
          headers: { Authorization: `Bearer ${token}` }
        }).pipe(
          tap(() => {
            localStorage.setItem('access_token', token); 
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); 
            this.authStatus.next(true);
            console.log('Login event successfully logged');
          }),
          catchError(err => {
            console.error('Log-login failed:', err);
            return throwError(() => new Error('Failed to log login event'));
          })
        );
      }),
      catchError(err => {
        console.error('Login failed:', err);
        return throwError(() => new Error('Invalid login credentials or failed audit logging'));
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh`, {}).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }


  logout(): Observable<any> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return throwError(() => new Error('No access token found.'));
    }

    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('access_token'); 
        this.authStatus.next(false);
        console.log('User successfully logged out.');
      }),
      switchMap(() => {
        return this.http.post('https://localhost/ip-api/audit-logs/log-logout', {}, {
          headers: { Authorization: `Bearer ${token}` } 
        });
      }),
      tap(() => console.log('Logout event successfully logged')),
      catchError(err => {
        console.error('Log-logout failed:', err);
        return throwError(() => new Error('Logout event logging failed.'));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  updateInfo(data: { name: string; email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/update`, data);
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/change-password`, passwordData);
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  getUserEmail(): string {
    const userString = localStorage.getItem('currentUser');

    if (!userString) {
      return '';
    }

    try {
      const user = JSON.parse(userString);
      return user?.email || null;
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      return '';
    }
  }

  getUserName(): string {
    const userString = localStorage.getItem('currentUser');

    if (!userString) {
      return '';
    }

    try {
      const user = JSON.parse(userString);
      return user?.name || null;
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      return '';
    }
  }

  getUserId(): string {
    const userString = localStorage.getItem('currentUser');

    if (!userString) {
      return '';
    }

    try {
      const user = JSON.parse(userString);
      return user?.id || null;
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      return '';
    }
  }


  getUserPermissions(): string[] {
    const decoded = this.decodeToken();
    return decoded?.permissions || [];
  }
}
