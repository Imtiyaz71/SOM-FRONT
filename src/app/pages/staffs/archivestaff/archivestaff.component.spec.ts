import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivestaffComponent } from './archivestaff.component';

describe('ArchivestaffComponent', () => {
  let component: ArchivestaffComponent;
  let fixture: ComponentFixture<ArchivestaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivestaffComponent]
    });
    fixture = TestBed.createComponent(ArchivestaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
