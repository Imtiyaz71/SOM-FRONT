import { Component, OnInit } from '@angular/core';
import { MeetingserviceService, Meeting, VW_Response } from '../../../services/meetingservice.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-biboroni',
  templateUrl: './add-biboroni.component.html',
  styleUrls: ['./add-biboroni.component.css']
})
export class AddBiboroniComponent implements OnInit {

  meetings: Meeting[] = [];
  newMeeting: Meeting = {
    compId: 0,
    title: '',
    biboroni: '',
    meetingDate: '',
    meetingMonth: '',
    meetingYear: new Date().getFullYear()
  };

  message: string = '';
  loading: boolean = false;
months: string[] = [];
    years: number[] = [];
  constructor(
    private meetingService: MeetingserviceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Company ID automatically from AuthService
    this.newMeeting.compId = Number(this.authService.getcompanyid());

      this.generateMonths();
    this.generateYears();
  }
generateMonths() {
    this.months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthIndex = new Date().getMonth();

  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      this.years.push(currentYear - i);
    }
  }
  // 🔹 Load all meetings


  // 🔹 Add new meeting
  addMeeting(): void {
    if (!this.newMeeting.title || !this.newMeeting.biboroni || !this.newMeeting.meetingDate || !this.newMeeting.meetingMonth || !this.newMeeting.meetingYear) {
      this.message = 'Please fill all required fields.';
      return;
    }

    this.meetingService.addMeeting(this.newMeeting).subscribe({
      next: (res: VW_Response) => {
        this.message = res.message;
        if (res.statusCode === 200) {
          // Clear form
          this.newMeeting.title = '';
          this.newMeeting.biboroni = '';
          this.newMeeting.meetingDate = '';
          this.newMeeting.meetingMonth = '';
          this.newMeeting.meetingYear = new Date().getFullYear();


        }
      },
      error: (err) => {
        console.error('Error adding meeting:', err);
      }
    });
  }

}
