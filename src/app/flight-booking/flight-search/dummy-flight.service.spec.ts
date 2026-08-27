import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/shared/config.service';

import { DummyFlightService } from './dummy-flight.service';

describe('DummyFlightService', () => {
  let service: DummyFlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DummyFlightService,
        ConfigService,
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(DummyFlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
