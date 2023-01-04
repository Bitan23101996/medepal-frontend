import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdServiceListComponent } from './ipd-service-list.component';

describe('IpdServiceListComponent', () => {
  let component: IpdServiceListComponent;
  let fixture: ComponentFixture<IpdServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpdServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpdServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
