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
// /sbis-poc/app/issues/936
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from './../../shared/shared.module';
import {DropdownModule} from 'primeng/primeng';
import { CustomAnalysticQueryComponent } from './custom-analystic-query/custom-analystic-query.component';
import { CustomAnalysticQueryRoutingModule } from './custom-analystic-query-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [CustomAnalysticQueryComponent],
  imports: [
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    CustomAnalysticQueryRoutingModule,
    TranslateModule,
    DropdownModule
  ]
})
export class CustomAnalysticQueryModule { }
