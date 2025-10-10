import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface projectinfo { id: number;projectId: number;projectName: string;proLocation: string;budget:number;directorId:number;givenName:string;sureName:string;startDate: string; tentitiveEndDate: string;compId:string| null;}
export interface addproject { id: number;projectId: number;projectName: string;proLocation: string;budget:number;directorId:number;startDate: string; tentitiveEndDate: string;compId:string| null;}
export interface assigninfo { id: number;projectid: number;projectname: string;memNo: number;givenName:string;sureName:string;assignDate: string; assignBy: string;compId:string| null;}
export interface addassign{projectId:number;memNo:number;assignBy:string;compId:string|null}

@Injectable({
  providedIn: 'root'
})
export class ProjectserviceService {

  private apiBase = environment.apiBaseUrl + '/ProjectCtrl';
  constructor(private http: HttpClient,private authService: AuthService) {}


  getprojectinfo(): Observable<projectinfo[]> {
    return this.http.get<projectinfo[]>(
      `${this.apiBase}/getproject?compId=${this.authService.getcompanyid() ?? ''}`
    );
  }
   getProjecttypebyId(id: number): Observable<projectinfo> { return this.http.get<projectinfo>(`${this.apiBase}/getprojectbyprojectid?projectid=${id}`); }

   saveproject(formData: addproject, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/save-project', formData, { headers });
}
  getassigninfo(): Observable<assigninfo[]> {
    return this.http.get<assigninfo[]>(
      `${this.apiBase}/getassign?compId=${this.authService.getcompanyid() ?? ''}`
    );
  }
  getAssignByPrid(id: number): Observable<assigninfo[]> {
  return this.http.get<assigninfo[]>(
    `${this.apiBase}/getassignbyproject?projectid=${id}&compid=${this.authService.getcompanyid() ?? ''}`
  );
}

   saveprojectassign(formData: addassign, headers: HttpHeaders): Observable<string> {
  return this.http.post<string>(this.apiBase + '/save-assign-project', formData, { headers });
}
}
