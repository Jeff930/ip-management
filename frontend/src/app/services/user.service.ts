import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

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
  private apiUserUrl = environment.apiUserUrl;
  private apiAuthUrl = environment.apiAuthUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.apiUserUrl);
  }

  createUser(data: Partial<UserData>): Observable<UserData> {
    return this.http.post<UserData>(this.apiUserUrl, data);
  }

  updateUser(id: string, data: Partial<UserData>): Observable<UserData> {
    return this.http.put<UserData>(`${this.apiUserUrl}/${id}`, data);
  }

  updatePassword(id: string, data: Partial<UserData>): Observable<UserData> {
    return this.http.put<UserData>(`${this.apiUserUrl}/reset-password/${id}`, data);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUserUrl}/${id}`);
  }

  getRoles(): Observable<RoleData[]> {
    return this.http.get<RoleData[]>(`${this.apiAuthUrl}/roles`);
  }
}
