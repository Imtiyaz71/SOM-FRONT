import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdvisoryComponent } from './all-advisory.component';

describe('AllAdvisoryComponent', () => {
  let component: AllAdvisoryComponent;
  let fixture: ComponentFixture<AllAdvisoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllAdvisoryComponent]
    });
    fixture = TestBed.createComponent(AllAdvisoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
