import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { crinfo,loantypeinfo, addloantype,LoanserviceService} from '../../services/loanservice.service';

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.css']
})
export class LoanInfoComponent implements OnInit {
  cr: crinfo[] = [];
     ltype: loantypeinfo[] = [];
       page: number = 1;
    itemsPerPage: number = 5;
    searchMemNo: string = '';

    saveloantype: any = {
      id: 0, TypeName: '', crid: 0, Amount: 0, createdate: '',
      updatedate: ''
    };
    selectedUser: loantypeinfo | null = null;
  MemberEditModel: boolean = false;
   constructor(private loantypeservice: LoanserviceService, private authService: AuthService) { }

ngOnInit(): void {
this.loadUsers();
}
 loadUsers() {
    this.loantypeservice.getcrinfo().subscribe({
      next: data => this.cr = data,
      error: err => console.error(err)
    });
  this.loantypeservice.getloantype().subscribe({
      next: data => this.ltype = data,
      error: err => console.error(err)
    });

  }
    get filteredMembers() {
    if (!this.searchMemNo) return this.ltype;
    return this.ltype.filter(m => m.crname.toString().includes(this.searchMemNo));
  }
  OpenMemberEditModel(id?: number) {
    if (!id) return;

    this.loantypeservice.getloantypebyid(id).subscribe({
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
  loantypesave() {
  const payload: addloantype = {
    id: this.selectedUser?.id || 0,
    typeName:  this.MemberEditModel ? this.selectedUser!.typeName : this.saveloantype.typeName,
    crid: this.MemberEditModel ? this.selectedUser!.crid : this.saveloantype.crid,
    amount: this.MemberEditModel ? this.selectedUser!.amount : this.saveloantype.amount,
    createdate: new Date().toISOString(),
    updatedate: new Date().toISOString(),
    compId:this.authService.getcompanyid()?? ''
  };

  const headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + this.authService.getToken()
  );

this.loantypeservice.saveloantype(payload, headers).subscribe({
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
