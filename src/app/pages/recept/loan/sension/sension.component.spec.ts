import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensionComponent } from './sension.component';

describe('SensionComponent', () => {
  let component: SensionComponent;
  let fixture: ComponentFixture<SensionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensionComponent]
    });
    fixture = TestBed.createComponent(SensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
