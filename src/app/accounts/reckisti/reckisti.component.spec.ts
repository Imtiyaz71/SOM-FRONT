import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReckistiComponent } from './reckisti.component';

describe('ReckistiComponent', () => {
  let component: ReckistiComponent;
  let fixture: ComponentFixture<ReckistiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReckistiComponent]
    });
    fixture = TestBed.createComponent(ReckistiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
