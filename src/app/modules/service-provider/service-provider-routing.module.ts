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
import { AddUserComponent } from "./add-user/add-user.component";
import { AddDoctorComponent } from "./add-doctor/add-doctor.component";
import { OpdPharmacyComponent } from "./opd-pharmacy/opd-pharmacy.component";
import { ServiceProviderComponent } from "./service-provider.component";
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { SignupPharmacyComponent } from './pharmacy/signup-pharmacy/signup-pharmacy.component';
import { OpdDoctorListComponent } from "./opd-doctor-list/opd-doctor-list.component";
import { OpdPharmacyViewComponent } from "./opd-pharmacy-view/opd-pharmacy-view.component";
import { EditLabTestComponent } from './edit-lab-test/edit-lab-test.component';
import { UploadDiagnosticsTestComponent } from './upload-diagnostics-test/upload-diagnostics-test.component';
import { OPDAppointmentComponent } from './opd-appointment/opd-appointment.component';
import { PatientSearchByOPDComponent } from './patient-search-by-opd/patient-search-by-opd.component';
import { PatientDetailByOPDComponent } from './patient-detail-by-opd/patient-detail-by-opd.component';
import { ManageRoomComponent } from './manage-room/manage-room.component';
import { IpdServiceListComponent } from './ipd-service-list/ipd-service-list.component';
import { InpatientAdmissionComponent } from './inpatient-admission/inpatient-admission.component';
import { InpatientSummaryComponent } from './inpatient-summary/inpatient-summary.component';
import { InpatientBillRaiseComponent } from './inpatient-bill-raise/inpatient-bill-raise.component';
import { InpatientGenerateInvoiceComponent } from './inpatient-generate-invoice/inpatient-generate-invoice.component';
import { PharmacyServicePincodeComponent } from "./pharmacy-service-pincode/pharmacy-service-pincode.component";
import { PharmacyServicePincodeShowComponent } from './pharmacy-service-pincode-show/pharmacy-service-pincode-show.component';
import { ServiceProviderImageUploadComponent } from './service-provider-image-upload/service-provider-image-upload.component'
import { ServiceProviderHolidayComponent } from './service-provider-holiday/service-provider-holiday.component';
import { IpdPatientSummayComponent } from './ipd-patient-summay/ipd-patient-summay.component';
import { IpdOtManagementComponent } from './ipd-ot-management/ipd-ot-management.component';
import { ResourceAvailabilityCalendarComponent } from './resource-availability-calendar/resource-availability-calendar.component'
const routes: Routes = [
    {
        path: '',
        component: ServiceProviderComponent,
        children: [
            {
                path: 'opdPharmacyView/opd',
                component: OpdPharmacyViewComponent,

            },
            {
                path: 'opdPharmacyView/pharmacy',
                component: OpdPharmacyViewComponent,

            },
            {
                path: 'opdPharmacyView/diagnostics',
                component: OpdPharmacyViewComponent,

            },
            {
                path: 'addUser/opd',
                component: AddUserComponent,

            },

            {
                path: 'addDoctor',
                component: AddDoctorComponent,

            },

            {
                path: 'addOpd',
                component: OpdPharmacyComponent,

            },
            {
                path: 'my-service-provider/myOpd',
                component: OpdPharmacyComponent,

            },
            {
                path: 'addPharmacy',
                component: OpdPharmacyComponent,

            },
            {
                path: 'addDiagnostics',
                component: OpdPharmacyComponent,

            },
            {
                path: 'my-service-provider/myPharmacy',
                component: OpdPharmacyComponent,

            },
            {
                path: 'my-service-provider/myDiagnostics',
                component: OpdPharmacyComponent,

            },
            {
                path: 'diagnostics/addUser',
                component: AddUserComponent,

            },
            {
                path: 'diagnostics/uploadTest',
                component: UploadDiagnosticsTestComponent,
            },
            {
                path: 'adduser/pha',
                component: AddUserComponent,

            },
            {
                path: 'pharmacy',
                component: PharmacyComponent
                // children:[
                //     {
                //         path: 'signupPharmacy',
                //         component: SignupPharmacyComponent,
                //     }
                // ]
            },
            {
                path: 'hospital',
                component: PharmacyComponent
            },
            {
                path: 'opdDoctorList',
                component: OpdDoctorListComponent
            },
            {
                path: 'editLabTest',
                component: EditLabTestComponent
            } ,
            // Working on app/issues/1438
           {
               path: 'ipd-service-list',
               component: IpdServiceListComponent
           },
           // End Working on app/issues/1438           
           {
                path: 'inpatient-admission',
                component: InpatientAdmissionComponent
            },

             // Working on app/issues/1499
            {
                 path: 'patient-bill-raise/:admissionRefNo',
                component: InpatientBillRaiseComponent
            },
              // End Working on app/issues/1499
              // Working on app/issues/1496
            {
                path: 'generate-invoice/:admissionRefNo',
               component: InpatientGenerateInvoiceComponent
            },
             // End Working on app/issues/1496      
             
            // Working on app/issues/1496
            {
                path: 'pharmacy-service-pincode',
               component: PharmacyServicePincodeComponent
            },
            {
                path: 'pharmacy-service-pincode-show',
               component: PharmacyServicePincodeShowComponent
            },
             // End Working on app/issues/1496 
            // Working on app/issues/1823
            {
                path: 'file-upload',
               component: ServiceProviderImageUploadComponent
            },
            // End Working on app/issues/1823
            // Working on app/issues/1886
            {
                path: 'holiday',
                component: ServiceProviderHolidayComponent
            },
            // End Working on app/issues/1886
            {
                path: 'operation-theater_management',
                component: IpdOtManagementComponent
            },
            // End Working on app/issues/2471 
            {
                path:'resource-availability-calendar',
                component:ResourceAvailabilityCalendarComponent
            }
            
    
            
        ]        
    },{//https://gitlab.com/sbis-poc/app/issues/1036
        path: 'appointments',
        component: OPDAppointmentComponent
    },{
        path: 'appointments/req',
        component: OPDAppointmentComponent       
    },{//https://gitlab.com/sbis-poc/app/issues/1103
        path: 'search-patient',
        component: PatientSearchByOPDComponent
    },{
        path: 'patient-detail-view',
        component: PatientDetailByOPDComponent
    },{
        path: 'room',
        component: ManageRoomComponent
    },
    {
        path: 'inpatient-summary',
        component: InpatientSummaryComponent
    },
    {
        path: 'ipd-patient',
        component: IpdPatientSummayComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceProviderRoutingModule { }