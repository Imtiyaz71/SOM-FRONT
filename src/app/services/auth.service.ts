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
  saveAuthData(token: string, role: string) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userRole', role);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
  }
}
