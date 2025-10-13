import { Component, OnInit } from '@angular/core';
import { MemberService, MemberInfo, MemberAdd, genderinfo, membertransfer } from '../../services/member.service';
import { AuthService, companyinfo } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-membertrns',
  templateUrl: './membertrns.component.html',
  styleUrls: ['./membertrns.component.css']
})
export class MembertrnsComponent implements OnInit {
  trans: membertransfer[] = [];
  mem: MemberInfo[] = [];
  gen: genderinfo[] = [];
  selectedUser: MemberInfo | null = null;

  // ✅ এখানে companyinfo single object হিসেবে declare করা হলো
  companyinfo: companyinfo | null = null;

  page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';

  savemem: any = {
    memno: 0, givenName: '', sureName: '', phone: '', email: '',
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

  constructor(private memberService: MemberService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();

    this.authService.getCompanyInfo().subscribe({
      next: (data) => {
        // ✅ যদি server array দেয়, first element নাও
        this.companyinfo = Array.isArray(data) ? data[0] : data;
        console.log(Array.isArray(data) ? data[0] : data);
      },
      error: (err) => console.error(err)
    });
  }

  loadUsers() {
    this.memberService.gettransferlogs().subscribe({
      next: data => this.trans = data,
      error: err => console.error(err)
    });

    this.memberService.getmemberinfo().subscribe({
      next: data => this.mem = data,
      error: err => console.error(err)
    });

    this.memberService.getgender().subscribe({
      next: data => this.gen = data,
      error: err => console.error(err)
    });
  }

  get filteredMembers() {
    if (!this.searchMemNo) return this.trans;
    return this.trans.filter(m => m.memno.toString().includes(this.searchMemNo));
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

  savemembertransfer() {
    const payload: MemberAdd = {
      memNo: this.savemem.memno,
      givenName: this.savemem.givenName,
      sureName: this.savemem.sureName,
      phone: this.savemem.phone,
      email: this.savemem.email,
      niD: this.savemem.NiD,
      biCNo: this.savemem.BiCNo,
      passportNo: this.savemem.passportNo,
      nationality: this.savemem.nationality,
      gender: this.savemem.gender || 1,
      father: this.savemem.father,
      mother: this.savemem.mother,
      address: this.savemem.address,
      photo: this.photoFile ? this.savemem.photo : this.selectedUser?.photo || '',
      idenDocu: this.idenFile ? this.savemem.idenDocu : this.selectedUser?.idenDocu || '',
      createDate: this.selectedUser?.createDate || new Date().toISOString(),
      createBy: this.authService.getusername(),
      updateDate: new Date().toISOString(),
      compId:this.authService.getcompanyid()
    };

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    );

    this.memberService.transferdata(payload, headers).subscribe({
      next: res => {
        alert(res?.message || 'Member transfer successfully');
        this.loadUsers();
      },
      error: err => {
        console.error('Error payload:', payload);
        alert(err.error?.message || 'Failed to save member');
      }
    });
  }

  generatePDF() {
    const doc = new jsPDF('p', 'pt', 'a4');

    // ✅ companyinfo থেকে data নাও
    const company = this.companyinfo;
    const companyName = company?.cName || 'Company Name';
    const companyPhone = company?.cPhone || 'Phone';
    const companyEmail = company?.cEmail || 'info@example.com';
    const companyWebsite = company?.cWebsite || 'website.com';
    const companyAddress = company?.cAddress || 'Address';

    // Header
    doc.setFontSize(14);
    doc.text(companyName, 40, 40);
    doc.setFontSize(10);
    doc.text(`Phone: ${companyPhone}`, 40, 55);
    doc.text(`Email: ${companyEmail}`, 40, 70);
    doc.text(`Website: ${companyWebsite}`, 40, 85);
    doc.text(`Address: ${companyAddress}`, 40, 100);

    // Content table
    autoTable(doc, {
      startY: 130,
      head: [['Member No', 'From', 'To', 'FNid', 'TNid', 'Date']],
      body: this.trans.map(m => [
        m.memno,
        m.fromMember,
        m.toMember,
        m.fromNid,
        m.toNid,
        m.transferDate
      ])
    });

    // Footer
    const totalPages = (doc as any).getNumberOfPages();
    const printDate = new Date().toLocaleString();
    for (let i = 1; i <= totalPages; i++) {
      (doc as any).setPage(i);
      doc.setFontSize(9);
      doc.text(`Printed on: ${printDate}`, 40, doc.internal.pageSize.getHeight() - 20);
      doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.getWidth() - 80, doc.internal.pageSize.getHeight() - 20);
    }

    doc.save('member_transfer.pdf');
  }
}
