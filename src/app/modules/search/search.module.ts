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
import { ClickOutsideModule } from 'ng-click-outside';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';

import {MatIconModule} from '@angular/material/icon';
import { MatCardModule, MatNativeDateModule, MatGridListModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDividerModule } from '@angular/material/divider';
import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';
import {MatDialogModule} from '@angular/material/dialog';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { RadioButtonModule } from 'primeng/radiobutton';

import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
@NgModule({
	imports: [
		ClickOutsideModule,
		SearchRoutingModule,
		SharedModule,
		MatInputModule,
		MatButtonModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatGridListModule,
		MatCardModule,
		NgbModule,
		MatDividerModule,
		CarouselModule,
		WavesModule,
		ButtonsModule,
		MatDialogModule,
		MatIconModule,
		RadioButtonModule,
		AgmCoreModule.forRoot({
			apiKey: environment.GOOGLE_API_KEY//'AIzaSyBWVyk6Tdm6Hpl_nA_IssRZFoxGMXjM1dU'
		})
	],
	declarations: [
		SearchComponent,
	],
	providers: [
		SearchService
	]
})

export class SearchModule { }
