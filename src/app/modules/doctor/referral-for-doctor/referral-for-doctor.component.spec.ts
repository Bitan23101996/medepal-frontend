import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralForDoctorComponent } from './referral-for-doctor.component';

describe('ReferralForDoctorComponent', () => {
  let component: ReferralForDoctorComponent;
  let fixture: ComponentFixture<ReferralForDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralForDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralForDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
