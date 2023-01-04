import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAppoinmentComponent } from './book-appoinment.component';

describe('UserProfileComponent', () => {
  let component: BookAppoinmentComponent;
  let fixture: ComponentFixture<BookAppoinmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookAppoinmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAppoinmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
