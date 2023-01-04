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
import { ServiceProviderService } from '../service-provider.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
@Component({
  selector: 'app-inpatient-bill-raise',
  templateUrl: './inpatient-bill-raise.component.html',
  styleUrls: ['./inpatient-bill-raise.component.css']
})
export class InpatientBillRaiseComponent implements OnInit {

  currentUser:any;
  inPatientBillForm: FormGroup;
  isSubmitted:boolean=false;
  billDetailValidationError:boolean=false;
  patientName:string;
  admissionRefNo:string;
  ipdServiceList:any=[];
  associatedServiceList:any=[];
  allBills:any=[];
  totalBillAmount:number=0;
  admitedPatientDetails:any={'patientName':"","bedNo":"","roomNo":""};
  currentBill:any;
  temporaryBillDetail:any=[];
  constructor(private serviceProviderService: ServiceProviderService,
    private broadcastService: BroadcastService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.admissionRefNo=this.route.snapshot.paramMap.get('admissionRefNo');
    this.broadcastService.setHeaderText("IN-PATIENT BILL");
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.createInPatientBillForm();
    this.addBillDetailForm();
   this.getInpatientBillList();
   this.inPatientBillForm.patchValue({
    admissionRefNo: this.admissionRefNo
   })

   this.getAdmissionBasicInfo()
  }

  navigateToAdmissionDetails(){
    this.router.navigate(['opd/inpatient-summary']);
  }

  addBillDetailForm(){
    this.billDetailList.push(this.createBillDetailForm());
  }
  
  get billDetailList(): FormArray { // Used to get bill Detail form from main form
    return this.inPatientBillForm.get('billDetailList') as FormArray;
  }

  createInPatientBillForm() { // Used to create basic IPD Form
    this.isSubmitted=false;    
    let billDetailList: FormGroup[] = [];
    this.inPatientBillForm = this.fb.group({
      intBillNo:[null],      
      admissionRefNo: [null],
      hospitalRefNo: [null],
      doctorRefNo: [null],
      totalAmount:[0],
      billDate:[null], 
      comments:null,
      billDetailList: this.fb.array(billDetailList)
    });

  }

  createBillDetailForm(): FormGroup { // This method is Used to add bill Detail form    
    return this.fb.group({ 
      serviceName: [null, Validators.required],
      serviceRefNo: [null, Validators.required],
      usage: null,
      unit: null,
      amount: [null, Validators.required],
      detailPk:[null] ,
      hours:null,
      minutes:null,
      serviceType:null,  
      rateType:['FIX'],
      intBillPk:null,
      status:"NRM",
      basePrice:null,
      itemCode:null  // Working on app/issue/2403
    });
     
  }

  setBillDetailForm(serviceClickedEvent,index){// Used to set service reference No. into Bill Detail form
    let currentItemUnit:number=null
    if(serviceClickedEvent.rateType=="FIX"){
      currentItemUnit=1;
    }
    console.log("setBillDetailForm::",serviceClickedEvent);
    this.billDetailList.controls[index].patchValue({  
      serviceRefNo:serviceClickedEvent.serviceRefNo,
      serviceName: serviceClickedEvent.serviceName,
      rateType:serviceClickedEvent.rateType,
      unit:currentItemUnit,
      serviceType:serviceClickedEvent.category,
      itemCode:serviceClickedEvent.itemCode==null?"":serviceClickedEvent.itemCode // Working on app/issue/2403
    });
    
    this.getIpdServiceRateByRefNoAndQuantity(index)
    let requestQuery={
      serviceRefNo:serviceClickedEvent.serviceRefNo
    }
    this.serviceProviderService.getAssociatedServiceListByServiceRefNo(requestQuery).subscribe((res) => {
      this.associatedServiceList = res.data;
      for(let associateService of this.associatedServiceList){
        this.addBillDetailForm();
        this.addAssociatedBillDetailToForm(this.billDetailList.length-1,associateService);
      }
      
      
    },(error) => {
      ;
     });
    
  }

  addAssociatedBillDetailToForm(index,serviceObj){

    let currentItemUnit:number=null
    let basePrice:number=null;
    if(serviceObj.rateType=="FIX" ){
      currentItemUnit=1;
    }
    this.billDetailList.controls[index].patchValue({
      serviceName:serviceObj.serviceName,
      serviceRefNo: serviceObj.serviceRefNo,
      usage: null,
      unit: currentItemUnit,
      amount: null,
      detailPk:null ,
      hours:null,
      minutes:null,  
      rateType:serviceObj.rateType,
      serviceType:serviceObj.category
    })
    if(currentItemUnit>0)
    this.getIpdServiceRateByRefNoAndQuantity(index)
  }

  getIpdServiceBasicInfoList(event,index){
    let requestQuery={     
      serviceName:event.query      
    }
    
    this.serviceProviderService.getIpdServiceBasicInfoList(requestQuery).subscribe((res) => {
      this.ipdServiceList = res.data;
      // Working on app/issue/2401
     this.billDetailList.controls[index].patchValue({  
      serviceRefNo:null,
      unit:null,
      serviceType:null,
      itemCode:null,
      amount:null,
      usage: null,
      detailPk:null ,
      hours:null,
      minutes:null,  
      rateType:null
    });
    // End Working on app/issue/2401
     
    },(error) => {
     ;
    });
  }

  getIpdServiceRateByRefNoAndQuantity(index){

    let requestQuery={
      serviceRefNo:this.billDetailList.controls[index].value.serviceRefNo,
      rateType:this.billDetailList.controls[index].value.rateType,
      // Working on app/issue/1895
      hours:this.billDetailList.controls[index].value.hours,
      minutes:this.billDetailList.controls[index].value.minutes,
      // usage: this.calculateUsage(index),
      // End Working on app/issue/1895
      unit:this.billDetailList.controls[index].value.unit
    }
    console.log("requestQuery::",requestQuery);

    if(requestQuery.serviceRefNo!=null ){
     
      this.serviceProviderService.getIpdServiceRateByRefNoAndQuantity(requestQuery).subscribe((res) => {
        this.ipdServiceList = res.data;console.log("ipdServiceList::",this.ipdServiceList);
        let basePrice:number=null;
        if(this.billDetailList.controls[index].value.rateType=="FIX"){
          basePrice=res.data.totalCharge
        }
        this.billDetailList.controls[index].patchValue({
          amount:res.data.totalCharge,
          basePrice:basePrice
        });
        this.calculateTotalBillAmount();
      },(error) => {
        ;
       });
    }
    
  
  }

  calculateUsage(index){
    let hours=parseInt(this.billDetailList.controls[index].value.hours)
    let minutes=parseInt(this.billDetailList.controls[index].value.minutes)
    if(isNaN(hours)) hours = 0;
    if(isNaN(minutes)) minutes = 0;

    if((minutes>0)&& hours*60>0)  // Both Hour and Minutes Given    
      return (hours*60+minutes);

    else if((minutes<=0)) // Only Hour Given    
      return (hours*60);

    else if((minutes>0)&& hours<=0) // Only Minute Given
      return minutes;

    else if(minutes<=0 && (hours<=0)) // Neither Hour nor Minutes Given
      return 0;  
  }

  getInpatientBillList(){
    let requestQuery={
      admissionRefNo:this.admissionRefNo,
      isBillDetailsRequired:false,
    }
    this.serviceProviderService.getInpatientBillList(requestQuery).subscribe((res) => {
      this.allBills=res.data
      
    },(error) => {
     
     });

  }

  setBillDetailFieldValue(){
    for(let i=0;i< this.billDetailList.length;i++){
      let hours=parseInt(this.billDetailList.controls[i].value.hours)
      let minutes=parseInt(this.billDetailList.controls[i].value.minutes)
      if(isNaN(hours)) hours = 0;
      if(isNaN(minutes)) minutes = 0;
      if(hours>0 || minutes>0)
        this.billDetailList.controls[i].patchValue({
          usage: (hours*60+minutes)
        })
      else
      this.billDetailList.controls[i].patchValue({
        usage: null
      })
      
    }
  }



  saveInPatientBill(){
    this.calculateTotalBillAmount();    
    this.setBillDetailFieldValue()
    // Working on app/issue/2020
    var isAllCancelled:boolean=true;
    for(let bill of this.billDetailList.value){  
      if(bill.status=="NRM"){
        isAllCancelled=false;
        break;
      }
    }
    if(isAllCancelled){
      this.toastService.showI18nToast("Please Fill Up Atleast One Item Details", 'error');
      return false;
    }
        // Working on app/issue/2020
    for(let i=0;i<this.temporaryBillDetail.length;i++){
      //this.inpatientInvoiceForm.value.invoiceDetailList.push(tempBill)
      this.billDetailList.value.push(this.temporaryBillDetail[i]);
    }
   
   /*  this.inPatientBillForm.value.billDetailList=[]
    this.inPatientBillForm.value.billDetailList=this.temporaryBillDetail; */
    if(this.inPatientBillForm.value.totalAmount==0 && this.billDetailList.controls[0].value.serviceRefNo==null){
      this.toastService.showI18nToast("Please Fill Up Atleast One Item Details", 'error');
      return false;
    }
    // Working on app/issue/1578
    let i=0;
    for(let bill of this.billDetailList.value){    
      let unit=parseInt(bill.unit)
      if(isNaN(unit)) unit = 0;
      if( bill.serviceType!="PROCEDURE" &&  bill.status=="NRM" && (this.calculateUsage(i)==0 && unit==0)){        
        this.toastService.showI18nToast("Please Fill Up Usage Details For Item "+(i+1), 'error');
        return false;        
      }
      ++i;
    }
   // End Working on app/issue/1578
    this.serviceProviderService.saveInpatientBill(this.inPatientBillForm.value).subscribe((res) => {
      
      if(res.status==2000){
        this.toastService.showI18nToast("Bill created successfully", 'success');
        this.navigateToAdmissionDetails();
      }
      
      else
      if(res.status==500)
      this.toastService.showI18nToast("Bill Save Failed", 'error');
      
    },
      (error) => {
        this.toastService.showI18nToast("Bill Save Failed", 'error');
      }); 

  }

  calculateTotalBillAmount(){
    this.totalBillAmount=0;
    for(let i=0;i< this.billDetailList.length;i++){
      let itemItemAmount=parseInt(this.billDetailList.controls[i].value.amount);
      if(isNaN(itemItemAmount)) itemItemAmount=0;
      this.totalBillAmount=this.totalBillAmount+itemItemAmount  
      
    }

    this.inPatientBillForm.patchValue({
      totalAmount: this.totalBillAmount
    })
  }

  deleteBillDetail(index){
    
    if(this.billDetailList.controls[index].value.detailPk==null){
      if(confirm("Do You Want to Delete this Item?")){
        this.billDetailList.controls.splice(index, 1);
        this.billDetailList.value.splice(index, 1);        
      }
    }
    else{
      if(confirm("Do You Want to Delete this Item?")){
        this.billDetailList.controls[index].get('status').setValue("CXL");   
        this.temporaryBillDetail.push(this.billDetailList.controls[index].value);
        // this.makeBillDetailSoftDeleteList(index);     
        this.billDetailList.controls.splice(index, 1);
        this.calculateTotalBillAmount()
        

          
      }
    }
  }

  makeBillDetailSoftDeleteList(index){
    for(let billDetail of this.temporaryBillDetail){
      if(billDetail.detailPk==this.billDetailList.controls[index].value.detailPk)
        billDetail.status=this.billDetailList.controls[index].value.status
    }
    
  }
  

  getAdmissionBasicInfo(){
    let requestQuery={
      admissionRefNo:this.admissionRefNo
    }
    this.serviceProviderService.getAdmissionBasicInfo(requestQuery).subscribe((res) => {
      this.admitedPatientDetails.patientName=res.data.patientName
      this.admitedPatientDetails.bedNo=res.data.bedNo
      this.admitedPatientDetails.roomNo=res.data.roomNo
    },(error) => {
      ;
     });
  }

  editInPatientBill(bill){
    let requestQuery={
      intBillNo:bill.intBillNo
    }
    this.serviceProviderService.getInpatientBillDetailByRefNo(requestQuery).subscribe((res) => {
      this.currentBill=res.data;
      this.createInPatientBillForm();
      this.inPatientBillForm.patchValue({
        intBillNo:this.currentBill.intBillNo,
        admissionRefNo:this.admissionRefNo,
        comments:this.currentBill.comments
      });
      for(let billDetail of  this.currentBill.billDetailList){
        this.addBillDetailForm();
       this.addBillDetailToForm(this.billDetailList.length-1,billDetail);
      }

      if(this.currentBill.billDetailList.length==0)
        this.addBillDetailForm();
      else{
        this.calculateTotalBillAmount();
        // this.temporaryBillDetail=this.inPatientBillForm.value.billDetailList
      }
       
            
    },
      (error) => {
        this.toastService.showI18nToast("Bill Fetch Failed", 'error');
      }); 
  }

  addBillDetailToForm(index,billDetail){
    let hours:number=null;
    let minutes:number=null;
    if(billDetail.usage!=null)
    {
      hours=Math.floor(billDetail.usage/60);
      minutes=billDetail.usage-(hours*60);
    }

    let basePrice:number=null;
    if(billDetail.rateType=="FIX"){
      basePrice=billDetail.amount
    }
    this.billDetailList.controls[index].patchValue({ 
      serviceName:billDetail.serviceName,
      serviceRefNo: billDetail.serviceRefNo,
      usage: billDetail.usage,
      unit: billDetail.unit,
      amount: billDetail.amount,
      detailPk:billDetail.detailPk ,
      hours:hours,
      minutes:minutes,  
      rateType:billDetail.rateType,
      serviceType:billDetail.category,
      status:billDetail.status,
      intBillPk:billDetail.intBillPk,
      basePrice:basePrice
    });
  }


}
