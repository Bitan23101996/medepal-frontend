import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerConsultingPanelListComponent } from './peer-consulting-panel-list.component';

describe('PeerConsultingPanelListComponent', () => {
  let component: PeerConsultingPanelListComponent;
  let fixture: ComponentFixture<PeerConsultingPanelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerConsultingPanelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerConsultingPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
