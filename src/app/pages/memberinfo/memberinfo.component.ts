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
  page: number = 1;
  itemsPerPage: number = 5;
   searchMemNo: string = '';
  savemem: any = {
    givenName: '', sureName: '', phone: '', email: '',
    NiD: '', BiCNo: '', passportNo: '', nationality: '',
    gender: 0, father: '', mother: '', address: '',
    photo: '', idenDocu: ''
  };

  photoFile: File | null = null;
  idenFile: File | null = null;

  showUserDetailsModal: boolean = false;
  MemberEditModel: boolean = false;
  photoPreview: string | null = null;
  docuPreview: string | null = null;
  apiBaseUrl: string = environment.apiBaseUrl + '/Memb';

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
    this.photoFile = event.target.files[0];
    if (this.photoFile) this.convertFileToBase64(this.photoFile, 'photo');
  }

  onIdenSelected(event: any) {
    this.idenFile = event.target.files[0];
    if (this.idenFile) this.convertFileToBase64(this.idenFile, 'idenDocu');
  }

  private convertFileToBase64(file: File, field: 'photo' | 'idenDocu') {
    const reader = new FileReader();
    reader.onload = () => this.savemem[field] = reader.result as string;
    reader.readAsDataURL(file);
  }
get filteredMembers() {
  if (!this.searchMemNo) return this.mem;
  return this.mem.filter(m => m.memNo.toString().includes(this.searchMemNo));
}
  // ------------------- MODAL METHODS -------------------

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
        this.selectedUser = { ...data };
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

  // ------------------- SAVE METHOD -------------------
saveMember() {
  const payload: MemberAdd = {
    memNo: this.selectedUser?.memNo || 0,
    givenName: this.MemberEditModel ? this.selectedUser!.givenName : this.savemem.givenName,
    sureName: this.MemberEditModel ? this.selectedUser!.sureName : this.savemem.sureName,
    phone: this.MemberEditModel ? this.selectedUser!.phone : this.savemem.phone,
    email: this.MemberEditModel ? this.selectedUser!.email : this.savemem.email,
    niD: this.MemberEditModel ? this.selectedUser!.niD : this.savemem.NiD,
    biCNo: this.MemberEditModel ? this.selectedUser!.biCNo : this.savemem.BiCNo,
    passportNo: this.MemberEditModel ? this.selectedUser!.passportNo : this.savemem.passportNo,
    nationality: this.MemberEditModel ? this.selectedUser!.nationality : this.savemem.nationality,
    gender: Number(this.MemberEditModel ? this.selectedUser!.gender : this.savemem.gender) || 0,
    father: this.MemberEditModel ? this.selectedUser!.father : this.savemem.father,
    mother: this.MemberEditModel ? this.selectedUser!.mother : this.savemem.mother,
    address: this.MemberEditModel ? this.selectedUser!.address : this.savemem.address,
    photo: this.photoFile ? this.savemem.photo : this.selectedUser?.photo || '',
    idenDocu: this.idenFile ? this.savemem.idenDocu : this.selectedUser?.idenDocu || '',
    createDate: this.selectedUser?.createDate || new Date().toISOString(),
    createBy: this.authService.getusername(),
    updateDate: new Date().toISOString()
  };

  const headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + this.authService.getToken()
  );

  this.memberService.savememberdata(payload, headers).subscribe({
    next: res => {
      alert(res?.message || 'Member saved successfully');
      this.loadUsers();
      this.showUserDetailsModal = false;
      this.MemberEditModel = false;
      this.resetForm();
    },
    error: err => {
      console.error('Error payload:', payload);
      alert(err.error?.message || 'Failed to save member');
    }
  });
}


  resetForm() {
    this.savemem = {
      givenName: '', sureName: '', phone: '', email: '',
      NiD: '', BiCNo: '', passportNo: '', nationality: '',
      gender: 0, father: '', mother: '', address: '',
      photo: '', idenDocu: ''
    };
    this.photoFile = null;
    this.idenFile = null;
    this.selectedUser = null;
    this.photoPreview = null;
    this.docuPreview = null;
  }
}
