import { PharmacyRequisitionModule } from './pharmacy-requisition.module';

describe('PharmacyRequisitionModule', () => {
  let pharmacyRequisitionModule: PharmacyRequisitionModule;

  beforeEach(() => {
    pharmacyRequisitionModule = new PharmacyRequisitionModule();
  });

  it('should create an instance', () => {
    expect(pharmacyRequisitionModule).toBeTruthy();
  });
});
