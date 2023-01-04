import { TestBed } from '@angular/core/testing';

import { CustomAnalysticQueryService } from './custom-analystic-query.service';

describe('CustomAnalysticQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomAnalysticQueryService = TestBed.get(CustomAnalysticQueryService);
    expect(service).toBeTruthy();
  });
});
