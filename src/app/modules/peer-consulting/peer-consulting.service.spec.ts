import { TestBed } from '@angular/core/testing';

import { PeerConsultingService } from './peer-consulting.service';

describe('PeerConsultingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeerConsultingService = TestBed.get(PeerConsultingService);
    expect(service).toBeTruthy();
  });
});
