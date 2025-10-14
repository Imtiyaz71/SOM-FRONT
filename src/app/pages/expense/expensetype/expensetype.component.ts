import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ExpenseserviceService, expenseType } from '../../../services/expenseservice.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-expensetype',
  templateUrl: './expensetype.component.html',
  styleUrls: ['./expensetype.component.css']
})
export class ExpensetypeComponent implements OnInit {

  expensetypeList: expenseType[] = [];
  model: expenseType = { id: 0, compId: '', typeName: '' };
  message: string = '';

  constructor(
    private expenseService: ExpenseserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadExpenseType();
  }


  loadExpenseType(): void {
    this.expenseService.getexpensetype().subscribe({
      next: (res) => {
        this.expensetypeList = res;
      },
      error: (err) => {
        console.error('Error loading expense types:', err);
      }
    });
  }


saveExpenseType(): void {
  this.model.compId = this.authService.getcompanyid() ?? '';
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  this.expenseService.saveexpensetype(this.model, headers).subscribe({
    next: (res: any) => {
      console.log('Save Response:', res); // debug
      this.message = res;
      alert('Data Save Chanages');
      this.loadExpenseType();
      this.resetForm();
    },
    error: (err) => console.error('Error saving expense type:', err)
  });
}




  editExpenseType(item: expenseType): void {
    this.model = { ...item };
  }

deleteExpenseType(id: number): void {
  if (confirm('Are you sure you want to delete this expense type?')) {
    this.expenseService.deleteexpensetype(id).subscribe({
      next: (res: any) => {
        console.log('Delete Response:', res); // debug
        alert('Deleted successfully');
        this.loadExpenseType();
      },
      error: (err) => console.error('Error deleting expense type:', err)
    });
  }
}


  resetForm(): void {
    this.model = { id: 0, compId: '', typeName: '' };
  }
}
