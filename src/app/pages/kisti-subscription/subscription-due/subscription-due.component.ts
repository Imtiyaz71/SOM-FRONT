import { Component, OnInit } from '@angular/core';
import { SubscriptionService, RegularsubsRecHistory } from '../../../services/subscription.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-subscription-due',
  templateUrl: './subscription-due.component.html',
  styleUrls: ['./subscription-due.component.css']
})
export class SubscriptionDueComponent implements OnInit{

  filteredHistories: RegularsubsRecHistory[] = [];
  loading = false;
  errorMessage = '';
  searchYear: number | null = null;

  constructor(private subscriptionservice: SubscriptionService) {}

  ngOnInit(): void {
    this.loadKistiReceiveHistory();
  }
   loadKistiReceiveHistory(): void {
    this.loading = true;

    this.subscriptionservice.getregularsubscriptionhistory().subscribe({
      next: (res) => {

        this.filteredHistories = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading kisti history:', err);
        this.errorMessage = 'Failed to load data';
        this.loading = false;
      }
    });
  }
  filterByYear(): void {
  const year = this.searchYear ? +this.searchYear : null; // convert to number

  if (year) {
    this.filteredHistories = this.filteredHistories.filter(h => h.year === year);
  } else {
    this.filteredHistories = [...this.filteredHistories];
  }
}

    exportToPDF(): void {
      const doc = new jsPDF();
      doc.text('Kisti Receive History', 14, 10);

      const rows = this.filteredHistories.map(r => [
        r.year,

        r.jan,
        r.feb,
        r.mar,
        r.apr,
        r.may,
        r.jun,
        r.jul,
        r.aug,
        r.sep,
        r.oct,
        r.nov,
        r.dec,
        r.total
      ]);

      autoTable(doc, {
        head: [['Year', 'Project', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total']],
        body: rows,
        startY: 20,
      });

      doc.save('Kisti_Receive_History.pdf');
    }
}
