import { Component, OnInit } from '@angular/core';
import { MenuService, Menu } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  menus: Menu[] = [];
  childMenus: Menu[] = [];
  photobaseurl: string = environment.apiBaseUrl +'/UserInfo';
  router: any;
  //photoPreview: string | null = null;
  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {}
 fullname = this.authService.getfullnamename() || '----';

photoPreview= `${this.photobaseurl}/userphotobyusername?Username=${this.authService.getusername()}`;;

  ngOnInit(): void {
    this.loadMenus();
  }
//this.photoPreview = `${this.photobaseurl}/userphotobyusername?Username=${data.username}`;

  loadMenus(): void {
    // this.menuService.getParentMenus().subscribe({
    //   next: (data: Menu[]) => this.menus = data,
    //   error: (err: any) => console.error('Parent menu load failed', err)
    // });

    const role = this.authService.getRole() || 'User';

    this.menuService.getChildMenus(role).subscribe({
      next: (data: Menu[]) => this.childMenus = data,
      error: (err: any) => console.error('Child menu load failed', err)
    });
  }
logout(event: Event) {
  event.preventDefault(); // <--- important
  console.log('Logout called');
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userRole');
  this.router.navigate(['./login']);
}

}
