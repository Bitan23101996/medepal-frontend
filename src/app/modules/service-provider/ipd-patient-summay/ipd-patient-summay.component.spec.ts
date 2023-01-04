import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdPatientSummayComponent } from './ipd-patient-summay.component';

describe('IpdPatientSummayComponent', () => {
  let component: IpdPatientSummayComponent;
  let fixture: ComponentFixture<IpdPatientSummayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpdPatientSummayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpdPatientSummayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
