import { Component, OnInit } from '@angular/core';
import { AdvisoryService, AdvisoryRole, VW_AdvisoryList, Advisory, VW_Response } from '../../../services/advisoryservice.service';
import { AuthService } from '../../../services/auth.service';
import { MemberService,MemberInfo } from '../../../services/member.service';
@Component({
  selector: 'app-active-advisory',
  templateUrl: './active-advisory.component.html',
  styleUrls: ['./active-advisory.component.css']
})
export class ActiveAdvisoryComponent implements OnInit {

  advisoryList: VW_AdvisoryList[] = [];
  advisoryrole: AdvisoryRole[] = [];
  mem: MemberInfo[] = [];
  newAdvisory: Advisory = {
    compId: 0,
    memNo: 0,
    adRole: 0,
    validity: '',
    cStatus: 1
  };
  message: string = '';
  loading: boolean = false;

  constructor(
    private advisoryService: AdvisoryService,
    private authService: AuthService,
    private memberservice:MemberService
  ) {}

  ngOnInit(): void {
    // Set company ID automatically
    this.newAdvisory.compId = Number(this.authService.getcompanyid());
    this.loadActiveAdvisoryList();
    this.loadAdvisoryRole();
    this.loadmember();
  }

  // 🔹 Load active advisory list
  loadActiveAdvisoryList(): void {
    this.loading = true;
    this.advisoryService.getActiveAdvisoryList().subscribe({
      next: (data: VW_AdvisoryList[]) => {
        this.advisoryList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching active advisory list:', err);
        this.loading = false;
      }
    });
  }
 loadAdvisoryRole(): void {
    this.loading = true;
    this.advisoryService.getAdvisoryRoles().subscribe({
      next: (data: AdvisoryRole[]) => {
        this.advisoryrole = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching active advisory list:', err);
        this.loading = false;
      }
    });
  }
  loadmember(): void {
    this.loading = true;
    this.memberservice.getmemberinfo().subscribe({
      next: (data: MemberInfo[]) => {
        this.mem = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching active advisory list:', err);
        this.loading = false;
      }
    });
  }
  // 🔹 Add new advisory
  addAdvisory(): void {
    if (!this.newAdvisory.memNo || !this.newAdvisory.adRole || !this.newAdvisory.validity) {
      this.message = 'Please fill all required fields.';
      return;
    }

    this.advisoryService.addAdvisory(this.newAdvisory).subscribe({
      next: (res: VW_Response) => {
        this.message = res.message;
        if (res.statusCode === 200) {
          this.newAdvisory.memNo = 0;
          this.newAdvisory.adRole = 0;
          this.newAdvisory.validity = '';
          this.loadActiveAdvisoryList(); // Refresh list
        }
      },
      error: (err) => {
        console.error('Error adding advisory:', err);
      }
    });
  }
 deactiveRole(id: number): void {
    if (!confirm('Are you sure you want to delete this role?')) return;

    const compId = Number(this.authService.getcompanyid()); // already number

    this.advisoryService.deactiveadvisory(compId, id).subscribe({
      next: (res: VW_Response) => {
        this.message = res.message;
        if (res.statusCode === 200) {
        this.loadActiveAdvisoryList();
        }
      },
      error: (err) => {
        console.error('Error deleting advisory role:', err);
      }
    });
  }
}
