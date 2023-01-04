import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationWorkflowComponent } from './registration-workflow.component';

describe('RegistrationWorkflowComponent', () => {
  let component: RegistrationWorkflowComponent;
  let fixture: ComponentFixture<RegistrationWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
