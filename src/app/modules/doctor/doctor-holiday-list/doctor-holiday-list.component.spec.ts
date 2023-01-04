import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorHolidayListComponent } from './doctor-holiday-list.component';

describe('DoctorHolidayListComponent', () => {
  let component: DoctorHolidayListComponent;
  let fixture: ComponentFixture<DoctorHolidayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorHolidayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorHolidayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
