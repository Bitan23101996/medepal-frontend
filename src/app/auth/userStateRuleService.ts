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

import { Component, OnInit } from '@angular/core';

export class UserStateRuleService {
    
    
    userNevigationRules = {
        "IN_USER_PROFILE_VERIFICATION_NOT_DONE":"/auth/verifications",
        //"IN_USER_AFTER_PROFILE_VERIFICATION_LANDING_STRING":"/individual/my-order-details",
        "IN_USER_AFTER_PROFILE_VERIFICATION_LANDING_STRING":"/individual/individual-dashb",
        "IN_USER_CHANGE_PASSWORD_LANDING_STRING": "/auth/change-password",
        "DOC_USER_CHANGE_PASSWORD_LANDING_STRING": "/auth/change-password",
        "SERVICE_PROVIDER_CHANGE_PASSWORD_LANDING_STRING": "/auth/change-password",
        "SYSADMIN_CHANGE_PASSWORD_LANDING_STRING": "/auth/change-password",

        "DOC_USER_PROFILE_VERIFICATION_NOT_DONE":"/auth/verifications",
        "DOC_USER_AFTER_PROFILE_VERIFICATION_BEFORE_PROFILE_SAVE":"doctor/profile",
        "DOC_USER_AFTER_PROFILE_VERIFICATION_AFTER_PROFILE_SAVE":"searchPatient",
        "DOC_P2P_USER_LANDING_STRING":"peerconsulting/peer-consulting-panel-list",
        "ASSISTANT_USER_AFTER_PROFILE_VERIFICATION":"searchPatient", // app#974

        //Working om app/issues/746
        "DOCTOR_PROFILE_NAVIGATION_IF_BLANK_REQUIRED_DATA":"doctor/profile",
        "DOCTOR_CHAMBER_NAVIGATION_IF_NO_CHAMBER_REGISTERED_WITH":"doctor/chamber",
        //End Working om app/issues/746

         //Working om app/issues/990
         "DOCTOR_BILLING_PLAN_NAVIGATE_IF_NO_PLAN_SELECTED":"billing/plan",
         "DOCTOR_CONTRACT_NAVIGATE_IF_NOT_SIGNED":"billing/contract",
         //End Working om app/issues/990

        //Working om app/issues/782
        "IN_USER_ADDRESS_NAVIGATION_IF_NO_ADDRESS_REGISTERED_WITH" : "individual/tab-address",
        //End Working om app/issues/782

        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_NOT_DONE":"/auth/verifications",
        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_HOSPITAL_ADMIN":"/opd/appointments",
        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_PHARMACY_ADMIN":"/opd/opdPharmacyView/pharmacy",
        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_HOSPITAL_OPERATOR":"/opd/appointments",
        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_PHARMACY_OPERATOR":"/opd/opdPharmacyView/pharmacy",
        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_DIAGNOSTICS_ADMIN" : "/opd/opdPharmacyView/diagnostics",
        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_DIAGNOSTICS_OPERATOR": "/opd/opdPharmacyView/diagnostics",
        // "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_HOSPITAL_ADMIN":"/opd/my-service-provider/myOpd",
        // "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_PHARMACY_ADMIN":"/opd/my-service-provider/myPharmacy",
        // "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_HOSPITAL_OPERATOR":"/opd/my-service-provider/myOpd",
        // "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_PHARMACY_OPERATOR":"/opd/my-service-provider/myPharmacy",
        "SYSADMIN_AFTER_PROFILE_VERIFICATION_LANDING":"/sysadmin/verify-doctor",


        "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_HOSPITAL_BOOKING": "/doctor/calendar"
    }
    
}

