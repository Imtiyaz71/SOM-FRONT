import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidregularsubscriptionComponent } from './paidregularsubscription.component';

describe('PaidregularsubscriptionComponent', () => {
  let component: PaidregularsubscriptionComponent;
  let fixture: ComponentFixture<PaidregularsubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaidregularsubscriptionComponent]
    });
    fixture = TestBed.createComponent(PaidregularsubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
