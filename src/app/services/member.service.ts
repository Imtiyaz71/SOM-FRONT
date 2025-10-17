import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface MemberInfo { memNo: number; givenName: string; sureName: string; phone: string | null; email: string | null; address: string | null; niD: string | null; biCNo: string | null; father: string | null; mother: string | null; passportNo: string | null; nationality: string | null; photo: string | null; idenDocu: string | null; gender: string | null; genderid: number; createDate: string | null; createBy: string | null; updateDate: string | null; }
export interface MemberAdd { memNo: number; givenName: string; sureName: string; phone: string | null; email: string | null; address: string | null; niD: string | null; biCNo: string | null; father: string | null; mother: string | null; passportNo: string | null; nationality: string | null; photo: string | null; idenDocu: string | null; gender: number; createDate: string | null; createBy: string | null; updateDate: string | null; compId:string|null}
export interface genderinfo { id: number; genders: string; }
export interface membertransfer { id: number; memno: number;fromMember:string;toMember:string;fromNid:string;toNid:string;fromBiCNo:string;toBiC:string;transferDate:string;transferBy:string; }
export interface memberdeactivelogs { id: number; memNo: number;givenName:string;sureName:string;entryDate:string;entryBy:string;}
export interface VW_ProjectWiseMemberReceive {
  memberInfo: string;   // "imtiyaz Uddin (9)"
  projectInfo: string;  // "Goran Chotbari Project (5)"
  typeName: string;     // "Half Year Installment"
  recYear: number;      // 2025
  jan: string;          // "Payble-5000, Rec-5000, Due-0" or ""
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  total: number;        // 5000
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiBase = environment.apiBaseUrl + '/Memb';

  constructor(private http: HttpClient,private authService: AuthService) {}

 getmemberinfo(): Observable<MemberInfo[]> {
  return this.http.get<MemberInfo[]>(`${this.apiBase}/memberinfoall?compId=${this.authService.getcompanyid()}`);
}
  getmemberById(memno: number): Observable<MemberInfo> { return this.http.get<MemberInfo>(`${this.apiBase}/memberinfobyid?memno=${memno}`); }

  gettransferlogs(): Observable<membertransfer[]> {
  return this.http.get<membertransfer[]>(`${this.apiBase}/transferlogslist?compId=${this.authService.getcompanyid()}`);
}
 getdeactivelogs(): Observable<memberdeactivelogs[]> {
  return this.http.get<memberdeactivelogs[]>(`${this.apiBase}/deactivelogs?compId=${this.authService.getcompanyid()}`);
}
  getgender(): Observable<genderinfo[]> { return this.http.get<genderinfo[]>(environment.apiBaseUrl + '/SelectedValue/genderlist'); }
 getmemberwisekistireceiveamount(): Observable<VW_ProjectWiseMemberReceive[]> {
  return this.http.get<VW_ProjectWiseMemberReceive[]>(`${this.apiBase}/kistipaidhistory?compId=${this.authService.getcompanyid()}`);
}
 getmemberwisesubscriptionamount(): Observable<VW_ProjectWiseMemberReceive[]> {
  return this.http.get<VW_ProjectWiseMemberReceive[]>(`${this.apiBase}/subscriptionpaidhistory?compId=${this.authService.getcompanyid()}`);
}
  savememberdata(formData: MemberAdd, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiBase + '/savemember', formData, { headers });
  }
 transferdata(formData: MemberAdd, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiBase + '/transfermember', formData, { headers });
  }
  editmemberdata(formData: MemberAdd, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiBase + '/editmember', formData, { headers });
  }
 memberDeactive(formData: { memNo: number; compId: number; entryBy: string }, headers: HttpHeaders): Observable<any> {
  return this.http.post(this.apiBase + '/memberdeactive', formData, { headers });
}
}
