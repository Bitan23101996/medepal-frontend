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

import { Component, OnInit, ViewChild, TemplateRef, DoCheck} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { DeliveryService } from '../delivery.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../core/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IndividualService } from '../../individual/individual.service';
import { PharmacyRequisitionService } from '../../pharmacy-requisition/pharmacyRequisition.service';
import { environment } from '../../../../environments/environment.prod';
import { SBISConstants } from '../../../SBISConstants';
import { GetSet } from '../../../core/utils/getSet';

@Component({
  selector: 'app-lab-order-delivery',
  templateUrl: './lab-order-delivery.component.html',
  styleUrls: ['./lab-order-delivery.component.css']
})
export class LabOrderDeliveryComponent implements OnInit, DoCheck {

  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  searchLabOrderForm: FormGroup;
  buttonClassCurrent : any;
  buttonClassAnother : any;
  todate : Date = new Date();
  fromDate: any;
  toDate: any;
  dateFormat: any;
  statusList : any;
  modeList : any;
  searchList : any;
  resonList : any;
  searchStr : String = "";
  orderStateList: MenuItem[];
  orderDetailView: boolean = false;
  user: any;
  modalRef: BsModalRef;
  minDate: Date;
  domSanitizer: any;
  viewDate: Date;
  stat = [];
  modeArr = [];
  allDataFetched: any;
  searchListLength: any;
  title: String = "Order List";
  appRefNo: any;
  events: any = [];
  activeIndex : any;
  prescriptionSBIS: any =false;
  panelVisible = false;
  download={
    downloadImageSrc : "",
    contentType:"",
    doctorName:"",
    forUserName:""
  }
  downloadedImages: any = [];
  statusDisplayList: any ={};

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
      this.getAllAppStatus('DELIVERY_STATUS_LAB');
    }

  ngOnInit() {
    this.minDate = new Date();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fromDate = null;
    this.toDate = null;

    this.dateFormat=environment.DATE_FORMAT;
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.searchList = null;
    this.searchStr = null;
    this.statusList = null;
    this.resonList = null;
    this.modeList = null;
    this.viewDate = new Date();
    this.searchOrder();
    this.createLabOrderForm();
    
    this.getAllDeliveryMode('DELIVERY_MODE');
  }

  ngDoCheck() {
    if(GetSet.getRetrieveOrderListForDelivery()) {
      this.searchOrder();
      GetSet.setRetrieveOrderListForDelivery(false);
    }
  }

  // currentStatusMap(deliveryStatus: string): string{
  //   return this.statusDisplayList.find(findEl=> findEl.attributeValue == deliveryStatus).displayValue;
  // }

  getAllAppStatus(name){
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.statusList=res;  
      let obj: any = {};
      res.forEach(el=>{
        this.statusDisplayList[el.attributeValue] = el.displayValue;
        // this.statusDisplayList.add(obj);   
      });
      
    });
  }

  getAllDeliveryMode(name){
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.modeList=res;
    });
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  createLabOrderForm(){
    this.searchLabOrderForm = this.fb.group({
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

    //console.log("FROM VALUE CHANGE from = "+this.fromDate);
    //console.log("FROM VALUE CHANGE to = "+this.toDate);
  }

  searchOrder(){
    this.searchList= null;
    this.searchStr = "entityType:lab;workflowId:LABTEST_ORDER";
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
    
    this.getOrderListForDelivery(this.searchStr);
    
  }

  getOrderListForDelivery(searchStr) {
    this._deliveryService.getOrderDeliveryList('?search='+searchStr).subscribe(data => {
      // console.log(data); 
      if(data['status']=='2000' && data.data.length!=0){
        this.searchList=data.data;
        // console.log(this.searchList);        
        this.searchListLength = data.data.length;
        this.allDataFetched = true;
        this.getUploadedDocumentListAndSetTheListToTheArray();
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

  getResponse(response){
    if(response){
      this.searchOrder();
    }
    else{
      this.orderDetailView = false;
      this.searchOrder();
    }
  }

  orderDetails: any;
  showOrderDetails(q){
    this.orderDetailView = true;
    console.log(q);
    this.orderDetails = q;
    this.orderStateList = [];
    this.events = [];
    
    this.getDeliveryFlow(q.entityRequitionRefNo)
  }
  backToOrderList(){
    this.orderStateList = [];
    this.events = [];
    this.orderDetailView = false;
  }

  getDeliveryFlow(entityRequitionRefNo){
    let currDate = new Date();
    let payload = {
      entityRequitionRefNo: entityRequitionRefNo,
      entityType: 'lab',
      workflowId: 'LABTEST_ORDER'
    };
    this.activeIndex = null;
    this._deliveryService.getDeliveryFlow(payload).subscribe(res => {
      console.log(res);
      let label = "";
      
      for (let i = 0; i < res['data'].length; i++) {
       
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
    this.searchLabOrderForm.patchValue({
      orderStatus:'',
      fromDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear() ,
      toDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear(),
      mode:''
    });
    this.modeArr = [];
    this.stat = [];
  }

  resetSearchDate(){
    this.searchLabOrderForm.patchValue({
      fromDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear() ,
      toDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear()
    });
  }

  resetOrderStatus(){
    this.searchLabOrderForm.patchValue({
      orderStatus:''
    });       
    this.stat = [];
  }

  resetMode(){
    this.searchLabOrderForm.patchValue({
      mode:''
    });       
    this.modeArr = [];
  }

  getUploadedDocumentListAndSetTheListToTheArray() {
    this.searchList.forEach(elementArr => {
      elementArr['documentDetails'] = [];
      elementArr.entityRequestDetailList.forEach(element => {
        if(element.documentRefNo) {
          let query = {
            'downloadFor': SBISConstants.IMAGE_UPLOAD_CONST.TEST_REPORT,
            'documentRefNo': element.documentRefNo
          }
          this._deliveryService.downloadDocument(query).subscribe((result) => {
            if (result.status == 2000) {
              let imgSrc = "data:"+((result.data.contentType)? result.data.contentType: "image/jpeg")+";base64,"+ result.data.data;
              let imgURL: any = "data:"+((result.data.contentType)? result.data.contentType: "image/jpeg")+";base64,"+ result.data.data;
              elementArr.documentDetails.push({imgSrc: imgURL, contentType: result.data.contentType, actualSrc: imgSrc});
            }
          });
        }
      });
    });
    console.log(this.searchList);
    
  }//end of method

  //method to open image in new tab
  openImageInNewTab(imgSrc){
    var image = new Image();
    image.src = imgSrc;
    var w = window.open("");
    w.document.write(image.outerHTML);
  }//end of method

  openPdf(src){
    var newTab = window.open();
    newTab.document.body.innerHTML = '<iframe width="100%" height="101%" style="padding: 0;margin:0;" src="'+src+'""></iframe>';
    newTab.document.body.style.overflow = "hidden";
    newTab.document.body.style.margin = "0";
    newTab.document.body.style.padding = "0";

  }

   //Call this method in the image source, it will sanitize it.
   transform(imgSrc){
    return this._domSanitizer.bypassSecurityTrustResourceUrl(imgSrc);
  }//end of method

}
