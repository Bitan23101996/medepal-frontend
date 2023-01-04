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
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from './../../shared/shared.module';

import { IndividualRoutingModule } from './individual-routing.module';
import { IndividualComponent } from './individual.component';
import { IndividualService } from './individual.service';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { MedicalDetailsComponent } from './medical-details/medical-details.component';
import { UserProfileViewComponent } from './user-profile-view/user-profile-view.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { UserFamilyComponent } from './user-family/user-family.component';
import { AddUserFamilyMemberComponent } from './add-user-family-member/add-user-family-member.component';
import { ViewMedicalRecordsComponent } from './view-medical-records/view-medical-records.component';
import { AddMedicalRecordsComponent } from './add-medical-records/add-medical-records.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserAddressComponent } from './user-profile-view/user-address/user-address.component';
import { UserProfileComponent } from './user-profile-view/user-profile/user-profile.component';
import { UserOccupationComponent } from './user-profile-view/user-occupation/user-occupation.component';
import { UserExerciseComponent } from './user-profile-view/user-exercise/user-exercise.component';
import { GroupViewMemberComponent } from './group-details/group-view-member/group-view-member.component';
import { UserVaccinationComponent } from './user-vaccination/user-vaccination.component';
import { GroupPermissionComponent } from './group-details/group-permission/group-permission.component';
import { UserLifeStyleComponent } from './user-profile-view/user-life-style/user-life-style.component';
import { OrderMedicineComponent } from './order-medicine/order-medicine.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyPrescriptionsComponent } from './my-prescriptions/my-prescriptions.component';
import { FetchCartedMedicineComponent } from './fetch-carted-medicine/fetch-carted-medicine.component';
import { DeliverAddressComponent } from './deliver-address/deliver-address.component';
import { ReviewCartedOrderComponent } from './review-carted-order/review-carted-order.component';
import { MyOrderDetailsComponent } from './my-order-details/my-order-details.component';
import { environment } from '../../../environments/environment';
import { AddMinorComponent } from './add-minor/add-minor.component';
import { AddMinorRequestComponent } from './add-minor-request/add-minor-request.component';
import { AllergyProcedureDiseaseComponent } from './allergy-procedure-diseases/allergy-procedure-diseases.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { OrderDiagnosticsComponent } from './order-diagnostics/order-diagnostics.component';
import { StepsModule } from 'primeng/steps';
import { ReviewDiagnosticsComponent } from './review-diagnostics/review-diagnostics.component';
import { MyDiagnosticsComponent } from './my-diagnostics/my-diagnostics.component';
import { IndividualDashbComponent } from './individual-dashb/individual-dashb.component';
import {IndInpatientSummaryComponent} from './ind-inpatient-summary/ind-inpatient-summary.component';
import { SidebarModule } from 'primeng/sidebar';
import { PermissionToViewRecordComponent } from './permission-to-view-record/permission-to-view-record.component';
@NgModule({
	imports: [
		IndividualRoutingModule,
		SharedModule,
		AgmCoreModule.forRoot({
			apiKey: environment.GOOGLE_API_KEY//'AIzaSyBWVyk6Tdm6Hpl_nA_IssRZFoxGMXjM1dU'
		}),
		StepsModule,
		SidebarModule
	],
	declarations: [
		IndividualComponent,
		UserProfileViewComponent,
		ChangePasswordComponent,
		GroupDetailsComponent,
		MedicalDetailsComponent,
		UserProfileViewComponent,
		UserProfileEditComponent,
		UserFamilyComponent,
		AddUserFamilyMemberComponent,
		ViewMedicalRecordsComponent,
		AddMedicalRecordsComponent,
		UserAddressComponent,
		UserProfileComponent,
		UserOccupationComponent,
		UserExerciseComponent,
		GroupViewMemberComponent,
		UserVaccinationComponent,
		GroupPermissionComponent,
		UserLifeStyleComponent,
		OrderMedicineComponent,
		MyOrdersComponent,
		MyPrescriptionsComponent,
		FetchCartedMedicineComponent,
		DeliverAddressComponent,
		ReviewCartedOrderComponent,
		MyOrderDetailsComponent,
		AddMinorComponent,
		AddMinorRequestComponent,
		AllergyProcedureDiseaseComponent,
		DragAndDropComponent,
		OrderDiagnosticsComponent,
		ReviewDiagnosticsComponent,
		MyDiagnosticsComponent,IndInpatientSummaryComponent, PermissionToViewRecordComponent,IndividualDashbComponent
	],
	providers: [
		IndividualService
	]
})

export class IndividualModule { }
