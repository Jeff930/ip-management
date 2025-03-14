import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiAuthUrl;
  private authStatus = new BehaviorSubject<boolean>(this.getToken() !== null);
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  private getStoredUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getUserUpdates(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (!response.access_token) {
          throw new Error('Login response did not include access token');
        }
        this.storeUserData(response.access_token, response.user);
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
        this.updateUser(user);
      }),
      catchError(err => throwError(() => err.error.error))
    );
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => 'No access token found.');
    }
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearLocalStorage();
      }),
      catchError(err => throwError(() => err.error.error))
    );
  }

  updateInfo(data: { name: string; email: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/update`, data).pipe(
      tap(user => {
        this.updateUser(user);
      }),
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

  getUserName(): string {
    return this.currentUserSubject.value?.name || '';
  }

  getUserEmail(): string {
    return this.currentUserSubject.value?.email || '';
  }

  getUserId(): string {
    return this.currentUserSubject.value?.id || '';
  }

  getUserPermissions(): string[] {
    return this.currentUserSubject.value?.role?.permissions?.map((p: { name: string }) => p.name) || [];
  }

  private storeUserData(token: string, user: any) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.authStatus.next(true);
    this.currentUserSubject.next(user);
  }

  private updateUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.authStatus.next(false);
    this.currentUserSubject.next({});
  }
}
