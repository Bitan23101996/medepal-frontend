import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchPatientRoutingModule } from './fetch-patient-routing.module';
import { FetchPatientComponent } from './fetch-patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../../shared/shared.module';
import { DoctorModule } from '../doctor';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  imports: [
    CommonModule,
    FetchPatientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    DoctorModule,
    SidebarModule
  ],
  declarations: [FetchPatientComponent]
})
export class FetchPatientModule { }
