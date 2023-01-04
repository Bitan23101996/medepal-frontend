import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCollectorComponent } from './assign-collector.component';

describe('AssignCollectorComponent', () => {
  let component: AssignCollectorComponent;
  let fixture: ComponentFixture<AssignCollectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCollectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
