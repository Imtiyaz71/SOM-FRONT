import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { StaffserviceService, StaffDesignation, VW_Response } from '../../../services/staffservice.service';

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.css']
})
export class StaffInfoComponent implements OnInit {
  staffList: StaffDesignation[] = [];
  newDesignation: string = '';
  selectedDesignation: StaffDesignation | null = null;

  constructor(
    private staffService: StaffserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStaffDesignations();
  }

  loadStaffDesignations(): void {

    this.staffService.getStaffDesignations().subscribe({
      next: (res) => {
        this.staffList = res;
      },
      error: (err) => {
        console.error('Failed to load staff designations:', err);
        alert('Failed to load staff designations');
      }
    });
  }

  saveDesignation(): void {
    if (!this.newDesignation.trim()) {
      alert('Please enter a designation');
      return;
    }

    const compId = Number(this.authService.getcompanyid() ?? 0);
    const model: StaffDesignation = {
      id: this.selectedDesignation?.id ?? 0, // 0 for new insert
      compId: compId,
      designation: this.newDesignation
    };

    this.staffService.saveStaffDesignation(model).subscribe({
      next: (res: VW_Response) => {
        alert(res.message);
        if (res.statusCode === 200) {
          this.newDesignation = '';
          this.selectedDesignation = null;
          this.loadStaffDesignations(); // reload list
        }
      },
      error: (err) => {
        console.error('Failed to save designation:', err);
        alert('Server error occurred while saving designation');
      }
    });
  }

  editDesignation(staff: StaffDesignation): void {
    this.selectedDesignation = staff;
    this.newDesignation = staff.designation;
  }
   deleteStaff(id: number) {
    if (!confirm("Are you sure you want to delete this designation?")) return;

    this.staffService.deleteStaffDesignation(id).subscribe({
      next: (res: VW_Response) => {
        alert(res.message);
        if (res.statusCode === 200) this.loadStaffDesignations(); // reload list after delete
      },
      error: (err) => alert("Server error occurred")
    });
  }
}
