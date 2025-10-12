import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface crinfo { id: number; crname: string; }
export interface subscriptiontypeinfo { id: number; typeName: string;crid: number;crname: string;amount: number;createdate: string;updatedate: string;projectid:number;projectName:string }
export interface addsubscriptiontype { id: number; typeName: string;crid: number;amount: number;createdate: string;updatedate: string; compId:string| null;projectid:number;}
export interface regularsubs{id:number;compId:number;amount:number;updateDate:string;updateBy:string;}

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
getregularsubscription(): Observable<regularsubs[]> {
  return this.http.get<regularsubs[]>(`${this.apiBase}/regularsubscription?compId=${this.authService.getcompanyid() ?? ''}`);
}
 getsubscriptionbyproject(id: number): Observable<subscriptiontypeinfo[]> { return this.http.get<subscriptiontypeinfo[]>(`${this.apiBase}/subscriptionbyproject?compId=${this.authService.getcompanyid() ?? ''}&projectid=${id}`); }

savesubscriptiontype(formData: addsubscriptiontype, headers: HttpHeaders): Observable<string> {
  formData.id = formData.id && formData.id > 0 ? formData.id : 0; // 👈 Important fix
  return this.http.post<string>(this.apiBase + '/savesubscriptiontype', formData, { headers });
}

}
