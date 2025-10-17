import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MemberBalance, accountservice } from '../../../services/accountservice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-memberbalance',
  templateUrl: './memberbalance.component.html',
  styleUrls: ['./memberbalance.component.css']
})
export class MemberbalanceComponent implements OnInit {
  balances: MemberBalance[] = [];
  groupedBalances: any[] = [];
  filteredBalances: any[] = [];
  searchText: string = ''; // <-- filter input

  constructor(private accountservice: accountservice, private authservice: AuthService) { }

  ngOnInit(): void {
    this.loadBalances();
  }

  loadBalances() {
    this.accountservice.getMemberBalances().subscribe({
      next: (res: any[]) => {
        const map = new Map();
        res.forEach(item => {
          if (!map.has(item.memberInfo)) {
            map.set(item.memberInfo, {
              memberInfo: item.memberInfo,
              totalBalance: item.totalBalance,
              projects: []
            });
          }
          if (item.projectInfo) {
            map.get(item.memberInfo).projects.push({
              projectInfo: item.projectInfo,
              projectBalance: item.projectBalance
            });
          }
        });
        this.groupedBalances = Array.from(map.values());
        this.filteredBalances = this.groupedBalances; // initialize filtered
      },
      error: (err) => console.error(err)
    });
  }

  // Filter method
  filterMembers() {
    const text = this.searchText.toLowerCase();
    this.filteredBalances = this.groupedBalances.filter(member =>
      member.memberInfo.toLowerCase().includes(text)
    );
  }
   downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Member Balance List', 14, 20);

    // Prepare table data
    const tableData: any[] = [];
    this.filteredBalances.forEach((member, i) => {
      member.projects.forEach((project: { projectInfo: any; projectBalance: any; }, j: number) => {
        tableData.push([
          j === 0 ? i + 1 : '',
          j === 0 ? member.memberInfo : '',
          project.projectInfo,
          project.projectBalance,
          j === 0 ? member.totalBalance : ''
        ]);
      });
    });

    autoTable(doc, {
      head: [['SL', 'Member', 'Project', 'Project Balance', 'Total Balance']],
      body: tableData,
      startY: 30,
      styles: { halign: 'center' },
      headStyles: { fillColor: [108, 117, 125] },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });

    doc.save('MemberBalance.pdf');
  }
}
