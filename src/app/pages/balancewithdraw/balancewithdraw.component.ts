import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { projectinfo, assigninfo, ProjectserviceService } from '../../services/projectservice.service';
import {
  BalanceWithdraw,
  BalanceWithdrawAdd,
  VWBounceBalanceWithdrwal,
  accountservice,
  RePayModel,
  VW_Response,
  VW_MemberProjectAccount
} from '../../services/accountservice.service';

@Component({
  selector: 'app-balancewithdraw',
  templateUrl: './balancewithdraw.component.html',
  styleUrls: ['./balancewithdraw.component.css']
})
export class BalancewithdrawComponent implements OnInit {

  memberProjectBalance: number = 0; // Current project balance
  withdrawList: BalanceWithdraw[] = [];
  filteredList: BalanceWithdraw[] = [];

  projects: projectinfo[] = [];
  members: assigninfo[] = [];

  selectedProjectId: number = 0;
  selectedMemberNo: number = 0;

  newWithdraw: BalanceWithdrawAdd = {
    compId: '',
    memNo: 0,
    fProject: 0,
    amount: 0,
    remarks: '',
    wDate: '',
    wMonth: '',
    wYear: new Date().getFullYear(),
    wBy: ''
  };

  // Repay popup
  showRepayPopup: boolean = false;
  repayModel: RePayModel = { compId: 0, memNo: 0, projectId: 0, payble: 0, paid: 0, withdrwalID: 0 };
  repayResponse: VW_Response | null = null;

  message: string = '';
  months: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  years: number[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private accountservice: accountservice,
    private authservice: AuthService,
    private projectservice: ProjectserviceService
  ) { }

  ngOnInit(): void {
    this.loadWithdrawList();
    this.loadProjects();
    this.initYears();
  }

  // ---------------- Load withdraw list ----------------
  loadWithdrawList(): void {
    this.accountservice.getbalancewithdraw().subscribe({
      next: (res: BalanceWithdraw[]) => {
        // Map API projectId to fProject for internal logic
        this.withdrawList = res.map(x => ({ ...x, fProject: x.fProject }));
        this.applyFilter();
      },
      error: (err) => console.error('Error fetching withdraw list:', err)
    });
  }

  // ---------------- Load projects ----------------
  loadProjects(): void {
    this.projectservice.getprojectinfo().subscribe({
      next: (res) => this.projects = res,
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  // ---------------- Project selection ----------------
  onProjectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedProjectId = Number(selectElement.value);
    this.newWithdraw.fProject = this.selectedProjectId;

    if(this.selectedProjectId > 0) {
      this.projectservice.getAssignByPrid(this.selectedProjectId).subscribe({
        next: res => this.members = res,
        error: err => console.error(err)
      });
    } else {
      this.members = [];
    }

    // Reset member selection
    this.selectedMemberNo = 0;
    this.newWithdraw.memNo = 0;

    // Update balance
    this.updateMemberProjectBalance();
    this.applyFilter();
  }

  // ---------------- Member selection ----------------
  onMemberChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMemberNo = Number(selectElement.value);
    this.newWithdraw.memNo = this.selectedMemberNo;

    this.updateMemberProjectBalance();
    this.applyFilter();
  }

  // ---------------- Update member project balance ----------------
  updateMemberProjectBalance(): void {
    if (this.newWithdraw.fProject > 0 && this.newWithdraw.memNo > 0) {
      this.accountservice.getProjectAccountByMemberAndProject(
        Number(this.authservice.getcompanyid()),
        this.newWithdraw.memNo,
        this.newWithdraw.fProject
      ).subscribe({
        next: (res: VW_MemberProjectAccount[]) => {
          if (res.length > 0) {
            this.memberProjectBalance = res[0].amount || 0;
          } else {
            this.memberProjectBalance = 0;
          }
        },
        error: err => console.error('Error fetching project account:', err)
      });
    } else {
      this.memberProjectBalance = 0;
    }
  }

  // ---------------- Check input amount ----------------
  checkAmount(): void {
    if (this.newWithdraw.amount > this.memberProjectBalance) {
      alert('Amount exceeds available balance!');
      this.newWithdraw.amount = this.memberProjectBalance; // reset to max
    }
  }

  // ---------------- Add Withdraw ----------------
  addWithdraw(form: NgForm): void {
    if(this.newWithdraw.amount <= 0){
      alert('Amount must be greater than 0');
      return;
    }

    this.newWithdraw.compId = this.authservice.getcompanyid();
    this.newWithdraw.wBy = this.authservice.getusername();

    this.accountservice.addBalanceWithdraw(this.newWithdraw).subscribe({
      next: (res) => {
        this.message = 'Withdraw added successfully!';
        form.resetForm();
        this.members = [];
        this.newWithdraw = {
          compId: this.newWithdraw.compId,
          memNo: 0,
          fProject: 0,
          amount: 0,
          remarks: '',
          wDate: '',
          wMonth: '',
          wYear: new Date().getFullYear(),
          wBy: ''
        };
        this.memberProjectBalance = 0;
        this.loadWithdrawList();
      },
      error: (err) => {
        console.error('Error adding withdraw:', err);
        this.message = 'Error adding withdraw.';
      }
    });
  }

  // ---------------- Apply Filter ----------------
  applyFilter(): void {
    this.filteredList = this.withdrawList.filter(w => {
      const projectMatch = this.selectedProjectId ? w.fProject === this.selectedProjectId : true;
      const memberMatch = this.selectedMemberNo ? w.memNo === this.selectedMemberNo : true;
      return projectMatch && memberMatch;
    });

    this.totalPages = Math.ceil(this.filteredList.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  // ---------------- Pagination ----------------
  get paginatedWithdraws(): BalanceWithdraw[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ---------------- Bounce Withdraw ----------------
  bounceWithdraw(withdraw: BalanceWithdraw) {
    if (!confirm(`Are you sure you want to bounce this withdraw of BDT ${withdraw.amount}?`)) return;

    const model: VWBounceBalanceWithdrwal = {
      id: withdraw.id,
      fProject: withdraw.fProject,
      memNo: withdraw.memNo,
      compId: Number(this.authservice.getcompanyid())
    };

    this.accountservice.bounceBalanceWithdraw(model).subscribe({
      next: (res) => {
        this.message = 'Withdraw bounced successfully!';
        this.loadWithdrawList();
      },
      error: (err) => {
        console.error('Error bouncing withdraw:', err);
        this.message = 'Error bouncing withdraw.';
      }
    });
  }

  // ---------------- Show Repay Popup ----------------
  openRepayModal(withdraw: BalanceWithdraw) {
    this.repayModel = {
      compId: Number(this.authservice.getcompanyid()),
      memNo: withdraw.memNo,
      projectId: withdraw.fProject,
      payble: withdraw.amount,
      paid: 0,
      withdrwalID: withdraw.id
    };
    this.repayResponse = null;
    this.showRepayPopup = true;
  }

  closeRepayPopup() {
    this.showRepayPopup = false;
  }

  // ---------------- Submit Repay ----------------
  submitRepay() {
    if (this.repayModel.paid <= 0) {
      alert('Paid amount must be greater than 0');
      return;
    }

    this.accountservice.repay(this.repayModel).subscribe({
      next: (res) => {
        this.repayResponse = res;
        this.showRepayPopup = false;
        this.message = res.message;
        this.loadWithdrawList();
      },
      error: (err) => {
        console.error('Error in repay:', err);
        this.message = 'Error in repay transaction.';
      }
    });
  }

  // ---------------- Initialize years ----------------
  initYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }
}
