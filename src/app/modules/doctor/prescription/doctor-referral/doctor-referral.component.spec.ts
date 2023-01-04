import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorReferralComponent } from './doctor-referral.component';

describe('DoctorReferralComponent', () => {
  let component: DoctorReferralComponent;
  let fixture: ComponentFixture<DoctorReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
