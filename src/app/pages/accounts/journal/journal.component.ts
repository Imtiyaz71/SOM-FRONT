import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { accountservice, VW_Journal } from '../../../services/accountservice.service';

interface JournalMonth {
  month: string;
  records: VW_Journal[];
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

interface JournalYear {
  year: number;
  months: JournalMonth[];
}

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {

  journalData: VW_Journal[] = [];
  groupedData: JournalYear[] = [];
  loading: boolean = false;

  yearFilter: number | null = null;
  monthFilter: string = '';

  allMonths = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];
  allYears: number[] = [];

  constructor(private accountService: accountservice, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadJournal();
  }

  loadJournal() {
    this.loading = true;
    this.accountService.getjournal().subscribe({
      next: (res) => {
        this.journalData = res;
        this.initFilters();
        this.groupData();
        this.loading = false;
      },
      error: (err) => {
        console.error("Failed to load journal:", err);
        this.loading = false;
      }
    });
  }

  private initFilters() {
    const yearSet = new Set<number>();
    this.journalData.forEach(j => yearSet.add(j.years));
    this.allYears = Array.from(yearSet).sort((a,b) => b - a); // descending
  }

  private groupData() {
    const yearMap = new Map<number, Map<string, VW_Journal[]>>();

    this.journalData.forEach(j => {
      if (!yearMap.has(j.years)) yearMap.set(j.years, new Map<string, VW_Journal[]>());
      const monthMap = yearMap.get(j.years)!;

      if (!monthMap.has(j.months)) monthMap.set(j.months, []);
      monthMap.get(j.months)!.push(j);
    });

    this.groupedData = [];

    yearMap.forEach((monthMap, year) => {
      const months: JournalMonth[] = [];
      monthMap.forEach((records, month) => {
        const totalDebit = records.reduce((sum, r) => sum + r.debit, 0);
        const totalCredit = records.reduce((sum, r) => sum + r.credit, 0);
        const balance = totalDebit - totalCredit;

        months.push({ month, records, totalDebit, totalCredit, balance });
      });

      months.sort((a, b) => this.allMonths.indexOf(a.month) - this.allMonths.indexOf(b.month));
      this.groupedData.push({ year, months });
    });

    this.groupedData.sort((a, b) => b.year - a.year);
  }

 filteredYears(years: JournalYear[]): JournalYear[] {
  let filtered = years;

  if (this.yearFilter) {
    const yearNum = Number(this.yearFilter); // convert string to number
    filtered = filtered.filter(y => y.year === yearNum);
  }

  filtered = filtered.map(y => ({
    ...y,
    months: this.filteredMonths(y.months)
  })).filter(y => y.months.length > 0);

  return filtered;
}

  filteredMonths(months: JournalMonth[]): JournalMonth[] {
    if (!this.monthFilter) return months;
    return months.filter(m => m.month === this.monthFilter);
  }

}
