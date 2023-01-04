import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BillingPlanComponent } from './billing-plan/billing-plan.component';
import { BillingComponent } from './billing.component';
import { BillingRoutingModule } from './billing-routing.module';
import {RadioButtonModule} from 'primeng/radiobutton';
import { BillingContractComponent } from './billing-contract/billing-contract.component';
import {LightboxModule} from 'primeng/lightbox';
import { MyBillsComponent } from './my-bills/my-bills.component';
import { MySPBillsComponent } from './my-sp-bills/my-sp-bills.component';

@NgModule({
  declarations: [BillingComponent, BillingPlanComponent, BillingContractComponent, MyBillsComponent, MySPBillsComponent],
  imports: [
    CommonModule,
    BillingRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    RadioButtonModule,
    LightboxModule
  ]
})
export class BillingModule { }
