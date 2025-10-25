import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubrecptComponent } from './subrecpt.component';

describe('SubrecptComponent', () => {
  let component: SubrecptComponent;
  let fixture: ComponentFixture<SubrecptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubrecptComponent]
    });
    fixture = TestBed.createComponent(SubrecptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
