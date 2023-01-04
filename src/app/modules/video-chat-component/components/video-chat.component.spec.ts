import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoChatComponentComponent } from './video-chat.component';

describe('VideoChatComponentComponent', () => {
  let component: VideoChatComponentComponent;
  let fixture: ComponentFixture<VideoChatComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoChatComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChatComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
