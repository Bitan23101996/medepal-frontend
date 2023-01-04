import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdOtManagementComponent } from './ipd-ot-management.component';

describe('IpdOtManagementComponent', () => {
  let component: IpdOtManagementComponent;
  let fixture: ComponentFixture<IpdOtManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpdOtManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpdOtManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
