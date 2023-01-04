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
import { RouterModule, Routes } from '@angular/router';
import { SearchPatientComponent } from './search-patient.component';
import { PatientDetailByDoctorComponent } from './patient-detail-by-doctor/patient-detail-by-doctor.component';
import { SearchPatientByDoctorComponent } from './search-patient-by-doctor/search-patient-by-doctor.component';

const routes: Routes = [
  {
      path: '',
      component: SearchPatientComponent,
      children: [
        {
          path: '',
                component: SearchPatientByDoctorComponent,
                // children: [
                //   {
                //       path: 'patientDetailForDoctor',
                //       component: PatientDetailByDoctorComponent
                //   }
                // ]
        },
        {
          path: 'patientDetailForDoctor',
                component: PatientDetailByDoctorComponent,
        }
      ]

  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPatientRoutingModule {
  
 }
