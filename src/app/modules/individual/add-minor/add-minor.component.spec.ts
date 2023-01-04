import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMinorComponent } from './add-minor.component';

describe('AddMinorComponent', () => {
  let component: AddMinorComponent;
  let fixture: ComponentFixture<AddMinorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMinorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMinorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
