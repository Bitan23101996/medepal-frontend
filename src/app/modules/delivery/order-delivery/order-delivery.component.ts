/*******************************************************************************
 * * |///////////////////////////////////////////////////////////////////////|
 * * |                                                                       |
 * * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
 * * | All Rights Reserved                                                   |
 * * |                                                                       |
 * * | This document is the sole property of StellaBlue Interactive          |
 * * | Services Pvt. Ltd.                                                    |
 * * | No part of this document may be reproduced in any form or             |
 * * | by any means - electronic, mechanical, photocopying, recording        |
 * * | or otherwise - without the prior written permission of                |
 * * | StellaBlue Interactive Services Pvt. Ltd.                             |
 * * |                                                                       |
 * * |///////////////////////////////////////////////////////////////////////|
 ******************************************************************************/
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SBISConstants } from 'src/app/SBISConstants';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { DeliveryService } from '../delivery.service';

import {MenuItem} from 'primeng/api';
import { ToastService } from '../../../core/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IndividualService } from '../../individual/individual.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { flatten } from '@angular/compiler';
import { PharmacyRequisitionService } from '../../pharmacy-requisition/pharmacyRequisition.service';

@Component({
  selector: 'app-order-delivery',
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.css']
})
export class OrderDeliveryComponent implements OnInit {

  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  fetchOrderForm: FormGroup;
  buttonClassCurrent : any;
  buttonClassAnother : any;
  todate : Date = new Date();
  fromDate: any;
  toDate: any;
  actualDeliveryDate: any;
  user: any;
  pharmacyPk: any;
  dateFormat: any;
  statusList : any;
  modeList : any;
  searchList : any;
  resonList : any;
  searchStr : String = "";
  stat = [];
  modeArr = [];
  searchListLength: any;
  title: String = "Order List";
  allDataFetched = false;
  prevDateEnableFlag = false;
  viewDate: Date;
  prescriptionSBIS: any =false;
  download={
    downloadImageSrc : "",
    contentType:"",
    doctorName:"",
    forUserName:""
  }

  orderStateList: MenuItem[];
  orderDetailView: boolean = false;
  
  modalRef: BsModalRef;
  appRefNo: any;
  events: any = [];
  activeIndex : any;

  /** Delivery/Failed delivery radio button flag **/
  ofdDeliveryFlag: any;
  ofdDeliveryDetFlag: any;

  /** State - Outstanding - validation flag **/
  packingMndFlag: any;
  packingDetMndFlag: any;

  /** State - Packed - validation flag **/
  expDeliveryDtFlag: any;
  expDeliveryDtDetFlag: any;
  agentNameFlag: any;
  agentNameDetFlag: any;
  agentContactFlag: any;
  agentContactDetFlag: any;
  deliveryModeFlag: any;
  deliveryModeDetFlag: any;

  /** State - Out for Delivery(Delivered) - validation flag **/
  deliveredByFlag: any;
  rcvByFlag: any;
  rcvOnFlag: any;
  deliveredByDetFlag: any;
  rcvByDetFlag: any;
  rcvOnDetFlag: any;

  /** State - Out for Delivery(Failed Delivery) - validation flag **/
  reasonCodeFlag: any;
  reasonCodeDetFlag: any;

  progress = { percentage: 0, isShowUploadBtn: false };
  domSanitizer: any;
  profileImageSrc = "";
  ms_User_Pk: any;
  minDate: Date;
  prescriptionList : any;

  constructor(private fb: FormBuilder,  
              private router: Router,
              private _deliveryService: DeliveryService,
              private broadcastService: BroadcastService,
              private bsModalService: BsModalService,
              private translate: TranslateService,
              private toastService: ToastService,
              private _domSanitizer: DomSanitizer,
              private individualService: IndividualService,
              private _pharmacyRequisitionService: PharmacyRequisitionService) { 
                this.domSanitizer = _domSanitizer;
                translate.setDefaultLang('en');
                translate.use('en');
              }

  ngOnInit() {
    this.ofdDeliveryFlag = [];
    this.packingMndFlag = [];
    this.expDeliveryDtFlag = [];
    this.agentNameFlag = [];
    this.agentContactFlag = [];
    this.deliveryModeFlag = [];
    this.deliveredByFlag = [];
    this.rcvByFlag = [];
    this.rcvOnFlag = [];
    this.reasonCodeFlag= [];
  
    this.minDate = new Date();


    this.orderStateList = [];
     
    this.user = JSON.parse(localStorage.getItem('user'));
    this.ms_User_Pk = this.user.userId;
    //this.fromDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
    //this.toDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
    this.fromDate = null;
    this.toDate = null;

    this.actualDeliveryDate = null;
    this.dateFormat=environment.DATE_FORMAT;
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.searchList = null;
    this.searchStr = null;
    this.statusList = null;
    this.resonList = null;
    this.modeList = null;
    this.pharmacyPk = null;
    this.stat.push(SBISConstants.DELIVERY_CONST.OUTSTANDING);
    this.viewDate = new Date();

    this.searchOrder();
    this._deliveryService.getReasonList(SBISConstants.DELIVERY_CONST.ATTEMPTED).subscribe(data => {
      console.log(data);   
      if(data['status']=='2000'){
        this.resonList = data.data;
      }
      console.log("****************");
      console.log(this.resonList);      
    });

    this.createFetchOrderForm();
    this.getAllAppStatus('DELIVERY_STATUS');
    this.getAllDeliveryMode('DELIVERY_MODE');
    this.prescriptionList = [];
  }

  getAllAppStatus(name){
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.statusList=res;
    });
  }

  getAllDeliveryMode(name){
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.modeList=res;
    });
  }

  createFetchOrderForm(){
    // let user = JSON.parse(localStorage.getItem('user')); - not required
    this.fetchOrderForm = this.fb.group({
      orderStatus: "",
      mode: "",
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  onValueChange(label:any,dt: Date): void {

    if(label == 'fromDate'){
      this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
    }
    if(label == 'toDate'){
      this.toDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
    }

    if(this.fromDate == this.toDate)
    {
      this.buttonClassCurrent = 'btn btn-dark';
      this.buttonClassAnother = 'btn btn-light';
    }
    else{
      this.buttonClassCurrent = 'btn btn-light';
      this.buttonClassAnother = 'btn btn-dark';
    }

    console.log("FROM VALUE CHANGE from = "+this.fromDate);
    console.log("FROM VALUE CHANGE to = "+this.toDate);
  }

  goToPreviousDate()
    {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth(),
        this.viewDate.getDate() - 1);

      if(this.viewDate <= new Date()){
        this.prevDateEnableFlag = true;
      }

      var mnth = ("0" + (this.viewDate.getMonth()+1)).slice(-2),
        day  = ("0" + this.viewDate.getDate()).slice(-2);
      var tempDate = [ this.viewDate.getFullYear(), mnth , day ].join("-");  

      this.fromDate = tempDate;
      this.toDate = tempDate; 
      
      this.searchOrder();
      
      this.fetchOrderForm.patchValue({
        fromDate : ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear(),
        toDate : ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear()
      })
    }

    goToNextDate()
    {
      this.prevDateEnableFlag = false;
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth(),
        this.viewDate.getDate() + 1);

      var mnth = ("0" + (this.viewDate.getMonth()+1)).slice(-2),
        day  = ("0" + this.viewDate.getDate()).slice(-2);
      var tempDate = [ this.viewDate.getFullYear(), mnth , day ].join("-");  

      this.fromDate = tempDate;
      this.toDate = tempDate;  

      this.searchOrder();

      this.fetchOrderForm.patchValue({
        fromDate : ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear(),
        toDate : ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear()
      })
    }

  statusChange(e, type){
    if(e.target.checked){
      console.log(type.attributeValue);
      let index = this.findIndexToUpdateStatus(type.attributeValue);
      if(index >= 0){

      }else{
        this.stat.push(type.attributeValue);
      }  
      console.log(this.stat);
    }
    else{ 
     let index =this.findIndexToUpdateStatus(type.attributeValue); 
     console.log("index = "+index)
     this.stat.splice(index, 1);

     console.log(this.stat);
    }
    console.log("stat = "+this.stat);
  }

  findIndexToUpdateStatus(attributeValue) { 
    for(let i=0;i<this.stat.length;i++){
      if(this.stat[i]==attributeValue)
        return i;
    }      
  }

  modeChange(e, type){
    if(e.target.checked){
      console.log(type.attributeValue);
      let index = this.findIndexToUpdateMode(type.attributeValue);
      if(index >= 0){

      }else{
        this.modeArr.push(type.attributeValue);
      }  
      console.log(this.modeArr);
    }
    else{ 
     let index =this.findIndexToUpdateMode(type.attributeValue); 
     console.log("index = "+index)
     this.modeArr.splice(index, 1);

     console.log(this.modeArr);
    }
    console.log("stat = "+this.modeArr);
  }

  findIndexToUpdateMode(attributeValue) { 
    for(let i=0;i<this.modeArr.length;i++){
      if(this.modeArr[i]==attributeValue)
        return i;
    }      
  }

  resetAll(){
    this.fetchOrderForm.patchValue({
      orderStatus:'',
      fromDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear() ,
      toDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear(),
      mode:''
    });
    this.modeArr = [];
    this.stat = [];
  }

  resetSearchDate(){
    this.fetchOrderForm.patchValue({
      fromDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear() ,
      toDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear()
    });
  }

  resetOrderStatus(){
    this.fetchOrderForm.patchValue({
      orderStatus:''
    });       
    this.stat = [];
  }

  resetMode(){
    this.fetchOrderForm.patchValue({
      mode:''
    });       
    this.modeArr = [];
  }

  searchOrder(){
    this.searchList= null;
    this.searchStr = "entityType:pharmacy;workflowId:MED_ORDER";
    // Service provider ref no - issue app#604
    if(this.user.serviceProviderRefNo!="")
      this.searchStr=this.searchStr+";refNo:"+ this.user.serviceProviderRefNo;

    if(this.fromDate!="" && this.fromDate!=null)
      this.searchStr=this.searchStr+";fromDate:"+ this.fromDate;
     
    if(this.toDate!="" && this.toDate!=null)
      this.searchStr=this.searchStr+";toDate:"+ this.toDate;
    
    if(this.stat.length !=0) 
      this.searchStr=this.searchStr+";status:"+ this.stat;  

    if(this.modeArr.length !=0) 
      this.searchStr=this.searchStr+";deliveryMode:"+ this.modeArr; 
      
    console.log("searchStr = "+this.searchStr);  
    this._deliveryService.getOrderDeliveryList('?search='+this.searchStr).subscribe(data => {
      console.log(data); 
      if(data['status']=='2000' && data.data.length!=0){
        this.searchList=data.data;
        console.log(this.searchList);        
        this.searchListLength = data.data.length;
        this.allDataFetched = true;
        
        this.ofdDeliveryFlag = [];
        /*Reset all validation flag*/  
        this.packingMndFlag = [];
        this.expDeliveryDtFlag = [];
        this.agentNameFlag = [];
        this.agentContactFlag = [];
        this.deliveryModeFlag = [];
        this.deliveredByFlag = [];
        this.rcvByFlag = [];
        this.rcvOnFlag = [];
        this.reasonCodeFlag= [];
        for(let i = 0; i<this.searchListLength;i++){
          this.ofdDeliveryFlag.push(true)
          this.reasonCodeFlag.push(false);
          this.prescriptionList[i] = data.data[i].prescriptionDTOList;
        }
      }else if(data['status']=='2000' && data.data.length==0){
        this.searchList=null;
        this.allDataFetched = true;
        this.searchListLength = 0;
      }else if(data['status']=='2500'){
        alert(data.message);
        this.searchList=null;
        this.allDataFetched = true;
        this.searchListLength = 0;
      }
     
    });
  }

  orderDetails: any;
  showOrderDetails(q){
    this.orderDetailView = true;
    console.log(q);
    this.orderDetails = q;
    this.orderStateList = [];
    this.events = [];
    this.packingDetMndFlag = false;

    this.ofdDeliveryDetFlag = true;

    this.expDeliveryDtDetFlag= false;
    this.agentNameDetFlag= false;
    this.agentContactDetFlag= false;
    this.deliveryModeDetFlag= false;

    this.deliveredByDetFlag= false;
    this.rcvByDetFlag= false;
    this.rcvOnDetFlag= false;

    this.reasonCodeDetFlag= false;

    this.getDeliveryFlow(q.entityRequitionRefNo)
  }
  backToOrderList(){
    this.orderStateList = [];
    this.events = [];
    this.orderDetailView = false;
    
    this.packingDetMndFlag = false;

    this.ofdDeliveryDetFlag = false;
    
    this.expDeliveryDtDetFlag= false;
    this.agentNameDetFlag= false;
    this.agentContactDetFlag= false;
    this.deliveryModeDetFlag= false;

    this.deliveredByDetFlag= false;
    this.rcvByDetFlag= false;
    this.rcvOnDetFlag= false;

    this.reasonCodeDetFlag= false;
  }
  setDeliveryState(deliveryState, i?){
    if(i !== undefined){
      if(deliveryState==SBISConstants.DELIVERY_CONST.DELIVERED){
        this.ofdDeliveryFlag[i] = true;
      }
      else{
        this.ofdDeliveryFlag[i] = false;
      }
    }
    else{
      if(deliveryState==SBISConstants.DELIVERY_CONST.DELIVERED){
        this.ofdDeliveryDetFlag = true;
      }
      else{
        this.ofdDeliveryDetFlag = false;
      }
      
    }
  }

  viewPrescription(appointmentRefNo){
    this.appRefNo = appointmentRefNo;
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
  }

  getDeliveryFlow(entityRequitionRefNo){
    let currDate = new Date();
    let payload = {
      entityRequitionRefNo: entityRequitionRefNo,
      entityType: 'pharmacy',
      workflowId: 'MED_ORDER'
    };
    this.activeIndex = null;
    this._deliveryService.getDeliveryFlow(payload).subscribe(res => {
      console.log(res);
      let label = "";
      //this.events = res['data'];
      for (let i = 0; i < res['data'].length; i++) {
        // if(res['data'][i].event==SBISConstants.DELIVERY_CONST.PACKED && res['data'][i].eventDateTime != null){
        //   this.events.pop();
        // }
        if(res['data'][i].eventDateTime == null && res['data'][i].event==SBISConstants.DELIVERY_CONST.ATTEMPTED) continue;

        this.events.push(res['data'][i]);
      }
      console.log("Events : ");
      console.log(this.events);
      
      
      for (let i = 0; i < this.events.length; i++) {
        let dt = "";
        if(this.events[i].eventDateTime!=null){
          let dtTime = this.events[i].eventDateTime.split("T");
          let date = dtTime[0].split("-");
          let time = dtTime[1];
          dt = date[2]+"-"+date[1]+"-"+date[0]+" "+time;
        }
        if(this.events[i].event == SBISConstants.DELIVERY_CONST.OUTSTANDING){
          label = "Processing...";
        }
        else{
          label = this.events[i].eventDesc+"\n";
          label += this.events[i].eventDateTime!=null?dt:'';
          
        }
        
        
        this.orderStateList.push({label: label, command: (event: any) => {
          this.activeIndex = i;
        }
        })
      }
      for (let i = 0; i < this.events.length; i++) {
        if(this.events[i].eventDateTime==null){
          this.activeIndex = i-1;
          break;   
        }
        if(this.events[this.events.length-1].eventDateTime!=null){
          this.activeIndex = this.events.length-1;
        }
      }
      console.log(this.orderStateList);
      
    });  
  }

  savePacked(noOfPack,res,i?){
    console.log(i);
    if(i !== undefined){
      if(noOfPack.value == ""){
        this.packingMndFlag[i]=true;
      }
      else{
        this.packingMndFlag[i]=false;
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          deliveryStatus: SBISConstants.DELIVERY_CONST.PACKED,
          noOfPackage: noOfPack.value,
          workflowId: 'MED_ORDER'
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000')
            this.toastService.showI18nToast(res['message'],"success");
            this.searchOrder();
        });
      }
    }
    else{
      if(noOfPack.value == ""){
        this.packingDetMndFlag=true;
      }
      else{
        this.packingDetMndFlag=false;
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          deliveryStatus: SBISConstants.DELIVERY_CONST.PACKED,
          noOfPackage: noOfPack.value,
          workflowId: 'MED_ORDER'
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000')
            this.toastService.showI18nToast(res['message'],"success");
            this.orderDetailView = false;
            this.searchOrder();
        });
      }
      
    }
    
  }

  saveOutForDelivery(expectedDelivery,agentName,agentContact,res,i?){
    let expDeliveryDt = expectedDelivery.value.split("-");
    if(i !== undefined){
      if(expectedDelivery.value=="") this.expDeliveryDtFlag[i]=true;
      else this.expDeliveryDtFlag[i]=false;
      if(agentName.value=="") this.agentNameFlag[i]=true;
      else this.agentNameFlag[i]=false;
      if(agentContact.value=="") this.agentContactFlag[i]=true;
      else this.agentContactFlag[i]=false;
      // if(deliveryMode.value=="") this.deliveryModeFlag[i]=true;
      // else this.deliveryModeFlag[i]=false;

      // if(!this.expDeliveryDtFlag[i] && !this.agentNameFlag[i] && !this.agentContactFlag[i] && !this.deliveryModeFlag[i]){
        if(!this.expDeliveryDtFlag[i] && !this.agentNameFlag[i] && !this.agentContactFlag[i]){
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          deliveryStatus: SBISConstants.DELIVERY_CONST.OUT_FOR_DELIVERY,
          expectedDelivery: expDeliveryDt[2]+"-"+expDeliveryDt[1]+"-"+expDeliveryDt[0],
          dlvAgentName: agentName.value,
          dlvAgentContactNo: agentContact.value,
          workflowId: 'MED_ORDER'
          //deliveryMode: deliveryMode.value
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000'){
            this.toastService.showI18nToast(res['message'],"success");
            this.searchOrder();
          } 
        });
      }
      
    }
    else{
      if(expectedDelivery.value=="") this.expDeliveryDtDetFlag=true;
      else this.expDeliveryDtDetFlag=false;
      if(agentName.value=="") this.agentNameDetFlag = true;
      else this.agentNameDetFlag=false;
      if(agentContact.value=="") this.agentContactDetFlag=true;
      else this.agentContactDetFlag=false;
      // if(deliveryMode.value=="") this.deliveryModeDetFlag=true;
      // else this.deliveryModeDetFlag=false;

      // if(!this.expDeliveryDtDetFlag && !this.agentNameDetFlag && !this.agentContactDetFlag && !this.deliveryModeDetFlag){
        if(!this.expDeliveryDtDetFlag && !this.agentNameDetFlag && !this.agentContactDetFlag){
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          deliveryStatus: SBISConstants.DELIVERY_CONST.OUT_FOR_DELIVERY,
          //expectedDelivery: new Date(expectedDelivery.value).getFullYear() + '-' + ('0' + new Date(expectedDelivery.value).getDate()).slice(-2) + '-' + ('0' + (new Date(expectedDelivery.value).getMonth() + 1)).slice(-2),
          expectedDelivery: expDeliveryDt[2]+"-"+expDeliveryDt[1]+"-"+expDeliveryDt[0],
          dlvAgentName: agentName.value,
          dlvAgentContactNo: agentContact.value,
          workflowId: 'MED_ORDER'
          //deliveryMode: deliveryMode.value
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000'){
            this.toastService.showI18nToast(res['message'],"success");
            this.orderDetailView = false;
            this.searchOrder();
          } 
        });
      }
    }
  }

  saveDlv(rcvBy, rcvOn, dlvBy, res, i?){
    let rcvOnDt = rcvOn.value.split("-");
    if(i !== undefined){
      if(rcvBy.value=="") this.rcvByFlag[i]=true;
      else this.rcvByFlag[i]=false;
      if(rcvOn.value=="") this.rcvOnFlag[i]=true;
      else this.rcvOnFlag[i]=false;
      if(dlvBy.value=="") this.deliveredByFlag[i]=true;
      else this.deliveredByFlag[i]=false;


      if(!this.rcvByFlag[i] && !this.rcvOnFlag[i] && !this.deliveredByFlag[i]){
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          // actualDelivery: new Date(rcvOn.value).getFullYear() + '-' + ('0' + new Date(rcvOn.value).getDate()).slice(-2) + '-' + ('0' + (new Date(rcvOn.value).getMonth() + 1)).slice(-2),
          actualDelivery: rcvOnDt[2]+"-"+rcvOnDt[1]+"-"+rcvOnDt[0],
          deliveryStatus: SBISConstants.DELIVERY_CONST.DELIVERED,
          receivedBy: rcvBy.value,
          deliveredBy: dlvBy.value,
          receivedBySign: '',
          workflowId: 'MED_ORDER'
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000')
            this.toastService.showI18nToast(res['message'],"success");
            this.searchOrder();
        });
      }
      
    }
    else{
      if(rcvBy.value=="") this.rcvByDetFlag=true;
      else this.rcvByDetFlag=false;
      if(rcvOn.value=="") this.rcvOnDetFlag=true;
      else this.rcvOnDetFlag=false;
      if(dlvBy.value=="") this.deliveredByDetFlag=true;
      else this.deliveredByDetFlag=false;


      if(!this.rcvByDetFlag && !this.rcvOnDetFlag && !this.deliveredByDetFlag){
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          // actualDelivery: new Date(rcvOn.value).getFullYear() + '-' + ('0' + new Date(rcvOn.value).getDate()).slice(-2) + '-' + ('0' + (new Date(rcvOn.value).getMonth() + 1)).slice(-2),
          actualDelivery: rcvOnDt[2]+"-"+rcvOnDt[1]+"-"+rcvOnDt[0],
          deliveryStatus: SBISConstants.DELIVERY_CONST.DELIVERED,
          receivedBy: rcvBy.value,
          deliveredBy: dlvBy.value,
          receivedBySign: '',
          workflowId: 'MED_ORDER'
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000')
            this.toastService.showI18nToast(res['message'],"success");
            this.orderDetailView = false;
            this.searchOrder();
        });
      }
    }
   
    
  }

  saveAtm(reasonCode, res, i?){
    if(i !== undefined){
      if(reasonCode.value=="") this.reasonCodeFlag[i]=true;
      else this.reasonCodeFlag[i]=false;
      if(!this.reasonCodeFlag[i]){
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          deliveryStatus: SBISConstants.DELIVERY_CONST.ATTEMPTED,
          reasonCode: reasonCode.value,
          workflowId: 'MED_ORDER'
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000')
            this.toastService.showI18nToast(res['message'],"success");
            this.searchOrder();
        });
      }
      
    }
    else{
      if(reasonCode.value=="") this.reasonCodeDetFlag=true;
      else this.reasonCodeDetFlag=false;
      if(!this.reasonCodeDetFlag){
        let payload = {};
        payload = {
          deliveryRefNo: res.deliveryRefNo,
          deliveryStatus: SBISConstants.DELIVERY_CONST.ATTEMPTED,
          reasonCode: reasonCode.value,
          workflowId: 'MED_ORDER'
        }
        console.log(payload);
        this._deliveryService.saveDelivery(payload).subscribe(res => {
          if(res['status']=='2000')
            this.toastService.showI18nToast(res['message'],"success");
            this.orderDetailView = false;
            this.searchOrder();
        });
      }
    }
    
  }

  selectFile(event: any) {
    this.progress.percentage = 0;
    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 140) {
      document.getElementById("profilePhoto")["value"] = "";
      this.toastService.showToast(-1, "Photo should be less then 140KB");
      return;
    }
    let formdata: FormData = new FormData();
    formdata.append('userId', this.user.userId);
    formdata.append('file', file);

    this.individualService.uploadProfilePhoto(formdata, this.user.token).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        if (this.progress.percentage > 80) {
          this.progress.percentage = this.progress.percentage - 10;
        }
      } else if (event instanceof HttpResponse) {
        this.progress.percentage = 100;
        document.getElementById("profilePhoto")["value"] = "";
        this.loadProfileImage();
      }
    });

  }

  loadProfileImage() {

    this.individualService.downloadProfilePhoto(this.ms_User_Pk).subscribe(result => {
      if (result.status === 2000 && result.data != null && result.data.length > 0) {
        this.profileImageSrc = "data:image/jpeg;base64," + result.data;
        this.broadcastService.setProfileImage(this.profileImageSrc);
      }
      this.progress.percentage = 0;
    })
  }

  getResponse(response){
    if(response){
      this.searchOrder();
    }
    else{
      this.orderDetailView = false;
      this.searchOrder();
    }
  }

  viewDownloadPrescription(orderData){
    console.log(orderData);
    if(orderData.prescriptionRefNo !== null){
      this.appRefNo = orderData.appointmentRefNo;
      this.prescriptionSBIS = true;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    } else {
      this.downloadPrescription(orderData.prescriptionRefNo);
      this.prescriptionSBIS = false;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    }
  }
  downloadPrescription(documentRefNo) {
    let query = {
      'downloadFor': 'PRESCRIPTION',
      'documentRefNo': documentRefNo
    }
    this._pharmacyRequisitionService.prescriptionDownload(query).subscribe((result) => {
      if(result.status !=2000){
        return;
      }

      this.download.contentType=result.data.contentType;
      this.download.downloadImageSrc = "data:"+result.data.contentType+";base64," + result.data.data;
    })
  }

}
