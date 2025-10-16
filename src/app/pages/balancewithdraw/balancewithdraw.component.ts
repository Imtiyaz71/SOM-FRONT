import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { projectinfo, assigninfo, ProjectserviceService } from '../../services/projectservice.service';
import { BalanceWithdraw, BalanceWithdrawAdd,VWBounceBalanceWithdrwal, accountservice } from '../../services/accountservice.service';

@Component({
  selector: 'app-balancewithdraw',
  templateUrl: './balancewithdraw.component.html',
  styleUrls: ['./balancewithdraw.component.css']
})
export class BalancewithdrawComponent implements OnInit {

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

  message: string = '';
  months: string[] = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  years: number[] = [];

  // pagination
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

  // Load withdraw list
  loadWithdrawList(): void {
    this.accountservice.getbalancewithdraw().subscribe({
      next: (res) => {
        this.withdrawList = res;
        this.applyFilter();
      },
      error: (err) => console.error('Error fetching withdraw list:', err)
    });
  }

  // Load projects
  loadProjects(): void {
    this.projectservice.getprojectinfo().subscribe({
      next: (res) => this.projects = res,
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  // Project selection change
  onProjectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const projectId = Number(selectElement.value);

    this.selectedProjectId = projectId;
    this.newWithdraw.fProject = projectId;

    if (projectId > 0) {
      this.projectservice.getAssignByPrid(projectId).subscribe({
        next: (res) => this.members = res,
        error: (err) => console.error('Error fetching members:', err)
      });
    } else {
      this.members = [];
    }

    this.selectedMemberNo = 0;
    this.newWithdraw.memNo = 0;

    this.applyFilter();
  }

  // Member selection change
  onMemberChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMemberNo = Number(selectElement.value);
    this.newWithdraw.memNo = this.selectedMemberNo;

    this.applyFilter();
  }

  // Initialize years (last 5 years)
  initYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }

  // Add Withdraw
  addWithdraw(form: NgForm): void {
    this.newWithdraw.compId = this.authservice.getcompanyid();
    this.newWithdraw.wBy = this.authservice.getusername();

    this.accountservice.addBalanceWithdraw(this.newWithdraw).subscribe({
      next: (res) => {
        this.message = 'Withdraw added successfully!';
        form.resetForm();
        this.members = [];
        this.newWithdraw = { compId: this.newWithdraw.compId, memNo: 0, fProject: 0, amount: 0, remarks: '', wDate: '', wMonth: '', wYear: new Date().getFullYear(), wBy: '' };
        this.loadWithdrawList();
      },
      error: (err) => {
        console.error('Error adding withdraw:', err);
        this.message = 'Error adding withdraw.';
      }
    });
  }

  // Apply filters
  applyFilter(): void {
    this.filteredList = this.withdrawList.filter(w => {
      const projectMatch = this.selectedProjectId ? w.fProject === this.selectedProjectId : true;
      const memberMatch = this.selectedMemberNo ? w.memNo === this.selectedMemberNo : true;
      return projectMatch && memberMatch;
    });

    this.totalPages = Math.ceil(this.filteredList.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  // Paginated data
  get paginatedWithdraws(): BalanceWithdraw[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Pagination navigation
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Bounce withdraw
  bounceWithdraw(withdraw: BalanceWithdraw) {
    if (!confirm(`Are you sure you want to bounce this withdraw of BDT ${withdraw.amount}?`)) {
      return;
    }

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
}
