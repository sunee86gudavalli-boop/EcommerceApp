import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { Service } from './service';

describe('Service', () => {
  let service: Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
