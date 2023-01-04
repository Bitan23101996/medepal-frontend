import { AdvanceSearchPipe } from './appoinment-search.pipe';
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
import { SharedModule } from '../../shared/shared.module';
import { AppoinmentRoutingModule } from './appoinment-routing.module';
import { AppoinmentComponent } from './appoinment.component';
import { AppoinmentService } from './appoinment.service';

import { MatCardModule, MatNativeDateModule, MatGridListModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDividerModule } from '@angular/material/divider';
import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';
import {MatIconModule} from '@angular/material/icon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DoctorModule } from '../doctor';
import { SidebarModule } from 'primeng/sidebar';
import { VideoChatModule } from '../video-chat-component/video-chat.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppoinmentRoutingModule,
    MatDialogModule,
    MatCardModule, MatNativeDateModule, MatGridListModule, MatInputModule,
    MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule,
    FormsModule,
		ReactiveFormsModule,
		NgbModule,
		MatDividerModule,
		CarouselModule,
		WavesModule,
		ButtonsModule,
		MatDialogModule,
		MatIconModule,
    RadioButtonModule,
    DoctorModule,
    SidebarModule,VideoChatModule
  ],
  declarations: [AppoinmentComponent, AdvanceSearchPipe],
  providers: [
    AppoinmentService
  ]
})
export class AppoinmentModule { }
