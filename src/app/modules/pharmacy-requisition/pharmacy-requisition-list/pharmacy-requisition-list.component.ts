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
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { PharmacyRequisitionService } from '../pharmacyRequisition.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-pharmacy-requisition-list',
  templateUrl: './pharmacy-requisition-list.component.html',
  styleUrls: ['./pharmacy-requisition-list.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class PharmacyRequisitionListComponent implements OnInit {
  fetchRequisitionForm: FormGroup;
  buttonClassCurrent : any;
  buttonClassAnother : any;
  fromDate: any;
  toDate: any;
  stat = [];
  todate : Date = new Date();
  dateFormat:any;
  statusList : any;
  searchList : any;
  searchStr : String = "";
  user: any;
  pharmacyPk: any;
  allDataFetched = false;
  title: String = "Pharmacy Requisition";
  searchListLength: any;
  prescriptionList : any;
  isPaginator = false;
  cols: any[];
  modalRef: BsModalRef;
  requisitionData: any;
  requisitionForm: FormGroup;
  appRefNo : any;
  prescriptionSBIS: any =false;
  download={
    downloadImageSrc : "",
    contentType:"",
    doctorName:"",
    forUserName:""
  }
  @ViewChild('pharmacyRequisitionModal') pharmacyRequisitionModal: TemplateRef<any>;
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  

  constructor(private fb: FormBuilder,
              private router: Router,
              private _pharmacyRequisitionService: PharmacyRequisitionService,
              private broadcastService: BroadcastService,
              private bsModalService: BsModalService,
              private toastService: ToastService,
              private translate: TranslateService) {
                translate.setDefaultLang('en');
                translate.use('en');
              }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fromDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
    this.toDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
    this.dateFormat=environment.DATE_FORMAT;
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.searchList = null;
    this.searchStr = null;
    this.statusList = null;
    this.pharmacyPk = null;
    this.prescriptionList = null;
    

    // let index1 = this.findIndexToUpdateStatus("REQ");
    // if(index1 >= 0){}
    // else{
    //   this.stat.push('REQ');
    // }

    // let index2 = this.findIndexToUpdateStatus("RES");
    // if(index1 >= 0){}
    // else{
    //   this.stat.push('RES');
    // }

    // let index3 = this.findIndexToUpdateStatus("CON");
    // if(index1 >= 0){}
    // else{
    //   this.stat.push('CON');
    // }

    // let index4 = this.findIndexToUpdateStatus("PCN");
    // if(index1 >= 0){}
    // else{
    //   this.stat.push('PCN');
    // }

    this._pharmacyRequisitionService.getPharmacyPkByMsUserId(this.user.userId).subscribe(data => {
      console.log(data);   
      if(data['status']=='2000'){
        this.pharmacyPk = data.data;
        this.searchRequisition();
      }
    });

    this.createFetchRequisitionForm();
    this.getAllAppStatus("PHARMACY_REQUISITION_STATUS");
    
  }

  createRequisitionForm(requisitionData){
    let requestDetailList: FormGroup[] = [];
    for(let i = 0; i < requisitionData.pharmacyRequestDetailList.length;i++){
      requestDetailList.push(this.fb.group({
        pharmacyRequisitionDetailPk: requisitionData.pharmacyRequestDetailList[i].pharmacyRequisitionDetailPk,
        productId: requisitionData.pharmacyRequestDetailList[i].productId,
        productName: requisitionData.pharmacyRequestDetailList[i].productName,
        requestedQuantity: requisitionData.pharmacyRequestDetailList[i].requestedQuantity,
        availableQuantity: [requisitionData.pharmacyRequestDetailList[i].availableQuantity],
        priceInitial: requisitionData.pharmacyRequestDetailList[i].priceInitial,
        priceFinal: [requisitionData.pharmacyRequestDetailList[i].priceFinal]
      }));
    }
    
    this.requisitionForm = this.fb.group({
      city: requisitionData.city,
      doctorName: requisitionData.doctorName,
      line1: requisitionData.line1,
      line2: requisitionData.line2,
      pharmacyRequestPk: requisitionData.pharmacyRequestPk,
      prescriptionPk: requisitionData.prescriptionPk,
      requestBy: requisitionData.requestBy,
      requestStatus: requisitionData.requestStatus,
      requisitionRcvDatetime: requisitionData.requisitionRcvDatetime,
      requitionRefNo: requisitionData.requitionRefNo,
      pharmacyRequestDetailList: this.fb.array(requestDetailList),
      prescriptionDTOList: requisitionData.prescriptionDTOList
    });
    this.prescriptionList = requisitionData.prescriptionDTOList;
  }

  createFetchRequisitionForm(){
    let user = JSON.parse(localStorage.getItem('user'));
    this.fetchRequisitionForm = this.fb.group({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  onValueChange(label:any,dt: Date): void {
    //console.log(dt);
    // this.fetchPatientForm.patchValue({
    //   fromDate : ('0' + dt.getDate()).slice(-2) + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear(),
    // })
    if(label == 'fromDate'){
      this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
      // ('0' + dt.getDate()).slice(-2) + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear();
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

    console.log(this.fromDate);
    console.log(this.toDate);
  }

  resetSearchDate(){
    this.fetchRequisitionForm.patchValue({
      fromDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear() ,
      toDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear()
    });
  }

  resetRequisitionStatus(){
    this.fetchRequisitionForm.patchValue({
      reqStatus:''
    });       
    this.stat = [];
  }

  resetAll(){
    this.fetchRequisitionForm.patchValue({
      reqStatus:'',
      fromDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear() ,
      toDate : ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear()
    });       
    this.stat = [];
  }

  searchRequisition(){
    this.searchList= null;
    this.searchStr = "";

    if(this.pharmacyPk!="" && this.searchStr=="")
      this.searchStr="pharmacy:"+ this.pharmacyPk;
    else if(this.pharmacyPk!="" && this.searchStr!="")
      this.searchStr=this.searchStr+";pharmacy:"+ this.pharmacyPk; 

    if(this.fromDate!="" && this.searchStr=="" && this.fromDate!=null)
      this.searchStr="fromDate:"+ this.fromDate;
    else if(this.fromDate!="" && this.searchStr!="")
      this.searchStr=this.searchStr+";fromDate:"+ this.fromDate;
      
    if(this.toDate!="" && this.searchStr=="" && this.toDate!=null)
      this.searchStr="toDate:"+ this.toDate;
    else if(this.toDate!="" && this.searchStr!="")
      this.searchStr=this.searchStr+";toDate:"+ this.toDate;

    if(this.stat.length !=0 && this.searchStr=="")
      this.searchStr="status:"+ this.stat;    
    else if(this.stat.length !=0 && this.searchStr!="") 
      this.searchStr=this.searchStr+";status:"+ this.stat;

    console.log("searchStr = "+this.searchStr);
    this._pharmacyRequisitionService.getPharmacyRequisitionList('?search='+this.searchStr).subscribe(data => {
      console.log(data);   
      if(data['status']=='2000' && data.data.length!=0){
        this.searchList=data.data;
        console.log(this.searchList);        
        this.searchListLength = data.data.length;
        this.allDataFetched = true;
        if(data.data.length>5){
          this.isPaginator = true;
        }
      }else if(data['status']=='2000' && data.data.length==0){
        this.searchList=null;
        this.isPaginator = false;
        this.allDataFetched = true;
        this.searchListLength = 0;
      }else if(data['status']=='2500'){
        alert(data.message);
        this.searchList=null;
        this.isPaginator = false;
        this.allDataFetched = true;
        this.searchListLength = 0;
      }

    });  
  }

  changeClassButton1()
  {
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
  }

  changeClassButton2()
  {
    this.buttonClassCurrent = 'btn btn-light';
    this.buttonClassAnother = 'btn btn-dark';
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

  getAllAppStatus(name){
    this._pharmacyRequisitionService.GetAppStatus(name).subscribe(res => {
      this.statusList=res;
    });
  }

  getRequisitionDetail(data){
    console.log(data);
    this.requisitionData = data;
    this.createRequisitionForm(this.requisitionData);
    this.modalRef = this.bsModalService.show(this.pharmacyRequisitionModal, { class: 'modal-lg' });
  }

  check(event , requestedQuantity , avlQuantity , index){
    console.log("requestedQuantity = "+requestedQuantity);
    console.log("availableQuantity = "+avlQuantity);
    
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    
    if(avlQuantity > requestedQuantity){
      this.toastService.showToast(2001, "Available quantity can't greater than requested quantity.");
      let reqDetailList = this.requisitionForm.get('pharmacyRequestDetailList') as FormArray;
      let reqForm = reqDetailList.controls[index] as FormGroup;
      reqForm.controls.availableQuantity.patchValue(requestedQuantity);
    }
  }

  // checkFinalPrice(event , priceInitial , priceFinal , index){
  //   console.log("priceInitial = "+priceInitial);
  //   console.log("priceFinal = "+priceFinal);
    
  //   const pattern = /[0-9\+\-\ ]/;

  //   let inputChar = String.fromCharCode(event.charCode);
  //   if (event.keyCode != 8 && !pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }

  // }

  viewDownloadPrescription(requisitionData){
    console.log(requisitionData);
    if(requisitionData.prescriptionRefNo !== null){
      this.appRefNo = requisitionData.appointmentRefNo;
      this.prescriptionSBIS = true;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    } else {
      this.downloadPrescription(requisitionData.prescriptionRefNo);
      this.prescriptionSBIS = false;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    }
  }

  downloadFile(){
    const link = document.createElement('a');
    link.href =  this.download.downloadImageSrc;
    link.download =this.download.forUserName.replace(/\./g,'_')+"_"+ this.download.doctorName.replace(/\./g,'_');
    link.click();
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

  confirmRequisition(){
    console.log(this.requisitionForm.value);
    this.requisitionForm.patchValue({
      prescriptionDTOList: []
    })
    this._pharmacyRequisitionService.updatePharmacyRequestDetails(this.requisitionForm.value).subscribe(data => {
      if(data.status == 2000){
        //this.toastService.showToast(data.status, data.message);
        alert(data.message);
        window.location.reload();
      }else{
        //this.toastService.showToast(data.status, data.message);
        alert(data.message);
        window.location.reload();
      }
    });
  }

  rejectRequisition(){
    console.log(this.requisitionForm.value);
    this._pharmacyRequisitionService.rejectPharmacyRequest(this.requisitionForm.value).subscribe(data => {
      if(data.status == 2000){
        // this.toastService.showToast(data.status, data.message);
        alert(data.message);
        window.location.reload();
      }else{
        // this.toastService.showToast(data.status, data.message);
        alert(data.message);
        window.location.reload();
      }
    });
  }
}
