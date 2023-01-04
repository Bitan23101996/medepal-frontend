import { SearchPatientRoutingModule } from './search-patient-routing.module';

describe('SearchPatientRoutingModule', () => {
  let searchPatientRoutingModule: SearchPatientRoutingModule;

  beforeEach(() => {
    searchPatientRoutingModule = new SearchPatientRoutingModule();
  });

  it('should create an instance', () => {
    expect(searchPatientRoutingModule).toBeTruthy();
  });
});
