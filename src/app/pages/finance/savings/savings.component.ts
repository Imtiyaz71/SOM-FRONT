import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../../services/finance.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css']
})
export class SavingsComponent implements OnInit {

  savingsList: any[] = [];

  // Form model
  savingModel: any = {
    id: 0,
    compId: 21,
    accountName: '',
    organization: '',
    accountNo: '',
    branch: '',
    balance: 0,        // backend ignores
    createDate: '',
    createBy: ''
  };

  // Pagination
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;
  pagedList: any[] = [];

  constructor(
    private financeService: FinanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSavingAccounts();
  }

  // ===============================
  // Load Account List
  // ===============================
  loadSavingAccounts() {
    const compId = Number(this.authService.getcompanyid());
    this.financeService.getSavingAccountList(compId).subscribe(res => {
      if (res.status === 1) {
        this.savingsList = res.data;
        this.setupPagination();
      } else {
        this.savingsList = [];
        this.pagedList = [];
      }
    });
  }

  // ===============================
  // Pagination Setup
  // ===============================
  setupPagination() {
    this.totalPages = Math.ceil(this.savingsList.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedList();
  }

  updatePagedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedList = this.savingsList.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedList();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedList();
    }
  }

  // ===============================
  // Save (Insert / Update)
  // ===============================
  save() {
    this.savingModel.createBy = this.authService.getusername();
    this.savingModel.createDate = new Date().toISOString().slice(0, 10);

    this.financeService.saveSavingAccount(this.savingModel).subscribe(res => {
      if (res.status === 1) {
        alert(res.message);
        this.resetForm();
        this.loadSavingAccounts();
      } else {
        alert("Failed: " + res.message);
      }
    });
  }

  // ===============================
  // Edit Button → Populate Form
  // ===============================
  edit(item: any) {
    this.savingModel = {
      id: item.id,
      compId: 21,
      accountName: item.accountName,
      organization: item.organization,
      accountNo: item.accountNo,
      branch: item.branch,
      balance: item.balance,
      createDate: '',
      createBy: ''
    };
  }

  // ===============================
  // Reset Form
  // ===============================
  resetForm() {
    this.savingModel = {
      id: 0,
      compId: 21,
      accountName: '',
      organization: '',
      accountNo: '',
      branch: '',
      balance: 0,
      createDate: '',
      createBy: ''
    };
  }

}
