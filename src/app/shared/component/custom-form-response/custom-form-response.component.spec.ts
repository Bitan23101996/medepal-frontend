import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormResponseComponent } from './custom-form-response.component';

describe('CustomFormResponseComponent', () => {
  let component: CustomFormResponseComponent;
  let fixture: ComponentFixture<CustomFormResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFormResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
