import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDeliveryComponent } from './order-delivery/order-delivery.component';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryComponent } from './delivery.component';
import {StepsModule} from 'primeng/steps';
import { OutstandingFormComponent } from './order-delivery/outstanding-form/outstanding-form.component';
import { PackedFormComponent } from './order-delivery/packed-form/packed-form.component';
import { OfdFormComponent } from './order-delivery/ofd-form/ofd-form.component';
import { IndividualModule } from '../individual/individual.module';
import { ServiceProviderModule } from '../service-provider/service-provider.module';
import { LabOrderDeliveryComponent } from './lab-order-delivery/lab-order-delivery.component';
import { AssignCollectorComponent } from './lab-order-delivery/assign-collector/assign-collector.component';
import { SampleCollectedComponent } from './lab-order-delivery/sample-collected/sample-collected.component';
import { SampleReceivedComponent } from './lab-order-delivery/sample-received/sample-received.component';
import { ProcessReportComponent } from './lab-order-delivery/process-report/process-report.component';
import { SendReportComponent } from './lab-order-delivery/send-report/send-report.component';

@NgModule({
  imports: [
    CommonModule,
    DeliveryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    StepsModule,
    ServiceProviderModule
  ],
  declarations: [
    DeliveryComponent,
    OrderDeliveryComponent,
    OutstandingFormComponent,
    PackedFormComponent,
    OfdFormComponent,
    LabOrderDeliveryComponent,
    AssignCollectorComponent,
    SampleCollectedComponent,
    SampleReceivedComponent,
    ProcessReportComponent,
    SendReportComponent
  ]
})
export class DeliveryModule { }
