import { Component, OnInit } from '@angular/core';
import { MenuService, ParentMenu, ChildMenu } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  parentMenus: ParentMenu[] = [];
  childMenusMap: { [parentId: number]: ChildMenu[] } = {}; // child menus keyed by parentId
  photobaseurl: string = environment.apiBaseUrl + '/UserInfo';
  fullname = this.authService.getfullnamename() || '----';
  photoPreview = `${this.photobaseurl}/userphotobyusername?Username=${this.authService.getusername()}`;

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    // 1️⃣ Load parent menus
    this.menuService.getparentmenu().subscribe({
      next: (parents: ParentMenu[]) => {
        this.parentMenus = parents;

        // 2️⃣ Load child menus for each parent menu
        const childRequests = parents.map(p =>
          this.menuService.getchildmenu2(p.id)
        );

        forkJoin(childRequests).subscribe({
          next: (childrenArray: ChildMenu[][]) => {
            childrenArray.forEach((children, index) => {
              this.childMenusMap[parents[index].id] = children;
            });
          },
          error: err => console.error('Child menu load failed', err)
        });
      },
      error: err => console.error('Parent menu load failed', err)
    });
  }

  getChildMenus(parentId: number): ChildMenu[] {
    return this.childMenusMap[parentId] || [];
  }

  logout(event: Event) {
    event.preventDefault();
    console.log('Logout called');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']); // ✅ corrected navigation
  }
}
