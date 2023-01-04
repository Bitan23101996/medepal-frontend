import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDoctorToVerifyComponent } from './search-doctor-to-verify.component';

describe('SearchDoctorToVerifyComponent', () => {
  let component: SearchDoctorToVerifyComponent;
  let fixture: ComponentFixture<SearchDoctorToVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDoctorToVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDoctorToVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
