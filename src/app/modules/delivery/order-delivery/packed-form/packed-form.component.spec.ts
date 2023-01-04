import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackedFormComponent } from './packed-form.component';

describe('PackedFormComponent', () => {
  let component: PackedFormComponent;
  let fixture: ComponentFixture<PackedFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
