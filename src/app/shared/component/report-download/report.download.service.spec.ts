import { TestBed } from '@angular/core/testing';

import { Report.DownloadService } from './report.download.service';

describe('Report.DownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Report.DownloadService = TestBed.get(Report.DownloadService);
    expect(service).toBeTruthy();
  });
});
