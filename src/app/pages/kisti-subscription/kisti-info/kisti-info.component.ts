import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { crinfo,kistitypeinfo, addkistitype,KistiService} from '../../../services/kisti.service';

@Component({
  selector: 'app-kisti-info',
  templateUrl: './kisti-info.component.html',
  styleUrls: ['./kisti-info.component.css']
})
export class KistiInfoComponent implements OnInit {
  cr: crinfo[] = [];
   ktype: kistitypeinfo[] = [];
     page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';

  savekistitype: any = {
    id: 0, TypeName: '', crid: 0, Amount: 0, createdate: '',
    updatedate: ''
  };
  selectedUser: kistitypeinfo | null = null;
MemberEditModel: boolean = false;
 constructor(private KistiService: KistiService, private authService: AuthService) { }
  ngOnInit(): void {
this.loadUsers();

  }
   loadUsers() {
    this.KistiService.getcrinfo().subscribe({
      next: data => this.cr = data,
      error: err => console.error(err)
    });
  this.KistiService.getkistitype().subscribe({
      next: data => this.ktype = data,
      error: err => console.error(err)
    });

  }
    get filteredMembers() {
    if (!this.searchMemNo) return this.ktype;
    return this.ktype.filter(m => m.crname.toString().includes(this.searchMemNo));
  }
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
  }
  kistytypesave() {
  const payload: addkistitype = {
    id: this.selectedUser?.id || 0,
    typeName:  this.MemberEditModel ? this.selectedUser!.typeName : this.savekistitype.typeName,
    crid: this.MemberEditModel ? this.selectedUser!.crid : this.savekistitype.crid,
    amount: this.MemberEditModel ? this.selectedUser!.amount : this.savekistitype.amount,
    createdate: new Date().toISOString(),
    updatedate: new Date().toISOString(),
    compId:this.authService.getcompanyid()?? ''
  };

  const headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + this.authService.getToken()
  );

this.KistiService.savekistitype(payload, headers).subscribe({
  next: res => {
    console.log('Next block hit, res =', res);
    alert(res);
    this.loadUsers();
  },
  error: err => {
    console.error('Error block', err);
      this.loadUsers();
    alert(err.error?.message || 'Success');
  }
})
}

}
