import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { accountservice, RevenueSummary, RevenueSummary1 } from '../../../services/accountservice.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  selectedYear?: number = undefined;  // default = all years
  years: number[] = [];
  rev: RevenueSummary[] = [];
  revsumm: RevenueSummary1[] = [];
  loading = false;
  message = '';

  constructor(
    private authService: AuthService,
    private accountservic: accountservice
  ) {}

  ngOnInit(): void {
    this.generateYears();
    this.loadRevenue();          // Monthly table
    this.loadRevenueSummary();   // Detailed grouped summary
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  // Load monthly revenue
  loadRevenue() {
    this.loading = true;
    this.accountservic.getRevenue(this.selectedYear)
      .subscribe({
        next: res => {
          this.rev = res;
          this.loading = false;
          this.message = res.length === 0 ? 'No monthly data found.' : '';
        },
        error: err => {
          console.error(err);
          this.loading = false;
          this.message = 'Error loading monthly revenue ❌';
        }
      });
  }

  // Load detailed grouped revenue summary
  loadRevenueSummary() {
    this.loading = true;
    this.accountservic.getRevenueSummary()
      .subscribe({
        next: res => {
          this.revsumm = res;
          this.loading = false;
          if (res.length === 0) this.message = 'No revenue summary data found.';
        },
        error: err => {
          console.error(err);
          this.loading = false;
          this.message = 'Error loading revenue summary ❌';
        }
      });
  }

  // Year filter change
  onYearChange(value: number | string) {
    this.selectedYear = value ? +value : undefined;
    this.loadRevenue();
  }

  // Monthly total for row
  getMonthTotal(exp: RevenueSummary): number {
    return exp.january + exp.february + exp.march + exp.april + exp.may + exp.june +
           exp.july + exp.august + exp.september + exp.october + exp.november + exp.december;
  }

  // Group revsumm by year
  getYearsGroup(): number[] {
    return Array.from(new Set(this.revsumm.map(r => r.years)))
      .filter(y => !this.selectedYear || y === this.selectedYear)
      .sort((a, b) => b - a);
  }

  getMonthsGroup(year: number): string[] {
    return Array.from(new Set(
      this.revsumm.filter(r => r.years === year).map(r => r.months)
    ));
  }

  getDatesGroup(year: number, month: string): string[] {
    return Array.from(new Set(
      this.revsumm.filter(r => r.years === year && r.months === month)
                  .map(r => r.dates)
    ));
  }

  // Get rows for specific year, month, date
  getRows(year: number, month: string, date: string): RevenueSummary1[] {
    return this.revsumm.filter(r => r.years === year && r.months === month && r.dates === date);
  }

  // Color based on AccountBalance vs TotalRevenue
  getBalanceColor(row: RevenueSummary1): string {
    if (row.accountBalance > row.totalRevenue) return 'green';
    if (row.accountBalance < row.totalRevenue) return 'red';
    return 'red'; // Equal also red as per your request
  }
  printPage() {
  const printContents = document.getElementById('revenueHistoryTable')!.outerHTML +
                        document.getElementById('revenueSummaryTable')!.outerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
}
}
