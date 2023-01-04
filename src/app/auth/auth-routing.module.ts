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
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LandingComponent } from './landing/landing.component';
import { VerificationsComponent } from './verifications/verifications.component';
import { VerifyUrlComponent } from './verify-url/verify-url.component';
import { ChangePasswordFirstloginComponent } from './change-password-firstlogin/change-password-firstlogin.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children:[
        {
            path: 'login',
            component: LoginComponent,   
        },
        {
            path: 'signUp',
            component: SignUpComponent,   
        },
        {
            path: 'verifications',
            component: VerificationsComponent,   
        },
        {
            path: 'verify',
            component: VerifyUrlComponent,
        },
        {
            path: 'landing',
            component: LandingComponent,
        }, {
            path: 'landings',
            component: LandingComponent,
        },
        {
            path: 'change-password',
            component: ChangePasswordFirstloginComponent,
        }
    ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
