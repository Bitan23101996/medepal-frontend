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
import { SharedModule } from './../shared/shared.module';
import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms.component';
/*import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { PrivacyComponent } from './privacy.component';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {SidebarModule} from 'primeng/sidebar';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angular-6-social-login-v2';*/
import { environment } from '../../environments/environment';
/*import { VerificationsComponent } from './verifications/verifications.component';
import { VerifyUrlComponent } from './verify-url/verify-url.component';
import { UserStateRuleService } from './userStateRuleService';
import { CookieLawModule } from 'angular2-cookie-law';
import { ChangePasswordFirstloginComponent } from './change-password-firstlogin/change-password-firstlogin.component';
import { AuthGuardService } from '../core/guards/auth-guard.service'; */

/*export function getAuthServiceConfigs() {
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
}*/

@NgModule({
	imports: [
		TermsRoutingModule,
		SharedModule
		/*AuthRoutingModule,
		SharedModule,
		SocialLoginModule,
		CookieLawModule,
		SidebarModule*/
	],
	declarations: [
		TermsComponent
		/*AuthComponent,
		LoginComponent,
		SignUpComponent,
		VerificationsComponent,
		VerifyUrlComponent,
		LandingComponent,
		ChangePasswordFirstloginComponent*/
	],
	providers: [
		/*UserStateRuleService,
		AuthService,
		{
			provide: AuthServiceConfig,
			useFactory: getAuthServiceConfigs
		},
		AuthGuardService*/

	]
})

export class TermsModule { }
