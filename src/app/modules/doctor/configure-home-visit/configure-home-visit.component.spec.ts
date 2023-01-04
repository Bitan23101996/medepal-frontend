import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureHomeVisitComponent } from './configure-home-visit.component';

describe('ConfigureHomeVisitComponent', () => {
  let component: ConfigureHomeVisitComponent;
  let fixture: ComponentFixture<ConfigureHomeVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureHomeVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureHomeVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
