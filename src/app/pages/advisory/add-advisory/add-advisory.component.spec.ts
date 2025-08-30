import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvisoryComponent } from './add-advisory.component';

describe('AddAdvisoryComponent', () => {
  let component: AddAdvisoryComponent;
  let fixture: ComponentFixture<AddAdvisoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAdvisoryComponent]
    });
    fixture = TestBed.createComponent(AddAdvisoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
