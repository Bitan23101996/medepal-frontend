import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdPharmacyViewComponent } from './opd-pharmacy-view.component';

describe('OpdPharmacyViewComponent', () => {
  let component: OpdPharmacyViewComponent;
  let fixture: ComponentFixture<OpdPharmacyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdPharmacyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdPharmacyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
