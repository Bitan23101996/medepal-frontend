import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPayeeAccountComponent } from './config-payee-account.component';

describe('ConfigPayeeAccountComponent', () => {
  let component: ConfigPayeeAccountComponent;
  let fixture: ComponentFixture<ConfigPayeeAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPayeeAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPayeeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
