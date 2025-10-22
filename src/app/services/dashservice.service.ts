import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface DashboardCount {
  activeMember: number;
  deActiveMember: number;
  projectCount: number;
}
export interface VW_ReceiveDashboardSummary {
  receiveKisti: number;
  kistiDue: number;
  receivesubs: number;
  subsDue: number;
  receiveregsubs: number;
  regsubsDue: number;
}
@Injectable({
  providedIn: 'root'
})
export class DashserviceService {

  private apiBase = environment.apiBaseUrl + '/DashboardCtrl';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ✅ Dashboard Count Data আনবে
  getDashboardCounts(): Observable<DashboardCount> {
    const compId = this.authService.getcompanyid(); // AuthService থেকে CompanyId নেবে
    return this.http.get<DashboardCount>(`${this.apiBase}/dashcount?compId=${compId}`);
  }
 getReceiveDashboardSummary(): Observable<VW_ReceiveDashboardSummary> {
   const compId = this.authService.getcompanyid();
  return this.http.get<VW_ReceiveDashboardSummary>(
      `${this.apiBase}/dashrecsummary?compId=${compId}`
    );
  }
}
