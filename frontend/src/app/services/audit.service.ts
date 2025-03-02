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
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private apiUrl = environment.apiAuditLogUrl;

  constructor(private http: HttpClient) { }

  getAuditLogs(): Observable<LogData[]> {
    return this.http.get<LogData[]>(this.apiUrl);
  }
}
