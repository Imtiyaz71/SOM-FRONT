import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { crinfo,subscriptiontypeinfo, addsubscriptiontype,SubscriptionService} from '../../../services/subscription.service';
import { projectinfo,ProjectserviceService} from '../../../services/projectservice.service';

@Component({
  selector: 'app-subscription-info',
  templateUrl: './subscription-info.component.html',
  styleUrls: ['./subscription-info.component.css']
})
export class SubscriptionInfoComponent implements OnInit  {
    cr: crinfo[] = [];
     pro: projectinfo[] = [];
     stype: subscriptiontypeinfo[] = [];
       page: number = 1;
    itemsPerPage: number = 5;
    searchMemNo: string = '';

    savesubscriptiontype: any = {
      id: 0, TypeName: '', crid: 0, Amount: 0, createdate: '',
      updatedate: '',projectid:0
    };
    selectedUser: subscriptiontypeinfo | null = null;
  MemberEditModel: boolean = false;
 constructor(private subscriptionservice : SubscriptionService, private authService: AuthService,private projectservice:ProjectserviceService) { }
  ngOnInit(): void {

this.loadUsers();
  }
   loadUsers() {
    this.subscriptionservice.getcrinfo().subscribe({
      next: data => this.cr = data,
      error: err => console.error(err)
    });
  this.subscriptionservice.getsubscriptionTypeinfo().subscribe({
      next: data => this.stype = data,
      error: err => console.error(err)
    });
  this.projectservice.getprojectinfo().subscribe({
      next: data => this.pro = data,
      error: err => console.error(err)
    });
  }
    get filteredMembers() {
    if (!this.searchMemNo) return this.stype;
    return this.stype.filter(m => m.crname.toString().includes(this.searchMemNo));
  }
  OpenMemberEditModel(id?: number) {
      if (!id) return;

      this.subscriptionservice.getsubscriptiontypeid(id).subscribe({
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
    subscriptiontypesave() {
    const payload: addsubscriptiontype = {
      id: this.selectedUser?.id || 0,
      typeName:  this.MemberEditModel ? this.selectedUser!.typeName : this.savesubscriptiontype.typeName,
      crid: this.MemberEditModel ? this.selectedUser!.crid : this.savesubscriptiontype.crid,
      amount: this.MemberEditModel ? this.selectedUser!.amount : this.savesubscriptiontype.amount,
      createdate: new Date().toISOString(),
      updatedate: new Date().toISOString(),
      compId:this.authService.getcompanyid()?? '',
      projectid:this.MemberEditModel?this.selectedUser!.projectid:this.savesubscriptiontype.projectid
    };

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    );

  this.subscriptionservice.savesubscriptiontype(payload, headers).subscribe({
    next: res => {
      console.log('Next block hit, res =', res);
      alert(res);
      this.loadUsers();
    },
    error: err => {
      console.error('Error block', err);
        this.loadUsers();
      alert(err.error?.message || 'Success');
      this.closeeditmodel();
    }
  })
  }
}
