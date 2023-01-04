import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryFrameworkQueryListComponent } from './query-framework-query-list.component';

describe('QueryFrameworkQueryListComponent', () => {
  let component: QueryFrameworkQueryListComponent;
  let fixture: ComponentFixture<QueryFrameworkQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryFrameworkQueryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryFrameworkQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
