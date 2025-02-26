import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IpData {
  id: string;
  ip: string;
  label: string;
  createdAt: string;
  updatedAt?: string;
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {
  private apiUrl = 'http://localhost/auth-api/ip-addresses';

  constructor(private http: HttpClient) { }

  getIpAddresses(): Observable<IpData[]> {
    return this.http.get<IpData[]>(this.apiUrl);
  }

  addIpAddress(ipData: Partial<IpData>): Observable<IpData> {
    return this.http.post<IpData>(this.apiUrl, ipData);
  }

  updateIpAddress(id: string, ipData: Partial<IpData>): Observable<IpData> {
    return this.http.put<IpData>(`${this.apiUrl}/${id}`, ipData);
  }

  deleteIpAddress(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
