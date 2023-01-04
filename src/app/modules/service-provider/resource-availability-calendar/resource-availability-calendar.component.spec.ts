import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAvailabilityCalendarComponent } from './resource-availability-calendar.component';

describe('ResourceAvailabilityCalendarComponent', () => {
  let component: ResourceAvailabilityCalendarComponent;
  let fixture: ComponentFixture<ResourceAvailabilityCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAvailabilityCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAvailabilityCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
