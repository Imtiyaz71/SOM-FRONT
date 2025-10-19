import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { StaffserviceService, VW_Staff, VW_Response, StaffDesignation } from '../../../services/staffservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  public apiphoto = environment.photourl;
  staffForm!: FormGroup;
  selectedFileBase64: string = '';
  isSubmitting: boolean = false;

  staffList: StaffDesignation[] = []; // dropdown list (designation)
  staffs: VW_Staff[] = [];            // all staff list for table

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public staffService: StaffserviceService // must be public for html
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStaffDesignations();
    this.loadStaffInfo();
  }

  // ---------------- FORM INIT ----------------
  initializeForm(): void {
    this.staffForm = this.fb.group({
      id: [0],
      compId: [this.authService.getcompanyid() ?? 0],
      fullName: ['', Validators.required],
      nId: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullAddress: ['', Validators.required],
      staffType: [0, Validators.required],
      photo: [''],
      createDate: [''],
      updateDate: [''],
      createBy: [this.authService.getusername() ?? '']
    });
  }

  // ---------------- LOAD DROPDOWN ----------------
  loadStaffDesignations(): void {
    this.staffService.getStaffDesignations().subscribe({
      next: (res) => {
        this.staffList = res;
      },
      error: (err) => {
        console.error('❌ Failed to load staff designations:', err);
        alert('Failed to load staff designations');
      }
    });
  }

  // ---------------- LOAD STAFF LIST ----------------
  loadStaffInfo(): void {

    this.staffService.getStaffList().subscribe({
      next: (res) => {
        this.staffs = res;
      },
      error: (err) => {
        console.error('❌ Failed to load staff list:', err);
        alert('Failed to load staff list');
      }
    });
  }

  // ---------------- FILE UPLOAD ----------------
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = (reader.result as string).split(',')[1]; // remove data:image/*;base64,
      };
      reader.readAsDataURL(file);
    }
  }

  // ---------------- SAVE STAFF ----------------
  saveStaff(): void {
    if (this.staffForm.invalid) return;
    this.isSubmitting = true;

    const staff: VW_Staff = {
      ...this.staffForm.value,
      photo: this.selectedFileBase64 || this.staffForm.value.photo
    };

    this.staffService.saveStaff(staff).subscribe({
      next: (res: VW_Response) => {
        this.isSubmitting = false;

        if (res.statusCode === 200) {
          alert(res.message);
          this.resetForm();
          this.loadStaffInfo(); // refresh list
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('An error occurred: ' + err.message);
      }
    });
  }

  // ---------------- EDIT STAFF ----------------
  editStaff(st: VW_Staff): void {
    this.staffForm.patchValue(st);
    this.selectedFileBase64 = ''; // clear previous selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------- DELETE STAFF ----------------
  // deleteStaff(id: number): void {
  //   if (!confirm('Are you sure to delete this staff?')) return;
  //   const compId = this.authService.getcompanyid() ?? 0;

  //   this.staffService.deleteStaffDesignation(id, compId).subscribe({
  //     next: (res: VW_Response) => {
  //       alert(res.message);
  //       this.loadStaffInfo();
  //     },
  //     error: (err) => {
  //       alert('Delete failed: ' + err.message);
  //     }
  //   });
  // }

  // ---------------- RESET FORM ----------------
  resetForm(): void {
    this.staffForm.reset({
      id: 0,
      compId: this.authService.getcompanyid() ?? 0,
      createBy: this.authService.getusername() ?? ''
    });
    this.selectedFileBase64 = '';
  }
}
