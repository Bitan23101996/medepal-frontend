import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDiagnosticsComponent } from './my-diagnostics.component';

describe('MyDiagnosticsComponent', () => {
  let component: MyDiagnosticsComponent;
  let fixture: ComponentFixture<MyDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
