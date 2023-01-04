import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDoctorRegistrationComponent } from './verify-doctor-registration.component';

describe('VerifyDoctorRegistrationComponent', () => {
  let component: VerifyDoctorRegistrationComponent;
  let fixture: ComponentFixture<VerifyDoctorRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyDoctorRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDoctorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
