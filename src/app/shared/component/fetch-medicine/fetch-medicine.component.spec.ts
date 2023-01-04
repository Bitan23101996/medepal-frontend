import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchMedicineComponent } from './fetch-medicine.component';

describe('FetchMedicineComponent', () => {
  let component: FetchMedicineComponent;
  let fixture: ComponentFixture<FetchMedicineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchMedicineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
