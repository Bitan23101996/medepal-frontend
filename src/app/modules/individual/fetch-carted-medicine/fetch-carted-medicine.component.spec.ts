import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchCartedMedicineComponent } from './fetch-carted-medicine.component';

describe('FetchCartedMedicineComponent', () => {
  let component: FetchCartedMedicineComponent;
  let fixture: ComponentFixture<FetchCartedMedicineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchCartedMedicineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchCartedMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
