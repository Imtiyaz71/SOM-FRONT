import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { somityTransection, AccDrCr, accountservice } from '../../../services/accountservice.service';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit  {
transections: somityTransection[] = [];
  filter: AccDrCr = {
    startDate: null,
    endDate: null,
    compId: '',   // 👈 should be number, not string
    crType: 2
  };

  constructor(
    private accountservice: accountservice,
    private authservice: AuthService   // 👈 inject instance properly
  ) {}

  ngOnInit(): void {
    this.loadTransection();
  }

  loadTransection(): void {
    const compId = this.authservice.getcompanyid(); // 👈 use instance method
    this.filter.compId = compId ?? ''; // fallback to 0 if null

    this.accountservice.getSomityTransection(this.filter).subscribe({
      next: (data) => {
        this.transections = data;
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
  }
}
