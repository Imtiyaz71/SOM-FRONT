import { Component, OnInit } from '@angular/core';
import { LoanSension, LoanPaid, LoanPaidHistory, LoanserviceService, VW_Response } from '../../services/loanservice.service';
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

  selectedLoan?: LoanSension;

  paidBy: string = '';
  searchPhone: string = '';

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  paidPageSize = 5;
  currentPaidPage = 1;
  totalPaidPages = 1;

  months: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  years: number[] = [];
  selectedMonth: string = '';
  selectedYear: number = 0;

  constructor(private loanService: LoanserviceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadLoans();
    this.loadLoanPaidHistory();

    this.paidBy = this.authService.getusername() ?? 'unknown';
    const currentYear = new Date().getFullYear();
    for(let i=0;i<=10;i++){ this.years.push(currentYear-i); }
    this.selectedYear = currentYear;
    this.selectedMonth = this.months[new Date().getMonth()];
  }

  loadLoans(): void {
    this.loanService.getLoanSensionDetails().subscribe({
      next: (res) => {
        this.loans = res.sort((a,b)=>new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        this.filterAndPaginate();
      },
      error: (err) => console.error(err)
    });
  }

  loadLoanPaidHistory(): void {
    this.loanService.getLoanPaidHistory().subscribe({
      next: data => {
        this.loanpaid = data.sort((a,b)=>new Date(b.pDate).getTime() - new Date(a.pDate).getTime());
        this.filterAndPaginate();
      },
      error: err => console.error(err)
    });
  }

  filterAndPaginate() {
    const search = this.searchPhone.trim();

    // Loan list
    let filteredLoans = this.loans;
    if(search) filteredLoans = filteredLoans.filter(x => x.phone.includes(search));
    this.totalPages = Math.ceil(filteredLoans.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const loanStart = (this.currentPage - 1) * this.pageSize;
    this.displayedLoans = filteredLoans.slice(loanStart, loanStart + this.pageSize);

    // Paid history
    let filteredPaid = this.loanpaid;
    if(search) filteredPaid = filteredPaid.filter(x => x.phone.includes(search));
    this.totalPaidPages = Math.ceil(filteredPaid.length / this.paidPageSize);
    this.currentPaidPage = Math.min(this.currentPaidPage, this.totalPaidPages || 1);
    const paidStart = (this.currentPaidPage - 1) * this.paidPageSize;
    this.displayedLoanPaid = filteredPaid.slice(paidStart, paidStart + this.paidPageSize);
  }

  nextPage() { if(this.currentPage < this.totalPages){ this.currentPage++; this.filterAndPaginate(); } }
  prevPage() { if(this.currentPage > 1){ this.currentPage--; this.filterAndPaginate(); } }
  nextPaidPage() { if(this.currentPaidPage < this.totalPaidPages){ this.currentPaidPage++; this.filterAndPaginate(); } }
  prevPaidPage() { if(this.currentPaidPage > 1){ this.currentPaidPage--; this.filterAndPaginate(); } }

  onSearch() {
    this.currentPage = 1;
    this.currentPaidPage = 1;
    this.filterAndPaginate();
  }

  saveLoanPayment(): void {
    if(!this.selectedLoan){ alert('Select a loan first'); return; }

    const loanPayment: LoanPaid = {
      id: 0,
      compId: this.authService.getcompanyid(),
      loanId: this.selectedLoan.loanId,
      payble: this.selectedLoan.totalPayableAmount,
      paidAmount: this.selectedLoan.monthlyPrincipal + this.selectedLoan.monthlyInterest,
      principle: this.selectedLoan.monthlyPrincipal,
      interest: this.selectedLoan.monthlyInterest,
      pDate: new Date().toISOString(),
      pMonth: (this.months.indexOf(this.selectedMonth)+1).toString(),
      pYear: this.selectedYear,
      pBy: this.authService.getusername()
    };

    this.loanService.saveLoanPaid(loanPayment).subscribe({
      next: (res: VW_Response) => {
        if(res.statusCode === 200){
          alert('Loan payment saved successfully!');
          this.selectedLoan = undefined;
          this.loadLoans();
          this.loadLoanPaidHistory();
        } else { alert('Error: '+res.message); }
      },
      error: (err) => alert('API Error: '+err.message)
    });
  }
}
