import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashserviceService, DashboardCount, VW_ReceiveDashboardSummary } from '../services/dashservice.service';
import { AuthService, companyinfo1, CompanyInfoResponse } from '../services/auth.service';
import { accountservice, ProjectAccountSummary,RevenueSummary1 } from '../services/accountservice.service';
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
 revsumm: RevenueSummary1[] = [];
  prosummary: ProjectAccountSummary[] = [];
  loadingDashboard = true;
  loadingCompany = true;
  errorMessage = '';
  photourl: string = '';
  loading = false;
  message = '';
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
revenueChartData: ChartConfiguration<'line'>['data'] = {
  labels: [], // X-axis (years)
  datasets: [
    {
      data: [],  // Y-axis (revenue)
      label: 'Revenue',
      borderColor: '#42A5F5',
      fill: false,
      tension: 0.4 // smooth curve
    }
  ]
};

revenueChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Revenue Trend by Year' }
  },
  scales: {
    x: { title: { display: true, text: 'Year' } },
    y: { title: { display: true, text: 'Revenue' } }
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
    this.loadRevenueSummary();
    this.prepareRevenueChart();
    this.photourl = environment.photourl;
  }

getBalanceColor(row: RevenueSummary1): string {
  if (row.accountBalance > row.totalRevenue) return 'green';
  // account balance equal or less than totalRevenue, red
  return 'red';
}
prepareRevenueChart() {
  if (!this.revsumm || this.revsumm.length === 0) return;

  const yearMap = new Map<number, number>();
  this.revsumm.forEach(r => {
    const year = r.years;
    const total = r.totalRevenue ?? 0;
    yearMap.set(year, (yearMap.get(year) ?? 0) + total);
  });

  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);
  this.revenueChartData.labels = sortedYears.map(y => y.toString());
  this.revenueChartData.datasets[0].data = sortedYears.map(y => yearMap.get(y) ?? 0);
}

loadRevenueSummary() {
  this.loading = true;
  this.accountservice.getRevenueSummary()
    .subscribe({
      next: res => {
        this.revsumm = res;
        this.loading = false;
        if (res.length > 0) this.prepareRevenueChart();
      },
      error: err => {
        console.error(err);
        this.loading = false;
        this.message = 'Error loading revenue summary ❌';
      }
    });
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
