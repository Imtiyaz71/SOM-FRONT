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
export interface LoanSension {
  id: number;
  fullName: string;
  phone: string;
  typeName: string;
  timePeriodMonths: number;
  activityPeriod: number;
  interest: number;
  delayInterestRate: number;
  principal: number;
  sDate: string;
  endContractAt: string;
  monthsPassed: number;
  activeMonthRunning: number;
  paidMonths: number;
  remainingMonth: number;
  monthWiseInterest: number;
  monthlyPrincipal: number;
  monthlyPrinciplePayable: number;
  runningInterestTotal: number;
  calculatedDelayInterest: number;
  totalPayable: number;
  compId: number;
}
export interface LoanPaid {
  id: number;
  compId: number;
  loanId: number;
  payble: number;
  paidAmount: number;
  principle: number;
  interest: number;
  pDate: string;
  pMonth: string;
  pYear: number;
  pBy: string;
}
export interface LoanPaidHistory {
  id: number;
  loanId: number;
  payble: number;
  paidAmount: number;
  interest: number;
  principle: number;
  pDate: string; // or Date if you parse it
  pMonth: number;
  pYear: number;
  fullName: string;
  phone: string;
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
   getLoanSensionDetails(): Observable<LoanSension[]> {
      const compId = this.authService.getcompanyid() ?? 0;
    return this.http.get<LoanSension[]>(`${this.apiBase}/loanpaiddetails?compId=${compId}`);
  }
    saveLoanPaid(model: LoanPaid): Observable<VW_Response> {
    // JWT token fetch from localStorage/sessionStorage
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<VW_Response>(`${this.apiBase}/save-loan-paid`, model, { headers });
  }
  
  getLoanPaidHistory(): Observable<LoanPaidHistory[]> {
    const compId = this.authService.getcompanyid() ?? 0;
    return this.http.get<LoanPaidHistory[]>(`${this.apiBase}/loan-paid-history?compId=${compId}`);
  }
}
