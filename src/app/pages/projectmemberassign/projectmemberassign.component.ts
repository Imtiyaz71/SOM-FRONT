import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ProjectserviceService, projectinfo, assigninfo, addassign } from '../../services/projectservice.service';
import { AuthService } from '../../services/auth.service';
import { MemberService, MemberInfo } from '../../services/member.service';

declare var bootstrap: any;

@Component({
  selector: 'app-projectmemberassign',
  templateUrl: './projectmemberassign.component.html',
  styleUrls: ['./projectmemberassign.component.css']
})
export class ProjectmemberassignComponent implements OnInit {
  projectList: projectinfo[] = [];
  mem: MemberInfo[] = [];
  assi: assigninfo[] = [];

  page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';

  formData: addassign = {
    id:0,
    projectId: 0,
    memNo: 0,
    assignBy: '',
    compId: this.authService.getcompanyid(),
    amount: 0
  };

  editData: addassign = {
    id:0,
    projectId: 0,
    memNo: 0,
    assignBy: '',
    compId: this.authService.getcompanyid(),
    amount: 0
  };

  constructor(
    private projectService: ProjectserviceService,
    private authService: AuthService,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.loaddata();
  }

  loaddata() {
    this.projectService.getprojectinfo().subscribe(res => this.projectList = res);
    this.projectService.getassigninfo().subscribe(res => this.assi = res);
    this.memberService.getmemberinfo().subscribe(res => this.mem = res);
  }

  get filteredMembers() {
    if (!this.searchMemNo) return this.assi;
    return this.assi.filter(m => m.memNo.toString().includes(this.searchMemNo));
  }

  saveAssign() {
    if (!this.formData.projectId || !this.formData.memNo) {
      alert('Please select both Project and Member!');
      return;
    }

    this.formData.assignBy = this.authService.getusername() ?? '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.projectService.saveprojectassign(this.formData, headers).subscribe({
      next: res => {
        alert('Assignment saved successfully!');
        this.resetForm();
        this.loaddata();
      },
      error: err => {
        console.error(err);
        alert('Failed to save assignment!');
      }
    });
  }

  resetForm() {
    this.formData = {
      id:0,
      projectId: 0,
      memNo: 0,
      assignBy: '',
      compId: this.authService.getcompanyid(),
      amount: 0
    };
  }

  // ---------------- Edit Modal ----------------
  openEditModal(record: any) {
    // Map record fields to editData according to addassign interface
    this.editData = {
      id:record.id,
      projectId: record.projectid,   // map projectid -> projectId
      memNo: record.memNo,
      assignBy: record.assignBy ?? '',
      compId: record.compId ?? this.authService.getcompanyid(),
      amount: record.amount ?? 0
    };

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }

  updateAssign() {
    if (!this.editData.amount || this.editData.amount <= 0) {
      alert('Please enter a valid amount!');
      return;
    }

    this.editData.assignBy = this.authService.getusername() ?? '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.projectService.saveprojectassign(this.editData, headers).subscribe({
      next: res => {
        alert('Assignment updated successfully!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal?.hide();
        this.loaddata();
      },
      error: err => {
        console.error(err);
        alert('Failed to update assignment!');
      }
    });
  }
}
