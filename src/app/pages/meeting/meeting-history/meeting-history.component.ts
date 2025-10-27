import { Component, OnInit } from '@angular/core';
import { MeetingserviceService, Meeting } from '../../../services/meetingservice.service';
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any; // Bootstrap modal

@Component({
  selector: 'app-meeting-history',
  templateUrl: './meeting-history.component.html',
  styleUrls: ['./meeting-history.component.css']
})
export class MeetingHistoryComponent implements OnInit {
  meetings: Meeting[] = [];
  selectedMeeting: Meeting | null = null;
  modalInstance: any;

  constructor(
    private meetingService: MeetingserviceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBiboroniMeeting();
  }

  loadBiboroniMeeting(): void {
    this.meetingService.getMeetings().subscribe({
      next: (data: Meeting[]) => {
        this.meetings = data;
      },
      error: (err) => console.error('Error fetching meeting list:', err)
    });
  }

  openModal(meeting: Meeting): void {
    this.selectedMeeting = meeting;
    const modalEl = document.getElementById('meetingModal');
    if (modalEl) {
      this.modalInstance = new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    }
  }

  printMeeting(): void {
    if (!this.selectedMeeting) return;
    const printContent = `
      <h3>${this.selectedMeeting.meetingDate}</h3>
      <h4>${this.selectedMeeting.title}</h4>
      <p>${this.selectedMeeting.biboroni}</p>
    `;
    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow?.document.write(printContent);
    newWindow?.document.close();
    newWindow?.print();
  }
}
