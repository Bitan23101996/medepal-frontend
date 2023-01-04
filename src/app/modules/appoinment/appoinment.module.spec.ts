import { AppoinmentModule } from './appoinment.module';

describe('AppoinmentModule', () => {
  let appoinmentModule: AppoinmentModule;

  beforeEach(() => {
    appoinmentModule = new AppoinmentModule();
  });

  it('should create an instance', () => {
    expect(appoinmentModule).toBeTruthy();
  });
});
