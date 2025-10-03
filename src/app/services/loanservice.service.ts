import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface crinfo { id: number; crname: string; }
export interface loantypeinfo { id: number; typeName: string;crid: number;crname: string;amount: number;createdate: string;updatedate: string; }
export interface addloantype { id: number; typeName: string;crid: number;amount: number;createdate: string;updatedate: string; compId:string| null;}

@Injectable({
  providedIn: 'root'
})
export class LoanserviceService {
  private apiBase = environment.apiBaseUrl + '/LoanCtrl';
    private apicr = environment.apiBaseUrl + '/KistiCtrl';
  constructor(private http: HttpClient,private authService: AuthService) {}
  getcrinfo(): Observable<crinfo[]> { return this.http.get<crinfo[]>(this.apicr + '/crtype'); }
getloantype(): Observable<loantypeinfo[]> {
  return this.http.get<loantypeinfo[]>(
    `${this.apiBase}/loantype?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
 getloantypebyid(id: number): Observable<loantypeinfo> { return this.http.get<loantypeinfo>(`${this.apiBase}/loantypebyid?id=${id}`); }

 saveloantype(formData: addloantype, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/saveloantype', formData, { headers });
}
}
