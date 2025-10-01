import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface crinfo { id: number; crname: string; }
export interface subscriptiontypeinfo { id: number; typeName: string;crid: number;crname: string;amount: number;createdate: string;updatedate: string; }
export interface addsubscriptiontype { id: number; typeName: string;crid: number;amount: number;createdate: string;updatedate: string; compId:string| null;}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
private apiBase = environment.apiBaseUrl + '/SubscriptionCtrl';
private apicr = environment.apiBaseUrl + '/KistiCtrl';
  constructor(private http: HttpClient,private authService: AuthService) { }
 getcrinfo(): Observable<crinfo[]> { return this.http.get<crinfo[]>(this.apicr + '/crtype'); }
getsubscriptionTypeinfo(): Observable<subscriptiontypeinfo[]> {
  return this.http.get<subscriptiontypeinfo[]>(
    `${this.apiBase}/subscriptiontypes?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
 getsubscriptiontypeid(id: number): Observable<subscriptiontypeinfo> { return this.http.get<subscriptiontypeinfo>(`${this.apiBase}/subscriptiontypebyid?id=${id}`); }

 savesubscriptiontype(formData: addsubscriptiontype, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/savesubscriptiontype', formData, { headers });
}
}
