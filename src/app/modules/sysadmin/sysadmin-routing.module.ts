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
import { SysAdminComponent } from "./sysadmin.component";
import { VerifyDoctorRegistrationComponent } from './verify-doctor-registration/verify-doctor-registration.component';
import { SearchDoctorToVerifyComponent } from './search-doctor-to-verify/search-doctor-to-verify.component';
import { SearchUserComponent } from './search-user/search-user.component';  //working on system admin issue[set password for a user]

const routes: Routes = [
    {
        path: '',
        component: SysAdminComponent,
        children: [
            {
                path: 'verify-doctor',
                component: VerifyDoctorRegistrationComponent,
            },
            {
                path: 'search-doctor',
                component: SearchDoctorToVerifyComponent,
            },
            {//working on system admin issue[set password for a user]
                path: 'search-user',
                component: SearchUserComponent
            }
        ]
        
    },
    

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SysAdminRoutingModule { }