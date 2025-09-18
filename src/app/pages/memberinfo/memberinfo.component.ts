import { Component, OnInit } from '@angular/core';
import { MemberService, MemberInfo, MemberAdd, genderinfo } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-memberinfo',
  templateUrl: './memberinfo.component.html',
  styleUrls: ['./memberinfo.component.css']
})
export class MemberinfoComponent implements OnInit {
  mem: MemberInfo[] = [];
  gen: genderinfo[] = [];
  selectedUser: MemberInfo | null = null;

  savemem: any = {
    givenName: '',
    sureName: '',
    phone: '',
    email: '',
    NiD: '',
    BiCNo: '',
    passportNo: '',
    nationality: '',
    gender: 0,
    father: '',
    mother: '',
    address: '',
    photo: '',
    idenDocu: ''
  };

  showUserDetailsModal: boolean = false;
  MemberEditModel: boolean = false;
  photoPreview: string | null = null;
  docuPreview: string | null = null;
  apiBaseUrl: string = environment.apiBaseUrl + '/Memb';

  photoFile: File | null = null;
  idenFile: File | null = null;

  constructor(private memberService: MemberService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.memberService.getmemberinfo().subscribe({
      next: data => this.mem = data,
      error: err => console.error(err)
    });

    this.memberService.getgender().subscribe({
      next: data => this.gen = data,
      error: err => console.error(err)
    });
  }

  onPhotoSelected(event: any) {
    this.photoFile = event.target.files[0] || null;
    if (this.photoFile) this.convertFileToBase64(this.photoFile, 'photo');
  }

  onIdenSelected(event: any) {
    this.idenFile = event.target.files[0] || null;
    if (this.idenFile) this.convertFileToBase64(this.idenFile, 'idenDocu');
  }

  private convertFileToBase64(file: File, field: 'photo' | 'idenDocu') {
    const reader = new FileReader();
    reader.onload = () => {
      this.savemem[field] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  openAddUserModal(memNo?: number) {
    if (!memNo) {
      this.showUserDetailsModal = true;
      this.selectedUser = null;
      this.photoPreview = null;
      this.docuPreview = null;
      return;
    }

    this.memberService.getmemberById(memNo).subscribe({
      next: data => {
        this.selectedUser = data;
        this.photoPreview = `${this.apiBaseUrl}/memberphoto?memno=${data.memNo}`;
        this.docuPreview = `${this.apiBaseUrl}/memberdocument?memno=${data.memNo}`;
        this.showUserDetailsModal = true;
      },
      error: err => console.error(err)
    });
  }

  closeAddUserModal() {
    this.showUserDetailsModal = false;
  }

  OpenMemberEditModel(memNo?: number) {
    if (!memNo) return;

    this.memberService.getmemberById(memNo).subscribe({
      next: data => {
        this.selectedUser = { ...data }; // create copy for editing
        this.photoPreview = `${this.apiBaseUrl}/memberphoto?memno=${data.memNo}`;
        this.docuPreview = `${this.apiBaseUrl}/memberdocument?memno=${data.memNo}`;
        this.MemberEditModel = true;
        this.showUserDetailsModal = false;
      },
      error: err => console.error(err)
    });
  }

  closeeditmodel() {
    this.MemberEditModel = false;
  }

  saveMember() {
    const payload: MemberAdd = {
      memNo: this.selectedUser?.memNo || 0,
      givenName: this.savemem.givenName,
      sureName: this.savemem.sureName,
      phone: this.savemem.phone,
      email: this.savemem.email,
      niD: this.savemem.NiD,
      biCNo: this.savemem.BiCNo,
      passportNo: this.savemem.passportNo,
      nationality: this.savemem.nationality,
      gender: this.savemem.gender,
      father: this.savemem.father,
      mother: this.savemem.mother,
      address: this.savemem.address,
      photo: this.savemem.photo,
      idenDocu: this.savemem.idenDocu,
      createDate: new Date().toISOString(),
      createBy: this.authService.getusername(),
      updateDate: new Date().toISOString()
    };

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.getToken()
    });

    this.memberService.savememberdata(payload, headers).subscribe({
      next: res => {
        console.log('Member saved', res);
        this.loadUsers(); // reload list
        this.showUserDetailsModal = false;
        this.MemberEditModel = false;
        //  this.loadUsers();
      },
      error: err => console.error(err)
    });
  }
}
