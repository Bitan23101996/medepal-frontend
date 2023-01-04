import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOccupationComponent } from './user-occupation.component';

describe('UserOccupationComponent', () => {
  let component: UserOccupationComponent;
  let fixture: ComponentFixture<UserOccupationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOccupationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOccupationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
