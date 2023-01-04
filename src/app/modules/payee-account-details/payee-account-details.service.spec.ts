import { TestBed } from '@angular/core/testing';

import { PayeeAccountDetailsService } from './payee-account-details.service';

describe('PayeeAccountDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayeeAccountDetailsService = TestBed.get(PayeeAccountDetailsService);
    expect(service).toBeTruthy();
  });
});
