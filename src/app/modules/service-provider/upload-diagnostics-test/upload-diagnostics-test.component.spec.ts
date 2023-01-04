import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDiagnosticsTestComponent } from './upload-diagnostics-test.component';

describe('UploadDiagnosticsTestComponent', () => {
  let component: UploadDiagnosticsTestComponent;
  let fixture: ComponentFixture<UploadDiagnosticsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDiagnosticsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDiagnosticsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
