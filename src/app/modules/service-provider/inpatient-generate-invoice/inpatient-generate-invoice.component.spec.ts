import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientGenerateInvoiceComponent } from './inpatient-generate-invoice.component';

describe('InpatientGenerateInvoiceComponent', () => {
  let component: InpatientGenerateInvoiceComponent;
  let fixture: ComponentFixture<InpatientGenerateInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InpatientGenerateInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientGenerateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
