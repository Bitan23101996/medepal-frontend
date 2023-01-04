import { SysadminModule } from './sysadmin.module';

describe('SysadminModule', () => {
  let sysadminModule: SysadminModule;

  beforeEach(() => {
    sysadminModule = new SysadminModule();
  });

  it('should create an instance', () => {
    expect(sysadminModule).toBeTruthy();
  });
});
