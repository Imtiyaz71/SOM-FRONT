import { Component, OnInit } from '@angular/core';
import { MemberService, VW_ProjectWiseMemberReceive } from '../../../services/member.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-paidkisti',
  templateUrl: './paidkisti.component.html',
  styleUrls: ['./paidkisti.component.css']
})
export class PaidkistiComponent implements OnInit {

  histories: VW_ProjectWiseMemberReceive[] = [];
  groupedData: {
    year: number;
    members: {
      memberName: string;
      projects: {
        projectName: string;
        types: {
          typeName: string;
          records: VW_ProjectWiseMemberReceive[];
        }[];
      }[];
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
    this.memberService.getmemberwisekistireceiveamount().subscribe({
      next: (res: VW_ProjectWiseMemberReceive[]) => {
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

    this.histories.forEach((h: VW_ProjectWiseMemberReceive) => {
      if (!yearMap[h.recYear]) yearMap[h.recYear] = {};
      const memberKey = h.memberInfo;
      if (!yearMap[h.recYear][memberKey]) yearMap[h.recYear][memberKey] = {};
      const projectKey = h.projectInfo;
      if (!yearMap[h.recYear][memberKey][projectKey]) yearMap[h.recYear][memberKey][projectKey] = {};
      const typeKey = h.typeName;
      if (!yearMap[h.recYear][memberKey][projectKey][typeKey]) {
        yearMap[h.recYear][memberKey][projectKey][typeKey] = [];
      }
      yearMap[h.recYear][memberKey][projectKey][typeKey].push(h);
    });

    this.groupedData = Object.keys(yearMap).sort((a,b) => Number(b)-Number(a)).map(year => ({
      year: Number(year),
      members: Object.keys(yearMap[year]).map(member => ({
        memberName: member,
        projects: Object.keys(yearMap[year][member]).map(project => ({
          projectName: project,
          types: Object.keys(yearMap[year][member][project]).map(type => ({
            typeName: type,
            records: yearMap[year][member][project][type]
          }))
        }))
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

  doc.text('Kisti Paid History', 14, startY);
  startY += 10;

  this.groupedData.forEach((yearGroup) => {
    doc.text(`Year: ${yearGroup.year}`, 14, startY);
    startY += 10;

    const rows: any[] = [];

    yearGroup.members.forEach((member) => {
      member.projects.forEach((project) => {
        project.types.forEach((type) => {
          type.records.forEach((record) => {
            rows.push([
              member.memberName,
              project.projectName,
              type.typeName,
              record.jan, record.feb, record.mar, record.apr,
              record.may, record.jun, record.jul, record.aug,
              record.sep, record.oct, record.nov, record.dec,
              record.total
            ]);
          });
        });
      });
    });

    // Use startY and didDrawPage to track last Y
  autoTable(doc, {
  head: [['Member', 'Project', 'Type', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Total']],
  body: rows,
  startY: startY,
  didDrawPage: (data) => {
    // optional chaining + fallback
    startY = (data.cursor?.y ?? startY) + 10;
  }
});
  });

  doc.save('Kisti_Paid_History.pdf');
}


}
