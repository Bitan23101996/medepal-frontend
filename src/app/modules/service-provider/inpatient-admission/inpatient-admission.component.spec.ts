import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientAdmissionComponent } from './inpatient-admission.component';

describe('InpatientAdmissionComponent', () => {
  let component: InpatientAdmissionComponent;
  let fixture: ComponentFixture<InpatientAdmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InpatientAdmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
