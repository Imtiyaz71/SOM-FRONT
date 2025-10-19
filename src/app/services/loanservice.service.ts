import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// LoanType interfaces
export interface LoanType {
  id: number;
  compId: string;
  typeName: string;
  interest: number;
  timePeriodMonths: number;
  createDate: string;
  updateDate?: string | null;
  updateBy?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LoanserviceService {
  private apiBase = `${environment.apiBaseUrl}/LoanCtrl`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all loan types by compId
  getLoanTypes(): Observable<LoanType[]> {
    const compId = this.authService.getcompanyid() ?? 0;
    return this.http.get<LoanType[]>(`${this.apiBase}/loantype?compId=${compId}`);
  }

  // Get single loan type by Id
  getLoanTypeById(id: number): Observable<LoanType> {
    return this.http.get<LoanType>(`${this.apiBase}/loantypebyid?id=${id}`);
  }

  // Save or update loan type
  saveLoanType(data: LoanType, headers?: HttpHeaders): Observable<string> {
    // Insert if id=0, update otherwise (backend handles this)
    return this.http.post<string>(`${this.apiBase}/saveloantype`, data, { headers });
  }
}
