import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecsubscriptionComponent } from './recsubscription.component';

describe('RecsubscriptionComponent', () => {
  let component: RecsubscriptionComponent;
  let fixture: ComponentFixture<RecsubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecsubscriptionComponent]
    });
    fixture = TestBed.createComponent(RecsubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
