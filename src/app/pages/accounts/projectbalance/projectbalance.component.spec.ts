import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectbalanceComponent } from './projectbalance.component';

describe('ProjectbalanceComponent', () => {
  let component: ProjectbalanceComponent;
  let fixture: ComponentFixture<ProjectbalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectbalanceComponent]
    });
    fixture = TestBed.createComponent(ProjectbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
