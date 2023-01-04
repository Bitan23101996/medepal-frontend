import { PharmaRoutingModule } from './pharma-routing.module';

describe('PharmaRoutingModule', () => {
  let pharmaRoutingModule: PharmaRoutingModule;

  beforeEach(() => {
    pharmaRoutingModule = new PharmaRoutingModule();
  });

  it('should create an instance', () => {
    expect(pharmaRoutingModule).toBeTruthy();
  });
});
