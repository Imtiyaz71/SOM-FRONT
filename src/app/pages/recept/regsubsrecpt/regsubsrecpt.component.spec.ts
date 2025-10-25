import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegsubsrecptComponent } from './regsubsrecpt.component';

describe('RegsubsrecptComponent', () => {
  let component: RegsubsrecptComponent;
  let fixture: ComponentFixture<RegsubsrecptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegsubsrecptComponent]
    });
    fixture = TestBed.createComponent(RegsubsrecptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
