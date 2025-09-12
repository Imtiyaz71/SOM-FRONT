import { Component, OnInit } from '@angular/core';
import { MemberService, MemberInfo } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-memberinfo',
  templateUrl: './memberinfo.component.html',
  styleUrls: ['./memberinfo.component.css']
})
export class MemberinfoComponent implements OnInit{
     mem: MemberInfo[] = [];
       selectedUser: MemberInfo | null = null;
      showUserDetailsModal: boolean = false;
      MemberEditModel: boolean = false;
     photoPreview: string | null = null;
       docuPreview: string | null = null;
    apiBaseUrl: string = environment.apiBaseUrl +'/Memb';
   constructor(private MemberService: MemberService, private authService: AuthService) {}

    ngOnInit(): void {

           this.loadUsers() ;
  }
    loadUsers() {
    this.MemberService.getmemberinfo().subscribe({
      next: data => { this.mem = data;
      },
      error: err => console.error(err)
    });
}
openAddUserModal(m: number) {
  this.MemberService.getmemberById(m).subscribe({
      next: (data: MemberInfo) => {
        this.selectedUser = data;
        if (data.memNo) {
          this.photoPreview = `${this.apiBaseUrl}/memberphoto?memno=${data.memNo}`;
       this.docuPreview = `${this.apiBaseUrl}/memberdocument?memno=${data.memNo}`;

        }
      },
      error: (err) => console.error('Error loading user details', err)
    });
  this.showUserDetailsModal = true;
}
  closeAddUserModal() { this.showUserDetailsModal = false; }
 OpenMemberEditModel(m?: number) {
  // যদি undefined বা null হয়, তাহলে return করে দাও
  if (m == null) {
    console.warn('Member No missing!');
    return;
  }

  this.MemberService.getmemberById(m).subscribe({
    next: (data: MemberInfo) => {
      this.selectedUser = data;

      if (data.memNo) {
        this.photoPreview = `${this.apiBaseUrl}/memberphoto?memno=${data.memNo}`;
        this.docuPreview = `${this.apiBaseUrl}/memberdocument?memno=${data.memNo}`;
      }
    },
    error: (err) => console.error('Error loading user details', err)
  });

  this.MemberEditModel = true;
   this.showUserDetailsModal = false;
}
  closeeditmodel() { this.MemberEditModel = false; }
}

