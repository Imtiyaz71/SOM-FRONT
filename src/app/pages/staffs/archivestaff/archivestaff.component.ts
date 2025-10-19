import { Component, OnInit } from '@angular/core';
import { StaffserviceService, VW_ArchiveStaff } from '../../../services/staffservice.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-archivestaff',
  templateUrl: './archivestaff.component.html',
  styleUrls: ['./archivestaff.component.css']
})
export class ArchivestaffComponent implements OnInit {

  archiveStaff: VW_ArchiveStaff[] = [];
  filteredStaff: VW_ArchiveStaff[] = [];
  searchTerm: string = '';
  apiBase = environment.photourl;

  constructor(private staffService: StaffserviceService) { }

  ngOnInit(): void {
    this.loadArchiveStaff();
  }

  loadArchiveStaff() {

    this.staffService.getArchiveStaff().subscribe({
      next: (res: VW_ArchiveStaff[]) => {
        this.archiveStaff = res;
        this.filteredStaff = res; // initially show all
      },
      error: (err) => {
        console.error('Error fetching archive staff:', err);
      }
    });
  }

  // 🔹 Filter by name
  searchStaff() {
    const term = this.searchTerm.toLowerCase();
    this.filteredStaff = this.archiveStaff.filter(s =>
      s.fullName.toLowerCase().includes(term)
    );
  }
}
