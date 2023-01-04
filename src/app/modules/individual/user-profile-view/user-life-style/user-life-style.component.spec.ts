import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLifeStyleComponent } from './user-life-style.component';

describe('UserExerciseComponent', () => {
  let component: UserLifeStyleComponent;
  let fixture: ComponentFixture<UserLifeStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLifeStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLifeStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
