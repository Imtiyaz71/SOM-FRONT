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
    compId: this.authService.getcompanyid(),
    accountName: '',
    organization: '',
    accountNo: '',
    branch: '',
    balance: 0,
    createDate: '',
    createBy: ''
  };

  // ============================================================
  // NEW: Account Operation Model (Deposit / Withdraw)
  // ============================================================
opModel: any = {
    compId: this.authService.getcompanyid(), // company id always set
    parentId: null,                           // account select korle set hobe
    tType: 1,                                 // default = Deposit
    amount: null,                             // input field theke user set korbe
    dates: new Date().toISOString().slice(0,10), // ajker date default
    createBy: this.authService.getusername()     // backend user
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
      compId: this.authService.getcompanyid(),
      accountName: item.accountName,
      organization: item.organization,
      accountNo: item.accountNo,
      branch: item.branch,
      balance: item.balance,
      createDate: '',
      createBy: ''
    };

    // NEW: set parentId for operation dropdown auto-select
    this.opModel.parentId = item.id;
  }

  // ===============================
  // Reset Form
  // ===============================
  resetForm() {
    this.savingModel = {
      id: 0,
      compId: this.authService.getcompanyid(),
      accountName: '',
      organization: '',
      accountNo: '',
      branch: '',
      balance: 0,
      createDate: '',
      createBy: ''
    };
  }

  // ============================================================
  // NEW FUNCTION: Save Account Operation (Deposit / Withdraw)
  // ============================================================
  saveAccountOperation() {

    this.opModel.compId = this.authService.getcompanyid();
    this.opModel.createBy = this.authService.getusername();
    this.opModel.dates = new Date().toISOString().slice(0, 10);

    if (!this.opModel.parentId) {
      alert("Please select an account!");
      return;
    }

    if (!this.opModel.amount || this.opModel.amount <= 0) {
      alert("Amount must be greater than 0!");
      return;
    }

    this.financeService.saveAccountOperation(this.opModel).subscribe(res => {
      if (res.status === 1) {
        alert(res.message);
        this.opModel.amount = null;
        this.loadSavingAccounts();
      } else {
        alert("Failed: " + res.message);
      }
    });
  }

}
