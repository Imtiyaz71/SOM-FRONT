import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { getvendor, balancesegment, getbalanceaddhistory, accountservice } from '../../../services/accountservice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare var bootstrap: any;

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  ven: getvendor[] = [];
  bal: balancesegment[] = [];
  baladdhis: getbalanceaddhistory[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';
  amount: number = 0;
  apiBase: string = environment.apiBaseUrl;

  savebalsegment = { id: 0, compId: 0, vendor: 0, amount: 0, descri: '', createDate: '' };
  editSegment = { id: 0, compId: 0, vendor: 0, amount: 0, newAmount: 0, descri: '', createDate: '' };

  constructor(private authService: AuthService, private accountService: accountservice) {}

  ngOnInit(): void {
    this.loadBalanceData();
  }

  loadBalanceData(): void {
    // Fetch current balance
    this.accountService.getbalance().subscribe({
      next: (data) => this.amount = data?.[0]?.amount ?? 0,
      error: (err) => console.error('❌ Error fetching balance:', err)
    });

    // Fetch balance segments
    this.accountService.getbalancesegment().subscribe({
      next: (data) => this.bal = data.sort((a, b) => b.id - a.id), // latest first
      error: (err) => console.error('❌ Error fetching balance segment:', err)
    });

    // Fetch vendors
    this.accountService.getvendor().subscribe({
      next: (data) => this.ven = data,
      error: (err) => console.error('❌ Error fetching vendor:', err)
    });

    // Fetch deposit history
    this.accountService.getbalanceaddhistory().subscribe({
      next: (data) => this.baladdhis = data,
      error: (err) => console.error('❌ Error fetching add history:', err)
    });
  }

  get filteredRec(): balancesegment[] {
    const keyword = this.searchMemNo?.toLowerCase().trim();
    return keyword
      ? this.bal.filter(r => r.vType?.toLowerCase().includes(keyword))
      : this.bal;
  }

  saveBalanceSegment(): void {
    const payload = {
      id: this.savebalsegment.id,
      compId: this.authService.getcompanyid() ?? '',
      vendor: +this.savebalsegment.vendor,
      amount: +this.savebalsegment.amount,
      descri: this.savebalsegment.descri || '',
      createDate: this.savebalsegment.createDate || ''
    };

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken());

    this.accountService.savebalancesegment(payload, headers).subscribe({
      next: (res) => {
        alert(res || '✅ Saved successfully!');
        this.loadBalanceData();
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Error saving balance:', err);
        alert('Failed to save!');
      }
    });
  }

  resetForm(): void {
    this.savebalsegment = { id: 0, compId: 0, vendor: 0, amount: 0, descri: '', createDate: '' };
  }

  openEditModal(record: any): void {
    this.editSegment = { ...record, newAmount: 0 };
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }

  updateBalanceSegment(): void {
    if (!this.editSegment.newAmount || this.editSegment.newAmount <= 0) {
      alert('⚠️ Please enter a valid amount!');
      return;
    }

    const payload = {
      id: this.editSegment.id,
      compId: this.authService.getcompanyid() ?? '',
      vendor: +this.editSegment.vendor,
      amount: +this.editSegment.newAmount,
      descri: this.editSegment.descri || '',
      createDate: this.editSegment.createDate || ''
    };

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken());

    this.accountService.savebalancesegment(payload, headers).subscribe({
      next: () => {
        alert('✅ Balance updated successfully!');
        this.loadBalanceData();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal?.hide();
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        alert('Failed to update!');
      }
    });
  }

  async downloadDepositHistory() {
    try {
      const companyData = await this.authService.getCompanyInfo().toPromise();
      const info = companyData?.[0];
      const companyName = info?.cName || 'Your Company';
      const logoUrl = info?.cLogo ? `${this.apiBase}/${info.cLogo}` : '';

      const data = await this.accountService.getbalanceaddhistory().toPromise();
      if (!data || !data.length) return alert('No deposit history found.');

      const doc = new jsPDF();
      if (logoUrl) {
        try {
          const img = await fetch(logoUrl)
            .then(res => res.blob())
            .then(blob => new Promise<string>(resolve => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            }));
          doc.addImage(img, 'JPEG', 450, 25, 100, 50);
        } catch (e) { console.warn('Logo load failed', e); }
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(companyName, 40, 40);
      doc.setFontSize(12);
      doc.text('Deposit History Report', 40, 60);
      doc.setFontSize(10);
      doc.text(`Printed on: ${new Date().toLocaleString('en-GB')}`, 40, 75);

      const columns = ['#', 'Vendor Type', 'Amount (৳)', 'Description', 'Date'];
      const rows = data.map((x: any, i: number) => [
        i + 1,
        x.vType,
        x.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 }),
        x.descri || '',
        new Date(x.adate).toLocaleDateString('en-GB')
      ]);

      autoTable(doc, { head: [columns], body: rows, startY: 90, theme: 'grid' });
      const total = data.reduce((a: number, b: any) => a + (b.amount ?? 0), 0);
      const finalY = (doc as any).lastAutoTable.finalY + 30;
      doc.text(`Total: ৳ ${total.toFixed(2)}`, 40, finalY);
      doc.save(`DepositHistory_${Date.now()}.pdf`);
    } catch (err) {
      console.error('❌ PDF generation failed:', err);
      alert('Error generating report!');
    }
  }
}
