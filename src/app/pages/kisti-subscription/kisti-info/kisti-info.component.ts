import { Component, OnInit, NgZone } from '@angular/core';
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

  savekistitype: addkistitype = {
    id: 0,
    typeName: '',
    crid: 0,
    amount: 0,
    createdate: '',
    updatedate: '',
    compId: '',
    projectid: 0
  };

  constructor(
    private KistiService: KistiService,
    private authService: AuthService,
    private ProjectserviceService: ProjectserviceService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  /** 🔹 Load All Data */
  loadInitialData() {
    this.loadCrInfo();
    this.loadKistiType();
    this.loadProjects();
  }

  loadCrInfo() {
    this.KistiService.getcrinfo().subscribe({
      next: data => (this.cr = data || []),
      error: err => console.error('Error loading CR info:', err)
    });
  }

  loadKistiType() {
    this.KistiService.getkistitype().subscribe({
      next: data => {
        this.ktype = data || [];
        console.log('Kisti type loaded:', this.ktype);
      },
      error: err => console.error('Error loading kisti type:', err)
    });
  }

  loadProjects() {
    this.ProjectserviceService.getprojectinfo().subscribe({
      next: data => (this.pro = data || []),
      error: err => console.error('Error loading project info:', err)
    });
  }

  /** 🔍 Search Filter */
  get filteredMembers() {
    if (!this.searchMemNo) return this.ktype;
    return this.ktype.filter(m =>
      m.crname?.toString().toLowerCase().includes(this.searchMemNo.toLowerCase())
    );
  }

  /** ✏️ Edit Button Click */
  OpenMemberEditModel(id?: number) {
    if (!id) return;
    this.KistiService.getkistitypeid(id).subscribe({
      next: data => {
        this.selectedUser = { ...data };
        this.MemberEditModel = true;
      },
      error: err => console.error('Error loading edit data:', err)
    });
  }

  /** ❌ Close Edit Modal */
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
      compId: '',
      projectid: 0
    };
  }

  /** 💾 Save or Update */
  kistytypesave() {
    const isEdit = this.MemberEditModel && this.selectedUser;

    const payload: addkistitype = {
      id: isEdit ? this.selectedUser!.id : 0,
      typeName: isEdit ? this.selectedUser!.typeName : this.savekistitype.typeName,
      crid: isEdit ? this.selectedUser!.crid : this.savekistitype.crid,
      amount: isEdit ? this.selectedUser!.amount : this.savekistitype.amount,
      createdate: new Date().toISOString(),
      updatedate: new Date().toISOString(),
      compId: this.authService.getcompanyid() ?? '',
      projectid: isEdit ? this.selectedUser!.projectid : this.savekistitype.projectid
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    });

    this.KistiService.savekistitype(payload, headers).subscribe({
      next: res => {
        alert(res || 'Data saved successfully');
        this.closeeditmodel();

        // 🟢 small delay to ensure backend commit completes
        setTimeout(() => {
          // force change detection to update list instantly
          this.ngZone.run(() => {
            this.loadInitialData();
          });
        }, 300);
      },
      error: err => {
        console.error('Error saving kisti type:', err);
        alert(err.error?.message || 'Saved');
         this.loadInitialData();
            this.closeeditmodel();
      }
    });
  }
}
