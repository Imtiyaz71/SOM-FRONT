import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectmemberassignComponent } from './projectmemberassign.component';

describe('ProjectmemberassignComponent', () => {
  let component: ProjectmemberassignComponent;
  let fixture: ComponentFixture<ProjectmemberassignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectmemberassignComponent]
    });
    fixture = TestBed.createComponent(ProjectmemberassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
