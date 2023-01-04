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

import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BroadcastService } from '../../core/services/broadcast.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  headerText:any;

  /* Working on app/issues/782 */
  isRegistrationWorkflowCompleted: boolean = false;
  // isValidProfile: boolean = false;
  workflowSteps: any = [];
  workflow: any;
  currentStepNo: any;
  pageHeader: string;
  /*End Working on app/issues/782 */

  constructor(private _location: Location,
              private translate: TranslateService,
              private broadcastService: BroadcastService)
  { 
     // this language will be used as a fallback when a translation isn't found in the current language
     translate.setDefaultLang('en');
     // the lang to use, if the lang isn't available, it will use the current loader to get them
     translate.use('en');
  }

  ngOnInit() {


    this.broadcastService.getHeaderText().subscribe(headerText => {
      this.headerText = headerText;
      //console.log('inside header '+this.headerText);

     const url = window.location.href.toString();
      //console.log(url);
      if (url.indexOf('/prescription') > 0) {
        document.body.classList.add('prescription-screen');
      }else{
        document.body.classList.remove('prescription-screen');
      }
    });
     
     /* Working on app/issues/782 */
     this.broadcastService.getRegistrationWorkflow().subscribe(workflow => {
      const url = window.location.href.toString();
        this.workflowSteps = workflow.registrationWorkflowSteps;
        this.isRegistrationWorkflowCompleted = workflow.registrationWorkflowCompleted;
        // this.isValidProfile = workflow.validProfile;
        this.currentStepNo = workflow.currentStepNo;
        this.workflow = workflow;
        this.setheader();
        this.setheader1();
        if ((url.indexOf('billing/plan') > 0 || url.indexOf('billing/contract') > 0) 
        && !this.isRegistrationWorkflowCompleted) {
          document.body.classList.add('started-screen');
        }else{
          document.body.classList.remove('started-screen');
        }
      });
      /*End Working on app/issues/782 */
      
      this.setheader();
   
  }

  backClicked() {
    this._location.back();
  }

  setheader()
  {
    if (this.workflow)
    {
      this.pageHeader = this.workflow.currentStepNo == 4 ? 'SERVICE AGREEMENT' : 'MEDePAL USAGE CHARGES';
    }
    else 
    {
      this.pageHeader = 'MEDePAL USAGE CHARGES';
    }
}

setheader1()
{
  if (this.workflow.currentStepNo == 4 && this.isRegistrationWorkflowCompleted )
   {
      this.pageHeader = 'REGISTRATION COMPLETED'
    }
}

}
