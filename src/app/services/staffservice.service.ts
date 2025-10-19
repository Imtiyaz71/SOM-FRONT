import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// ------------------ Interfaces ------------------
export interface StaffDesignation {
  id: number;
  compId: number;
  designation: string;
}

export interface VW_Staff {
  id: number;
  compId: number;
  fullName: string;
  nId: string;
  phone: string;
  email: string;
  fullAddress: string;
  staffType: number;
  designation?: string; // from joined table
  photo: string;
  createDate: string;
  updateDate: string;
  createBy: string;
}
export interface VW_ArchiveStaff {
  id: number;
  compId: number;
  fullName: string;
  nId: string;
  fullAddress: string;
  staffType: number;
  photo: string;
  phone: string;
  email: string;
  deactiveDate: string;
  designation: string;
}
export interface VW_Response {
  statusCode: number;
  message: string;
}

// ------------------ Service ------------------
@Injectable({
  providedIn: 'root'
})
export class StaffserviceService {
  private apiBase = environment.apiBaseUrl + '/StaffCtrl';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ------------------ Private ------------------
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // ------------------ StaffDesignation Methods ------------------

  getStaffDesignations(): Observable<StaffDesignation[]> {
    const headers = this.getHeaders();
    const compId = this.authService.getcompanyid() ?? '';
    return this.http.get<StaffDesignation[]>(
      `${this.apiBase}/getstaffdesignation?compId=${compId}`,
      { headers }
    );
  }

  saveStaffDesignation(model: StaffDesignation): Observable<VW_Response> {
    const headers = this.getHeaders();
    return this.http.post<VW_Response>(
      `${this.apiBase}/save-staff-designation`,
      model,
      { headers }
    );
  }

  deleteStaffDesignation(id: number): Observable<VW_Response> {
    const compId = this.authService.getcompanyid() ?? '';
    return this.http.post<VW_Response>(
      `${this.apiBase}/delete-staff-designation?id=${id}&compId=${compId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // ------------------ Staff Methods ------------------

 getStaffList(): Observable<VW_Staff[]> {
  const headers = this.getHeaders();
  const compId = this.authService.getcompanyid() ?? '';
  return this.http.get<VW_Staff[]>(
    `${this.apiBase}/getstaffinfo?compId=${compId}`,
    { headers }
  );
}
  getArchiveStaff(): Observable<VW_ArchiveStaff[]> {
      const compId = this.authService.getcompanyid() ?? '';
    return this.http.get<VW_ArchiveStaff[]>(`${this.apiBase}/get-archive-staff?compId=${compId}`);
  }
  saveStaff(model: VW_Staff): Observable<VW_Response> {
    const headers = this.getHeaders();
    return this.http.post<VW_Response>(
      `${this.apiBase}/save-staff`,
      model,
      { headers }
    );
  }
  deactivateStaff(id: number): Observable<VW_Response> {
     const headers = this.getHeaders();
  return this.http.post<VW_Response>(
    `${this.apiBase}/deactivate-staff?id=${id}`,{headers}

  );
}
}
