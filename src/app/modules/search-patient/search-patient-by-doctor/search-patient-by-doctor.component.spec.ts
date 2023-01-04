import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPatientByDoctorComponent } from './search-patient-by-doctor.component';

describe('SearchPatientByDoctorComponent', () => {
  let component: SearchPatientByDoctorComponent;
  let fixture: ComponentFixture<SearchPatientByDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPatientByDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPatientByDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
