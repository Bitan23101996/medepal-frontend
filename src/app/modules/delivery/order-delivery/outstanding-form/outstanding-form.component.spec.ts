import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingFormComponent } from './outstanding-form.component';

describe('OutstandingFormComponent', () => {
  let component: OutstandingFormComponent;
  let fixture: ComponentFixture<OutstandingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
