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

import { Component, OnInit, NgModule, TemplateRef, AfterViewInit, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from './search.service';
import { MaterializeAction } from 'angular2-materialize';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { SelectItem } from 'primeng/primeng'
import { AuthService } from './../../auth/auth.service';
import { PaymentService } from './../payment/payment.service';
import { ToastService } from './../../core/services/toast.service';
import { UtilsFactory } from './../../core/utils/factory';
import { IndividualService } from './../../modules/individual/individual.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { GetSet } from './../../core/utils/getSet';
import { BroadcastService } from './../../core/services/broadcast.service';
import * as moment from 'moment';
import { isEqual } from 'date-fns';
import { deepEqual } from 'assert';
import { SearchPipe } from 'src/app/shared/search.pipe';//for search
import { SBISConstants } from '../../../app/SBISConstants';
import { MapService } from '../../core/services/map.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @ViewChild('someVar') el: ElementRef;
  @ViewChild('userReviewsModal') userReviewsModal: TemplateRef<any>;
  @ViewChild('rating') rating: TemplateRef<any>;
  @ViewChild('bookAppoinmentModal') bookAppoinmentModal: TemplateRef<any>;
  @ViewChild('googleMapLocation') googleMapLocation: TemplateRef<any>;

  weeksDataModel: any = {//to set dayofweek
    'refineScheduleMonDay': 1,
    'refineScheduleTueDay': 2,
    'refineScheduleWedDay': 3,
    'refineScheduleThuDay': 4,
    'refineScheduleFriDay': 5,
    'refineScheduleSatDay': 6,
    'refineScheduleSunDay': 7
  };
  refineFormGroup: FormGroup;
  addressRadio: any = false;
  cityRadio: any = false;
  dateTimeDisabled: boolean = false;
  timeSlotDisabled: boolean = false;
  appointment: any;
  domSanitizer: any;
  docResult = [];
  // dayForSendValue =[{day: 'Mon', id: 1}, {day: 'Tue', id: 2} ,{day: 'Wed', id: 3} ,{day: 'Thu', id: 4},{day: 'Fri', id: 5},{day: 'Sat', id: 6},{day: 'Sun', id: 7}];
  ratings: any;
  review: any;
  reviewTitle: any;
  doctorId: any;
  editRating: any;
  ratingList = [];
  ratingReview: any;
  popAvalaibleDaysTemplateHtml = "";
  status: String = '';
  appointmentData: any = [];
  paymentMode: String = '';
  user_id: any;
  userRefNo: any;
  groupMembers: any;
  paytmRespObj: any = {};
  calenderList: any[];
  allDataFetched: boolean = false;
  show: boolean = false;
  showSearch: boolean = false;
  isAuthorize = false;
  appoinmentTypeLists = []
  appoinmentUser = {
    userType: null,
    userName: "",
    emailAddress: "",
    contactNo: "",
    firstName: "",
    lastName: "",
    searchText: "",
    existingUser: null
  }
  minDate = new Date();
  //maxDate = new Date();

  userSearchResultList = [];
  specialityList: any[];
  subSpecialityList: any[];
  qualificationList = [];
  subSpecializationMap: Map<String, Object[]> = new Map<String, Object[]>();
  locationCityList: any[];
  search = {
    isAdvanceSearch: false,
    date: null,
    fees: "",
    rating: 0,
    location: "",
    city: null,//new add for location division into city
    name: "",
    speciality: null,
    subSpeciality: "",
    qualification: "",
    day: "",
    lat: null,
    long: null,
    isAddress: false
  };
  checkSpec: any;
  specialityDropdown: any;
  searchResult = [];

  pagination = { first: 0, last: 0, rows: 12, totalRecords: 0 };
  appoinment = null;

  searchLatlongObj = {
    lat: "",
    long: "",
    city: "",
    pin: 0,
    currentLocationBoolean: false
  }

  searchAddressFlag: boolean = false;

  appSIgnUp: any = {
    userName: '',
    mobileNo: '',
    emailAddress: '',
    password: 'test1234',
    registrationProvider: 'SBIS',
    roleName: 'INDIVIDUAL'
  };
  appAppointment: any = {
    userPk: null,
    chamberPk: null,
    doctorRefNo: null,
    appointmentDate: new Date(),
    remarks: "General Check-Up",
    appointmentTime: '',
    timeTo: '',
    appointmentBy: null,
    appointmentRefNo: "APP-REF-001",
    totalFees: 0,
    status: "REQ",
    fullTime: null
  };

  appointmentId: any = null;
  showAppoinmentForMe: boolean = false;
  showAppoinmentForGroup: boolean = false;
  userGroupMembers: any[] = [];
  individualGroupMember: any;
  dateTime: Date = new Date();
  modalRef: BsModalRef;
  dateFormat;
  reviews = {
    userReviewsList: [],
    page: 1,
    doctorRefNo: 0,
    doctorName: "",
    yearsOfExperience: 0,
    doctorQualifications: [],
    doctorSpecializations: [],
    rating: 0,
    reviewNum: 0
  }
  userRatingList = [];
  user: any;
  userFavDocList: any;
  lat: any;
  long: any;
  orderMedicinePage: any = false;
  currLocationFlag: boolean = false;
  errorMsgShowFlag: boolean = false;
  refineSearchFlag: boolean = true;
  locationZoomConst: number = 0;
  user_rolePk: any;
  docResume: any;
  panelVisible = false;
  switchPop:boolean = false;
  // myAddressFlag: boolean = false;
  myAddress: boolean = false;
  popoverPosition: string;
  loading: boolean = false;
  loadingForCard: boolean = false;
  isOnlineConsultationBoolean: boolean = false;
  pageHeaderObj: any;
  filterOutsideClick: boolean = false;
  refinePanelPreboolean: boolean = false;

  constructor(
    private router: Router,
    private mapService: MapService,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private modalService: ModalService,
    private authService: AuthService,
    private PaymentService: PaymentService,
    private rd: Renderer2,
    private broadcastService: BroadcastService,
    private toastService: ToastService,
    private _individualService: IndividualService,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private _domSanitizer: DomSanitizer,
  ) {
    this.domSanitizer = _domSanitizer;
    //this.minDate.setDate(this.minDate.getDate() - 1);
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    this.dateFormat = environment.DATE_FORMAT;
    this.buildForm();//to build form
    this.getUserLocation();//to get user current lat long
    this.locationZoomConst = SBISConstants.SEARCH_CONST.LOCATION_ZOOM_NUMBER_CONST;
  }//end of constructor


  ngOnInit() {
    this.loadinitialData();
    this.loading = false;
    if(GetSet.getDoctorSearchDetails()) {
      this.search = GetSet.getDoctorSearchDetails();
      this.getResult();
      GetSet.setDoctorSearchDetails(null);
      if(GetSet.getSearchPagelogoName()){
        this.pageHeaderObj= GetSet.getSearchPagelogoName();
        GetSet.setSearchPagelogoName(null);
      }
    }
  }//end of oninit

  ngAfterViewInit() {
    //this.modalService.open('payment-method-popup');
  }//end of afterviewinit
  //new add to get lat long

  //method to load initial data
  loadinitialData() {
    this.getCityListForDoctorSearch();//to get all city list
    this.appoinmentTypeLists = this.getAppointmentTypeList();
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user_id = user.id;
      this.userRefNo = user.refNo;
      this.user_rolePk = user.rolePk
    }
    this.dateTime.setDate(this.dateTime.getDate());
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.isAuthorize = true;
      this._individualService.getFavDoctorForUser(this.user.refNo).subscribe(data => {
        this.userFavDocList = data.data;
      })
    } else {
      this.isAuthorize = false;
    }

    this.searchService.getSpecialization().subscribe(data => {
      this.specialityList = [];
      data.forEach((speciality) => {
        this.specialityList.push({ label: speciality.specialization, value: speciality.specialization });
        this.subSpecializationMap.set(speciality.specialization, speciality.subSpecializationList.map(a => a.subSpecialization));
      });
    })

    this.searchService.getQualification().subscribe(data => {
      if (data) {
        data.forEach(item => {
          this.qualificationList.push({ id: item.qualificationPk, label: item.qualification });
        });
      }
    })
    this.loadRatingData();
    this.user_id ? this.getuserAddressbyUserId() : null;
    this.setformcontrolValue();//to set refine fees control value initially    
  }//end of method

  //method to get city list for doctor search
  getCityListForDoctorSearch() {
    this.locationCityList = [];
    this.searchService.fetchCityListForDoctorSearch().subscribe(response => {
      if(response.status == 2000) {
        response.data.forEach((el, index) => {
          this.locationCityList.push({ label: el, value: el });//(index+1)
        });
      } 
    });
  }//end of method
  //method to get current address by onclick
  getCurrentAddressBySpanClick() {
    if(this.isOnline) {
      return;
    }
    this.currLocationFlag = true;//set current location var to true
    this.search.location = GetSet.getCurrentAddress().formatted_address;
    this.searchAddressFlag = true;
    this.searchLatlongObj.currentLocationBoolean = true;
    // this.myAddressFlag = false;
    this.myAddress = false;
  }//end of method  

  getUserLocation() {
    // /// locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        this.setLatLong(long, lat);
      });
    }
  }//end of method

  setLatLong(long, lat) {
    this.long = long;
    this.lat = lat;
    this.mapService.getAddressByLatLong(lat, long);
  }//end of new add to get lat long



  //end of new add to get curr formated address

  //method to build form
  buildForm() {
    let refineFormobj: any = {};
    refineFormobj['refineDoctorName'] = new FormControl();
    refineFormobj['refineSpecialisation'] = new FormControl();
    refineFormobj['refineScheduleMonDay'] = new FormControl(false);
    refineFormobj['refineScheduleTueDay'] = new FormControl(false);
    refineFormobj['refineScheduleWedDay'] = new FormControl(false);
    refineFormobj['refineScheduleThuDay'] = new FormControl(false);
    refineFormobj['refineScheduleFriDay'] = new FormControl(false);
    refineFormobj['refineScheduleSatDay'] = new FormControl(false);
    refineFormobj['refineScheduleSunDay'] = new FormControl(false);
    refineFormobj['refineFees'] = new FormControl();
    refineFormobj['refineAvailabilityToday'] = new FormControl(false);
    refineFormobj['refineAvailabilityTomorrow'] = new FormControl(false);
    refineFormobj['refineAvailabilityDayAfterTomorrow'] = new FormControl(false);
    refineFormobj['refineAvailabilityMorning'] = new FormControl(false);
    refineFormobj['refineAvailabilityAfternoon'] = new FormControl(false);
    refineFormobj['refineAvailabilityEvening'] = new FormControl(false);
    refineFormobj['refineAvailabilityNight'] = new FormControl(false);
    refineFormobj['refineByMale'] = new FormControl(false);
    refineFormobj['refineByFemale'] = new FormControl(false);
    // Working on app/issues/595
    refineFormobj['refineHomeVisitYes'] = new FormControl(false);
    refineFormobj['refineHomeVisitNo'] = new FormControl(false);
    //End Working on app/issues/595
    this.refineFormGroup = new FormGroup(refineFormobj);
  }//end of method

  //method to get user address 
  userAddresses: any[] = [];
  userAddressesDisplayArr: any[] = [];
  getuserAddressbyUserId() {
    this._individualService.getUserFullProfile(this.userRefNo).subscribe((result) => {
      if (result.status === 2000) {
        this.userAddresses = result.data.addressList;
        this.userAddressesDisplayArr = result.data.addressList;
      }
    });
  }//end of method to get user address by user id
  // noaddressFoundFlag: boolean = false;
  onkeyPresslocationSearch() {//method to near search
    let userAddressDisplayArrLocal: any = [];
    // app#1062 - correction in setting of 'searchAddressFlag' and 'currentLocationBoolean' flags
    // this.search.location ? this.searchAddressFlag = false : this.searchAddressFlag = true;
    this.searchAddressFlag = false;
    this.searchLatlongObj.currentLocationBoolean = false;
    // End app#1062
    this.myAddress = true;
    if (this.userAddresses.length > 0) {
      // this.myAddressFlag = true;
      // userAddressDisplayArrLocal = this.userAddresses.filter(el=>el.toString().contains(this.search.location));
      if (this.search.location) {
        this.userAddresses.forEach((element) => {
          if (element.addressType.match(new RegExp(this.search.location, "i")) || element.line1.match(new RegExp(this.search.location, "i")) || element.city.match(new RegExp(this.search.location, "i")) || element.pinCode.match(new RegExp(this.search.location, "i"))) {
            userAddressDisplayArrLocal.push(element);
          }
        });
        this.userAddressesDisplayArr = userAddressDisplayArrLocal;
      } else {
        this.userAddressesDisplayArr = this.userAddresses;
      }
      // userAddressDisplayArrLocal.length > 0 ? this.noaddressFoundFlag = false: this.noaddressFoundFlag = true;
      // }else{
      // this.noaddressFoundFlag = false;
    }
  }//end of method

  //method to set a control value
  setformcontrolValue() {
    this.refineFormGroup.controls['refineFees'].setValue("5000");
  }//end of method

  userReviews(doctor) {
    this.reviews.page = 1;
    this.reviews.userReviewsList = [];
    this.reviews.doctorRefNo = doctor.doctorRefNo;//doctorRefNo;
    // this.reviews.doctorPk =
    this.reviews.userReviewsList = [];
    this.reviews.doctorName = doctor.doctorName;
    this.reviews.yearsOfExperience = doctor.yearsOfExperience;
    this.reviews.rating = doctor.rating;
    this.reviews.doctorQualifications = doctor.doctorQualifications;
    this.reviews.doctorSpecializations = doctor.doctorSpecializations;
    this.reviews.reviewNum = doctor.numReviews;

    this.reviews["qualifications"] = this.reviews.doctorQualifications;
    this.reviews["speciality"] = this.reviews.doctorSpecializations;

    this.loadReviews();
    this.modalRef = this.bsModalService.show(this.userReviewsModal, { class: 'modal-lg' });
  }//end of method

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }//end of method

  loadReviews() {
    this.searchService.getUserReviews(this.reviews.doctorRefNo, this.reviews.page).subscribe(result => {
      if (result.status == 2000) {
        if (result.data.length == 0) {
          this.toastService.showI18nToast("No Record Found", 'error');
        }
        result.data.forEach(item => {
          item["date"] = moment(new Date(item.ratingDate)).format("YYYY-MM-DD");
          item["time"] = this.formatAMPM(new Date(item.ratingDate));
          this.reviews.userReviewsList.push(item);
        });
      }
    })
  }//end of method

  moreReviews() {
    this.reviews.page = this.reviews.page + 1;
    this.loadReviews();
  }

  getAppointmentTypeList() {
    return [
      { id: "1", label: "For me" },
      { id: "2", label: "For my group user" },
      { id: "3", label: "Person Known to me" }
    ];
  }//end of method

  onClosePopUp(pupUpId: string) {
    this.modalService.close(pupUpId);
  }

  getDayByNo(noOfDay) {
    return UtilsFactory.getDayByNumber(noOfDay);
  }

  carouselActions = new EventEmitter<string | MaterializeAction>();

  // prev(){
  //   this.carouselActions.emit({action:"carousel",params:['prev']});
  // }

  // next(){
  //   this.carouselActions.emit({action:"carousel",params:['next']});
  // }
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 && day !== 3;
  }
  queryString = '';
  loadProfileImage() {
    for (let doctor of this.searchResult) {
      doctor["profileImageSrc"] = "";

      // if (!doctor.msUserPk) continue;
      let path: string = doctor.doctorRefNo + "/" + "DOCTOR";

      this.searchService.downloadProfilePhotoForDoctor(path).subscribe(result => {
        if (result.status === 2000 && result.data != null && result.data.length > 0) {
          doctor["profileImageSrc"] = "data:image/jpeg;base64," + result.data;
        }
      })
    }
  }

  sortByisFvorite() {
    let fvoriteList = this.searchResult.filter(x => x["isFvorite"]);
    this.searchResult.forEach(item => {
      if (fvoriteList.filter(x => x["doctorRefNo"] == item["doctorRefNo"]).length == 0) {
        fvoriteList.push(item);
      }
    });
    this.searchResult = fvoriteList;
  }

  //doc filtered result function 
  refineSearchResult() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    let touchedValidCtrlArr = [];
    for (let control in this.refineFormGroup.controls) {
      if (this.refineFormGroup.controls[control].touched && this.refineFormGroup.controls[control].value) {
        touchedValidCtrlArr.push(control);
      }//end of if
    }//end of for
    let scheduleDays: string[] = [];//touchedValidCtrlArr.filter(schDayel => schDayel == this.weeksDataModel[schDayel]);//should be changed
    touchedValidCtrlArr.forEach(schDayel => { this.weeksDataModel[schDayel] ? scheduleDays.push(this.weeksDataModel[schDayel]) : null; });
    let refinedDoctorsResult = [];
    this.docResult.forEach(doc => { refinedDoctorsResult.push(doc); });//push all doctor to refinedDoctorsResult array

    if (this.refineFormGroup.controls['refineDoctorName'].value) {//doc name check
      let refineDocName = this.refineFormGroup.controls['refineDoctorName'].value;
      let searhResultByDocName = refinedDoctorsResult.filter(x => x['doctorName'].match(new RegExp(refineDocName, "i")));
      refinedDoctorsResult = searhResultByDocName;
    }//end of if check doc name

    if(this.refineFormGroup.controls['refineByMale'].value && this.refineFormGroup.controls['refineByFemale'].value) {
      let searhResultByDocMaleFemale = refinedDoctorsResult.filter(x => {return x['gender'] == "M" || x['gender'] == "F"}); //x['gender'] == "M"
      refinedDoctorsResult = searhResultByDocMaleFemale;
    }

    if (this.refineFormGroup.controls['refineByMale'].value && !this.refineFormGroup.controls['refineByFemale'].value) {//doc name check
      //let refineDocMale = this.refineFormGroup.controls['refineByMale'].value;
      let searhResultByDocMale = refinedDoctorsResult.filter(x => x['gender'] == "M");
      refinedDoctorsResult = searhResultByDocMale;
    }//end of if check doc name

    if (this.refineFormGroup.controls['refineByFemale'].value && !this.refineFormGroup.controls['refineByMale'].value) {//doc name check
      //let refineDocName = this.refineFormGroup.controls['refineByFemale'].value;
      let searhResultByDocFemale = refinedDoctorsResult.filter(x => x['gender'] == "F");
      refinedDoctorsResult = searhResultByDocFemale;
    }//end of if check doc name

    // Working on app/issues/595
    if (this.refineFormGroup.controls['refineHomeVisitYes'].value && this.refineFormGroup.controls['refineHomeVisitNo'].value) {
      let refineHomeVisitYes = refinedDoctorsResult.filter(x => {return x['homeVisitFlag'] == "Y" || x['homeVisitFlag'] == "N"});
      refinedDoctorsResult = refineHomeVisitYes;
    }

    if (this.refineFormGroup.controls['refineHomeVisitYes'].value && !this.refineFormGroup.controls['refineHomeVisitNo'].value) {
      let refineHomeVisitYes = refinedDoctorsResult.filter(x => x['homeVisitFlag'] == "Y");
      refinedDoctorsResult = refineHomeVisitYes;
    }

    if (this.refineFormGroup.controls['refineHomeVisitNo'].value && !this.refineFormGroup.controls['refineHomeVisitYes'].value) {
      let refineHomeVisitNo = refinedDoctorsResult.filter(x => x['homeVisitFlag'] == "N");
      refinedDoctorsResult = refineHomeVisitNo;
    }
    //End Working on app/issues/595

    if (this.refineFormGroup.controls['refineSpecialisation'].value && (refinedDoctorsResult.length > 0)) {//specialisation check
      let specialisation = this.refineFormGroup.controls['refineSpecialisation'].value;
      let searhResultBySpecialization = refinedDoctorsResult.filter(doctor => {
        if(doctor.doctorSpecializations != null) {
          return doctor.doctorSpecializations.toUpperCase().match(specialisation.toUpperCase());
        }
        //return doctor.doctorSpecializations.find(doctorSpecialization => doctorSpecialization.specialization.match(new RegExp(specialisation, "i")));
        // return doctor.doctorSpecializations.includes(specialisation);
      });
      refinedDoctorsResult = searhResultBySpecialization;
    }//end of if check

    if ((scheduleDays.length > 0) && (refinedDoctorsResult.length > 0)) {//let colName: string = 'dayOfWeek';
      let returnArr = this.refinebyDayofWeek(refinedDoctorsResult, 'dayOfWeek', scheduleDays);
      refinedDoctorsResult = returnArr;
    }//end of if schedule days array check

    if ((this.refineFormGroup.controls['refineAvailabilityMorning'].value || this.refineFormGroup.controls['refineAvailabilityAfternoon'].value || this.refineFormGroup.controls['refineAvailabilityEvening'].value || this.refineFormGroup.controls['refineAvailabilityNight'].value) && (refinedDoctorsResult.length > 0)) {
      let morningval = this.refineFormGroup.controls['refineAvailabilityMorning'].value;
      let afternoonval = this.refineFormGroup.controls['refineAvailabilityAfternoon'].value;
      let eveningval = this.refineFormGroup.controls['refineAvailabilityEvening'].value;
      let nightval = this.refineFormGroup.controls['refineAvailabilityNight'].value;
      let searhResultByTiming;
      if(morningval) {
        searhResultByTiming = refinedDoctorsResult.filter(doctor => {
          for(let chamber of doctor.doctorChamberList) {
            for(let timing of chamber.chamberTimingList) {
              if(timing.strtTym >= 600 && timing.endTym <= 1200) {
                return doctor;
              }
            }
          }
        });
      }
      if(afternoonval) {
        searhResultByTiming = refinedDoctorsResult.filter(doctor => {
          for(let chamber of doctor.doctorChamberList) {
            for(let timing of chamber.chamberTimingList) {
              if(timing.strtTym >= 1200 && timing.endTym <= 1600) {
                return doctor;
              }
            }
          }
        });
      }
      if(eveningval) {
        searhResultByTiming = refinedDoctorsResult.filter(doctor => {
          for(let chamber of doctor.doctorChamberList) {
            for(let timing of chamber.chamberTimingList) {
              if(timing.strtTym >= 1600 && timing.endTym <= 2000) {
                return doctor;
              }
            }
          }
        });
      }
      if(nightval) {
        searhResultByTiming = refinedDoctorsResult.filter(doctor => {
          for(let chamber of doctor.doctorChamberList) {
            for(let timing of chamber.chamberTimingList) {
              if(timing.strtTym >= 2000) {
                return doctor;
              }
            }
          }
        });
      }
      refinedDoctorsResult = searhResultByTiming;
    }//end of timing check

    if (this.refineFormGroup.controls['refineFees'].value && (refinedDoctorsResult.length > 0)) {//fees check
      let selectedfees = this.refineFormGroup.controls['refineFees'].value;
      let searchResultByFees = refinedDoctorsResult.filter(doctor => {
        return doctor.doctorChamberList.find(chamberFees => chamberFees.fees <= selectedfees);
      });
      refinedDoctorsResult = searchResultByFees;
    }//end of fees check    

    if ((this.refineFormGroup.controls['refineAvailabilityToday'].value || this.refineFormGroup.controls['refineAvailabilityTomorrow'].value || this.refineFormGroup.controls['refineAvailabilityDayAfterTomorrow'].value) && (refinedDoctorsResult.length > 0)) {
      let todayval = this.refineFormGroup.controls['refineAvailabilityToday'].value;
      let tomorrowval = this.refineFormGroup.controls['refineAvailabilityTomorrow'].value;
      let dayAfterTomorrowval = this.refineFormGroup.controls['refineAvailabilityDayAfterTomorrow'].value;
      var date = new Date();
      var day = date.getDay();
      (day == 0) ? day = 7 : day;//check if its sunday then the day of week turned from 0 to 7
      let todayweekno = day;
      // let 
      let availabilityDaysArr: string[] = [];
      todayval ? availabilityDaysArr.push(todayweekno.toString()) : null;
      tomorrowval ? ((day == 7) ? availabilityDaysArr.push('1') : availabilityDaysArr.push((day + 1).toString())) : null;
      if (dayAfterTomorrowval) {
        if (day == 7) {
          availabilityDaysArr.push('2');
        } else if (day == 7) {
          availabilityDaysArr.push('1');
        } else if (day < 6) {
          availabilityDaysArr.push((day + 2).toString());
        }
      }//end of day after tomorrow check   
      let returnArr = this.refinebyDayofWeek(refinedDoctorsResult, 'dayOfWeek', availabilityDaysArr);
      refinedDoctorsResult = returnArr;
    }//end of if today or tomorrow or day after tomorrow check

    this.searchResult = refinedDoctorsResult;
    this.searchResult.length > 0 ? (this.errorMsgShowFlag = false) : (this.errorMsgShowFlag = true);
    this.refineSearchFlag = true;
    this.loading=false;
    document.body.classList.remove('hide-bodyscroll');
    this.sortByisFvorite();
  }//end of method

  //method to refine by dayofweek
  refinebyDayofWeek(refineArr: any[], colName: string, searchArr: any[]): any[] {
    let returnArr: any = [];
    let searchPipeVar = new SearchPipe();
    let refineByScheduleDaysArr: any[] = [];
    refineArr.filter((doctor, index) => {
      let scheduleDaysFlag: boolean;
      let docChamberList: any = doctor.doctorChamberList;
      //new add to test dayofweek with days array 
      let allChamberTimingListArr: any[] = [];
      docChamberList.forEach(element => {
        element.chamberTimingList.forEach(el => {
          allChamberTimingListArr.push(el.dayOfWeek);
        });
      });
      //end of new add
      let count: number = 0;
      for (let el of docChamberList) {
        if (docChamberList[count].chamberTimingList.length > 0) {
          scheduleDaysFlag =
            searchPipeVar.searchByFieldNameWithInputAnyTypeArrForDayofweek(allChamberTimingListArr, searchArr);
        }
        if (scheduleDaysFlag) {
          refineByScheduleDaysArr.push(doctor);
          break;
        }
        count++;
      }//end of for     
    });
    returnArr = refineByScheduleDaysArr;
    return returnArr;
  }//end of method
  //end of doc filtered result function


  bindSearchResult(doctorList) {
    if (doctorList.length == 0) return;
    this.searchResult = [];
    doctorList.forEach(doctor => {
      this.searchResult.push(doctor);
    });
    this.pagination.totalRecords = this.searchResult.length;
    this.pagination.first = 0;
    this.pagination.last = this.pagination.rows;
    this.sortByisFvorite();
  }//end of method

  getAboutDoctor(doctorRefNo) {
    this.searchService.getDocResume(doctorRefNo).subscribe(resp => {
      if(resp.status == 2000) {
        resp.data ? this.docResume = resp.data : this.docResume = "Not Specified";
      }
    });
  }

  // getDoctorCalender() {
  //   this.searchResult.forEach(doc => {
  //     doc["chamberDateTemp"] = [];
  //     doc.doctorChamberList.forEach((docChamber, index) => {
  //       let query = {
  //         doctorRefNo: doc.doctorRefNo,
  //         chamberPk: docChamber.chamberPk
  //       }
  //       this.searchService.getCalender(query).subscribe(result => {
  //         result.data.forEach(chamberDt => {
  //           doc["chamberDateTemp"].push(chamberDt);
  //         });
  //         if (doc.doctorChamberList.length == index + 1) {
  //           let today = moment(new Date()).format('DD-MM-YYYY');
  //           let tomorrow = moment(new Date()).add(1, 'days').format('DD-MM-YYYY');
  //           let dayAfterTomorrow = moment(new Date()).add(2, 'days').format('DD-MM-YYYY');
  //           let filtedate = doc["chamberDateTemp"].filter(x => moment(new Date(x.calendarDate)).format('DD-MM-YYYY') == tomorrow && moment(new Date(x.calendarDate)).format('DD-MM-YYYY') != today && moment(new Date(x.calendarDate)).format('DD-MM-YYYY') != dayAfterTomorrow)[0];
  //           if (filtedate) {
  //             let indx = this.searchResult.findIndex(x => x['doctorRefNo'] == doc.doctorRefNo);
  //             let indy = this.docResult.findIndex(x => x['doctorRefNo'] == doc.doctorRefNo);
  //             if (indx != -1) {
  //               this.searchResult.splice(indx, 1);
  //             }
  //             if (indy != -1) {
  //               this.docResult.splice(indy, 1);
  //             }
  //             this.pagination.totalRecords = this.searchResult.length;
  //             this.pagination.first = 0;
  //             this.pagination.last = this.pagination.rows;
  //           }

  //           delete doc["chamberDateTemp"];
  //         }
  //       })
  //     })
  //   });
  // }//end of method

  getResult() {
    console.log(this.search);
    
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    let reqJson = {
      city: this.search.city,
      mainSearchName: this.search.name,//from search top bar
      location: this.search.location,//from search top bar
      distance: 50,
      speciality: this.search.speciality ? this.search.speciality["value"] : '',//from search top bar
      date: this.search.date,//from search top bar
      fees: this.search.fees,//from search top bar
      rating: this.search.rating,//from search top bar
      subSpeciality: this.search.subSpeciality,
      qualification: this.search.qualification == "" ? "" : this.search.qualification["label"],
      day: this.search.day,
      // specialityFromRefine: this.search.specialityFromRefine,
      // nameFromeRefine: this.search.nameFromRefine
    };
    let d;
    let dtrString;
    if (this.search.date != null) {
      d = new Date(reqJson.date);
      let dayNumber = d.getDay() == 0 ? 7 : d.getDay();
      dtrString = ",daysOfWeek:" + dayNumber;
    } else {
      dtrString = ",daysOfWeek:";
    }

    let spStr = ",specialization:";
    if (this.search.speciality != null && this.search.speciality["value"]) {
      spStr = spStr + this.search.speciality["value"]
    }

    //new add to modify location field
    let queryLocation = "";
    if (this.searchAddressFlag) {
      if (!this.searchLatlongObj.currentLocationBoolean) {
        queryLocation = this.searchLatlongObj.city + "," + this.searchLatlongObj.pin;
      } else {
        queryLocation = this.lat + "~" + this.long;
      }
    }
    //susmita
    // app#1062: Correction in location setting - if both City and Near selected/typed, preference is always Near
    // let location = this.searchAddressFlag ? (this.searchAddressFlag ? queryLocation : reqJson.location) : reqJson.city;
    let location = this.searchAddressFlag ? queryLocation : (reqJson.location? reqJson.location : reqJson.city);
    if (!location) {
      location = this.search.location;
    }
    let queryStr = (this.searchLatlongObj.currentLocationBoolean ? "latlon:" : "location:") + location + ",distance:" + reqJson.distance + ",name:" + reqJson.mainSearchName + ",specialization:" + (reqJson.speciality ? reqJson.speciality : '') + ",daysOfWeek:,timeRange:";// + ",specialization:"+ this.search.speciality["value"]==null?'':this.search.speciality["value"];// + ",doctorName:" + reqJson.lastName+ ",maxFee:" + this.search.fees;
    // app#1062 start
    queryStr =queryStr+",resolveLatlon:"+(!this.searchAddressFlag && this.search.location?'Y':'N'); // resolveLatlon flag passed
    // app#1062 end

    //Online consultation flag added
    queryStr =queryStr+",onlineConsultation:"+(this.isOnline?'Y':'N');
    //End Online consultation flag added
    let query = {
      search: queryStr,
      recordsPerPage: 100,
      page: 0
    }
    
    let apiFor;
    if(this.isOnline) {
      apiFor = this.searchService.getOnlineDoctors();
    } else {
      apiFor = this.searchService.getDoctorsV5(query);
    }
    
    apiFor.subscribe(data => {
      this.docResult = [];
      if (data.data != null && data.data.length > 0) {
        // this.loadingForCard = true;
        // document.body.classList.add('hide-bodyscroll');
        this.isOnlineConsultationBoolean = this.isOnline;
        GetSet.setOnlineConsultationBoolean(this.isOnline);
        data.data.forEach(doctor => {
          if(this.isOnline) {
            doctor.onlineConsultation = 'Y';
            doctor.doctorChamberList.forEach(ele => {
              ele.chamberName = 'Online Consultation';
            });
          } else {
            doctor.onlineConsultation = 'N';
          }
          if (this.userFavDocList) {
            if (this.userFavDocList.filter(x => (x["doctorRefPk"] == doctor.doctorRefNo))[0]) {
              doctor["isFvorite"] = true
            } else {
              doctor["isFvorite"] = false;
            }
          } else {
            doctor["isFvorite"] = false;
          }
          doctor["specialization"] = [];
          this.docResult.push(doctor);
        });
        //to set additional chamber count
        data.data.forEach(doctorEl => {
          doctorEl.additionalChamberCount = (doctorEl.totalChamberCount - doctorEl.doctorChamberList.length);
        });
        for(let docDis of data.data) {
          docDis.doctorChamberList.forEach(chamber => {
            var R = 6371; // Radius of the earth in km
            var dLat = (chamber.latitude-this.search.lat)*(Math.PI/180);  // deg2rad below
            var dLon = (chamber.longitude-this.search.long)*(Math.PI/180); 
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos((this.search.lat)*(Math.PI/180)) * Math.cos((chamber.latitude)*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c; // Distance in km
            chamber['distance'] = d;
            chamber.chamberTimingList.forEach(timing => {
              timing['strtTym'] = +(timing.startTime);
              timing['endTym'] = +(timing.endTime);
            });
          });
        }
        this.bindSearchResult(data.data);
        this.loadProfileImage();
        this.refineSearchResult();
        this.sortByisFvorite();
        this.errorMsgShowFlag = false;//set false to hide error msg
        this.refineSearchFlag = true;//to show refine search panel
      } else {
        this.searchResult = [];
        this.errorMsgShowFlag = true;//set true to show error msg
        this.refineSearchFlag = false;//to hide refine search panel
      }
      this.loading=false;
      document.body.classList.remove('hide-bodyscroll');
      this.allDataFetched = true;//to hide/show rifine panel
    });
  }//end of method

  checkBoxValue(event, dayForSendValue) {
    if (event.target.checked) {
      event.target.checked
    }
  }

  searchPaginate(event) {
    this.pagination.first = event.first;
    this.pagination.last = event.first + event.rows;
  }

  onClickResetLink(selectedResetVal) {
    // Working on app/issues/595
    if(selectedResetVal == 'homeVisitFlag') {
      this.refineFormGroup.controls['refineHomeVisitYes'].reset();
      this.refineFormGroup.controls['refineHomeVisitNo'].reset();
    }
    //End Working on app/issues/595
    if (selectedResetVal == 'fees') {
      this.refineFormGroup.controls['refineFees'].reset();
      this.setformcontrolValue();//to set refine fees control value initially
    }
    if(selectedResetVal == 'gender') {
      this.refineFormGroup.controls['refineByMale'].reset();
      this.refineFormGroup.controls['refineByFemale'].reset();
    }
    if (selectedResetVal == 'scheduleDays') {
      this.refineFormGroup.controls['refineScheduleMonDay'].reset();
      this.refineFormGroup.controls['refineScheduleTueDay'].reset();
      this.refineFormGroup.controls['refineScheduleWedDay'].reset();
      this.refineFormGroup.controls['refineScheduleThuDay'].reset();
      this.refineFormGroup.controls['refineScheduleFriDay'].reset();
      this.refineFormGroup.controls['refineScheduleSatDay'].reset();
      this.refineFormGroup.controls['refineScheduleSunDay'].reset();
    }
    if(selectedResetVal == 'timing') {
      this.refineFormGroup.controls['refineAvailabilityMorning'].reset();
      this.refineFormGroup.controls['refineAvailabilityAfternoon'].reset();
      this.refineFormGroup.controls['refineAvailabilityEvening'].reset();
      this.refineFormGroup.controls['refineAvailabilityNight'].reset();
    }
    if (selectedResetVal == 'availability') {
      this.refineFormGroup.controls['refineAvailabilityToday'].reset();
      this.refineFormGroup.controls['refineAvailabilityTomorrow'].reset();
      this.refineFormGroup.controls['refineAvailabilityDayAfterTomorrow'].reset();
    }
    if (selectedResetVal == 'all') {
      let tempList = [];
      this.docResult.forEach(doc => {
        tempList.push(doc);
      });
      this.refineFormGroup.reset();
      this.setformcontrolValue();//to set refine fees control value initially
      this.bindSearchResult(tempList);
    }//end of if all reset click
  }//end of method

  getAvalableDayStatus(chamberTimingList, dayIndx) {
    if (chamberTimingList && chamberTimingList.filter(x => x['dayOfWeek'] == dayIndx).length > 0) {
      return true;
    } else {
      return false;
    }
  }//end of method

  getAvalableDayDetails(chamberTimingList, dayIndx) {
    let availableDays = chamberTimingList ? chamberTimingList.filter(x => x['dayOfWeek'] == dayIndx) : [];
    this.popAvalaibleDaysTemplateHtml = "";
    if (availableDays.length > 0) {
      availableDays.forEach(item => {
        if(item.startTime.length == 3) {
          item.startTime = '0'+item.startTime;
        }
        if(item.endTime.length == 3) {
          item.endTime = '0'+item.endTime;
        }
        if(!item.startTime.includes(':')) {
          item.startTime = item.startTime.slice(0,2) + ':' + item.startTime.slice(2,4);
        }
        if(!item.endTime.includes(':')) {
          item.endTime = item.endTime.slice(0,2) + ':' + item.endTime.slice(2,4);
        }
        this.popAvalaibleDaysTemplateHtml = this.popAvalaibleDaysTemplateHtml + `<p>` + item.startTime + `-` + item.endTime + `</p>`
      });
    } else {
      this.popAvalaibleDaysTemplateHtml = `<p>No times available</p>`;
    }
  }//end of method

  getAvalableDay(dayIndx) {
    let day = "";
    switch (dayIndx) {
      case 0:
        day = "S";
        break;
      case 7:
        day = "S";
        break;
      case 1:
        day = "M";
        break;
      case 2:
        day = "T";
        break;
      case 3:
        day = "W";
        break;
      case 4:
        day = "T";
        break;
      case 5:
        day = "F";
        break;
      case 6:
        day = "S";
    }
    return day;
  }//end of method

  onChangeClinic(event: any) {
    //this.appoinment["timeList"] = [];
    if (!event.value) return;
    let chamber = this.appoinment.doctorChamberList.filter(x => x["chamberPk"] == event.value.id)[0];

    let query = {
      doctorRefNo: this.appoinment.doctorRefNo,
      chamberPk: chamber.chamberPk
    }
    this.searchService.getCalender(query).subscribe(result => {
      this.calenderList = result.data;
    })
  }//end of method

  openBookAppoinment(id: string, doctor: any) {
    this.appoinmentTypeLists = this.getAppointmentTypeList();
    this.showAppoinmentForMe = true;
    this.showAppoinmentForGroup = false;
    let user: any = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.appoinmentUser.userType = this.appoinmentTypeLists[0].id;
      this.appAppointment.userPk = user.id;

      // this._individualService.getUserFullProfile(user.refNo).subscribe(res => {
      //   this.appSIgnUp.userName = res.data.firstName;
      //   this.appSIgnUp.mobileNo = res.data.contactNo;
      // });
    } else {
      this.appoinmentTypeLists = [];
      this.orderMedicinePage = false;
      GetSet.setOrderMedicine(this.orderMedicinePage);
      this.broadcastService.setLogin();
      return;
    }

    doctor["clinicList"] = [];
    doctor.doctorChamberList.forEach(chamber => {
      doctor["clinicList"].push(chamber/*{ id: item.chamberPk, label: item.hospitalName }*/);
    });

    // Speciality list
    doctor["speciality"] = doctor.doctorSpecializations;//[];

    // Qualification list
    doctor["qualifications"] = doctor.doctorQualifications;//[];

    this.individualGroupMember = null;
    this.appoinment = doctor;
    this.modalRef = this.bsModalService.show(this.bookAppoinmentModal, { class: 'modal-xl' });
  }//end of method

  backClicked() {
    this.modalRef.hide();
  }//end of method

  onclickGroupUser(groupUserId: any) {
    this.appAppointment.userPk = groupUserId;
  }
  onClickSearchResult() {
    this.showSearch = true;
    this.refineFormGroup.reset();//new add to reset the form 
    this.setformcontrolValue();//to set refine fees control value initially
    if(!this.isOnline){
      if (this.search.city || this.search.location) {
        if(this.search.location) {
          this.search.isAddress = true;
        }
        this.getResult();
      } else {
        this.toastService.showI18nToast("Please specify a city or an address to search for doctors", "warning");
      }
    }
    else{
        this.getResult();
    }
    
  }
  images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

  sortByVisitFees() {
    this.searchResult = this.searchResult.sort((n1, n2) => {
      if (Number(n1["visit"]) > Number(n2["visit"])) {
        return 1;
      }
      if (Number(n1["visit"]) < Number(n2["visit"])) {
        return -1;
      }
      return 0;
    });
  }

  sortByRating() {
    this.searchResult = this.searchResult.sort((n1, n2) => {
      if (n1["rating"] > n2["rating"]) {
        return 1;
      }
      if (n1["rating"] < n2["rating"]) {
        return -1;
      }
      return 0;
    });
  }

  bookAndPay() {
    alert('dsf')
  }

  onSelectDate(event) {
    this.appoinment["timeList"] = [];
    let d = new Date(Date.parse(event));
    this.appAppointment.appointmentDate = d;
    let month = d.getMonth() <= 9 ? ('0' + (d.getMonth() + 1)) : d.getMonth() + 1;
    let day = d.getDate() <= 9 ? ('0' + d.getDate()) : d.getDate();
    let dateStrig = d.getFullYear() + '-' + month + '-' + day;
    let doctorAvailableOnSelectedDate = this.calenderList.filter(x => x["calendarDate"] == dateStrig)[0];
    if (!doctorAvailableOnSelectedDate) {
      this.toastService.showToast(0, 'Doctor is not available on this selected date');
      return;
    }
    doctorAvailableOnSelectedDate.timeSlots.forEach(item => {
      if (!item.occupied) {
        let time = item.fromTime.substring(0, 5) + "-" + item.toTime.substring(0, 5);
        this.appoinment["timeList"].push({ id: time, label: time });
      }

    })
    if (this.appoinment["timeList"].length == 0) {
      this.toastService.showToast(0, 'No slot available for appointment.Please try some other day!');
    }
  }//end of method

  checkInput(inputName: any) {
    this.appoinmentUser.userType = this.appoinmentTypeLists[2].id;
    if (!this.appSIgnUp.mobileNo) {
      this.toastService.showToast(-1, 'Enter valid patient\'s mobile number');
      return;
    } else if (this.appSIgnUp.mobileNo && this.appSIgnUp.mobileNo.length == 13) {
      this.authService.checkContactno(this.appSIgnUp.mobileNo).subscribe((data) => {
        if (data) {
          if (data.status === 5051) {
            this.toastService.showToast(data.status, 'Mobile Number exists');
            this.appSIgnUp.userName = '';
            this.appSIgnUp.mobileNo = '';
            return;
          }
          // show msg
        }
      },
        (error) => {
          // show error
        });
    }
  }//end of method

  makeAppontment(userId: any, chamberList: any) {
    let fullTIme = this.appAppointment.fullTime.label.split('-');
    let fees = chamberList.filter(x => x["chamberPk"] == this.appAppointment.chamberPk.id)[0]["fees"];
    const query = {
      userPk: this.appAppointment.userPk,
      appointmentBy: userId,
      doctorRefNo: this.appoinment.doctorRefNo,
      totalFees: fees,
      chamberPk: this.appAppointment.chamberPk.id,
      appointmentDate: this.appAppointment.appointmentDate,
      appointmentTime: fullTIme[0] + ":00",
      timeTo: fullTIme[1] + ":00",
      appointmentDateStr: this.convert(this.appAppointment.appointmentDate.toString()),
      //remarks: "General Check-Up",
      appointmentRefNo: this.appoinment.registrationNo,
      status: "REQ"
    };
    this.searchService.makeAppointment(query).subscribe(resp => {
      if (resp && resp.status != 2000) {
        this.toastService.showToast(resp.status, resp.message);
        return;
      }
      this.appointmentId = resp.data.appointmentPk;
      this.modalService.close('book-appoinment-popup');
      this.modalService.open('payment-method-popup');
    })
  }//end of method

  userSearch() {
    this.userSearchResultList = [];
    if (this.appoinmentUser.searchText == '') {
      this.toastService.showToast(-1, 'Please enter some text here');
      return;
    }
    else {
      this.searchService.searchUser({ q: this.appoinmentUser.searchText, pgno: 1, size: 100 }).subscribe(data => {
        if (data.status === 2000) {
          let user = JSON.parse(localStorage.getItem('user'));
          data.data.users.forEach(item => {
            if (user.userName != item.userName) {
              this.userSearchResultList.push(item);
            }
          });
        } else {
          this.toastService.showToast(data.status, data.message);
        }
      }, (error) => {
        // show error
      });
    }
  }//end of method

  paymentMethod(method: String) {
    this.appointmentId = localStorage.getItem('appoinmentId');
    this.appointmentData = JSON.parse(localStorage.getItem('appointmentData'));
    this.paymentMode = method;
    var paymentObj = {
      triggerPk: this.appointmentId,
      paymentMode: this.paymentMode,
      paidAmount: this.appointmentData.payableAmount,
      transactionTypeEnum: "APPOINTMENT"
    };

    this.PaymentService.paymentInitiateV2(paymentObj).subscribe((resp: any) => {
      if (resp && resp.status == 2000) {
        if (this.paymentMode == 'PAYTM') {
          this.modalService.close('payment-method-popup');
          this.modalService.open('paytm-popup');
          this.paytmRespObj = resp.data;
          setTimeout(() => {
            this.el.nativeElement.submit();
          }, 500);

        } else if (this.paymentMode == 'PAYPAL') {
          window.location.href = resp.data.redirectUrl;
        }
      }
    });
  }//end of method


  closeAdvancedSearch() {
    this.search.date = null;
    //this.search.rating = null;
    this.search.fees = '';
    this.search.isAdvanceSearch = !this.search.isAdvanceSearch
  }//end of method

  saveFavDoctor(doctor: any, fav: boolean) {
    doctor.isFavourite = !doctor.isFavourite;
    let profileUserRefNo = this.user.refNo;
    let query = [{
      userRefNo: profileUserRefNo,
      doctorRefPk: doctor.doctorRefNo,//doctorRefNo,
      favourite: fav
    }];
    this._individualService.saveFavDoctor(query).subscribe(data => {
      doctor["isFvorite"] = fav;
      // this.sortByisFvorite();
    });
  }//end of method

  // getFavDoctorForUser() {
  //   let profileUserId = this.user.id;
  //   this._individualService.getFavDoctorForUser(profileUserId).subscribe(data => {
  //   });
  // }

  onKeydown($event) {
    if ($event.key == '-' || $event.key == '.' || $event.key == 'e' || $event.key == 'E') {
      return false;
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }

  loadRatingData() {
    this.searchService.getRatingv2().subscribe((result) => {
      if (result.status === 2000) {
        this.ratingList = result.data;
        this.ratingList.forEach(item => {
          item["ratingParameterScore"] = 0;
        })
      }
    })
  }

  giveRating(doctor: any) {
    this.editRating = null;
    GetSet.setRatingFor('DOCTOR');
    this.appointment = doctor;
    this.ratingList.forEach(item => {
      item["ratingParameterScore"] = 0;
    })
    this.doctorId = doctor.doctorRefNo;
    let query = {
      "forEntityType" : "DOCTOR",
      "forEntityRefNo": this.doctorId,
      "byEntityRefNo": this.userRefNo,
      "byEntityRolePk": this.user_rolePk
      }
    this.searchService.viewRatingV2(query).subscribe((result) => {
      this.ratings = result.data;
      // this.review = result.data.review;
      if (result.status == 2000 && result.data != null) {
        result.data.ratingDetails.forEach(item => {
          let targetRating = this.ratingList.filter(x => x.ratingParameterDTO.ratingParameterName == item.ratingParameter.ratingParameterName)[0];
          if (targetRating) {
            targetRating["ratingParameterScore"] = item.ratingParameterScore;
          }
        });
        this.editRating = result.data;
      }
    });
  }

  addressCheck() {
    this.addressRadio = true;
    this.cityRadio = false;
  }

  cityCheck() {
    this.addressRadio = false;
    this.cityRadio = true;
  }

  onClickAddress(address) {
    this.search.lat = +(address.lat);
    this.search.long = +(address.lng);
    this.search.location = address.addressType + "--" + address.line1 + "," + (address.line2 ? address.line2 + "," : '') + address.city + "," + address.pinCode;
    this.searchAddressFlag = true;
    this.searchLatlongObj.city = address.city;
    this.searchLatlongObj.pin = address.pinCode;
    this.searchLatlongObj.currentLocationBoolean = true; // Changed to true since need to pass latlon in this case - app#1062
    address.formatedAddress = this.search.location;
    this.myAddress = false;
    // this.myAddressFlag = false;
    this.currLocationFlag = false;//set current location var to false
    this.search.city = null;
  }//end of method

  onSelectCity() {
    this.search.location = null;
    this.searchAddressFlag = false;
    this.searchLatlongObj.currentLocationBoolean = false; // Changed to false since need to pass location in this case
  }

  //new add to search address
  onClickSearchAddressInput() {
    // this.myAddressFlag = true;
    this.myAddress = true;
  }//end of method
  

  getAdditionalDoctorChamberList(doc, index) {
    if(doc.onlineConsultation == 'Y') {
      this.searchResult[index].onlineConsultation = 'N';
    }
    this.isOnlineConsultationBoolean = false;
    let path = "";
    // let location = this.searchAddressFlag ? (this.searchAddressFlag ? queryLocation : reqJson.location) : reqJson.city;
    // if(!location){
    //   location = this.search.location;
    // }
    let locationQuery = "";
    this.searchAddressFlag ? locationQuery = this.searchLatlongObj.city + "," + this.searchLatlongObj.pin : locationQuery = this.search.location;
    path = this.search.location ? (this.currLocationFlag ? ("latlon:" + this.lat + "~" + this.long) : ("location:" + locationQuery)) : ("location:" + this.search.city);
    // path = this.search.location? (this.currLocationFlag? ("latlon:" +this.lat+ "~"+this.long):("location:"+this.searchLatlongObj.city+","+this.searchLatlongObj.pin)): ("location:"+this.search.city);
    path = "search=" + path;
    this.searchService.getAdditionalChambers(path, doc.doctorRefNo).subscribe(res => {
      if (res.status == 2000) {
        this.searchResult.forEach(element => {
          if (element.doctorRefNo == doc.doctorRefNo) {
            element.doctorChamberList = res.data;
            element.additionalChamberCount = 0;
          }
        });
      }
    })

  }//end of method

  //method to close address dropdown
  onClickOutside() {
    // this.myAddressFlag = false;
  }//end of method

  //new add to display location
  doctorChamberLocationlng: number = 0;
  doctorChamberLocationlat: number = 0;
  doctorClinicDataObj: any = {};
  openDoctorChamberLocation(clinicData) {
    this.doctorClinicDataObj = clinicData;

    this.doctorChamberLocationlat = clinicData.latitude;
    this.doctorChamberLocationlng = clinicData.longitude;
    this.modalRef = this.bsModalService.show(this.googleMapLocation, { class: 'modal-lg' });
  }

  refinePanelDisplay() {
    this.refinePanelPreboolean = this.panelVisible;
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.refinePanelPreboolean = true;
    this.panelVisible = false;
  }

  outsideDivClick() {
    console.log("outside click true");
    this.filterOutsideClick = true;
  }

  insideDivClick() {
    console.log("inside click true");
    this.filterOutsideClick = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(event.target.classList.contains('search-near-input')) {
    this.switchPop=true;
    } else {
    this.switchPop=false;
    }

    //for filter button click outside
    //https://gitlab.com/sbis-poc/app/-/issues/2677
    if(this.filterOutsideClick) {
      if(!event.target.classList.contains('filterBtn-for-doc-search')) {
        this.panelVisible = false;
        this.filterOutsideClick = false;
      }
    }
    //end of filter button click outside
  }

  isOnline: boolean = false;
  checkOnline(event){
    if(event.target.checked){
      this.isOnline = true;
    }
    else{
      this.isOnline = false;
    }
  }

  popupSetup(event) {
    if(event.screenY > 300 && event.screenY < 450) {
      this.popoverPosition = 'bottom';
    } else if(event.screenY >= 450 && event.screenY < 600) {
      this.popoverPosition = 'right';
    } else if(event.screenY >= 600 && event.screenY < 800) {
      this.popoverPosition = 'top';
    }
  }

}//end of class
