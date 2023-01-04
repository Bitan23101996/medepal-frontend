import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorPayPaymentComponent } from './razor-pay-payment.component';

describe('RazorPayPaymentComponent', () => {
  let component: RazorPayPaymentComponent;
  let fixture: ComponentFixture<RazorPayPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazorPayPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazorPayPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
