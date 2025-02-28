import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.authStatus.next(true);
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
    return this.http.get(`${this.apiUrl}/profile`);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('access_token');
        this.authStatus.next(false);
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
  
  getUserPermissions(): string[] {
    const decoded = this.decodeToken();
    return decoded?.permissions || [];
  }
}
