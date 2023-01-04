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
import { RouterModule, Routes } from '@angular/router';
import { SearchProcedureByDoctorComponent } from './search-procedure-by-doctor/search-procedure-by-doctor.component';
import { SearchProcedureComponent } from './search-procedure.component';

const routes: Routes = [
  {
    path: '',
    component: SearchProcedureComponent,
    children: [
      {
        path: '',
        component: SearchProcedureByDoctorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchProcedureRoutingModule {

}
