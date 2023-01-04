import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceVoucherComponent } from './invoice-voucher.component';

describe('InvoiceVoucherComponent', () => {
  let component: InvoiceVoucherComponent;
  let fixture: ComponentFixture<InvoiceVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
