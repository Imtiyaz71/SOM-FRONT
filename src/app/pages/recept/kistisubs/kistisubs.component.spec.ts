import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KistisubsComponent } from './kistisubs.component';

describe('KistisubsComponent', () => {
  let component: KistisubsComponent;
  let fixture: ComponentFixture<KistisubsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KistisubsComponent]
    });
    fixture = TestBed.createComponent(KistisubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
