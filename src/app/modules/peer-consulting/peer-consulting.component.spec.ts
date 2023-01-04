import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerConsultingComponent } from './peer-consulting.component';

describe('PeerConsultingComponent', () => {
  let component: PeerConsultingComponent;
  let fixture: ComponentFixture<PeerConsultingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerConsultingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerConsultingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
