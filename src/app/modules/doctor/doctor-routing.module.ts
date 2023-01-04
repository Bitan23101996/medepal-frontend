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

import { Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DoctorCalendarComponent } from "src/app/modules/doctor/doctor-calendar/doctor-calendar.component";
import { CancelAppointmentComponent } from "src/app/modules/doctor/cancel-appointment/cancel-appointment.component";
import { PrescriptionComponent } from "./prescription/prescription.component";
import { DoctorObservationComponent } from "./prescription/doctor-observation/doctor-observation.component";
import { VitalComponent } from "./prescription/vitals/vital.component";
import { PrescribedMedicationComponent } from "./prescription/prescribed-medication/prescribed-medication.component";
import { DoctorDiagnosisComponent } from "./prescription/doctor-diagnosis/doctor-diagnosis.component";
import { DoctorChamberComponent } from "./doctor-chamber/doctor-chamber.component";
import { DoctorProfileComponent } from "./doctor-profile/doctor-profile.component";
import { DoctorMyChamberComponent } from "./doctor-myChamber/doctor-myChamber.component";
import { DoctorComponent } from "./doctor.component";
import { DoctorAddressComponent } from "./doctor-address/doctor-address.component";
import { PrescriptionPreviewComponent } from "../../shared/component/prescription-preview/prescription-preview.component";
import { CreatePrescriptionComponent } from "./create-prescription/create-prescription.component";
import { AssistantComponent } from "./assistant/assistant.component";
import { DoctorHolidayListComponent } from './doctor-holiday-list/doctor-holiday-list.component';
import { DoctorUploadComponent } from './doctor-upload/doctor-upload.component';
import { ConfigureHomeVisitComponent } from './configure-home-visit/configure-home-visit.component';
import { ConfigureOnlineConsultationComponent } from './configure-online-consultation/configure-online-consultation.component';
import { ReferralForDoctorComponent } from './referral-for-doctor/referral-for-doctor.component';
import { MyDoctorReferralComponent } from './my-doctor-referral/my-doctor-referral.component';
import { ProcedureComponent } from '../../shared/component/procedure/procedure.component';
import { CreateAppointmentComponent } from '../../shared/component/create-appointment/create-appointment.component';


const routes: Routes = [
    {
        path: '',
        component: DoctorComponent,
        children: [
            {
                path: 'chamber',
                component: DoctorChamberComponent,

            },
            {
                path: 'profile',
                component: DoctorProfileComponent,

            },
            {
                path: 'calendar',
                component: DoctorCalendarComponent,

            },
            {
                path: 'cancelAppointment/cancel',
                component: CancelAppointmentComponent,
            },
            {
                path: 'cancelAppointment/holiday',
                component: CancelAppointmentComponent,
            },
            {
                path: 'prescription',
                component: PrescriptionComponent,
            },
            {
                path: 'prescription/doctorObservation',
                component: DoctorObservationComponent,
            },
            {
                path: 'prescription/vital',
                component: VitalComponent,
            },
            {
                path: 'prescription/prescribedMedication',
                component: PrescribedMedicationComponent,
            },
            {
                path: 'prescription/doctorDiagnosis',
                component: DoctorDiagnosisComponent,
            },
            {
                path: 'myChamber',
                component: DoctorMyChamberComponent,
            },
            {
                path: 'addresses',
                component: DoctorAddressComponent,
            },
            {
                path: 'prescriptionpreview/:appointmentRefNo',
                component: PrescriptionPreviewComponent,
            },
            {
                path: 'editChamber',
                component: DoctorChamberComponent,

            },
            {
                path: 'createPrescription',
                component: CreatePrescriptionComponent,

            },
            {
                path: 'assistant',
                component: AssistantComponent,

            },
            {
                path: 'holidayList',
                component: DoctorHolidayListComponent,

            },
            {
                path: 'doctor-upload',
                component: DoctorUploadComponent,

            },
            {
                path: 'configure-home-visit',
                component: ConfigureHomeVisitComponent,
            },
            {
                path: 'configure-online-consultation',
                component: ConfigureOnlineConsultationComponent,
            },
            {
                path: 'doctor-referral',
                component: ReferralForDoctorComponent
            },
            {
                path: 'my-doctor-referral',
                component: MyDoctorReferralComponent
            },
            {
                path: 'procedure',//issue number #765
                component: ProcedureComponent
            },
            {
                path: 'procedure/:procedureRefNo',//issue number #765
                component: ProcedureComponent
            },
            //Working on app/issues/1066
            {
                path: 'createAppointment',
                component: CreateAppointmentComponent,
            }
            // End Working on app/issues/1066
           
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DoctorRoutingModule { }