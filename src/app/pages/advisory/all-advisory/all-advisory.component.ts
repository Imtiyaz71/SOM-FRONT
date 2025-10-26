import { Component, OnInit } from '@angular/core';
import { AdvisoryService, VW_AdvisoryList } from '../../../services/advisoryservice.service';
import { AuthService } from '../../../services/auth.service';
import { MemberService,MemberInfo } from '../../../services/member.service';

@Component({
  selector: 'app-all-advisory',
  templateUrl: './all-advisory.component.html',
  styleUrls: ['./all-advisory.component.css']
})
export class AllAdvisoryComponent implements OnInit {
  advisoryList: VW_AdvisoryList[] = [];
   message: string = '';
  loading: boolean = false;

  constructor(
    private advisoryService: AdvisoryService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {

    this.loadDeActiveAdvisoryList();

  }
  loadDeActiveAdvisoryList(): void {
    this.loading = true;
    this.advisoryService.getDeActiveAdvisoryList().subscribe({
      next: (data: VW_AdvisoryList[]) => {
        this.advisoryList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching active advisory list:', err);
        this.loading = false;
      }
    });
  }
}
