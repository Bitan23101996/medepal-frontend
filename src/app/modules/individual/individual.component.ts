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
import { BroadcastService } from './../../core/services/broadcast.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';


@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements OnInit {
  headerText:any;

  /* Working on app/issues/782 */
  isRegistrationWorkflowCompleted: boolean = false;
  // isValidProfile: boolean = false;
  workflowSteps: any = [];
  workflow: any;
  currentStepNo: any
  dashbLayout: boolean = false;
  /*End Working on app/issues/782 */
  constructor(private _location: Location,
              private translate: TranslateService,private broadcastService: BroadcastService,private router: Router)
  {
     // this language will be used as a fallback when a translation isn't found in the current language
     translate.setDefaultLang('en');
     // the lang to use, if the lang isn't available, it will use the current loader to get them
     translate.use('en');


     this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                //console.log("aaa");// Show loading indicator
            }

            if (event instanceof NavigationEnd) {
              const url = window.location.href.toString();
              if (url.indexOf("/individual-dashb") >  0) {
                this.dashbLayout = true;
                /*if (!this.cdRef['destroyed']) {
                  this.cdRef.detectChanges();
                }*/
              } else{
                this.dashbLayout = false;
                /*if (!this.cdRef['destroyed']) {
                  this.cdRef.detectChanges();
                }*/
              }
                //console.log("bbb");
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log(event.error);
            }
        });

  }

  ngOnInit() {
    this.broadcastService.getHeaderText().subscribe(headerText => {
      this.headerText = headerText;
      //console.log('inside header '+this.headerText);
      const url = window.location.href.toString();
      //document.body.classList.remove('started-screen');
      //console.log(url);
      if (url.indexOf('/my-prescription') > 0) {
        document.body.classList.add('prescription-screen');
      } else{
        document.body.classList.remove('prescription-screen');
      }
      ///sbis-poc/app/issues/673
      if (url.endsWith("/my-order")) {
        document.body.classList.add('order-screen');
      } else{
        document.body.classList.remove('order-screen');
      }
    });

     /* Working on app/issues/782 */
     this.broadcastService.getRegistrationWorkflow().subscribe(workflow => {
      const url = window.location.href.toString();
        this.workflowSteps = workflow.registrationWorkflowSteps;
        this.isRegistrationWorkflowCompleted = workflow.registrationWorkflowCompleted;
        // this.isValidProfile = workflow.validProfile
        this.currentStepNo = workflow.currentStepNo;
        this.workflow = workflow;
        //if ((url.indexOf('individual/tab-personal') > 0 || url.indexOf('individual/tab-address') > 0) && !this.isRegistrationWorkflowCompleted) {
          if ((url.indexOf('doctor/profile') > 0 || url.indexOf('doctor/chamber') > 0 
          || url.indexOf('individual/tab-personal') > 0 || url.indexOf('individual/tab-address') > 0) 
          && !this.isRegistrationWorkflowCompleted) {
        // if(this.currentStepNo > 0) {
          document.body.classList.add('started-screen');
        }else{
          document.body.classList.remove('started-screen');
        }
      });
      /*End Working on app/issues/782 */
  }

  backClicked() {
    this._location.back();
  }
  
}
