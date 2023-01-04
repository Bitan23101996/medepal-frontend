import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingContractComponent } from './billing-contract.component';

describe('BillingContractComponent', () => {
  let component: BillingContractComponent;
  let fixture: ComponentFixture<BillingContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
