import { Component, OnInit } from '@angular/core';
import { MenuService, Menu } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  menus: Menu[] = [];
  childMenus: Menu[] = [];

  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

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

 
}
