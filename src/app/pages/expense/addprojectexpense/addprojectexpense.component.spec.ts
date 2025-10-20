import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprojectexpenseComponent } from './addprojectexpense.component';

describe('AddprojectexpenseComponent', () => {
  let component: AddprojectexpenseComponent;
  let fixture: ComponentFixture<AddprojectexpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddprojectexpenseComponent]
    });
    fixture = TestBed.createComponent(AddprojectexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
