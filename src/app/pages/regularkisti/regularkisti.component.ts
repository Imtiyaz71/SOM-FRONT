import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { subscriptiontypeinfo, regularsubs,SubscriptionService } from '../../services/subscription.service';
import { MemberInfo, MemberService } from '../../services/member.service';
import { addregularsubscription,getregularreceive, accountservice } from '../../services/accountservice.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-regularkisti',
  templateUrl: './regularkisti.component.html',
  styleUrls: ['./regularkisti.component.css']
})
export class RegularkistiComponent implements OnInit {
     rec: getregularreceive[] = [];
      mem: MemberInfo[] = [];


    page: number = 1;
    itemsPerPage: number = 5;
    searchMemNo: string = '';
   savereckisti: any = {
     id:0,compId: '', memNo: 0, paybleamount: 0, recamount:0,recdate:'',
      recmonth: '',recyear:0,transby:''
    };
    amount: number = 0;
    months: string[] = [];
    years: number[] = [];
    selectedMonth: string = '';
    selectedYear: number = new Date().getFullYear();
    constructor(

       private MemberService: MemberService,
      private authService: AuthService,
      private accountService: accountservice,
      private subscriptionservice:SubscriptionService
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

    this.subscriptionservice.getregularsubscription().subscribe({
  next: (data) => {
    console.log('Regular subscription data:', data);
    this.savereckisti.paybleamount = data[0]?.amount ?? 0;
  },
  error: (err) => console.error(err)
});
      this.accountService.getregularsubscriptionreceive().subscribe({
      next: (data) => this.rec = data,
      error: (err) => console.error(err)
    });
       this.MemberService.getmemberinfo().subscribe({
      next: (data) => this.mem = data,
      error: (err) => console.error(err)
    });
  }
  get filteredRec() {
  if (!this.searchMemNo) return this.rec;
  return this.rec.filter(r =>
    r.memNo.toString().includes(this.searchMemNo)
  );
}
kistireceivesave() {
    const formattedDate = this.savereckisti.recdate
    ? format(new Date(this.savereckisti.recdate), 'dd-MMM-yyyy')
    : '';
  const payload: any = {
   id:this.savereckisti.id,
    compId: this.authService.getcompanyid()??'',
    memNo:  this.savereckisti.memNo|0,
    paybleamount:this.savereckisti.paybleamount|0,
    recamount:this.savereckisti.recamount|0,

      recdate: formattedDate,
    recmonth:this.savereckisti.recmonth??'',
    recyear:this.savereckisti.recyear|0,
    trnasBy:this.authService.getusername()??''
  };

  const headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + this.authService.getToken()
  );

this.accountService.saveregularsubscriptionamount(payload, headers).subscribe({
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
