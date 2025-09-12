import { Component, OnInit } from '@angular/core';
import { UserInfoService, UserInfoBasic,authorizer,Mapper,MapperDetails } from '../../../services/user-info.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-mapping-role',
  templateUrl: './user-mapping-role.component.html',
  styleUrls: ['./user-mapping-role.component.css']
})
export class UserMappingRoleComponent implements OnInit{
   users: UserInfoBasic[] = [];
    auth: authorizer[] = [];
     mapdetails: MapperDetails[] = [];
    newmapper: Mapper = this.getemptymapper();
    constructor(private userInfoService: UserInfoService, private authService: AuthService) {}
  
    ngOnInit(): void {
    this.loadUsers();

  }

  loadUsers() {
    this.userInfoService.getuserbasicinfo().subscribe({
      next: data => { this.users = data; },
      error: err => console.error(err)
    });
 this.userInfoService.getauthorizerdata().subscribe({
      next: data => { this.auth = data; },
      error: err => console.error(err)
    });
     this.userInfoService.getusermapdetails().subscribe({
      next: data => { this.mapdetails = data; },
      error: err => console.error(err)
    });
  }
savemap() {
  this.userInfoService.SaveMapper(this.newmapper).subscribe({
    next: (res: any) => {
      alert(res);   // ekhane backend response show hobe
      this.newmapper = this.getemptymapper();
      this.loadUsers();
    },
    error: (err: any) => {
      console.error(err);
      alert("Error: " + err.message);  // error message show
    }
  });
}
    getemptymapper(): Mapper {
      return { username:'', auth:0 };
    }
}
