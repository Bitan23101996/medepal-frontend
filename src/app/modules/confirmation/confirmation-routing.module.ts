import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component'

const routes: Routes = [
  { path: '', redirectTo: 'confirmation', pathMatch: 'full' },
  {
      path: '',
      component: ConfirmationComponent,
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
export class ConfirmationRoutingModule { }
