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
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../shared/shared.module';

import { PharmacyComponent } from './pharmacy.component';
import { PharmacyService } from './pharmacy.service';
import { PharmaRoutingModule } from './pharma-routing.module';
import { SignupPharmacyComponent } from './signup-pharmacy/signup-pharmacy.component';

@NgModule({
  imports: [
    PharmaRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [PharmacyComponent, SignupPharmacyComponent],
  providers: [
		PharmacyService
	]
})
export class PharmaModule { }
