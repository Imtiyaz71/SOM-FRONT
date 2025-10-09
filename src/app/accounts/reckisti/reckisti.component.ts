import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { kistitypeinfo, KistiService } from '../../services/kisti.service';
import { MemberInfo, MemberService } from '../../services/member.service';
import { addamount, getreceive, accountservice } from '../../services/accountservice.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-reckisti',
  templateUrl: './reckisti.component.html',
  styleUrls: ['./reckisti.component.css']
})
export class ReckistiComponent implements OnInit {

  ktype: kistitypeinfo[] = [];
    mem: MemberInfo[] = [];
  rec: getreceive[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';
 savereckisti: any = {
    typeid: 0, compId: '', memNo: 0, paybleamount: 0, recamount:0,remark: '',
    recmonth: '',recyear:0,transby:'',
  };
  months: string[] = [];
  years: number[] = [];
  selectedMonth: string = '';
  selectedYear: number = new Date().getFullYear();
  constructor(
    private kistiService: KistiService,
     private MemberService: MemberService,
    private authService: AuthService,
    private accountService: accountservice
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }
generateMonths() {
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthIndex = new Date().getMonth();
    this.selectedMonth = this.months[currentMonthIndex];
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      this.years.push(currentYear - i);
    }
  }
  loadUsers() {
  this.generateMonths();
    this.generateYears();
    this.kistiService.getkistitype().subscribe({
      next: (data) => this.ktype = data,
      error: (err) => console.error(err)
    });
      this.MemberService.getmemberinfo().subscribe({
      next: (data) => this.mem = data,
      error: (err) => console.error(err)
    });
       this.accountService.getkistireceive().subscribe({
      next: (data) => this.rec = data,
      error: (err) => console.error(err)
    });
  }
  get filteredRec() {
  if (!this.searchMemNo) return this.rec;
  return this.rec.filter(r =>
    r.memNo.toString().includes(this.searchMemNo)
  );
}
  onTypeChange(id: number) {
  if (id && id != 0) {
    this.kistiService.getkistitypeid(id).subscribe({
      next: data => {

        this.savereckisti.paybleamount = data.amount;


      },
      error: err => console.error(err)
    });
  } else {
    this.savereckisti.paybleamount = 0; // reset if no type selected
  }
}
 kistireceivesave() {
    const formattedDate = this.savereckisti.recdate
    ? format(new Date(this.savereckisti.recdate), 'dd-MMM-yyyy')
    : '';
  const payload: addamount = {
    typeid: this.savereckisti?.typeid || 0,
    compId: this.authService.getcompanyid()??'',
    memNo:  this.savereckisti.memNo|0,
    paybleamount:this.savereckisti.paybleamount|0,
    recamount:this.savereckisti.recamount|0,
    remark:this.savereckisti.remark??'',
      recdate: formattedDate, 
    recmonth:this.savereckisti.recmonth??'',
    recyear:this.savereckisti.recyear|0,
    transby:this.authService.getusername()??''
  };

  const headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + this.authService.getToken()
  );

this.accountService.savekistiamount(payload, headers).subscribe({
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
