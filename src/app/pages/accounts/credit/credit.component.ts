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
  pagedTransection: somityTransection[] = [];
  filter: AccDrCr = {
    startDate: null,
    endDate: null,
    compId: '', // will store company id
    crType: 2
  };

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  totalDebited = 0;

  constructor(
    private accountservice: accountservice,
    private authservice: AuthService   // 👈 inject instance properly
  ) {}

  ngOnInit(): void {
    this.loadTransection();
  }

  loadTransection(): void {
    const compId = this.authservice.getcompanyid();
    this.filter.compId = compId ?? '';

    this.accountservice.getSomityTransection(this.filter).subscribe({
      next: (data) => {
        this.transections = data;

        // Calculate total debited
        this.totalDebited = this.transections.reduce((sum, t) => sum + t.amount, 0);

        // Pagination logic
        this.totalPages = Math.ceil(this.transections.length / this.pageSize);
        this.setPagedData();
      },
      error: (err) => console.error('API error:', err)
    });
  }

  setPagedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedTransection = this.transections.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPagedData();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPagedData();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPagedData();
    }
  }
}
