import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AppoinmentComponent } from './appoinment.component';
const routes: Routes = [
  {
      path: '',
      component: AppoinmentComponent,
  }
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
export class AppoinmentRoutingModule { }
