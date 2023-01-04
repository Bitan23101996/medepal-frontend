import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NGBWorkingScheduleComponent } from './working-schedule.component';

describe('NGBWorkingScheduleComponent', () => {
  let component: NGBWorkingScheduleComponent;
  let fixture: ComponentFixture<NGBWorkingScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NGBWorkingScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NGBWorkingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
