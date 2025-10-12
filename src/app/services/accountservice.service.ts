import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface addregularsubscription{id:number;compId:string;memNo:number;paybleamount:number;recamount:number;recdate:string;recmonth:string;recyear:number;trnasBy:string;}

export interface getregularreceive { id:number;memNo: number;givenName:string;sureName:string;paybleAmount: number;recAmount:number;due:number;recDate: string;recMonth:string;recYear:number;recBy:string;}

export interface addamount { projectid:number,typeid: number; compId: string|null;memNo: number;paybleamount: number;recamount:number;remark: string;recdate: string;recmonth:string;recyear:number;transby:string;}
export interface getreceive { id:number;typeid: number; typeName:string;memNo: number;givenName:string;sureName:string;paybleAmount: number;recAmount:number;due:number;remarks: string;recDate: string;recMonth:string;recYear:number;transby:string;projectid:number;projectName:string;}

@Injectable({
  providedIn: 'root'
})
export class accountservice {
  private apiBase = environment.apiBaseUrl + '/AccountCtrl';

  constructor(private http: HttpClient,private authService: AuthService) { }
getkistireceive(): Observable<getreceive[]> {
  return this.http.get<getreceive[]>(
    `${this.apiBase}/kistireceive?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
getsubscriptionreceive(): Observable<getreceive[]> {
  return this.http.get<getreceive[]>(
    `${this.apiBase}/subscriptionreceive?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
getregularsubscriptionreceive(): Observable<getregularreceive[]> {
  return this.http.get<getregularreceive[]>(
    `${this.apiBase}/regularsubscriptionreceive?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
savekistiamount(formData: addamount, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/savekistiamount', formData, { headers });
}
savesubscriptionamount(formData: addamount, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/savesubscriptionamount', formData, { headers });
}
saveregularsubscriptionamount(formData: any, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/saveregularsubscription', formData, { headers });
}
}
