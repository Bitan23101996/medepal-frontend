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
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { DoctorService } from '../doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { DISABLED } from '@angular/forms/src/model';
import { ToastService } from 'src/app/core/services/toast.service';
import { SBISConstants } from '../../../SBISConstants';  // app/issues/843
import { ServiceProviderUtil } from '../../service-provider/service-provider.util';
import { TranslateService } from '@ngx-translate/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-doctor-chamber',
  templateUrl: './doctor-chamber.component.html',
  styleUrls: ['./doctor-chamber.component.css']
})

export class DoctorChamberComponent implements OnInit { 
  chamberForm: FormGroup;
  dayOfWeek: any;
  doctorMockTimingRow: FormGroup[];
  timingDataFromResponse: any = [];
  ipdFeesArr: any[] = [];
  options: string[] = [];               //||---For address typeahead
  filteredOptions: Observable<string[]>;//||---For address typeahead
  opdCategories: Object[] = []; //||---For opd category dropdown
  opdOptions: string[] = [];               //||---For opd typeahead
  filteredOpdOptions: Observable<string[]>;//||---For opd typeahead
  states: string[] = [];
  filteredStates: Observable<string[]>;
  cities: Object[] = [];
  filteredCities: Observable<string[]>;
  countries: string[] = [];
  filteredCountries: Observable<string[]>;
  defaultCountry = '';
  filteredCountriesSingle: any[];
  filteredStateSingle: any[];
  filteredAddressTypesSingle: any[];
  filteredOPDsSingle: any[];
  autoConfirmApp: String = SBISConstants.YES_NO_CONST.NO_ENUM;
  appBySrlNo: String = SBISConstants.YES_NO_CONST.NO_ENUM;
  doctorPk:any;
  user: any;
  disableTiming: any;
  saveStatus = false;
  submitted = false;
  chamberPkExist:any = false;
  isNameSelected: any = false;
  hospitalPk: any = null;
  hospitalRefNo: any = null;
  isAvgDurGrtStartEndTime = false;
  timingValidationMsg: any;
  isOnBoardedHospital = SBISConstants.YES_NO_CONST.NO_ENUM;
  isOnBoardedHospitalForNew = SBISConstants.YES_NO_CONST.NO_ENUM;
  duplicateHospitalForDoctor = false;
  opdSelectedFirst = false;
  opdList; any;
  totalFees: any = 0.00;
  isFees: boolean = false;
  isRegistrationWorkflowCompleted: boolean = false;
  workflowSteps: any = [];
  workflow: any;
  redirectFlag: boolean = true;
  successMsgFor = "partialRegistration";
  feesDescriptionList: any[]=[];
  isAddFees: boolean = true;
  feesDescriptionListToFilter: any[]=[];
  feesDescriptionListToFilterForSCndDropdown: any[]=[];
  ipdFeesDescription: any[] =[];
  SBISConstantsRef=SBISConstants;
  prescriptionTemplateType=this.SBISConstantsRef.PRESCRIPTION_TEMPLATE_TYPE.DOCTOR_OPD_PRESCRIPTION_TEMPLATE;
  showPrescriptionTypeSection:boolean=true; 
  ipdFeesPk: any;
  acceptonlineFlag: String = SBISConstants.YES_NO_CONST.NO_ENUM;

  constructor(private fb: FormBuilder, private http: HttpClient, private _doctorService: DoctorService, 
    private route :ActivatedRoute,private translate: TranslateService,
    private broadcastService: BroadcastService,private toastService: ToastService, private router: Router, private _serviceProviderUtil: ServiceProviderUtil) 
    {  
      translate.setDefaultLang('en');
      translate.use('en');
      translate.use('help_en');
      this.ipdFeesArr.push({id:1});
      this.getLoggedinUserDetailFromLocalstorage();//method to get logged in user details from localstorage
      this.setWorkFlowAccordingToLoggedInUser();//method to set the workflow according to user
    }//end of constructor
  
  ngOnInit() {
    this.broadcastService.setHeaderText('Doctor Chamber Configuration');
    this.loadDaysOfWeekModel();
    this.getDescription();
  }//end of oninit

  getLoggedinUserDetailFromLocalstorage() {//method to get logged in user details from localstorage
    let user = JSON.parse(localStorage.getItem('user'));
    this.doctorPk = user.id;
    this.disableTiming = [];
    this.user = JSON.parse(localStorage.getItem('user'));
  }//end of method

  //method to load daysOfWeek
  loadDaysOfWeekModel(){
    this.dayOfWeek = SBISConstants.DAYS_OF_WEEK_MODEL;
  }//end of method load days of week

  createFeesUpdate(res): FormGroup {
    return this.fb.group({
      amount:[res['amount']],
      description: [res['description']],
      doctorFeesPk: [res['doctorFeesPk']],
      chamberType: [res['chamberType']],
      displayValue:  this.feesDescriptionList.filter(x=>x.attributeValue == res['description'])[0].displayValue 
    });
  }

  get lControls() { return this.chamberForm.controls; }

  private _filter(value: string): string[] {
    value = (value == null) ? '' : value;
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCountry(value: string): string[] {
    value = (value == null) ? '' : value;
    const filterValue = value.toLowerCase();
    return this.countries.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterState(value: string): string[] {
    value = (value == null) ? '' : value;
    const filterValue = value.toLowerCase();
    return this.states.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  createChamberForm() {
    let timingList: FormGroup[] = [];
    let feesArr: FormGroup[] = [];
    
    this.chamberForm = this.fb.group({
      doctorRef: [this.user.refNo],
      chamberRef: '',
      line1: ['', Validators.required],
      line2: '',
      pinCode: ['', Validators.required],
      city: [''],
      state: [''],
      country: ['India'],
      phoneNo1: '',
      phoneNo2: '',
      department: '',
      roomNo: '',
      //fees: [null, Validators.required],
      averageVisitDuration: [null, Validators.required],
      hospitalRef: '',
      hospitalName: '',
      status: [SBISConstants.STATUS_NRM],
      chamberTimingWeekViewList: [],
      opdType: [null, Validators.required],
      autoConfirmAppointment: '',
      // Added for app#690
      appointmentBySerialNo: '',
      acceptonline: false,
      prepayAmount : [""],
      userName: [this.user.userName],
      createdBy: [null],
      createdDate: [null],
      modifiedBy: [null],
      modifiedDate: [null],
      overbooking_limit:[null],
      prescriptionTemplate:this.prescriptionTemplateType, // app/issues/843
      chamberFeesList: this.fb.array(feesArr),
      isOpd: [SBISConstants.YES_NO_CONST.YES_ENUM],
      ipdFees: 0,
      isOpdCheck: true,
      isIpdCheck: false
    });
    let chamber_ref = this.route.snapshot.paramMap.get('chamber_ref');
    if(chamber_ref == null) 
     this.buildInitialOpdFeesForm();
    
  }//end of create form

  buildInitialOpdFeesForm(){//method to create initial opd fees Form
    this.feesArray.push(this.createFeesForPersonalChember());
    if(this.chamberForm.value.prepayAmount==''){
      this.chamberForm.patchValue({
        prepayAmount:0+'.00'
      });
    }
  }//end of method

  checkAddressTypeOrOpdTypeMandatory()
  {
    if(this.chamberForm.value.opdType == '' || this.chamberForm.value.opdType == '0')
    {
      return false;
    }
    else 
      return true;
  }

  selectOpdType()
  {
    if(this.chamberForm.value.opdType != '' && this.chamberForm.value.opdType != 'I' && this.chamberForm.value.hospitalName == '')
    {
      return false;
    }
    else 
      return true;
  }

  get feesArray(): FormArray {
    return this.chamberForm.get('chamberFeesList') as FormArray;
  }

  saveChamber() {
    this.submitted =  true;
    this.isNameSelected = false;
    if(!this.chamberForm.get('isIpdCheck').value && !this.chamberForm.get('isOpdCheck').value){
      this.toastService.showI18nToast('Please check any Associated With',"error");
      return false;
    }

    if(this.chamberForm.get('isIpdCheck').value && this.chamberForm.get('ipdFees').value < 1){
      this.toastService.showI18nToast('Please enter IPD Fees',"error");
      return false;
    }

    var timingList = this.chamberForm.get('chamberTimingWeekViewList') as FormArray;
    
    if(this.chamberForm.value.prepayAmount==''){
      
      this.chamberForm.patchValue({
        prepayAmount:0
      });
    }


    if(this.chamberForm.invalid){
      if(this.chamberForm.value.opdType !='I' && this.chamberForm.value.hospitalName == '' && this.chamberForm.get('isOpdCheck').value){
        this.isNameSelected = true;
      }
      if(timingList.value == null  && this.chamberForm.get('isOpdCheck').value){
        //this.timingValidationMsg = "Please enter chamber timing details";
        this.toastService.showI18nToast("Please enter chamber timing details",'error');
      }
      else{
        this.timingValidationMsg = "";
      }
      if(this.chamberForm.value.chamberFeesList.length == 0  && this.chamberForm.get('isOpdCheck').value) {
        this.toastService.showI18nToast("Please add fees",'error');
        return;
      }
      if(this.chamberForm.get('isOpdCheck').value){
        this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.FILL_REQUIRED_FIELDS',"error");
        return;
      }
    }//end of 
    if(this.chamberForm.get('isOpdCheck').value){
      if(this.chamberForm.value.chamberFeesList.length == 0 ) {
        this.toastService.showI18nToast("Please add fees",'error');
        return;
      } else {
        let fee = this.chamberForm.value.chamberFeesList.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
        if(this.chamberForm.value.prepayAmount !== '' && fee !== ''){
          if(parseFloat(this.chamberForm.value.prepayAmount) > parseFloat(fee)){
            this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.PREPAY_AMOUNT_GREATER' , 'error');
            return false;
          }
        }
      }
    }

    if(timingList.value == null  && this.chamberForm.get('isOpdCheck').value){
      //this.timingValidationMsg = "Please enter chamber timing details";
      this.toastService.showI18nToast("Please enter chamber timing details",'error');
      return;
    }
    else{
      this.timingValidationMsg = "";
    }

    if(this.chamberForm.value.chamberFeesList.length == 0  && this.chamberForm.get('isOpdCheck').value) {
      this.toastService.showI18nToast("Please add fees",'error');
      return;
    } else {
      if( this.chamberForm.get('isOpdCheck').value){
        for(let fees of this.chamberForm.value.chamberFeesList) {
          if(fees.amount == "" || fees.description == "") {
            this.toastService.showI18nToast("Please fillup the fees and fees description", 'error');
            return;
          }
        }
      }
    }
    if( this.chamberForm.get('isOpdCheck').value){
      for (let i = 0; i < timingList.value.length; i++) {
        let timing = timingList.value[i];
        if(timing.startTime.indexOf("undefined") !=-1 || timing.endTime.indexOf("undefined") !=-1){
          timing.startTime = (this.timingDataFromResponse[i].startTime);
          timing.endTime = (this.timingDataFromResponse[i].endTime);
        }
        this.isAvgDurGrtStartEndTime = this._doctorService.checkIfAvgVisitDurGrtStartEndTimeNGB(this.chamberForm.value.averageVisitDuration, timing.startTime, timing.endTime);

        if(this.isAvgDurGrtStartEndTime){
          return;
        }

        if(timing.mon==false && timing.tue==false && timing.wed==false && timing.thu==false && timing.fri==false && timing.sat==false && timing.sun==false){
          //this.timingValidationMsg = "Please select proper day of week";
          this.toastService.showI18nToast("Please select proper day of week", 'error');
          return;
        }
        else{
          this.timingValidationMsg = "";
        }
        if(timing.startTime==":00" || timing.startTime=="" || timing.endTime==":00" || timing.endTime==""){
          //this.timingValidationMsg = "Please enter start time or end time properly";
          this.toastService.showI18nToast("Please enter start time or end time properly", 'error');
          return;
        }
        else{
          this.timingValidationMsg = "";
        }

        let onlyStartHour = timing.startTime.substring(0, timing.startTime.indexOf(":"));
        let onlyEndHour = timing.endTime.substring(0, timing.endTime.indexOf(":"));

        if(parseInt(onlyStartHour) > parseInt(onlyEndHour)){
          //this.timingValidationMsg = "Start time can not be greater than end time";
          this.toastService.showI18nToast("Start time can not be greater than end time",'error');
          return;
        }
      }
    }

    if(!this.checkAddressTypeOrOpdTypeMandatory()){
      this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.PLEASE_ENTER_ADDRESSTYPE',"warning");
      return;
    }
    if(!this.selectOpdType())
    {
      this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.PLEASE_SELECT_OPDTYPE',"warning");
      return;
    }
    if(this.chamberForm.value.fees == '')
    {
      this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.FEES_EMPTY',"warning");
      return;
    }
    // if(this.chamberForm.valid) {
      if(this.formValidation()){
        if(this.chamberForm.get('isOpdCheck').value){
          if (this.validateOverlappingChamberTiming() == 'false') {
            return false;
          }else {
            this.validateOverlappingChamberTimingAtServer();
          }
        }else{
          this.saveChamberDetails();
        }
    } else {
      this.toastService.showI18nToast("Please fillup the mandetory fields", "error");
      return;
    }
  }//end of method
  formValidation() {
    let formValue = this.chamberForm.value;
    if(formValue.line1 && formValue.pinCode && formValue.averageVisitDuration && formValue.opdType)
      return true;
    else
      return false
  }//end of method

  validateChamberTiming()
  {
    var timingList = this.chamberForm.get('chamberTimingWeekViewList') as FormArray;
    for (let i = 0; i < timingList.length; i++) {
      let timing = timingList.controls[i] as FormGroup;
      let startTime = timing.value.startTime.replace(/:/g, '');
      let endTime = timing.value.endTime.replace(/:/g, '');
      if (
        parseInt(startTime) >= parseInt(endTime)
        &&
        timing.value.status == SBISConstants.STATUS_NRM
      ) {
        for (let k = 0; k < this.dayOfWeek.length; k++) {
          if (this.dayOfWeek[k].key == timing.value.dayOfWeek) {
            this.toastService.showI18nToast('Overlapped record found at ' + this.dayOfWeek[k].day, "error");
            return 'false';
          }
        }
      }
    }
  }

  createFeesForPersonalChember(): FormGroup {
    return this.fb.group({
      description: 'CONSULTANCY FEES',
      amount: '',
      doctorFeesPk: null,
      chamberType: SBISConstants.CHAMBER_TYPE.OPD,
      displayValue: this.feesDescriptionList.filter(x=>x.attributeValue == 'CONSULTANCY FEES')[0].displayValue 
    });
  }


  populateOPD(selectedValue) {
    // app/issues/843
    if(selectedValue == 'I' ){
      this.showPrescriptionTypeSection=false;  
      this.isAddFees = false;
      this.feesArray.controls.splice(0, this.feesArray.controls.length);
      this.totalFees = 0.00;
      this.isFees = false;
      this.feesArray.push(this.createFeesForPersonalChember());
      this.prescriptionTemplateType=this.SBISConstantsRef.PRESCRIPTION_TEMPLATE_TYPE.DOCTOR_OWN_PRESCRIPTION_TEMPLATE
      this.chamberForm.patchValue({
        prescriptionTemplate:this.prescriptionTemplateType
      });
    }
    // Working on app/issues/1349
      else{
        this.showPrescriptionTypeSection=true;  
      }
      // End Working on app/issues/1349
    // End app/issues/843
    if (selectedValue != 'I' && selectedValue != '0') {
      this.isAddFees = true; 
      if (!this.opdSelectedFirst && this.chamberForm.controls.hospitalRef.value != null && 
        this.chamberForm.controls.hospitalRef.value != '') {
        this.chamberForm.controls.hospitalRef.setValue('');
        this.chamberForm.controls.hospitalName.setValue('');
        this.clearAddressFields();
      }
      else
        this.opdSelectedFirst = false;
      this.opdOptions = [];
    }
    else if (selectedValue == '0') { // Fetch all hospitals for type-ahead
      this.isAddFees = true;
      if (!this.opdSelectedFirst && this.chamberForm.controls.hospitalRef.value != null && 
        this.chamberForm.controls.hospitalRef.value != '') {
        this.chamberForm.controls.hospitalRef.setValue('');
        this.chamberForm.controls.hospitalName.setValue('');
        this.clearAddressFields();
      }
      else
        this.opdSelectedFirst = false;
    }
    else {
      this.opdOptions = [];
    }
  }

  getOPDList(event) {//this method is to fetch list of hospitals where the condition in name like %'searchtext'% and sp_type = 'HOSPITAL' in backend
    let category = this.chamberForm.controls.opdType.value;
    if(category == null || category == 0){
      category = " ";
    }
    if(category != 'I'){
      this._doctorService.getHospitalListBySearchText(event.query).subscribe((data) => {
        this.opdList = data;        
      });
    }
  }//end of method

  private _filterOpd(value: string): string[] {
    value = (value == null) ? '' : value;
    const filterValue = value.toLowerCase();
    return this.opdOptions.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private clearAddressFields() {
    this.chamberForm.controls.line1.setValue('');
    this.chamberForm.controls.line2.setValue('');
    this.chamberForm.controls.city.setValue('');
    this.chamberForm.controls.pinCode.setValue('');
    this.chamberForm.controls.state.setValue('');
    this.chamberForm.controls.country.setValue('India');
    this.chamberForm.controls.phoneNo1.setValue('');
    this.chamberForm.controls.phoneNo2.setValue('');
    this.countrySelect('India');
  }

  populateHospitalAddress(chamberType) {
    this.chamberForm.patchValue({
      hospitalName: chamberType.hospitalName
    })
    this.chamberForm.controls.hospitalRef.setValue('');
    this.clearAddressFields();
        let request={
          "doctorRef": this.user.refNo,
          "hospitalRef":chamberType.hospitalRefNo,
          "miscRef":""
        }

        this._doctorService.checkUniqueHospitalForDoctorV2(request).subscribe(res1 => {
          if(res1['data']==null){
            this.chamberForm.controls.hospitalRef.setValue(chamberType.hospitalRefNo);//response return it as hospital ref no
            this.chamberForm.controls.line1.setValue(chamberType.line1);//response return it as line1
            this.chamberForm.controls.line2.setValue(chamberType.line2);//
            this.chamberForm.controls.city.setValue(chamberType.city);
            this.chamberForm.controls.pinCode.setValue(chamberType.pinCode);
            this.countrySelect(chamberType.country);
            this.chamberForm.controls.state.setValue(chamberType.state);
            this.chamberForm.controls.country.setValue(chamberType.country);
            this.chamberForm.controls.phoneNo1.setValue(chamberType.contactNo1);//changed because the response return this field as contactNo1
            this.chamberForm.controls.phoneNo2.setValue(chamberType.contactNo2);//
            this.duplicateHospitalForDoctor = false;
            if(chamberType.isOnboarded=='Y'){
              this.isOnBoardedHospitalForNew = 'Y';
            }
            if(chamberType.hospitalRefNo!=null){
              this.hospitalRefNo = chamberType.hospitalRefNo;
            }
            // Set Chamber type if it was not selected
            if (this.chamberForm.controls.opdType.value == null || this.chamberForm.controls.opdType.value == '0') {
              this.chamberForm.controls.opdType.setValue(chamberType.category);
              this.opdSelectedFirst = true; // Indicate not to clear the OPD Pk / Name fields
              //this.populateOPD(res['category']); // Filter the OPDs based on set category
            }
          }
          else{
            this.chamberForm.controls.hospitalName.setValue("");
            this.duplicateHospitalForDoctor = true;
            if (confirm('It seems you are trying to add another schedule to an existing chamber, so editing that existing chamber')) {
              this.router.navigate(['doctor/editChamber', {chamber_ref: res1['data'].refNo}]);
            }
          }
        })
     // });
  }

  validateOverlappingChamberTiming(): string {
    var timingList = this.chamberForm.get('chamberTimingWeekViewList') as FormArray;
    for (let i = 0; i < timingList.value.length; i++) {
      let timing = timingList.value[i];
      let startTime = timing.startTime.replace(/:/g, '');
      let endTime = timing.endTime.replace(/:/g, '');
      for (let j = 0; j < timingList.value.length; j++) {
        if (i == j) { continue; }
        let otherTiming = timingList.value[j];
        let otherStartTime = otherTiming.startTime.replace(/:/g, '');
        let otherEndTime = otherTiming.endTime.replace(/:/g, '');
        let dayOfWeekTiming = [];
        let dayOfWeekOtherTiming = [];
        if (timing.mon==true) dayOfWeekTiming.push(1); else dayOfWeekTiming.push(0);
        if (timing.tue==true) dayOfWeekTiming.push(2); else dayOfWeekTiming.push(0);
        if (timing.wed==true) dayOfWeekTiming.push(3); else dayOfWeekTiming.push(0);
        if (timing.thu==true) dayOfWeekTiming.push(4); else dayOfWeekTiming.push(0);
        if (timing.fri==true) dayOfWeekTiming.push(5); else dayOfWeekTiming.push(0);
        if (timing.sat==true) dayOfWeekTiming.push(6); else dayOfWeekTiming.push(0);
        if (timing.sun==true) dayOfWeekTiming.push(7); else dayOfWeekTiming.push(0);

        if (otherTiming.mon==true) dayOfWeekOtherTiming.push(1); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.tue==true) dayOfWeekOtherTiming.push(2); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.wed==true) dayOfWeekOtherTiming.push(3); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.thu==true) dayOfWeekOtherTiming.push(4); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.fri==true) dayOfWeekOtherTiming.push(5); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.sat==true) dayOfWeekOtherTiming.push(6); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.sun==true) dayOfWeekOtherTiming.push(7); else dayOfWeekOtherTiming.push(0);
        //Get the matched day index
        let res = this.diff(dayOfWeekTiming,dayOfWeekOtherTiming);
        let result = 0;

        //if result is 0 => no matched day
        //if result is not 0 => matched day
        for(let i = 0; i <  res.length; i++){
          if(res[i] == 0) continue;
          else result = res[i];
        }

        if (parseInt(endTime) >= parseInt(otherStartTime)
          &&
          parseInt(startTime) <= parseInt(otherEndTime)
          &&
          result != 0
        ) {
          for (let k = 0; k < this.dayOfWeek.length; k++) {
            if (this.dayOfWeek[k].key == result) {
              this.toastService.showI18nToast('Overlapped record found at ' + this.dayOfWeek[k].day, "error");
              return 'false';
            }
          }

        }
      }
    }
  }

  validateOverlappingChamberTimingAtServer() {
    this._doctorService.validateChamberTimingList2(this.chamberForm.value)
      .toPromise()
      .then(res => {
        let response: any = res;
        if (response.status == 2000) {
          this.toastService.showI18nToast(response.message, "error"); // app#1369
          return false;
        }
        else {
          this.saveChamberDetails();
        }
      }) , (error) => {        
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        //alert("Some internal problem occured, please contact admin");
        this.submitted = false;
        return;
      }
  }

   //method to get the check or unchecked value of opd or ipd
   onChangeIpdOrOpd(event,formControlName: string){
    this.chamberForm.patchValue({
      [formControlName] : event.target.checked
    });
  }//end of method

  saveChamberDetails() {
    if(this.chamberForm.value.overbooking_limit==null){
      this.chamberForm.patchValue({
        overbooking_limit:0
      });
    }
    let reqObj: any = this.chamberForm.value;
    reqObj['autoConfirmAppointment'] = this.autoConfirmApp;
    reqObj['appointmentBySerialNo'] = this.autoConfirmApp;
    reqObj['acceptonline'] = this.acceptonlineFlag;
    if(!this.chamberForm.get('isOpdCheck').value) {
      reqObj.chamberFeesList = []; 
      reqObj.chamberTimingWeekViewList = [];
      reqObj.prepayAmount = "0";
    } 
    if((this.chamberForm.get('ipdFees').value > 0 && this.chamberForm.get('isIpdCheck').value) ){
      reqObj.chamberFeesList.push({
      amount: this.chamberForm.value.ipdFees.toString(), description: "IPD FEES", chamberType: SBISConstants.CHAMBER_TYPE.IPD,
      doctorFeesPk: this.ipdFeesPk ? this.ipdFeesPk : null});
      reqObj['isIPD'] = SBISConstants.YES_NO_CONST.YES_ENUM;
    }else
      reqObj['isIPD'] = SBISConstants.YES_NO_CONST.NO_ENUM;

    reqObj.isOpd = this.chamberForm.get('isOpdCheck').value ? SBISConstants.YES_NO_CONST.YES_ENUM : SBISConstants.YES_NO_CONST.NO_ENUM;

    this._doctorService.saveDoctorChamber(reqObj)//this.chamberForm.value
      .toPromise()
      .then(res => {
        this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.SAVE_SUCCESS' , 'success');
        this.saveStatus = true;
        // app#974: app#782 below only for roleName DOCTOR
        if (this.user.roleName === 'DOCTOR') {
          /* Working on app/issues/782 */
          let payloadWorkflow = JSON.parse(localStorage.getItem('regw'));
          //Working om app/issues/990
          if(payloadWorkflow.registrationWorkflowCompleted == null || payloadWorkflow.registrationWorkflowCompleted){
            this.router.navigate(['/doctor/myChamber']);
            this.redirectFlag = true;
          }
          else if(payloadWorkflow.currentStepNo == payloadWorkflow.registrationWorkflowSteps.length){
            this.redirectFlag = false;
            payloadWorkflow.registrationWorkflowCompleted = true;
            this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
            localStorage.setItem('regw',JSON.stringify(payloadWorkflow));
            this.broadcastService.setHeaderText("Registration Completed");
          }
          else{
            // if(!payloadWorkflow.isChabmerOrAddressExist)
            this.redirectFlag = true;
            let currentStep:any=0;
            for(let i=0;i<payloadWorkflow.registrationWorkflowSteps.length;i++){
              if(payloadWorkflow.registrationWorkflowSteps[i].sequenceNo==payloadWorkflow.currentStepNo){
                currentStep=this.workflow.registrationWorkflowSteps[i].sequenceNo
              }
            }
            if(payloadWorkflow.currentStepNo == currentStep)
              payloadWorkflow.currentStepNo++;
            // payloadWorkflow.isChabmerOrAddressExist = true;
            this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
            localStorage.setItem('regw',JSON.stringify(payloadWorkflow));
            let route:any;
            for(let i=0;i<payloadWorkflow.registrationWorkflowSteps.length;i++){
              if(payloadWorkflow.registrationWorkflowSteps[i].sequenceNo==payloadWorkflow.currentStepNo){
                route=payloadWorkflow.registrationWorkflowSteps[i].routeUrl
              }
            }
            this.router.navigate([route]);  
            //this.router.navigate(["billing/plan"]);
          }
          //End Working om app/issues/990
        }
          /*End Working on app/issues/782 */
        else if (this.user.roleName === 'ASSISTANT') {
          this.router.navigate(['/doctor/myChamber']);
        }
      },err=>{
        // this.chamberForm.reset();
        // this.buildInitialOpdFeesForm();
        this.toastService.showI18nToast("Save chamber has been failed. please try again.","error");
      });
  }
  
  countrySelect(country) {
    this.states = [];
    this._doctorService.GetStates(country + "/states")
      .subscribe(res => {
        for (let i = 0; i < res['data'].length; i++) {
          this.states.push(res['data'][i].stateName);
        }
      });
  }

  filterCountrySingle(event) {
    let query = event.query;
    this.filteredCountriesSingle = this.filterCountry(query, this.countries);
  }

  filterCountry(query, countries: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if (country.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }

  filterOPDSingle(event) {
    let query = event.query;
    this.filteredOPDsSingle = this.filterOPD(query, this.opdOptions);
  }

  filterOPD(query, opdOptions: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < opdOptions.length; i++) {
      let opd = opdOptions[i];
      if (opd.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(opd);
      }
    }
    return filtered;
  }

  filterAddressTypeSingle(event) {
    let query = event.query;
    this.filteredAddressTypesSingle = this.filterAddress(query, this.options);
  }

  filterAddress(query, address: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < address.length; i++) {
      let addressvalue = address[i];
      if (addressvalue.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(addressvalue);
      }
    }
    return filtered;
  }

  toggleEditable(event) {
    if (event.target.checked) {
      this.autoConfirmApp = 'Y';
    }
    else {
      this.autoConfirmApp = 'N'
    }
  }
// Added for issue app#690
  toggleEditableAppBySrlNo(event) {
    if (event.target.checked) {
      this.appBySrlNo = 'Y';
    }
    else {
      this.appBySrlNo = 'N'
    }
  }

  acceptOnlineAppointmentsChange(event) {
    if (event.target.checked) {
      this.acceptonlineFlag = 'Y';
    }
    else {
      this.acceptonlineFlag = 'N'
    }
  }

  validatePrepayAmount(prepayAmount, fees){
    let fee = fees.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
    this.totalFees = fee.toFixed(2);
    this.totalFees > 0 ? this.isFees = true : this.isFees = false;
    if(fees.length > 0) {
      let fee = fees.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
      if(prepayAmount!=='' && fee!==''){
        if(parseFloat(prepayAmount) > parseFloat(fee)){
          this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.PREPAY_AMOUNT_GREATER' , 'error');
          return false;
        }
      }
    return true;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    let a = event.target.value;
    let checkDecimalCount = a.split(".");
    let returnFlag: boolean = false;
    if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)) {
      return false;
    }else{
      if (charCode == 46) {
        //Check if the text already contains the . character
        if (event.target.value.indexOf('.') === -1) {
          return true;
        } else {
          return false;
        }
      // (checkDecimalCount.length > 1)? ((charCode == 46)? returnFlag = false: ((checkDecimalCount[checkDecimalCount.length-1].length>1)?returnFlag = false: returnFlag = true)): returnFlag = true;
    }
  }
    // return returnFlag;
  }//end of method

  validatePrepayAmountByFeesArr(prepayAmount, fees) {
    let fee = fees.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
    if(prepayAmount!=='' && fees!==''){
      if(parseFloat(prepayAmount) > parseFloat(fee)){
        this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.PREPAY_AMOUNT_GREATER' , 'error');
        return false;
      }
    }
    return true;
  }
      
  getWorkScheduleData(workScheduleData){
    let chamberTimingData : any = [];
    for(let i = 0; i < workScheduleData.length; i++){
      let payload = {
        "mon": workScheduleData[i].mon,
        "tue": workScheduleData[i].tue,
        "wed": workScheduleData[i].wed,
        "thu": workScheduleData[i].thu,
        "fri": workScheduleData[i].fri,
        "sat": workScheduleData[i].sat,
        "sun": workScheduleData[i].sun,
        "startTime": workScheduleData[i].startTime.hour+":"+workScheduleData[i].startTime.minute+":00",
        "endTime": workScheduleData[i].endTime.hour+":"+workScheduleData[i].endTime.minute+":00", //+":00"
        "rowIndex": workScheduleData[i].rowIndex,
      }
      chamberTimingData.push(payload)
    }
    this.chamberForm.patchValue({
      chamberTimingWeekViewList: chamberTimingData
    })
  }

  checkPattern(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  diff(arr1,arr2) {
    var ret = [];
    for(var i in arr1) {   
        if(arr2.indexOf(arr1[i]) > -1){
            ret.push(arr1[i]);
        }
    }
    return ret;
  }

  backToMyChamber(){
    this.router.navigate(['doctor/myChamber']);
  }

  // Added for issue app#597
  fetchCountryStateCityByPin(ev) {
    if(ev.code) {
      if (ev.code.indexOf('Arrow') != -1) return;
    }
    this.fetchCountryAndState();
  }
  // app/issues/843

  fetchCountryAndState() {
    if(this.chamberForm.value.pinCode.length == 6) {
      let payload = {
        "pincode" : this.chamberForm.value.pinCode
      }
  
      this._doctorService.findCountryStateCityByPin(payload).subscribe(data =>{
        if(data.status == 2000){
          if(data.data.country == null && data.data.state == null && data.data.city == null){
            this.toastService.showI18nToast("Invalid PIN Code", 'error');
            this.chamberForm.patchValue({
              pinCode: "",
              country: "India",
              state: "",
              city: ""
            })
          }else{
            this.chamberForm.patchValue({
              country: data.data.country ,
              state: data.data.state ,
              city: data.data.city
            })
          }
        }else{
            this.toastService.showI18nToast(data['message'], 'error');
          }
        });
      }
  }

  selectPrescriptionTemplateType(event){
    this.prescriptionTemplateType="";
    this.prescriptionTemplateType=event
    this.chamberForm.patchValue({
      prescriptionTemplate:this.prescriptionTemplateType
    });
  }
  // End app/issues/843

  //get fees description from master data
  getDescription() {
    this._doctorService.getMasterDataFees({q: SBISConstants.MASTER_DATA.FEES}).subscribe(data => {
      if(data.status == 2000) {

        let ipdFees = data.data.filter(x => x.attributeValue == "IPD FEES");
        this.ipdFeesDescription = ipdFees[0];
        // console.log(this.ipdFeesDescription);

        this.feesDescriptionList = data.data.filter(x => x.attributeValue != "IPD FEES");
        this.feesDescriptionListToFilter = data.data.filter(x => x.attributeValue != "IPD FEES");
        this.feesDescriptionListToFilterForSCndDropdown = data.data.filter(x => x.attributeValue != "IPD FEES");

        this.loadInitialData();
      }
    });
  } //end of method

  loadInitialData(){//load initial data to load chamber details by ws call   
    let chamber_ref = this.route.snapshot.paramMap.get('chamber_ref');    
    if(chamber_ref != null) 
      this.loadChamberDetailsByChamberRefNo(chamber_ref, this.user);      
    else{
      this.createChamberForm();//method to create chamber form    
      this.loadValueChangesANDSomeWSCall(); 
    }
    
  }//end of method
  loadValueChangesANDSomeWSCall() {//method to load the value changes and some important ws call
    this._doctorService.GetCountry()
    .subscribe(res => {
      for (let i = 0; i < res['data'].length; i++) {
        this.countries.push(res['data'][i].countryName);
      }
    });

  this._doctorService.GetAddressType()
    .subscribe(res => {
      for (let i = 0; i < res['masterDataAttributeValues'].length; i++) {
        this.options.push(res['masterDataAttributeValues'][i].displayValue);
      }
    });

  //----------------------OPD category Drop Down------------------------------//
  var value ={
    'key' :  'I',
    'value' : 'Personal Chamber / Clinic'
  }
  this.opdCategories.push(value);
  this._doctorService.GetOPDCategory()
    .subscribe(res => {
      for (let i = 0; i < res['masterDataAttributeValues'].length; i++) {
        var obj = {
          'key': res['masterDataAttributeValues'][i].attributeValue,
          'value': res['masterDataAttributeValues'][i].displayValue
        }
        this.opdCategories.push(obj);
      }
    });
  //-------------------------OPD Type Filter--------------------------------//
  this.filteredOpdOptions = this.chamberForm.controls.hospitalName.valueChanges.pipe(
    startWith(''),
    map(value => this._filterOpd(value))
  );

  //----------------------------Country Filter------------------------------//
  this.filteredCountries = this.chamberForm.controls.country.valueChanges.pipe(
    startWith(''),
    map(value => this._filterCountry(value))
  );

  //----------------------------State Filter------------------------------//
  this.filteredStates = this.chamberForm.controls.state.valueChanges.pipe(
    startWith(''),
    map(value => this._filterState(value))
  );
  this.countrySelect('India');
  }//end of method
  
  //method to set workflow for logged in user
  setWorkFlowAccordingToLoggedInUser(){
    if (this.user.roleName === 'DOCTOR') {
      /* Working on app/issues/782 */
      this.workflow = JSON.parse(localStorage.getItem('regw'));
      this.broadcastService.setRegistrationWorkflow(this.workflow);
      this.isRegistrationWorkflowCompleted = this.workflow.registrationWorkflowCompleted;
      /*End Working on app/issues/782 */
    }
    else if (this.user.roleName === 'ASSISTANT') // Issue app#974 - for assistant role no workflow is necessary
      this.isRegistrationWorkflowCompleted = true;
  }//end of method

  //methd to ws call n set form according to response
  loadChamberDetailsByChamberRefNo( chamberRef: string, user: any){
    // this.chamberForm = new FormGroup({});
    this.chamberPkExist = true;
    let request={
      "chamberRef":chamberRef
    }
    this._doctorService.getDoctorChamberv3(request).subscribe(
      result=>
      {
        let res = result.data;
        res.doctorFeesList.forEach(element => {
          element.amount = (element.amount).toFixed(2);
        });

        if(res['prescriptionTemplate']){
          this.prescriptionTemplateType=res['prescriptionTemplate']; // app#843
        }
        if(res['hospital_refno']!=null){
          this.isOnBoardedHospital = res['isOnboarded'];
          // this.hospitalPk=res['hospitalPk'];
          this.hospitalRefNo=res['hospital_refno'];
        }
        this.autoConfirmApp = res['autoConfirmAppointment'];
        this.appBySrlNo = res['appointmentBySerialNo'];
        let timingList: FormGroup[] = [];
        let feesArr: FormGroup[] = res.doctorFeesList;
        this.chamberForm = this.fb.group({
          doctorRef: [user.refNo],
          chamberRef: [res['refNo']],
          line1: [res['line1'], Validators.required],
          line2: [res['line2']],
          pinCode: [res['pinCode'], Validators.required],
          city: [res['city']],
          state: [res['state']],
          country: [res['country']],
          phoneNo1: [res['phoneNo1']],
          phoneNo2: [res['phoneNo2']],
          department: [res['department']],
          roomNo: [res['roomNo']],
          averageVisitDuration: [res['averageVisitDuration'], Validators.required],
          hospitalRef: [res['hospital_refno']],
          hospitalName: [res['hospitalName']],
          chamberTimingWeekViewList: [],
          opdType: [res['opdType'], Validators.required],
          autoConfirmAppointment: [res['autoConfirmAppointment']== SBISConstants.YES_NO_CONST.NO_ENUM ? false:true],
          acceptonline: [res['acceptonline']== SBISConstants.YES_NO_CONST.NO_ENUM ? false:true],
          // Added for app#690
          appointmentBySerialNo: [res['appointmentBySerialNo']==SBISConstants.YES_NO_CONST.NO_ENUM ? false:true],
          prepayAmount : [res['prepayAmount']==null?"":res['prepayAmount']],
          overbooking_limit:[res['overbooking_limit']],
          refNo:[res['refNo']],
          prescriptionTemplate:this.prescriptionTemplateType, // app/issues/843
          chamberFeesList: this.fb.array([]),
          isOpd: [res.isOpd == SBISConstants.YES_NO_CONST.YES_ENUM ? SBISConstants.YES_NO_CONST.YES_ENUM : SBISConstants.YES_NO_CONST.NO_ENUM],
          ipdFees: null,
          isIpdCheck: false,
          isOpdCheck: true
        });

        if(this.chamberForm.value.opdType == "I") {
          this.isAddFees = false;
          this.showPrescriptionTypeSection=false; 
        }

        console.log(res['doctorFeesList'].filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD).length);//x.description == "IPD FEES"
  
        if(res['doctorFeesList'].filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD).length > 0) {//x.description == "IPD FEES"
          let ipdFeeArr = res['doctorFeesList'].filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD);//x.description == "IPD FEES"
          console.log(ipdFeeArr[0]);            
          this.chamberForm.patchValue({
            'ipdFees': ipdFeeArr[0].amount,
            'isIpdCheck': true
          });
          this.ipdFeesPk = ipdFeeArr[0].doctorFeesPk
        } else{
            this.chamberForm.patchValue({
              'isIpdCheck': false
            });
        }

        let feesList = [];
        if(res['doctorFeesList'].filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD).length != res.doctorFeesList.length){
          if(res.doctorFeesList.length != 1) {
            feesList.push(res.doctorFeesList.filter(x => x.description == "CONSULTANCY FEES")[0]);
            feesList.push(res.doctorFeesList.filter(x => x.description != "CONSULTANCY FEES")[0]);
          } else {
            feesList.push(res.doctorFeesList[0])
          }
          //res.doctorFeesList = feesList;
        }else{
          this.chamberForm.patchValue({
            isOpdCheck: false
          });
          this.buildInitialOpdFeesForm();
        }

        let doctorFees: any;
        for (let i = 0; i < res.doctorFeesList.length; i++) {
          doctorFees = this.chamberForm.get('chamberFeesList') as FormArray;
          if(res['doctorFeesList'][i].chamberType != SBISConstants.CHAMBER_TYPE.IPD) {//description != "IPD FEES"
           this.chamberForm.patchValue({
            isOpdCheck: true
          });
            doctorFees.push(this.createFeesUpdate(res['doctorFeesList'][i]));
          }
        }

        if(this.chamberForm.value.opdType == "I" && res.doctorFeesList.length == 0) {
          this.feesArray.push(this.createFeesForPersonalChember());
        }

        if(res.doctorFeesList.length > 0 && (res['doctorFeesList'].filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD).length != res.doctorFeesList.length)) {
          let fee = doctorFees.value.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
          this.totalFees = fee.toFixed(2);
          this.isFees = true;
        } 
        this.timingDataFromResponse = [];
        if(res['chamberTimingWeekViewList']){
          for(let i = 0; i < res['chamberTimingWeekViewList'].length; i++){
            let payload = {
                "mon":  res['chamberTimingWeekViewList'][i].mon,
                "tue": res['chamberTimingWeekViewList'][i].tue,
                "wed": res['chamberTimingWeekViewList'][i].wed,
                "thu": res['chamberTimingWeekViewList'][i].thu,
                "fri": res['chamberTimingWeekViewList'][i].fri,
                "sat": res['chamberTimingWeekViewList'][i].sat,
                "sun": res['chamberTimingWeekViewList'][i].sun,
                "startTime": res['chamberTimingWeekViewList'][i].startTime,
                "endTime":  res['chamberTimingWeekViewList'][i].endTime,
                "rowIndex":  res['chamberTimingWeekViewList'][i].rowIndex,
            }
            this.timingDataFromResponse.push(payload);
          }
        }
        this.loadValueChangesANDSomeWSCall();//to load the value changes and some important ws call
        console.log(this.chamberForm.value);
      }//end of results check
      
    );//end of .subscribe
  }//end of method

  addFees() { //add new entry field
    if(this.feesArray.value.length > 0 && this.feesArray.value[0].description != '') {
      this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue != this.feesArray.value[0].description);
      this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue == this.feesArray.value[0].description);
    }
    var feesArray = this.chamberForm.get('chamberFeesList') as FormArray;
    this.feesArray.push(this.createFees());
  } //end of method

  createFees(): FormGroup {
    return this.fb.group({
      description: 'OPD FEES',
      amount: '',
      doctorFeesPk: null,
      displayValue: this.feesDescriptionList.filter(x=>x.attributeValue == 'OPD FEES')[0].displayValue 
      // prepayAmount: ''
    });
  }

  deleteFees(index) { //delete fees entry
    var feesArray = this.chamberForm.get('chamberFeesList') as FormArray;
    feesArray.removeAt(index);
    //update the total fees
    if(feesArray.value.length > 0) {
      this.isFees = true;
      let fee = feesArray.value.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
      this.totalFees = fee.toFixed(2);
    } else {
      this.isFees = false;
      this.totalFees = 0.00;
    }
    // end of update the total fees
      this.feesDescriptionList = this.feesDescriptionListToFilter;
      this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter;
  } //end of method

  descriptionValueSelect(index) {
    let otherIndex;
    index == 0 ? otherIndex = 1 : otherIndex = 0;
    if(this.feesArray.value[index].description == "CONSULTANCY FEES")  {
      if(index == 0) {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "CONSULTANCY FEES");
        if(this.feesArray.value.length > 1) {
          this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "CONSULTANCY FEES");
        }
      } else {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "CONSULTANCY FEES");
        this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "CONSULTANCY FEES");
      } 
    } 
    else {
      if(index == 0) {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "OPD FEES");
        if(this.feesArray.value.length > 1) {
          this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "OPD FEES");
        }
      } else {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "OPD FEES");
        this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "OPD FEES");
      } 
    }
  }



}
