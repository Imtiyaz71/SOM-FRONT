import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { LoanType, LoanserviceService } from '../../services/loanservice.service';

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.css']
})
export class LoanInfoComponent implements OnInit {

  ltype: LoanType[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';

  selectedLoan: LoanType | null = null;
  isEditMode: boolean = false;

  constructor(
    private loantypeservice: LoanserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
     if (!this.selectedLoan) {
    this.selectedLoan = {id:0, compId:'', typeName:'', interest:0, timePeriodMonths:0, createDate:'', updateDate:'', updateBy:'',delayInterest:0,activityPeriod:0};
  }
  }

  // Load CR info and Loan Types
  loadData() {
    this.loantypeservice.getLoanTypes().subscribe({
      next: data => this.ltype = data,
      error: err => console.error(err)
    });
  }

  // Filter loan types by CR name
  get filteredLoans(): LoanType[] {
    if (!this.searchMemNo) return this.ltype;
    return this.ltype.filter(l =>
      l.compId.toString().includes(this.searchMemNo) ||
      l.typeName.toLowerCase().includes(this.searchMemNo.toLowerCase())
    );
  }

  // Open edit modal
  openEditModal(id?: number) {
    if (!id) return;

    this.loantypeservice.getLoanTypeById(id).subscribe({
      next: data => {
        this.selectedLoan = { ...data };
        this.isEditMode = true;
      },
      error: err => console.error(err)
    });
  }

  // Close modal
  closeEditModal() {
    this.isEditMode = false;
    this.selectedLoan = null;
  }

  // Save or update loan type
  saveLoanType() {
    if (!this.selectedLoan) {
      alert('Please select a loan type.');
      return;
    }

    const payload: LoanType = {
      id: this.selectedLoan.id || 0,
      compId: this.authService.getcompanyid() ?? '',
      typeName: this.selectedLoan.typeName,
      interest: this.selectedLoan.interest || 0,
      timePeriodMonths: this.selectedLoan.timePeriodMonths || 0,
      delayInterest: this.selectedLoan.delayInterest || 0,
      activityPeriod: this.selectedLoan.activityPeriod || 0,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      updateBy: this.authService.getusername() || 'Admin'
    };

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    );

    this.loantypeservice.saveLoanType(payload, headers).subscribe({
      next: res => {
        alert(res);
        this.closeEditModal();
        this.loadData();
      },
      error: err => {
        console.error(err);
        alert(err.error?.message || 'Saved!');
        this.loadData();
      }
    });
  }
}
