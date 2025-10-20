import { TestBed } from '@angular/core/testing';

import { DashserviceService } from './dashservice.service';

describe('DashserviceService', () => {
  let service: DashserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
