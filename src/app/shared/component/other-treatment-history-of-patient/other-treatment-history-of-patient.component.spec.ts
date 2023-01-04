import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherTreatmentHistoryOfPatientComponent } from './other-treatment-history-of-patient.component';

describe('OtherTreatmentHistoryOfPatientComponent', () => {
  let component: OtherTreatmentHistoryOfPatientComponent;
  let fixture: ComponentFixture<OtherTreatmentHistoryOfPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherTreatmentHistoryOfPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherTreatmentHistoryOfPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
