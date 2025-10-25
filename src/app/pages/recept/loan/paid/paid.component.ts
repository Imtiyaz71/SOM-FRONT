import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService,companyinfo } from '../../../../services/auth.service';
import { LoanserviceService,LoanPaidHistory} from '../../../../services/loanservice.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.css']
})
export class PaidComponent {
  loanid!: number;
  paid: LoanPaidHistory = {} as LoanPaidHistory;
   cominfo: companyinfo = {} as companyinfo;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private LoanserviceService: LoanserviceService,private AuthService:AuthService) {}
ngOnInit(): void {
    // Route থেকে brwId নেওয়া
    this.loanid = Number(this.route.snapshot.paramMap.get('brwId'));
    console.log('Borrower ID:', this.loanid);

    if (this.loanid) {
      this.loadBorrowerData(this.loanid);
      this.loadcompinfo();

    }
  }



  loadBorrowerData(loanid: number) {
    this.loading = true;
    this.LoanserviceService.getLoanPaidHistoryByLoanId(loanid).subscribe({
      next: (res) => {
        this.paid = res[0];
        this.loading = false;
        console.log('Borrower Data:', this.paid);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching borrower data:', err);
      }
    });
  }
 loadcompinfo() {
  this.loading = true;
  this.AuthService.getCompanyInfo().subscribe({
    next: (res) => {
      // Service return type companyinfo[] ধরে, কিন্তু backend আসলে object with info property পাঠাচ্ছে
      const temp: any = res; // TypeScript কে ignore করতে বলছি
      this.cominfo = temp.info ?? {} as companyinfo; // null safety
      this.loading = false;
      console.log('Company Data:', this.cominfo);
    },
    error: (err) => {
      this.loading = false;
      console.error('Error fetching company data:', err);
    }
  });
}

printReceipt() {
  const printContents = document.getElementById('receipt-content')?.innerHTML;
  if (!printContents) return;

  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
  window.location.reload(); // Optional, reload to restore Angular bindings
}

}
