import { Component, OnInit } from '@angular/core';
import { MemberService, MemberInfo,memberdeactivelogs } from '../../services/member.service';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-memberdeactive',
  templateUrl: './memberdeactive.component.html',
  styleUrls: ['./memberdeactive.component.css']
})
export class MemberdeactiveComponent implements OnInit {
  page: number = 1;
  itemsPerPage: number = 5;
  searchMemNo: string = '';
  members: MemberInfo[] = [];   // Member list রাখবো
  deac: memberdeactivelogs[] = [];
  selectedMemNo: number | null = null; // select করা memNo

  constructor(private memberService: MemberService, private authService: AuthService) {}

  ngOnInit(): void {
    // Member list load
    this.memberService.getmemberinfo().subscribe({
      next: (res) => {
        this.members = res;
      },
      error: (err) => {
        console.error("Failed to load members:", err);
      }
    });
     this.memberService.getdeactivelogs().subscribe({
      next: (res) => {
        this.deac = res;
      },
      error: (err) => {
        console.error("Failed to load members:", err);
      }
    });
  }
 get filteredMembers() {
    if (!this.searchMemNo) return this.deac;
    return this.deac.filter(m => m.memNo.toString().includes(this.searchMemNo));
  }

 deactivateMember() {
  if (!this.selectedMemNo) {
    alert("Please select a member first!");
    return;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.authService.getToken()}`
  });

  const payload = {
    memNo: this.selectedMemNo,
    compId: Number(this.authService.getcompanyid()),
    entryBy: this.authService.getfullnamename() ?? ''
  };

this.memberService.memberDeactive(payload, headers).subscribe({
  next: (res) => {
    if (res.statusCode === 200) {
      alert('✅ ' + res.message);
    } else if (res.statusCode === 400) {
      alert('⚠️ ' + res.message);
    } else {
      alert('❌ ' + res.message);
    }
  },
  error: (err) => {
    console.error("Server error:", err);
    alert('❌ Server error occurred');
  }
});

}

}
