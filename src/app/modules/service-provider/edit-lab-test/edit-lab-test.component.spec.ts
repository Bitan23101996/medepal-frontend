import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabTestComponent } from './edit-lab-test.component';

describe('EditLabTestComponent', () => {
  let component: EditLabTestComponent;
  let fixture: ComponentFixture<EditLabTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLabTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
