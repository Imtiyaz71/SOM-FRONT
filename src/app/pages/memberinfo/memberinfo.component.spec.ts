import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberinfoComponent } from './memberinfo.component';

describe('MemberinfoComponent', () => {
  let component: MemberinfoComponent;
  let fixture: ComponentFixture<MemberinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberinfoComponent]
    });
    fixture = TestBed.createComponent(MemberinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
