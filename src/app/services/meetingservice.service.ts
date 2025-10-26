import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface Meeting {
  id?: number;           // optional, backend auto-generates
  compId: number;
  title: string;
  biboroni: string;
  meetingDate: string;   // "26-Oct-2025" format as per backend
  meetingMonth: string;
  meetingYear: number;
}

// Generic response
export interface VW_Response {
  statusCode: number;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class MeetingserviceService {

   private apiBase = environment.apiBaseUrl + '/MeetingCtrl';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
    addMeeting(meeting: Meeting): Observable<VW_Response> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<VW_Response>(
      `${this.apiBase}/add-meeting`,
      meeting,
      { headers }
    );
  }

  // 🔹 Get all meetings for a company
  getMeetings(): Observable<Meeting[]> {
    const compId=this.authService.getcompanyid();
    return this.http.get<Meeting[]>(
      `${this.apiBase}/get-meeting?compId=${compId}`
    );
  }
   getMeetingsById(id:number): Observable<Meeting> {
    const compId=this.authService.getcompanyid();
    return this.http.get<Meeting>(
      `${this.apiBase}/get-meeting?compId=${compId}&id=${id}`
    );
  }
}
