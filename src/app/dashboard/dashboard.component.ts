import { Component, OnInit } from '@angular/core';
import { DashserviceService, DashboardCount } from '../services/dashservice.service';
import { AuthService, companyinfo1, CompanyInfoResponse } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardData: DashboardCount | null = null;
  cominfo: companyinfo1 | null = null;
  loadingDashboard = true;
  loadingCompany = true;
  errorMessage = '';
  photourl: string = '';

  constructor(
    private dashService: DashserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
    this.loadCompanyInfo();
    this.photourl = environment.photourl;
  }

  loadDashboardCounts() {
    this.loadingDashboard = true;
    this.dashService.getDashboardCounts().subscribe({
      next: (res) => {
        this.dashboardData = res;
        this.loadingDashboard = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard counts', err);
        this.errorMessage = 'Failed to load dashboard data.';
        this.loadingDashboard = false;
      }
    });
  }

  loadCompanyInfo() {
    this.loadingCompany = true;
    this.authService.getCompanyInfo1().subscribe({
      next: (res: CompanyInfoResponse) => {
        this.cominfo = res.info;
        this.loadingCompany = false;
      },
      error: (err) => {
        console.error('Error fetching company info', err);
        this.errorMessage = 'Failed to load company info.';
        this.loadingCompany = false;
      }
    });
  }
}
