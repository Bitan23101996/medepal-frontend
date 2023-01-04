import { PharmaModule } from './pharmacy.module';

describe('PharmaModule', () => {
  let pharmaModule: PharmaModule;

  beforeEach(() => {
    pharmaModule = new PharmaModule();
  });

  it('should create an instance', () => {
    expect(pharmaModule).toBeTruthy();
  });
});
