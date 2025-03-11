import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface LogData {
  _id: string;
  actorId: string;
  sessionId: string;
  actorName: string;
  action: string;
  targetId: string;
  targetType: string;
  target: string;
  createdAt: string;
  updatedAt: string;
  changes?: object;
  __v: number;
  [key: string]: any;
}

export interface UserLogData {
  id: number;
  actor_id: number;
  session_id: string;
  actor_name: string;
  action: string;
  target_id: number;
  target_type: string;
  target: string,
  changes?: object;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private ipAuditUrl = environment.apiIpAuditLogUrl;
  private userAuditUrl = environment.apiUserAuditLogUrl;

  constructor(private http: HttpClient) { }

  getAuditLogs(): Observable<LogData[]> {
    return this.http.get<LogData[]>(this.ipAuditUrl);
  }

  getUserAuditLogs(): Observable<LogData[]> {
    return this.http.get<LogData[]>(this.userAuditUrl);
  }
}
