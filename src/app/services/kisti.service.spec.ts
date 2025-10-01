import { TestBed } from '@angular/core/testing';

import { KistiService } from './kisti.service';

describe('KistiService', () => {
  let service: KistiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KistiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
