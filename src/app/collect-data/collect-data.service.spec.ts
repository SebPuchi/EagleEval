import { TestBed } from '@angular/core/testing';

import { CollectDataService } from './collect-data.service';

describe('CollectDataService', () => {
  let service: CollectDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
