import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService,companyinfo } from '../../../../services/auth.service';
import { LoanserviceService,VW_BorrowerLoanInfo } from '../../../../services/loanservice.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-sension',
  templateUrl: './sension.component.html',
  styleUrls: ['./sension.component.css']
})
export class SensionComponent implements OnInit {
  brwId!: number;
  borrower: VW_BorrowerLoanInfo = {} as VW_BorrowerLoanInfo;
   cominfo: companyinfo = {} as companyinfo;
  loading: boolean = false;
  public apiphotourl = `${environment.photourl}`;
  photoUrl: any;
  constructor(private route: ActivatedRoute, private LoanserviceService: LoanserviceService,private AuthService:AuthService) {}

  ngOnInit(): void {
    // Route থেকে brwId নেওয়া
    this.brwId = Number(this.route.snapshot.paramMap.get('brwId'));
    console.log('Borrower ID:', this.brwId);

    if (this.brwId) {
      this.loadBorrowerData(this.brwId);
      this.loadcompinfo();
      this.loadBorrowerPhoto(this.brwId);
    }
  }
loadBorrowerPhoto(brwId: number) {
  const compIdStr = localStorage.getItem('cId');
  if (!compIdStr) {
    console.error('compId is missing');
    return;
  }

  const compId = Number(compIdStr);

  this.LoanserviceService.getBorrowerPhoto(compId, brwId).subscribe({
    next: (res) => {
      const reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = () => {
        this.photoUrl = reader.result;
      };
    },
    error: (err) => {
      console.error('Error loading photo:', err);
      this.photoUrl = null;
    }
  });
}


  loadBorrowerData(brwId: number) {
    this.loading = true;
    this.LoanserviceService.getBorrowerLoanInfoById(brwId).subscribe({
      next: (res) => {
        this.borrower = res;
        this.loading = false;
        console.log('Borrower Data:', this.borrower);
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
