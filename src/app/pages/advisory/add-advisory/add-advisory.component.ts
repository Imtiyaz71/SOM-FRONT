import { Component, OnInit } from '@angular/core';
import { AdvisoryService, AdvisoryRole, VW_Response } from '../../../services/advisoryservice.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-advisory',
  templateUrl: './add-advisory.component.html',
  styleUrls: ['./add-advisory.component.css']
})
export class AddAdvisoryComponent implements OnInit {

  advisoryList: AdvisoryRole[] = [];
  newRole: AdvisoryRole = { compId: '', roles: '' };
  message: string = '';
  loading: boolean = false;

  constructor(
    private advisoryService: AdvisoryService,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
    this.newRole.compId = this.authservice.getcompanyid();
    this.loadAdvisoryRoles();
  }

  // 🔹 Get all advisory roles
  loadAdvisoryRoles(): void {
    this.loading = true;
    this.advisoryService.getAdvisoryRoles().subscribe({
      next: (data) => {
        this.advisoryList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching advisory roles:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Add new advisory role
  addRole(): void {
    if (!this.newRole.roles) {
      this.message = 'Please enter a role name.';
      return;
    }

    this.advisoryService.addAdvisoryRole(this.newRole).subscribe({
      next: (res: VW_Response) => {
        this.message = res.message;
        if (res.statusCode === 200) {
          this.newRole.roles = '';
          this.loadAdvisoryRoles(); // refresh list
        }
      },
      error: (err) => {
        console.error('Error adding advisory role:', err);
      }
    });
  }

  // 🔹 Delete advisory role
 deleteRole(id: number): void {
    if (!confirm('Are you sure you want to delete this role?')) return;

    const compId = Number(this.newRole.compId); // already number

    this.advisoryService.deleteAdvisoryRole(compId, id).subscribe({
      next: (res: VW_Response) => {
        this.message = res.message;
        if (res.statusCode === 200) {
        this.loadAdvisoryRoles();
        }
      },
      error: (err) => {
        console.error('Error deleting advisory role:', err);
      }
    });
  }

}
