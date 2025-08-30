import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPaidComponent } from './subscription-paid.component';

describe('SubscriptionPaidComponent', () => {
  let component: SubscriptionPaidComponent;
  let fixture: ComponentFixture<SubscriptionPaidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionPaidComponent]
    });
    fixture = TestBed.createComponent(SubscriptionPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
