import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerConsultingCaseDetailsComponent } from './peer-consulting-case-details.component';

describe('PeerConsultingCaseDetailsComponent', () => {
  let component: PeerConsultingCaseDetailsComponent;
  let fixture: ComponentFixture<PeerConsultingCaseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerConsultingCaseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerConsultingCaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
