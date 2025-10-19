import { TestBed } from '@angular/core/testing';

import { StaffserviceService } from './staffservice.service';

describe('StaffserviceService', () => {
  let service: StaffserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
