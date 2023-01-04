import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPharmacyComponent } from './signup-pharmacy.component';

describe('SignupPharmacyComponent', () => {
  let component: SignupPharmacyComponent;
  let fixture: ComponentFixture<SignupPharmacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPharmacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
