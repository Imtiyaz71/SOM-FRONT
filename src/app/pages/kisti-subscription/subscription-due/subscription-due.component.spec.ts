import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDueComponent } from './subscription-due.component';

describe('SubscriptionDueComponent', () => {
  let component: SubscriptionDueComponent;
  let fixture: ComponentFixture<SubscriptionDueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionDueComponent]
    });
    fixture = TestBed.createComponent(SubscriptionDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
