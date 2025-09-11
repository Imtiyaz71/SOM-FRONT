import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Log/login`, { username, password });
  }

  // Save token and role in localStorage
  saveAuthData(token: string, role: string,fullname: string,username: string) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('username', username);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }
 getusername(): string | null {
    return localStorage.getItem('username');
  }
  getfullnamename(): string | null {
    return localStorage.getItem('fullname');
  }
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
  }
}
