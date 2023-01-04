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
import { PeerConsultingRequestComponent } from './peer-consulting-request/peer-consulting-request.component';
import { PeerConsultingComponent } from './peer-consulting.component';
import { PeerConsultingRoutingModule } from './peer-consulting-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { PeerConsultingPanelListComponent } from './peer-consulting-panel-list/peer-consulting-panel-list.component';
import { PeerConsultingCaseDetailsComponent } from './peer-consulting-case-details/peer-consulting-case-details.component';

@NgModule({
  imports: [
    CommonModule,
    PeerConsultingRoutingModule,
    SharedModule
  ],
  declarations: [PeerConsultingRequestComponent, PeerConsultingComponent, PeerConsultingPanelListComponent, PeerConsultingCaseDetailsComponent]
})
export class PeerConsultingModule { }
