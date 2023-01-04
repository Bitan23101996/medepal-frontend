import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerConsultingRequestComponent } from './peer-consulting-request.component';

describe('PeerConsultingRequestComponent', () => {
  let component: PeerConsultingRequestComponent;
  let fixture: ComponentFixture<PeerConsultingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerConsultingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerConsultingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
