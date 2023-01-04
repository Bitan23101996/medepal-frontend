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

import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs/operators';
import { ServerResponse } from '../server-response';
import { DoctorService } from '../doctor.service';
import { HttpClient, HttpRequest } from "@angular/common/http";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { ToastService } from '../../../core/services/toast.service';
import { IndividualService } from '../../individual/individual.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs/Observable';

function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return "";
  }
}

function isNumber(value: any): boolean {
  return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css'],
  providers: []
})

export class DoctorProfileComponent implements OnInit {
  doctor: any;
  countryList: any
  countryList1: any;
  stateList: any
  countries: any[];

  filteredCountriesSingle: any[];
  filteredStatesSingle: any[];

  progress = { percentage: 0, isShowUploadBtn: false };
  domSanitizer: any;
  profileImageSrc = "";
  addressList;
  chamberList;
  regverified: boolean;
  newAddress;
  doctorForm: FormGroup;
  specializationArr: FormGroup;
  specializationList: any;
  subSpecializationList: any;
  subSpecializationListArr: any;
  qualificationList: any;
  qualificationLArray: any;
  isDuplicateSpecialization: any;
  isDuplicateQualification: any;
  isDuplicateYear: any;
  isValidEmail: any;
  isValidMobileNo: any;
  submitted: any = false;
  selectedValue: any = '';
  options: any;
  filteredOptions: any;
  years: any
  selectedCountry: any
  selectedCountryInClick: any;
  cont: any
  isAddressArr: any;
  experienceNum: any;
  stateListTypeAhd: any;
  filteredBrands: string[];
  countryList2: String[];
  dateFormat: any;
  isPhExist: any;
  ifEmailExist: any;
  ms_User_Pk: any
  user: any;
  dtFormat = "";
  maxDate: Date;
  email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  isEmailForSameUserCheck: any;
  existEmailId: any = '';
  existPhNo: any
  result: any;
  isReadOnlyPhNo: boolean;
  isReadOnlyEmail:boolean;
  isReadOnlyRegNo: boolean;
  landLineFormatValidation = /\d{5}([- ]*)\d{6}/;
  isFormSubmitted = false;
  isEdit = false;
  isMobile1Duplicate:any = false;
  isMobile2Duplicate:any = false;
  isMobile3Duplicate:any = false;
  isNotValidMobileNo1:any = false;
  deleteQualificationForm: FormGroup[] = [];
  deleteSpecializationForm: FormGroup[] = [];
  signatureSrc="";
  age: any;
  ms_user_id:any;
  //maxDate: Date;
  experience: any = 0;
  expMsg: any;
  masterGender: any = [];
  otpVerify: any = false;
  otpVerifySuccess: any = false;
  parentDirtyFlag = false;
  childDirtyFlag = false;
  remainchar=2024;
  funcallArr:Array<{
    "specialization" : string, 
    "i" : number
    }> = [];

  /* Working on app/issues/782 */
  isRegistrationWorkflowCompleted: boolean = false;
  // isValidProfile: boolean = false;
  workflowSteps: any = [];
  workflow: any;
  redirectFlag: boolean = true;
  successMsgFor = "partialRegistration";
  /*End Working on app/issues/782 */


  checkPattern(event: any) {
    // Changes for app/issues/816
    // const pattern = /[0-9\.\-\ ]/;
    let regex: RegExp = new RegExp(/^\d*\.?\d{0,1}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete', 'ArrowLeft', 'ArrowRight'];
    let inputChar = String.fromCharCode(event.charCode);
    
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.doctorForm.value.yearsOfExperience;
    
    let next: string = current?current + "".concat(event.key):event.key;
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
  
  constructor(private fb: FormBuilder, private translate: TranslateService,private toastService: ToastService,
    private _doctorService: DoctorService, private http: HttpClient, private route: ActivatedRoute,private _domSanitizer: DomSanitizer,
    private broadcastService: BroadcastService,private individualService: IndividualService,
    private authService: AuthService, private router: Router) {
    this.domSanitizer = _domSanitizer;
    this.getvalue();
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    this.maxDate = new Date();
    this.maxDate.setFullYear( this.maxDate.getFullYear() - 18 );
    
  }

  public getvalue() {
    this.http.get('./assets/dateConfig/dateConfig.json').subscribe(
      data => {
        this.dateFormat = data;
        //console.log("YY", this.dateFormat);
      }
    );
  }

  ngOnInit() {
    this.broadcastService.setHeaderText('About Me');
    this.isEmailForSameUserCheck = false;
    this.dtFormat = environment.DATE_FORMAT;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.ms_User_Pk = this.user.userId;
    this.isReadOnlyPhNo = false;
    this.isReadOnlyEmail = false;
	  this.isReadOnlyRegNo = false;
    this.isMobile1Duplicate = false;
    this.isMobile2Duplicate = false;
    this.isMobile3Duplicate = false;
    this.isNotValidMobileNo1 = false;
    this.isEdit = false;

    this._doctorService.getMasterDataGender({ q: 'GENDER' }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
      } else {
        //alert(data.message);
      }
    });

    var request={
      "refNo":this.user.refNo
    }

    this._doctorService.fetchUserDtls(request).subscribe(
      res => {
        console.log("res",res);
        this.result = res;
        if(res.signatureFilePath!=null){
         this.signatureSrc = "data:image/jpeg;base64," + res.signatureImage;
        }
       
        if (res == null)
          this.doctor = this.createForm();
        else {
          this.isEmailForSameUserCheck = true;
          this.existEmailId = res.emailId;
          this.ms_user_id=res.msUserPk;
          if(res.emailId != '' && res.emailId !=null && res.emailId)
          {
            this.isReadOnlyEmail = true;
          }
          this.existPhNo = res.mobileNo1;
          if(res.mobileNo1 !='' && res.mobileNo1 !=null && res.mobileNo1)
          {
            this.isReadOnlyPhNo = true;
          }
		  
		  if(res.registrationNo !='' && res.registrationNo !=null && res.registrationNo)
          {
            this.isReadOnlyRegNo = true;
          }
          this.doctor = this.populateForm(res);
        }
        // return;
      }
    )

    this.countrySelect('India');
    var year = new Date().getFullYear();
    var range = [];
    range.push(year);
    for (var i = 1; i < 100; i++) {
      range.push(year - i);
    }
    this.years = range;

    this.regverified = true;
    this.selectedCountry = 'India';

    // Autocomplete
    this.options = [];
    this._doctorService.GetAddressType().subscribe(
      res => {
        for (let i = 0; i < res['masterDataAttributeValues'].length; i++) {
          this.options.push(res['masterDataAttributeValues'][i].displayValue);
        }
      });

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
    this.loadProfileImage();
    this.getQualificationList();
    this.getSpecializationList();
    this.subSpecializationList = [];
    this.subSpecializationListArr = [];
    this.isDuplicateSpecialization = [];
    this.isDuplicateQualification = [];
    this.isDuplicateYear = [];
    this.cont = [];
    this.isAddressArr = [];
    this.experienceNum = [];
    for (let i = 0; i <= 100; i++) {
      this.experienceNum[i] = i;
    }

    /* Working on app/issues/782 */
    this.workflow = JSON.parse(localStorage.getItem('regw'));
    //this.workflowSteps = workflow.registrationWorkflowSteps;
    this.isRegistrationWorkflowCompleted = this.workflow.registrationWorkflowCompleted;
    // this.isValidProfile = this.workflow.validProfile;
    this.broadcastService.setRegistrationWorkflow(this.workflow);
    // this.broadcastService.getRegistrationWorkflow().subscribe(workflow => {
    //   this.workflowSteps = workflow.registrationWorkflowSteps;
    //   this.isRegistrationWorkflowCompleted = workflow.registrationWorkflowCompleted;
    //   this.isValidProfile = workflow.validProfile
    // });
    
    if(!this.isRegistrationWorkflowCompleted){
      this.isEdit = true;
    }
    /*End Working on app/issues/782 */
    
  }

  onValueChange(dt: Date): void {
    //console.log(dt);
    this.doctorForm.value.dateOfBirth = ('0' + dt.getDate()).slice(-2) + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear();;
    //console.log(this.doctorForm.value);

  }
  
  
   
   encodeVal(val){
	  console.log(val); 
	  this.doctorForm.get('briefresume').setValue(val);  
   }

  populateForm(res) {
    this.broadcastService.setProfileModificationData({"firstName" : res.doctorName});
    this.regverified = res.registrationStatus == 'Y'? true: false;
    this.onlineReviewFlag = res['onlineReview']; //Working on app/issues/688
    this.doctorForm = this.fb.group({
      //doctorPk: [res.doctorPk],
      doctorName: [res.doctorName==null ? "Not Specified":res.doctorName, Validators.required],
      //dateOfBirth: [new Date(res.dateOfBirth)],
      dateOfBirth: [res.dateOfBirth==null ? null : new Date(res.dateOfBirth),Validators.required],
      mobileNo1: [res.mobileNo1],
      mobileNo2: [res.mobileNo2],
      mobileNo3: [res.mobileNo3],
      landlineNo: [res.landlineNo==null ? "Not Specified":res.landlineNo],
      briefresume:[res.briefresume],
      emailId: [res.emailId==null ? "Not Specified":res.emailId],
      registrationNo: [res.registrationNo, Validators.required],
      registrationStatus: [res.registrationStatus],
      email_verification_status:[res.email_verification_status],
      contact_verification_status:[res.contact_verification_status],
      otp:[null],
      //registrationVerificationDate: [this.doctor.registrationVerificationDate],
      homeVisitFlag: ['N'],
      doctorSpecializationList: this.fb.array([]),
      yearsOfExperience: [res.yearsOfExperience==null? "Not Specified":res.yearsOfExperience],
      doctorQualificationList: this.fb.array([]),
      //doctorAddressList: this.fb.array([]),
      status: ['NRM'],
      refNo: [res.refNo],
      msUserPk: [res.msUserPk],
      gender: [res.gender==null ? "":res.gender, Validators.required],
      createdBy: [res['createdBy']],
      createdDate: [res['createdDate']],
      modifiedBy: [res['modifiedBy']],
      modifiedDate: [res['modifiedDate']],
      isModified: [false],
      yearOfRegistration:[res['yearOfRegistration']],
      signatureFilePath:[res['signatureFilePath']],
      signatureFileName:[res['signatureFileName']],
      onlineConsultation: [res['onlineConsultation']],
      onlineReview: [res['onlineReview']==null?false:res['onlineReview']=='N'?false:true] //Working on app/issues/688
    });
    let doctorSpecializationList: any
    for (let i = 0; i < res['doctorSpecializationList'].length; i++) {
      doctorSpecializationList = this.doctorForm.get('doctorSpecializationList') as FormArray;
      doctorSpecializationList.push(this.createSpecializationUpdate(res['doctorSpecializationList'][i]));
      this.setForCallSubSpecializationList(""+res['doctorSpecializationList'][i]['specializationPk'], i);
    }

    let doctorQualificationList: any
    for (let i = 0; i < res['doctorQualificationList'].length; i++) {
      doctorQualificationList = this.doctorForm.get('doctorQualificationList') as FormArray;
      doctorQualificationList.push(this.createqualificationUpdate(res['doctorQualificationList'][i]));
    }
   
    this.manageValueChanges();
   
    if(res.dateOfBirth!=null){
      const bdate = new Date(res.dateOfBirth);
      const timeDiff = Math.abs(Date.now() - bdate.getTime() );
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      this.experience = this.age;
      if(this.age < res.yearsOfExperience){
        this.doctorForm.patchValue({
          yearsOfExperience : 0
        });
        this.expMsg = "* Exprience should less than age";
        
      }
      else{
        this.expMsg = "";
      }
    }else{
      this.age=0;
      // this.doctorForm.patchValue({"yearsOfExperience":0});
    }
	
	console.log(this.doctorForm);
	this.doctorForm.patchValue({"briefresume":this.doctorForm.controls.briefresume.value});
	
    return this.doctorForm;
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCountry(value: any): string[] {
    const filterValue = value.toLowerCase();
    let selectedCoutryOnClk = this.countryList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    this.selectedCountryInClick = filterValue;
    this.stateList = [];
    this._doctorService.GetStates('' + this.selectedCountryInClick.toString() + '/states').subscribe(
      res => {
        for (let i = 0; i < res['data'].length; i++) {
          this.stateList.push(res['data'][i].stateName);
        }
      },
      err => {
        console.log(err);
      }
    );
    return selectedCoutryOnClk;
  }

  countrySelect(country) {
    //alert(country);
    this.stateList = [];
    this._doctorService.GetStates(country + "/states")
      .subscribe(res => {
        for (let i = 0; i < res['data'].length; i++) {
          this.stateList.push(res['data'][i].stateName);
        }
        //console.log(this.stateList);
      });
  }

  private _filterState(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.stateList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  get lControls() { return this.doctorForm.controls; }
  // get doctorAddressList(): FormArray {
  //   return this.doctorForm.get('doctorAddressList') as FormArray;
  // }
  get specializationArray(): FormArray {
    return this.doctorForm.get('doctorSpecializationList') as FormArray;
  }
  get qualificationArray(): FormArray {
    return this.doctorForm.get('doctorQualificationList') as FormArray;
  }

  createForm() {
    let addrList: FormGroup[] = [];
    let qualificationArr: FormGroup[] = [];
    let specializationArray: FormGroup[] = [];

    this.doctorForm = this.fb.group({
      //doctorPk: [null],
      doctorName: [null, Validators.required],
      dateOfBirth: [null],
      mobileNo1: [null],
      mobileNo2: [null],
      mobileNo3: [null],
      landlineNo: [null],
      briefresume:[null],
      emailId: [null, Validators.email],
      registrationNo: [null, Validators.required],
      registrationStatus: ['N'],
      gender: [null, Validators.required],
      email_verification_status:[null],
      contact_verification_status:[null],
      otp:[null],
      //registrationVerificationDate: [this.doctor.registrationVerificationDate],
      homeVisitFlag: ['N'],
      doctorSpecializationList: this.fb.array(specializationArray),
      yearsOfExperience: [null],
      doctorQualificationList: this.fb.array(qualificationArr),
      //doctorAddressList: this.fb.array(addrList),
      status: 'NRM',
      refNo: [null],
      msUserPk: [null],
      createdBy: [null],
      createdDate: [null],
      modifiedBy: [null],
      modifiedDate: [null],
      isModified: [true],
      yearOfRegistration:[null],
      signatureFilePath:[''],
      signatureFileName:[''],
      onlineReview: [''], //Working on app/issues/688
    });

    return this.doctorForm;
  }

  duplicacyCheck()
  {
    let mobile1 = this.doctorForm.value.mobileNo1;
    let mobile2 = this.doctorForm.value.mobileNo2;
    let mobile3 = this.doctorForm.value.mobileNo3;
    this.isMobile1Duplicate = false;
    this.isMobile2Duplicate = false;
    this.isMobile3Duplicate = false;
    this.isNotValidMobileNo1 =  false;

    if(mobile1 && mobile1.length >3)
    {
      if(mobile1 == mobile2)
    {
      this.isMobile1Duplicate = true;
      this.isMobile2Duplicate = true;
    }

    if(mobile1 == mobile3)
    {
      this.isMobile1Duplicate = true;
      this.isMobile3Duplicate = true;
    }
    }
    else{
      this.isNotValidMobileNo1 = true
    }
    
    if(mobile2 && mobile2.length >3)
    if(mobile2 == mobile3)
    {
      this.isMobile2Duplicate = true;
      this.isMobile3Duplicate = true;
    }
    

  }
  // addAddressRow() {


  //   this.doctorForm.addControl('doctorAddressList', this.fb.array([]));
  //   this.doctorAddressList.push(this.createItem());
  //   let address = this.doctorAddressList.controls[0] as FormGroup;
  //   this.isAddressArr.push(false);
  // }
  createAddressUpdate(res): FormGroup {

    let grp = this.fb.group({
      doctorAddressPk: [res['doctorAddressPk']],
      addressType: [res['addressType']],
      line1: [res['line1'], Validators.required],
      line2: [res['line2']],
      pinCode: [res['pinCode'], Validators.required],
      city: [res['city']],
      state: [res['state']],
      country: 'India',
      status: 'NRM',
      createdBy: [res['createdBy']],
      createdDate: [res['createdDate']],
      modifiedBy: [res['modifiedBy']],
      modifiedDate: [res['modifiedDate']]
    });
    return grp;

  }
  createItem(): FormGroup {

    let grp = this.fb.group({
      doctorAddressPk: [null],
      addressType: '',
      line1: [null, Validators.required],
      line2: [null],
      pinCode: [null, Validators.required],
      city: [null],
      state: [null],
      country: 'India',
      status: 'NRM',
      createdBy: [null],
      createdDate: [null],
      modifiedBy: [null],
      modifiedDate: [null]
    });



    this.filteredOptions = grp.controls.addressType.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.countryList1 = grp.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountry(value))
    );

    this.stateListTypeAhd = grp.controls.state.valueChanges.pipe(
      startWith(''),
      map(value => this._filterState(value))
    );

    return grp;

  }
  createqualification(): FormGroup {
    return this.fb.group({
      doctorQualificationPk: [null],
      qualificationCode: '',
      yearProcured: [null],
      institute: [null],
      qualificationPk: '',
      status: 'NRM',
      createdBy: [null],
      createdDate: [null],
      modifiedBy: [null],
      modifiedDate: [null],
      shortCode: [null],
      isModified: [true]
    });
  }

  createqualificationUpdate(res): FormGroup {
    return this.fb.group({
      doctorQualificationPk: [res['doctorQualificationPk']],
      qualificationCode: [res['qualificationCode']],
      yearProcured: [res['yearProcured']],
      institute: [res['institute']],
      qualificationPk: [res['qualificationPk']],
      status: res['status'],
      createdBy: [res['createdBy']],
      createdDate: [res['createdDate']],
      modifiedBy: [res['modifiedBy']],
      modifiedDate: [res['modifiedDate']],
      shortCode: res['shortCode'],
      isModified: [false]
    });
  }

  createSpecialization(): FormGroup {
    return this.fb.group({
      doctorSpecializationPk: [null],
      specialization: '',
      subSpecialization: '',
      specializationPk: '',
      subSpecializationPk: '',
      status: 'NRM',
      createdBy: [null],
      createdDate: [null],
      modifiedBy: [null],
      modifiedDate: [null],
      isModified: [true]
    });
  }

  createSpecializationUpdate(res): FormGroup {
    return this.fb.group({
      doctorSpecializationPk: [res['doctorSpecializationPk']],
      specialization: [res['specialization']],
      subSpecialization: [res['subSpecialization']],
      specializationPk: [res['specializationPk']],
      subSpecializationPk: [res['subSpecializationPk']],
      status: [res['status']],
      createdBy: [res['createdBy']],
      createdDate: [res['createdDate']],
      modifiedBy: [res['modifiedBy']],
      modifiedDate: [res['modifiedDate']],
      isModified: [false]
    });
  }

  deleteSpecialization(index) {
    if (this.specializationArray.controls[index].get('specialization').value === "") {
      this.specializationArray.controls.splice(index, 1);
      this.specializationArray.value.splice(index, 1);
      this.isDuplicateSpecialization.splice(index, 1);

    }
    else {
      this.specializationArray.value[index].status = "CXL";
      this.specializationArray.controls.splice(index, 1);
      this.isDuplicateSpecialization.splice(index, 1);
      this.deleteSpecializationForm.push(this.specializationArray.value[index]);
      this.specializationArray.value.splice(index, 1);
    }
    this.subSpecializationListArr.splice(index, 1);

    this.deleteSpecilizationValidation(index);

  }

  deleteSpecilizationValidation(index) {
    for (let num = 0; num < this.specializationArray.controls.length; num++) {
      if (this.specializationArray.controls[num + 1] && index > 0 && num != index && this.specializationArray.controls[num].value.specializationPk === this.specializationArray.controls[num + 1].value.specializationPk) {
        this.isDuplicateSpecialization[num] = true;
      }
      else {
        this.isDuplicateSpecialization[num] = false;
      }
    }
  }

  deleteQualificationValidation(index) {
    for (let num = 0; num < this.qualificationArray.controls.length; num++) {
      if (this.qualificationArray.controls[num + 1] && index > 0 && num != index && this.qualificationArray.controls[num].value.qualificationPk === this.qualificationArray.controls[num + 1].value.qualificationPk) {
        this.isDuplicateQualification[num] = true;
      }
      else {
        this.isDuplicateQualification[num] = false;
      }
    }
  }

  deleteYearValidation(index) {
    for (let num = 0; num < this.qualificationArray.controls.length; num++) {
      if (this.qualificationArray.controls[num + 1] && index > 0 && num != index && this.qualificationArray.controls[num].value.year_procured === this.qualificationArray.controls[num + 1].value.year_procured) {
        this.isDuplicateYear[num] = true;
      }
      else {
        this.isDuplicateYear[num] = false;
      }
    }
  }

  addSpecialization(index) {
    for (let i = 0; i < this.isDuplicateSpecialization.length; i++)
      if (this.isDuplicateSpecialization[i]) {
        return;
      }
    var specializationArray = this.doctorForm.get('doctorSpecializationList') as FormArray;
    this.specializationArray.push(this.createSpecialization());
    this.subSpecializationList = [];

  }

  addQualification(index) {
    for (let i = 0; i < this.isDuplicateQualification.length; i++)
      if (this.isDuplicateQualification[i]) {
        return;
      }
    var qualificationArray = this.doctorForm.get('doctorQualificationList') as FormArray;
    this.qualificationArray.push(this.createqualification());

  }

  deleteQualification(index) {
    if (this.qualificationArray.controls[index].get('qualificationCode').value === "") {
      this.qualificationArray.controls.splice(index, 1);
      this.qualificationArray.value.splice(index, 1);
      this.isDuplicateQualification.splice(index, 1);
      this.isDuplicateYear.splice(index, 1);
      this.deleteQualificationValidation(index);
      this.deleteYearValidation(index);
    }
    else {
      this.isDuplicateQualification.splice(index, 1);
      this.isDuplicateYear.splice(index, 1);
      this.qualificationArray.value[index].status = "CXL";
      this.qualificationArray.controls.splice(index, 1);
      this.deleteQualificationValidation(index);
      this.deleteYearValidation(index);
      this.deleteQualificationForm.push(this.qualificationArray.value[index]);
      this.qualificationArray.value.splice(index, 1);
    }

  }

  checkEmailorMobileExistance()
  {
    if((this.doctorForm.value.emailId == null || this.doctorForm.value.emailId == '')  && (this.doctorForm.value.mobileNo1 == null || this.doctorForm.value.mobileNo1.split('+91')[1] == ''))
    return false;
    else
    return true;
  }

  saveDoctor() {
    if(!this.validateDOBYearOfRegistrationYearOfExperience()){
      return false;
    } 
    this.submitted = true;
    this.doctorForm.controls.onlineReview.setValue(this.onlineReviewFlag);
    //Dirty implementation
    var qualificationList = this.doctorForm.get('doctorQualificationList') as FormArray;
    var specializationList = this.doctorForm.get('doctorSpecializationList') as FormArray;
    
    if(this.parentDirtyFlag && this.childDirtyFlag){
      this.doctorForm.controls.isModified.patchValue(false)
      
      
      if(qualificationList.controls.length > 0){
        for (let i = 0; i < qualificationList.controls.length; i++) {
          let qualification = qualificationList.controls[i] as FormGroup;
          if(qualification.dirty){
            qualification.controls.isModified.patchValue(true)
          }
        }
      }
      
      if(specializationList.controls.length > 0){
        for (let i = 0; i < specializationList.controls.length; i++) {
          let specialization = specializationList.controls[i] as FormGroup;
          if(specialization.dirty){
            specialization.controls.isModified.patchValue(true)
          }
        }
      }
    }
    else{
      this.doctorForm.controls.isModified.patchValue(true)
    }
    if(this.parentDirtyFlag){
      this.doctorForm.controls.isModified.patchValue(true)
    }

    if (this.isAddressArr.length > 0) {
      for (let i = 0; i < this.isAddressArr.length; i++) {
        this.isAddressArr[i] = true;
      }
    }
    if (this.doctorForm.invalid) {
      this.toastService.showI18nToast("There are some incorrect entries in the form - please check" , 'warning');
      return;
    }
    if(this.isMobile1Duplicate || this.isMobile2Duplicate || this.isMobile3Duplicate)
    {
      return;
    }


    if(!this.checkEmailorMobileExistance())
    {
      this.toastService.showI18nToast("Please enter email or mobile number" , 'warning');
      return;
    }
    // https://gitlab.com/sbis-poc/app/-/issues/2482
    // if(!this.othermobilevalidation()){
    //   this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
    //   return;
    // }
    // end of https://gitlab.com/sbis-poc/app/-/issues/2482
    
    if (this.isDuplicateSpecialization.length > 0) {
      for (let a = 0; a < this.isDuplicateSpecialization.length; a++) {
        if (this.isDuplicateSpecialization[a])
          return
      }
    }
    if (this.isDuplicateQualification.length > 0) {
      for (let a = 0; a < this.isDuplicateQualification.length; a++) {
        if (this.isDuplicateQualification[a])
          return
      }
    }

    var specializationList = this.doctorForm.get('doctorSpecializationList') as FormArray;
    for (let qualCount = specializationList.controls.length - 1; qualCount >= 0; qualCount--) {
      if ((specializationList.value[qualCount].specializationPk === "" ||
       specializationList.value[qualCount].specializationPk === null) &&
       (specializationList.value[qualCount].subSpecializationPk === "" ||
       specializationList.value[qualCount].subSpecializationPk === null))
       {
        specializationList.controls.splice(qualCount, 1);
        specializationList.value.splice(qualCount, 1);
       }      
    }

    var qualificationList = this.doctorForm.get('doctorQualificationList') as FormArray;
    for (let qualCount = qualificationList.controls.length - 1; qualCount >= 0; qualCount--) {
      if (qualificationList.value[qualCount].qualificationPk === "" ||
        qualificationList.value[qualCount].qualificationPk === null){
          qualificationList.controls.splice(qualCount, 1);
          qualificationList.value.splice(qualCount, 1);
        }
    }
    this.assignCLXForQualification();
    this.assignCLXForSpecialization();

    this.checkEmailValidate(this.doctorForm.value.emailId);

    let user = JSON.parse(localStorage.getItem('user'));
    this.doctorForm.value.msUserPk = user.userId;
  }

  assignCLXForQualification()
  {
    var qualificationList = this.doctorForm.get('doctorQualificationList') as FormArray;
    let value = qualificationList.value;
    for(let i=0; i<this.deleteQualificationForm.length; i++)
    {
      let existingPk = false;
      for(let j=0; j < value.length; j++) {
        var deleteQual: any = this.deleteQualificationForm[i];
        if(value[j].doctorQualificationPk != '' && value[j].doctorQualificationPk == deleteQual.doctorQualificationPk)
        {
          existingPk = true;
          break;
        }
      }
      if (!existingPk) {
        qualificationList.value.push(this.deleteQualificationForm[i]);
      }
    }
  }

  assignCLXForSpecialization()
  {
    var specializationList = this.doctorForm.get('doctorSpecializationList') as FormArray;
    let value = specializationList.value;
    for(let i=0; i<this.deleteSpecializationForm.length; i++)
    {
      let existingPk = false;
      for(let j=0; j < value.length; j++) {
        var deleteQual: any = this.deleteSpecializationForm[i];
        if(value[j].doctorSpecializationPk != '' && value[j].doctorSpecializationPk == deleteQual.doctorSpecializationPk)
        {
          existingPk = true;
          break;
        }
      }
      if (!existingPk) {
        specializationList.value.push(this.deleteSpecializationForm[i]);
      }
      
    }
  }

  handleResponse(res): ServerResponse {
    const data = res;
    if (data.error) {
    } else {
      return data;
    }
  }

  isEmailExist(event) {
    let emailId = event.target.value;
    this.checkEmailValidateOnBlur(emailId);
  }

  landLineCheck(value) {
    if (value ! = null && value !='' && value.keyCode != 8 && !this.landLineFormatValidation.test(value)) {
      this.toastService.showI18nToast("Please enter a valid Land Line No" , 'warning')
    }
  }

  checkEmailValidateOnBlur(emailId) {
    if (emailId === '') {
      return;
    }
    if (emailId.keyCode != 8 && !this.email.test(emailId)) {
      this.toastService.showI18nToast("Please enter a valid email id" , 'warning')
      return;
    }
    if ( this.doctorForm.controls.emailId.pristine == false) {
      let val1: any;
      if (this.existEmailId == this.doctorForm.value.emailId) {
        return;
      }
      this._doctorService.GetEmail(emailId).subscribe(
        (res) => {
          let response: any = res;
          this.ifEmailExist = response.status;

          val1 = response.status;
          if (this.ifEmailExist == 2000) {
            this.isValidEmail = 'false';
            this.submitted = false;
            return;
          }
          else {
            this.isValidEmail = 'true';
          }
        },
        (error) => {
          this.toastService.showI18nToast("Email already exist" , 'error')
          this.submitted = false;
          return;
        }

      )

    }
  }
  
  othermobilevalidation(){

    if((this.doctorForm.value.mobileNo2.length>3 && this.doctorForm.value.mobileNo2.length!=13) ||  (this.doctorForm.value.mobileNo3.length>3 && this.doctorForm.value.mobileNo3.length!=13))
         return false;
      else
      return true;
    }
  checkEmailValidate(emailId) {

    if ((emailId != null && emailId != ''))
      if (emailId.keyCode != 8 && !this.email.test(emailId)) {
        this.toastService.showI18nToast("Please enter a valid email id" , 'warning')
        return;
      }
    if ((emailId != null && emailId != '')) {
      if (this.existEmailId != this.doctorForm.value.emailId && this.doctorForm.controls.emailId.pristine == false) 
      {
        let val1: any;
        this._doctorService.GetEmail(emailId).subscribe(
          (res) => {
            let response: any = res;
            this.ifEmailExist = response.status;

            val1 = response.status;
            if (this.ifEmailExist == 2000) {
              this.isValidEmail = 'false';
              this.submitted = false;
              return;
            }
            else {
              this.isValidEmail = 'true';
              if (this.doctorForm.value.mobileNo1 != null)
                this.isMobileNoExistOnSave(this.doctorForm.value.mobileNo1);

            }
          },
          (error) => {
            this.toastService.showI18nToast("Email already exist" , 'error')
            this.submitted = false;
            return;
          }

        )
      }else{
        if (this.doctorForm.value.mobileNo1 != null)
        this.isMobileNoExistOnSave(this.doctorForm.value.mobileNo1);
      }
    }
    else {
        this.isMobileNoExistOnSave(this.doctorForm.value.mobileNo1);
    }
  }

  isMobileNoExistOnSave(MobileNo) {
    {
      let val1: any;
      if (this.existPhNo == this.doctorForm.value.mobileNo1) 
      {
        this._doctorService.saveDoctor(this.doctorForm.value).subscribe(data => {
          this.broadcastService.setProfileModificationData({"firstName" : this.doctorForm.value.doctorName});
          let user = JSON.parse(localStorage.getItem('user'));
          user.userName = this.doctorForm.value.doctorName;
          localStorage.setItem('user',JSON.stringify(user));
          this.toastService.showI18nToast("Saved Successfully" , 'success')
          
          /* Working on app/issues/782 */
          let payloadWorkflow = JSON.parse(localStorage.getItem('regw'));

          if(payloadWorkflow.registrationWorkflowCompleted == null || payloadWorkflow.registrationWorkflowCompleted){
            this.ngOnInit();
          }
          else if(payloadWorkflow.currentStepNo == payloadWorkflow.registrationWorkflowSteps.length){
            this.redirectFlag = false;
            payloadWorkflow.registrationWorkflowCompleted = true;
            this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
            localStorage.setItem('regw',JSON.stringify(payloadWorkflow));
            this.broadcastService.setHeaderText("Registration Completed");
          }
          else{
            let currentStep:any=0;
            for(let i=0;i<payloadWorkflow.registrationWorkflowSteps.length;i++){
              if(payloadWorkflow.registrationWorkflowSteps[i].sequenceNo==payloadWorkflow.currentStepNo){
                currentStep=this.workflow.registrationWorkflowSteps[i].sequenceNo
              }
            }
            if(payloadWorkflow.currentStepNo == currentStep)
                payloadWorkflow.currentStepNo++;
            //payloadWorkflow.validProfile = true;    
            this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
            localStorage.setItem('regw',JSON.stringify(payloadWorkflow));
            let route:any;
            for(let i=0;i<payloadWorkflow.registrationWorkflowSteps.length;i++){
              if(payloadWorkflow.registrationWorkflowSteps[i].sequenceNo==payloadWorkflow.currentStepNo){
                route=payloadWorkflow.registrationWorkflowSteps[i].routeUrl
              }
            }
            this.router.navigate([route]);   
            //this.router.navigate(["doctor/chamber"]);
          }
          /*End Working on app/issues/782 */
          

          this.isFormSubmitted = true;
          this.doctorForm.patchValue({ refNo: data.data.refNo });
          let qualificationList: any = this.doctorForm.get('doctorQualificationList')
          for (let i = 0; i < qualificationList.length; i++) {
            qualificationList.controls[i].patchValue({ doctorQualificationPk: data.data.doctorQualificationList[i].doctorQualificationPk })
            qualificationList.controls[i].patchValue({ createdBy: data.data.doctorQualificationList[i].createdBy })
            qualificationList.controls[i].patchValue({ createdDate: data.data.doctorQualificationList[i].createdDate })
          }

          let specializationList: any = this.doctorForm.get('doctorSpecializationList')
          for (let i = 0; i < specializationList.length; i++) {
            specializationList.controls[i].patchValue({ doctorSpecializationPk: data.data.doctorSpecializationList[i].doctorSpecializationPk })
            specializationList.controls[i].patchValue({ createdBy: data.data.doctorSpecializationList[i].createdBy })
            specializationList.controls[i].patchValue({ createdDate: data.data.doctorSpecializationList[i].createdDate })
          }
        })
        return;
      }
      else
      {
        if(MobileNo.length >3)
        {
          this._doctorService.GetPh('' + MobileNo).subscribe(res => {
            let response: any = res;
            this.isPhExist = response.status;
            val1 = response.message;
            if (this.isPhExist == 2000) {
              this.isValidMobileNo = 'false';
              this.submitted = false;
              return;
            }
            else {
              this.isValidMobileNo = 'true';
              this._doctorService.saveDoctor(this.doctorForm.value).subscribe(data => {
                this.toastService.showI18nToast("Saved Successfully" , 'success')
                location.reload();
                this.isFormSubmitted = true;
                this.doctorForm.patchValue({ refNo: data.data.refNo });
                let qualificationList: any = this.doctorForm.get('doctorQualificationList')
                for (let i = 0; i < qualificationList.length; i++) {
                  qualificationList.controls[i].patchValue({ doctorQualificationPk: data.data.doctorQualificationList[i].doctorQualificationPk })
                  qualificationList.controls[i].patchValue({ createdBy: data.data.doctorQualificationList[i].createdBy })
                  qualificationList.controls[i].patchValue({ createdDate: data.data.doctorQualificationList[i].createdDate })
                }
    
                let specializationList: any = this.doctorForm.get('doctorSpecializationList')
                for (let i = 0; i < specializationList.length; i++) {
                  specializationList.controls[i].patchValue({ doctorSpecializationPk: data.data.doctorSpecializationList[i].doctorSpecializationPk })
                  specializationList.controls[i].patchValue({ createdBy: data.data.doctorSpecializationList[i].createdBy })
                  specializationList.controls[i].patchValue({ createdDate: data.data.doctorSpecializationList[i].createdDate })
                }    
                console.log(this.doctorForm);
              })
            }
          },
          (error) => {
            this.toastService.showI18nToast("PhNo already exist" , 'error')
            this.submitted = false;
            return;
          });
        }
        else
        {
          this._doctorService.saveDoctor(this.doctorForm.value).subscribe(data => {
            this.toastService.showI18nToast("Saved Successfully" , 'success')
            location.reload();
            this.isFormSubmitted = true;
            this.doctorForm.patchValue({ refNo: data.data.refNo });
            let qualificationList: any = this.doctorForm.get('doctorQualificationList')
            for (let i = 0; i < qualificationList.length; i++) {
              qualificationList.controls[i].patchValue({ doctorQualificationPk: data.data.doctorQualificationList[i].doctorQualificationPk })
              qualificationList.controls[i].patchValue({ createdBy: data.data.doctorQualificationList[i].createdBy })
              qualificationList.controls[i].patchValue({ createdDate: data.data.doctorQualificationList[i].createdDate })
            }

            let specializationList: any = this.doctorForm.get('doctorSpecializationList')
            for (let i = 0; i < specializationList.length; i++) {
              specializationList.controls[i].patchValue({ doctorSpecializationPk: data.data.doctorSpecializationList[i].doctorSpecializationPk })
              specializationList.controls[i].patchValue({ createdBy: data.data.doctorSpecializationList[i].createdBy })
              specializationList.controls[i].patchValue({ createdDate: data.data.doctorSpecializationList[i].createdDate })
            }
            console.log(this.doctorForm);
          })
        }
      }
    }
  }

  isMobileNoExist(MobileNo) {
    if (MobileNo === '') {
      this.isValidMobileNo = 'false';
      return;
    }
    if (this.isEmailForSameUserCheck == false || this.doctorForm.controls.mobileNo1.pristine == false) {
      let val1: any;
      if (this.existPhNo == this.doctorForm.value.mobileNo1) {
        console.log("true");
        this.toastService.showI18nToast("Please enter a valid emailId" , 'warning')
        return;
      }
      this._doctorService.GetPh('' + MobileNo).subscribe(res => {
        let response: any = res;
        this.isPhExist = response.status;
        val1 = response.message;
        if (this.isPhExist == 2000) {
          this.isValidMobileNo = 'false';
          this.submitted = false;
          return;
        }
        else {
          this.isValidMobileNo = 'true';
        }
      },

        (error) => {
          this.toastService.showI18nToast("PhNo already exist" , 'error')
          this.submitted = false;
          return;
        });
    }
  }

  setDate(date) {
    let stringDate: string = "";
    if (date) {
      stringDate += date.year + "-";
      stringDate += isNumber(date.month) ? padNumber(date.month) + "-" : "";
      stringDate += isNumber(date.day) ? padNumber(date.day) : "";
    }
    return stringDate;
  }

  checkDuplicate(value) {
    if (value.mobileNo1 === value.mobileNo2 || value.mobileNo1 === value.mobileNo3 || (value.mobileNo2 != null && value.mobileNo2 === value.mobileNo3)) {
      return false;
    }

    return true;
  }

  getQualificationList() {
    this._doctorService.GetQualificationList().subscribe(data => {
      this.qualificationList = data;
    });
  }
  getSpecializationList() {
    this._doctorService.GetSpecializationList().subscribe(data => {

      this.specializationList = data;
      for(let i=0; i < this.funcallArr.length; i++){
        this.getSubSpecializationList(this.funcallArr[i]['specialization'], this.funcallArr[i]['i']);
      }
      this.funcallArr = [];
    });
  }

  getSubSpecializationList(specialization, i) {
    for (let a of this.specializationList) {
      let pk: string = a.specializationPk;
      if (specialization == (pk.toString()) && a.subSpecializationList.length > 0) {
        this.subSpecializationList = a.subSpecializationList;
        this.subSpecializationListArr[i] = this.subSpecializationList;
        return;
      }
      else if (specialization == (pk.toString()) && a.subSpecializationList.length == 0) {
        this.subSpecializationListArr.splice(i, 1);
        return;
      }
    }
  }

  isregVerified(value) {
    if (value != null && value != '')
      this.regverified = false;
    else
      this.regverified = true;
  }

  onSelect(specialization, i) {
    let pk: string = specialization;
    specialization.length >= 5 ? pk = pk.substring(4,6) : pk = pk.substring(3,4);
    this.isSecializationValid(i);
    const specializationConst: string = specialization;
    this.getSubSpecializationList(pk, i);
  }

  onSelectQualification(qualificationCode, i) {
    this.isQualificationValid(qualificationCode, i);
  }

  onSelectedValue(value) {
    this.selectedCountry = value;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  isSecializationValid(i) {
    for (let num = 0; num < this.specializationArray.controls.length; num++) {
      if (num == i) {
        continue;
      }
      if (this.specializationArray.controls[num].value.specializationPk === this.specializationArray.controls[i].value.specializationPk) {
        this.isDuplicateSpecialization[i] = true;
        return;
      }
      else {
        this.isDuplicateSpecialization[i] = false;
      }
    }
  }

  isQualificationValid(qualificationCode, i) {
    for (let num = 0; num < this.qualificationArray.controls.length; num++) {
      if (num == i) {
        continue;
      }
      if (this.qualificationArray.controls[num].value.qualificationPk === this.qualificationArray.controls[i].value.qualificationPk) {
        this.isDuplicateQualification[i] = true;
        return;
      }
      else {
        this.isDuplicateQualification[i] = false;
      }
    }
  }

  isYearValid(year, i) {
    for (let num = 0; num < this.qualificationArray.controls.length; num++) {
      if (num == i) {
        return;
      }
      if (i > 0 && year.includes(this.qualificationArray.controls[num].value.year_procured)) {
        this.isDuplicateYear[i] = true;
      }
      else {
        this.isDuplicateYear[num] = false;
      }
    }
  }

  filterBrands(event) {
    this.filteredBrands = this.options.filter(function (el) {
      var re = new RegExp(`\^${event.query}`, 'gi');
      if (re.test(el)) return el;
    })
  }

  countryLst(event) {
    this.countryList2 = this.countryList.filter(function (el) {
      var re = new RegExp(`\^${event.query}`, 'gi');
      if (re.test(el)) return el;
    })
  }

  filterCountrySingle(event) {
    let query = event.query;

    this.filteredCountriesSingle = this.filterCountry(query, this.countryList);
  }

  filterStateSingle(event) {
    let query = event.query;

    this.filteredStatesSingle = this.filterCountry(query, this.stateList);
  }

  filterCountry(query, values: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(value);
      }
    }
    return filtered;
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

  selectFile(event: any) {
    this.progress.percentage = 0;
    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("profilePhoto")["value"] = "";
      this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
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


  onChangeDob(event){
    // Changed for issue app#816
    this.doctorForm.patchValue({
      dateOfBirth : event
    });

    this.validateDOBYearOfRegistrationYearOfExperience();
    
    // if(event!=null){
    //   const bdate = new Date(event);
    //   const timeDiff = Math.abs(Date.now() - bdate.getTime() );
    //   this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    //   this.experience = this.age;
    //   if(this.age < this.doctorForm.value.yearsOfExperience){
    //     this.doctorForm.patchValue({
    //       yearsOfExperience : 0
    //     });
    //     this.expMsg = "* Exprience should less then age";
        
    //   }
    //   else{
    //     this.expMsg = "";
    //   }
    // }else{
    //   this.age=0;
    // }
  }

  // Commented out for app#816
//   expriencenceValidation(){
//     if(this.doctorForm.value.dateOfBirth!=null && this.doctorForm.value.dateOfBirth!=''){
//       if(this.age< this.doctorForm.value.yearsOfExperience){
//         this.doctorForm.patchValue({
//           yearsOfExperience : 0
//         });
//         this.expMsg = "* Exprience should less then age";
        
//       }
//       else{
//         this.expMsg = "";
//       }
//     }else{
//   }
// }

emailVerify() {
  let roleName = "DOCTOR";
  var path = roleName+ '/' + this.ms_user_id;
  this.authService.resendVerifyMail(path).subscribe((result) => {
    if (result.status === 2000) {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.VERIFICATION_SENT" , 'success');
    }
  })
}

cancelSection() {
  this.otpVerify = false;
}

mobileVerify() {
  let number = this.doctorForm.value.mobileNo1;
  console.log(number);
  let query = {
    'contactNo': number,
    'smsActionType': "OTPSEND"
  }
  this.authService.sentOTP(query).subscribe((result) => {
    if (result.status === 2000) {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_SENT" , 'success');
    }
  })
  this.otpVerify = true;
  // get controls() { return this.userProfileCtrl.controls; }
}
otpSubmit() {
  let number = this.doctorForm.value.mobileNo1;
  let otp = this.doctorForm.value.otp;
  let query = {
    "contactNo": number,
    "verificationCode": otp
  }
  if (otp != null) {
    this.authService.mobileVerification(query).subscribe((result) => {
      if (result.status === 2009) {
        this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_VERIFIED" , 'success');
        this.otpVerifySuccess = true;
        this.ngOnInit();
      } else {
        this.toastService.showI18nToast(result.message , 'error');
      }
    })
  } else {
    this.toastService.showI18nToast("USER_PROFILE_TOAST.PLEASE_ENTER_OTP" , 'warning');
  }
}
resendOtp() {
  let number =this.doctorForm.value.mobileNo1;
  let query = {
    'contactNo': number,
    'smsActionType': "OTPSEND"
  }
  this.authService.sentOTP(query).subscribe((result) => {
    this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_RESEND" , 'success');
  })
}

ifListHasChange: boolean = false;
manageValueChanges(){
  this.doctorForm.valueChanges.subscribe(formData => {
    if(!this.ifListHasChange){
      this.parentDirtyFlag = true;
    }
    this.ifListHasChange = false;
  })
  this.qualificationArray.controls.forEach(control => {
    control.valueChanges.subscribe(formData => {
    this.childDirtyFlag = true;
    this.ifListHasChange = true;
    })
  });
  this.specializationArray.controls.forEach(control => {
    control.valueChanges.subscribe(formData => {
    this.childDirtyFlag = true;
    this.ifListHasChange = true;
    })
  });
}

  editDoctor(){
    this.isEdit = true;
  }

  viewDoctor(){
    this.isEdit = false;
    this.ngOnInit();
  }

  setForCallSubSpecializationList(specialization, i) {
    this.funcallArr.push({
      "specialization" : specialization, 
      "i" : i
    });  
  }

  selectSignatureFile(event: any){

    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("signaturePhoto")["value"] = "";
      this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();

    let documentDtoList = JSON.stringify({
      "fileUploadFor": "DOCTOR",
      "doctor_RefNo":this.user.refNo
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.ngOnInit();
          this.toastService.showI18nToast("DOCTOR_PROFILE.DOCTOR_PROFILE_SIGNATURE_UPLOADED" , 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
      responseType: 'text'
    });
    return this.http.request(req);
   
  }

  // Working on app/issues/688 
  onlineReviewFlag = "N";
  toggleOnlineReview(event) {
    if (event.target.checked) {
      this.onlineReviewFlag = 'Y';
    }
    else {
      this.onlineReviewFlag = 'N'
    }
  }
  //End Working on app/issues/688 

  //Working on app/issues/816
  validateDOBYearOfRegistrationYearOfExperience() {
    // Validation between DOB and Year of Registration
    if(this.doctorForm.value.dateOfBirth && this.doctorForm.value.yearOfRegistration){          
        const bdate = new Date(this.doctorForm.value.dateOfBirth);
        if(bdate.getFullYear() > Number(this.doctorForm.value.yearOfRegistration)){
          this.toastService.showI18nToast("DOCTOR_PROFILE.YEAR_OF_REG_YEAR_OF_DOB" , 'warning');
          return false;
        }
    }

    // Validation between DOB and Year of Experience
    if(this.doctorForm.value.dateOfBirth && this.doctorForm.value.yearsOfExperience){      
      const bdate = new Date(this.doctorForm.value.dateOfBirth);
      const timeDiff = Math.abs(Date.now() - bdate.getTime() );
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      
      if(this.age < this.doctorForm.value.yearsOfExperience){        
        this.toastService.showI18nToast("DOCTOR_PROFILE.YEAR_OF_EXP_AGE" , 'warning');
        return false;
      }
    }
  
    // Validation between Year of Registration and Year of Registration
    if(this.doctorForm.value.yearOfRegistration && this.doctorForm.value.yearsOfExperience){  
      let currentYear = new Date().getFullYear();
      if(currentYear-Number(this.doctorForm.value.yearOfRegistration)< Number(this.doctorForm.value.yearsOfExperience)){
        this.toastService.showI18nToast("DOCTOR_PROFILE.YEAR_OF_REG_YEAR_OF_EXP" , 'warning');
          return false;
      }
    }
    return true;
  }
}

