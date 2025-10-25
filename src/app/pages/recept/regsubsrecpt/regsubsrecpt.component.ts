import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService,companyinfo } from '../../../services/auth.service';
import { accountservice,getregularreceive} from '../../../services/accountservice.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-regsubsrecpt',
  templateUrl: './regsubsrecpt.component.html',
  styleUrls: ['./regsubsrecpt.component.css']
})
export class RegsubsrecptComponent {
id!: number;
  paid: getregularreceive = {} as getregularreceive;
   cominfo: companyinfo = {} as companyinfo;
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private accountservice: accountservice,private AuthService:AuthService) {}
ngOnInit(): void {
    // Route থেকে brwId নেওয়া
    this.id = Number(this.route.snapshot.paramMap.get('brwId'));
    console.log('Kisti ID:', this.id);

    if (this.id) {
      this.loadBorrowerData(this.id);
      this.loadcompinfo();

    }
  }


loadBorrowerData(id: number) {
  this.loading = true;
  this.accountservice.getregularsubscriptionreceiveById(id).subscribe({
    next: (res) => {
      if (res && res.length > 0) {
        this.paid = res[0]; // ✅ take first object from array
      }
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

