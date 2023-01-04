import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormMasterComponent } from './custom-form-master.component';

describe('CustomFormMasterComponent', () => {
  let component: CustomFormMasterComponent;
  let fixture: ComponentFixture<CustomFormMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFormMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
