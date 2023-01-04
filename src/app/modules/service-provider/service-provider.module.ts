/*
 *  * |///////////////////////////////////////////////////////////////////////|
 *  * |                                                                       |
 *  * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
 *  * | All Rights Reserved                                                   |
 *  * |                                                                       |
 *  * | This document is the sole property of StellaBlue Interactive          |
 *  * | Services Pvt. Ltd.                                                    |
 *  * | No part of this document may be reproduced in any form or             |
 *  * | by any means - electronic, mechanical, photocopying, recording        |
 *  * | or otherwise - without the prior written permission of                |
 *  * | StellaBlue Interactive Services Pvt. Ltd.                             |
 *  * |                                                                       |
 *  * |///////////////////////////////////////////////////////////////////////|
 *  */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternationalPhoneModule } from 'ng4-intl-phone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { ServiceProviderRoutingModule } from './service-provider-routing.module';
import { OpdPharmacyComponent } from './opd-pharmacy/opd-pharmacy.component';
import {AutoCompleteModule} from 'primeng/primeng';
import {SharedModule} from './../../shared/shared.module';
import { ServiceProviderComponent } from './service-provider.component';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { SignupPharmacyComponent } from './pharmacy/signup-pharmacy/signup-pharmacy.component';
import { OpdDoctorListComponent } from './opd-doctor-list/opd-doctor-list.component';
import { OpdPharmacyViewComponent } from './opd-pharmacy-view/opd-pharmacy-view.component';
import { IndividualModule } from '../individual/individual.module';
import { ServiceProviderService } from './service-provider.service';
import { EditLabTestComponent, FilterByName } from './edit-lab-test/edit-lab-test.component';
import { UploadDiagnosticsTestComponent } from './upload-diagnostics-test/upload-diagnostics-test.component';
import { OPDAppointmentComponent } from './opd-appointment/opd-appointment.component';
import { PatientSearchByOPDComponent } from './patient-search-by-opd/patient-search-by-opd.component';
import { PatientDetailByOPDComponent } from './patient-detail-by-opd/patient-detail-by-opd.component';
import { ManageRoomComponent } from './manage-room/manage-room.component';
import { SidebarModule } from 'primeng/sidebar';
import { IpdServiceListComponent } from './ipd-service-list/ipd-service-list.component';
import { InpatientAdmissionComponent } from './inpatient-admission/inpatient-admission.component';
import { InpatientSummaryComponent } from './inpatient-summary/inpatient-summary.component';
import { InpatientBillRaiseComponent } from './inpatient-bill-raise/inpatient-bill-raise.component';
import { InpatientGenerateInvoiceComponent } from './inpatient-generate-invoice/inpatient-generate-invoice.component';
import { CommonService } from '../doctor/services/commonService';
import { PharmacyServicePincodeComponent } from './pharmacy-service-pincode/pharmacy-service-pincode.component';
import { PharmacyServicePincodeShowComponent } from './pharmacy-service-pincode-show/pharmacy-service-pincode-show.component';
import { ServiceProviderImageUploadComponent } from './service-provider-image-upload/service-provider-image-upload.component';
import { ServiceProviderHolidayComponent } from './service-provider-holiday/service-provider-holiday.component';
import { IpdPatientSummayComponent } from './ipd-patient-summay/ipd-patient-summay.component';
import { IpdOtManagementComponent } from './ipd-ot-management/ipd-ot-management.component';
import { ResourceAvailabilityCalendarComponent } from './resource-availability-calendar/resource-availability-calendar.component'
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
@NgModule({
  imports: [
    CommonModule,   
    InternationalPhoneModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceProviderRoutingModule,
    AutoCompleteModule,
    SharedModule,
    IndividualModule,
    SidebarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [
    ServiceProviderComponent,
    AddUserComponent,
    AddDoctorComponent,
    OpdPharmacyComponent,
    PharmacyComponent,
    SignupPharmacyComponent,
    OpdDoctorListComponent,
    OpdPharmacyViewComponent,
    UploadDiagnosticsTestComponent,
    EditLabTestComponent,
    FilterByName,
    ManageRoomComponent,
    OPDAppointmentComponent,//https://gitlab.com/sbis-poc/app/issues/1036
    PatientSearchByOPDComponent,PatientDetailByOPDComponent,//https://gitlab.com/sbis-poc/app/issues/1103
    IpdServiceListComponent, InpatientAdmissionComponent, InpatientSummaryComponent, //app#1438
    InpatientBillRaiseComponent, InpatientGenerateInvoiceComponent, PharmacyServicePincodeComponent, PharmacyServicePincodeShowComponent, //app#1499
    ServiceProviderImageUploadComponent,//app#1823
    ServiceProviderHolidayComponent, IpdPatientSummayComponent, IpdOtManagementComponent, //app#1886
    ResourceAvailabilityCalendarComponent
  ],
  providers: [
		ServiceProviderService,CommonService
	]
})
export class ServiceProviderModule { }
