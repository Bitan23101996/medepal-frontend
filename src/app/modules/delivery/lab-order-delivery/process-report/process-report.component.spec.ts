import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessReportComponent } from './process-report.component';

describe('ProcessReportComponent', () => {
  let component: ProcessReportComponent;
  let fixture: ComponentFixture<ProcessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
