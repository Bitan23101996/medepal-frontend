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

import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { DeliveryService } from '../../delivery/delivery.service';
import { IndividualService } from '../individual.service';
import { BroadcastService } from './../../../core/services/broadcast.service';
import { SBISConstants } from './../../../SBISConstants';
import { AppoinmentService } from '../../appoinment/appoinment.service';
import { GetSet } from 'src/app/core/utils/getSet';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JsonTranslation } from '../../../shared/translation';

@Component({
  selector: 'app-my-diagnostics',
  templateUrl: './my-diagnostics.component.html',
  styleUrls: ['./my-diagnostics.component.css'],
  providers: [FormGroupDirective]
})
export class MyDiagnosticsComponent implements OnInit, OnDestroy  {

  //public facetedFormGroup: FormGroup;//taking form group to filter data
  fromDate: any = "";
  toDate: any = "";
  modeList: any;
  statusList: any;
  modeArr = [];
  user_id: any;
  userRefNo: any;
  user_name: any;
  stat = [];
  maxDate: Date;
  buttonClassCurrent: any;
  buttonClassAnother: any;
  public orderedDiagnosticsListArr: any = [];
  diagnosticsListArr: any[] = [];
  noOrderFound: boolean = false;
  patientName: any;
  isResp: boolean = false;
  public patientNameDistArr: string[] = [];//taking patientNameDist arr to store the distinct value of psatient name from response
  appointment: any;
  ratingList = [];
  editRating: any;
  orderState: any;//to store all order state from const
  orderStateOutForDelivery: any;
  reviews = {
    userReviewsList: [],
    page: 1,
    labRefNo: null,
    doctorName: "",
    yearsOfExperience: 0,
    doctorQualifications: [],
    doctorSpecializations: [],
    rating: 0,
    reviewNum: 0
  }
  modalRef: BsModalRef;
  confirmationMsg: any = [];
  panelVisible = false;
  @ViewChild('userReviewsModal') userReviewsModal: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private _deliveryService: DeliveryService,
    private individualService: IndividualService,
    private broadcastService: BroadcastService,
    private appoinmentService: AppoinmentService,
    private router: Router,
    private toastService: ToastService,
    private bsModalService: BsModalService,
    private jsonTranslate: JsonTranslation
  ) { }

  ngOnInit() {
    this.loadOninit();
    document.body.classList.add('prescription-screen');//to remove the screen layout
  }//end of oninit 

  ngOnDestroy(): void {
    document.body.classList.remove('prescription-screen');//to remove the screen layout
  }//end of on destroy

  loadOninit(){
    this.maxDate = new Date();
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.userRefNo = user.refNo;
    this.user_name = user.userName;
    let clearPrevious = JSON.parse(localStorage.getItem("clearPrevious"));
    this.modeList = null;
    this.statusList = null;
    this.modeArr = [];
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.getAllAppStatus('DELIVERY_STATUS');
    this.getAllDeliveryMode('DELIVERY_MODE');
    this.getMyDiagnosticsList();

    if (clearPrevious != null) {
      localStorage.setItem("orderlistPrevious", JSON.stringify(null));
      localStorage.setItem("statlistPrevious", JSON.stringify(null));
      localStorage.setItem("modelistPrevious", JSON.stringify(null));
      localStorage.setItem("fromDatePrevious", JSON.stringify(null));
      localStorage.setItem("toDatePrevious", JSON.stringify(null));
      localStorage.setItem("namePrevious", JSON.stringify(null));
      localStorage.setItem("clearPrevious", JSON.stringify(null));
    }
    //method to get order medicine by user id
    this.broadcastService.setHeaderText('');
    this.loadRatingData();//to get rating
    this.orderState = SBISConstants.ORDER_STATE;
    this.orderStateOutForDelivery = SBISConstants.ORDER_STATE_OUT_FOR_DELIVERY;
  }//end of method

  getAllAppStatus(name) {
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.statusList = res;
    });
  }
  getAllDeliveryMode(name) {
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.modeList = res;
    });
  }

  private getMyDiagnosticsList() {
    let request = {
      "user_refNo": this.userRefNo,
      "fromDate": this.fromDate,
      "toDate": this.toDate,
      "medicineName": "",
      "name": "",
      "modeList": this.modeArr,
      "stateList": this.stat
    }
    this.individualService.getDiagnosticsLabOrders(request).subscribe((response) => {
      if (response.status == 2000) {
        this.isResp = true;
        response.data.sort((a, b) => {
          const d1 = new Date(a.orderDate);
          const d2 = new Date(b.orderDate);
          return (d1.getTime() - d2.getTime()) * -1;
        });
        let index = 0;
        for(let myDiagnostics of response.data) {
          response.data[index]['outstandingAmount'] = (+response.data[index].totalAmount)-(+response.data[index].paidAmount);
          index = index + 1;
        }
        this.orderedDiagnosticsListArr = response.data;
        this.diagnosticsListArr = response.data;
        if (this.diagnosticsListArr.length == 0) {
          this.noOrderFound = true;
        }
        for (let orderDiagnosticsArrEl of this.orderedDiagnosticsListArr) {
          if (this.patientNameDistArr.indexOf(orderDiagnosticsArrEl.orderByUserName) == -1) {
            this.patientNameDistArr.push(orderDiagnosticsArrEl.orderByUserName);
          }
        }
      }
    }, err => {
      // console.log("err of get order med::", err);
    });
  }//end of method

  onValueChange(event) {
    console.log(event);
    // if(label == 'fromDate'){
    //   this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);

    // }
    // if(label == 'toDate'){
    //   this.toDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);

    // }
    // console.log("FromDate::" +this.fromDate);
    // console.log("toDate::" +this.toDate);

    // if(this.fromDate == this.toDate)
    // {
    //   this.buttonClassCurrent = 'btn btn-dark';
    //   this.buttonClassAnother = 'btn btn-light';
    // }
    // else{
    //   this.buttonClassCurrent = 'btn btn-light';
    //   this.buttonClassAnother = 'btn btn-dark';
    // }
  }

  statusChange(e, type) {
    if (e.target.checked) {
      let index = this.findIndexToUpdateStatus(type.attributeValue);
      if (index >= 0) {

      } else {
        this.stat.push(type.attributeValue);
      }
    }
    else {
      let index = this.findIndexToUpdateStatus(type.attributeValue);
      this.stat.splice(index, 1);
    }
  }

  findIndexToUpdateStatus(attributeValue) {
    for (let i = 0; i < this.stat.length; i++) {
      if (this.stat[i] == attributeValue)
        return i;
    }
  }

  modeChange(e, type) {
    if (e.target.checked) {
      let index = this.findIndexToUpdateMode(type.attributeValue);
      if (index >= 0) {

      } else {
        this.modeArr.push(type.attributeValue);
      }
    }
    else {
      let index = this.findIndexToUpdateMode(type.attributeValue);
      this.modeArr.splice(index, 1);
    }
  }

  findIndexToUpdateMode(attributeValue) {
    for (let i = 0; i < this.modeArr.length; i++) {
      if (this.modeArr[i] == attributeValue)
        return i;
    }
  }

  submit() {
    this.orderedDiagnosticsListArr = [];
    let request = {
      "user_refNo": this.userRefNo,
      "fromDate": this.fromDate,
      "toDate": this.toDate,
      "medicineName": "",
      "name": this.patientName,
      "modeList": this.modeArr,
      "stateList": this.stat
    }
    this.individualService.getDiagnosticsLabOrders(request).subscribe((response) => {
      if (response.status == 2000) {
        this.isResp = true;
        response.data.sort((a, b) => {
          const d1 = new Date(a.orderDate);
          const d2 = new Date(b.orderDate);
          return (d1.getTime() - d2.getTime()) * -1;
        });
        let index = 0;
        for(let myDiagnostics of response.data) {
          response.data[index]['outstandingAmount'] = (+response.data[index].totalAmount)-(+response.data[index].paidAmount);
          index = index + 1;
        }
        this.orderedDiagnosticsListArr = response.data;
        this.diagnosticsListArr = response.data;
        if (this.diagnosticsListArr.length == 0) {
          this.noOrderFound = true;
        }
        for (let orderDiagnosticsArrEl of this.orderedDiagnosticsListArr) {
          if (this.patientNameDistArr.indexOf(orderDiagnosticsArrEl.orderByUserName) == -1) {
            this.patientNameDistArr.push(orderDiagnosticsArrEl.orderByUserName);
          }
        }
      }
    }, err => {
      // console.log("err of get order med::", err);
    });
  }

  resetAll(){
    this.fromDate = null;
    this.toDate = null;
    this.modeArr = [];
    this.patientName = '';
    this.stat = [];
  }

  resetOrderStatus(){  
    this.stat = [];
  }

  resetMode(){
    this.modeArr = [];
  }

  //rating
  loadRatingData() {
    this.individualService.getRatingForDiagnostics().subscribe((result) => {
      if (result.status === 2000) {
        this.ratingList = result.data;
        this.ratingList.forEach(item => {
          item["ratingParameterScore"] = 0;
        })
      }
    })
  }

  giveRating(appoinment){
    console.log(appoinment);
    this.appointment = appoinment;
    GetSet.setRatingFor('DIAGNOSTICS');
    this.ratingList.forEach(item => {
      item["ratingParameterScore"] = 0;
    });
    let query = {
      "triggeringRefNo": appoinment.orderRefNo,
      "triggeringActionType": "DIAGNOSTICS"
    }
    this.individualService.viewRatingV2(query).subscribe((result) => {
      if (result.status == 2000 && result.data != null) {
        result.data.ratingDetails.forEach(item => {
          let targetRating = this.ratingList.filter(x => x.ratingParameterDTO.ratingParameterName == item.ratingParameter.ratingParameterName)[0];
          if (targetRating) {
            targetRating["ratingParameterScore"] = item.ratingParameterScore;
          }
        });
        // this.modalRef["editRating"] = result.data;
        this.editRating = result.data;
      }
    });
    this.appointment["doctorRefNo"] = appoinment.labRefNo;
  }//end of method

  //method to cancel order
  cancelOrder(medicineEl){
    if(confirm("Are you sure you want to cancel this order?")){
      let cancelOrderJsonBody: any = {
        "userRefNo": this.userRefNo,
        "orderRefNo": medicineEl.orderRefNo,
        "orderCancelReason":"User Request"
      };
  
      this.individualService.DeleteSelectedOrderedMedicine(cancelOrderJsonBody).subscribe(res=>{
        if(res.status == 2000){
          this.getMyDiagnosticsList();
        }
      },err=>{
  
      });
    }
  }//end of method

  payDiagnostics(diagnostics) {
    GetSet.setPlaceOrderData(diagnostics);
    GetSet.setTransactionType('DIAGNOSTICS');
    //confirm page info set
    let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.DIAGNOSTICS_PAID_SUCCESSFULLY');
    this.confirmationMsg.push(confMsg);
    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.DIAGNOSTICS;
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.DIAGNOSTICS;
    // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
    GetSet.setConfirmationInfo(confirmationInfo);
    //end of confirm page info set
    this.router.navigate(['/payment/razor-pay']);
  }

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }//end of method

  loadReviews() {
    this.individualService.getUserReviewsForDiagnostics(this.reviews.labRefNo, this.reviews.page).subscribe(result => {
      if (result.status == 2000) {
        if (result.data.length == 0) {
          this.toastService.showI18nToast("No Record Found", "error");
        }
        result.data.forEach(item => {
          item["date"] = moment(new Date(item.ratingDate)).format("YYYY-MM-DD");
          item["time"] = this.formatAMPM(new Date(item.ratingDate));
          this.reviews.userReviewsList.push(item);
        });
      }
    })
  }//end of method

  userReviews(order) {
    this.reviews.page = 1;
    this.reviews.userReviewsList = [];
    this.reviews.labRefNo = order.labRefNo;
    this.modalRef = this.bsModalService.show(this.userReviewsModal, { class: 'modal-lg' });
    this.loadReviews();
  }

  moreReviews() {
    this.reviews.page = this.reviews.page + 1;
    this.loadReviews();
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

}//end of class
