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
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';

import { ApiService } from './services/api.service';
// import { ToastService } from './services/toast.service';
import { MapService } from './services/map.service';
import { BroadcastService } from './services/broadcast.service'
import { AuthGuardService } from './guards/auth-guard.service';
import { GoBackGuardService } from './guards/go-back-guard.service';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';

import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angular-6-social-login-v2';
import { environment } from '../../environments/environment';
import { FeedbackComponent } from './components/feedback/feedback.component';
import {SidebarModule} from 'primeng/sidebar';
import { UserStateRuleService } from '../auth/userStateRuleService';
import { VideoChatSinglePageAppComponent } from './components/video-chat-single-page-app/video-chat-single-page-app.component';
import { VideoChatModule } from '../modules/video-chat-component/video-chat.module';

export function getAuthServiceConfigs() {
	const config = new AuthServiceConfig(
		[
			{
				id: GoogleLoginProvider.PROVIDER_ID,
				provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
			},
			{
				id: FacebookLoginProvider.PROVIDER_ID,
				provider: new FacebookLoginProvider(environment.FACEBOOK_APP_ID)
			}
		]);
	return config;
}

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
		MenuModule,
        MenubarModule,
        SocialLoginModule,
        SidebarModule,
        VideoChatModule
    ],
    //declarations: [FeedbackComponent],
    exports: [HttpClientModule,SidebarModule,VideoChatSinglePageAppComponent],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true,
    },
        AuthInterceptorService,
        ApiService,
        // ToastService,
        MapService,
        BroadcastService,
        AuthGuardService,
        GoBackGuardService,
        {
			provide: AuthServiceConfig,
			useFactory: getAuthServiceConfigs
        },
        UserStateRuleService,
		FeedbackComponent
		],
    declarations: [VideoChatSinglePageAppComponent]

})
export class CoreModule { }
