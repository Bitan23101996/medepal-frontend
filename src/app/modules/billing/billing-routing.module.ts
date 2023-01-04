import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { BillingPlanComponent } from './billing-plan/billing-plan.component';
import { BillingContractComponent } from './billing-contract/billing-contract.component';
import { MyBillsComponent } from './my-bills/my-bills.component';
import { MySPBillsComponent } from './my-sp-bills/my-sp-bills.component';
const routes: Routes = [
  {
      path: '',
      component: BillingComponent,
      children: [
        {
          path: 'plan',
          component: BillingPlanComponent,
        },
        {
          path: 'contract',
          component: BillingContractComponent,
        },
        {
          path: 'my-bills',
          component: MyBillsComponent,
        },
        {
          path: 'my-sp-bills',
          component: MySPBillsComponent
        }

      ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class BillingRoutingModule { }
