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

import { CustomFormRoutingModule } from './custom-form-routing.module';
import { CustomFormMasterComponent } from './custom-form-master/custom-form-master.component';
import { CustomFormComponent } from './custom-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { CustomFormService } from './custom-form.service';
import { CustomFormListComponent } from './custom-form-list/custom-form-list.component';
import { CustomFormFillupComponent } from './custom-form-fillup/custom-form-fillup.component';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  declarations: [CustomFormComponent, CustomFormMasterComponent, CustomFormListComponent, CustomFormFillupComponent],
  imports: [
    CommonModule,
    CustomFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    SidebarModule
  ],
  providers: [CustomFormService]
})
export class CustomFormModule { }
