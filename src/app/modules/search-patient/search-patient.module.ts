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
import { DoctorModule } from '../doctor';
import { SearchPatientComponent } from './search-patient.component';
import { SearchPatientRoutingModule } from './search-patient-routing.module';
import { PatientDetailByDoctorComponent } from './patient-detail-by-doctor/patient-detail-by-doctor.component';
import { SearchPatientByDoctorComponent } from './search-patient-by-doctor/search-patient-by-doctor.component';


@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    SearchPatientRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    DoctorModule
  ],
  declarations: [SearchPatientComponent, PatientDetailByDoctorComponent, SearchPatientByDoctorComponent]
})
export class SearchPatientModule {


 }
