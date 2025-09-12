import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface MemberInfo {
  memNo: number;
  givenName: string;
  sureName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  niD: string | null;
  biCNo: string | null;
  father: string | null;
  mother: string | null;
  passportNo: string | null;
  nationality: string | null;
  photo: string | null;
  gender: string | null;
  genderid: number;
  createDate: string | null;
  createBy: string | null;
  updateDate: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class MemberService {
 private basic = environment.apiBaseUrl + '/Memb/memberinfoall';
  private basicbyid = environment.apiBaseUrl + '/Memb/memberinfobyid';
    constructor(private http: HttpClient) { }
     getmemberinfo(): Observable<MemberInfo[]> {
        return this.http.get<MemberInfo[]>(this.basic);
      }
        getmemberById(memno: number): Observable<any> {
    return this.http.get<any>(`${this.basicbyid}?memno=${memno}`);
  }
}
