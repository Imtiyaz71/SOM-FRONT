import { Component, OnInit } from '@angular/core';
import { LoanSension, LoanserviceService, LoanPaid, VW_Response,LoanPaidHistory } from '../../services/loanservice.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loan-paid',
  templateUrl: './loan-paid.component.html',
  styleUrls: ['./loan-paid.component.css']
})
export class LoanPaidComponent implements OnInit {

  loans: LoanSension[] = [];
  loanpaid: LoanPaidHistory[] = [];
  displayedLoans: LoanSension[] = [];
  displayedLoanPaid: LoanPaidHistory[] = [];
  selectedLoan!: LoanSension;

  paidBy: string = '';

  // Loans pagination
  pageSize: number = 15;
  currentPage: number = 1;
  totalPages: number = 1;

  // LoanPaidHistory pagination
  paidPageSize: number = 5;
  currentPaidPage: number = 1;
  totalPaidPages: number = 1;

  searchPhone: string = '';

  months: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  years: number[] = [];
  selectedMonth: string = '';
  selectedYear: number = 0;

  tempPaidAmount: number = 0;

  constructor(private loanService: LoanserviceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadLoans();
    this.loadLoanPaidHistory();
    const userInfo = (this.authService as any).userinfo ?? { username: 'admin' };
    this.paidBy = userInfo.username;

    const currentYear = new Date().getFullYear();
    for(let i=0;i<=10;i++){ this.years.push(currentYear-i); }
    this.selectedYear = currentYear;
    this.selectedMonth = this.months[new Date().getMonth()];
  }

  loadLoans(): void {
    this.loanService.getLoanSensionDetails().subscribe({
      next: (res) => {
        this.loans = res.sort((a,b)=>new Date(b.sDate).getTime() - new Date(a.sDate).getTime());
        this.displayedLoans = [...this.loans];
        this.totalPages = Math.ceil(this.loans.length / this.pageSize);
        this.setPage(1);
      },
      error: (err) => console.error(err)
    });
  }

  loadLoanPaidHistory(): void {
    this.loanService.getLoanPaidHistory().subscribe({
      next: data => {
        // Sort by pDate descending
        this.loanpaid = data.sort((a,b)=>new Date(b.pDate).getTime() - new Date(a.pDate).getTime());
        this.totalPaidPages = Math.ceil(this.loanpaid.length / this.paidPageSize);
        this.setPaidPage(1);
      },
      error: err => console.error(err)
    });
  }

  // Loans pagination
  setPage(page: number) {
    if(page<1) page=1;
    if(page>this.totalPages) page=this.totalPages;
    this.currentPage = page;
    const start = (page-1)*this.pageSize;
    const end = start + this.pageSize;
    this.displayedLoans = this.loans.slice(start,end);
  }
  nextPage() { if(this.currentPage<this.totalPages) this.setPage(this.currentPage+1); }
  prevPage() { if(this.currentPage>1) this.setPage(this.currentPage-1); }

  // LoanPaidHistory pagination
  setPaidPage(page: number) {
    if(page<1) page=1;
    if(page>this.totalPaidPages) page=this.totalPaidPages;
    this.currentPaidPage = page;
    const start = (page-1)*this.paidPageSize;
    const end = start + this.paidPageSize;
    this.displayedLoanPaid = this.loanpaid.slice(start,end);
  }
  nextPaidPage() { if(this.currentPaidPage<this.totalPaidPages) this.setPaidPage(this.currentPaidPage+1); }
  prevPaidPage() { if(this.currentPaidPage>1) this.setPaidPage(this.currentPaidPage-1); }

  onSearch() {
    if(this.searchPhone.trim()==='') {
      this.displayedLoans = [...this.loans];
    } else {
      this.displayedLoans = this.loans.filter(x=>x.phone.includes(this.searchPhone.trim()));
    }
    this.totalPages = Math.ceil(this.displayedLoans.length / this.pageSize);
    this.setPage(1);
  }

  saveLoanPayment(): void {
    if(!this.selectedLoan){ alert('Select a loan first'); return; }

    const loanPayment: LoanPaid = {
      id: 0,
      compId: this.selectedLoan.compId,
      loanId: this.selectedLoan.id,
      payble: this.selectedLoan.monthlyPrinciplePayable,
      paidAmount: this.tempPaidAmount || this.selectedLoan.monthlyPrinciplePayable,
      principle: this.selectedLoan.monthlyPrincipal,
      interest: this.selectedLoan.monthWiseInterest,
      pDate: new Date().toISOString(),
      pMonth: (this.months.indexOf(this.selectedMonth)+1).toString(),
      pYear: this.selectedYear,
      pBy: this.paidBy
    };

    this.loanService.saveLoanPaid(loanPayment).subscribe({
      next: (res: VW_Response) => {
        if(res.statusCode === 200){
          alert('Loan payment saved successfully!');
          this.loadLoans();
          this.loadLoanPaidHistory(); // Refresh history
        } else { alert('Error: '+res.message); }
      },
      error: (err) => alert('API Error: '+err.message)
    });
  }

}