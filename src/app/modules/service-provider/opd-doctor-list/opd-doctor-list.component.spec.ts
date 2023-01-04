import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdDoctorListComponent } from './opd-doctor-list.component';

describe('OpdDoctorListComponent', () => {
  let component: OpdDoctorListComponent;
  let fixture: ComponentFixture<OpdDoctorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdDoctorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdDoctorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
