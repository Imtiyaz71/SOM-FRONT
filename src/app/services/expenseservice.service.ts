import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface expenseType {
  id: number;
  compId: string;
  typeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseserviceService {
  private apiBase = environment.apiBaseUrl + '/ExpenseCtrl';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getexpensetype(): Observable<expenseType[]> {
    return this.http.get<expenseType[]>(
      `${this.apiBase}/get-expense-type?compId=${this.authService.getcompanyid() ?? ''}`
    );
  }

  saveexpensetype(formData: expenseType, headers: HttpHeaders): Observable<string> {
    return this.http.post<string>(`${this.apiBase}/save-expense-type`, formData, { headers });
  }

  deleteexpensetype(id: number): Observable<any> {
    return this.http.post(`${this.apiBase}/delete-expense-type`, null, {
      params: { id: id.toString() }
    });
  }
}
