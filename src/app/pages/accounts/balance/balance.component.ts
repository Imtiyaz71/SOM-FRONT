import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
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
  this.accountService.getbalanceaddhistory().subscribe({
    next: (data) => {
      this.baladdhis = data;

      if (!this.baladdhis || this.baladdhis.length === 0) {
        alert('No deposit history found!');
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('💰 Deposit History', 14, 20);

      const columns = [
        { header: '#', dataKey: 'sl' },
        { header: 'Vendor Type', dataKey: 'vType' },
        { header: 'Amount (৳)', dataKey: 'amount' },
        { header: 'Description', dataKey: 'descri' },
        { header: 'Date', dataKey: 'createDate' }
      ];

      const rows = this.baladdhis.map((item, index) => ({
        sl: index + 1,
        vType: item.vType,
        amount: item.amount.toFixed(2),
        descri: item.descri,
        createDate: new Date(item.adate).toLocaleDateString()
      }));

      (doc as any).autoTable({
        head: [columns.map(c => c.header)],
        body: rows.map(r => columns.map(c => r[c.dataKey as keyof typeof r])),
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 10 }
      });

      doc.save('DepositHistory.pdf');
    },
    error: (err) => console.error('Error fetching deposit history:', err)
  });
}

}
