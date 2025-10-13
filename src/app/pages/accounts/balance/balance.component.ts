import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { getvendor, balancesegment, getbalanceaddhistory,accountservice } from '../../../services/accountservice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare var bootstrap: any; // Bootstrap modal

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
  apiBase:string=environment.apiBaseUrl;
  // Add / Save form model
  savebalsegment: any = {
    id: 0,
    compId: 0,
    vendor: 0,
    amount: 0,
    descri: '',
    createDate: ''
  };

  // Edit modal model
  editSegment: any = {
    id: 0,
    compId: 0,
    vendor: 0,
    amount: 0,
    newAmount: 0,
    descri: '',
    createDate: ''
  };

  constructor(
    private authService: AuthService,
    private accountService: accountservice
  ) {}

  ngOnInit(): void {
    this.loadBalanceData();
  }

  // Load all data: current balance, balance segments, vendors
  loadBalanceData() {
    // Current balance
    this.accountService.getbalance().subscribe({
      next: (data) => this.amount = data[0]?.amount ?? 0,
      error: (err) => console.error('Error fetching balance:', err)
    });

    // Balance segments
    this.accountService.getbalancesegment().subscribe({
      next: (data) => this.bal = data,
      error: (err) => console.error('Error fetching balance segment:', err)
    });

    // Vendors
    this.accountService.getvendor().subscribe({
      next: (data) => this.ven = data,
      error: (err) => console.error('Error fetching vendor:', err)
    });
    //Balance Add History
      this.accountService.getbalanceaddhistory().subscribe({
      next: (data) => this.baladdhis = data,
      error: (err) => console.error('Error fetching vendor:', err)
    });
  }

  // Filter search
  get filteredRec() {
    if (!this.searchMemNo) return this.bal;
    return this.bal.filter(r =>
      r.vType?.toString().toLowerCase().includes(this.searchMemNo.toLowerCase())
    );
  }

  // Save new balance segment
  saveBalanceSegment() {
    const payload = {
      id: this.savebalsegment.id,
      compId: (this.authService.getcompanyid()) || '',
      vendor: Number(this.savebalsegment.vendor) || 0,
      amount: Number(this.savebalsegment.amount) || 0,
      descri: this.savebalsegment.descri ?? '',
      createDate: this.savebalsegment.createDate ?? ''
    };

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    );

    this.accountService.savebalancesegment(payload, headers).subscribe({
      next: (res) => {
        alert(res);
        this.loadBalanceData();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error saving balance segment:', err);
        alert(err.error?.message || ' Save sucess!');
        this.loadBalanceData();
        this.resetForm();
      }
    });
  }

  // Reset add form
  resetForm() {
    this.savebalsegment = {
      id: 0,
      compId: 0,
      vendor: 0,
      amount: 0,
      descri: '',
      createDate: ''
    };
  }

  // Open edit modal
  openEditModal(record: any) {
    this.editSegment = { ...record, newAmount: 0 }; // reset newAmount
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }

  // Update existing record: add new balance only
  updateBalanceSegment() {
    if (!this.editSegment.newAmount || this.editSegment.newAmount <= 0) {
      alert('Please enter a valid amount to add!');
      return;
    }

    const payload = {
      id: this.editSegment.id,
      compId: this.authService.getcompanyid() ?? '',
      vendor: Number(this.editSegment.vendor) || 0,
      amount: Number(this.editSegment.newAmount) || 0, // ONLY new balance
      descri: this.editSegment.descri ?? '',
      createDate: this.editSegment.createDate ?? ''
    };

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    );

    this.accountService.savebalancesegment(payload, headers).subscribe({
      next: (res) => {
        alert('✅ New balance added successfully!');
        this.loadBalanceData(); // refresh table & current balance
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal?.hide(); // close modal
        this.editSegment.newAmount = 0; // reset newAmount
      },
      error: (err) => {
        console.error('Error adding new balance:', err);
        alert(err.error?.message || 'New Balance Added!');
          this.loadBalanceData();
           const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal?.hide();
      }
    });
  }
downloadDepositHistory() {
  // Step 1️⃣: Get company info first
  this.authService.getCompanyInfo().subscribe({
    next: (companyData: any) => {
      const info = companyData?.info;
      const companyName = info?.cName || 'Your Company Name Ltd.';
      const logoUrl = info?.cLogo ? `${this.apiBase}/${info.cLogo}` : ''; // full path build

      // Step 2️⃣: Fetch deposit history after company info
      this.accountService.getbalanceaddhistory().subscribe({
        next: async (data) => {
          if (!data || data.length === 0) {
            alert('No deposit history found!');
            return;
          }

          const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

          // Load logo image if available
          if (logoUrl) {
            try {
              const img = await fetch(logoUrl)
                .then((res) => res.blob())
                .then((blob) => new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
                }));
              doc.addImage(img, 'JPEG', 450, 25, 100, 50); // adjust position/size
            } catch (err) {
              console.warn('Logo load failed:', err);
            }
          }

          // === Header ===
          const reportTitle = 'Deposit History Report';
          const printedDate = new Date().toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(18);
          doc.text(companyName, 40, 40);

          doc.setFontSize(14);
          doc.text(reportTitle, 40, 65);

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`Printed on: ${printedDate}`, 40, 80);

          // === Columns ===
          const columns = ['#', 'Vendor Type', 'Amount (৳)', 'Description', 'Create Date'];

          // === Date fix helper ===
          const parseDate = (val: any): string => {
            if (!val) return '';
            const d = new Date(val);
            if (isNaN(d.getTime())) {
              const fixed = Date.parse(val.replace(/\s+/g, ' ').trim());
              return isNaN(fixed)
                ? val
                : new Date(fixed).toLocaleDateString('en-GB');
            }
            return d.toLocaleDateString('en-GB');
          };

          // === Table rows ===
          const rows = data.map((item: any, index: number) => [
            index + 1,
            item.vType ?? '',
            (item.amount ?? 0).toLocaleString('en-BD', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            item.descri ?? '',
            parseDate(item.adate),
          ]);

          // === Table ===
          autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 100,
            theme: 'grid',
            headStyles: {
              fillColor: [0, 102, 204],
              textColor: 255,
              fontStyle: 'bold',
              halign: 'center',
            },
            bodyStyles: { halign: 'center', fontSize: 10 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { cellPadding: 4 },
          });

          // === Total ===
          const totalAmount = data.reduce((sum: number, item: any) => sum + (item.amount ?? 0), 0);
          const finalY = (doc as any).lastAutoTable.finalY || 110;

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`Total Deposit: ৳ ${totalAmount.toFixed(2)}`, 40, finalY + 30);

          // === Footer ===
          const pageHeight = doc.internal.pageSize.height;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text('Generated by Somity Management System', 40, pageHeight - 20);

          // ✅ Download PDF
          doc.save(`DepositHistory_${new Date().getTime()}.pdf`);
        },
        error: (err) => {
          console.error('Error fetching deposit history:', err);
          alert('Failed to load deposit history.');
        },
      });
    },
    error: (err) => {
      console.error('Error fetching company info:', err);
      alert('Failed to fetch company information.');
    }
  });
}




}
