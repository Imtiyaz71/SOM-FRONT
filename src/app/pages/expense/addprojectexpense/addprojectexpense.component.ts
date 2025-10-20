import { Component, OnInit } from '@angular/core';
import { ExpenseserviceService, VW_Response, ProjectWiseExpense } from '../../../services/expenseservice.service';
import { AuthService } from '../../../services/auth.service';
import { projectinfo,ProjectserviceService } from '../../../services/projectservice.service';

@Component({
  selector: 'app-addprojectexpense',
  templateUrl: './addprojectexpense.component.html',
  styleUrls: ['./addprojectexpense.component.css']
})
export class AddprojectexpenseComponent implements OnInit {

  expenses: ProjectWiseExpense[] = [];

  project: projectinfo[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  months: string[] = [];
  years: number[] = [];
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  // Form model
  newExpense: ProjectWiseExpense = {
    id: 0,
    compId: '',
    projectId: 0,
    purpose: '',
    amount: 0,
    eDate: '',
    eMonth: '',
    eYear: 0,
    eBy: ''
  };

  constructor(
    private expenseService: ExpenseserviceService,
    private authService: AuthService,
    private projectservice:ProjectserviceService
  ) { }

  ngOnInit(): void {
    // Load existing expenses
    this.loadExpenses();
    this.loadproject();
    this.initMonthsYears();
  }
 initMonthsYears() {
    this.months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let i = 0; i <= 5; i++) {
      this.years.push(currentYear - i);
    }
  }
  // Load all project expenses
  loadExpenses() {
    this.loading = true;
    const compId = this.authService.getcompanyid();
    if (!compId) {
      this.errorMessage = 'Company ID not found.';
      this.loading = false;
      return;
    }

    this.expenseService.getProjectExpenses().subscribe({
      next: (res) => {
        this.expenses = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load project expenses.';
        this.loading = false;
      }
    });

  }
  get pagedExpenses(): ProjectWiseExpense[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.expenses.slice(start, end);
  }

  // Change page
  changePage(page: number) {
    this.currentPage = page;
  }

  // Total pages
  get totalPages(): number[] {
    const pages = Math.ceil(this.expenses.length / this.itemsPerPage);
    return Array(pages).fill(0).map((x, i) => i + 1);
  }
loadproject(){

    this.projectservice.getprojectinfo().subscribe({
      next: (res) => {
        this.project = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load project expenses.';
        this.loading = false;
      }
    });
}
  // Add new expense
  addExpense() {
    const compId = this.authService.getcompanyid();
    if (!compId) {
      this.errorMessage = 'Company ID not found.';
      return;
    }
    this.newExpense.compId = compId;

    // Validate mandatory fields
    if (!this.newExpense.projectId || !this.newExpense.purpose || !this.newExpense.amount || !this.newExpense.eDate) {
      this.errorMessage = 'Please fill all mandatory fields.';
      return;
    }

    // // Set month and year based on date input
    // const dateObj = new Date(this.newExpense.eDate);
    // this.newExpense.eMonth = dateObj.toLocaleString('default', { month: 'long' });
    // this.newExpense.eYear = dateObj.getFullYear();
this.newExpense.eBy=this.authService.getusername();
    this.expenseService.addProjectExpense(this.newExpense).subscribe({
      next: (res: VW_Response) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        // Refresh list
        this.loadExpenses();
        // Reset form
        this.newExpense.projectId = 0;
        this.newExpense.purpose = '';
        this.newExpense.amount = 0;
        this.newExpense.eDate = '';
        this.newExpense.eMonth = '';
        this.newExpense.eYear = 0;
        this.newExpense.eBy = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to add expense.';
        this.successMessage = '';
      }
    });
  }
}
