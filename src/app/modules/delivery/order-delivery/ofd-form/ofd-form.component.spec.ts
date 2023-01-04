import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfdFormComponent } from './ofd-form.component';

describe('OfdFormComponent', () => {
  let component: OfdFormComponent;
  let fixture: ComponentFixture<OfdFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfdFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
