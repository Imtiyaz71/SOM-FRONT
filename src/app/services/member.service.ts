import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MemberInfo { memNo: number; givenName: string; sureName: string; phone: string | null; email: string | null; address: string | null; niD: string | null; biCNo: string | null; father: string | null; mother: string | null; passportNo: string | null; nationality: string | null; photo: string | null; idenDocu: string | null; gender: string | null; genderid: number; createDate: string | null; createBy: string | null; updateDate: string | null; }
export interface MemberAdd { memNo: number; givenName: string; sureName: string; phone: string | null; email: string | null; address: string | null; niD: string | null; biCNo: string | null; father: string | null; mother: string | null; passportNo: string | null; nationality: string | null; photo: string | null; idenDocu: string | null; gender: number; createDate: string | null; createBy: string | null; updateDate: string | null; }
export interface genderinfo { id: number; genders: string; }
export interface membertransfer { id: number; memno: number;fromMember:string;toMember:string;fromNid:string;toNid:string;fromBiCNo:string;toBiC:string;transferDate:string;transferBy:string; }
@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiBase = environment.apiBaseUrl + '/Memb';

  constructor(private http: HttpClient) {}

  getmemberinfo(): Observable<MemberInfo[]> { return this.http.get<MemberInfo[]>(this.apiBase + '/memberinfoall'); }

  getmemberById(memno: number): Observable<MemberInfo> { return this.http.get<MemberInfo>(`${this.apiBase}/memberinfobyid?memno=${memno}`); }
  gettransferlogs(): Observable<membertransfer[]> { return this.http.get<membertransfer[]>(this.apiBase + '/transferlogslist'); }

  getgender(): Observable<genderinfo[]> { return this.http.get<genderinfo[]>(environment.apiBaseUrl + '/SelectedValue/genderlist'); }

  savememberdata(formData: MemberAdd, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiBase + '/savemember', formData, { headers });
  }
 transferdata(formData: MemberAdd, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiBase + '/transfermember', formData, { headers });
  }
  editmemberdata(formData: MemberAdd, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.apiBase + '/editmember', formData, { headers });
  }
}
