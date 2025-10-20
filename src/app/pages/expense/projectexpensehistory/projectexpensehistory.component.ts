import { Component, OnInit } from '@angular/core';
import { ExpenseserviceService, ProjectWiseExpense } from '../../../services/expenseservice.service';
import { AuthService } from '../../../services/auth.service';

interface ProjectGroup {
  projectName: string;
  expenses: ProjectWiseExpense[];
  totalAmount: number;
  expanded: boolean;
}

interface MonthGroup {
  month: string;
  projects: ProjectGroup[];
  totalAmount: number;
  expanded: boolean;
}

interface YearGroup {
  year: number;
  months: MonthGroup[];
  totalAmount: number;
  expanded: boolean;
}

@Component({
  selector: 'app-projectexpensehistory',
  templateUrl: './projectexpensehistory.component.html',
  styleUrls: ['./projectexpensehistory.component.css']
})
export class ProjectexpensehistoryComponent implements OnInit {

  expenses: ProjectWiseExpense[] = [];
  groupedData: YearGroup[] = [];
  fullTotal = 0;
  loading = false;
  errorMessage = '';

  constructor(
    private expenseService: ExpenseserviceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.loading = true;
    const compId = this.authService.getcompanyid();
    if (!compId) {
      this.errorMessage = 'Company ID not found';
      this.loading = false;
      return;
    }

    this.expenseService.getProjectExpenses().subscribe({
      next: (res) => {
        this.expenses = res;
        this.groupData();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load project expenses.';
        this.loading = false;
      }
    });
  }

  groupData() {
    const yearMap: Map<number, MonthGroup[]> = new Map();
    this.fullTotal = 0;

    this.expenses.forEach(exp => {
      this.fullTotal += Number(exp.amount);

      const year = Number(exp.eYear);
      if (!yearMap.has(year)) yearMap.set(year, []);
      const monthGroups = yearMap.get(year)!;

      let monthGroup = monthGroups.find(m => m.month === exp.eMonth);
      if (!monthGroup) {
        monthGroup = { month: exp.eMonth || '', projects: [], totalAmount: 0, expanded: true };
        monthGroups.push(monthGroup);
      }

      monthGroup.totalAmount += Number(exp.amount);

      let projectGroup = monthGroup.projects.find(p => p.projectName === (exp.projectInfo || ''));
      if (!projectGroup) {
        projectGroup = { projectName: exp.projectInfo || '', expenses: [], totalAmount: 0, expanded: true };
        monthGroup.projects.push(projectGroup);
      }

      projectGroup.expenses.push(exp);
      projectGroup.totalAmount += Number(exp.amount);
    });

    this.groupedData = Array.from(yearMap.entries())
      .map(([year, months]) => {
        const yearTotal = months.reduce((sum, m) => sum + m.totalAmount, 0);
        return { year, months, totalAmount: yearTotal, expanded: true };
      })
      .sort((a, b) => b.year - a.year);
  }

  toggleYear(yearGroup: YearGroup) {
    yearGroup.expanded = !yearGroup.expanded;
  }

  toggleMonth(monthGroup: MonthGroup) {
    monthGroup.expanded = !monthGroup.expanded;
  }

  toggleProject(projectGroup: ProjectGroup) {
    projectGroup.expanded = !projectGroup.expanded;
  }

}
