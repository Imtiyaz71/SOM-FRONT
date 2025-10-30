import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
export interface Menu {
  id: number;
  menuName: string;
  parentId: number | null;
  menuUrl: string | null;
  sortOrder: number;
  level?: number;
  fullPath?: string;
  children?: Menu[];
}
export interface ParentMenu{
  id:number;
  menuName:string;
  sortOrder:number;
}
export interface ChildMenu{
  id:number;
  parentId:number;
  menuName:string;
  menuUrl:string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = environment.apiBaseUrl + '/Menu';


  constructor(private http: HttpClient,private authservice:AuthService) {}


    getChildMenus(roleName: string): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${environment.apiBaseUrl}/Menu/childmenu`, {
      params: { roleName }
    });
  }
getparentmenu(): Observable<ParentMenu[]> {
  return this.http.get<ParentMenu[]>(
    `${this.apiUrl}/parentmenu?compId=${this.authservice.getcompanyid() ?? ''}`
  );

}
getchildmenu2(parentId:number): Observable<ChildMenu[]> {
  return this.http.get<ChildMenu[]>(
    `${this.apiUrl}/get-child-menus-byrole?compId=${this.authservice.getcompanyid() ?? ''}&parentId=${parentId}&roleName=${this.authservice.getRole()}`
  );

}
}
