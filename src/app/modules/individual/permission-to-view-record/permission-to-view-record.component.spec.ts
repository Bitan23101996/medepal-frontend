import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionToViewRecordComponent } from './permission-to-view-record.component';

describe('PermissionToViewRecordComponent', () => {
  let component: PermissionToViewRecordComponent;
  let fixture: ComponentFixture<PermissionToViewRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionToViewRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionToViewRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
