import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface addregularsubscription{id:number;compId:string;memNo:number;paybleamount:number;recamount:number;recdate:string;recmonth:string;recyear:number;trnasBy:string;}

export interface getregularreceive { id:number;memNo: number;givenName:string;sureName:string;paybleAmount: number;recAmount:number;due:number;recDate: string;recMonth:string;recYear:number;recBy:string;}

export interface addamount { projectid:number,typeid: number; compId: string|null;memNo: number;paybleamount: number;recamount:number;remark: string;recdate: string;recmonth:string;recyear:number;transby:string;}
export interface getreceive { id:number;typeid: number; typeName:string;memNo: number;givenName:string;sureName:string;paybleAmount: number;recAmount:number;due:number;remarks: string;recDate: string;recMonth:string;recYear:number;transby:string;projectid:number;projectName:string;}
export interface getvendor{id:number;vType:string;}
export interface getbalanceaddhistory{id:number;compId:number;vendor:number;vType:string;descri:string;amount:number;adate:string}
export interface getamount{id:number;compId:string;amount:number;updateDate:string;}
export interface balancesegment{id:number;compId:string;vendor:number;vType:string;descri:string;amount:number;createDate:string;}
export interface addbalancesegment{id:number;compId:string;vendor:number;descri:string;amount:number;createDate:string}
export interface somityTransection {
  id: number;
  compId: number;
  purpose: string;
  amount: number;
  crType: number;
  crName: string;
  remarks: string;
  dates: string;
  months: string;
  years: string;
  transectionBy: string;
}
export interface AccDrCr {
  startDate?: string | null;
  endDate?: string | null;
  compId: string|null;
  crType: number;
}
export interface BalanceWithdraw {
  id: number;
  compId: number;
  memNo: number;
  fProject: number;
  projectName: string;
  givenName: string;
  sureName: string;
  amount: number;
  paid: number;
  due: number;
  remarks: string;
  wDate: string;
  wMonth: string;
  wYear: number;
}
export interface BalanceWithdrawAdd {
  compId: string|null;
  memNo: number;
  fProject: number;
  amount: number;
  remarks: string;
  wDate: string;
  wMonth: string;
  wYear: number;
  wBy: string|null;
}
export interface VWBounceBalanceWithdrwal {
  id: number;
  fProject: number;
  memNo: number;
  compId: number;
}
export interface RePayModel {
  compId: number;
  memNo: number;
  projectId: number;
  payble: number;
  paid: number;
  withdrwalID: number;
}
export interface VW_MemberProjectAccount {
  Id: number;
  memNo: number;
  compId: number;
  projectId: number;
  amount: number;
  createDate: string;
  updateDate: string;
  Payble: number;
  Due: number;
  GivenName: string;

  SureName: string;
  ProjectName: string;
}

// SP output model
export interface VW_Response {
  statusCode: number;
  message: string;
}
export interface MemberBalance {
  sl: number;
  memberInfo: string;
  projectInfo?: string | null;
  projectBalance?: number | null;
  totalBalance: number;
}
export interface VW_Journal {
  years: number;
  months: string;
  purpose: string;
  debit: number;
  credit: number;
  balance: number;
}
export interface ProjectAccountSummary {
  id: number;
  compId: number;
  projectId: number;
  budget: number;
  balance: number;
  expense: number;
  lastTransaction: string; // backend string format e asche
  createDate: string;      // backend string e asche, Date object convert korte paro later
  updateDate?: string;     // nullable
  projectName: string;
}
@Injectable({
  providedIn: 'root'
})
export class accountservice {
  private apiBase = environment.apiBaseUrl + '/AccountCtrl';

  constructor(private http: HttpClient,private authService: AuthService) { }
getvendor(): Observable<getvendor[]> {
  return this.http.get<getvendor[]>(
    `${this.apiBase}/vendor`
  );
}
  getbalance(): Observable<getamount[]> {
  return this.http.get<getamount[]>(
    `${this.apiBase}/accountbalance?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
getbalancesegment(): Observable<balancesegment[]> {
  return this.http.get<balancesegment[]>(
    `${this.apiBase}/getvalancesegment?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
getbalancesegmentbyid(id: number): Observable<balancesegment[]> { return this.http.get<balancesegment[]>(`${this.apiBase}/getvalancesegmentbyid?id=${id}`); }
getbalanceaddhistory(): Observable<getbalanceaddhistory[]> {
  return this.http.get<getbalanceaddhistory[]>(
    `${this.apiBase}/balance-add-history?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
getbalancewithdraw(): Observable<BalanceWithdraw[]> {
  return this.http.get<BalanceWithdraw[]>(
    `${this.apiBase}/get-Balance-withdraw?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
  getSomityTransection(model: AccDrCr): Observable<somityTransection[]> {
    return this.http.post<somityTransection[]>(`${this.apiBase}/getsomityacctransection`, model);
  }
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
  getProjectAccountByMemberAndProject(
    compId?: number,
    memNo?: number,
    projectId?: number
  ): Observable<VW_MemberProjectAccount[]> {

    let query = '?';
    if (compId != null) query += `compId=${compId}&`;
    if (memNo != null) query += `memNo=${memNo}&`;
    if (projectId != null) query += `projectId=${projectId}&`;

    // remove trailing '&' if exists
    query = query.slice(0, -1);

    return this.http.get<VW_MemberProjectAccount[]>(`${this.apiBase}/memberprojectaccount${query}`);
  }
    getProjectAccountSummary(): Observable<ProjectAccountSummary[]> {
    return this.http.get<ProjectAccountSummary[]>(`${this.apiBase}/getprojectaccountsummary?compId=${this.authService.getcompanyid() ?? ''}`);
  }
savebalancesegment(formData: any, headers?: HttpHeaders): Observable<string> {
  return this.http.post(this.apiBase + '/savebalancesegment', formData, {
    headers: headers,
    responseType: 'text'
  });
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

  addBalanceWithdraw(model: BalanceWithdrawAdd): Observable<string> {
    return this.http.post<string>(`${this.apiBase}/save-withdraw`, model);
  }
    bounceBalanceWithdraw(model: VWBounceBalanceWithdrwal): Observable<string> {
    return this.http.post<string>(`${this.apiBase}/bounce-balance-withdraw`, model);
  }
   repay(model: RePayModel): Observable<VW_Response> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<VW_Response>(`${this.apiBase}/repay-balance`, model, { headers });
  }
    getMemberBalances(): Observable<MemberBalance[]> {
    return this.http.get<MemberBalance[]>(`${this.apiBase}/getmemberbalancehistory?compId=${this.authService.getcompanyid() ?? ''}`);
  }
   getjournal(): Observable<VW_Journal[]> {
    return this.http.get<VW_Journal[]>(`${this.apiBase}/getjournal?compId=${this.authService.getcompanyid() ?? ''}`);
  }
}
