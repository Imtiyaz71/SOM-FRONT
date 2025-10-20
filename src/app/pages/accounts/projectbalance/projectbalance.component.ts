import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { accountservice,ProjectAccountSummary } from '../../../services/accountservice.service';

@Component({
  selector: 'app-projectbalance',
  templateUrl: './projectbalance.component.html',
  styleUrls: ['./projectbalance.component.css']
})
export class ProjectbalanceComponent implements OnInit {

  summaries: ProjectAccountSummary[] = [];

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private accountservic: accountservice
  ) { }

  ngOnInit(): void {
  this.loadProjectSummaries();
  }

  loadProjectSummaries() {
    this.loading = true;
    this.accountservic.getProjectAccountSummary().subscribe({
      next: (res) => {
        this.summaries = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading project summaries.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
