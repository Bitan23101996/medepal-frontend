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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatRippleModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DoctorCalendarComponent } from 'src/app/modules/doctor/doctor-calendar/doctor-calendar.component';
import {MatMenuModule} from '@angular/material/menu';
import {SharedModule} from './../../shared/shared.module';
import { CancelAppointmentComponent } from 'src/app/modules/doctor/cancel-appointment/cancel-appointment.component';
import {AutoCompleteModule} from 'primeng/primeng';
import { PrescriptionComponent } from './prescription/prescription.component';
import { DoctorObservationComponent } from './prescription/doctor-observation/doctor-observation.component';
import { VitalComponent } from './prescription/vitals/vital.component';
import { PatientProblemNarrationComponent } from './prescription/patient-problem-narration/patient-problem-narration.component';
import { PrescribedLabTestComponent } from './prescription/prescribed-lab-test/prescribed-lab-test.component';
import { PrescribedMedicationComponent } from './prescription/prescribed-medication/prescribed-medication.component';
import { DoctorDiagnosisComponent } from './prescription/doctor-diagnosis/doctor-diagnosis.component';
import { AdviceComponent } from './prescription/advice/advice.component';
import { DoctorChamberComponent } from './doctor-chamber/doctor-chamber.component';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { DoctorMyChamberComponent } from './doctor-myChamber/doctor-myChamber.component';
import { TimepickerModule } from 'ngx-bootstrap';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DoctorComponent } from './doctor.component';
import { DoctorAddressComponent } from './doctor-address/doctor-address.component';
import {IndividualModule} from './../individual/individual.module';
import { CreatePrescriptionComponent } from './create-prescription/create-prescription.component';
import { DoctorNoteComponent } from './prescription/doctor-note/doctor-note.component';
import { DoctorReferralComponent } from './prescription/doctor-referral/doctor-referral.component';
import { AssistantComponent } from './assistant/assistant.component';
import { DoctorHolidayListComponent } from './doctor-holiday-list/doctor-holiday-list.component';
import {SidebarModule} from 'primeng/sidebar';
import { DoctorUploadComponent } from './doctor-upload/doctor-upload.component';
import { ConfigureHomeVisitComponent } from './configure-home-visit/configure-home-visit.component';
import { PatientDetailByDoctorComponent } from '../search-patient/patient-detail-by-doctor/patient-detail-by-doctor.component';
import { ConfigureOnlineConsultationComponent } from './configure-online-consultation/configure-online-consultation.component';
import { ReferralForDoctorComponent } from './referral-for-doctor/referral-for-doctor.component';
import { MyDoctorReferralComponent } from './my-doctor-referral/my-doctor-referral.component';
import { prescribeMedicinePipe } from '../../shared/pipes/prescription/prescribe-medicine.pipe';
// import { ProcedureComponent } from '../../shared/component/procedure/procedure.component';
import { ImmunizationComponent } from './prescription/immunization/immunization.component';
//import { VideoChatModule } from '../video-chat-component/video-chat.module';



@NgModule({
  imports: [
    CommonModule,    
    DoctorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRippleModule,
    //BrowserAnimationsModule,
    MatMenuModule,
    NgbModule,
    SharedModule,
    AutoCompleteModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxMaterialTimepickerModule.forRoot(),
    IndividualModule,
    SidebarModule
  ],
  exports: [prescribeMedicinePipe],
  declarations: [
    DoctorComponent,
    DoctorChamberComponent,
    DoctorProfileComponent,
    DoctorCalendarComponent,
    CancelAppointmentComponent,
    PrescriptionComponent,
    DoctorObservationComponent,
    VitalComponent,
    PatientProblemNarrationComponent,
    PrescribedLabTestComponent,
    PrescribedMedicationComponent,
    DoctorDiagnosisComponent,
    AdviceComponent,
    DoctorMyChamberComponent,
    DoctorAddressComponent,
    CreatePrescriptionComponent,
    DoctorNoteComponent,
    DoctorReferralComponent,
    AssistantComponent,
    DoctorHolidayListComponent,
    DoctorUploadComponent,
    ConfigureHomeVisitComponent,
    ConfigureOnlineConsultationComponent,
    ReferralForDoctorComponent,
    MyDoctorReferralComponent,
    //PatientDetailByDoctorComponent,
    // ProcedureComponent,
    ImmunizationComponent
    
  ]
})
export class DoctorModule { }
