import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormListComponent } from './custom-form-list.component';

describe('CustomFormListComponent', () => {
  let component: CustomFormListComponent;
  let fixture: ComponentFixture<CustomFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
