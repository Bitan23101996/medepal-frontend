import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorUploadComponent } from './doctor-upload.component';

describe('DoctorUploadComponent', () => {
  let component: DoctorUploadComponent;
  let fixture: ComponentFixture<DoctorUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
