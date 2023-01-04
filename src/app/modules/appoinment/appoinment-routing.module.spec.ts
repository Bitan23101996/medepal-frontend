import { AppoinmentRoutingModule } from './appoinment-routing.module';

describe('AppoinmentRoutingModule', () => {
  let appoinmentRoutingModule: AppoinmentRoutingModule;

  beforeEach(() => {
    appoinmentRoutingModule = new AppoinmentRoutingModule();
  });

  it('should create an instance', () => {
    expect(appoinmentRoutingModule).toBeTruthy();
  });
});
