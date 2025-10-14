import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensetypeComponent } from './expensetype.component';

describe('ExpensetypeComponent', () => {
  let component: ExpensetypeComponent;
  let fixture: ComponentFixture<ExpensetypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensetypeComponent]
    });
    fixture = TestBed.createComponent(ExpensetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
