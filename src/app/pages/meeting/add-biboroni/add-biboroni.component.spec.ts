import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBiboroniComponent } from './add-biboroni.component';

describe('AddBiboroniComponent', () => {
  let component: AddBiboroniComponent;
  let fixture: ComponentFixture<AddBiboroniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBiboroniComponent]
    });
    fixture = TestBed.createComponent(AddBiboroniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
