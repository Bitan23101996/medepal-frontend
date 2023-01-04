import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayeeAccountDetailsRoutingModule } from './payee-account-details-routing.module';
import { ConfigPayeeAccountComponent } from './config-payee-account.component';
import { SharedModule } from './../../shared/shared.module';

@NgModule({
  declarations: [ConfigPayeeAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    PayeeAccountDetailsRoutingModule
  ]
})
export class PayeeAccountDetailsModule { }
