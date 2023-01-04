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
//sbis-poc/app/issues/603
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueryFramworkComponent } from './query-framework.component';
import { QueryFrameworkQueryListComponent } from './query-framework-query-list/query-framework-query-list.component';

const routes: Routes = [

  
  {
    path: 'queryByCategory',
    component: QueryFrameworkQueryListComponent,
  },
  {
      path: ':queryId',
      component: QueryFramworkComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryFrameworkRoutingModule { }
