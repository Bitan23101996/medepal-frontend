import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureOnlineConsultationComponent } from './configure-online-consultation.component';

describe('ConfigureOnlineConsultationComponent', () => {
  let component: ConfigureOnlineConsultationComponent;
  let fixture: ComponentFixture<ConfigureOnlineConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureOnlineConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureOnlineConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
