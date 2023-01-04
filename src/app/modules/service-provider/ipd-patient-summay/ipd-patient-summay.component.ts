// <!--/*
//  *  * |///////////////////////////////////////////////////////////////////////|
//  *  * |                                                                       |
//  *  * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
//  *  * | All Rights Reserved                                                   |
//  *  * |                                                                       |
//  *  * | This document is the sole property of StellaBlue Interactive          |
//  *  * | Services Pvt. Ltd.                                                    |
//  *  * | No part of this document may be reproduced in any form or             |
//  *  * | by any means - electronic, mechanical, photocopying, recording        |
//  *  * | or otherwise - without the prior written permission of                |
//  *  * | StellaBlue Interactive Services Pvt. Ltd.                             |
//  *  * |                                                                       |
//  *  * |///////////////////////////////////////////////////////////////////////|
//  *  */-->
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetSet } from '../../../core/utils/getSet';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { TranslateService } from '@ngx-translate/core';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'app-ipd-patient-summay',
  templateUrl: './ipd-patient-summay.component.html',
  styleUrls: ['./ipd-patient-summay.component.css'],
  providers: [DateFormatPipe]
})
export class IpdPatientSummayComponent implements OnInit {

  admissionRefNo: any;
  userRefNo: any;
  screenFlag: any="ipd";
  patientDetails: any;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private broadcastService: BroadcastService,
  ) { 
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    // let admission = JSON.parse(this.route.snapshot.paramMap.get("admission"));
    this.broadcastService.setHeaderText("");
    let admission = GetSet.getAdmission();
    this.patientDetails = JSON.parse(GetSet.getPatientDetails());
    
    if(admission==null){
      admission=JSON.parse(localStorage.getItem("admission"));
    }
    else{
      localStorage.setItem("admission", JSON.stringify(admission));
    }
    if(this.patientDetails==null){
      this.patientDetails = JSON.parse(localStorage.getItem("patient"));
    }
    else{
      localStorage.setItem("patient", JSON.stringify(this.patientDetails));
    }
    console.log(admission);
    this.admissionRefNo = admission.admissionRefNo;
    this.userRefNo = admission.userRefNo;
  }

  ngOnDestroy(){
    //localStorage.removeItem("admission");
  }

}
