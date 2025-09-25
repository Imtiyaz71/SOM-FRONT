import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberdeactiveComponent } from './memberdeactive.component';

describe('MemberdeactiveComponent', () => {
  let component: MemberdeactiveComponent;
  let fixture: ComponentFixture<MemberdeactiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberdeactiveComponent]
    });
    fixture = TestBed.createComponent(MemberdeactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
