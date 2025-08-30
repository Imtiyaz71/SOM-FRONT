import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMappingRoleComponent } from './user-mapping-role.component';

describe('UserMappingRoleComponent', () => {
  let component: UserMappingRoleComponent;
  let fixture: ComponentFixture<UserMappingRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMappingRoleComponent]
    });
    fixture = TestBed.createComponent(UserMappingRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
