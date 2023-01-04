import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderHolidayComponent } from './service-provider-holiday.component';

describe('ServiceProviderHolidayComponent', () => {
  let component: ServiceProviderHolidayComponent;
  let fixture: ComponentFixture<ServiceProviderHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProviderHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
