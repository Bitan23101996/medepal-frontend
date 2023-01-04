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
import { SharedModule } from './../../shared/shared.module';

import {MatIconModule} from '@angular/material/icon';
import { MatCardModule, MatNativeDateModule, MatGridListModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDividerModule } from '@angular/material/divider';
import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';
import {MatDialogModule} from '@angular/material/dialog';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { PaymentService } from './payment.service';
import { RazorPayPaymentComponent } from './razor-pay-payment/razor-pay-payment.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';


@NgModule({
	imports: [
		PaymentRoutingModule,
		SharedModule,
		MatInputModule,
		MatButtonModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatGridListModule,
		MatCardModule,
		NgbModule,
		MatDividerModule,
		CarouselModule,
		WavesModule,
		ButtonsModule,
		MatDialogModule,
		MatIconModule
	],
	declarations: [
		PaymentComponent,
		RazorPayPaymentComponent,
		PaymentConfirmationComponent,
	],
	providers: [
		PaymentService
	]
})

export class PaymentModule { }

