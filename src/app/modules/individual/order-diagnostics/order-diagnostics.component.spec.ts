import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDiagnosticsComponent } from './order-diagnostics.component';

describe('OrderDiagnosticsComponent', () => {
  let component: OrderDiagnosticsComponent;
  let fixture: ComponentFixture<OrderDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
