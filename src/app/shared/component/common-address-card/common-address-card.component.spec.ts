import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAddressCardComponent } from './common-address-card.component';

describe('CommonAddressCardComponent', () => {
  let component: CommonAddressCardComponent;
  let fixture: ComponentFixture<CommonAddressCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonAddressCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAddressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
