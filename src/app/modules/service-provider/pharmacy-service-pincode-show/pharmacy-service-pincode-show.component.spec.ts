import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyServicePincodeShowComponent } from './pharmacy-service-pincode-show.component';

describe('PharmacyServicePincodeShowComponent', () => {
  let component: PharmacyServicePincodeShowComponent;
  let fixture: ComponentFixture<PharmacyServicePincodeShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyServicePincodeShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyServicePincodeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
