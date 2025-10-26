import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Advisory Role model
export interface AdvisoryRole {
  id?: number; // auto-increment, optional
  compId: string|null;
  roles: string;
}
export interface Advisory {
  id?: number;      // optional, backend auto-increment
  compId: number;
  memNo: number;
  adRole: number;
  validity: string;
  cStatus: number;
}
export interface VW_AdvisoryList {
  id: number;
  compId: number;
  memNo: number;
  givenName: string;
  sureName: string;
  adRole: number;
  roles: string;
  validity: string;
  cStatus: number;
}

// Response model
export interface VW_Response {
  statusCode: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvisoryService {
  private apiBase = environment.apiBaseUrl + '/AdvisoryCtrl';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // 🔹 Get advisory roles by company
  getAdvisoryRoles(): Observable<AdvisoryRole[]> {
    const compId = this.authService.getcompanyid();
    return this.http.get<AdvisoryRole[]>(`${this.apiBase}/get-advisory-role?compId=${compId}`);
  }

  // 🔹 Add new advisory role
  addAdvisoryRole(model: AdvisoryRole): Observable<VW_Response> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<VW_Response>(`${this.apiBase}/add-advisory-role`, model, { headers });
  }
    deleteAdvisoryRole(compId: number, id: number): Observable<VW_Response> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Backend expects POST with query params
    return this.http.post<VW_Response>(
      `${this.apiBase}/delete-advisory-role?compId=${compId}&id=${id}`,
      {}, // body is empty
      { headers }
    );
  }
   getActiveAdvisoryList(): Observable<VW_AdvisoryList[]> {
    const compId = this.authService.getcompanyid();
       const cStatus = 1;
    return this.http.get<VW_AdvisoryList[]>(
      `${this.apiBase}/get-advisory-list?compId=${compId}&cStatus=${cStatus}`
    );
  }
     getDeActiveAdvisoryList(): Observable<VW_AdvisoryList[]> {
    const compId = this.authService.getcompanyid();
       const cStatus = 0;
    return this.http.get<VW_AdvisoryList[]>(
      `${this.apiBase}/get-advisory-list?compId=${compId}&cStatus=${cStatus}`
    );
  }
  addAdvisory(advisory: Advisory): Observable<VW_Response> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<VW_Response>(
      `${this.apiBase}/add-advisory`,
      advisory,
      { headers }
    );
  }
    deactiveadvisory(compId: number, id: number): Observable<VW_Response> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Backend expects POST with query params
    return this.http.post<VW_Response>(
      `${this.apiBase}/deactiveadvisory?compId=${compId}&id=${id}`,
      {}, // body is empty
      { headers }
    );
  }
}
