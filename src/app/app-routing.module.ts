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
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { GoBackGuardService } from './core/guards/go-back-guard.service';
import { DoctorChamberComponent } from 'src/app/modules/doctor/doctor-chamber/doctor-chamber.component';
import { ConfirmationPageComponent } from './shared/component/confirmation-page/confirmation-page.component';
import { PaymentConfirmationComponent } from './modules/payment/payment-confirmation/payment-confirmation.component';
import { VideoChatSinglePageAppComponent } from './core/components/video-chat-single-page-app/video-chat-single-page-app.component';

const routes: Routes = [
    { path: '', redirectTo: 'auth/landing', pathMatch: 'full' },
    {
        path: 'auth',
        // canActivate:[AuthGuardService],
        loadChildren: 'src/app/auth/auth.module#AuthModule'
    },
	{
        path: 'privacy',
        loadChildren: 'src/app/privacy/privacy.module#PrivacyModule'
    },
	{
        path: 'terms',
        loadChildren: 'src/app/terms/terms.module#TermsModule'
    },
    {
        path: 'individual',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        loadChildren: 'src/app/modules/individual/individual.module#IndividualModule'
    },
    {
        path: 'dashboard',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: 'src/app/modules/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'search',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        loadChildren: 'src/app/modules/search/search.module#SearchModule'
    },
    {
        path: 'doctor',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: 'src/app/modules/doctor/doctor.module#DoctorModule'
        //component : DoctorChamberComponent
    },
	    {
        path: 'payment',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: 'src/app/modules/payment/payment.module#PaymentModule'
    },
	    {
        path: 'appoinment',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: 'src/app/modules/appoinment/appoinment.module#AppoinmentModule'
    },
    {
        path: 'pharmacy',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: 'src/app/modules/pharmacy/pharmacy.module#PharmaModule'
    },
    {
        path: 'opd',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/service-provider/service-provider.module#ServiceProviderModule'
    },
    {
        path: 'pharmacy',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/service-provider/service-provider.module#ServiceProviderModule'
    },
    {
        path: 'searchPatient',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/fetch-patient/fetch-patient.module#FetchPatientModule'
    },
     {//issue number 765 -- [A procedure submenu has been added which looks like search patient by doctor page]
        path: 'searchProcedureByDoctor',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/search-procedure/search-procedure.module#SearchProcedureModule'
    },//end of issue number 
    {
        path: 'sysadmin',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/sysadmin/sysadmin.module#SysadminModule'
    },
    {
        path: 'pharmacyRequisition',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/pharmacy-requisition/pharmacy-requisition.module#PharmacyRequisitionModule'
    },
    {
        path: 'searchPatientByDoctor',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/search-patient/search-patient.module#SearchPatientModule'
    },
    {
        path: 'peerconsulting',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/peer-consulting/peer-consulting.module#PeerConsultingModule'
    },
    {
        path: 'delivery',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/delivery/delivery.module#DeliveryModule'
    },
    //sbis-poc/app/issues/603
    {
        path: 'query-framework',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/query-framework/query-framework.module#QueryFrameworkModule'
    },
    //Working on app/issues/990
    {
        path: 'billing',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/billing/billing.module#BillingModule'
    },
    //Working on app/issues/990
    {
        path: 'change-password',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/change-password/change-password.module#ChangePasswordModule'
    },
    {
        path: 'confirmation/:confirmationFor',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        component: ConfirmationPageComponent
        // loadChildren: 'src/app/shared/component/confirmation-page/'
    },
    {
        path: 'confirmation',
        // canLoad: [AuthGuardService, GoBackGuardService],
        // canDeactivate: [GoBackGuardService],
        // canActivate: [AuthGuardService],
        loadChildren: './modules/confirmation/confirmation.module#ConfirmationModule'
    },
    {
        path: 'custom-analytic-query',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/custom-analystic-query/custom-analystic-query.module#CustomAnalysticQueryModule'

    },
    {
        path: 'custom-form',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/custom-form/custom-form.module#CustomFormModule'
    },
    {
        path: 'video-consulting/:onlineConsultLink', //single page video chat app
        component: VideoChatSinglePageAppComponent
    },
    {
        path: 'payee-account-details',
        canLoad: [AuthGuardService, GoBackGuardService],
        canDeactivate: [GoBackGuardService],
        canActivate: [AuthGuardService],
        loadChildren: './modules/payee-account-details/payee-account-details.module#PayeeAccountDetailsModule'
    },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
