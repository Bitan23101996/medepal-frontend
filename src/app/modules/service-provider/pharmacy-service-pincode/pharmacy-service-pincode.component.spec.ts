import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyServicePincodeComponent } from './pharmacy-service-pincode.component';

describe('PharmacyServicePincodeComponent', () => {
  let component: PharmacyServicePincodeComponent;
  let fixture: ComponentFixture<PharmacyServicePincodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyServicePincodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyServicePincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
