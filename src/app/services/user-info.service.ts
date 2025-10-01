import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface UserInfoBasic {
  id: number;
  fullName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  niD: string | null;
  father: string | null;
  mother: string | null;
  username: string;
  createDate: string | null;
  updateDate: string | null;
}

export interface UserInfoEducation {
  id: number;
  degree: string;
  fieldOfStudy: string;
  schoolName: string;
  startDate: string;
  endDate: string;
  description: string;
  username: string;
  createDate: string | null;
  updateDate: string | null;
}

export interface UserPhoto {
  iD: number;
  photo: string; // base64 string
  username: string;
  createDate: string | null;
  updateDate: string | null;
}

export interface authorizer {
  id: number;
  designation: string;
}

export interface Mapper {
  username: string;
  auth: number;
}

export interface MapperDetails {
  id: number;
  fullName: string;
  userName: string;
  auth: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private comped: string|null=null;

  private basic = environment.apiBaseUrl + '/UserInfo/userbasicinfo?cId=';
  private saveUrl = environment.apiBaseUrl + '/UserInfo/savebasicuserinfo';
  private saveEducationUrl = environment.apiBaseUrl + '/UserInfo/saveusereducation';
  private savePhotoUrl = environment.apiBaseUrl + '/UserInfo/uploadphoto';
  private getUserUrl = environment.apiBaseUrl + '/UserInfo/userinfoall';
  private getPhotoUrl = environment.apiBaseUrl + '/UserInfo/userphotobyusername';
  private getauthorizer = environment.apiBaseUrl + '/SelectedValue/authorizerlist';
  private saveusermap = environment.apiBaseUrl + '/UserInfo/savemapper';
  private getusermap = environment.apiBaseUrl + '/UserInfo/mapdetails';
  private deleteuser = environment.apiBaseUrl + '/UserInfo/delete-userinfo';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.comped = this.authService.getcompanyid();
  }

  // =====================
  // User basic info
  // =====================
getuserbasicinfo(): Observable<UserInfoBasic[]> {
  const cid = this.comped || '0';  // default if null
  return this.http.get<UserInfoBasic[]>(`${environment.apiBaseUrl}/UserInfo/userbasicinfo?cId=${cid}`);
}

  // =====================
  // Authorizer data
  // =====================
  getauthorizerdata(): Observable<authorizer[]> {
    return this.http.get<authorizer[]>(this.getauthorizer);
  }

  // =====================
  // Mapper data
  // =====================
  getusermapdetails(): Observable<MapperDetails[]> {
    return this.http.get<MapperDetails[]>(this.getusermap);
  }

  SaveMapper(au: Mapper) {
    return this.http.post(this.saveusermap, au, { responseType: 'text' });
  }

  // =====================
  // Add / Edit / Delete User
  // =====================
  addUser(user: UserInfoBasic) {
    return this.http.post(this.saveUrl, user, { responseType: 'text' });
  }

  addEducation(edu: UserInfoEducation) {
    return this.http.post(this.saveEducationUrl, edu, { responseType: 'text' });
  }

  deleteUser(username: string, deleteby: string): Observable<any> {
    return this.http.delete(`${this.deleteuser}`, {
      params: { username, deleteby }
    });
  }

  editUserInfo(user: any): Observable<any> {
    const url = environment.apiBaseUrl + '/UserInfo/edituserinfo';
    return this.http.post(url, user);
  }

  // =====================
  // Photo Upload / Fetch
  // =====================
  addPhotoBase64(photo: UserPhoto): Observable<any> {
    return this.http.post(this.savePhotoUrl, photo);
  }

  getUserPhotoByUsername(username: string): Observable<string> {
    return this.http.get(`${this.getPhotoUrl}?Username=${username}`, { responseType: 'text' });
  }

  // =====================
  // Get full user info
  // =====================
  getUserInfoAll(username: string): Observable<any> {
    return this.http.get<any>(`${this.getUserUrl}?Username=${username}`);
  }
}
