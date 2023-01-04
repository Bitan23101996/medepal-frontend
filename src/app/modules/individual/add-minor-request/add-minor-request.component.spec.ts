import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMinorRequestComponent } from './add-minor-request.component';

describe('AddMinorRequestComponent', () => {
  let component: AddMinorRequestComponent;
  let fixture: ComponentFixture<AddMinorRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMinorRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMinorRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
