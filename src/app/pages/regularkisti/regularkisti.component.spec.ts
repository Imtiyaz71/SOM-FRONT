import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularkistiComponent } from './regularkisti.component';

describe('RegularkistiComponent', () => {
  let component: RegularkistiComponent;
  let fixture: ComponentFixture<RegularkistiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularkistiComponent]
    });
    fixture = TestBed.createComponent(RegularkistiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
