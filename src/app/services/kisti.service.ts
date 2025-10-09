import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface crinfo { id: number; crname: string; }
export interface kistitypeinfo { id: number; typeName: string;crid: number;crname: string;amount: number;createdate: string;updatedate: string;projectid:number;projectname:string }
export interface addkistitype { id: number; typeName: string;crid: number;amount: number;createdate: string;updatedate: string; compId:string| null;projectid:number}

@Injectable({
  providedIn: 'root'
})
export class KistiService {
  private apiBase = environment.apiBaseUrl + '/KistiCtrl';
  constructor(private http: HttpClient,private authService: AuthService) {}
  getcrinfo(): Observable<crinfo[]> { return this.http.get<crinfo[]>(this.apiBase + '/crtype'); }
getkistitype(): Observable<kistitypeinfo[]> {
  return this.http.get<kistitypeinfo[]>(
    `${this.apiBase}/kistytype?compId=${this.authService.getcompanyid() ?? ''}`
  );
}
 getkistitypeid(id: number): Observable<kistitypeinfo> { return this.http.get<kistitypeinfo>(`${this.apiBase}/kistytypebyid?id=${id}`); }

 savekistitype(formData: addkistitype, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/savekistitype', formData, { headers });
}

}
