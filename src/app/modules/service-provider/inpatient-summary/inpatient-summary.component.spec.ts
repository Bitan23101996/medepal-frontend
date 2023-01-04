import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientSummaryComponent } from './inpatient-summary.component';

describe('InpatientSummaryComponent', () => {
  let component: InpatientSummaryComponent;
  let fixture: ComponentFixture<InpatientSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InpatientSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
