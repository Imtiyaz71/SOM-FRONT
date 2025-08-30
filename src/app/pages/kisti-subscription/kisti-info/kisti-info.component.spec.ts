import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KistiInfoComponent } from './kisti-info.component';

describe('KistiInfoComponent', () => {
  let component: KistiInfoComponent;
  let fixture: ComponentFixture<KistiInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KistiInfoComponent]
    });
    fixture = TestBed.createComponent(KistiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
