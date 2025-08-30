import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KistiPaidInfoComponent } from './kisti-paid-info.component';

describe('KistiPaidInfoComponent', () => {
  let component: KistiPaidInfoComponent;
  let fixture: ComponentFixture<KistiPaidInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KistiPaidInfoComponent]
    });
    fixture = TestBed.createComponent(KistiPaidInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
