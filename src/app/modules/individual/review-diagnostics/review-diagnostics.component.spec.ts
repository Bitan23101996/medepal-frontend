import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDiagnosticsComponent } from './review-diagnostics.component';

describe('ReviewDiagnosticsComponent', () => {
  let component: ReviewDiagnosticsComponent;
  let fixture: ComponentFixture<ReviewDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
