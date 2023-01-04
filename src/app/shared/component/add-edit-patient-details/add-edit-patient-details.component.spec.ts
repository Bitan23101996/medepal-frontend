import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPatientDetailsComponent } from './add-edit-patient-details.component';

describe('AddEditPatientDetailsComponent', () => {
  let component: AddEditPatientDetailsComponent;
  let fixture: ComponentFixture<AddEditPatientDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPatientDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
