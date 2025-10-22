import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { VW_LoanSensionRequest, VW_BorrowerLoanInfo, VW_Response, LoanType,LoanserviceService } from '../../services/loanservice.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-loan-due',
  templateUrl: './loan-due.component.html',
  styleUrls: ['./loan-due.component.css']
})
export class LoanDueComponent implements OnInit {

  compId: number = 0;
loantype:LoanType[]=[];
  // Form model
  loanForm: VW_LoanSensionRequest = {
    compId: 0,
    fullName: '',
    phone: '',
    email: '',
    bAddress: '',
    nId: '',
    dob: '',
    father: '',
    mother: '',
    photo: '',
    loanType: 0,
    amount: 0,
    sDate: '',
    sMonth: '',
    sYear: new Date().getFullYear(),
    sBy: ''
  };
months: string[] = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
currentPage: number = 1;
itemsPerPage: number = 5;
totalPages: number = 1;
years: number[] = [];
  // Borrower + Loan list
  borrowerLoans: VW_BorrowerLoanInfo[] = [];

  constructor(private authService: AuthService, private loanService: LoanserviceService) {}

  ngOnInit(): void {

  const compIdStr = this.authService.getcompanyid();
this.loanForm.compId = compIdStr ? +compIdStr : 0;
    // Last 5 years including current
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    this.years.push(currentYear - i);
  }

  // If photo already exists
  if (this.loanForm.photo) {
    this.loanForm.photo = this.loanForm.photo;
  }

  this.loadBorrowerLoans();
  this.loadloantype();
  }

  // Load borrower + loan info
 get pagedBorrowerLoans(): VW_BorrowerLoanInfo[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.borrowerLoans.slice(start, end);
}

loadBorrowerLoans() {
  this.loanService.getBorrowerLoanInfo().subscribe({
    next: (res) => {
      this.borrowerLoans = res;
      this.totalPages = Math.ceil(this.borrowerLoans.length / this.itemsPerPage);
      this.currentPage = 1; // reset page
    },
    error: (err) => {
      console.error(err);
      alert('Failed to load borrower loans.');
    }
  });
}

// pagination controls
goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

nextPage() {
  this.goToPage(this.currentPage + 1);
}

prevPage() {
  this.goToPage(this.currentPage - 1);
}
loadloantype(){
   this.loanService.getLoanTypes().subscribe({
      next: (res) => {
        this.loantype = res;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load borrower loans.');
      }
    });
}
  // Save Loan Sension
  saveLoanSension() {
    // Add transaction by from authService if needed
    this.loanForm.sBy = this.authService.getusername() ?? 'Unknown';

    this.loanService.saveLoanSension(this.loanForm).subscribe({
      next: (res: VW_Response) => {
        if (res.statusCode === 1) {
          alert(res.message);
          this.loadBorrowerLoans(); // Refresh table
          this.resetForm();
        } else {
          alert('Failed: ' + res.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error while saving loan sension.');
      }
    });
  }
onPhotoSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.loanForm.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
  // Reset form after success
  resetForm() {
    this.loanForm = {
      compId: this.compId,
      fullName: '',
      phone: '',
      email: '',
      bAddress: '',
      nId: '',
      dob: '',
      father: '',
      mother: '',
      photo: '',
      loanType: 0,
      amount: 0,
      sDate: '',
      sMonth: '',
      sYear: new Date().getFullYear(),
      sBy: ''
    };
  }
}
