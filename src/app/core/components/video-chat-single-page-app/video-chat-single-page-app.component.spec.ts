import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoChatSinglePageAppComponent } from './video-chat-single-page-app.component';

describe('VideoChatSinglePageAppComponent', () => {
  let component: VideoChatSinglePageAppComponent;
  let fixture: ComponentFixture<VideoChatSinglePageAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoChatSinglePageAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChatSinglePageAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
