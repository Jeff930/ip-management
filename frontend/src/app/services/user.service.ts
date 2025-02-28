import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export interface RoleData {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost/auth-api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.apiUrl);
  }

  createUser(data: Partial<UserData>): Observable<UserData> {
    return this.http.post<UserData>(this.apiUrl, data);
  }

  updateUser(id: string, data: Partial<UserData>): Observable<UserData> {
    return this.http.put<UserData>(`${this.apiUrl}/${id}`, data);
  }

  updatePassword(id: string, data: Partial<UserData>): Observable<UserData> {
    return this.http.put<UserData>(`${this.apiUrl}/reset-password/${id}`, data);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getRoles(): Observable<RoleData[]> {
    return this.http.get<RoleData[]>(`https://localhost/auth-api/roles`);
  }
}
