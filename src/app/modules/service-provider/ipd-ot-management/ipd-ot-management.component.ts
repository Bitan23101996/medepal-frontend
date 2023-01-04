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
import { SBISConstants } from 'src/app/SBISConstants';
import { environment } from '../../../../../src/environments/environment';


@Component({
  selector: 'app-ipd-ot-management',
  templateUrl: './ipd-ot-management.component.html',
  styleUrls: ['./ipd-ot-management.component.css']
})
export class IpdOtManagementComponent implements OnInit {
  htmlElements: any = { showOtListSection: true, showOtMasterAddEditSection: false };
  otMasterDetailsList:any=[];
  dateFormat: any;
  currentUser:any;
  minDate=new Date();
  opearationTheaterForm: FormGroup;
  isSubmitted=false;
  totalCharge = 0;providerCharge =0;clinicCharge = 0;
  SBISConstantsRef = SBISConstants;
  showChargeByError: any={ providerChargeError: false, clinicChargeError: false };
  constructor(private serviceProviderService: ServiceProviderService,
    private broadcastService: BroadcastService,
    private fb: FormBuilder,
    private toastService: ToastService) 
    { }

  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    this.broadcastService.setHeaderText("Operation Theater");
    this.currentUser = JSON.parse(localStorage.getItem('user'));
     this.getAllOperationTheaterDetails();
    
  }

  getAllOperationTheaterDetails() { //Used to get All OT Master
   let payload={
    isRateInfoRequired:true
   };
    this.serviceProviderService.getAllOperationTheaterDetails(payload).subscribe(res => {
   
      this.otMasterDetailsList = [];
      this.otMasterDetailsList = res.data;
      console.log("otMasterDetailsList::",this.otMasterDetailsList);
      
    });
  }

  showOtMasterAddEditSection() {// Used to Add Edit Opearation Theater detail section  
    this.minDate = new Date();
    this.createOpearationTheaterForm();   
    this.htmlElements.showOtMasterAddEditSection = true;
    this.htmlElements.showOtListSection = false;   
  }

  showOtListSection() { // Used to Show Opearation Theater detail section    
    
    this.htmlElements.showOtListSection = true;
    this.htmlElements.showOtMasterAddEditSection = false;
   
  }

  deleteIpdService(operationTheater) { // Used to delete Opearation Theater for a particular User
    if (confirm("Do You Want to Delete " + operationTheater.name + " from Your IPD ??")) {
      let query = {       
        'refNo': operationTheater.refNo
      }

      this.serviceProviderService.deleteIPDServiceDetailsByHospitalRefNo(query).subscribe(res => {
        this.toastService.showI18nToast("Opearation Theater Deleted Successfully", 'success');
        this.getAllOperationTheaterDetails();
      },
        (error) => {
          this.toastService.showI18nToast("Opearation Theater Deletion Failed", 'error');
        });

    }
  }

  get otVariableRateList(): FormArray { // Used to get variable rate form from main form
    return this.opearationTheaterForm.get('otVariableRateList') as FormArray;
  }

  get otBedResourceList(): FormArray { // Used to get variable rate form from main form
    return this.opearationTheaterForm.get('otBedResourceList') as FormArray;
  }

  get otRate(): FormGroup { // Used to get variable rate form from main form
    return this.opearationTheaterForm.get('otRate') as FormGroup;
  }

  createOpearationTheaterForm() { // Used to create basic OT FORM
    this.isSubmitted=false; let today=new Date();this.totalCharge=0;
  
    let otVariableRateList: FormGroup[] = [];
   

    let otBedResourceList: FormGroup[] = [];
    if(!this.isEditEvent)
      otBedResourceList.push(this.createOtBedResourceForm());
    this.opearationTheaterForm = this.fb.group({
      name:[null, Validators.required],      
      refNo: [null],
      code: [null],

      otBedResourceList: this.fb.array(otBedResourceList),

      otRate: this.fb.group({
        providerCharge: [null],
        clinicCharge: [null],
        totalCharge: this.totalCharge,
        rateType: this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.FIX,
        fromDate: [new Date(), Validators.required],
        hospitalRefNo: this.currentUser.serviceProviderRefNo,
        chargedBy: this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC,
        chargeUnit: [null],
        chargeUnitValue: [null]
      }),      
      otVariableRateList: this.fb.array(otVariableRateList),
      
   
      editPermission:false,
      isRateChange:false 
    });
  console.log("opearationTheaterForm::",this.opearationTheaterForm);
  
  }
  showVariableRateValidationError=false;
  createVariableRateForm(): FormGroup { // This method is Used to add OT variable rate form
    this.showVariableRateValidationError=false;
    return this.fb.group({ 
      chargePattern: [this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO, Validators.required],
      inputValue: [null, Validators.required],
      startRange: 0,
      endRange: 0,
      rangeUnit:["HOUR", Validators.required],
      rate: [null, Validators.required],
      chargeUnit: [null],
      chargeUnitValue: [null],
      slidingRateFlag: 'N'
      
    });
  }

  createOtBedResourceForm(){
    return this.fb.group({ 
      resourceName:[null,Validators.required],
      resourceType:"OT_BED",
      refNo:null,
      status:'NRM'
    });
  }

  addOtBedResourceForm(){
    this.otBedResourceList.push(this.createOtBedResourceForm());
  }

  addVariableRateForm() { // This method is Used to add New row for OT variable rate form
    
    
    for (let i = 0; i < this.otVariableRateList.length; i++) {     
      if (this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN)
      {
        this.toastService.showI18nToast("No More Rate Creation Allowed","error");
        return false;
      } 
    }
    if(this.otVariableRateList.length==0){
      this.otVariableRateList.push(this.createVariableRateForm());
      this.otVariableRateList.controls[0].patchValue({
        chargePattern:this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO
      })
    }    
    else if(this.otVariableRateList.controls[this.otVariableRateList.length-1].valid){
      this.otVariableRateList.push(this.createVariableRateForm());
    }
    else{
      this.showVariableRateValidationError=true;
      this.toastService.showI18nToast("Please Fill Up all Mandatory Fields","error");
    } 
      
  }

  onRateTypeChange(rateTypevalue) { // Used to set values on rate type change
    this.opearationTheaterForm.patchValue({
      otRate:{
        rateType: rateTypevalue
      }
      
    });

  if (rateTypevalue == this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.SLAB) {
    this.otRate.patchValue({      
      chargedBy: this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC
    });

      //if(this.otVariableRateList.length==0)
      this.addVariableRateForm();
    }
 

  }


  isSlidingRateFlag=false;
  onPatternChange(event) { // Used to set field values for variable rate form at the time of edit

    let isMoreThanPresent:boolean=false;
    let isNextPresent:boolean=false;
    
    for (let i = 0; i < this.otVariableRateList.length; i++) {
    
      if (this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {
          isMoreThanPresent=true;
        } 

      if (this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT) {
          isNextPresent=true;
          this.otVariableRateList.controls[i].patchValue({
            slidingRateFlag:'Y'
          })
      }
      if (this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO
        || this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {
        this.otVariableRateList.controls[i].patchValue({
          slidingRateFlag:'N'
        })
    }
    }

    if(isMoreThanPresent &&
      ( event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO 
        || event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT)){
          this.toastService.showI18nToast("Wrong Input","error");
          this.otVariableRateList.controls[this.otVariableRateList.length - 1].patchValue({
            chargePattern:null
          })
    }

    if(isNextPresent &&
      event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO )
    {
          this.toastService.showI18nToast("Wrong Input","error");
          this.otVariableRateList.controls[this.otVariableRateList.length - 1].patchValue({
            chargePattern:null
          })
    }

    
    if (event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {
      this.setFieldValuesForVariableRateType();
    }

    for (let i = 0; i < this.otVariableRateList.length; i++) {
      if (this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT) {
        this.isSlidingRateFlag = true;
        this.otVariableRateList.controls[i].patchValue({
          slidingRateFlag:'Y'
        })
        break;
      }
    }

  }

  setFieldValuesForVariableRateType() { // Used to set start range, end range calculated value
    let otVariableRateListLength = this.otVariableRateList.length
    for (let i = 0; i < this.otVariableRateList.length; i++) {
    
      if (i == 0) {
        this.otVariableRateList.controls[i].patchValue({
          startRange: 0,
          endRange: parseInt(this.otVariableRateList.controls[i].value.inputValue)
        })
      }

      if (this.isSlidingRateFlag) {
        if (i != 0) {
          if(this.otVariableRateList.controls[i].value.chargePattern==this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO){
            this.otVariableRateList.controls[i].patchValue({
              startRange: parseInt(this.otVariableRateList.controls[i - 1].value.endRange),
              endRange: parseInt(this.otVariableRateList.controls[i].value.inputValue)
            })
          }
          if(this.otVariableRateList.controls[i].value.chargePattern==this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT){
            this.otVariableRateList.controls[i].patchValue({
              startRange: parseInt(this.otVariableRateList.controls[i - 1].value.endRange),
              endRange: parseInt(this.otVariableRateList.controls[i].value.inputValue) + parseInt(this.otVariableRateList.controls[i - 1].value.endRange)
            })
        }
        }
      }
      else {
        if ((i > 0) && (i < this.otVariableRateList.length - 1)) {
          this.otVariableRateList.controls[i].patchValue({
            startRange: parseInt(this.otVariableRateList.controls[i - 1].value.endRange),
            endRange: parseInt(this.otVariableRateList.controls[i].value.inputValue)
          })
        }
      }

      if (this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {

        this.otVariableRateList.controls[i].patchValue({
          startRange: parseInt(this.otVariableRateList.controls[otVariableRateListLength - 2].value.endRange),
          inputValue: parseInt(this.otVariableRateList.controls[otVariableRateListLength - 2].value.endRange),
          endRange: null
        })

      }

 console.log("variable Form:",this.otVariableRateList);
 
    }
  }

  checkInputValueForCurrentVarRate(event, i) { // Used to validate variable rate End range value
    if ((i > 0) && (this.otVariableRateList.controls[i].value.inputValue <= this.otVariableRateList.controls[i - 1].value.inputValue)
      && !(this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT)) {
      this.toastService.showI18nToast("Wrong Input", 'error');
      this.otVariableRateList.controls[i].patchValue({
        inputValue: null
      })
    }
  }
  isEditEvent=false;
  editOtDetails(otDetailsObj) { // Used to create variable rate form at the time of edit
    console.log("otDetailsObj:::", otDetailsObj);
    this.isEditEvent=true;
    this.showOtMasterAddEditSection();
    this.editOpearationTheaterForm(otDetailsObj);
    this.isEditEvent=false;
  }

  editOpearationTheaterForm(otDetailsObj) { // Used to set values for variable rate form at the time of edit
    
    let otVariableRateList= this.otVariableRateList;  
   
    for (let i = 0; i < otDetailsObj.otVariableRateList.length; i++) {
    
      let varRateForm=this.fb.group({
        chargePattern: [this.setChargePatternValueForVarRate(otDetailsObj.otVariableRateList[i])],
        inputValue: [null],
        startRange: [otDetailsObj.otVariableRateList[i].startRange],
        endRange: [otDetailsObj.otVariableRateList[i].endRange],
        rate: [otDetailsObj.otVariableRateList[i].rate],
        chargeUnit: [otDetailsObj.otVariableRateList[i].chargeUnit==null?null:otDetailsObj.otVariableRateList[i].chargeUnit],
        chargeUnitValue: [otDetailsObj.otVariableRateList[i].chargeUnitValue==null?null:otDetailsObj.otVariableRateList[i].chargeUnitValue],
        slidingRateFlag: [otDetailsObj.otVariableRateList[i].slidingRateFlag],
        rangeUnit:[otDetailsObj.otVariableRateList[i].rangeUnit]
        
      });
      otVariableRateList.push(varRateForm);
    }

    let otBedResourceList=this.otBedResourceList;
    // otBedResourceList=this.fb.array([]);
    for(let bedResource of otDetailsObj.otBedResourceList){
      let otBedResourceGroup=this.fb.group({
      resourceName:bedResource.resourceName,
      resourceType:"OT_BED",
      refNo:bedResource.refNo,
      status:'NRM'
      });
      otBedResourceList.push(otBedResourceGroup);
    }
   
    this.minDate=new Date(otDetailsObj.fromDate);
    
    this.opearationTheaterForm.patchValue({
      name:otDetailsObj.name,     
      refNo:otDetailsObj.refNo,
      code: otDetailsObj.code,
      otRate:{
        providerCharge: otDetailsObj.otRate.providerCharge,
        clinicCharge: otDetailsObj.otRate.clinicCharge,
        totalCharge: otDetailsObj.otRate.totalCharge,
        rateType: otDetailsObj.otRate.rateType,
        fromDate: otDetailsObj.otRate.fromDate==null?null:new Date(otDetailsObj.otRate.fromDate),     
        chargedBy: otDetailsObj.otRate.chargedBy,
        chargeUnit: otDetailsObj.otRate.chargeUnit,
        chargeUnitValue: otDetailsObj.otRate.chargeUnitValue  
      },
      isRateChange:false ,
     
    });   

    this.totalCharge=otDetailsObj.otRate.totalCharge
     if(otDetailsObj.otRate.chargeUnitValue!=null){
      this.createVariableRateForm();
      let varRateForm=this.fb.group({
        chargePattern:this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.FLAT,
        rate:otDetailsObj.otRate.totalCharge,
        chargeUnitValue:otDetailsObj.otRate.chargeUnitValue,
        chargeUnit:otDetailsObj.otRate.chargeUnit,
        slidingRateFlag: 'N',
        rangeUnit:null
      })
      otVariableRateList.push(varRateForm);
      this.opearationTheaterForm.patchValue({
        otRate:{
          rateType:this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.SLAB,
          totalCharge:null
        }
        
      });
    } 

  /*   if (this.opearationTheaterForm.value.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC){
      this.opearationTheaterForm.patchValue({
        providerCharge: 0
      });
      this.opearationTheaterForm.controls.providerCharge.markAsDirty();
    }
 */

    this.setInputValueForVarRate();    
    this.htmlElements.showAddEditIpdServiceSection = true;
    this.htmlElements.showIpdServiceDetailsSection = false;
    console.log("opearationTheaterForm::",this.opearationTheaterForm.value);
    
  }

  setInputValueForVarRate(){ // Used to set input value for variable rate at the time of edit
    for (let i = 0; i < this.otVariableRateList.length; i++) 
    {
      if(this.otVariableRateList.controls[i].value.slidingRateFlag=="Y"){
        this.otVariableRateList.controls[i].patchValue({
          inputValue:  parseInt(this.otVariableRateList.controls[i].value.endRange) - parseInt(this.otVariableRateList.controls[i].value.startRange)
        })
      }
      else{
        
        this.otVariableRateList.controls[i].patchValue({
          inputValue:  parseInt(this.otVariableRateList.controls[i].value.endRange)
        })
      }

      if (this.otVariableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {

        this.otVariableRateList.controls[i].patchValue({
          startRange: parseInt(this.otVariableRateList.controls[this.otVariableRateList.length - 2].value.endRange),
          inputValue: parseInt(this.otVariableRateList.controls[this.otVariableRateList.length - 2].value.endRange),
          endRange: null
        })

      }
    }

  }

  setChargePatternValueForVarRate(varRateObj){ // Used to set Charge Pattern value for variable rate form at the time of edit   
    
    
      if((varRateObj.slidingRateFlag=="Y") && (varRateObj.endRange!=null)){ 
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT
      }
      else if((varRateObj.chargeUnit==null) && (varRateObj.endRange==null)){
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN
      }
      else if((varRateObj.chargeUnit!=null) && (varRateObj.endRange==null)){ 
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN
      }
      else if((varRateObj.slidingRateFlag=="N") && varRateObj.endRange!=null){ 
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO
      }
      else if(varRateObj.inputValue==null){
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.FLAT
      }
  }

  nextHourCalculation(varRateObj){ // Used in Html to calculate difference of End Range and Start Range
    return (varRateObj.endRange -varRateObj.startRange);
  }

  attempToSaveOtDetails(){
    this.isSubmitted=true;

     if (this.opearationTheaterForm.value.otRate.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.BOTH){

      if(this.opearationTheaterForm.value.otRate.providerCharge==null || this.opearationTheaterForm.value.otRate.providerCharge==""){
        this.showChargeByError.providerChargeError=true;       
           return false;
      } 
      else{
        this.showChargeByError.providerChargeError=false;
       
      }

      if(this.opearationTheaterForm.value.otRate.clinicCharge==null || this.opearationTheaterForm.value.otRate.clinicCharge==""){
        this.showChargeByError.clinicChargeError=true;       
           return false;
      }
      else{
        this.showChargeByError.clinicChargeError=false;       
      }

    }
    if(this.otVariableRateList.length>0){
      if (this.otVariableRateList.controls[0].value.chargePattern==this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.FLAT){
        this.opearationTheaterForm.patchValue({
          otRate:{
          totalCharge: this.otVariableRateList.controls[0].value.rate,
          chargeUnit: this.otVariableRateList.controls[0].value.chargeUnit,
          chargeUnitValue: this.otVariableRateList.controls[0].value.chargeUnitValue,
          rateType:this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.FIX  
          }
        })  
         this.otVariableRateList.controls[0].get('rangeUnit').clearValidators();
         this.otVariableRateList.controls[0].get('rangeUnit').setErrors(null);
         this.otVariableRateList.controls[0].get('rangeUnit').reset();
         if(this.otVariableRateList.controls[0].get('inputValue')){
          this.otVariableRateList.controls[0].get('inputValue').clearValidators();
          this.otVariableRateList.controls[0].get('inputValue').setErrors(null);
         }
         
         
      }
    }
   console.log("otRate::",this.otRate);
   
  

  if(this.otRate.controls.clinicCharge.dirty 
      || this.otRate.controls.providerCharge.dirty 
      || this.otVariableRateList.dirty) {
   
      this.opearationTheaterForm.patchValue({
        isRateChange:true
      })
    } 

    if(this.opearationTheaterForm.valid)
      this.saveOperationTheaterDetails()
    else
      this.showVariableRateValidationError=true;


        console.log("OT FORM::",this.opearationTheaterForm);
  }
  saveOperationTheaterDetails() { // Used to save OT Details
    this.setFieldValuesForVariableRateType();  
   
      /* for(let i=0;i<this.temporaryOtBedDetail.length;i++){       
        this.otBedResourceList.value.push(this.temporaryOtBedDetail[i]);
      } */
      console.log("OT FORM: SAVE", this.opearationTheaterForm.value);
       this.serviceProviderService.saveOperationTheaterDetails(this.opearationTheaterForm.value).subscribe((res) => {
 
      this.totalCharge = this.providerCharge =this.clinicCharge = 0;

      if(res.status==2000){
        this.getAllOperationTheaterDetails();
        this.toastService.showI18nToast("Added Successfully", 'success');
        this.showOtListSection();
      }
      
      else
      if(res.status==500)
      this.toastService.showI18nToast("Operation Theater Service Save Failed", 'error');
   
      // this.showOtListSection();

    },
      (error) => {
        this.toastService.showI18nToast("Operation Theater Service Save Failed", 'error');
      });  
 
  }
  temporaryOtBedDetail:any=[];
  deleteOtBed(bedIndex,otBedResource){ // Used to Delete variable rate
   console.log(otBedResource);
   
    if(this.otBedResourceList.controls[bedIndex].value.refNo==null){
      if(confirm("Do You Want to Delete this Bed?")){
        this.otBedResourceList.controls.splice(bedIndex, 1);
        this.otBedResourceList.value.splice(bedIndex, 1);
        
      }
    }
    else{
      if(confirm("Do You Want to Delete this Bed?")){
        this.otBedResourceList.controls[bedIndex].get('status').setValue("CXL");   
        this.temporaryOtBedDetail.push(this.otBedResourceList.controls[bedIndex].value);       
        this.otBedResourceList.controls.splice(bedIndex, 1);
        console.log("temporaryOtBedDetail::",this.temporaryOtBedDetail);
        
      }
    }
    
  }

  deleteOtDetails(otDetailsObj) { // Used to delete Ot details
    if (confirm("Do You Want to Delete this Operation Theater from Your OPD ??")) {
      let query = {
        'refNo': otDetailsObj.refNo       
      }
      this.serviceProviderService.deleteOperationTheaterDetails(query).subscribe(res => {

        this.toastService.showI18nToast("Operation Theater Deleted Successfully", 'success');
        this.getAllOperationTheaterDetails();
      },
        (error) => {
          this.toastService.showI18nToast("Operation Theater Deletion Failed", 'error');
        });

    }
  }

  onChargedByChange(chargedByValue) { // Used to set charged by value
    this.otRate.patchValue({
      chargedBy: chargedByValue
    });

    if (this.otRate.value.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.BOTH){
      this.otRate.patchValue({
        providerCharge: null
        
      });
    }

    if (this.otRate.value.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC){
      this.otRate.patchValue({
        providerCharge: 0
      });
      this.otRate.controls.providerCharge.markAsDirty();
      this.calculateIpdServiceCharge();// Working on app/issue/1595
    }
  }

  
  calculateIpdServiceCharge() {// Used to calculate total charge for FIX rate
    this.totalCharge = 0;
    if(this.otRate.value.providerCharge){
      this.showChargeByError.providerChargeError=false;
    }
    if(this.otRate.value.clinicCharge){
      this.showChargeByError.clinicChargeError=false;
    }

    if (this.otRate.value.providerCharge != null)
      this.providerCharge = +this.otRate.value.providerCharge;
    if (this.otRate.value.clinicCharge != null)
      this.clinicCharge = +this.otRate.value.clinicCharge;
   
    this.totalCharge = this.providerCharge + this.clinicCharge;
    this.otRate.patchValue({
      totalCharge: this.totalCharge
    });
  }

  deleteVariableRate(varRateIndex){ // Used to Delete variable rate
    if(confirm("Do You Want to Delete this Rate?")){
      this.otVariableRateList.controls.splice(varRateIndex, 1);
      this.otVariableRateList.value.splice(varRateIndex, 1);
      // DB Call required to make the rate CXL
    }
  }


}
