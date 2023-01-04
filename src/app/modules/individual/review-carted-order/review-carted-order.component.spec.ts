import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCartedOrderComponent } from './review-carted-order.component';

describe('ReviewCartedOrderComponent', () => {
  let component: ReviewCartedOrderComponent;
  let fixture: ComponentFixture<ReviewCartedOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCartedOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCartedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
