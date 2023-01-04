import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrderDeliveryComponent } from './lab-order-delivery.component';

describe('LabOrderDeliveryComponent', () => {
  let component: LabOrderDeliveryComponent;
  let fixture: ComponentFixture<LabOrderDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabOrderDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabOrderDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
