import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConfigPayeeAccountComponent } from './config-payee-account.component';

const routes: Routes = [
  { path: '', redirectTo: 'confirmation', pathMatch: 'full' },
  {
      path: '',
      component: ConfigPayeeAccountComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class PayeeAccountDetailsRoutingModule { }
