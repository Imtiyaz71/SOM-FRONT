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

}
