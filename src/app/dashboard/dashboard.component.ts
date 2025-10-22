import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashserviceService, DashboardCount, VW_ReceiveDashboardSummary } from '../services/dashservice.service';
import { AuthService, companyinfo1, CompanyInfoResponse } from '../services/auth.service';
import { accountservice, ProjectAccountSummary } from '../services/accountservice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardData: DashboardCount | null = null;
  dashboardrecsummary: VW_ReceiveDashboardSummary | null = null;
  cominfo: companyinfo1 | null = null;

  prosummary: ProjectAccountSummary[] = [];
  loadingDashboard = true;
  loadingCompany = true;
  errorMessage = '';
  photourl: string = '';

  // Chart data & options
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Budget', backgroundColor: '#42A5F5' },
      { data: [], label: 'Expense', backgroundColor: '#66BB6A' },
      { data: [], label: 'Balance', backgroundColor: '#FFA726' }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Project Account Summary (Budget vs Expense vs Balance)' }
    }
  };

  constructor(
    private dashService: DashserviceService,
    private authService: AuthService,
    private accountservice: accountservice
  ) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
    this.loadCompanyInfo();
    this.loadreceivedashboard();
    this.loadProjectaccountData();
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

  loadreceivedashboard() {
    this.loadingDashboard = true;
    this.dashService.getReceiveDashboardSummary().subscribe({
      next: (res) => {
        this.dashboardrecsummary = res;
        this.loadingDashboard = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard summary', err);
        this.errorMessage = 'Failed to load dashboard summary.';
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

  loadProjectaccountData() {
    this.accountservice.getProjectAccountSummary().subscribe({
      next: data => {
        this.prosummary = data;
        this.updateChartData();
      },
      error: err => console.error(err)
    });
  }

  updateChartData() {
    this.barChartData.labels = this.prosummary.map(p => p.projectName);
    this.barChartData.datasets[0].data = this.prosummary.map(p => p.budget);
    this.barChartData.datasets[1].data = this.prosummary.map(p => p.expense);
    this.barChartData.datasets[2].data = this.prosummary.map(p => p.balance);
  }
}
