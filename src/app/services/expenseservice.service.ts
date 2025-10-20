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
export interface Expense {
  id: number;
  exType: number;
  typeName: string;
  compId: number;
  amount: number;
  descri: string;
  eDate: string;
  eMonth: string;
  eBy: string;
  eYear: number;
}
export interface SaveExpense {
  id: number;       // usually 0 when inserting new record
  exType: number;
  compId: string|null;
  amount: number;
  descri: string;
  eDate: string;    // format: '15-Oct-2025'
  eMonth: string;
  eBy: string;
  eYear: number;
}
export interface MonthlyExpense {
  year: number;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}
export interface ProjectWiseExpense {
  id: number;
  compId: string|null;
  projectInfo?: string; // get response e থাকে
  projectId?: number;   // add এ লাগে
  purpose: string;
  amount: number;
  eDate: string;
  eMonth: string;
  eYear: number | string;
  eBy: string|null;
}

export interface VW_Response {
  statusCode: number;
  message: string;
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
 getexpense(): Observable<Expense[]> {
    return this.http.get<Expense[]>(
      `${this.apiBase}/get-expense?compId=${this.authService.getcompanyid() ?? ''}`
    );
  }
   getMonthlyExpense(year?: number): Observable<MonthlyExpense[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    let url = `${this.apiBase}/get-monthly-expense?compId=${this.authService.getcompanyid() ?? ''}`;
    if (year) url += `&year=${year}`;

    return this.http.get<MonthlyExpense[]>(url, { headers });
  }
  saveexpensetype(formData: expenseType, headers: HttpHeaders): Observable<string> {
    return this.http.post<string>(`${this.apiBase}/save-expense-type`, formData, { headers });
  }
 saveExpense(formData: SaveExpense, headers: HttpHeaders): Observable<string> {
    return this.http.post<string>(`${this.apiBase}/save-expense`, formData,{headers});
  }
  deleteexpensetype(id: number): Observable<any> {
    return this.http.post(`${this.apiBase}/delete-expense-type`, null, {
      params: { id: id.toString() }
    });
  }
    getProjectExpenses(): Observable<ProjectWiseExpense[]> {
    return this.http.get<ProjectWiseExpense[]>(`${this.apiBase}/get-project-expense?compId=${this.authService.getcompanyid() ?? ''}`);
  }

  // 🔹 2. Add Project Expense
  addProjectExpense(expense: ProjectWiseExpense): Observable<VW_Response> {
    return this.http.post<VW_Response>(`${this.apiBase}/add-project-expense`, expense);
  }
}
