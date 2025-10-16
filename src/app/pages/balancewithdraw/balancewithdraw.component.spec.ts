import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancewithdrawComponent } from './balancewithdraw.component';

describe('BalancewithdrawComponent', () => {
  let component: BalancewithdrawComponent;
  let fixture: ComponentFixture<BalancewithdrawComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BalancewithdrawComponent]
    });
    fixture = TestBed.createComponent(BalancewithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
