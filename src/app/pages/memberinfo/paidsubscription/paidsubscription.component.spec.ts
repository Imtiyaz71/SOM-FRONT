import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidsubscriptionComponent } from './paidsubscription.component';

describe('PaidsubscriptionComponent', () => {
  let component: PaidsubscriptionComponent;
  let fixture: ComponentFixture<PaidsubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaidsubscriptionComponent]
    });
    fixture = TestBed.createComponent(PaidsubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
