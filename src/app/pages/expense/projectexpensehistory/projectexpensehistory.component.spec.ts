import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectexpensehistoryComponent } from './projectexpensehistory.component';

describe('ProjectexpensehistoryComponent', () => {
  let component: ProjectexpensehistoryComponent;
  let fixture: ComponentFixture<ProjectexpensehistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectexpensehistoryComponent]
    });
    fixture = TestBed.createComponent(ProjectexpensehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
