import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = environment.apiBaseUrl + '/Menu/parentmenu';

  constructor(private http: HttpClient) {}

  // getParentMenus(): Observable<Menu[]> {
  //   return this.http.get<Menu[]>(this.apiUrl);
  // }
    getChildMenus(roleName: string): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${environment.apiBaseUrl}/Menu/childmenu`, {
      params: { roleName }
    });
  }

}
