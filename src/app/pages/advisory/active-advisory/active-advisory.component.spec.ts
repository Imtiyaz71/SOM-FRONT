import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveAdvisoryComponent } from './active-advisory.component';

describe('ActiveAdvisoryComponent', () => {
  let component: ActiveAdvisoryComponent;
  let fixture: ComponentFixture<ActiveAdvisoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveAdvisoryComponent]
    });
    fixture = TestBed.createComponent(ActiveAdvisoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
