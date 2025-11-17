import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerevenueComponent } from './managerevenue.component';

describe('ManagerevenueComponent', () => {
  let component: ManagerevenueComponent;
  let fixture: ComponentFixture<ManagerevenueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerevenueComponent]
    });
    fixture = TestBed.createComponent(ManagerevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
