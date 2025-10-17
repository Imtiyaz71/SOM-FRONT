import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberbalanceComponent } from './memberbalance.component';

describe('MemberbalanceComponent', () => {
  let component: MemberbalanceComponent;
  let fixture: ComponentFixture<MemberbalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberbalanceComponent]
    });
    fixture = TestBed.createComponent(MemberbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
