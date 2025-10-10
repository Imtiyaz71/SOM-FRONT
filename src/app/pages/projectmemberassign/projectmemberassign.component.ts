import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ProjectserviceService, projectinfo,assigninfo,addassign } from '../../services/projectservice.service';
import { AuthService } from '../../services/auth.service';
import { MemberService, MemberInfo} from '../../services/member.service';

@Component({
  selector: 'app-projectmemberassign',
  templateUrl: './projectmemberassign.component.html',
  styleUrls: ['./projectmemberassign.component.css']
})
export class ProjectmemberassignComponent implements OnInit  {
   projectList: projectinfo[] = [];
   mem: MemberInfo[] = [];
   assi: assigninfo[] = [];
     page: number = 1;
  itemsPerPage: number = 5;
     searchMemNo: string = '';
   formData: addassign = {
     projectId: 0,
     memNo: 0,
     assignBy: '',
     compId: this.authService.getcompanyid(),
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
    this.projectService.getprojectinfo().subscribe((res) => {
      this.projectList = res;
    });
       this.projectService.getassigninfo().subscribe((res) => {
      this.assi = res;
    });
       this.memberService.getmemberinfo().subscribe((res) => {
      this.mem = res;
    });
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
    next: (res) => {
      alert('Assignment saved successfully!');
      this.formData = {
        projectId: 0,
        memNo: 0,
        assignBy: '',
        compId: this.authService.getcompanyid(),
      };
    },
    error: (err) => {
      console.error(err);
      alert('Failed to save assignment!');
    },
  });
}


}
