import { Component, OnInit } from '@angular/core';
import { SubscriptionService, KistiRecHistory,KistiRecGroup } from '../../../services/subscription.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-subscription-paid',
  templateUrl: './subscription-paid.component.html',
  styleUrls: ['./subscription-paid.component.css']
})
export class SubscriptionPaidComponent implements OnInit{
 groupedData: KistiRecGroup[] = [];
  filteredHistories: KistiRecHistory[] = [];
  loading = false;
  errorMessage = '';
  searchYear: number | null = null;

  constructor(private subscriptionservice: SubscriptionService) {}

  ngOnInit(): void {
    this.loadKistiReceiveHistory();
  }

  loadKistiReceiveHistory(): void {
    this.loading = true;

    this.subscriptionservice.getsubscriptionreceiveamount().subscribe({
      next: (res) => {
        this.groupedData = this.groupByYear(res);
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

 private groupByYear(data: KistiRecHistory[]): { year: number, projects: KistiRecHistory[] }[] {
  const grouped: { [key: string]: KistiRecHistory[] } = {}; // <-- key type string

  data.forEach(item => {
    const key = item.year.toString(); // convert to string for dictionary key
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  // convert back to numeric year and sort descending
  return Object.keys(grouped).map(year => ({
    year: parseInt(year, 10),
    projects: grouped[year]
  })).sort((a, b) => b.year - a.year);
}


  filterByYear(): void {
    if (!this.searchYear) {
      // show all if no year entered
      this.filteredHistories = this.groupedData.flatMap(g => g.projects);
    } else {
      // filter by specific year
      const found = this.groupedData.find(g => g.year === this.searchYear);
      this.filteredHistories = found ? found.projects : [];
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.text('Kisti Receive History', 14, 10);

    const rows = this.filteredHistories.map(r => [
      r.year,
      r.project,
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
