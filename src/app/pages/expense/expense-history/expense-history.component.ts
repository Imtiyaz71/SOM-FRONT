import { Component, OnInit } from '@angular/core';
import { ExpenseserviceService, MonthlyExpense } from '../../../services/expenseservice.service';
import { AuthService } from '../../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-expense-history',
  templateUrl: './expense-history.component.html',
  styleUrls: ['./expense-history.component.css']
})
export class ExpenseHistoryComponent implements OnInit {

  selectedYear?: number = undefined;  // default = all years
  years: number[] = [];
  expenseData: MonthlyExpense[] = [];
  message = '';
  loading = false;

  constructor(
    private ExpenseserviceService: ExpenseserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateYears();
    this.loadMonthlyExpense();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  loadMonthlyExpense() {
    this.loading = true;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    // Pass undefined for all years
    this.ExpenseserviceService.getMonthlyExpense(this.selectedYear)
      .subscribe({
        next: res => {
          this.expenseData = res;
          this.loading = false;
          this.message = res.length === 0 ? 'No expense data found.' : '';
        },
        error: err => {
          console.error(err);
          this.loading = false;
          this.message = 'Error loading expense data ❌';
        }
      });
  }

  // Year filter change
  onYearChange(value: number | string) {
    this.selectedYear = value ? +value : undefined; // convert to number or undefined
    this.loadMonthlyExpense();
  }

  getMonthTotal(exp: MonthlyExpense): number {
    return exp.january + exp.february + exp.march + exp.april + exp.may + exp.june +
           exp.july + exp.august + exp.september + exp.october + exp.november + exp.december;
  }
}
