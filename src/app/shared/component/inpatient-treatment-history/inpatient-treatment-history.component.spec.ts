import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InpationTreatmentHistoryComponent } from './inpation-treatment-history.component';

describe('InpationTreatmentHistoryComponent', () => {
  let component: InpationTreatmentHistoryComponent;
  let fixture: ComponentFixture<InpationTreatmentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InpationTreatmentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InpationTreatmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
