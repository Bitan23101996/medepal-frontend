import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyRequisitionRoutingModule } from './pharmacy-requisition-routing.module';
import { PharmacyRequisitionComponent } from './pharmacy-requisition.component';
import { PharmacyRequisitionListComponent } from './pharmacy-requisition-list/pharmacy-requisition-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PharmacyRequisitionRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    PharmacyRequisitionComponent,
    PharmacyRequisitionListComponent
  ]
})
export class PharmacyRequisitionModule { }
