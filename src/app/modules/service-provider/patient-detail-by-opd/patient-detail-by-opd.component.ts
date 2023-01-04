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


import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format/date-format.pipe';
import { GetSet } from 'src/app/core/utils/getSet';

@Component({
    selector: 'app-patient-detail-by-opd',
    templateUrl: './patient-detail-by-opd.component.html',
    styleUrls: ['./patient-detail-by-opd.component.css'],
    providers: [DateFormatPipe]
})
export class PatientDetailByOPDComponent implements OnInit {

    screenFlag: any = "opd";
    selectedPatientRefNo: string;
    loggedInUser: any;

    constructor(private route: ActivatedRoute,
        private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    ngOnInit() {
        let selectedPatientDetails = JSON.parse(GetSet.getPatientDetails());//this.route.snapshot.paramMap.get('refno');
        this.selectedPatientRefNo = selectedPatientDetails.ref_no;
        this.loggedInUser = JSON.parse(localStorage.getItem('user'));        
    }
}//end of class
