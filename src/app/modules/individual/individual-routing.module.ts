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
import { Routes, RouterModule } from '@angular/router';
import { IndividualComponent } from './individual.component';
import { UserProfileViewComponent } from './user-profile-view/user-profile-view.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { MedicalDetailsComponent } from './medical-details/medical-details.component';
import { UserFamilyComponent } from './user-family/user-family.component';
import { AddUserFamilyMemberComponent } from './add-user-family-member/add-user-family-member.component';
import { ViewMedicalRecordsComponent } from './view-medical-records/view-medical-records.component';
import { AddMedicalRecordsComponent } from './add-medical-records/add-medical-records.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserAddressComponent } from './user-profile-view/user-address/user-address.component';
import { UserProfileComponent } from './user-profile-view/user-profile/user-profile.component';
import { UserOccupationComponent } from './user-profile-view/user-occupation/user-occupation.component';
import { UserExerciseComponent } from './user-profile-view/user-exercise/user-exercise.component';
import { GroupViewMemberComponent } from '../individual/group-details/group-view-member/group-view-member.component';
import { UserVaccinationComponent } from '../../modules/individual/user-vaccination/user-vaccination.component';
import { GroupPermissionComponent } from '../../modules/individual/group-details/group-permission/group-permission.component';
import { UserLifeStyleComponent } from './user-profile-view/user-life-style/user-life-style.component';
import {OrderMedicineComponent } from './order-medicine/order-medicine.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyPrescriptionsComponent } from './my-prescriptions/my-prescriptions.component';
import { FetchCartedMedicineComponent } from './fetch-carted-medicine/fetch-carted-medicine.component';
import { DeliverAddressComponent } from './deliver-address/deliver-address.component';
import { ReviewCartedOrderComponent } from './review-carted-order/review-carted-order.component';
import { MyOrderDetailsComponent } from '../individual/my-order-details/my-order-details.component';
import { componentFactoryName } from '@angular/compiler';
import { AddMinorComponent } from '../individual/add-minor/add-minor.component';
import { AddMinorRequestComponent } from '../individual/add-minor-request/add-minor-request.component';
import { AllergyProcedureDiseaseComponent } from './allergy-procedure-diseases/allergy-procedure-diseases.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { OrderDiagnosticsComponent } from './order-diagnostics/order-diagnostics.component';
import { ReviewDiagnosticsComponent } from './review-diagnostics/review-diagnostics.component';
import { MyDiagnosticsComponent } from './my-diagnostics/my-diagnostics.component';
import { IndividualDashbComponent } from './individual-dashb/individual-dashb.component';
import { AuthGuardService } from 'src/app/core/guards/auth-guard.service';
import { IndInpatientSummaryComponent } from './ind-inpatient-summary/ind-inpatient-summary.component';
import { PermissionToViewRecordComponent } from './permission-to-view-record/permission-to-view-record.component';

const routes: Routes = [
    {
        path: '',
        component: IndividualComponent,
        children:[
            {
                path: 'user-profile-view/:tabName',
                component: UserProfileViewComponent, 
                canActivate: [AuthGuardService] 
            },
            {
                path: 'user-profile-edit/:tabName/:paramId',
                component: UserProfileEditComponent,
                canActivate: [AuthGuardService]  
            },
            {
                path: 'group-details',
                component: GroupDetailsComponent,  
                canActivate: [AuthGuardService]
            },
            {
                path: 'user-family/:groupId',
                component: UserFamilyComponent, 
                canActivate: [AuthGuardService] 
            },
            {
                path: 'add-user-family-member/:groupId',
                component: AddUserFamilyMemberComponent, 
                canActivate: [AuthGuardService] 
            },
            {
                path: 'medical-details',
                component: MedicalDetailsComponent,  
                canActivate: [AuthGuardService]
            },
            {
                path: 'view-medical-records',
                component: ViewMedicalRecordsComponent, 
                canActivate: [AuthGuardService] 
            },
            {
                path: 'add-medical-records',
                component: AddMedicalRecordsComponent,  
                canActivate: [AuthGuardService]
            },
            // {
            //     path: 'change-password',
            //     component: ChangePasswordComponent,  
            //     canActivate: [AuthGuardService]
            // },
            {
                path: 'tab-address',
                component: UserAddressComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'tab-personal',
                component: UserProfileComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'tab-occupation',
                component: UserOccupationComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'tab-exercise',
                component: UserExerciseComponent,
                canActivate: [AuthGuardService]
            },
			{
                path: 'user-life-style',
                component: UserLifeStyleComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'group-view-member',
                component: GroupViewMemberComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'user-vaccination',
                component: UserVaccinationComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'group-permission',
                component: GroupPermissionComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'order-medicine',
                component: OrderMedicineComponent
            },
            {
                path: 'order-medicines',
                component: OrderMedicineComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'order-medicine/:source',
                component: OrderMedicineComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'my-order',
                component: MyOrdersComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'my-prescription',
                component: MyPrescriptionsComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'fetch-carted-medicine',
                component: FetchCartedMedicineComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'deliver-address/:totalAmount',
                component: DeliverAddressComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'review-order/:totalAmount',
                component: ReviewCartedOrderComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'my-order-details',
                component: MyOrderDetailsComponent,
                canActivate: [AuthGuardService]
            },
            {
                path : 'minor-list',
                component : AddMinorComponent,
                canActivate: [AuthGuardService]
            },
            {
                path:'add-minor-request',
                component: AddMinorRequestComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'allergy-procedure-disease',
                component: AllergyProcedureDiseaseComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'drag-and-drop',
                component: DragAndDropComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'book-diagnostics',
                component: OrderDiagnosticsComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'review-diagnostics',
                component: ReviewDiagnosticsComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'my-diagnostics',
                component: MyDiagnosticsComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'inpatient-summary',
                component: IndInpatientSummaryComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'permission-to-view-record',
                component: PermissionToViewRecordComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'individual-dashb',
                component: IndividualDashbComponent,
                canActivate: [AuthGuardService]
            }
           
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndividualRoutingModule { }
