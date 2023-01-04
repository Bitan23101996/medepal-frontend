import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderImageUploadComponent } from './service-provider-image-upload.component';

describe('ServiceProviderImageUploadComponent', () => {
  let component: ServiceProviderImageUploadComponent;
  let fixture: ComponentFixture<ServiceProviderImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProviderImageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
