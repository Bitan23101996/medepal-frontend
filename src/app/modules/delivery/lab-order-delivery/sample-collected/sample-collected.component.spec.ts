import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleCollectedComponent } from './sample-collected.component';

describe('SampleCollectedComponent', () => {
  let component: SampleCollectedComponent;
  let fixture: ComponentFixture<SampleCollectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleCollectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleCollectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
