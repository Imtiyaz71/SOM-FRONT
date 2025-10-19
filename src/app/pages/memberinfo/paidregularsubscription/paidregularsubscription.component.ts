import { Component, OnInit } from '@angular/core';
import { MemberService, VW_MemberRegularReceive } from '../../../services/member.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-paidregularsubscription',
  templateUrl: './paidregularsubscription.component.html',
  styleUrls: ['./paidregularsubscription.component.css']
})
export class PaidregularsubscriptionComponent implements OnInit {
  histories: VW_MemberRegularReceive[] = [];
  groupedData: {
    year: number;
    members: {
      memberName: string;
      records: VW_MemberRegularReceive[];
    }[];
  }[] = [];

  loading = false;
  searchYear: number | null = null;

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadKistiPaidHistory();
  }

  loadKistiPaidHistory(): void {
    this.loading = true;
    this.memberService.getmemberwisesubscriptionamount().subscribe({
      next: (res: VW_MemberRegularReceive[]) => {
        this.histories = res;
        this.groupData();
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  groupData(): void {
    const yearMap: any = {};

    this.histories.forEach((h: VW_MemberRegularReceive) => {
      if (!yearMap[h.recYear]) yearMap[h.recYear] = {};
      const memberKey = h.memberInfo;

      if (!yearMap[h.recYear][memberKey]) {
        yearMap[h.recYear][memberKey] = [];
      }

      yearMap[h.recYear][memberKey].push(h);
    });

    this.groupedData = Object.keys(yearMap)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({
        year: Number(year),
        members: Object.keys(yearMap[year]).map((member) => ({
          memberName: member,
          records: yearMap[year][member]
        }))
      }));
  }

  filterByYear(): void {
    if (!this.searchYear) {
      this.groupData();
    } else {
      const filtered = this.histories.filter(h => h.recYear === this.searchYear);
      this.histories = [...filtered];
      this.groupData();
    }
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    let startY = 20;

    doc.text('Subscription Paid History', 14, startY);
    startY += 10;

    this.groupedData.forEach((yearGroup) => {
      doc.text(`Year: ${yearGroup.year}`, 14, startY);
      startY += 10;

      const rows: any[] = [];

      yearGroup.members.forEach((member) => {
        member.records.forEach((record) => {
          rows.push([
            member.memberName,
            record.jan, record.feb, record.mar, record.apr,
            record.may, record.jun, record.jul, record.aug,
            record.sep, record.oct, record.nov, record.dec,
            record.total
          ]);
        });
      });

      autoTable(doc, {
        head: [['Member', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total']],
        body: rows,
        startY: startY,
        didDrawPage: (data) => {
          startY = (data.cursor?.y ?? startY) + 10;
        }
      });
    });

    doc.save('regular_subscription_Paid_History.pdf');
  }
}
