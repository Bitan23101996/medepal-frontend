import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedurePreviewComponent } from './procedure-preview.component';

describe('ProcedurePreviewComponent', () => {
  let component: ProcedurePreviewComponent;
  let fixture: ComponentFixture<ProcedurePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedurePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedurePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
