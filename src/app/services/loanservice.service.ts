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
  delayInterest: number;
  activityPeriod: number;
  createDate: string;
  updateDate?: string | null;
  updateBy?: string | null;
}
export interface VW_LoanSensionRequest {
  compId: number;
  fullName: string;
  phone: string;
  email: string;
  bAddress: string;
  nId: string;
  dob: string;
  father: string;
  mother: string;
  photo: string;

  // Loan info
  loanType: number;
  amount: number;
  sDate: string;
  sMonth: string;
  sYear: number;

  // Transaction by
  sBy: string;
}

export interface VW_Response {
  statusCode: number;
  message: string;
}

export interface VW_BorrowerLoanInfo {
  brwId: number;
  fullName: string;
  phone: string;
  email: string;
  bAddress: string;
  nId: string;
  dob: string;
  father: string;
  mother: string;
  photo: string;

  loanType?: number;
  amount?: number;
  sDate?: string;
  sMonth?: string;
  sYear?: number;
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
    saveLoanSension(model: VW_LoanSensionRequest): Observable<VW_Response> {
    return this.http.post<VW_Response>(`${this.apiBase}/SaveLoanSension`, model);
  }

  // Get Borrower + Loan Info (GET)
  getBorrowerLoanInfo(): Observable<VW_BorrowerLoanInfo[]> {
        const compId = this.authService.getcompanyid() ?? 0;
    return this.http.get<VW_BorrowerLoanInfo[]>(`${this.apiBase}/borrowerloan?compId=${compId}`);
  }
}
