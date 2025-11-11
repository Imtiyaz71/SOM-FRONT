import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
export interface companyinfo { id: number;cName:string;cPhone:string;cEmail:string;cAddress:string;cWebsite:string;cLogo:string;createAt:string; }
export interface CompanyInfoResponse {
  info: companyinfo1;
}

export interface companyinfo1 {
  id: number;
  cName: string;
  cPhone: string;
  cEmail: string;
  cAddress: string;
  cWebsite: string;
  cLogo: string;
  createAt: string ;
}

export interface LoginResponse {
  token: string | null;
  role: string | null;
  fullname: string | null;
  username: string | null;
  cname: string | null;
  cid: number | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Log/login`, { username, password });
  }
  // getcompanyinfo(): Observable<companyinfo[]> { return this.http.get<companyinfo[]>(this.apiUrl + '/Log/cominfo'); }
 getCompanyInfo(): Observable<companyinfo[]> {
  const cid = localStorage.getItem('cId');
  return this.http.get<companyinfo[]>(`${this.apiUrl}/Log/cominfo?cid=${cid}`);
}
getCompanyInfo1(): Observable<{ info: companyinfo1 }> {
  const cid = localStorage.getItem('cId');
  return this.http.get<{ info: companyinfo1 }>(`${this.apiUrl}/Log/cominfo?cid=${cid}`);
}
  // Save token and role in localStorage
  saveAuthData(token: string, role: string,fullname: string,username: string,cId: string) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('role', role);
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('username', username);
    localStorage.setItem('cId', cId);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
 getusername(): string | null {
    return localStorage.getItem('username');
  }
  getfullnamename(): string | null {
    return localStorage.getItem('fullname');
  }
    getcompanyid(): string | null {
    return localStorage.getItem('cId');
  }
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    localStorage.removeItem('fullname');
    localStorage.removeItem('username');
    localStorage.removeItem('cId');
  }
}
