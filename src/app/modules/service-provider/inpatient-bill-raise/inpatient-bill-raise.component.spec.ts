import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientBillRaiseComponent } from './inpatient-bill-raise.component';

describe('InpatientBillRaiseComponent', () => {
  let component: InpatientBillRaiseComponent;
  let fixture: ComponentFixture<InpatientBillRaiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InpatientBillRaiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientBillRaiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
