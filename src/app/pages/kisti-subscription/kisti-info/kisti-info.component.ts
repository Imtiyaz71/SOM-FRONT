import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { crinfo, kistitypeinfo, addkistitype, KistiService } from '../../../services/kisti.service';
import { ProjectserviceService, projectinfo } from '../../../services/projectservice.service';

@Component({
  selector: 'app-kisti-info',
  templateUrl: './kisti-info.component.html',
  styleUrls: ['./kisti-info.component.css']
})
export class KistiInfoComponent implements OnInit {
  cr: crinfo[] = [];
  ktype: kistitypeinfo[] = [];
  pro: projectinfo[] = [];

  page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';

  MemberEditModel: boolean = false;
  selectedUser: kistitypeinfo | null = null;

  savekistitype: any = {
    id: 0,
    typeName: '',
    crid: 0,
    amount: 0,
    createdate: '',
    updatedate: '',
    projectid: 0
  };

  constructor(
    private KistiService: KistiService,
    private authService: AuthService,
    private ProjectserviceService: ProjectserviceService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.KistiService.getcrinfo().subscribe({
      next: data => (this.cr = data),
      error: err => console.error(err)
    });

    this.KistiService.getkistitype().subscribe({
      next: data => (this.ktype = data),
      error: err => console.error(err)
    });

    this.ProjectserviceService.getprojectinfo().subscribe({
      next: data => (this.pro = data),
      error: err => console.error(err)
    });
  }

  get filteredMembers() {
    if (!this.searchMemNo) return this.ktype;
    return this.ktype.filter(m =>
      m.crname?.toString().toLowerCase().includes(this.searchMemNo.toLowerCase())
    );
  }

  // Edit button click
  OpenMemberEditModel(id?: number) {
    if (!id) return;
    this.KistiService.getkistitypeid(id).subscribe({
      next: data => {
        this.selectedUser = { ...data };
        this.MemberEditModel = true;
      },
      error: err => console.error(err)
    });
  }

  closeeditmodel() {
    this.MemberEditModel = false;
    this.selectedUser = null;
    this.savekistitype = {
      id: 0,
      typeName: '',
      crid: 0,
      amount: 0,
      createdate: '',
      updatedate: '',
      projectid: 0
    };
  }

  // Save or Update
  kistytypesave() {
    const payload: addkistitype = {
      id: this.MemberEditModel ? this.selectedUser!.id : 0,
      typeName: this.MemberEditModel ? this.selectedUser!.typeName : this.savekistitype.typeName,
      crid: this.MemberEditModel ? this.selectedUser!.crid : this.savekistitype.crid,
      amount: this.MemberEditModel ? this.selectedUser!.amount : this.savekistitype.amount,
      createdate: new Date().toISOString(),
      updatedate: new Date().toISOString(),
      compId: this.authService.getcompanyid() ?? '',
      projectid: this.MemberEditModel ? this.selectedUser!.projectid : this.savekistitype.projectid
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.authService.getToken());

    this.KistiService.savekistitype(payload, headers).subscribe({
      next: res => {
        alert(res);
        this.loadUsers();
        this.closeeditmodel();
      },
      error: err => {
        console.error('Error saving kisti type', err);
        alert(err.error?.message || 'Success');
      }
    });
  }
}
