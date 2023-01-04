import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule,
    SharedModule,
    ConfirmationRoutingModule
  ]
})
export class ConfirmationModule { }
