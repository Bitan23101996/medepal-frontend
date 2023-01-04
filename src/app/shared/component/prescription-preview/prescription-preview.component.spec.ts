import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionPreviewComponent } from './prescription-preview.component';

describe('PrescriptionPreviewComponent', () => {
  let component: PrescriptionPreviewComponent;
  let fixture: ComponentFixture<PrescriptionPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
