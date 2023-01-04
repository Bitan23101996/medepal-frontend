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
import { CommonModule } from '@angular/common';
import { QueryFramworkComponent } from './query-framework.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { QueryFrameworkRoutingModule } from './query-framework-routing.module';
import { QueryFrameworkQueryListComponent } from './query-framework-query-list/query-framework-query-list.component';

@NgModule({
  declarations: [QueryFramworkComponent, QueryFrameworkQueryListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    QueryFrameworkRoutingModule
  ]
})
export class QueryFrameworkModule { }
