import { TestBed } from '@angular/core/testing';

import { MeetingserviceService } from './meetingservice.service';

describe('MeetingserviceService', () => {
  let service: MeetingserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
