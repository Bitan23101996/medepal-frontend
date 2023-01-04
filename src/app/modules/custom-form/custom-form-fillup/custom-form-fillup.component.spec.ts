import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormFillupComponent } from './custom-form-fillup.component';

describe('CustomFormFillupComponent', () => {
  let component: CustomFormFillupComponent;
  let fixture: ComponentFixture<CustomFormFillupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFormFillupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormFillupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
