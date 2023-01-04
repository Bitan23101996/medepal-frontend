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
import { FormArray, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DoctorService } from '../../doctor/doctor.service';

import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceProviderUtil } from '../service-provider.util';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { IndividualService } from '../../individual/individual.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SBISConstants } from '../../../SBISConstants';
import { JsonTranslation } from 'src/app/shared/translation';
import { GetSet } from 'src/app/core/utils/getSet';
import { ServiceProviderService } from '../service-provider.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent implements OnInit {

  addUser: any;
  countryList: any;
  countryList1: any;
  stateList: any
  countries: any[];
  filteredCountriesSingle: any[];
  addressList;
  regverified: boolean;
  newAddress;
  addUserForm: FormGroup;
  chamberForm: FormGroup;
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
  ms_user_id: any;
  dtFormat = "";
  maxDate = new Date();
  timingList: any;
  age: any;
  masterGender: any = [];
  progress = { percentage: 0, isShowUploadBtn: false };
  domSanitizer: any;
  profileImageSrc = "";
  // For chamber
  dayOfWeek: any;
  opdCategories: Object[] = []; //||---For opd category dropdown
  opdOptions: string[] = [];               //||---For opd typeahead
  filteredOpdOptions: Observable<string[]>;//||---For opd typeahead
  states: string[] = [];
  filteredStates: Observable<string[]>;
  cities: Object[] = [];
  filteredCities: Observable<string[]>;
  filteredCountries: Observable<string[]>;
  filteredStateSingle: any[];
  filteredOPDsSingle: any[];
  autoConfirmApp: String = 'N';
  defaultDate: Date = new Date('Fri Sep 1 2009 00:00:00 GMT+0300 (EEST)');
  timingDataFromResponse: any = [];
  saveStatus = false;
  roleList: any = [];
  msUserPk: any;
  userRolePk: any;
  isExistMultiRole: boolean;
  isEdit: boolean = false;
  isReadOnlyContact = false;
  isReadOnlyEmail = false;
  timingValidationMsg = "";
  otpVerify: any = false;
  otpVerifySuccess: any = false;
  isAvgDurGrtStartEndTime = false;
  file: any;
  // Added for app#690
  appBySrlNo: String = 'N';
  feesDescriptionList: any[] =[];
  ipdFeesDescription: any[]=[];
  feesDescriptionListToFilter: any[]=[];
  feesDescriptionListToFilterForSCndDropdown: any;
  totalFees: any = 0.00;
  isFees: boolean = false;
  isIpdOPdModel: any = {
    'Y': true,
    "N": false
  };
  confirmationMsg: any = [];
  doctorDetailsResponse: any;
  isAddFees: boolean = true;
  loading: boolean = false;
  acceptonlineFlag: String = SBISConstants.YES_NO_CONST.NO_ENUM;

  constructor(private fb: FormBuilder, private jsonTranslate: JsonTranslation, private translate: TranslateService, private router: Router, private route: ActivatedRoute, private broadcastService: BroadcastService,
    private _doctorService: DoctorService, private individualService: IndividualService, private _domSanitizer: DomSanitizer, private authService: AuthService, private toastService: ToastService, private http: HttpClient, private _serviceProviderUtil: ServiceProviderUtil) {
    this.domSanitizer = _domSanitizer;
    translate.setDefaultLang('en');
    translate.use('en');   
    this.loadMasterGender();
  }
  
  ngOnInit() {
   this.loadInitialData();
  }//end of oninit

  loadPreviousProfileDetails(){    
    let ref_no = this.route.snapshot.paramMap.get('ref_no');
    // Service provider ref no - issue app#604
    let request = {
      "doctorRef": ref_no,
      "hospitalRef": this.user.serviceProviderRefNo
    };

    if (ref_no != null) {
      this._doctorService.fetchDoctorByOpdv2(request).subscribe(res => {
        this.isAddFees = false;
        if (res.opdDoctorChamber) {
          let prepayAmount = +(res.opdDoctorChamber.prepayAmount);
          res.opdDoctorChamber.prepayAmount = prepayAmount.toFixed(2);
          res.opdDoctorChamber.doctorFeesList.forEach(element => {
            element.amount = (element.amount).toFixed(2);
          });
        }
        this.addUser = this.populateForm(res);
        this.isEdit = true;
        this.ms_user_id = res.msUserPk;
        this.loadProfileImage();
        if (res.mobileNo1 != null && res.mobileNo1 != "") {
          this.isReadOnlyContact = true;
        }
        if (res.emailId != null && res.emailId != "") {
          this.isReadOnlyEmail = true;
        }
      },
        error => {
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
        });
    }else
      this.addUser = this.createForm();
    
  }//end of method

  loadMasterGender(){
    this._doctorService.getMasterDataGender({ q: 'GENDER' }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
      }
    });
  }//end of method

  //load initial data
  loadInitialData() {
    this.getQualificationList();
    this.broadcastService.setHeaderText('Doctor Profile');
    this.dtFormat = environment.DATE_FORMAT;
    this.user = JSON.parse(localStorage.getItem('user'));
    
    var year = new Date().getFullYear();
    var range = [];
    range.push(year);
    for (var i = 1; i < 100; i++) {
      range.push(year - i);
    }
    this.years = range;
    this.regverified = true;
    this.selectedCountry = 'India';
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

    this.dayOfWeek = SBISConstants.DAYS_OF_WEEK_MODEL;
    this.countries = [];
    this._doctorService.GetCountry()
      .subscribe(res => {
        for (let i = 0; i < res['data'].length; i++) {
          this.countries.push(res['data'][i].countryName);
        }
      });
  }//end of method

  onValueChange(dt: Date): void {
    this.addUserForm.value.dateOfBirth = ('0' + dt.getDate()).slice(-2) + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear();;
  }

  populateForm(res) {
    this.doctorDetailsResponse = res;
    let timingList: FormGroup[] = [];
    let dob = (res.dateOfBirth == null ? null : new Date(res.dateOfBirth));
    this.autoConfirmApp = res.opdDoctorChamber == null ? 'N' : res.opdDoctorChamber.autoConfirmAppointment;
    this.appBySrlNo = res.opdDoctorChamber == null ? 'N' : res.opdDoctorChamber.appointmentBySerialNo;
    this.acceptonlineFlag = res.opdDoctorChamber == null ? 'N' : res.opdDoctorChamber.acceptonline;
    this.addUserForm = this.fb.group({
      doctorName: [res.doctorName, Validators.required],
      dateOfBirth: [dob],
      briefresume: [res.briefresume],
      mobileNo1: [res.mobileNo1],
      mobileNo2: [res.mobileNo2],
      mobileNo3: [res.mobileNo3],
      landlineNo: [res.landlineNo],
      emailId: [res.emailId, [Validators.email]],
      registrationNo: [res.registrationNo, Validators.required],
      registrationStatus: [res.registrationStatus],
      homeVisitFlag: [res.homeVisitFlag],
      doctorSpecializationList: this.fb.array([]),
      yearsOfExperience: [res.yearsOfExperience],
      doctorQualificationList: this.fb.array([]),

      isIpdCheck: (res.isIpd == undefined) ? false : this.isIpdOPdModel[res.isIpd],
      isOpdCheck: (res.isOpd == undefined) ? false : this.isIpdOPdModel[res.isOpd],

      status: [SBISConstants.STATUS_NRM],
      refNo: [res.refNo],
      msUserPk: [res.msUserPk],
      existingrolePk: [null],
      gender: [res.gender, Validators.required],
      email_verification_status: [res.email_verification_status],
      contact_verification_status: [res.contact_verification_status],
      otp: [null],
      ipdFees: [null],
      chamberForm: this.fb.group({
        department: [res.opdDoctorChamber == null ? null : res.opdDoctorChamber.department],
        status: [SBISConstants.STATUS_NRM],
        roomNo: [res.opdDoctorChamber == null ? null : res.opdDoctorChamber.roomNo],
        doctorFeesList: this.fb.array([]),
        averageVisitDuration: [res.opdDoctorChamber == null ? null : res.opdDoctorChamber.averageVisitDuration, [Validators.required], ],
        chamberTimingList: [],
        chamberTimingWeekViewList: [],
        autoConfirmAppointment: [res.opdDoctorChamber == null ? false : res.opdDoctorChamber.autoConfirmAppointment == 'Y' ? true : false],
        appointmentBySerialNo: [res.opdDoctorChamber == null ? false : res.opdDoctorChamber.appointmentBySerialNo == 'Y' ? true : false],
        acceptonline: [res.opdDoctorChamber == null ? false : res.opdDoctorChamber.acceptonline == 'Y' ? true : false],
        prepayAmount: [res.opdDoctorChamber == null ? 0.00 : +(res.opdDoctorChamber.prepayAmount)],
        overbooking_limit: [res.opdDoctorChamber == null ? 0 : res.opdDoctorChamber.overbooking_limit],
        refNo: [res.opdDoctorChamber == null ? null : res.opdDoctorChamber.refNo],
        doctorRef: [res.refNo]
      }),
      doctorChamberList: [],
      opdCategory: '',
    });

    // console.log(res.opdDoctorChamber.doctorFeesList.filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD).length);

    if (res.opdDoctorChamber && res.opdDoctorChamber.doctorFeesList && res.opdDoctorChamber.doctorFeesList.length>0 && (res.opdDoctorChamber.doctorFeesList.filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD).length > 0)) {
      let ipdFeeArr = res.opdDoctorChamber.doctorFeesList.filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD);
      console.log(ipdFeeArr[0]);

      this.addUserForm.patchValue({
        'ipdFees': ipdFeeArr[0].amount,
        'isIpdCheck': true
      });
      this.ipdFeesPk = ipdFeeArr[0].doctorFeesPk
    }

    let feesList = [];
      if(res.opdDoctorChamber && res.opdDoctorChamber.doctorFeesList && res.opdDoctorChamber.doctorFeesList.length>0 &&  (res.opdDoctorChamber.doctorFeesList.filter(x => x.chamberType == SBISConstants.CHAMBER_TYPE.IPD).length != res.opdDoctorChamber.doctorFeesList.length)){
        if(res.opdDoctorChamber.doctorFeesList.length != 1) {
          feesList.push(res.opdDoctorChamber.doctorFeesList.filter(x => x.description == "CONSULTANCY FEES")[0]);
          feesList.push(res.opdDoctorChamber.doctorFeesList.filter(x => x.description != "CONSULTANCY FEES")[0]);
        } else {
          feesList.push(res.opdDoctorChamber.doctorFeesList[0])
        }
        res.opdDoctorChamber.doctorFeesList = feesList;
        if(feesList.length == 1)
          this.isAddFees = true;
        
      }else{
        this.addUserForm.patchValue({
          isOpdCheck: false
        });
        this.buildInitialOpdFeesForm();
      }

    let doctorFees: any;
    if (res.opdDoctorChamber) {
      let i: number = 0;
      for (let doctorFeesDetail of res.opdDoctorChamber.doctorFeesList) {
        if (doctorFeesDetail.chamberType != SBISConstants.CHAMBER_TYPE.IPD) {
          i= i+1;
          doctorFees = this.addUserForm.controls.chamberForm.get('doctorFeesList') as FormArray;
          doctorFees.push(this.createFeesUpdate(doctorFeesDetail));
          this.isAddFees = (i == 2)?  true: false;
          this.addUserForm.patchValue({
            'isOpdCheck': true
          });
        }
      }
    }

    if (res.opdDoctorChamber && (res.opdDoctorChamber.doctorFeesList.length > 0)) {
      let feesArray = this.addUserForm.controls.chamberForm.get('doctorFeesList') as FormArray;
      let fee = feesArray.value.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
      this.totalFees = fee.toFixed(2);
      this.isFees = true;
    } else {
      this.totalFees = 0.00;
      this.isFees = false;
    }

    let doctorSpecializationList: any
    for (let i = 0; i < res['doctorSpecializationList'].length; i++) {
      doctorSpecializationList = this.addUserForm.get('doctorSpecializationList') as FormArray;
      doctorSpecializationList.push(this.createSpecializationUpdate(res['doctorSpecializationList'][i]));
    }

    let doctorQualificationList: any
    for (let i = 0; i < res['doctorQualificationList'].length; i++) {
      doctorQualificationList = this.addUserForm.get('doctorQualificationList') as FormArray;
      doctorQualificationList.push(this.createqualificationUpdate(res['doctorQualificationList'][i]));
    }

    this.timingDataFromResponse = [];
    if (res.opdDoctorChamber != null &&  res.opdDoctorChamber.chamberTimingWeekViewList != null) {
      for (let i = 0; i < res.opdDoctorChamber.chamberTimingWeekViewList.length; i++) {
        let payload = {
          "mon": res.opdDoctorChamber.chamberTimingWeekViewList[i].mon,
          "tue": res.opdDoctorChamber.chamberTimingWeekViewList[i].tue,
          "wed": res.opdDoctorChamber.chamberTimingWeekViewList[i].wed,
          "thu": res.opdDoctorChamber.chamberTimingWeekViewList[i].thu,
          "fri": res.opdDoctorChamber.chamberTimingWeekViewList[i].fri,
          "sat": res.opdDoctorChamber.chamberTimingWeekViewList[i].sat,
          "sun": res.opdDoctorChamber.chamberTimingWeekViewList[i].sun,
          // "startTime": res.opdDoctorChamber.chamberTimingWeekViewList[i].startTime.substring(0,5),
          // "endTime":  res.opdDoctorChamber.chamberTimingWeekViewList[i].endTime.substring(0,5),
          "startTime": res.opdDoctorChamber.chamberTimingWeekViewList[i].startTime,
          "endTime": res.opdDoctorChamber.chamberTimingWeekViewList[i].endTime,
          "rowIndex": res.opdDoctorChamber.chamberTimingWeekViewList[i].rowIndex,
        }
        this.timingDataFromResponse.push(payload)
      }
    }
    return this.addUserForm;
  }//end of populate form method

  buildInitialOpdFeesForm(){//method to create initial opd fees Form
    this.feesArray.push(this.createFeesForPersonalChember());
    this.isAddFees = true;
  }//end of method

  createFeesUpdate(res): FormGroup {
    let OpddisplayVal: string  = this.feesDescriptionList.find(x=>x.attributeValue == res['description']).displayValue ;
    return this.fb.group({
      amount: res['amount'],
      description: res['description'],
      doctorFeesPk: res['doctorFeesPk'],
      chamberType: res['chamberType'],
      displayValue:   OpddisplayVal 
    });
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

  addTimingRow() {
    let doctorChamberList = this.addUserForm.get('doctorChamberList') as FormArray;
    let controls: any = doctorChamberList.controls
    var timingList = controls[0].controls.chamberTimingList as FormArray;
    timingList.push(this.createTiming());
  }
  createTiming(): FormGroup {
    return this.fb.group({
      chamberTimingPk: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      status: '',
      rowIndex: '',
    })
  }

  createTimingForUpdate(res, index): FormGroup {
    console.log(res);
    return this.fb.group({
      chamberTimingPk: [res['chamberTimingPk']],
      dayOfWeek: [res['dayOfWeek']],
      startTime: [res['startTime'].substring(0, 5)],
      endTime: [res['endTime'].substring(0, 5)],
      status: [res['status']],
      rowIndex: [index + 1],
    })
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCountry(value: any): string[] {
    const filterValue = value.toLowerCase();
    let selectedCoutryOnClk = this.countryList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    this.selectedCountryInClick = filterValue;
    alert(this.selectedCountryInClick);
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

  private _filterState(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.stateList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  get lControls() { return this.addUserForm.controls; }
  get specializationArray(): FormArray {
    return this.addUserForm.get('doctorSpecializationList') as FormArray;
  }
  get qualificationArray(): FormArray {
    return this.addUserForm.get('doctorQualificationList') as FormArray;
  }

  get doctorChamberList(): FormArray {
    return this.addUserForm.get('doctorChamberList') as FormArray;
  }

  get feesArray(): FormArray {
    return this.addUserForm.controls.chamberForm.get('doctorFeesList') as FormArray;
  }

  createForm() {
    let addrList: FormGroup[] = [];
    let qualificationArr: FormGroup[] = [];
    let specializationArray: FormGroup[] = [];
    let timingList: FormGroup[] = [];
    let feesArr: FormGroup[] = [];
    this.addUserForm = this.fb.group({
      briefresume: [null],
      doctorName: [null, Validators.required],
      dateOfBirth: [null],
      mobileNo1: [null],
      emailId: [null, [Validators.email]],
      registrationNo: [null, Validators.required],
      registrationStatus: [SBISConstants.YES_NO_CONST.NO_ENUM],
      homeVisitFlag: [SBISConstants.YES_NO_CONST.NO_ENUM],
      doctorSpecializationList: this.fb.array(specializationArray),
      yearsOfExperience: [null],
      doctorQualificationList: this.fb.array(qualificationArr),
      status: [SBISConstants.STATUS_NRM],
      gender: [null, Validators.required],
      refNo: [null],
      msUserPk: [null],
      rating: [null],
      numRatings: [null],
      numReviews: [null],
      existingrolePk: [null],
      doctorChamberList: [],
      email_verification_status: [null],
      contact_verification_status: [null],
      otp: [null],
      isOpdCheck: [true],
      isIpdCheck: [true],
      ipdFees: [null],
      chamberForm: this.fb.group({
        doctorFeesList: this.fb.array(feesArr),
        department: '',
        status: SBISConstants.STATUS_NRM,
        roomNo: '',
        averageVisitDuration: [null, Validators.required],
        chamberTimingList: [],
        chamberTimingWeekViewList: [],
        autoConfirmAppointment: '',
        appointmentBySerialNo: '',
        acceptonline: false,
        prepayAmount: ["0"],
        overbooking_limit: [0],
        refNo: [null]
      })
    });
    let ref_no = this.route.snapshot.paramMap.get('ref_no');
    if (ref_no == null) {
      this.feesArray.push(this.createFeesForPersonalChember());
    }
    return this.addUserForm;
  }
  createqualificationUpdate(res): FormGroup {
    return this.fb.group({
      createdBy: [res['createdBy']],
      createdDate: [res['createdDate']],
      doctorQualificationPk: [res['doctorQualificationPk']],
      qualificationCode: [res['qualificationCode']],
      yearProcured: [res['yearProcured']],
      institute: [res['institute']],
      qualificationPk: [res['qualificationPk']],
      status: res['status'],
    });
  }

  createChamberTimingListUpdate(res) {
    return this.fb.group({
      chamberTimingPk: [res['chamberTimingPk']],
      dayOfWeek: [res['dayOfWeek']],
      startTime: [res['startTime']],
      endTime: [res['endTime']],
      status: [res['status']],
      rowIndex: [res['rowIndex']],
      createdBy: res['createdBy'],
      createdDate: res['createdDate'],
      modifiedBy: res['modifiedBy'],
      modifiedDate: res['modifiedDate']
    })
  }

  createSpecializationUpdate(res): FormGroup {
    return this.fb.group({
      createdBy: [res['createdBy']],
      createdDate: [res['createdDate']],
      doctorSpecializationPk: [res['doctorSpecializationPk']],
      specialization: [res['specialization']],
      subSpecialization: [res['subSpecialization']],
      specializationPk: [res['specializationPk']],
      subSpecializationPk: [res['subSpecializationPk']],
      status: [res['status']]
    });
  }

  deleteSpecialization(index) {
    if (this.specializationArray.controls[index].get('specializationPk').value != "") {
      if (confirm('Are you sure to remove Specialization?')) {
        if (this.specializationArray.controls[index].get('specializationPk').value === "") {
          this.specializationArray.controls.splice(index, 1);
          this.isDuplicateSpecialization.splice(index, 1);
        }
        else {
          this.specializationArray.controls[index].get('status').setValue("CXL");
          this.specializationArray.controls.splice(index, 1);
          this.isDuplicateSpecialization.splice(index, 1);
        }
        this.subSpecializationListArr.splice(index, 1);
      } else {
      }
    } else {
      this.specializationArray.controls[index].get('status').setValue("CXL");
      this.specializationArray.controls.splice(index, 1);
      this.isDuplicateSpecialization.splice(index, 1);
    }
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

  deleteFees(index) {
    let chamberForm = this.addUserForm.get("chamberForm") as FormGroup;
    let feesArray = chamberForm.get('doctorFeesList') as FormArray;
    feesArray.removeAt(index);
    //update the total fees
    if (feesArray.value.length > 0) {
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
    var specializationArray = this.addUserForm.get('doctorSpecializationList') as FormArray;
    this.specializationArray.push(this._serviceProviderUtil.createSpecialization());
    this.subSpecializationList = [];
  }

  addQualification(index) {
    for (let i = 0; i < this.isDuplicateQualification.length; i++)
      if (this.isDuplicateQualification[i]) {
        return;
      }
    var qualificationArray = this.addUserForm.get('doctorQualificationList') as FormArray;
    this.qualificationArray.push(this._serviceProviderUtil.createqualification());

  }

  addFees() {
    if (this.feesArray.value.length > 0 && this.feesArray.value[0].description != '') {
      this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue != this.feesArray.value[0].description);
      this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue == this.feesArray.value[0].description);
    }
    var feesArray = this.addUserForm.controls.chamberForm.get('doctorFeesList') as FormArray;
    this.feesArray.push(this.createFees());//this._serviceProviderUtil.createFees());
    this.isAddFees = true;
  }

  createFees(): FormGroup {
    return this.fb.group({
      description: 'OPD FEES',
      amount: '',
      doctorFeesPk: null,
      chamberType: SBISConstants.CHAMBER_TYPE.OPD,
      displayValue: this.feesDescriptionList.filter(x=>x.attributeValue == 'OPD FEES')[0].displayValue 
      // prepayAmount: ''
    });
  }

  deleteQualification(index) {

    if (this.qualificationArray.controls[index].get('qualificationPk').value != "") {
      if (confirm('Are you sure to remove Qualification?')) {
        if (this.qualificationArray.controls[index].get('qualificationPk').value === "") {
          this.qualificationArray.controls.splice(index, 1);
          this.isDuplicateQualification.splice(index, 1);
          this.isDuplicateYear.splice(index, 1);

          this.deleteQualificationValidation(index);
          this.deleteYearValidation(index);
        }
        else {
          this.isDuplicateQualification.splice(index, 1);
          this.isDuplicateYear.splice(index, 1);
          this.qualificationArray.controls[index].get('status').setValue("CXL");
          this.qualificationArray.controls.splice(index, 1);
        }
      } else {
      }
    } else {
      this.qualificationArray.controls.splice(index, 1);
      this.isDuplicateQualification.splice(index, 1);
      this.isDuplicateYear.splice(index, 1);
      this.deleteQualificationValidation(index);
      this.deleteYearValidation(index);
    }
  }

  //method to get the check or unchecked value of opd or ipd
  onChangeIpdOrOpd(event, formControlName: string) {
    this.addUserForm.patchValue({
      [formControlName]: event.target.checked
    });
  }//end of method

  saveAddUser() {
    this.submitted = true;
    if (!this.checkEmailorMobileExistance()) {
      this.toastService.showI18nToast("Please enter email or mobile number", "warning");
      return;
    }
    if (this.addUserForm.invalid && this.addUserForm.controls['isOpdCheck'].value) {
      let chamberForm = this.addUserForm.get("chamberForm") as FormGroup;
      let timingList = chamberForm.get('chamberTimingWeekViewList') as FormArray;
      if (timingList.value == null) {
        this.timingValidationMsg = "Please enter chamber timing details";
        return;
      } else
        this.timingValidationMsg = "";

      for (let i = 0; i < timingList.value.length; i++) {
        let timing = timingList.value[i];
        this.timeValidation(timing,i,chamberForm);
      }//end of for



      if (chamberForm.value.doctorFeesList.length > 0) {
        chamberForm.value.doctorFeesList.forEach(element => {
          if (element.description == "" || element.amount == "" || !element.amount) {
            this.toastService.showI18nToast("Please add fees", 'error');
            return;
          }
        });
      }
      return;
    }

    if (this.addUserForm.controls['isOpdCheck'].value) {

      if (this.addUserForm.value.chamberForm.doctorFeesList.length == 0) {
        this.toastService.showI18nToast("Please add fees", 'error');
        return;
      } else {
        if (this.addUserForm.controls['isOpdCheck'].value) {
          for (let fees of this.addUserForm.value.chamberForm.doctorFeesList) {
            if (fees.amount == "" || fees.description == "") {
              this.toastService.showI18nToast("Please fillup the fees and fees description", 'error');
              return;
            }
          }
        }
      }

      let fee = this.addUserForm.value.chamberForm.doctorFeesList.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
      if (this.addUserForm.value.chamberForm.prepayAmount > fee) {
        this.toastService.showI18nToast("Prepay amount cannot be greater than fees", "error");
        return;
      }
    }

    if (this.addUserForm.value.isIpdCheck && !this.addUserForm.value.ipdFees) {
      this.toastService.showI18nToast("Please enter your IPD fees", 'error');
      return;
    }

    for (let a = 0; a < this.qualificationArray.length; a++) {
      if (this.qualificationArray.controls[a].get('qualificationPk').value == "") {
        this.qualificationArray.controls.splice(a, 1);
        this.isDuplicateQualification.splice(a, 1);
        this.isDuplicateYear.splice(a, 1);
        this.qualificationArray.removeAt(a);
        this.deleteQualificationValidation(a);
        this.deleteYearValidation(a);
      }
    }

    for (let a = 0; a < this.specializationArray.length; a++) {
      if (this.specializationArray.controls[a].get('specializationPk').value == "") {
        this.specializationArray.controls.splice(a, 1);
        this.isDuplicateSpecialization.splice(a, 1);
        this.specializationArray.removeAt(a);
      }
    }

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

    if (this.addUserForm.value.emailId != null)
      this.isEmailExist(this.addUserForm.value.emailId);

    if (this.addUserForm.value.mobileNo1 != null)
      this.isMobileNoExist(this.addUserForm.value.mobileNo1);
    let chamber = this.addUserForm.get('chamberForm') as FormGroup;
    chamber.controls.autoConfirmAppointment.setValue(this.autoConfirmApp);
    chamber.controls.appointmentBySerialNo.setValue(this.appBySrlNo);
    chamber.controls.acceptonline.setValue(this.acceptonlineFlag);
    let doctorChamberList: any = [];
    doctorChamberList.push(this.addUserForm.value.chamberForm);
    this.addUserForm.patchValue({
      doctorChamberList: doctorChamberList
    });
    (this.addUserForm.controls['isOpdCheck'].value) ? this.saveChamber() : this.saveChamberDetails();
  }//end of method


  timeValidation(timing, i,chamberForm) {
    if (timing.startTime.indexOf("undefined") != -1 || timing.endTime.indexOf("undefined") != -1) {
      timing.startTime = (this.timingDataFromResponse[i].startTime);
      timing.endTime = (this.timingDataFromResponse[i].endTime);
    }
    //some time validation n day validation
    if (timing.mon == false && timing.tue == false && timing.wed == false && timing.thu == false && timing.fri == false && timing.sat == false && timing.sun == false) {
      this.timingValidationMsg = "Please select proper day of week";
      return;
    }else
      this.timingValidationMsg = "";
    
    if (timing.startTime == ":00" || timing.startTime == "" || timing.endTime == ":00" || timing.endTime == "") {
      this.timingValidationMsg = "Please enter start time or end time properly";
      return;
    } else 
      this.timingValidationMsg = "";
    

    let onlyStartHour = timing.startTime.substring(0, timing.startTime.indexOf(":"));
    let onlyEndHour = timing.endTime.substring(0, timing.endTime.indexOf(":"));

    if (parseInt(onlyStartHour) > parseInt(onlyEndHour)) {
      //this.timingValidationMsg = "Start time can not be greater than end time";
      this.toastService.showI18nToast("Start time can not be greater than end time", 'error');
      return;
    }

    if(chamberForm){
      this.isAvgDurGrtStartEndTime = this._doctorService.checkIfAvgVisitDurGrtStartEndTimeNGB(chamberForm.value.averageVisitDuration, timing.startTime, timing.endTime);
      if (this.isAvgDurGrtStartEndTime) 
        return;
    }
    //end of day and time validation
  }//end of method

  isEmailExist(emailId) {
    if (this.isEdit && !this.isReadOnlyEmail) {
      if (emailId === '') {
        this.isValidEmail = 'false';
        return;
      }
      let val1: any;
      this._doctorService.GetEmail('' + emailId).subscribe(
        res => {
          let response: any = res;
          this.ifEmailExist = response.status;
          val1 = response.status;
          if (this.ifEmailExist == 2000) {
            this.isValidEmail = 'true';
            this.submitted = false;
            return;
          }
          else {
            this.isValidEmail = 'false';
          }
        })
    }
  }
  isMobileNoExist(MobileNo) {
    if (this.isEdit && !this.isReadOnlyContact) {
      if (MobileNo === '') {
        this.isValidMobileNo = 'false';
        return;
      }
      if (this.addUserForm.value.refNo !== null) {
        this.isValidMobileNo = 'false';
        return;
      }
      let val1: any;
      if (MobileNo.length >= 13) {
        this._doctorService.GetPh('' + MobileNo).subscribe(res => {
          let response: any = res;
          this.isPhExist = response.status;
          val1 = response.message;
          if (this.isPhExist == 2000) {
            this.isValidMobileNo = 'true';
            this.submitted = false;
            return;
          }
          else {
            this.isValidMobileNo = 'false';
          }
        },
          error => {
            console.log(error);
            this.toastService.showI18nToast("Duplicate", "warning");
          });
      }
    }
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
      this.getSpecializationList();
    });
  }
  getSpecializationList() {
    this._doctorService.GetSpecializationList().subscribe(data => {
      this.specializationList = data;   
      this.getDescription();   
    });
  }
  getDescription() {
    this._doctorService.getMasterDataFees({ q: SBISConstants.MASTER_DATA.FEES }).subscribe(data => {
      if (data.status == 2000) {
        let ipdFees: any[] = data.data.filter(x => x.attributeValue == "IPD FEES");
        this.ipdFeesDescription = ipdFees;
        // console.log(this.ipdFeesDescription);

        this.feesDescriptionList = data.data.filter(x => x.attributeValue != "IPD FEES");
        this.feesDescriptionListToFilter = data.data.filter(x => x.attributeValue != "IPD FEES");
        this.feesDescriptionListToFilterForSCndDropdown = data.data.filter(x => x.attributeValue != "IPD FEES");
        this.loadPreviousProfileDetails();//to load previous doc details
      }
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
    specialization.length >= 5 ? pk = pk.substring(4, 6) : pk = pk.substring(3, 4);
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

  saveChamber() {
    let chamberForm = this.addUserForm.get("chamberForm") as FormGroup;
    let timingList = chamberForm.get('chamberTimingWeekViewList') as FormArray;
    if (timingList.value == null && this.addUserForm.controls['isOpdCheck'].value) {
      this.timingValidationMsg = "Please enter chamber timing details";
      return;
    }else 
      this.timingValidationMsg = "";
    
    for (let i = 0; i < timingList.value.length; i++) {
      let timing = timingList.value[i];   
      this.timeValidation(timing,i,chamberForm); 
      
    }//end of for

    if (this.addUserForm.value.fees == '') {
      this.toastService.showI18nToast("Fees cannot be empty", "warning");
      return;
    }
    if (this.addUserForm.value.averageVisitDuration == '') {
      this.toastService.showI18nToast("Average Visit Duration cannot be empty", "warning");
      return;
    }
    if (this.validateOverlappingChamberTiming() == 'false') {
      return false;
    }
    else {
      this.validateOverlappingChamberTimingAtServer();
    }
  }

  validateOverlappingChamberTiming(): string {
    var chamber = this.addUserForm.get('chamberForm') as FormGroup;
    var timingList = chamber.get("chamberTimingWeekViewList") as FormArray;
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
        if (timing.mon == true) dayOfWeekTiming.push(1); else dayOfWeekTiming.push(0);
        if (timing.tue == true) dayOfWeekTiming.push(2); else dayOfWeekTiming.push(0);
        if (timing.wed == true) dayOfWeekTiming.push(3); else dayOfWeekTiming.push(0);
        if (timing.thu == true) dayOfWeekTiming.push(4); else dayOfWeekTiming.push(0);
        if (timing.fri == true) dayOfWeekTiming.push(5); else dayOfWeekTiming.push(0);
        if (timing.sat == true) dayOfWeekTiming.push(6); else dayOfWeekTiming.push(0);
        if (timing.sun == true) dayOfWeekTiming.push(7); else dayOfWeekTiming.push(0);

        if (otherTiming.mon == true) dayOfWeekOtherTiming.push(1); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.tue == true) dayOfWeekOtherTiming.push(2); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.wed == true) dayOfWeekOtherTiming.push(3); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.thu == true) dayOfWeekOtherTiming.push(4); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.fri == true) dayOfWeekOtherTiming.push(5); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.sat == true) dayOfWeekOtherTiming.push(6); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.sun == true) dayOfWeekOtherTiming.push(7); else dayOfWeekOtherTiming.push(0);

        console.log(this.diff(dayOfWeekTiming, dayOfWeekOtherTiming));
        //Get the matched day index
        let res = this.diff(dayOfWeekTiming, dayOfWeekOtherTiming);
        let result = 0;

        //if result is 0 => no matched day
        //if result is not 0 => matched day
        for (let i = 0; i < res.length; i++) {
          if (res[i] == 0) continue;
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
              this.toastService.showI18nToast("Overlapped record found at " + this.dayOfWeek[k].day, "warning");
              return 'false';
            }
          }
        }
      }
    }
  }

  validateOverlappingChamberTimingAtServer() {
    let chamber = this.addUserForm.get('chamberForm') as FormGroup;
    this._doctorService.validateChamberTimingList2(chamber.value)
      .toPromise()
      .then(res => {
        console.log(JSON.stringify(res));
        let response: any = res;
        if (response.status == 2000) {
          this.toastService.showI18nToast(response.message, "error"); // app#1369
          return false;
        }
        else {
          this.saveChamberDetails();
        }
      });
  }

  ipdFeesPk: any = null;
  saveChamberDetails() {
    this.loading=true;
    document.body.classList.add('hide-bodyscroll');
    let requestBody: any = {};
    requestBody = this.addUserForm.value;
    if (!(this.addUserForm.controls['isOpdCheck'].value) && !(this.addUserForm.controls['isIpdCheck'].value)) {
      this.toastService.showI18nToast("Please select any Associated With", "error");
      return;
    }
    if (!this.addUserForm.controls['gender'].value) 
      return;
    
    if (!this.addUserForm.controls['isOpdCheck'].value) {
      requestBody.doctorChamberList = [];
      let objectUnder = {
        'doctorFeesList': [],
        'chamberTimingWeekViewList': [],
        'status': SBISConstants.STATUS_NRM
      }
      requestBody.doctorChamberList.push(objectUnder);
      requestBody.chamberForm = null;
    } 
    if (this.addUserForm.controls['isIpdCheck'].value) {
      if (this.doctorDetailsResponse != undefined) {
        let ipdFeeArr = this.doctorDetailsResponse.opdDoctorChamber? 
        this.doctorDetailsResponse.opdDoctorChamber.doctorFeesList.filter(x => x.description == "IPD FEES"): [];
        this.ipdFeesPk = ipdFeeArr.length != 0 ?  ipdFeeArr[0].doctorFeesPk :  null;
      }
      let query = {
        'description': 'IPD FEES',
        'amount': this.addUserForm.controls['ipdFees'].value,
        'doctorFeesPk': this.ipdFeesPk,
        'chamberType': SBISConstants.CHAMBER_TYPE.IPD
      }
      requestBody.doctorChamberList[0].doctorFeesList.push(query);
      requestBody.doctorChamberList[0]['refNo'] = this.addUserForm.controls.doctorChamberList.value[0].refNo;
      requestBody.doctorChamberList[0]['doctorRef'] = this.addUserForm.controls.doctorChamberList.value[0].doctorRef;
    }
    requestBody['isOpd'] = (this.addUserForm.controls['isOpdCheck'].value) ? SBISConstants.YES_NO_CONST.YES_ENUM : SBISConstants.YES_NO_CONST.NO_ENUM;
    requestBody['isIpd'] = (this.addUserForm.controls['isIpdCheck'].value) ? SBISConstants.YES_NO_CONST.YES_ENUM : SBISConstants.YES_NO_CONST.NO_ENUM;
    if (this.isExistMultiRole) {
      this.isExistMultiRole = false;
      this.addUserForm.patchValue({ msUserPk: this.msUserPk });
      this.addUserForm.patchValue({ existingrolePk: this.userRolePk });      
    } 
    this._doctorService.saveDoctor(requestBody).subscribe(data => {
      this.addUserForm.patchValue({ refNo: data.data.refNo });
      this.routeToConfirmationPage();
    }, (error) => {
      this.toastService.showI18nToast("Internal Server Problem", "error");
      this.submitted = false;
      return;
    });
  }//end of saveChamberDetails

  //method to route confirmation page
  routeToConfirmationPage() {
    let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.OPD_DOCTOR_ADD');
    this.confirmationMsg.push(confMsg);
    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.OPD_DOCTOR_PAGE;
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.OPD_DOCTOR_ADD;
    confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.OPD_DOCTOR_LIST;
    // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.OPD_DOCTOR_PAGE;
    GetSet.setConfirmationInfo(confirmationInfo);
    //end of confirm page info set
    this.router.navigate(['confirmation']);
  }//end of method

  countrySelect(country) {
    this.states = [];
    this._doctorService.GetStates(country + "/states")
      .subscribe(res => {
        for (let i = 0; i < res['data'].length; i++) {
          this.states.push(res['data'][i].stateName);
        }
        console.log(this.states);
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

  filterStateSingle(event) {
    let query = event.query;
    this.filteredStateSingle = this.filterState(query, this.states);
  }

  filterState(query, states: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < states.length; i++) {
      let state = states[i];
      if (state.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(state);
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

  toggleEditable(event) {
    if (event.target.checked) {
      this.autoConfirmApp = 'Y';
    }
    else {
      this.autoConfirmApp = 'N'
    }
  }
  // Added for app#690
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

  validatePrepayAmount(prepayAmount, fees) {
    let fee = fees.map(data => +(data.amount)).reduce((a, b) => Math.min(a + b));
    this.totalFees = fee.toFixed(2);
    this.totalFees > 0 ? this.isFees = true : this.isFees = false;
    if (prepayAmount !== '' && fee !== '') {
      if (parseFloat(prepayAmount) > parseFloat(fee)) {
        this.toastService.showI18nToast("Prepay amount cannot be greater than fees", "error");
      } else if (fee == 0) {
        this.toastService.showI18nToast("fees amount cannot be ZERO", "error");
        this.addUserForm.get('chamberForm').patchValue({
          fees: ""
        });
      }
    } else {
      this.addUserForm.get('chamberForm').patchValue({
        prepayAmount: "0"
      });
      this.toastService.showI18nToast("fees amount is mandatory", "error");
    }
  }

  validatePrepayAmountByFeesArr(prepayAmount, fees) {
    let fee = fees.map(data => (data.amount)).reduce((a, b) => Math.min(a + b));
    if (prepayAmount !== '' && fees !== '') {
      if (parseFloat(prepayAmount) > parseFloat(fee)) {
        this.toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.PREPAY_AMOUNT_GREATER', 'error');
        return false;
      }
    }
    return true;
  }

  getWorkScheduleData(workScheduleData) {
    let chamberTimingData: any = [];
    for (let i = 0; i < workScheduleData.length; i++) {

      let payload = {
        "mon": workScheduleData[i].mon,
        "tue": workScheduleData[i].tue,
        "wed": workScheduleData[i].wed,
        "thu": workScheduleData[i].thu,
        "fri": workScheduleData[i].fri,
        "sat": workScheduleData[i].sat,
        "sun": workScheduleData[i].sun,
        "startTime": workScheduleData[i].startTime.hour + ":" + workScheduleData[i].startTime.minute + ":00",//workScheduleData[i].startTime+":00",
        "endTime": workScheduleData[i].endTime.hour + ":" + workScheduleData[i].endTime.minute + ":00", //+":00"//workScheduleData[i].endTime+":00", //+":00"
        "rowIndex": workScheduleData[i].rowIndex,
      }
      chamberTimingData.push(payload)
    }

    let chamberForm = this.addUserForm.get("chamberForm") as FormGroup;
    chamberForm.patchValue({
      chamberTimingWeekViewList: chamberTimingData
    });
  }

  checkDuplicateEmail(value, index) {
    if (!this.isReadOnlyEmail && !this.isEdit) {
      let query = {
        'eaddress': this.addUserForm.value.emailId,
        'roleName': "DOCTOR",
        'entityName': "DOCTOR",
      }

      this.authService.checkUsername(query).subscribe((result) => {
        console.log("emailcheck_multirole", result);
        if (result.data.eaddressAvailableCode == 2102) {
          //success
        } else if (result.data.eaddressAvailableCode == 2101) {
          this.toastService.showI18nToast("Doctor with the provided email is already registered with MEDePAL.", "warning");
          this._doctorService.getDoctorProfileByMsUserPk(result.data.msUserPk).subscribe(res => {
            // Service provider ref no - issue app#604
            let request = {
              "doctorRef": res.data,
              "hospitalRef": this.user.serviceProviderRefNo
            };
            this._doctorService.fetchDoctorByOpdv2(request).subscribe(res => {
              this.populateForm(res);
              this.isEdit = true;
              this.ms_user_id = res.msUserPk;
              if (res.mobileNo1 != null && res.mobileNo1 != "") {
                this.isReadOnlyContact = true;
              }
              if (res.emailId != null && res.emailId != "") {
                this.isReadOnlyEmail = true;
              }
            }, (error) => {
              this.submitted = false;
              this.toastService.showI18nToast("Internal Server Problem", "error");
              this.submitted = false;
              return;
            });
          }, (error) => {
            this.submitted = false;
            this.toastService.showI18nToast("Internal Server Problem", "error");
            this.submitted = false;
            return;
          });
        } else if (result.data.eaddressAvailableCode == 2103) {
          this.roleList.length = 0;
          this.msUserPk = result.data.msUserPk;
          let list = result.data.eAddressDetails;
          this.isExistMultiRole = true;
          let role1;
          for (let role of list) {
            this.userRolePk = role.rolePk;
            role['userName'] = this.addUserForm.value.emailId;
            role['addNewRole'] = "DOCTOR";
            this.roleList.push(role);
            role1 = role.roleName;
          }
        }
      }, (error) => {
        this.submitted = false;
        this.toastService.showI18nToast("Internal Server Problem", "error");
        this.submitted = false;
        return;
      });
    }
  }

  checkContactNumber(query1) {
    if (!this.isReadOnlyContact && !this.isEdit) {
      if (this.addUserForm.value.mobileNo1.length > 12) {
        let query = {
          'eaddress': this.addUserForm.value.mobileNo1,
          'roleName': "DOCTOR",
          'entityName': "DOCTOR",
        }
        this.authService.checkContactno(query).subscribe((result) => {
          console.log(result);
          if (result.data.eaddressAvailableCode == 2102) {
            this.addUserForm.patchValue({
              'msUserPk': null
            });
          } else if (result.data.eaddressAvailableCode == 2101) {
            this._doctorService.getDoctorProfileByMsUserPk(result.data.msUserPk).subscribe(res => {
              this.toastService.showI18nToast("Doctor with the provided number is already registered with MEDePAL.", "warning");
              // Service provider ref no - issue app#604
              let request = {
                "doctorRef": res.data,
                "hospitalRef": this.user.serviceProviderRefNo
              };
              this._doctorService.fetchDoctorByOpdv2(request).subscribe(res => {
                this.addUser = this.populateForm(res);
                this.isEdit = true;
                this.ms_user_id = res.msUserPk;
                this.addUserForm.patchValue({
                  'msUserPk': result.data.msUserPk
                });
                if (res.mobileNo1 != null && res.mobileNo1 != "") {
                  this.isReadOnlyContact = true;
                }
                if (res.emailId != null && res.emailId != "") {
                  this.isReadOnlyEmail = true;
                }
              }, (error) => {
                this.submitted = false;
                this.toastService.showI18nToast("Internal Server Problem", "error");
                this.submitted = false;
                return;
              });
            }, (error) => {
              this.submitted = false;
              this.toastService.showI18nToast("Internal Server Problem", "error");
              this.submitted = false;
              return;
            });
          } else if (result.data.eaddressAvailableCode == 2103) {
            this.roleList.length = 0;
            this.msUserPk = result.data.msUserPk;
            this.addUserForm.patchValue({
              'msUserPk': result.data.msUserPk
            });
            let list = result.data.eAddressDetails;
            let role1;
            this.isExistMultiRole = true;
            console.log(this.addUserForm.value);
            
            for (let role of list) {
              this.userRolePk = role.rolePk;
              role['userName'] = this.addUserForm.value.mobileNo1;
              role['addNewRole'] = "DOCTOR";
              this.roleList.push(role);
              role1 = role.roleName;
            }
            this.toastService.showI18nToast(result.data.message + " " + role1, "warning");
          }
        }, (error) => {
          this.submitted = false;
          this.toastService.showI18nToast("Internal Server Problem", "error");
          this.submitted = false;
          return;
        });
      }
    }
  }

  expriencenceValidation() {
    if (this.addUserForm.value.dateOfBirth != null) {
      if (event != null) {
        const bdate = new Date(this.addUserForm.value.dateOfBirth);
        const timeDiff = Math.abs(Date.now() - bdate.getTime());
        this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      } else {
        this.age = 1;
        this.addUserForm.patchValue({ yearsOfExperience: 0 });
      }
      console.log("age", this.age);
      if (this.age - 1 < this.addUserForm.value.yearsOfExperience) {
        this.addUserForm.patchValue({
          yearsOfExperience: 0
        });
      }
    }
  }

  diff(arr1, arr2) {
    var ret = [];
    for (var i in arr1) {
      if (arr2.indexOf(arr1[i]) > -1) {
        ret.push(arr1[i]);
      }
    }
    return ret;
  }

  checkEmailorMobileExistance() {
    if (this.addUserForm.value.mobileNo1 == "+91") {
      this.addUserForm.patchValue({
        mobileNo1: ''
      });
    }
    if ((this.addUserForm.value.emailId == null || this.addUserForm.value.emailId == '') && (this.addUserForm.value.mobileNo1 == null || this.addUserForm.value.mobileNo1 == ''))
      return false;
    else
      return true;
  }
  emailVerify() {
    let roleName = localStorage.getItem('roleName');
    var path = roleName + '/' + this.ms_user_id;
    this.authService.resendVerifyMail(path).subscribe((result) => {
      if (result.status === 2000) {
        this.toastService.showI18nToast("USER_PROFILE_TOAST.VERIFICATION_SENT", 'success');
      }
    })
  }

  mobileVerify() {
    let number = this.addUserForm.value.mobileNo1;
    let query = {
      'contactNo': number,
      'smsActionType': "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      if (result.status === 2000) {
        this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_SENT", 'success');
      }
    })
    this.otpVerify = true;
  }

  cancelSection() {
    this.otpVerify = false;
  }
  otpSubmit() {
    let number = this.addUserForm.value.mobileNo1;
    let otp = this.addUserForm.value.otp;
    let query = {
      "contactNo": number,
      "verificationCode": otp
    }
    if (otp != null) {
      this.authService.mobileVerification(query).subscribe((result) => {
        if (result.status === 2009) {
          this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_VERIFIED", 'success');
          this.otpVerifySuccess = true;
        } else {
          this.toastService.showI18nToast(result.message, 'error');
        }
      })
    } else {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.PLEASE_ENTER_OTP", 'warning');
    }
  }
  resendOtp() {
    let number = this.addUserForm.value.mobileNo1;
    let query = {
      'contactNo': number,
      'smsActionType': "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_RESEND", 'success');
    })
  }

  validateFee(fee) {
    if (fee == 0) {
      this.toastService.showI18nToast("fees amount cannot be ZERO", "error");
      this.addUserForm.get('chamberForm').patchValue({
        fees: ""
      });
    }
  }

  cancel() {
    this.router.navigate(['opd/opdDoctorList']);
  }


  loadProfileImage() {

    this.individualService.downloadProfilePhoto(this.ms_user_id).subscribe(result => {
      if (result.status === 2000 && result.data != null && result.data.length > 0) {
        this.profileImageSrc = "data:image/jpeg;base64," + result.data;

      }
      this.progress.percentage = 0;
    })
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
    formdata.append('userId', this.ms_user_id);
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

  /*descriptionValueSelect(index) {
    let otherIndex;
    index == 0 ? otherIndex = 1 : otherIndex = 0;
    if (this.feesArray.value[index].description == "CONSULTANCY FEES") {
      if (index == 0) {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "CONSULTANCY FEES");
        if (this.feesArray.value.length > 1) {
          this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "CONSULTANCY FEES");
        }
      } else {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "CONSULTANCY FEES");
        this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "CONSULTANCY FEES");
      }
    }
    else {
      if (index == 0) {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "OPD FEES");
        if (this.feesArray.value.length > 1) {
          this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "OPD FEES");
        }
      } else {
        this.feesDescriptionList = this.feesDescriptionListToFilter.filter(x => x.attributeValue == "OPD FEES");
        this.feesDescriptionListToFilterForSCndDropdown = this.feesDescriptionListToFilter.filter(x => x.attributeValue != "OPD FEES");
      }
    }
  } */

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    let a = event.target.value;
    let checkDecimalCount = a.split(".");
    let returnFlag: boolean = false;
    if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)) {
      return false;
    } else {
      (checkDecimalCount.length > 1) ? ((charCode == 46) ? returnFlag = false : ((checkDecimalCount[checkDecimalCount.length - 1].length > 1) ? returnFlag = false : returnFlag = true)) : returnFlag = true;
    }
    return returnFlag;
  }//end of method


}
