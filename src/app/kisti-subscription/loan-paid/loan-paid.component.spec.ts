import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPaidComponent } from './loan-paid.component';

describe('LoanPaidComponent', () => {
  let component: LoanPaidComponent;
  let fixture: ComponentFixture<LoanPaidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanPaidComponent]
    });
    fixture = TestBed.createComponent(LoanPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
