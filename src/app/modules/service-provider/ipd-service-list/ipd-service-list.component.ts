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
import { IndividualService } from '../../individual/individual.service';
@Component({
  selector: 'app-ipd-service-list',
  templateUrl: './ipd-service-list.component.html',
  styleUrls: ['./ipd-service-list.component.css']
})
export class IpdServiceListComponent implements OnInit {
  ipdServiceCategoriesList: any = [];
  currentTab: string = "PROCEDURE";
  currentUser: any;
  ipdServiceList: any = [];
  ipdServiceForm: FormGroup;
  totalCharge: number = 0;
  providerCharge: number = 0;
  clinicCharge: number = 0;
  SBISConstantsRef = SBISConstants;
  fromDate: any;
  dateFormat: any;
  ipdServiceNameList: any = [];
  isSlidingRateFlag: boolean = false;
  showVariableRateValidationError: boolean=false;
  isSubmitted:boolean=false;
  loading:boolean=false;
  minDate=new Date();  addMedicalReportResults: any[];
  htmlElements: any = { showIpdServiceDetailsSection: true, showIpdServiceAddEditSection: false }
  showChargeByError: any={ providerChargeError: false, clinicChargeError: false };
  constructor(private serviceProviderService: ServiceProviderService,
    private broadcastService: BroadcastService,
    private fb: FormBuilder,private individualService: IndividualService,
    private toastService: ToastService) { }

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.dateFormat = environment.DATE_FORMAT;
    this.broadcastService.setHeaderText(this.currentTab);
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.getIpdServiceCategoriesList();
    this.getIpdServiceDetailsByCategory();
  }

  getIpdServiceCategoriesList() { // Used to get IPD service category List
    this.serviceProviderService.getIPDServiceCategories().subscribe(res => {
      for (let category of res.data) {
        let status = true;
        if (category == this.currentTab)
          status = false;

        this.ipdServiceCategoriesList.push({ category: category, displayStatus: status })
      }
    });
  }

  getIpdServiceDetailsByCategory() { //Used to get IPD service by Category
    let query = {
      'hospitalRefNo': this.currentUser.serviceProviderRefNo,
      'category': this.currentTab
    }
    this.serviceProviderService.getIPDServiceDetailsByCategory(query).subscribe(res => {
      this.ipdServiceList = [];
      this.ipdServiceList = res.data;
      console.log("ipdServiceList::",this.ipdServiceList);
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    });
  }

  showCurrentServiceList(serviceCategory) { // Used to Show Current IPD Service category tab
    this.currentTab = serviceCategory;
    for (let categoryObj of this.ipdServiceCategoriesList) {
      if (categoryObj.category == this.currentTab)
        categoryObj.displayStatus = false;
      else
        categoryObj.displayStatus = true;
    }
    this.getIpdServiceDetailsByCategory()
    this.broadcastService.setHeaderText(this.currentTab);
  }

  showAddEditIpdServiceSection() {// Used to Add Edit IPD Service detail section  
    this.minDate = new Date();
    this.createBasicIpdServiceForm();   
    this.htmlElements.showAddEditIpdServiceSection = true;
    this.htmlElements.showIpdServiceDetailsSection = false;
    this.broadcastService.setHeaderText('REGISTER SERVICE - ' + this.currentTab);
    // this.getIpdServiceListByCategory();
  }

  showIpdServiceDetailsSection() { // Used to Show IPD Service detail section
    
    this.createBasicIpdServiceForm();    
    this.htmlElements.showIpdServiceDetailsSection = true;
    this.htmlElements.showAddEditIpdServiceSection = false;
    this.broadcastService.setHeaderText(this.currentTab);
  }

  deleteIpdService(ipdService) { // Used to delete IPD Service for a particular User
    if (confirm("Do You Want to Delete " + ipdService.name + " from Your OPD ??")) {
      let query = {
        'hospitalRefNo': this.currentUser.serviceProviderRefNo,
        'serviceRefNo': ipdService.serviceRefNo,
        'systemCode': ipdService.code,//systemCode,
        'category': this.currentTab
      }

      this.serviceProviderService.deleteIPDServiceDetailsByHospitalRefNo(query).subscribe(res => {

        this.toastService.showI18nToast("IPD Service Deleted Successfully", 'success');
        this.getIpdServiceDetailsByCategory();
      },
        (error) => {
          this.toastService.showI18nToast("IPD Service Deletion Failed", 'error');
        });

    }
  }

  get variableRateList(): FormArray { // Used to get variable rate form from main form
    return this.ipdServiceForm.get('variableRateList') as FormArray;
  }

  createBasicIpdServiceForm() { // Used to create basic IPD Form
    this.isSubmitted=false;
    let today=new Date()
    this.totalCharge=0;
    let chargedBy:string="";
    if(this.currentTab=="PROCEDURE"){
      chargedBy= this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.BOTH
    }
    else{
      chargedBy= this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC
    }
    let variableRateList: FormGroup[] = [];
    this.ipdServiceForm = this.fb.group({
      name:[null, Validators.required],
      category:this.currentTab,
      serviceRefNo: [null],
      serviceName: [null],
      code: [null],
      providerCharge: [null],
      clinicCharge: [null],
      totalCharge: this.totalCharge,
      rateType: this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.FIX,
      fromDate: [new Date(), Validators.required],
      hospitalRefNo: this.currentUser.serviceProviderRefNo,
      chargedBy: chargedBy,
      chargeUnit: [null],
      chargeUnitValue: [null],
      serviceMapPk:[null],
      editPermission:false,
      isRateChange:false ,
      variableRateList: this.fb.array(variableRateList),
      validity: [null],
      systemCode: [null]//added for dia
    });
  
  }

  onRateTypeChange(rateTypevalue) { // Used to set values on rate type change
    this.ipdServiceForm.patchValue({
      rateType: rateTypevalue
    });
// Commented for app/issue/2363 -->When switching between flat rate and variable rate, charges are not displaying in Service Master

 /*    if (rateTypevalue == this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.FIX) {
      this.ipdServiceForm.patchValue({
        chargedBy: this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.BOTH
      });
      let variableRateList: FormGroup[] = [];
      this.ipdServiceForm.controls.variableRateList = this.fb.array(variableRateList);
    }

    if (rateTypevalue == this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.SLAB) {
      this.addVariableRateForm();
      this.ipdServiceForm.patchValue({
        providerCharge: null,
        clinicCharge: null,
        totalCharge: null,
        chargedBy: this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC
      });
      this.totalCharge = this.providerCharge =this.clinicCharge = 0;
     
     
    } */
  // End of Commented for app/issue/2363 -->When switching between flat rate and variable rate, charges are not displaying in Service Master
  
  // Working on app/issue/2363
  if (rateTypevalue == this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.SLAB) {
    this.ipdServiceForm.patchValue({      
      chargedBy: this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC
    });

      if(this.variableRateList.length==0)
      this.addVariableRateForm();
    }
  // End Working on app/issue/2363

  }

  calculateIpdServiceCharge() {// Used to calculate total charge for FIX rate
    this.totalCharge = 0;
    if(this.ipdServiceForm.value.providerCharge){
      this.showChargeByError.providerChargeError=false;
    }
    if(this.ipdServiceForm.value.clinicCharge){
      this.showChargeByError.clinicChargeError=false;
    }

    if (this.ipdServiceForm.value.providerCharge != null)
      this.providerCharge = +this.ipdServiceForm.value.providerCharge;
    if (this.ipdServiceForm.value.clinicCharge != null)
      this.clinicCharge = +this.ipdServiceForm.value.clinicCharge;
   
    this.totalCharge = this.providerCharge + this.clinicCharge;
    this.ipdServiceForm.patchValue({
      totalCharge: this.totalCharge
    });
  }

  onChargedByChange(chargedByValue) { // Used to set charged by value
    this.ipdServiceForm.patchValue({
      chargedBy: chargedByValue
    });

    if (this.ipdServiceForm.value.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.BOTH){
      this.ipdServiceForm.patchValue({
        providerCharge: null
        
      });
    }

    if (this.ipdServiceForm.value.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC){
      this.ipdServiceForm.patchValue({
        providerCharge: 0
      });
      this.ipdServiceForm.controls.providerCharge.markAsDirty();
      this.calculateIpdServiceCharge();// Working on app/issue/1595
    }
  }

  addVariableRateForm() { // This method is Used to add New row for variable rate form
    
    for (let i = 0; i < this.variableRateList.length; i++) {     
      if (this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN)
      {
        this.toastService.showI18nToast("No More Rate Creation Allowed","error");
        return false;
      } 
    }
    if(this.variableRateList.length==0){
      this.variableRateList.push(this.createVariableRateForm());
      this.variableRateList.controls[0].patchValue({
        chargePattern:this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO
      })
    }    
    else if(this.variableRateList.controls[this.variableRateList.length-1].valid){
      this.variableRateList.push(this.createVariableRateForm());
    }
    else{
      this.showVariableRateValidationError=true;
      this.toastService.showI18nToast("Please Fill Up all Mandatory Fields","error");
    }
      
  }

  createVariableRateForm(): FormGroup { // This method is Used to add variable rate form
    this.showVariableRateValidationError=false;
    return this.fb.group({ 
      chargePattern: [null, Validators.required],
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


  onPatternChange(event) { // Used to set field values for variable rate form at the time of edit
    console.log(event.target.value)
    let isMoreThanPresent:boolean=false;
    let isNextPresent:boolean=false;
    
    for (let i = 0; i < this.variableRateList.length; i++) {
    
      if (this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {
          isMoreThanPresent=true;
        } 

      if (this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT) {
          isNextPresent=true;
          this.variableRateList.controls[i].patchValue({
            slidingRateFlag:'Y'
          })
      }
      if (this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO
        || this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {
        this.variableRateList.controls[i].patchValue({
          slidingRateFlag:'N'
        })
    }
    }

    if(isMoreThanPresent &&
      ( event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO 
        || event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT)){
          this.toastService.showI18nToast("Wrong Input","error");
          this.variableRateList.controls[this.variableRateList.length - 1].patchValue({
            chargePattern:null
          })
    }

    if(isNextPresent &&
      event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO )
    {
          this.toastService.showI18nToast("Wrong Input","error");
          this.variableRateList.controls[this.variableRateList.length - 1].patchValue({
            chargePattern:null
          })
    }

    
    if (event.target.value == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {
      this.setFieldValuesForVariableRateType();
    }

    for (let i = 0; i < this.variableRateList.length; i++) {
      if (this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT) {
        this.isSlidingRateFlag = true;
        this.variableRateList.controls[i].patchValue({
          slidingRateFlag:'Y'
        })
        break;
      }
    }

  }

 /*  getIpdServiceListByCategory(event) { // Used to get IPD service name by category
    this.serviceProviderService.getIpdServiceListByCategory(this.currentTab).subscribe((res) => {
      this.ipdServiceNameList = res.data;
    });
  }
 */
  
  getIpdServiceList(event) { // Used to get IPD service name suggestions
    let requestQuery={
      category:this.currentTab,
      name:event.query
    }
    this.serviceProviderService.getIpdServiceList(requestQuery).subscribe((res) => {
      this.ipdServiceNameList = res.data;
    });
  }

  attempToSaveIpdService(){
    this.isSubmitted=true;

     if (this.ipdServiceForm.value.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.BOTH){

      if(this.ipdServiceForm.value.providerCharge==null || this.ipdServiceForm.value.providerCharge==""){
        this.showChargeByError.providerChargeError=true;       
           return false;
      } 
      else{
        this.showChargeByError.providerChargeError=false;
       
      }

      if(this.ipdServiceForm.value.clinicCharge==null || this.ipdServiceForm.value.clinicCharge==""){
        this.showChargeByError.clinicChargeError=true;       
           return false;
      }
      else{
        this.showChargeByError.clinicChargeError=false;       
      }

    }
    if(this.variableRateList.length>0){
      if (this.variableRateList.controls[0].value.chargePattern==this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.FLAT){
        this.ipdServiceForm.patchValue({
          totalCharge: this.variableRateList.controls[0].value.rate,
          chargeUnit: this.variableRateList.controls[0].value.chargeUnit,
          chargeUnitValue: this.variableRateList.controls[0].value.chargeUnitValue,
          // rateType:this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.FIX                // Working on app/issue/2011
        })  
         this.variableRateList.controls[0].get('rangeUnit').clearValidators();
         this.variableRateList.controls[0].get('rangeUnit').setErrors(null);
         this.variableRateList.controls[0].get('rangeUnit').reset();
         if(this.variableRateList.controls[0].get('inputValue')){
          this.variableRateList.controls[0].get('inputValue').clearValidators();
          this.variableRateList.controls[0].get('inputValue').setErrors(null);
         }
         
         
      }
    }
   
  

 if(this.ipdServiceForm.controls.clinicCharge.dirty 
      || this.ipdServiceForm.controls.providerCharge.dirty 
      || this.variableRateList.dirty) {
   
      this.ipdServiceForm.patchValue({
        isRateChange:true
      })
    }

    if(this.ipdServiceForm.valid)
      this.saveIpdService()
    else
      this.showVariableRateValidationError=true;


        console.log("IPD Form::",this.ipdServiceForm);
  }
  saveIpdService() { // Used to save Ipd Service Details
    this.setFieldValuesForVariableRateType();  
    console.log("IPD FORM: SAVE", this.ipdServiceForm);
 
      this.serviceProviderService.saveIPDServiceDetailsByHospitalRefNo(this.ipdServiceForm.value).subscribe((res) => {
      console.log("IPD Service SAVE RESPONSE: ", res);
      this.totalCharge = this.providerCharge =this.clinicCharge = 0;

      if(res.status==2000)
      this.toastService.showI18nToast("Added Successfully", 'success');
      else
      if(res.status==500)
      this.toastService.showI18nToast("IPD Service Save Failed", 'error');
      this.getIpdServiceDetailsByCategory();
      this.showIpdServiceDetailsSection();

    },
      (error) => {
        this.toastService.showI18nToast("IPD Service Save Failed", 'error');
      });  
 
  }

  setFieldValuesForVariableRateType() { // Used to set start range, end range calculated value
    let variableRateListLength = this.variableRateList.length
    for (let i = 0; i < this.variableRateList.length; i++) {
    
      if (i == 0) {
        this.variableRateList.controls[i].patchValue({
          startRange: 0,
          endRange: parseInt(this.variableRateList.controls[i].value.inputValue)
        })
      }

      if (this.isSlidingRateFlag) {
        if (i != 0) {
          if(this.variableRateList.controls[i].value.chargePattern==this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO){
            this.variableRateList.controls[i].patchValue({
              startRange: parseInt(this.variableRateList.controls[i - 1].value.endRange),
              endRange: parseInt(this.variableRateList.controls[i].value.inputValue)
            })
          }
          if(this.variableRateList.controls[i].value.chargePattern==this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT){
            this.variableRateList.controls[i].patchValue({
              startRange: parseInt(this.variableRateList.controls[i - 1].value.endRange),
              endRange: parseInt(this.variableRateList.controls[i].value.inputValue) + parseInt(this.variableRateList.controls[i - 1].value.endRange)
            })
        }
        }
      }
      else {
        if ((i > 0) && (i < this.variableRateList.length - 1)) {
          this.variableRateList.controls[i].patchValue({
            startRange: parseInt(this.variableRateList.controls[i - 1].value.endRange),
            endRange: parseInt(this.variableRateList.controls[i].value.inputValue)
          })
        }
      }

      if (this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {

        this.variableRateList.controls[i].patchValue({
          startRange: parseInt(this.variableRateList.controls[variableRateListLength - 2].value.endRange),
          inputValue: parseInt(this.variableRateList.controls[variableRateListLength - 2].value.endRange),
          endRange: null
        })

      }
console.clear();
 console.log("variable Form:",this.variableRateList);
 
    }
  }

  checkInputValueForCurrentVarRate(event, i) { // Used to validate variable rate End range value
    if ((i > 0) && (this.variableRateList.controls[i].value.inputValue <= this.variableRateList.controls[i - 1].value.inputValue)
      && !(this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT)) {
      this.toastService.showI18nToast("Wrong Input", 'error');
      this.variableRateList.controls[i].patchValue({
        inputValue: null
      })
    }
  }

  editIpdService(ipdServiceDetailsObj) { // Used to create variable rate form at the time of edit
    console.log("ipdServiceDetailsObj:::", ipdServiceDetailsObj);
    this.createBasicIpdServiceForm();
    this.editBasicIpdServiceForm(ipdServiceDetailsObj)  ;
  }

  editBasicIpdServiceForm(ipdServiceDetailsObj) { // Used to set values for variable rate form at the time of edit
    
    if(ipdServiceDetailsObj.code){
      let customEvent = {
        longName: ipdServiceDetailsObj.name
      }
      //this.onSelectMedicalAttributes(customEvent,null);
    }

    let variableRateList= this.variableRateList;
   
    for (let i = 0; i < ipdServiceDetailsObj.variableRateList.length; i++) {
    
      let varRateForm=this.fb.group({
        chargePattern: [this.setChargePatternValueForVarRate(ipdServiceDetailsObj.variableRateList[i])],
        inputValue: [null],
        startRange: [ipdServiceDetailsObj.variableRateList[i].startRange],
        endRange: [ipdServiceDetailsObj.variableRateList[i].endRange],
        rate: [ipdServiceDetailsObj.variableRateList[i].rate],
        chargeUnit: [ipdServiceDetailsObj.variableRateList[i].chargeUnit==null?null:ipdServiceDetailsObj.variableRateList[i].chargeUnit],
        chargeUnitValue: [ipdServiceDetailsObj.variableRateList[i].chargeUnitValue==null?null:ipdServiceDetailsObj.variableRateList[i].chargeUnitValue],
        slidingRateFlag: [ipdServiceDetailsObj.variableRateList[i].slidingRateFlag],
        rangeUnit:[ipdServiceDetailsObj.variableRateList[i].rangeUnit]
        
      });
      variableRateList.push(varRateForm);
    }
    console.log("variableRateList::",variableRateList);
    this.minDate=new Date(ipdServiceDetailsObj.fromDate);
    
    this.ipdServiceForm.patchValue({
      name:ipdServiceDetailsObj.name,
      serviceRefNo: ipdServiceDetailsObj.serviceRefNo,
      serviceName: ipdServiceDetailsObj.serviceName,
      code: ipdServiceDetailsObj.code,
      providerCharge: ipdServiceDetailsObj.providerCharge,
      clinicCharge: ipdServiceDetailsObj.clinicCharge,
      totalCharge: ipdServiceDetailsObj.totalCharge,
      rateType: this.currentTab==SBISConstants.REGISTRATION.REGISTRATION_FEES?this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.FIX:ipdServiceDetailsObj.rateType,
      fromDate: ipdServiceDetailsObj.fromDate==null?null:new Date(ipdServiceDetailsObj.fromDate),
      hospitalRefNo: this.currentUser.serviceProviderRefNo,
      chargedBy: this.currentTab==SBISConstants.REGISTRATION.REGISTRATION_FEES?this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC:ipdServiceDetailsObj.chargedBy,
      chargeUnit: ipdServiceDetailsObj.chargeUnit,
      chargeUnitValue: ipdServiceDetailsObj.chargeUnitValue,  
      serviceMapPk:ipdServiceDetailsObj.serviceMapPk, 
      editPermission: ipdServiceDetailsObj.serviceMapPk==null?false:true,
      isRateChange:false ,
      validity: ipdServiceDetailsObj.validity,
      systemCode: ipdServiceDetailsObj.code
    });   

    this.totalCharge=ipdServiceDetailsObj.totalCharge
    if(ipdServiceDetailsObj.chargeUnitValue!=null){
      this.createVariableRateForm();
      let varRateForm=this.fb.group({
        chargePattern:this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.FLAT,
        rate:ipdServiceDetailsObj.totalCharge,
        chargeUnitValue:ipdServiceDetailsObj.chargeUnitValue,
        chargeUnit:ipdServiceDetailsObj.chargeUnit,
        slidingRateFlag: 'N',
        rangeUnit:null
      })
      variableRateList.push(varRateForm);
      this.ipdServiceForm.patchValue({
        rateType:this.SBISConstantsRef.IPD_SERVICE_RATE_TYPE.SLAB,
        totalCharge:null
      })
    }

    if (this.ipdServiceForm.value.chargedBy==this.SBISConstantsRef.IPD_SERVICE_CHARGED_BY.CLINIC){
      this.ipdServiceForm.patchValue({
        providerCharge: 0
      });
      this.ipdServiceForm.controls.providerCharge.markAsDirty();
    }
    this.setInputValueForVarRate();    
    this.htmlElements.showAddEditIpdServiceSection = true;
    this.htmlElements.showIpdServiceDetailsSection = false;
    this.broadcastService.setHeaderText('EDIT SERVICE - ' + this.currentTab);
    // this.getIpdServiceListByCategory();
    console.log("ipd Form::",this.ipdServiceForm);
    
  }

  setChargePatternValueForVarRate(varRateObj){ // Used to set Charge Pattern value for variable rate form at the time of edit   
    console.log("varRateObj::",varRateObj);
    
      if((varRateObj.slidingRateFlag=="Y") && (varRateObj.endRange!=null)){ // Working on app/issues/1578
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.NEXT
      }
      else if((varRateObj.chargeUnit==null) && (varRateObj.endRange==null)){
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN
      }
      else if((varRateObj.chargeUnit!=null) && (varRateObj.endRange==null)){ // Working on app/issues/1578
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN
      }
      else if((varRateObj.slidingRateFlag=="N") && varRateObj.endRange!=null){ // Working on app/issues/1578
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.UPTO
      }
      else if(varRateObj.inputValue==null){
        return this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.FLAT
      }
  }

  setInputValueForVarRate(){ // Used to set input value for variable rate at the time of edit
    for (let i = 0; i < this.variableRateList.length; i++) 
    {
      if(this.variableRateList.controls[i].value.slidingRateFlag=="Y"){
        this.variableRateList.controls[i].patchValue({
          inputValue:  parseInt(this.variableRateList.controls[i].value.endRange) - parseInt(this.variableRateList.controls[i].value.startRange)
        })
      }
      else{
        
        this.variableRateList.controls[i].patchValue({
          inputValue:  parseInt(this.variableRateList.controls[i].value.endRange)
        })
      }

      if (this.variableRateList.controls[i].value.chargePattern == this.SBISConstantsRef.IPD_SERVICE_CHARGE_PATTERN.MORE_THAN) {

        this.variableRateList.controls[i].patchValue({
          startRange: parseInt(this.variableRateList.controls[this.variableRateList.length - 2].value.endRange),
          inputValue: parseInt(this.variableRateList.controls[this.variableRateList.length - 2].value.endRange),
          endRange: null
        })

      }
    }

  }

  setIpdServiceToForm(serviceClickedEvent){// Used to set service reference No. into IPD form
    this.ipdServiceForm.patchValue({  
      serviceRefNo:serviceClickedEvent.refNo,
      name: serviceClickedEvent.name
    });
    this.setEditOrNewEntryMode();
  }

 
  setEditOrNewEntryMode(){ // Used to change into Edit for allready added Service
    for(let ipdService of this.ipdServiceList){
      if(ipdService.serviceRefNo==this.ipdServiceForm.value.serviceRefNo){
        this.createBasicIpdServiceForm();
        this.editBasicIpdServiceForm(ipdService);
        console.log(ipdService);
        
        break;
      }
    }
  }

  nextHourCalculation(varRateObj){ // Used in Html to calculate difference of End Range and Start Range
    return (varRateObj.endRange -varRateObj.startRange);
  }

  deleteVariableRate(varRateIndex){ // Used to Delete variable rate
    if(confirm("Do You Want to Delete this Rate?")){
      this.variableRateList.controls.splice(varRateIndex, 1);
      this.variableRateList.value.splice(varRateIndex, 1);
      // DB Call required to make the rate CXL
    }
  }

  
  goToCurrentDate() {
    let viewDate = new Date();

    var mnth = ("0" + (viewDate.getMonth() + 1)).slice(-2),
      day = ("0" + viewDate.getDate()).slice(-2);
    var tempDate = [viewDate.getFullYear(), mnth, day].join("-");
    return tempDate;
  }

  checkDuplicateServiceName(event){     
    for(let ipdService of this.ipdServiceList){
      if(((event.target)?(ipdService.name==event.target.value) : (ipdService.name == event.longName))){
        if((this.currentTab == SBISConstants.IPD_SERVICE_TAB.DIAGNOSTICS)? (ipdService.code == this.ipdServiceForm.value.systemCode)  : (ipdService.serviceRefNo != this.ipdServiceForm.value.serviceRefNo) ){
          this.toastService.showI18nToast("Duplicate "+this.currentTab+" Name", 'error');
          this.ipdServiceForm.patchValue({
            name:(this.currentTab == SBISConstants.IPD_SERVICE_TAB.DIAGNOSTICS)? '': null,
            systemCode: null
          });
          break;
        }
      }
    }
  }


  //diagnostics

    //method to 
    onSelectMedicalAttributes(event, medAttr) {
      this.individualService.getMedicalAttributeListV3({ 'longName': event.longName }).subscribe((resp) => {
        if (resp.status == 2000) {
          this.ipdServiceForm.patchValue({
            name:resp.data[0].longName,
            systemCode: resp.data[0].systemCode
          }); 
          this.checkDuplicateServiceName(event);
        }
      });
    }//end of method

    search(event) {
      if (event.query.length < 3) { //Working on app/issues/717
        this.addMedicalReportResults = [];
        return;
      }
      this.individualService.getMedicalAttributeList({ searchText: event.query }).subscribe((data) => {
        if (data.status == 2000) {
          this.addMedicalReportResults = data.data;
        }
      });
    }//end of search method


  // Working on app/issues/2264
  ipdServices: any = [];
  service: any;
  getIpdServiceListTypeAhead(event) { // Used to get IPD service name by category
    let requestQuery={
      category:this.currentTab,
      serviceName:event.query
    }
    this.serviceProviderService.getIpdServiceListTypeAhead(requestQuery).subscribe((res) => {
      this.ipdServices = res.data;
    });
  }

  setIpdService(event){
    let query = {
      'hospitalRefno': this.currentUser.serviceProviderRefNo,
      'category': this.currentTab,
      'serviceRefNo': event.serviceRefNo
    }
    this.serviceProviderService.getIpdServiceByRefNo(query).subscribe(res => {
      this.service = null;
      if(res.data!=null){
        this.service = res.data;
        this.ipdServiceForm.patchValue({
          name:this.service.name,
          serviceRefNo: this.service.serviceRefNo,
          serviceName: this.service.serviceName,
        });
        console.log("ipdServiceList::",this.service);
        //this.editIpdService(this.service);
        this.editBasicIpdServiceForm(this.service);
      }
      else{
        this.ipdServiceForm.patchValue({
          name:event.serviceName,
          serviceRefNo: event.serviceRefNo,
          serviceName: event.serviceName,
        });
      }
    });
  }

}
