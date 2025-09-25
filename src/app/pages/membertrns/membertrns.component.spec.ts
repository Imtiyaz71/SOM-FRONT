import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembertrnsComponent } from './membertrns.component';

describe('MembertrnsComponent', () => {
  let component: MembertrnsComponent;
  let fixture: ComponentFixture<MembertrnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembertrnsComponent]
    });
    fixture = TestBed.createComponent(MembertrnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
