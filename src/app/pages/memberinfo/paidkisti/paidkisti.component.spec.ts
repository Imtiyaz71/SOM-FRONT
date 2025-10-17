import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidkistiComponent } from './paidkisti.component';

describe('PaidkistiComponent', () => {
  let component: PaidkistiComponent;
  let fixture: ComponentFixture<PaidkistiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaidkistiComponent]
    });
    fixture = TestBed.createComponent(PaidkistiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
