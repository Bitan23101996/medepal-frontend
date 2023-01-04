import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupViewMemberComponent } from './group-view-member.component';

describe('GroupViewMemberComponent', () => {
  let component: GroupViewMemberComponent;
  let fixture: ComponentFixture<GroupViewMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupViewMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupViewMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
