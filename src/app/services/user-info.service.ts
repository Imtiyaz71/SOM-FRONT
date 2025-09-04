import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  photo: string;
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
  id:number
  fullName: string;
  userName: string;
  auth: number;
}
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private basic = environment.apiBaseUrl + '/UserInfo/userbasicinfo';
  private saveUrl = environment.apiBaseUrl + '/UserInfo/savebasicuserinfo';
  private saveEducationUrl = environment.apiBaseUrl + '/UserInfo/saveusereducation';
  private savePhotoUrl = environment.apiBaseUrl + '/UserInfo/uploadphoto';
  private getUserUrl = environment.apiBaseUrl + '/UserInfo/userinfoall';
  private getPhotoUrl = environment.apiBaseUrl + '/UserInfo/userphotobyusername';
  private getauthorizer = environment.apiBaseUrl + '/SelectedValue/authorizerlist';
private saveusermap = environment.apiBaseUrl + '/UserInfo/savemapper';
private getusermap = environment.apiBaseUrl + '/UserInfo/mapdetails';

  constructor(private http: HttpClient) { }

  getuserbasicinfo(): Observable<UserInfoBasic[]> {
    return this.http.get<UserInfoBasic[]>(this.basic);
  }

  getauthorizerdata(): Observable<authorizer[]> {
    return this.http.get<authorizer[]>(this.getauthorizer);
  }
    getusermapdetails(): Observable<MapperDetails[]> {
    return this.http.get<MapperDetails[]>(this.getusermap);
  }
  addUser(user: UserInfoBasic) {
    return this.http.post(this.saveUrl, user, { responseType: 'text' });
  }

  addEducation(edu: UserInfoEducation) {
    return this.http.post(this.saveEducationUrl, edu, { responseType: 'text' });
  }
 SaveMapper(au: Mapper) {
    return this.http.post(this.saveusermap, au, { responseType: 'text' });
  }
  // Updated addPhoto to match backend [FromForm] IFormFile 'file'
  addPhoto(file: File, username: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // <-- must match backend parameter
    formData.append('username', username);
    return this.http.post(this.savePhotoUrl, formData);
  }
editUserInfo(formData: FormData): Observable<any> {
  const url = environment.apiBaseUrl + '/UserInfo/edituserinfo'; // backend API
  return this.http.post(url, formData);
}

  getUserInfoAll(username: string): Observable<any> {
    return this.http.get<any>(`${this.getUserUrl}?Username=${username}`);
  }

  getUserPhotoByUsername(username: string): Observable<string> {
    return this.http.get(`${this.getPhotoUrl}?Username=${username}`, { responseType: 'text' });
  }
}
