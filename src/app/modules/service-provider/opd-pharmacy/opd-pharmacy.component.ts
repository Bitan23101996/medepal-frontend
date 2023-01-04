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
import { DoctorService } from '../../doctor/doctor.service';
import { ServiceProviderService } from '../service-provider.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { debug } from 'util';
import { IndividualService } from '../../individual/individual.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SBISConstants } from '../../../SBISConstants';// app#1193

@Component({
  selector: 'app-opd-pharmacy',
  templateUrl: './opd-pharmacy.component.html',
  styleUrls: ['./opd-pharmacy.component.css']
})
export class OpdPharmacyComponent implements OnInit {
  screenType:string=SBISConstants.SCREEN_TYPE.ADD_PHARMACY; // app#1193
  user: any;
  user_id: any;
  userRoleName = "";
  opdCategories: Object[] = []; //||---For opd category dropdown
  results: string[]; //---Autocomplete hospital name list
  parent: string[]; //---Autocomplete paret entity name list
  opdForm: FormGroup;
  mainBranchIndicatorFlag: String = "N";
  showContactPersonFlag: String = "Y";
  countryList: any;
  stateList: any;
  selectedCountry: any;
  isAddressArr: any;
  submitted: any = false;
  filteredCountriesSingle: any[];
  clickFrom: String;
  showOtpSection = false;
  showSettings = true;
  opdData: any;
  existingPharmacy = false;
  existingOpd = false;
  existingRecord = false;
  btnShow = false;
  isOpd = false;
  isDifferentRole = false;
  pharmacyFlag: any;
  timingDataFromResponse: any = []; 
  filteredStateSingle: any[];
  states: string[] = [];
  addList: any = [];
  msUserPk = "";
  rolePk = "";
  isSaved = false;
  progress = { percentage: 0, isShowUploadBtn: false };
  ms_User_Pk: any;
  logoSrc = "";
  roleList: any = [];
  domSanitizer: any;
  user_ref:any;
  allPrescriptionTemplates:any=[]; // app/issues/843
  timingValidationMsg:string; // app#1193
  constructor(private _doctorService: DoctorService, private _serviceProviderService: ServiceProviderService,
    private fb: FormBuilder, private translate: TranslateService, private authService: AuthService,
    private toastService: ToastService, private individualService: IndividualService, private route: ActivatedRoute,private router: Router,
    private broadcastService: BroadcastService, private _domSanitizer: DomSanitizer) { 
      translate.setDefaultLang('en');
      translate.use('en');
      this.domSanitizer = _domSanitizer;
  }

  ngOnInit() {
    // this.getAllPrescriptionTemplates(); // app/issues/843
    this.user = JSON.parse(localStorage.getItem('user'));
    // Service provider ref no - issue app#604
    this.user_ref=this.user.serviceProviderRefNo;
    if (this.user) {
      this.user_id = this.user.id;
     this.countrySelect('India');
     this.ms_User_Pk = this.user.userId;
    }
    
    const url = window.location.href.toString();
    if (url.indexOf('/addPharmacy') > 0 || url.indexOf('/myPharmacy') > 0) {
      this.isOpd = false;
      this.userRoleName = "Pharmacy";
      this.user_id=this.user.userId;
      this.broadcastService.setHeaderText(this.userRoleName+' Onboarding');
      if (url.indexOf('/myPharmacy') > 0) {
        this.existingRecord = true;
        this.btnShow = true;
        this.broadcastService.setHeaderText('My Pharmacy');
      }
      this.pharmacyFlag = true;
            
    } else if (url.indexOf('/addOpd') > 0 || url.indexOf('/myOpd') > 0){
      this.isOpd = true;
      this.userRoleName = "Hospital";
      this.broadcastService.setHeaderText(this.userRoleName+' Onboarding');
      if (url.indexOf('/myOpd') > 0) {
        this.existingRecord = true;
        this.btnShow = true;
        this.broadcastService.setHeaderText('My OPD');
      }
      this.pharmacyFlag = false;
    }else if(url.indexOf('/addDiagnostics') > 0 || url.indexOf('/myDiagnostics') > 0){
      this.isOpd = false;
      this.userRoleName = "Diagnostics";
      this.user_id=this.user.userId;
      this.broadcastService.setHeaderText(this.userRoleName+' Onboarding');
      if (url.indexOf('/myDiagnostics') > 0) {
        this.existingRecord = true;
        this.btnShow = true;
        this.broadcastService.setHeaderText('My Diagnostics');
      }
      this.pharmacyFlag = true;
      this.userRoleName
     
    }

    this.isDifferentRole = false;
    this.isSaved = false;
    this.createOpdForm();
    if (this.user.roleName != "SYSADMIN") {
      this.loadLogo();

      let request={
        "serviceProviderRef":this.user_ref,
        "parentRoleName":this.userRoleName
      }
      
      this._serviceProviderService.getServiceProviderEntityValueByPk(request).subscribe(res =>{
          this.populateOpdForm(res.data);
          if(res.data.mainBranchIndicator=='Y'){
             this.mainBranchIndicatorFlag='Y';
          }else{
            this.mainBranchIndicatorFlag='N';
          }
          if (res == null)
            this.createOpdForm();
          else {}
        
      });
    }
    this.isAddressArr = [];
    //----------------------OPD category Drop Down------------------------------//
    if(this.userRoleName == "Hospital"){
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
    }
    //*********************End OPD category Drop Down******************************//

    else if(this.userRoleName == "Diagnostics"){  //*********************PHARMACY category Drop Down ******************************//
      this.opdForm.patchValue({
        category: "D"
      })
    }else{
      this.opdForm.patchValue({
        category: "D"
      })
    }
  
    // City/State Autocomplete
    this.countryList = [];
    this._doctorService.GetCountry().subscribe(
      res => {
        for (let i = 0; i < res['data'].length; i++) {
          this.countryList.push(res['data'][i].countryName);
        }
      },
      err => {
      }
    );
    // End City/State Autocomplete
    
    // app/issues/935
    if (url.indexOf('opd/my-service-provider/myOpd') > 0) {
      document.body.classList.remove('started-screen');
    }
    // End app/issues/935
  }

  populateOpdForm(res){
    if (res.reportTemplateRefNo)
      this.getTemplateDetailsByTemplateRefNo(res.reportTemplateRefNo); // app#843
    this.opdForm = this.fb.group({
     // pk: [res.pk],
      refNo: [res.refNo],
      name: [res.name, Validators.required],
      category: [res.category],
      isMainBranch: [res.mainBranchIndicator=='Y'?true:false],
      mainBranchIndicator: [res.mainBranchIndicator],
      parentEntityPk: [null],
      parentEntityRefno:[res.parentEntityRefno],
      parentEntityName: [res.parentEntityName],
      emailId: [res.emailId],
      website: [res.website],
      addressList: this.fb.array([]),
      phone1:[res.phone1],
      phone2:[res.phone2],
      phone3:[res.phone3],
      faxNo:[res.faxNo],
      feesPayableTo:[res.feesPayableTo],
      appointmentManagedBy:[res.appointmentManagedBy],
      timeSlotList: [], 
      pharmacyTimingWeekViewList: [],        
      status: [res.status],
      isSubmit:[true],
      onBoarded:[res.onBoarded],
      createdBy:[res.createdBy],
      modifiedBy:[res.modifiedBy],
      createdDate:[res.createdDate],
      modifiedDate:[res.modifiedDate],
      prescriptionTemplateType:[], // app/issues/843
      invoiceSettingRule: this.fb.group({
        docnoGenerationRulePk: [res.invoiceSettingRule!=null?res.invoiceSettingRule.docnoGenerationRulePk:null],
        docType: [res.invoiceSettingRule!=null?(res.invoiceSettingRule.docType!=null?res.invoiceSettingRule.docType:"INV"):"INV"],
        docPrefix: [res.invoiceSettingRule!=null?res.invoiceSettingRule.docPrefix:null],
        startingSerialNo: [res.invoiceSettingRule!=null?res.invoiceSettingRule.startingSerialNo:null]
      }),
      admissionSettingRule: this.fb.group({
        docnoGenerationRulePk: [res.admissionSettingRule!=null?res.admissionSettingRule.docnoGenerationRulePk:null],
        docType: [res.admissionSettingRule!=null?(res.admissionSettingRule.docType!=null?res.admissionSettingRule.docType:"ADM"):"ADM"],
        docPrefix: [res.admissionSettingRule!=null?res.admissionSettingRule.docPrefix:null],
        startingSerialNo: [res.admissionSettingRule!=null?res.admissionSettingRule.startingSerialNo:null]
      })
    })
    console.log(this.opdForm.value);
    this.showSample("INV");
    this.showSample("ADM");
    this.broadcastService.setServiceProviderName([res.name]);
    this.timingDataFromResponse = [];
    if(res['pharmacyTimingWeekViewList'] !== null){
      for(let i = 0; i < res['pharmacyTimingWeekViewList'].length; i++){
        let payload = {
            "mon":  res['pharmacyTimingWeekViewList'][i].mon,
            "tue": res['pharmacyTimingWeekViewList'][i].tue,
            "wed": res['pharmacyTimingWeekViewList'][i].wed,
            "thu": res['pharmacyTimingWeekViewList'][i].thu,
            "fri": res['pharmacyTimingWeekViewList'][i].fri,
            "sat": res['pharmacyTimingWeekViewList'][i].sat,
            "sun": res['pharmacyTimingWeekViewList'][i].sun,
            "startTime": res['pharmacyTimingWeekViewList'][i].startTime.substring(0,5),
            "endTime":  res['pharmacyTimingWeekViewList'][i].endTime.substring(0,5),
            "rowIndex":  res['pharmacyTimingWeekViewList'][i].rowIndex,
        }
        this.timingDataFromResponse.push(payload)
      }
    }

    let addressList: any
    for (let i = 0; i < res['addressList'].length; i++) {
      addressList = this.opdForm.get('addressList') as FormArray;
      addressList.push(this.addressListForUpdate(res['addressList'][i]));
    }
  }
  
  addressListForUpdate(res): FormGroup {
    return this.fb.group({
      pk: [res.pk],
      line1: [res.line1, Validators.required],
      line2: [res.line2],
      pinCode: [res.pinCode],
      city: [res.city, Validators.required],
      state: [res.state, Validators.required],
      country: [res.country, Validators.required],
    });
  }

  checkEmail(email: any) {
    if (this.opdForm.controls.cpEmailId.errors !== null) {
      // show error msg
    } else {
      this.authService.checkEmailExist(email).subscribe((data) => {
        if (data) {
          if (data.status === 5050) {
            this.toastService.showToast(data.status, data.message);
            return;
          }
        }
      },
        (error) => {
          // show error
        });

    }
  }

  checkContactNumber(contactNo: any) {
    let query={
      "eaddress": contactNo,
      "roleName": "ADMIN",
      "entityName": this.userRoleName.toUpperCase()
    }
    this._serviceProviderService.checkContactno(query).subscribe(result=>{
      if(result.status === 2000){
        if(result.data.eaddressAvailableCode === 2101){
          this.isDifferentRole = false;
          this.toastService.showToast(result.status, 'Mobile Number exists');
          this.opdForm.patchValue({
            cpPhone: ""
          })
          return;

        }else if(result.data.eaddressAvailableCode === 2102){
          this.isDifferentRole = false;
          return;
        }else if(result.data.eaddressAvailableCode === 2103){
          this.isDifferentRole = true;
          this.opdForm.patchValue({
            isMultirole: true,
            // app#1447 and 2028
            msUserPk:result.data.msUserPk,
            rolePk:result.data.eAddressDetails[0].rolePk
          })
          let list = result.data.eAddressDetails;
          let roleName;
          for(let role of list) {
            this.roleList.push(role);
            roleName=role.roleName;
            if(roleName==='ADMIN' || roleName==='OPERATOR' || roleName==='ASSISTANT'){
              this.toastService.i18nToast("en", "Already Exits" , "error");
              this.opdForm.patchValue({
                cpPhone: ""
              })
            }
          }

          this.msUserPk = result.data.msUserPk; 
          this.rolePk = result.data.eAddressDetails[0].rolePk;         
        }
      }else{}  
    })
  }

  createOpdForm(){
    let addrList: FormGroup[] = [];
    addrList.push(this.createItem());

    let pharmacyTimingWeekViewList: FormGroup[] = [];
    pharmacyTimingWeekViewList.push(this.createOperatingHoursCtrl());

    this.opdForm = this.fb.group({
     // pk: [null],
      name: ["", Validators.required],
      category: [this.pharmacyFlag==true?"P":""],
      isMainBranch: [false],
      mainBranchIndicator: ["N"],
      parentEntityPk: [null],
      parentEntityRefno:[null],
      parentEntityName: [""],
      emailId: [""],
      website: [""],
      addressList: this.fb.array(addrList),
      phone1:[""],
      phone2:[""],
      phone3:[""],
      faxNo:[""],
      cpName:["", Validators.required],
      cpEmailId: [null],
      cpPhone: [null, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      cpPhoneOTP:["", Validators.required],
      cpEmailIdExist:[true],
      cpPhoneExist:[false],
      cpDesignation: [""],
      feesPayableTo:["H"],
      appointmentManagedBy:["H"],
      timeSlotList: [],
      pharmacyTimingWeekViewList: [],
      status: "NRM",
      isSubmit:[false],
      isOTPSent:[false],
      isOTPVeryfied:[false],
      isMultirole:[false],
      createdBy: [""],
      modifiedBy: [],
      createdDate: [],
      modifiedDate: [],
      refNo:[null],
      onBoarded:[""],
      prescriptionTemplateType:[], // app/issues/843
      check: [false],
      // app#1447 and 2028
      msUserPk:[null],
      rolePk:[null],
      invoiceSettingRule: this.fb.group({
        docnoGenerationRulePk: [null],
        docType: ["INV"],
        docPrefix: [null],
        startingSerialNo: [null],
      }),
      admissionSettingRule: this.fb.group({
        docnoGenerationRulePk: [null],
        docType: ["ADM"],
        docPrefix: [null],
        startingSerialNo: [null],
      })
    })
  }

  get addressList(): FormArray {
    return this.opdForm.get('addressList') as FormArray;
  }

  get timeSlotList(): FormArray {
    return this.opdForm.get('timeSlotList') as FormArray;
  }

  get pharmacyTimingWeekViewList(): FormArray {
    return this.opdForm.get('pharmacyTimingWeekViewList') as FormArray;
  }

  contactNoExist(){
    this._serviceProviderService.checkContactno(this.opdForm.value.cpPhone).subscribe((data) => {
      if (data.status === 5050) {
        this.opdForm.patchValue({
          cpPhoneExist:true
        })
      }else{
        this.opdForm.patchValue({
          cpPhoneExist:false
        })
      }
    });
  }

  emailExist(){
    this._serviceProviderService.checkUsername(this.opdForm.value.cpEmailId).subscribe((data) => {
      if (data.status === 5050) {
        this.opdForm.patchValue({
          cpEmailIdExist:true
        })
      }else{
        this.opdForm.patchValue({
          cpEmailIdExist:false
        })
      }
    });
  }

  changeDayofweekAll(rowCtrl: any) {
    rowCtrl.patchValue({
      mo: rowCtrl.value.all,
      tu: rowCtrl.value.all,
      we: rowCtrl.value.all,
      th: rowCtrl.value.all,
      fr: rowCtrl.value.all,
      sa: rowCtrl.value.all,
      su: rowCtrl.value.all,
    })
  }

  changeDayofweek(rowCtrl: any) {
    let rowCtrlValue = rowCtrl.value;
    if (rowCtrlValue.mo && rowCtrlValue.tu && rowCtrlValue.we && rowCtrlValue.th && rowCtrlValue.fr &&
      rowCtrlValue.sa && rowCtrlValue.su) {
      rowCtrl.patchValue({
        all: true
      })
    } else {
      rowCtrl.patchValue({
        all: false
      })
    }
  }

  createOperatingHoursCtrl(): FormGroup {
    let grp = this.fb.group({
      pk: [null],
      fromTime: [null],
      toTime: [null],
      all: [false],
      mo: [false],
      tu: [false],
      we: [false],
      th: [false],
      fr: [false],
      sa: [false],
      su: [false]
    });
    return grp;
  }

  createItem(): FormGroup {
    let grp = this.fb.group({
      pk: [null],
      line1: [null, Validators.required],
      line2: [null],
      pinCode: [null],
      city: [null, Validators.required],
      state: [null, Validators.required],
      country: ['India', Validators.required],
    });
    return grp;
  }

  filterCountrySingle(event) {
    let query = event.query;

    this.filteredCountriesSingle = this.filterCountry(query, this.countryList);
  }

  filterStateSingle(event) {
    let query = event.query;
    this.filteredStateSingle = this.filterState(query, this.states);
  }

  filterState(query, states: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < states.length; i++) {
      let state = states[i];
      if (state.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(state);
      }
    }
    return filtered;
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

  filterCountry(query, countries: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if (country.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }

  deleteAddress(index) {
    let arrayControl = this.opdForm.get('addressList') as FormArray;
    arrayControl.removeAt(index);
  }

  addAddressRow() {
    this.opdForm.addControl('addressList', this.fb.array([]));
    this.addressList.push(this.createItem());
    let address = this.addressList.controls[0] as FormGroup;
    this.isAddressArr.push(false);
  }

  deleteOpetingHourse(index) {
    let arrayControl = this.opdForm.get('timeSlotList') as FormArray;
     arrayControl.removeAt(index);
  }

  addOperatingHoursRow() {
    this.opdForm.addControl('timeSlotList', this.fb.array([]));
    this.timeSlotList.push(this.createOperatingHoursCtrl());
  }

  //*********************Hospital Name autocomplete******************************//
  getHospitalList(event) {
    this._serviceProviderService.getHospitalList(event.query).subscribe((data) => {
      this.results = data.data;
    });
  }

  get lControls() { return this.opdForm.controls; }

  getParentEntityList(event){
    this._serviceProviderService.getParentEntityList(event.query).subscribe((data) => {
      this.parent = data.data;
    });
  }
  //*********************End Hospital Name autocomplete******************************//

  //*********************Change the value of Hospital Name autocomplete******************************//
  setOPD(event) {
    this.addList=[];
    const addressList = {
      line1: event.addrLine1,
      line2: null != event.addrLine2 ? event.addrLine2 : "",
      country: event.country,
      state: event.state,
      city: event.city,
      pinCode: null != event.pinCode ? event.pinCode : ""
    }
    this.addList.push(addressList);
    this.opdForm.patchValue({    
      //pk: event.hospitalPk,
      name: event.hospitalName,
      refNo: event.refNo,
      category: event.category,
      mainBranchIndicator: event.mainBranchIndicator ==='Y'?true:false,
      mainBranchIndicatorFlag: event.mainBranchIndicator,
      emailId: event.emailId,
      website: event.website,
      phone1: event.phoneNo1,
      phone2: event.phoneNo2,
      phone3: event.phoneNo3,
      faxNo: event.faxNo,    
      appointmentManagedBy: event.appointmentManagedBy,        
      status: event.status,
      addressList: this.addList,
      createdBy: event.createdBy,
      modifiedBy: event.modifiedBy,
      createdDate: event.createdDate,
      modifiedDate: event.modifiedDate,
      onBoarded: event.isOnboarded
    })
    if(event.isOnboarded === 'Y'){
      let entity: any;
      if(event.category === 'H')
        entity = 'Hospital';
      else if(event.category === 'N')
        entity = 'Nursing Home'; 
      else if(event.category === 'P')
        entity = 'Polyclinic'; 
      else if(this.userRoleName== 'Diagnostics')
        entity = 'Diagnostics';  
      else 
        entity = 'Pharmacy'; 
      alert("This "+entity+" is already onboarded.");
      this.createOpdForm();
    }
  }
  //*********************End Change the value of Hospital Name autocomplete******************************//

  toggleMainBranchIndicator(event) {
    if (event.target.checked) {
      this.mainBranchIndicatorFlag = 'Y';
    }
    else {
      this.mainBranchIndicatorFlag = 'N'
    }
  }

  toggleContactPerson(event) {
    if (event.target.checked) {
      this.showContactPersonFlag = 'Y';
    }
    else {
      this.showContactPersonFlag = 'N'
    }
  }

  setParentEntity(event) {
    this.opdForm.patchValue({
      parentEntityRefno: event.refNo,
      parentEntityName: event.hospitalName
    })
  }

  //*********************Send the OTP******************************//
  sendOtp(){
    console.log(this.opdForm);
    // Working on app/issues/1193
    if (this.opdForm.value.category == 'R' || this.opdForm.value.category == 'D') {
      if(!this.checkValidTimingList()){
        return false;
      }
      // End Working on app/issues/1193	
    } 
    
    if(!this.contactNoValidation()){
      this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
      return;
    }
    this.opdForm.patchValue({
      cpPhoneOTP: "Insert OTP"
    })
   
    if(this.opdForm.valid){
      let value=this.opdForm.value;
      let phoneNo = value.cpPhone.substr(3);
      let query={
        "contactNo": phoneNo,
        "emailAddress": "",
        "forgotPasswordLink": "",
        "mobileNo": phoneNo,
        "msUserPk": 0,
        "name": "",
        "otp": "",
        "password": "",
        "profilePk": 0,
        "securityKey": "",
        "smsActionType": "OTPSEND",
        "verificationCode": "",
        "check" : this.opdForm.value.check
      }

      this._serviceProviderService.sentOTP(query).subscribe(result=>{
        if(result.status==2000){
          this.toastService.showToast(result.status, "OTP has been sent to your mobile number");
          this.opdForm.patchValue({
            isOTPSent: true
          })
        }
      })
    }else{
      this.toastService.showToast(2500, "Please fill mandatory field.");
    }
  }

  verifyOtp(){
    if(this.opdForm.valid){
      let value=this.opdForm.value;
      let phoneNo = value.cpPhone.substr(3)
      let query={
        "contactNo": phoneNo,
        "emailAddress": "",
        "forgotPasswordLink": "",
        "mobileNo": phoneNo,
        "msUserPk": 0,
        "name": "",
        "otp": value.cpPhoneOTP,
        "password": "",
        "profilePk": 0,
        "securityKey": "",
        "smsActionType": "OTPVERIFY",
        "verificationCode": ""
      }
      this._serviceProviderService.sentOTP(query).subscribe(result=>{
        if(result.status==2000){
          this.opdForm.patchValue({
            isOTPVeryfied: true
          })
          this.saveEntity();
        }else{
          this.opdForm.patchValue({
            isOTPVeryfied: false,
            isOTPSent: false
          })
          this.toastService.showToast(result.status, "OTP verification failed. Please retry.");
        }
      })
    }else{
      this.toastService.showToast(2500, "Please fill mandatory field.");
    }
  }
  //*********************Send the OTP******************************//

  changeEntity(entity){
    if(entity == "R"){
      this.showSettings = false;
      this.opdForm.controls.appointmentManagedBy.setValue("");
      this.opdForm.controls.feesPayableTo.setValue("");
    } else if(entity == "D"){
      this.showSettings = false;
      this.opdForm.controls.appointmentManagedBy.setValue("");
      this.opdForm.controls.feesPayableTo.setValue("");
    }
    else{
      this.showSettings = true;
      this.opdForm.controls.appointmentManagedBy.setValue("H");
      this.opdForm.controls.feesPayableTo.setValue("H");
    }
  }

  //*********************Save the OPD onboarding******************************//
  saveEntity() {

    this.submitted = true;
    if(!this.contactNoValidation()){
      this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
      return;
    }
    // app/issues/911
    if(!this.primaryContactNoValidation()){      
      this.toastService.showI18nToast('OPD_MESSAGE.PRIMARY_PHONE_NO_EMPTY', 'warning');
      return;
    }
    // End app/issues/911
    if(this.userRoleName == "Pharmacy"){
      this.opdForm.patchValue({
         category: 'R'
      })
    }
    if(this.userRoleName == "Diagnostics"){
      this.opdForm.patchValue({
         category: 'D'
      })
    }
    console.log(this.opdForm.value);

    if(this.opdForm.valid){
      this.opdForm.patchValue({
        mainBranchIndicator: this.opdForm.value.isMainBranch === true ? 'Y' : 'N'
      })
      if(this.opdForm.value.parentEntityName == null)
        this.opdForm.value.parentEntityName = "";
      this._serviceProviderService.saveEntity(this.opdForm.value).subscribe(data => {
      if (data.status == 1) {
                  /* if(!this.isDifferentRole){ // Case - New contact person user
                    if(!this.existingRecord){ // Case - SysAdmin is onboarding an OPD / Pharmacy
                      if (this.opdForm.value.cpName !== null || this.opdForm.value.cpName !== " ") {
                        const payload = {
                          'emailAddress': this.opdForm.value.cpEmailId,
                          'contactNo': this.opdForm.value.cpPhone,
                          // 'password': this.opdForm.value.cpEmailId === null ? this.opdForm.value.cpPhone : this.opdForm.value.cpEmailId,
                          'password': data.data.password,
                          'name': this.opdForm.value.cpName,
                          'registrationProvider': 'SBIS',
                          'roleName': 'ADMIN',
                          'entityName': this.userRoleName.toUpperCase(),
                          'serviceProviderPk': data.data.pk,
                          'contactNoVerified': true,
                          'emailVerificationCode': data.data.emailVerificationCode,
                          'designation': this.opdForm.value.cpDesignation,
                          'changePasswordRequired': data.data.changePasswordRequired
                        };
                        // this.userRegister(payload); // Working on app/issue/1447
                      }
                    }else{ // Case - Admin / Operator is updating through My OPD / My Pharmacy
                      this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_UPDATE_SUCCESS', 'success');
                    }
                  } *//* else{  // Case - Multi-user
                    let query={
                      "msUserPk":this.msUserPk,
                      "rolePk":this.rolePk,
                      "roleName":"ADMIN",
                      "entityName": this.userRoleName.toUpperCase(),
                      "designation": this.opdForm.value.cpDesignation,
                      "serviceProviderPk": data.data.pk,
                      "isOpd": true
                    }
                    this._serviceProviderService.roleAdd(query).subscribe(data=>{
                      console.log(data);
                      if(data.status === 2000){
                        this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_REGISTRATION_SUCCESS', 'success');
                        this.isSaved = true;
                      } 
                    },error=>{
                      this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_FAIL', 'error');
                    })         
                  } */
                  if(!this.existingRecord){this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_REGISTRATION_SUCCESS', 'success');}
          if(this.user.roleName === 'ADMIN' || this.user.roleName === 'OPERATOR'){
            this.back('Y');
          }
          else {
            this.router.navigate(['/sysadmin']);
          }
        }    
      },error=>{
        this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_FAIL', 'error');
      })
      
    }

   
    

  }
  //*********************End of Save the OPD onboarding******************************//

  userRegister(query) {
    this.authService.userSignUp(query).subscribe(result => {
      if (result && result.status == 2000) {
        this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_REGISTRATION_SUCCESS', 'success');
      } else {
        this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_REGISTRATION_FAIL', 'error');
      }
    })
  }

  getWorkScheduleData(workScheduleData){
    let pharmacyTimingData : any = [];
    for(let i = 0; i < workScheduleData.length; i++){
      let payload = {
        "mon": workScheduleData[i].mon,
        "tue": workScheduleData[i].tue,
        "wed": workScheduleData[i].wed,
        "thu": workScheduleData[i].thu,
        "fri": workScheduleData[i].fri,
        "sat": workScheduleData[i].sat,
        "sun": workScheduleData[i].sun,
        "startTime": workScheduleData[i].startTime+":00",
        "endTime": workScheduleData[i].endTime+":00", //+":00"
        "rowIndex": workScheduleData[i].rowIndex,
       
    }
    pharmacyTimingData.push(payload)
    }
    this.opdForm.patchValue({
      pharmacyTimingWeekViewList: pharmacyTimingData
    })

    console.log(this.opdForm.value);

  }

  back(calledFromSave: any){
    if(this.userRoleName === "Hospital"){
      this.router.navigate(['opd/opdPharmacyView/opd',{isUpdate: calledFromSave}]);
    }else if(this.userRoleName === "Pharmacy"){
      this.router.navigate(['opd/opdPharmacyView/pharmacy',{isUpdate: calledFromSave}]);
    }else if(this.userRoleName === "Diagnostics"){
      this.router.navigate(['opd/opdPharmacyView/diagnostics',{isUpdate: calledFromSave}]);
    }
  }

  contactNoValidation(){
    if((this.opdForm.value.phone1 && this.opdForm.value.phone1.length>3 && this.opdForm.value.phone1.length!=13) ||  
       (this.opdForm.value.phone2 && this.opdForm.value.phone2.length>3 && this.opdForm.value.phone2.length!=13) ||
       (this.opdForm.value.phone3 && this.opdForm.value.phone3.length>3 && this.opdForm.value.phone3.length!=13) ||
       (this.opdForm.value.faxNo && this.opdForm.value.faxNo.length>3 && this.opdForm.value.faxNo.length!=13) ||
       (this.opdForm.value.refNo == null && this.opdForm.value.cpPhone && 
        this.opdForm.value.cpPhone.length>3 && this.opdForm.value.cpPhone.length!=13))
      return false;
   else
      return true;
  }
  
  loadLogo() {

    this._serviceProviderService.downloadLogo(this.ms_User_Pk , this.user.entityName).subscribe(result => {
      if (result.status === 2000 && result.data != null && result.data.length > 0) {
        this.logoSrc = "data:image/jpeg;base64," + result.data;
        this.broadcastService.setLogo(this.logoSrc);
      }
      this.progress.percentage = 0;
    })
  }
  
  selectFile(event: any) {
    this.progress.percentage = 0;
    const file = event.target.files[0];
    // Issue app#807 - increase size allowed
    if (Math.round(file.size / 1024) > 300) {
      document.getElementById("logo")["value"] = "";
      this.toastService.showI18nToast("OPD_MESSAGE.OPD_PIC_LESS_THAN" , 'warning');
      return;
    }
    let formdata: FormData = new FormData();
    formdata.append('entityName', this.user.entityName);
    formdata.append('userId', this.user.userId);
    formdata.append('file', file);

    this._serviceProviderService.uploadLogo(formdata, this.user.token).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        if (this.progress.percentage > 80) {
          this.progress.percentage = this.progress.percentage - 10;
        }
      } else if (event instanceof HttpResponse) {
        this.progress.percentage = 100;
        document.getElementById("logo")["value"] = "";
        this.loadLogo();
      }
    });
  }

// Added for issue app#597
  fetchCountryStateCityByPin(pin, ev) {
    if (ev.code.indexOf('Arrow') != -1) return;
    if(pin.length == 6) {
      let payload = {
        "pincode" : pin
      }

      this._doctorService.findCountryStateCityByPin(payload).subscribe(data =>{
        console.log(data.data);
        this.addList=[];
        if(data.status == 2000){
          if(data.data.country == null && data.data.state == null && data.data.city == null){
            this.toastService.showI18nToast("Invalid PIN Code", 'error');
            const addressList = {
              pinCode: "",
              country: "India",
              state: "",
              city: ""
            }
            this.addList.push(addressList);
            this.opdForm.patchValue({
              addressList: this.addList
            })
          }else{
            const addressList = {
              country: data.data.country,
              state: data.data.state,
              city: data.data.city
            }
            this.addList.push(addressList);
            this.opdForm.patchValue({
              addressList: this.addList
            })
          }
        }else{
          this.toastService.showI18nToast(data['message'], 'error');
        }
      });
    }
  }
  // app/issues/843
  getAllPrescriptionTemplates() {   
    let currentUser=JSON.parse(localStorage.getItem('user')); 
    let payload={entityName:currentUser.entityName,userRefNo:currentUser.serviceProviderRefNo}
    this._serviceProviderService.getPrescriptionTemplatesByRefNo(payload).subscribe(res => {
      console.log("Fetched prescriptions::",res);      
      this.allPrescriptionTemplates=res.data;
      },
      (error) => { 
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        return;
      });
  }

  // savePrescriptionTemplateType() { 
  //   let currentUser=JSON.parse(localStorage.getItem('user'));
  //   let payload=
  //   {
  //     prescriptionTemplateFileName:this.opdForm.value.prescriptionTemplateType,
  //     entityName:currentUser.entityName,
  //     userRefNo:currentUser.serviceProviderRefNo,
  //     userName:currentUser.serviceProviderName
  //   }
  //   this._doctorService.savePrescriptionTemplate(payload)
  //   .subscribe(res=>{
  //   },
  //   (error) => { 
  //     this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
  //     this.submitted = false;
  //     return;
  //   }) 
  // }

  getTemplateDetailsByTemplateRefNo(templateRefNo) {
    let payload= {
      refNo:templateRefNo
    }
    this._doctorService.getPrescriptionTemplateById(payload).subscribe(res => {
      this.opdForm.patchValue({
        prescriptionTemplateType:res.data.templateFileName
      })
    },
    (error) => { 
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
      this.submitted = false;
      return;
    });
  }

  getTemplateDetailsByTemplateId(templateId)
  {
    
    let payload=
        {
          templateId:templateId
        
        }
    this._doctorService.getPrescriptionTemplateById(payload)
      .subscribe(res => {
        this.opdForm.patchValue({
          prescriptionTemplateType:res.data.templateFileName
        })
        console.log("res of getTemplateDetailsByTemplateId::",res);
        console.log("form::",this.opdForm.value);
        
      },
      (error) => {
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        this.submitted = false;
        return;
      });
  }
  // End app/issues/843

  // app/issues/911
  primaryContactNoValidation() {
    if(this.opdForm.value.phone1 && this.opdForm.value.phone1.length<=3)
      return false;    
    else
      return true;
  }
  // End app/issues/911


  // Working on app/issues/1193
  checkValidTimingList(){
    var timingList = this.opdForm.get('pharmacyTimingWeekViewList') as FormArray;
    let isTimmingNotValid:boolean=false;
    if(timingList.value == null){
      this.timingValidationMsg = "Please Enter Chamber Timing Details";
      return false;
    }
    else{
      this.timingValidationMsg = "";
      for(let i=0; i < timingList.value.length; i++){      
        if((timingList.value[i].startTime.length<=3) || (timingList.value[i].endTime.length<=3)){
          this.timingValidationMsg = "Please Enter Timing Details for Schedule "+(i+1);
          isTimmingNotValid= true;
          break;
        }
        
      }

      if(isTimmingNotValid)
        return false;
      else
        return true;
    }
  }

  // End Working on app/issues/1193


  //app#2464
  showInvSample: any = "";
  showAdmSample: any = "";
  showSample(doc){
    let date = new Date();
    var mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    let today = [day, mnth, date.getFullYear()].join("");
    if(doc=="INV"){
      let prefix = this.opdForm.controls.invoiceSettingRule.value.docPrefix;
      this. showInvSample = prefix+"-"+today+"-0001"
    }
    if(doc=="ADM"){
      let prefix = this.opdForm.controls.admissionSettingRule.value.docPrefix;
      this. showAdmSample = prefix+"-"+today+"-0001"
    }

  }
}
