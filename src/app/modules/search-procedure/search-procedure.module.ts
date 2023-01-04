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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchProcedureRoutingModule } from './search-procedure-routing.module';
import { SearchProcedureByDoctorComponent } from './search-procedure-by-doctor/search-procedure-by-doctor.component';
import { SearchProcedureComponent } from './search-procedure.component';
// import { DoctorModule } from '../doctor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SearchProcedureRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    // DoctorModule
  ],
  declarations: [SearchProcedureByDoctorComponent,SearchProcedureComponent]
})
export class SearchProcedureModule {


}
