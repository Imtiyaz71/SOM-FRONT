import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ProjectserviceService, projectinfo, addproject } from '../../services/projectservice.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
})
export class ProjectComponent implements OnInit {
  projectList: projectinfo[] = [];
  directors: any[] = [];
  formData: addproject = {
    id: 0,
    projectId: 0,
    projectName: '',
    proLocation: '',
    budget: 0,
    directorId: 0,
    startDate: '',
    tentitiveEndDate: '',
    compId: this.authService.getcompanyid(),
  };

  constructor(private projectService: ProjectserviceService, private authService: AuthService) {}

  ngOnInit() {
    this.loadProjects();
    this.loadDirectors();
  }

  loadProjects() {
    this.projectService.getprojectinfo().subscribe((res) => {
      this.projectList = res;
    });
  }

  loadDirectors() {
    // Mock director list - replace with your API if available
    this.directors = [
      { directorId: 1, givenName: 'John', sureName: 'Doe' },
      { directorId: 2, givenName: 'Imtiyaz', sureName: 'Uddin' },
    ];
  }

  editProject(p: projectinfo) {
    this.formData = {
      id: 0,
      projectId: p.projectId,
      projectName: p.projectName,
      proLocation: p.proLocation,
      budget: p.budget,
      directorId: p.directorId,
      startDate: p.startDate,
      tentitiveEndDate: p.tentitiveEndDate,
      compId: this.authService.getcompanyid(),
    };
  }

  onSubmit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.projectService.saveproject(this.formData, headers).subscribe({
      next: (result) => {
        alert('Successfully Executed');
        this.loadProjects();
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Error saving project');
      },
    });
  }

  resetForm() {
    this.formData = {
      id: 0,
      projectId: 0,
      projectName: '',
      proLocation: '',
      budget: 0,
      directorId: 0,
      startDate: '',
      tentitiveEndDate: '',
      compId: this.authService.getcompanyid(),
    };
  }
}
