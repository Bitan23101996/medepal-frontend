import { SearchPatientModule } from './search-patient.module';

describe('SearchPatientModule', () => {
  let searchPatientModule: SearchPatientModule;

  beforeEach(() => {
    searchPatientModule = new SearchPatientModule();
  });

  it('should create an instance', () => {
    expect(searchPatientModule).toBeTruthy();
  });
});
