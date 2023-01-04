import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyRequisitionListComponent } from './pharmacy-requisition-list.component';

describe('PharmacyRequisitionListComponent', () => {
  let component: PharmacyRequisitionListComponent;
  let fixture: ComponentFixture<PharmacyRequisitionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyRequisitionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyRequisitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
