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

import { Component, OnInit, HostListener } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { BillingService } from '../billing.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-billing-plan',
  templateUrl: './billing-plan.component.html',
  styleUrls: ['./billing-plan.component.css']
})
export class BillingPlanComponent implements OnInit {
  apiUrl = environment.apiUrl;
  billingPlanList: any = [];
  selectedPlan: any = null;
  selected: any = [];
  ipAddress: any;
  isRegistrationWorkflowCompleted: boolean = false;
  workflow: any;
  myBillingPlan: any;
  reportType = "CONTRACT";
  user: any;
  billingUnitList: any = [];
  redirectFlag: boolean = true;
  successMsgFor = "partialRegistration";
  myPlanBaseUnits:string
  currentStep:any;

  constructor(private _broadcastService: BroadcastService,
    private _billingService: BillingService,
    private _toastService: ToastService,
    private _router: Router,
    private _http: HttpClient
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.workflow = JSON.parse(localStorage.getItem('regw'));
    this.currentStep=0;
    if(!this.workflow.registrationWorkflowCompleted){
      for(let i=0;i<this.workflow.registrationWorkflowSteps.length;i++){
        if(this.workflow.registrationWorkflowSteps[i].stepInstruction.indexOf("billing")>0){
          this.currentStep=this.workflow.registrationWorkflowSteps[i].sequenceNo
        }
      }
    }
    
    //this.workflowSteps = workflow.registrationWorkflowSteps;
    this._broadcastService.setRegistrationWorkflow(this.workflow);
    this.isRegistrationWorkflowCompleted = this.workflow.registrationWorkflowCompleted;
    //if(!this.isRegistrationWorkflowCompleted){
    // if(this.workflow.currentStepNo == 3){
    //   this._broadcastService.setHeaderText('Billing Plan');
    //   this.getBillingPlans();
    //   this.getIpAddress();
    //   //this.getBillingUnitList();
    // }
    // else{
    //   this._broadcastService.setHeaderText('My Subscription');
    //   this.getMyBillingPlan();
    // }
    if(this.currentStep!=0){
      this._broadcastService.setHeaderText('Billing Plan');
      this.getBillingPlans();
      this.getIpAddress();
      //this.getBillingUnitList();
    }
    else{
      this._broadcastService.setHeaderText('My Subscription');
      this.getMyBillingPlan();
    }
  }

  getBillingUnitList() {
    this._billingService.getBillingUnitList().subscribe(res => {
      console.log(res);
        this.billingUnitList = res.masterDataAttributeValues;
    });
  }

  getBillingPlans() {
    //this._billingService.getBillingPlanList().subscribe(data => {
    this._billingService.getBillingPlanListV2().subscribe(data => { //Working on app/issues/1758  
      console.log(data);

      if (data['status'] == '2000') {
        this.billingPlanList = data['data'];
        if (this.billingPlanList.length == 1) {
          this.selectedPlan = this.billingPlanList[0];
          this.selected[0] = true;
        }
      }
    });
  }

  getMyBillingPlan() {
    this._billingService.getMyBillingPlan().subscribe(data => {
      console.log(data);
      let myPlanBaseUnitsArray=[];
      if (data['status'] == '2000') {
        this.myBillingPlan = data['data'];
      }
      
      if(this.myBillingPlan!=null){
        for(let myPlan of this.myBillingPlan.billingPlanDetails){
          myPlanBaseUnitsArray.push(myPlan.baseUnit);
        }
        this.myPlanBaseUnits=myPlanBaseUnitsArray.join(", ");
      }
    });
  }

  selectPlan(plan, i) {
    this.selected = [];
    this.selectedPlan = plan;
    this.selected[i] = true;
  }

  choosePlan(plan) {
    // if (this.selectedPlan == null) {
    //   this._toastService.showI18nToastFadeOut("Please select a plan", "warning");
    //   return;
    // }
    console.log(plan);

    if(confirm("Are you sure to proceed with the selected plan?")){
      let payload = {
        doctorBillingPlanPk: plan.doctorBillingPlanPk,
        billingPlanPk: plan.billingPlanPk,
        newSwitchFlag: "NEW",
        trialMonths: plan.trialMonths,
        paymentStartDate: plan.validFrom,
        planSelectedFromIp: this.ipAddress,
        planEndDate: plan.validTill
      }
  
      this._billingService.saveBillingPlanForDoctor(payload).subscribe(data => {
        console.log(data);
        if (data.status == "2000") {
          let payloadWorkflow = JSON.parse(localStorage.getItem('regw'));
          //if (!payloadWorkflow.hasPlan)
          if(payloadWorkflow.currentStepNo == payloadWorkflow.registrationWorkflowSteps.length){
            this.redirectFlag = false;
            payloadWorkflow.registrationWorkflowCompleted = true;
            this._broadcastService.setRegistrationWorkflow(payloadWorkflow);
            localStorage.setItem('regw',JSON.stringify(payloadWorkflow));
            this._broadcastService.setHeaderText("Registration Completed");
          }
          else{
            this.redirectFlag = true;
            payloadWorkflow.currentStepNo++;
          //payloadWorkflow.hasPlan = true;
          this._broadcastService.setRegistrationWorkflow(payloadWorkflow);
          localStorage.setItem('regw', JSON.stringify(payloadWorkflow));
           
          let route:any;
          for(let i=0;i<payloadWorkflow.registrationWorkflowSteps.length;i++){
            if(payloadWorkflow.registrationWorkflowSteps[i].sequenceNo==payloadWorkflow.currentStepNo){
              route=payloadWorkflow.registrationWorkflowSteps[i].routeUrl
            }
          }
          this._router.navigate([route]);    
          
          }
          
        }
  
      });
    }
    

  }

  getIpAddress() {
    this._billingService.getIpAddress().subscribe(data => {
      console.log(data.data);
      if (data['status'] == '2000') {
        this.ipAddress = data['data'];
      }
    });
  }

  downloadContract(){
    var fileName = "Contract";
		var a = document.createElement("a");
    return this._http.get(this.apiUrl+"gen/v1/billing/generateReport"+ "/" + this.reportType + "/" + this.user.refNo, { responseType:'blob' }).map((result) => {
      var file = new Blob([result], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
        a.href = fileURL;
        a.download = fileName;
        a.click();
        window.open(fileURL);
        this._toastService.showI18nToastFadeOut("Download successful.","success");
      
      
  }).toPromise();
  }


}
