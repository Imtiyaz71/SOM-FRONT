import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KistiDueComponent } from './kisti-due.component';

describe('KistiDueComponent', () => {
  let component: KistiDueComponent;
  let fixture: ComponentFixture<KistiDueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KistiDueComponent]
    });
    fixture = TestBed.createComponent(KistiDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
