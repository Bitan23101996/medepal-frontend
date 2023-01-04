import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDoctorReferralComponent } from './my-doctor-referral.component';

describe('MyDoctorReferralComponent', () => {
  let component: MyDoctorReferralComponent;
  let fixture: ComponentFixture<MyDoctorReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDoctorReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDoctorReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
