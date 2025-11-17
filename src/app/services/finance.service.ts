import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {


 private baseUrl =environment.apiBaseUrl + '/FinanceCtrl';

  constructor(private http: HttpClient) {}

  getSavingAccountList(compId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-saving-account?compId=${compId}`);
  }

  saveSavingAccount(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-saving-account`, model);
  }

}
