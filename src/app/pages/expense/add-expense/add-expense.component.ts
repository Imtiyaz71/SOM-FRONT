import { Component, OnInit } from '@angular/core';
import { ExpenseserviceService, Expense, SaveExpense, expenseType } from '../../../services/expenseservice.service';
import { AuthService } from '../../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
  expTypes: expenseType[] = [];
  expenseList: Expense[] = [];
  pagedExpenses: Expense[] = []; // visible list
  months: string[] = [];
  years: number[] = [];

  // Pagination variables
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  model: SaveExpense = {
    id: 0,
    exType: 0,
    compId: '',  // number type
    amount: 0,
    descri: '',
    eDate: '',
    eMonth: '',
    eBy: '',
    eYear: new Date().getFullYear()
  };

  message = '';
  loading = false;

  constructor(
    private expenseService: ExpenseserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.model.compId = this.authService.getcompanyid() ?? '';
    this.model.eBy = this.authService.getusername() ?? 'Unknown';
    this.loadExpenseTypes();
    this.loadExpenses();
    this.generateMonths();
    this.generateYears();
  }

  loadExpenseTypes() {
    this.expenseService.getexpensetype().subscribe({
      next: res => this.expTypes = res,
      error: err => console.error('Error loading types', err)
    });
  }

  loadExpenses() {
    this.expenseService.getexpense().subscribe({
      next: res => {
        // Sort by latest first
        this.expenseList = res.sort((a,b) => new Date(b.eDate).getTime() - new Date(a.eDate).getTime());
        this.setupPagination();
      },
      error: err => console.error('Error loading expenses', err)
    });
  }

  // Setup pagination
  setupPagination() {
    this.totalPages = Math.ceil(this.expenseList.length / this.pageSize);
    this.changePage(1); // default to page 1
  }

  // Change page
  changePage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedExpenses = this.expenseList.slice(startIndex, endIndex);
  }

  generateMonths() {
    this.months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    this.model.eMonth = this.months[new Date().getMonth()];
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  saveExpense(): void {
    if (!this.model.exType || !this.model.amount || !this.model.eDate) {
      this.message = 'Please fill all required fields!';
      return;
    }

    this.loading = true;
    this.message = '';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.expenseService.saveExpense(this.model, headers).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res === 'Failed to save') {
          this.message = 'Failed to save expense ❌';
        } else {
          this.message = 'Expense saved successfully ✅';
          this.loadExpenses(); // refresh list + pagination
          this.resetForm();
        }
      },
      error: err => {
        this.loading = false;
        this.message = 'Error while saving expense ❌';
        console.error(err);
      }
    });
  }

  resetForm() {
    this.model = {
      id: 0,
      exType: 0,
      compId: this.authService.getcompanyid() ?? '',
      amount: 0,
      descri: '',
      eDate: '',
      eMonth: this.months[new Date().getMonth()],
      eBy: this.authService.getusername() ?? 'Unknown',
      eYear: new Date().getFullYear()
    };
  }
}
