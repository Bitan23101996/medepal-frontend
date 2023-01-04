import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVaccinationComponent } from './user-vaccination.component';

describe('UserVaccinationComponent', () => {
  let component: UserVaccinationComponent;
  let fixture: ComponentFixture<UserVaccinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserVaccinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVaccinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
