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

import { HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { ServiceProviderService } from '../../../../app/modules/service-provider/service-provider.service';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import { timer } from 'rxjs';// app#1086
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent //Working on app/issues/1086
} from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { DoctorService } from 'src/app/modules/doctor/doctor.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AppoinmentService } from '../../appoinment/appoinment.service';
import { IndividualService } from '../../individual/individual.service';
import { SearchPipe } from 'src/app/shared/search.pipe';
import { GetSet } from 'src/app/core/utils/getSet';

const colors: any = {
  COMPLETED: { // MEDePAL theme
    // primary: '#008000',
    // secondary: '#228B22'
    // primary: '#008000',
    primary: '#9553a4', // app#1094
    secondary: '#98FB98'

  },
  REQUESTED: { //yellow
    primary: 'rgb(227, 188, 8)',
    secondary: '#ffc'
  },
  CONFIRMED: { //green
    primary: '#4CAF50', // Working on app/issues/910
    secondary: '#87CEFA'
  },
  VIP: { //blue
    primary: '#00BFFF',
    secondary: '#87CEFA'
  }
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'doctor-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['doctor-calendar.component.css'],
  templateUrl: 'doctor-calendar.component.html'
})
export class DoctorCalendarComponent implements OnInit, OnDestroy{
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;
  @ViewChild('calendarModal')
  calendarModal: TemplateRef<any>;
  modalRef: BsModalRef;
  @ViewChild('feedbackModal') feedbackModal: TemplateRef<any>;
  results: string[];
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  feedbackButton: boolean = false;
  doctorRefNo: any;
  datePipeEn: DatePipe = new DatePipe('en-US');
  chamberList: any[] = [];
  options: string[] = [];               //||---For address typeahead
  submitted: boolean = false;
  feedbackForm: FormGroup;
  addNew = false;
  dtFormat = "";
  minDate = new Date();
  fromTime: any;
  toTime: any;
  newPatient: boolean = false;
  isRoleHospital: boolean = false;
  isRoleDoctor: boolean = true;
  filteredDoctorSingle: any[]
  averageVisitDuration: any;
  hourSegments: number;
  calendarForm: FormGroup;
  minStartTime: any = 6;
  maxEndTime: any = 23;
  timingList: any = [];
  minDayStartTime = 0;
  maxDayEndTime = 23;
  optionsDoctor: any = [];
  optionsDoctorToDisplay: any = [];
  entityName: string;
  chamberRefNoForDoctor: string
  userId: any;
  roleList: any = [];
  msUserPk: any;
  userRolePk: any;
  isStartVisit: boolean;
  user_roleName: any
  msUserId: any;
  modalData: any = {
  };
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  loggedInUser: any;
  usingComponentStr: string = "calender";

  autoTimerSubscription: any; // Working on app/issues/1086

  appointmentForm = this.fb.group({
    appointmentBy: null,
    appointmentByRefNo: null,
    appointmentCxlBy: null,
    appointmentCxlDateTime: null,
    appointmentCxlReason: null,
    appointmentRefNo: null,
    chamberRefNo: ['', Validators.required],
    chamberName: [null],
    onlineConsultationFlag: [false],
    doctorRefNo: this.doctorRefNo,
    patientRefNo: [null],
    status: null,
    remarks: null,
    appointmentDate: [null, Validators.required],
    appointmentTime: [null, Validators.required],
    appointmentDateStr: null,
    totalFees: null,
    advanceFees: null,
    patientName: [null, Validators.required],

    patientDateOfBirth: null,
    patientGender: null,
    patientAgeInMonth: null,
    appointmentState: null,
    isExistingInUser: [false],
    existingrolePk: [null],
    entityName: [this.entityName],
    forMinor: [null],
    isSerial: [null],
    // app#916
    guardianName: [null],
    isMinor: [null],
    patientEmailId: [null],
    referredBy: [null], //Working on app/issues/937
    userAddressPk: [null],
    addressForm: this.fb.group({
      id: [null],
      line1: [null, [Validators.maxLength(100)]],
      line2: [null],
      country: ['India'],
      state: [null],
      city: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      pinCode: [null, [Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      addressType: ['Inpatient'],
      isSubmit: [false],
      isDirty: [false]
    })
  });
  isPopulated: boolean = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  isSetCurrentTimeCalled: boolean = false; //Working on app/issues/1086

  private events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;
  user_refNo: string;
  user_rolePk: number
  feedbacks: any[] = [];
  isUpload: any = false;
  selectedFiles: any;
  masterGender: any = [];
  APP_STATE = SBISConstants.APPOINTMENT_STATE;
  APP_STATUS = SBISConstants.ENTITY_STATUS;
  // app#916
  displaySidebar: boolean = false;
  minorUsers: any[] = [];
  getUserDetails: any;
  minorGuardian: any;
  isDob: boolean;
  isName: boolean;
  isGender: boolean;
  associateUser: any;
  isGuardian: boolean;
  isNewMinor: boolean;
  isMinorDisable: boolean;

  // Working on app/issues/1086

  dayViewRenderEvent: any;
  weekViewRenderEvent
  // End Working on app/issues/1086
  weeksDataModel: any = {//to set dayofweek
    'refineScheduleMonDay': 1,
    'refineScheduleTueDay': 2,
    'refineScheduleWedDay': 3,
    'refineScheduleThuDay': 4,
    'refineScheduleFriDay': 5,
    'refineScheduleSatDay': 6,
    'refineScheduleSunDay': 7
  };
  doctorListForOPD: any[] = [];
  doctorListForOPDToDisplay: any[] = ["abcdsghk"];//to display doc list
  daysOfWeekModel: { 1: string; 2: string; 3: string; 4: string; 5: string; 6: string; 7: string; };
  refineFormGroup: FormGroup;
  specializationsList: any[] = [];
  specializationsListToDisplay: any[] = [];
  timeSlotDetails: any[] = [];
  isModalOpened: boolean = false;
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  appRefNo: any;
  customType: any ="";
  childSpRefNo: any;
  //loading: boolean = false;
  childServiceProvider: any[] = [];
  spRefNo: any;
  private childSubscription;
  videoStart:any;

  constructor(private modal: NgbModal, private http: HttpClient,
    private fb: FormBuilder, private datePipe: DatePipe,
    private _doctorService: DoctorService,
    private router: Router,
    private frb: FormBuilder,
    private modalService: ModalService,
    private bsModalService: BsModalService,
    private broadcastService: BroadcastService,
    private authService: AuthService,
    private _toastService: ToastService, private individualService: IndividualService,
    private serviceProviderService: ServiceProviderService, private cd: ChangeDetectorRef,
    private appoinmentService: AppoinmentService) {
    //this.loading = true;
    //document.body.classList.add('hide-bodyscroll');
    this.feedbackForm = frb.group({
      'doctorName': [null, [Validators.required]],
      'forUserPk': [null, [Validators.required]],
      'file': [null, [Validators.required]],
      'documents': [null],
      'date': [new Date()],
      'fileUploadFor': ['PRESCRIPTION'],
      'isSubmit': [false],
      'myFeedback': [null, [Validators.required]]
    });

    this.buildForm();
    this.getDaysOfWeeksNTimeSlot();
  }//end of constructor

  ngOnInit() {
    //this.loading = true;
    //document.body.classList.add('hide-bodyscroll');
    // Rename control name contactNo to patientContactNo in various places
    this.broadcastService.setHeaderText('Doctor Calendar');
    this.dtFormat = environment.DATE_FORMAT;
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_roleName = user.roleName;
    this.user_refNo = user.refNo;
    this.user_rolePk = user.rolePk;
    this.entityName = user.entityName;
    this.userId = user.id;
    this.msUserId = user.userId;
    this.spRefNo = user.serevicProviderRefNo;
    this.childSpRefNo = localStorage.getItem('childServiceProviderRefNo');
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (user.roleName == 'ADMIN' || user.roleName == 'OPERATOR' || user.roleName == 'ASSISTANT') {
      this.isStartVisit = true;
    } else {
      this.isStartVisit = false;
    }

    if (user.entityName == 'HOSPITAL') {
      // Service provider ref no - issue app#604
      // this.getDoctorName(user.serviceProviderRefNo);      
      this.isRoleHospital = true;
      this.isRoleDoctor = false;
      this.getOPDDoctorListANDSpecialization();
    }
    else {
      this.isRoleHospital = false;
    }
    this.averageVisitDuration = 15;
    this.hourSegments = 60 / 15;

    // Working on app/issues/1281
    if (this.entityName == 'DOCTOR') {
      this.nextPrevDateChange(this.viewDate);
    }
    // End Working on app/issues/1281   

    if (user.entityName == 'DOCTOR') {
      this.isRoleDoctor = true;
      this.doctorRefNo = this.loggedInUser.refNo;
    }
    if (this.entityName == 'DOCTOR') {
      var request = {
        "refNo": user.refNo
      }
      this._doctorService.getAllChamberByDoctorRefNo(request).subscribe(
        result => {

          this.chamberList = result.data;
          //this.loading = false;
          //  document.body.classList.remove('hide-bodyscroll');
          return;
        }
      )
    }
    this.individualService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.GENDER }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
        //this.loading = false;
        //document.body.classList.remove('hide-bodyscroll');
      }
    }, err => {
      // console.log("err of get order med::", err);
      //this.loading = false;
      //document.body.classList.remove('hide-bodyscroll');
    });

    this.childSubscription = this.broadcastService.getHospitalDetails().subscribe(data => {
        this.childSpRefNo = data;
        this.getOPDDoctorListANDSpecialization();
    });

    if (user.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR) {
      this.getServiceProviderEntityDetailsList(user);
    }
  }//end of oninit


  getServiceProviderEntityDetailsList(user) {
    let parentRoleName;
    if(user.parentRoleName == "HOSPITAL") {
      parentRoleName = 'Hospital';
    } else {
      parentRoleName = user.parentRoleName
    }
    let query = {
      "serviceProviderRef": user.serviceProviderRefNo,
      "parentRoleName": parentRoleName
    }
    this.serviceProviderService.getServiceProviderEntityValueByPk(query).subscribe(resp => {
      if(resp.status == 1) {
        this.childServiceProvider = resp.data.childServiceProvider;
      }
    });
  }

  getDaysOfWeeksNTimeSlot() {
    this.daysOfWeekModel = {
      1: "MON",
      2: "TUE",
      3: "WED",
      4: "THU",
      5: "FRI",
      6: "SAT",
      7: "SUN"
    };
    this.timeSlotDetails = [
      { label: "Morning (6:00 - 12:00)", value: "Morning" },
      { label: "Afternoon (12:00 - 16:00)", value: "Afternoon" },
      { label: "Evening (16:00 - 20:00)", value: "Evening" },
      { label: "Night (20:00 - 0:00)", value: "Night" }
    ];
    //this.loading = false;
    //document.body.classList.remove('hide-bodyscroll');
  }


  getOPDDoctorListANDSpecialization() {
    let apiMethod = 
    (this.user_roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR) ?
     this.serviceProviderService.fetchDoctorListByOPDV2({
        "requestType": "all",
        "hospitalRefNo": this.childSpRefNo
      })
      : this.serviceProviderService.fetchDoctorListByOPD('opd');

    apiMethod.subscribe(res => {
      if (res.status === 2000) {
        this.doctorListForOPDToDisplay = res.data;
        this.setCustomCssToTheDocList(null);
        this.doctorListForOPD = res.data;
        this.cd.detectChanges();//it has been added because doctorListForOPDToDisplay array is not being displayed on html
        this.doctorListForOPD.forEach((element, index) => {
          var obj = {
            'key': element['ref_no'],
            'value': element['name']
          };
          this.optionsDoctor.push(obj.value);
          this.optionsDoctorToDisplay.push(obj.value);
        });

        let specializationWSMethod: any =
        (this.loggedInUser.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR) ? 
          this.serviceProviderService.getSpecializationListByServiceProviderRefNo("?spRefNo="+this.childSpRefNo)
          : this.serviceProviderService.getSpecializationList();  

          specializationWSMethod.subscribe(res => {
            if (res.status === 2000) {
              this.specializationsListToDisplay = res.data;
              this.specializationsList = res.data;
            }
          });
        //this.loading=false;
        //document.body.classList.remove('hide-bodyscroll');
      }

    }, err => {
      // console.log("err of get order med::", err);
      //this.loading = false;
      //document.body.classList.remove('hide-bodyscroll');
    });
  }//end of method

  //method to set custom css to the opd doc list
  setCustomCssToTheDocList(index: number) {
    this.doctorListForOPDToDisplay.forEach((el, ind) => {
      if (ind === index) {
        el.cssClass = "row refine-panel-border-bottom mb-0 padding10 selected-refine-by-div";
      } else {
        el.cssClass = "row refine-panel-border-bottom mb-0 padding10";
      }
    });
  }

  emitAssociateUser(event) {
    this.associateUser = event
  }

  //method to get speciality list according to search dropdown
  getSpecializationList(event) {
    this.specializationsListToDisplay = this.specializationsList.filter(x => x.toLowerCase().match(event.query.toLowerCase()));
  }

  //method to get speciality list according to search dropdown
  getDoctorNameList(event) {
    this.optionsDoctorToDisplay = this.optionsDoctor.filter(x => x.toLowerCase().match(event.query.toLowerCase()));
  }

  //method to get checkbox values by click method
  getCheckedValues(formControlName: string, event) {
    this.refineFormGroup.patchValue({
      [formControlName]: event.target.checked
    });

    this.preSearchRefinePanel();
  }//end of method

  preSearchRefinePanel() {
    let docList: any[] = this.doctorListForOPD;
    //
    let touchedValidCtrlArr = [];
    for (let control in this.refineFormGroup.controls) {

      /*if (this.refineFormGroup.controls[control].touched && this.refineFormGroup.controls[control].value) {
        touchedValidCtrlArr.push(control);
      }*///end of if

      if (this.refineFormGroup.controls[control].dirty && this.refineFormGroup.controls[control].value) {
        touchedValidCtrlArr.push(control);
      }//end of if
    }//end of for
    let scheduleDays: string[] = [];
    touchedValidCtrlArr.forEach(schDayel => { this.weeksDataModel[schDayel] ? scheduleDays.push(this.weeksDataModel[schDayel]) : null; });
    if ((scheduleDays.length > 0) && (docList.length > 0)) {//let colName: string = 'dayOfWeek';
      let returnArr = this.refinebyDayofWeek(docList, scheduleDays);
      docList = returnArr;
    }//end of if schedule days array check   
    this.getOpdDoctorByRefinePanel(docList);
  }

  getOpdDoctorByRefinePanel(docList: any[]) {//method to get refine panel list 
    this.calendarForm.reset();
    this.doctorRefNo = null;
    let formGroup = this.refineFormGroup.value;
    if (formGroup.refineSpecialisation) {
      docList = docList.filter(x =>
        (x.specifications.toLowerCase().indexOf(formGroup.refineSpecialisation.toLowerCase()) > -1));
    }

    if (formGroup.refineAvailabilityTime) {
      switch (formGroup.refineAvailabilityTime) {
        case "Morning":
          docList = this.refineByTimeAvailability(docList, 600, 1200);
          break;
        case "Afternoon":
          docList = this.refineByTimeAvailability(docList, 1200, 1600);
          break;
        case "Evening":
          docList = this.refineByTimeAvailability(docList, 1600, 2000);
          break;
        case "Night":
          docList = this.refineByTimeAvailability(docList, 2000);
          break;
      }
    }

    if (docList.length == 1) {
      this.populateCalendar(docList[0].ref_no, 0);
      this.calendarForm.patchValue({
        'doctorName': docList[0].name
      });
    } else {
      this.calendarForm.patchValue({
        'doctorName': ''
      });
    }
    this.doctorListForOPDToDisplay = docList;
    (this.doctorListForOPDToDisplay.length > 1) ? this.setCustomCssToTheDocList(null) : ((this.doctorListForOPDToDisplay.length == 1) ? this.setCustomCssToTheDocList(0) : null);
  }//end of method

  //refine by docname
  refineByDocName() {
    let docList: any[] = this.doctorListForOPD;
    if (this.calendarForm.controls['doctorName'].value) {
      docList = docList.filter(x => x.name.toLowerCase().match(this.calendarForm.controls['doctorName'].value.toLowerCase()));
    }
    this.getOpdDoctorByRefinePanel(docList);
  }

  //method to refine by time availability
  refineByTimeAvailability(docListToSearch: any[], sTm: number, eTm?: number): any[] {
    let docList: any[] =
      (eTm) ?
        docListToSearch.filter(doctor => {
          for (let timing of doctor.timeslotList) {
            let dStimeStr: string[] = timing.startTime.split(":");
            let dEtimeStr: string[] = timing.endTime.split(":");
            // if (+(stimeStr[0] + stimeStr[1]) >= sTm && (+(etimeStr[0] + etimeStr[1]) <= eTm)) {
            if (((+(dStimeStr[0] + dStimeStr[1]) >= sTm) && (+(dStimeStr[0] + dStimeStr[1]) <= eTm)) || ((+(dEtimeStr[0] + dEtimeStr[1]) >= sTm) && (+(dEtimeStr[0] + dEtimeStr[1]) <= eTm))) {
              return doctor;
            }
          }
        }) :
        docListToSearch.filter(doctor => {
          for (let timing of doctor.timeslotList) {
            let stimeStr: string[] = timing.startTime.split(":");
            if (+(stimeStr[0] + stimeStr[1]) >= sTm) {
              return doctor;
            }
          }
        });
    return docList;
  }

  //method to refine by dayofweek
  refinebyDayofWeek(refineArr: any[], searchArr: any[]): any[] {
    let returnArr: any = [];
    let searchPipeVar = new SearchPipe();
    let refineByScheduleDaysArr: any[] = [];
    refineArr.filter((doctor, index) => {
      let scheduleDaysFlag: boolean;
      let timeslotList: any = doctor.timeslotList;
      //new add to test dayofweek with days array 
      let allChamberTimingListArr: any[] = [];
      timeslotList.forEach(element => {
        allChamberTimingListArr.push(element.dayOfWeek.toString());
      });
      //end of new add
      let count: number = 0;
      for (let el of timeslotList) {
        if (timeslotList.length > 0) {
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

  //method to reset
  doctorCalendarResetAll() {
    this.doctorListForOPDToDisplay = this.doctorListForOPD;
    this.refineFormGroup.controls['refineAvailabilityTime'].reset();
    this.refineFormGroup.controls['refineScheduleSunDay'].reset();
    this.refineFormGroup.controls['refineScheduleMonDay'].reset();
    this.refineFormGroup.controls['refineScheduleTueDay'].reset();
    this.refineFormGroup.controls['refineScheduleWedDay'].reset();
    this.refineFormGroup.controls['refineScheduleThuDay'].reset();
    this.refineFormGroup.controls['refineScheduleFriDay'].reset();
    this.refineFormGroup.controls['refineScheduleSatDay'].reset();
    this.refineFormGroup.controls['refineSpecialisation'].reset();

    this.doctorRefNo = null;
    this.calendarForm.reset();
    this.setCustomCssToTheDocList(null);
  }

  buildForm() {
    let refineFormobj: any = {};
    refineFormobj['refineSpecialisation'] = new FormControl();
    refineFormobj['refineScheduleMonDay'] = new FormControl(false);
    refineFormobj['refineScheduleTueDay'] = new FormControl(false);
    refineFormobj['refineScheduleWedDay'] = new FormControl(false);
    refineFormobj['refineScheduleThuDay'] = new FormControl(false);
    refineFormobj['refineScheduleFriDay'] = new FormControl(false);
    refineFormobj['refineScheduleSatDay'] = new FormControl(false);
    refineFormobj['refineScheduleSunDay'] = new FormControl(false);
    refineFormobj['refineAvailabilityTime'] = new FormControl(false);

    this.refineFormGroup = new FormGroup(refineFormobj);
    let doctorName: any = {};
    doctorName['doctorName'] = new FormControl('');
    this.calendarForm = new FormGroup(doctorName);
  }//end of build form

  sortFunc(a, b) {
    return a.dayOfWeek - b.dayOfWeek
  }
  // Added for app#916
  emitDisplaySidebar(event) {
    this.displaySidebar = event;
  }
  openModal() {
    this.invoiceList = [];
    this.modalRef = this.bsModalService.show(this.calendarModal, this.config);
    this.startTimingErrorFlag = false;
    this.endTimingErrorFlag = false;
    this.isModalOpened = true;
  }

  close() {
    this.modalRef.hide();
  }

  hourClicked(event): void {
    if (this.entityName == 'HOSPITAL' && this.doctorRefNo == null) {
      this._toastService.showI18nToast("Please select a doctor first", "error");
      return;
    }
    this.isGender = false;
    let day = event.date.toString().trim().split(" ")[0];
    let clickedTime = this.zeroPad(event.date.getHours()) + ":" + this.zeroPad(event.date.getMinutes()) + ":" + this.zeroPad(event.date.getSeconds());

    if (this.user_roleName == 'DOCTOR') {

      this.viewDate = new Date();
      let dateData = this.viewDate.getDate();
      let monthData = this.viewDate.getMonth() + 1;
      let yearData = this.viewDate.getFullYear();

      if (event.date.getFullYear() < yearData) {
        //this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_YEAR', "error");
        //return;
        this._toastService.showI18nToast('You are creating a back dated appointment', 'warning');
        // if(confirm('You are creating a back dated appointment')) {
        this.openModalWithAllData(event);
        // }
      }
      if (event.date.getFullYear() <= yearData) {
        if (event.date.getMonth() + 1 <= monthData) {
          if (event.date.getMonth() + 1 < monthData) {
            this._toastService.showI18nToast('You are creating a back dated appointment', 'warning');
            // if(confirm('You are creating a back dated appointment')) {
            this.openModalWithAllData(event);
            // }
            //this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_DATE', "error");
            //return;
          }
          if (event.date.getDate() < dateData) {
            this._toastService.showI18nToast('You are creating a back dated appointment', 'warning');
            // if(confirm('You are creating a back dated appointment')) {
            this.openModalWithAllData(event);
            // }
            //this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_DATE', "error");
            //return;
          }
          else {// Working on app/issue/2216
            this.openModalWithAllData(event);
          }
        }
        else {
          this.openModalWithAllData(event);
        }
      } else {
        this.openModalWithAllData(event);
      }
    }
    if (this.user_roleName != 'DOCTOR') {

      this.viewDate = new Date();
      let dateData = this.viewDate.getDate();
      let monthData = this.viewDate.getMonth() + 1;
      let yearData = this.viewDate.getFullYear();

      if (event.date.getFullYear() < yearData) {
        this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_YEAR', "error");
        return;
      }
      if (event.date.getFullYear() <= yearData) {
        if (event.date.getMonth() + 1 <= monthData) {
          if (event.date.getMonth() + 1 < monthData) {
            //this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_DATE', "error");
            //return;
            this._toastService.showI18nToast('You are creating a back dated appointment', 'warning');
            // if(confirm('You are creating a back dated appointment')) {
            this.openModalWithAllData(event);
            // }
          }
          if (event.date.getDate() < dateData) {
            //this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_DATE', "error");
            //return;
            this._toastService.showI18nToast('You are creating a back dated appointment', 'warning');
            // if(confirm('You are creating a back dated appointment')) {
            this.openModalWithAllData(event);
            // }
          } else if (event.date.getDate() >= dateData) {
            this.openModalWithAllData(event);
          }
        }
        else {// Working on app/issue/2216
          this.openModalWithAllData(event);
        }
      }
      else {
        this.openModalWithAllData(event);
      }
      this.checkHolidayByAppointmentDateAndChamber();// Working on app/issue/2354
    }
    this.viewDate = new Date(event.date);// Working on app/issue/1825
    this.refresh.next();// Working on app/issue/1825
  }

  openModalWithAllData(event) {
    if (!this.isModalOpened) {
      this.openModal();
      if (this.entityName == 'HOSPITAL')
        this.appointmentForm = this.fb.group({
          appointmentByRefNo: null,
          appointmentCxlBy: null,
          appointmentCxlDateTime: null,
          appointmentCxlReason: null,
          appointmentRefNo: null,
          chamberRefNo: [this.chamberRefNoForDoctor, Validators.required],
          chamberName: [null],
          onlineConsultationFlag: [false],
          doctorRefNo: this.doctorRefNo,
          userRefNo: [null],
          status: this.APP_STATUS.NORMAL,
          remarks: null,
          appointmentDate: [event.date, Validators.required],
          appointmentDateStr: null,
          appointmentTime: [this.zeroPad(event.date.getHours()) + ':' + this.zeroPad(event.date.getMinutes()) + ':' + this.zeroPad(event.date.getSeconds()), Validators.required],
          totalFees: null,
          advanceFees: null,
          patientName: [null, Validators.required],
          appointmentState: null,
          patientContactNo: null,
          isExistingInUser: [false],
          existingrolePk: [null],
          entityName: [this.entityName],
          isSerial: [null],
          // app#916
          guardianName: [null],
          isMinor: [null],
          forMinor: false,
          patientDateOfBirth: [null],
          patientGender: [null, [Validators.required]],
          patientAgeInMonth: [null],
          patientEmailId: [null],
          referredBy: [null], //Working on app/issues/937
          patientRefNo: [null],
          userAddressPk: [null],
          addressForm: this.fb.group({
            id: [null],
            line1: [null, [Validators.minLength(5), Validators.maxLength(100)]],
            line2: [null],
            country: ['India'],
            state: [null],
            city: [null, [Validators.minLength(3), Validators.maxLength(50)]],
            pinCode: [null, [Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
            addressType: ['Inpatient'],
            isSubmit: [false],
            isDirty: [false]
          })
        });
      else if (this.entityName == 'DOCTOR')
        this.appointmentForm = this.fb.group({
          appointmentByRefNo: null,
          appointmentCxlBy: null,
          appointmentCxlDateTime: null,
          appointmentCxlReason: null,
          appointmentRefNo: null,
          chamberRefNo: ['', Validators.required],
          chamberName: [null],
          onlineConsultationFlag: [false],
          doctorRefNo: this.doctorRefNo,
          patientRefNo: [null],
          status: this.APP_STATUS.NORMAL,
          remarks: null,
          appointmentDateStr: null,
          appointmentDate: [event.date, Validators.required],
          appointmentTime: [this.zeroPad(event.date.getHours()) + ':' + this.zeroPad(event.date.getMinutes()) + ':' + this.zeroPad(event.date.getSeconds()), Validators.required],
          totalFees: null,
          advanceFees: null,
          patientName: [null, Validators.required],
          appointmentState: null,
          patientContactNo: null,
          isExistingInUser: [false],
          existingrolePk: [null],
          entityName: [this.entityName],
          isSerial: false,
          forMinor: false,
          guardianName: [null],
          isMinor: [null],
          patientDateOfBirth: [null],
          patientGender: [null, [Validators.required]],
          patientAgeInMonth: [null],
          patientEmailId: [null],
          referredBy: [null], //Working on app/issues/937
          userAddressPk: [null],
          addressForm: this.fb.group({
            id: [null],
            line1: [null, [Validators.maxLength(100)]],
            line2: [null],
            country: ['India'],
            state: [null],
            city: [null, [Validators.minLength(3), Validators.maxLength(50)]],
            pinCode: [null, [Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
            addressType: ['Inpatient'],
            isSubmit: [false],
            isDirty: [false]
          })
        });
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (this.entityName == 'HOSPITAL' && this.doctorRefNo == null) {
      this._toastService.showI18nToast("Please select a doctor first", "error");
      return;
    }
    this.isGender = false;
    let day = date.toString().trim().split(" ")[0];
    // added by 
    this.viewDate = new Date();
    let dateData = this.viewDate.getDate();
    let monthData = this.viewDate.getMonth() + 1;
    let yearData = this.viewDate.getFullYear();
    date.setHours(this.viewDate.getHours());
    date.setMinutes(this.viewDate.getMinutes());
    let event = {};
    event['date'] = date;

    if (date.getFullYear() < yearData) {
      this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_YEAR', "error");
      return;
    }
    if (date.getFullYear() <= yearData) {
      // console.log(date.getMonth());
      if (date.getMonth() + 1 <= monthData) {
        if (date.getMonth() + 1 < monthData) {
          this._toastService.showI18nToast('You are creating a back dated appointment', 'warning');
          // if(confirm('You are creating a back dated appointment')) {
          this.openModalWithAllData(event);
          // }
          //this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_DATE', "error");
          //return;
        }
        if (date.getDate() < dateData) {
          this._toastService.showI18nToast('You are creating a back dated appointment', 'warning');
          // if(confirm('You are creating a back dated appointment')) {
          this.openModalWithAllData(event);
          // }
          // this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_PAST_DATE', "error");
          // return;
        } else if (date.getDate() >= dateData) {
          this.openModalWithAllData(event);
        }
      }
      else { // Working on app/issue/2216
        this.openModalWithAllData(event);
      }
    }
    else {
      this.openModalWithAllData(event);
    }
    this.addNew = false;

    this.viewDate = new Date(date);// Working on app/issue/2216
    this.refresh.next();// Working on app/issue/2216
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  userAddressDetails: any = null;
  handleEvent(action: string, event: CalendarEvent): void {
    this.isGender = false;
    // Working on app/issues/1281
    let payload = {
      appointmentRef: event.meta.appointmentRefNo
    }


    this._doctorService.getAppointmentsViewByRefNo(payload).subscribe(res => {
      this.openModal();
      var age = 0;
      const bdate = new Date(res['data'].userDob);
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      this.userAddressDetails = res['data'].addressForm;
      console.log(this.userAddressDetails);

      this.appointmentForm = this.fb.group({
        appointmentCxlReason: res['data'].appointmentCxlReason,
        appointmentRefNo: event.meta.appointmentRefNo,
        chamberRefNo: res['data'].chamberRefNo,
        chamberName: res['data'].chamberName,
        onlineConsultationFlag: res['data'].onlineConsultation ? (res['data'].onlineConsultation == SBISConstants.YES_NO_CONST.YES_ENUM ? true : false) : false,
        doctorRefNo: this.doctorRefNo,
        userRefNo: res['data'].userRefNo,
        appointmentDateStr: null,
        appointmentDate: [new Date(res['data'].appointmentDate)],
        appointmentTime: [res['data'].appointmentTime.substring(0, 5)],
        totalFees: event.meta.totalFees,
        patientName: res.data.patientName ? res.data.patientName : event.meta.patientName,
        appointmentState: event.meta.appointmentState,
        emailAddress: res['data'].emailId,
        patientContactNo: res['data'].contactNo,
        isExistingInUser: [false],
        existingrolePk: [null],
        isSerial: [null],
        isMinor: [null],
        forMinor: [res['data'].forMinor],
        patientDateOfBirth: [res['data'].userDob],
        patientGender: [res['data'].gender, [Validators.required]],
        patientAgeInMonth: [age],
        patientEmailId: [null],
        referredBy: [event.meta.referredBy], //Working on app/issues/937
        userAddressPk: [res['data'].userAddressPk],
      });
      if (typeof res['data'].gender !== "undefined" && res['data'].gender != null && res['data'].gender != "") {
        this.isGender = true;
      }

      // app#1374
      if (res['data'].userType == "PSEUDO") {

        if (res['data'].userAgeInMonth)
          this.appointmentForm.patchValue({
            patientDateOfBirth: null
          });
        else if (res['data'].userDob)
          this.appointmentForm.patchValue({
            patientAgeInMonth: null
          });

      }
      else {
        this.appointmentForm.patchValue({
          patientAgeInMonth: null
        });
      }
    });
  }

  addEvent(): void {
    if (this.entityName == 'HOSPITAL' && this.doctorRefNo == null) {
      this._toastService.showToast(404, "Please select a doctor first");
      return;
    }
    this.openModal();
    this.addNew = true;
    if (this.entityName == 'DOCTOR') {
      this.appointmentForm = this.fb.group({
        appointmentByRefNo: null,
        appointmentCxlBy: null,
        appointmentCxlDateTime: null,
        appointmentCxlReason: null,
        appointmentRefNo: null,
        chamberRefNo: ['', Validators.required],
        chamberName: [null],
        onlineConsultationFlag: [false],
        doctorRefNo: this.doctorRefNo,
        userRefNo: [null],
        status: this.APP_STATUS.NORMAL,
        remarks: null,
        appointmentDateStr: null,
        appointmentDate: [null, Validators.required],
        appointmentTime: [null, Validators.required],
        totalFees: null,
        advanceFees: null,
        patientName: [null, Validators.required],
        appointmentState: null,
        emailAddress: null,
        patientContactNo: null,
        isExistingInUser: [false],
        existingrolePk: [null],
        entityName: [this.entityName],
        isSerial: [null],
        // app#916
        guardianName: [null],
        isMinor: [null],
        forMinor: false,
        patientDateOfBirth: [null],
        patientGender: [null, [Validators.required]],
        patientAgeInMonth: [null],
        patientEmailId: [null],
        referredBy: [null], //Working on app/issues/937
        patientRefNo: [null],
        userAddressPk: [null],
        addressForm: this.fb.group({
          id: [null],
          line1: [null, [Validators.minLength(5), Validators.maxLength(100)]],
          line2: [null],
          country: ['India'],
          state: [null],
          city: [null, [Validators.minLength(3), Validators.maxLength(50)]],
          pinCode: [null, [Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
          addressType: ['Inpatient'],
          isSubmit: [false],
          isDirty: [false]
        })
      });
    }
    if (this.entityName == 'HOSPITAL') {
      this.appointmentForm = this.fb.group({
        appointmentByRefNo: null,
        appointmentCxlBy: null,
        appointmentCxlDateTime: null,
        appointmentCxlReason: null,
        appointmentRefNo: null,
        chamberRefNo: [this.chamberRefNoForDoctor, Validators.required],
        chamberName: [null],
        onlineConsultationFlag: [false],
        doctorRefNo: this.doctorRefNo,
        userRefNo: [null],
        status: this.APP_STATUS.NORMAL,
        remarks: null,
        appointmentDateStr: null,
        appointmentDate: [null, Validators.required],
        appointmentTime: [null, Validators.required],
        totalFees: null,
        advanceFees: null,
        patientName: [null, Validators.required],
        appointmentState: null,
        emailAddress: null,
        patientContactNo: null,
        isExistingInUser: [false],
        existingrolePk: [null],
        entityName: [this.entityName],
        isSerial: [null],
        // app#916
        guardianName: [null],
        isMinor: [null],
        forMinor: false,
        patientDateOfBirth: [null],
        patientGender: [null, [Validators.required]],
        patientAgeInMonth: [null],
        patientEmailId: [null],
        referredBy: [null], //Working on app/issues/937
        patientRefNo: [null],
        userAddressPk: [null],
        addressForm: this.fb.group({
          id: [null],
          line1: [null, [Validators.minLength(5), Validators.maxLength(100)]],
          line2: [null],
          country: ['India'],
          state: [null],
          city: [null, [Validators.minLength(3), Validators.maxLength(50)]],
          pinCode: [null, [Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
          addressType: ['Inpatient'],
          isSubmit: [false],
          isDirty: [false]
        })
      });
    }
  }

  addFeedback() {
    this.getFeedBack();
    this.modalRef = this.bsModalService.show(this.feedbackModal, this.config);
  }

  cancelAppointment(appointmentState) {
    if (confirm('Do you want to cancel this appointment?')) {
      //===================================//
      /****Cancel Or Reject appointment****/
      if (appointmentState === this.APP_STATE.CANCELLED || appointmentState === this.APP_STATE.REJECTED) {
        if (this.entityName == 'HOSPITAL') {
          this.appointmentForm.patchValue({
            appointmentCxlBy: this.userId
          });
        }
      }
      this.appointmentForm.patchValue({
        appointmentState: appointmentState,
      });
      //===================================//
      this.modalRef.hide();
      this.appointmentForm.value.appointmentDateStr = this.convert(this.appointmentForm.value.appointmentDate.toString());
      this.submitAppointment(this.appointmentForm.value);
    }
  }

  saveDoctorAppointment(appointmentState) {
    console.log(this.appointmentForm);

    this.submitted = true;
    if (this.appointmentForm.valid) {
      if ((this.appointmentForm.controls.patientAgeInMonth.value == null
        || this.appointmentForm.controls.patientAgeInMonth.value.trim == '')
        && this.appointmentForm.controls.patientDateOfBirth.value == null) {
        this._toastService.showI18nToastFadeOut("You must have to enter date of birth or age.", "error");
        return;
      }

      /****Save fresh new appointment******/
      if (this.appointmentForm.controls.appointmentRefNo.value === null) {
        if (this.fromTime != null) {
          this.appointmentForm.controls.appointmentTime.setValue(this.fromTime);
        }
      }
      //===================================//
      /****Cancel Or Reject appointment****/
      if (appointmentState === this.APP_STATE.CANCELLED || appointmentState === this.APP_STATE.REJECTED) {
        this.appointmentForm.patchValue({
          appointmentCxlBy: this.appointmentForm.controls.doctorPk.value
        });
      }
      //===================================//
      this.appointmentForm.patchValue({
        appointmentState: appointmentState,
      });
      this.appointmentForm.patchValue({
        appointmentDateStr: this.convert(this.appointmentForm.value.appointmentDate.toString())
      });
      if (this.entityName == 'DOCTOR') {
        if (this.appointmentForm.value.appointmentRefNo == null && this.appointmentForm.value.isExistingInUser) {
          this._doctorService.checkOverlappingDoctorAppointmentV2(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {
            if (data.data > 0) {
              this.appointmentForm.patchValue({
                appointmentState: null,
              });
              this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_EXISTS_IN_SAME_TIME_SLOT', 'error');
            } else {
              this.appointmentForm.value.appointmentDateStr = this.convert(this.appointmentForm.value.appointmentDate.toString());
              let query = this.appointmentForm.value;
              this.submitAppointment(query);
            }
          });
        }
        else
          this.submitAppointment(this.appointmentForm.value);
      } else { // OPD
        // In case of new appointment do some validations
        if (this.appointmentForm.value.appointmentRefNo == null) {
          // In case of existing user check if he has already an appo in the chamber time slot
          if (this.appointmentForm.value.msUserPk != null) {
            this._doctorService.checkAppointmentExistsForUserInSelectedTimeRangeV2(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {
              if (!data) {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_EXISTS_IN_CHAMBER_TIME_RANGE', 'error');
              }
              else { // Check if overbooking limit is exceeded
                this._doctorService.checkOverBookingExcceededV2(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {
                  if (!data) {
                    this.appointmentForm.patchValue({
                      appointmentState: null,
                    });
                    this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_OVERBOOKING_EXCEEDED', 'error');
                  }
                  else {
                    this.submitAppointment(this.appointmentForm.value);
                  }
                },
                  error => {
                    this.appointmentForm.patchValue({
                      appointmentState: null,
                    });
                    this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
                  })
              }
            },
              error => {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
              })
          }
          else { // In case of new user check if overbooking limit is exceeded
            this._doctorService.checkOverBookingExcceeded(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {
              if (!data) {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_OVERBOOKING_EXCEEDED', 'error');
              }
              else {
                this.submitAppointment(this.appointmentForm.value);
              }
            },
              error => {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
              })
          }
        }
        else {
          this.submitAppointment(this.appointmentForm.value);
        }
      }
    }
  }

  //method to return request body
  makeRequestBodyJson(query, cancel?: boolean): any {
    let requestBodyObj: any = {
      "patientDateOfBirth": query.patientDateOfBirth,
      "patientGender": query.patientGender,
      "patientAgeInMonth": (parseInt(query.patientAgeInMonth) > 0) ? ((+query.patientAgeInMonth) * 12) : null,
      "isSerial": query.isSerial,
      "patientContactNo": query.patientContactNo,
      "patientName": query.patientName,
      "entityName": query.entityName,
      "appointmentDateStr": query.appointmentDateStr,
      "appointmentTime": query.appointmentTime,
      "chamberRefNo": query.chamberRefNo,
      "doctorRefNo": query.doctorRefNo,
      "patientRefNo": query.patientRefNo,
      "appointmentByRefNo": query.appointmentByRefNo,
      "referredBy": query.referredBy, //app#1430
      "userAddressPk": query.userAddressPk, //app#2367
      "addressForm": this.appointmentForm.controls.addressForm.value, //app#2367
      "onlineConsultation": this.appointmentForm.controls.onlineConsultationFlag.value ? SBISConstants.YES_NO_CONST.YES_ENUM : SBISConstants.YES_NO_CONST.NO_ENUM
    };
    return requestBodyObj;
  }//end of method

  emitUserDetails(event) {
    this.getUserDetails = event;
  }

  emitMinorUser(event) {
    this.minorUsers = event
  }

  submitAppointment(query) {
    let addressForm = this.appointmentForm.value.addressForm;
    console.log(addressForm);
    if (addressForm.pinCode == "" && addressForm.line1 == "" && addressForm.state == ""
      && addressForm.city == "" && addressForm.addressType == "") {
      this.appointmentForm.controls.addressForm.patchValue({
        isSubmit: false
      })
    }
    else {
      this.appointmentForm.controls.addressForm.patchValue({
        isSubmit: true
      })
    }
    if (addressForm.pinCode != "" && addressForm.line1 != "" && addressForm.state != ""
      && addressForm.city != "" && addressForm.addressType != "") {
      // this.createPrescription.controls.addressForm.patchValue({
      //   isSubmit: true
      // })
    }
    else if (addressForm.pinCode == "" && addressForm.line1 == "" && addressForm.state == ""
      && addressForm.city == "" && addressForm.addressType == "") {
      // this.createPrescription.controls.addressForm.patchValue({
      //   isSubmit: false
      // })
    }
    else {
      this._toastService.showI18nToast('Must enter full address information or none', "error");
      return;
    }
    this.appointmentForm.controls.addressForm.patchValue({
      isDirty: this.appointmentForm.controls.addressForm.dirty
    })
    console.log(addressForm);
    if (this.getUserDetails.status == 2000) {
      query['appointmentByRefNo'] = this.appointmentForm.value.appointmentByRefNo;
      query['patientRefNo'] = this.appointmentForm.value.patientRefNo;
      if (this.associateUser) {
        if (this.associateUser.name == 'Other') {
          query['patientContactNo'] = null;//this.appointmentForm.value.patientContactNo;
        }
      }
    }
    query["dateOfBirth"] = this.appointmentForm.value.patientDateOfBirth;
    this.modalRef.hide();
    this.isModalOpened = false;
    this._doctorService.makeAppointmentV4(this.makeRequestBodyJson(query)).subscribe(data => {

      if (data['status'] == '2000') {
        if (data['data'].appointmentState === this.APP_STATE.VIP) {
          // sbis-poc/app/issues/1074
          localStorage.setItem("userRefNo", query.userRefNo);
          localStorage.setItem("appointmentRefNo", data['data'].appointmentRefNo);
          this.router.navigate(['doctor/prescription']);
        }
        else if (data['data'].appointmentState === this.APP_STATE.CONFIRMED || data['data'].appointmentState === this.APP_STATE.REQUESTED) {
          if (data['data'].appointmentState === this.APP_STATE.CONFIRMED) {
            // app#894
            this._toastService.showI18nToastFadeOut('APPOINTMENT.APPOINTMENT_CREATED', "success");
          }
          if (data['data'].appointmentState === this.APP_STATE.REQUESTED) {
            // app#894
            this._toastService.showI18nToastFadeOut('APPOINTMENT.APPOINTMENT_REQUEST_CREATED', "success");
          }
          let startTime = (parseInt(data['data'].appointmentTime.substring(0, 2)));
          let stTimeForCal = startTime;
          stTimeForCal = stTimeForCal + ((stTimeForCal - this.minStartTime)) / (this.hourSegments - 1);
          let endTimeForCal = stTimeForCal + 15 / 60;
          if (this.events.length > 0) {
            stTimeForCal = stTimeForCal + ((stTimeForCal - this.minStartTime) / 15) * 1 / 12;
            endTimeForCal = stTimeForCal + 15 / 60;
          }
          let clickedEvent: any;
          if (query.appointmentRefNo != null) {
            this.events.forEach(function (e) {
              if (e.meta.appointmentRefNo == query.appointmentRefNo) {
                clickedEvent = e;
              }
            });
            this.events.splice(this.events.indexOf(clickedEvent), 1);
          }

          let age = 0;
          if (data['data'].userDob != null) {
            const bdate = new Date(data['data'].userDob);
            const timeDiff = Math.abs(Date.now() - bdate.getTime());
            age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
          }

          this.events.push(
            {
              //Calculate Appointment Date with start time and end time
              start: addHours(startOfDay(data['data'].appointmentDate),
                parseInt(data['data'].appointmentTime.substring(0, 2)) + parseInt(data['data'].appointmentTime.substring(3, 5)) / 60),
              title: data['data'].appointmentState == this.APP_STATE.REQUESTED
                ? 'Appointment Request from ' + data['data'].patientName + ''
                : data['data'].appointmentState == this.APP_STATE.CONFIRMED
                  ? 'Appointment for ' + data['data'].patientName + ''
                  : data['data'].appointmentState == this.APP_STATE.VIP
                    ? 'Visit in-Progress for ' + data['data'].patientName + ''
                    : 'Visit Completed for ' + data['data'].patientName + '',

              color: data['data'].appointmentState == this.APP_STATE.CONFIRMED
                ? colors.CONFIRMED
                : data['data'].appointmentState == this.APP_STATE.COMPLETED
                  ? colors.COMPLETED
                  : data['data'].appointmentState == this.APP_STATE.VIP
                    ? colors.VIP
                    : colors.REQUESTED,
              actions: this.actions,
              meta: {
                appointmentBy: data['data'].appointmentBy,
                appointmentByRefNo: data['data'].appointmentByRefNo,
                appointmentCxlBy: data['data'].appointmentCxlBy,
                appointmentCxlDateTime: data['data'].appointmentCxlDateTime,
                appointmentCxlReason: data['data'].appointmentCxlReason,
                appointmentRefNo: data['data'].appointmentRefNo,
                chamberRefNo: data['data'].chamberRefNo,
                doctorRefNo: data['data'].doctorRefNo,
                userRefNo: data['data'].userRefNo,
                status: data['data'].status,
                remarks: data['data'].remarks,
                appointmentDate: data['data'].appointmentDate,
                appointmentTime: data['data'].appointmentTime,
                totalFees: data['data'].totalFees,
                patientName: data['data'].patientName,
                appointmentState: data['data'].appointmentState,
                patientContactNo: data['data'].contactNo,
                forMinor: data['data'].forMinor,
                contactNo: data['data'].contactNo,
                userDob: data['data'].userDob,
                existingrolePk: [null],
                patientAgeInMonth: age,
                patientGender: data['data'].gender,
                referredBy: data['data'].referredBy, //Working on app/issues/937
                userAddressPk: [data['data'].userAddressPk],
              }
            }
          );
          this.viewDate = new Date(data['data'].appointmentDate); //Working on app/issues/1825
          this.refresh.next();
        }
      }
      else {
        this._toastService.showI18nToast(data['message'], "error");
        this.refresh.next();
      }
    });
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }

  convertForMarkAsHoliday(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  fetchUsers(searchText) {
    this.appointmentForm.patchValue({
      userPk: null
    });
    /******Patient Search*****/
    this._doctorService.getUserByName(searchText)
      .subscribe(res => {
        this.options = [];
        for (let i = 0; i < res['data'].length; i++) {
          this.options.push(res['data'][i]);
        }
      });
  }


  search(event) {
    this.appointmentForm.patchValue({
      userPk: null
    });
    this._doctorService.getUserByName(event.query).subscribe((data) => {
      this.results = data.data;
      if (this.results.length == 0) {
        this.newPatient = true;
      }
    });
  }

  zeroPad(num) {
    if (num.toString().length == 1) {
      num = '0' + num;
    }
    return num;
  }

  convertToTime(dt, label) {
    if (label == 'fromTime') {
      this.fromTime = ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2) + ":" + ('0' + dt.getSeconds()).slice(-2);
      this.appointmentForm.value.appointmentTime = ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2) + ":" + ('0' + dt.getSeconds()).slice(-2);
    }
  }

  startTimingErrorFlag = false;
  endTimingErrorFlag = false;
  convertTiming(event, label) {
    let startTime: any;
    let endTime: any;
    if (label == 'stTime') {
      this.fromTime = event.substring(0, 5) + ":00";
    }
    if (label == 'ndTime') {
      this.toTime = event.substring(0, 5) + ":00";
    }
  }

  individualUserData: any = null;
  isAge = false;

  populateCalendar(doctorRefNo, index: number) {
    // Service provider ref no - issue app#604
    //this.loading = true;
    //document.body.classList.add('hide-bodyscroll');
    this.doctorRefNo = doctorRefNo;
    this.setCustomCssToTheDocList(index);
    this.nextPrevDateChange(this.viewDate); // app#1374
    let payload = {
      "refNo": doctorRefNo,
      "entityName": this.loggedInUser.entityName,
      "roleName": this.loggedInUser.roleName,
      "opdRefNo": (this.loggedInUser.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR)?
       this.childSpRefNo : this.loggedInUser.serviceProviderRefNo,
      "fromDate": this.fromDate,
      "toDate": this.toDate
    }
    if (doctorRefNo == null || doctorRefNo == '') {
      this.timingList = []
    }
    else if (this.entityName == 'HOSPITAL')
      // Working on app/issues/1281

      this._doctorService.getDoctorAppointmentsV3(payload).subscribe(res => {
        let docObj: any = this.doctorListForOPDToDisplay.find(x => x.ref_no == payload.refNo);
        this.calendarForm.patchValue({
          'doctorName': docObj.name
        });
        this.events = [];
        this.doctorRefNo = res['data'].doctorRefNo;
        let appointmentList = res['data'].appointmentList;

        for (let i = 0; i < appointmentList.length; i++) {
          if (appointmentList[i].appointmentState == this.APP_STATE.CANCELLED || appointmentList[i].appointmentState == this.APP_STATE.REJECTED) {
            continue;
          }
          this.events.push(
            {
              start: addHours(startOfDay(appointmentList[i].appointmentDate),
                parseInt(appointmentList[i].appointmentTime.substring(0, 2)) + parseInt(appointmentList[i].appointmentTime.substring(3, 5)) / 60),
              title: appointmentList[i].appointmentState == this.APP_STATE.REQUESTED
                ? 'Appointment Request from ' + appointmentList[i].patientName + ''
                : appointmentList[i].appointmentState == this.APP_STATE.CONFIRMED
                  ? 'Appointment for ' + appointmentList[i].patientName + ''
                  : appointmentList[i].appointmentState == this.APP_STATE.VIP
                    ? 'Visit in-Progress for ' + appointmentList[i].patientName + ''
                    : 'Visit Completed for ' + appointmentList[i].patientName + '',

              color: appointmentList[i].appointmentState == this.APP_STATE.CONFIRMED
                ? colors.CONFIRMED
                : appointmentList[i].appointmentState == this.APP_STATE.COMPLETED
                  ? colors.COMPLETED
                  : appointmentList[i].appointmentState == this.APP_STATE.VIP
                    ? colors.VIP
                    : colors.REQUESTED,
              actions: this.actions,
              meta: {
                appointmentRefNo: appointmentList[i].appointmentRefNo,
                doctorRefNo: this.doctorRefNo,
                appointmentDate: appointmentList[i].appointmentDate,
                appointmentTime: appointmentList[i].appointmentTime,
                patientName: appointmentList[i].patientName,
                appointmentState: appointmentList[i].appointmentState
              }
            }
          );
          this.refresh.next();
        }
      }
      );

    //End Working on app/issues/1281
    this.setChamberTiming(doctorRefNo);
  }

  setChamberTiming(doctorRefNo) {
    // Service provider ref no - issue app#604
    let payload = {
      "doctorRefNo": doctorRefNo,
      "miscUserRefNo": (this.loggedInUser.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR)? this.childSpRefNo : this.loggedInUser.serviceProviderRefNo
    }
    this._doctorService.getChamberDetailsByOPD(payload)
      .subscribe(res => {
        //===========Chamber Timing starting and ending timeslots==============
        this.timingList = [];
        this.timingList = res['data'].chamberTiming;
        for (let i = 0; i < this.timingList.length; i++) {
          let stTime = this.timingList[i]['startTime']
          stTime = stTime.replace(/:/g, '');
          stTime = stTime.substring(0, 2);
          let endTime = this.timingList[i]['endTime'];
          endTime = endTime.replace(/:/g, '');
          endTime = endTime.substring(0, 2);

        }
        let date = new Date();
        let day = date.getDay();
        //===========End Chamber Timing starting and ending timeslots==============

        //===========Set average visit duration==============
        this.averageVisitDuration = res["data"].averageVisitDuration;
        this.hourSegments = 60 / this.averageVisitDuration;
        //===========End average visit duration==============

        //===========Set Chamber Pk==============
        this.chamberRefNoForDoctor = res["data"].chamberRefNo;
        //===========End Set Chamber Pk==============
        this.refresh.next();
        //this.loading = false;
        //document.body.classList.remove('hide-bodyscroll');
      });
  }

  isValidSegmentClicked(day, time) {
    let isValid: boolean = false;
    for (let i = 0; i < this.timingList.length; i++) {
      let val = this.timingList[i];
      let dayOfweek = val['dayOfWeek'];
      let stTime = val['startTime'];
      let endTime = val['endTime'];
      if ((day == 'Sun' && dayOfweek == '7') || (day == 'Mon' && dayOfweek == '1') ||
        (day == 'Tue' && dayOfweek == '2') || (day == 'Wed' && dayOfweek == '3') ||
        (day == 'Thu' && dayOfweek == '4') || (day == 'Fri' && dayOfweek == '5') ||
        (day == 'Sat' && dayOfweek == '6')) {
        if (time >= stTime && time < endTime) {
          isValid = true;
        }
      }
    }
    return isValid;
  }
  setDay() {
    this.view = CalendarView.Day;
    //Working on app/issues/1281
    this.nextPrevDateChange(this.viewDate);
    //End Working on app/issues/1281
    let date = new Date();
    let day = date.getDay();

    this.minDayStartTime = this.minStartTime;
    this.maxDayEndTime = this.maxEndTime;
    for (let i = 0; i < this.timingList.length; i++) {
      let val = this.timingList[i];
      let dayOfweek = val['dayOfWeek'];
      let stTime = val['startTime'];
      stTime = stTime.replace(/:/g, '').substring(0, 2);
      stTime = parseInt(stTime);
      let endTime = val['endTime'];
      endTime = endTime.replace(/:/g, '').substring(0, 2);;
      endTime = parseInt(endTime);

      if (dayOfweek == day) {
        this.minDayStartTime = stTime;
        this.maxDayEndTime = endTime;
      }
    }
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    //Working on app/issues/1086    
    this.setCurrentTimeSlotForWeekView(renderEvent); // to make current slot highlighted    
    this.weekViewRenderEvent = renderEvent;
    // End Working on app/issues/1086
    let res = this.timingList;
    for (let i = 0; i < res.length; i++) {
      let stTime = (res[i]['startTime']).split(":")
      stTime = new Date(0, 0, 0, stTime[0], stTime[1], 0);
      let endTime = (res[i]['endTime']).split(":");
      endTime = new Date(0, 0, 0, endTime[0], endTime[1], 0);

      let dayOfWeek = res[i]['dayOfWeek'];

      renderEvent.hourColumns.forEach(hourColumn => {
        hourColumn.hours.forEach(hour => {
          hour.segments.forEach(segment => {
            let segmentDateObj = segment.date;
            if (dayOfWeek == segmentDateObj.getDay()) {
              let segmentTime = new Date(0, 0, 0, segmentDateObj.getHours(), segmentDateObj.getMinutes(), 0);

              let now = new Date();
              let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              let segmentDate = new Date(segmentDateObj.getFullYear(), segmentDateObj.getMonth(), segmentDateObj.getDate())
              if (segmentTime.getTime() >= stTime.getTime() &&
                segmentTime.getTime() < endTime.getTime() &&
                segmentDate >= todayDate) {
                segment.cssClass = 'available-slot';
              }
            }
          });
        });
      });
    }
  }

  rejectOrCancelDoctorAppointment(appointmentState) {
    let stateTxt = appointmentState == this.APP_STATE.CANCELLED ? 'cancel' : 'reject';
    let stateSuccessTxt = appointmentState == this.APP_STATE.CANCELLED ? 'cancelled' : 'rejected';

    if (confirm('Are you sure you want to ' + stateTxt + ' this appointment?')) {
      this.modalRef.hide();
      this.isModalOpened = false;
      let query = {
        appointmentCxlByRefNo: this.loggedInUser.refNo,
        appointmentCxlReason: this.appointmentForm.value.appointmentCxlReason,
        appointmentRefNo: this.appointmentForm.value.appointmentRefNo,
        appointmentState: appointmentState,
        entityName: this.loggedInUser.entityName
      }
      this.appoinmentService.deleteAppoinment(query).subscribe((data) => {
        let query = this.appointmentForm.value;
        let clickedEvent: any;
        // Issue app#844
        this._toastService.showI18nToast('Appointment ' + stateSuccessTxt + ' successfully', "success");
        if (query.appointmentRefNo != null) {
          this.events.forEach(function (e) {
            if (e.meta.appointmentRefNo == query.appointmentRefNo) {
              clickedEvent = e;
            }
          });
          this.events.splice(this.events.indexOf(clickedEvent), 1);
          this.refresh.next();
        }
      });
    }
  }

  manageDoctorAppointment(appointmentState) {
    let query = this.appointmentForm.value;
    this.modalRef.hide();
    this.isModalOpened = false;
    let payload = {
      appointmentRefNo: this.appointmentForm.value.appointmentRefNo,
      appointmentState: appointmentState
    }
    this._doctorService.manageAppoinment(payload).subscribe((data) => {
      if (data['status'] == '2000') {
        if (data['data'].appointmentState === this.APP_STATE.VIP) {
          // sbis-poc/app/issues/1074
          localStorage.setItem("userRefNo", query.userRefNo);
          localStorage.setItem("appointmentRefNo", data['data'].appointmentRefNo);
          this.router.navigate(['doctor/prescription']);
        }
        else if (data['data'].appointmentState === this.APP_STATE.CONFIRMED) {
          // app#894
          this._toastService.showI18nToastFadeOut('APPOINTMENT.APPOINTMENT_CREATED', "success");
          let clickedEvent: any;
          if (query.appointmentRefNo != null) {
            this.events.forEach(function (e) {
              if (e.meta.appointmentRefNo == query.appointmentRefNo) {
                clickedEvent = e;
              }
            });
            this.events.splice(this.events.indexOf(clickedEvent), 1);
          }
          this.events.push(
            {
              start: addHours(startOfDay(query.appointmentDate),
                parseInt(query.appointmentTime.substring(0, 2)) + parseInt(query.appointmentTime.substring(3, 5)) / 60),
              title: data['data'].appointmentState == this.APP_STATE.REQUESTED
                ? 'Appointment Request from ' + query.patientName + ''
                : data['data'].appointmentState == this.APP_STATE.CONFIRMED
                  ? 'Appointment for ' + query.patientName + ''
                  : data['data'].appointmentState == this.APP_STATE.VIP
                    ? 'Visit in-Progress for ' + query.patientName + ''
                    : 'Visit Completed for ' + query.patientName + '',

              color: data['data'].appointmentState == this.APP_STATE.CONFIRMED
                ? colors.CONFIRMED
                : data['data'].appointmentState == this.APP_STATE.COMPLETED
                  ? colors.COMPLETED
                  : data['data'].appointmentState == this.APP_STATE.VIP
                    ? colors.VIP
                    : colors.REQUESTED,
              actions: this.actions,
              meta: {
                appointmentBy: query.appointmentBy,
                appointmentByRefNo: query.appointmentByRefNo,
                appointmentCxlBy: query.appointmentCxlBy,
                appointmentCxlDateTime: query.appointmentCxlDateTime,
                appointmentCxlReason: query.appointmentCxlReason,
                appointmentRefNo: query.appointmentRefNo,
                chamberRefNo: query.chamberRefNo,
                doctorRefNo: query.doctorRefNo,
                userRefNo: query.userRefNo,
                status: query.status,
                remarks: query.remarks,
                appointmentDate: query.appointmentDate,
                appointmentTime: query.appointmentTime,
                totalFees: query.totalFees,
                patientName: query.patientName,
                appointmentState: data['data'].appointmentState,
                patientContactNo: query.patientContactNo,

                patientDateOfBirth: query.patientDateOfBirth,
                patientGender: query.patientGender,
              }
            }
          );
          this.refresh.next();
        }

        /*if(("onlineDoc" in localStorage) && ("offlineStatus" in localStorage) ){
          localStorage.removeItem("onlineDoc");
          localStorage.removeItem("offlineStatus");
        }*/

        this.videoStart = this.appointmentForm.controls.onlineConsultationFlag.value;
        //console.log(this.videoStart);

        if(!this.videoStart){
          localStorage.setItem("online", SBISConstants.YES_NO_CONST.NO_ENUM);
          //localStorage.setItem("offlineStatus", SBISConstants.YES_NO_CONST.YES_ENUM);
        }else{
          localStorage.setItem("online", SBISConstants.YES_NO_CONST.YES_ENUM);
        }
      }
    });
  }

  setFeedback() {
    let query = {
      "userRefNo": this.user_refNo,
      "rolePk": this.user_rolePk,
      "feedback": this.feedbackForm.get('myFeedback').value
    }
    if (this.isUpload == true) {// comment with attached document
      this.onSubmit(query);
    } else {
      this._doctorService.setFeedback(query).subscribe((resp) => {
        if (resp.status == 2000) {
          this.feedbackForm.patchValue({
            'myFeedback': ""
          });
          this.getFeedBack();
        }
      });
    }
  }

  getFeedBack() {
    let query = {
      "userRefNo": this.user_refNo
    }
    this._doctorService.getFeedback(query).subscribe((result) => {
      if (result.status === 2000) {
        this.feedbackButton = false;
        let index: number = 0;
        for (let feedbackDate of result.data) {
          result.data[index].feedbackTime = new Date(feedbackDate.feedbackTime);
          index = index + 1;
        }
        this.feedbacks = result.data.reverse();
      }
    })
  }

  feedbackFileSelected(event) {
    let fileEvent = event.target.files[0];
    if ((fileEvent.type == "image/jpeg") || (fileEvent.type == "application/pdf") || (fileEvent.type == "image/png")) {
      //do nothing
    } else {
      this._toastService.showI18nToast("File type should be jpg/png/pdf", "warning");
      return;
    }
    if (fileEvent.size > 2000000) {
      this._toastService.showI18nToast("File size will not more then 2mb", "warning");
      return;
    }
    this.feedbackForm.patchValue({
      file: event.target.files[0]
    });
    this.selectedFiles = fileEvent.name;
    this.isUpload = true;
  }

  onSubmit(query) {
    let valueData = this.feedbackForm.value;

    let formdata = new FormData();
    let feedbackFileUpload = JSON.stringify({
      "userRefNo": this.user_refNo,
      "rolePk": this.user_rolePk,
      "feedback": this.feedbackForm.get('myFeedback').value,
      "fileUploadFor": "FEEDBACK"
    });

    formdata.append('file', valueData.file);
    formdata.append('document', feedbackFileUpload);


    this.uploadDocumentWithComment(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.feedbackForm.reset();
          this.selectedFiles = "";
          this.isUpload = false;
          this.getFeedBack();
        } else {
          this._toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  uploadDocumentWithComment(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      responseType: 'text'
    });
    return this.http.request(req);
  }

  downloadFile(feedback) {
    let query = {
      downloadFor: "FEEDBACK",
      feedbackRefNo: feedback.refNo
    }
    this._doctorService.feedbackDownloadFile(query).subscribe((resp) => {
      if (resp.status == 2000) {
        const link = document.createElement('a');
        link.href = "data:" + resp.data.contentType + ";base64," + resp.data.data;
        link.download = resp.data.fileName;
        link.click();
      }
    });
  }

  feedbackTextField() {
    if (this.feedbackForm.get('myFeedback').value != "") {
      this.feedbackButton = true;
    } else {
      this.feedbackButton = false;
    }
  }

  dob: any;
  age: any;
  enableDob() {
    this.dob = this.appointmentForm.get('patientDateOfBirth').value;

    if (this.dob === null || this.dob === "" || this.dob === undefined) {
      document.getElementById('age').setAttribute('disabled', 'true');
      if (document.getElementById('dob') != null) {
        document.getElementById('dob').removeAttribute('id');
      }
    }
  }


  enableAge() {
    this.age = this.appointmentForm.get('patientAgeInMonth').value;

    if (this.age === null || this.age === "" || this.age === undefined) {
      document.getElementById('age').removeAttribute('disabled');
      if (document.getElementById('dob') != null) {
        document.getElementById('dob').removeAttribute('id');
      }
    }
  }

  //Working on app/issues/1086
  setCurrentTimeSlotForWeekView(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    let now = new Date();
    let previousSegemnet = null;
    renderEvent.hourColumns.forEach(hourColumn => {
      hourColumn.hours.forEach(hour => {
        if (previousSegemnet == null) {
          previousSegemnet = hour.segments[0];
        }
        hour.segments.forEach(segment => {
          if (now.getDay() == segment.date.getDay()) {
            if (segment.date.getTime() >= now.getTime() && previousSegemnet.date.getTime() <= now.getTime()) {
              previousSegemnet.cssClass = 'currentSlot';
            }
          }
          previousSegemnet = segment;
        });
      });
    });
    let el = document.getElementsByClassName('currentSlot');
    if (el.length > 0) {
      el[0].scrollIntoView();
    }

  }

  setCurrentTimeSlotForDayView(renderEvent: CalendarDayViewBeforeRenderEvent) {

    let now = new Date();
    let previousSegemnet = null;

    renderEvent.body.hourGrid.forEach(hour => {
      if (previousSegemnet == null) {
        previousSegemnet = hour.segments[0];
      }
      hour.segments.forEach(segment => {
        if (now.getDay() == segment.date.getDay()) {
          if (segment.date.getTime() >= now.getTime() && previousSegemnet.date.getTime() <= now.getTime()) {
            previousSegemnet.cssClass = 'currentSlot';
            previousSegemnet.title = 'Present Slot';
          }
        }
        previousSegemnet = segment;
      });
    });
    let el = document.getElementsByClassName('currentSlot');
    if (el.length > 0) {
      el[0].scrollIntoView();
    }
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    this.dayViewRenderEvent = renderEvent;
    this.setCurrentTimeSlotForDayView(renderEvent) // to make current slot highlighted
  }

  callSetCurrentTimeSlotForDayViewByTimeInterval() {
    const source = timer(1000, 1000);
    this.autoTimerSubscription = source.subscribe(val => {
      this.setCurrentTimeSlotForDayView(this.dayViewRenderEvent)
    });
  }

  callSetCurrentTimeSlotForWeekViewByTimeInterval() {
    const source = timer(1000, 1000);
    this.autoTimerSubscription = source.subscribe(val => {
      this.setCurrentTimeSlotForWeekView(this.weekViewRenderEvent)
    });
  }


  ngOnDestroy() {
    // this.autoTimerSubscription.unsubscribe();
    this.childSubscription.unsubscribe();
  }

  //End Working on app/issues/1086

  // Working on app/issues/1185
  displaySidebarInvoice: boolean = false;
  appointmentRefNo: any;
  invoiceList: any = [];
  showInvoice(appointmentRefNo) {
    this.displaySidebarInvoice = true;
    this.appointmentRefNo = appointmentRefNo;
    let payload = {
      appointmentRefNo: this.appointmentRefNo
    }
    this.serviceProviderService.getInvoiceListByAppointmentRefNo(payload).subscribe(res => { // Working on app/issue/1914
      this.invoiceList = res["data"];
    });
  }
  closeInvoice() {
    this.displaySidebarInvoice = false;
  }
  //End Working on app/issues/1185

  // Working on app/issues/1281
  fromDate: any;
  toDate: any;
  nextPrevDateChange(d) {
    this.activeDayIsOpen = false
    var stDate = null;
    var endDate = null;
    if (this.view == CalendarView.Month) {
      stDate = new Date(d.getFullYear(), d.getMonth(), 1);
      endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      this.fromDate = new Date(stDate).getFullYear() + '-' + ('0' + (new Date(stDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(stDate).getDate()).slice(-2);
      this.toDate = new Date(endDate).getFullYear() + '-' + ('0' + (new Date(endDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(endDate).getDate()).slice(-2);
      // console.log(this.fromDate);
      // console.log(this.toDate);
    }
    if (this.view == CalendarView.Week) {

      var day = d.getDay();
      stDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + ((day == 0 ? 0 : 7) - day) - 7);
      endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + ((day == 0 ? 0 : 6) - day));
      this.fromDate = new Date(stDate).getFullYear() + '-' + ('0' + (new Date(stDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(stDate).getDate()).slice(-2);
      this.toDate = new Date(endDate).getFullYear() + '-' + ('0' + (new Date(endDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(endDate).getDate()).slice(-2);
      // console.log(this.fromDate);
      // console.log(this.toDate);
    }
    if (this.view == CalendarView.Day) {
      this.fromDate = new Date(d).getFullYear() + '-' + ('0' + (new Date(d).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(d).getDate()).slice(-2);
      this.toDate = new Date(d).getFullYear() + '-' + ('0' + (new Date(d).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(d).getDate()).slice(-2);
      // console.log(this.fromDate);
      // console.log(this.toDate);
    }
    this.fetchAppointments();
  }


  fetchAppointments() {
    this.events = [];
    let payload = {};
    if (this.entityName == 'DOCTOR') {
      payload = {
        "refNo": this.loggedInUser.refNo,
        "entityName": this.loggedInUser.entityName,
        "roleName": this.loggedInUser.roleName,
        "fromDate": this.fromDate,
        "toDate": this.toDate
      }
    }
    if (this.entityName == 'HOSPITAL') {
      payload = {
        "refNo": this.doctorRefNo,
        "entityName": this.loggedInUser.entityName,
        "roleName": this.loggedInUser.roleName,
        "opdRefNo": (this.loggedInUser.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR)? 
        this.childSpRefNo : this.loggedInUser.serviceProviderRefNo,
        "fromDate": this.fromDate,
        "toDate": this.toDate
      }
    }

    this._doctorService.getDoctorAppointmentsV3(payload).subscribe(res => {
      // console.log("APPOINTMENT", res['data']);
      this.events = []; // Working on app/issue/1893
      let appointmentList = res['data'].appointmentList;

      for (let i = 0; i < appointmentList.length; i++) {
        if (appointmentList[i].appointmentState == this.APP_STATE.CANCELLED || appointmentList[i].appointmentState == this.APP_STATE.REJECTED) {
          continue;
        }

        this.events.push(
          {
            start: addHours(startOfDay(appointmentList[i].appointmentDate),
              parseInt(appointmentList[i].appointmentTime.substring(0, 2)) + parseInt(appointmentList[i].appointmentTime.substring(3, 5)) / 60),
            title: appointmentList[i].appointmentState == this.APP_STATE.REQUESTED
              ? 'Appointment Request from ' + appointmentList[i].patientName + ''
              : appointmentList[i].appointmentState == this.APP_STATE.CONFIRMED
                ? 'Appointment for ' + appointmentList[i].patientName + ''
                : appointmentList[i].appointmentState == this.APP_STATE.VIP
                  ? 'Visit in-Progress for ' + appointmentList[i].patientName + ''
                  : 'Visit Completed for ' + appointmentList[i].patientName + '',

            color: appointmentList[i].appointmentState == this.APP_STATE.CONFIRMED
              ? colors.CONFIRMED
              : appointmentList[i].appointmentState == this.APP_STATE.COMPLETED
                ? colors.COMPLETED
                : appointmentList[i].appointmentState == this.APP_STATE.VIP
                  ? colors.VIP
                  : colors.REQUESTED,
            actions: this.actions,
            meta: {
              appointmentRefNo: appointmentList[i].appointmentRefNo,
              doctorRefNo: this.doctorRefNo,
              appointmentDate: appointmentList[i].appointmentDate,
              appointmentTime: appointmentList[i].appointmentTime,
              patientName: appointmentList[i].patientName,
              appointmentState: appointmentList[i].appointmentState
            }
          }
        );
        this.refresh.next();
      }
      //this.loading = false;
      //document.body.classList.remove('hide-bodyscroll');
    }
    );
  }

  viewPrescription(appointmentRefNo) {
    this.customType = ""; //Working on app/issues/1267
    // alert(appointmentRefNo);
    this.appRefNo = appointmentRefNo;
    //this.router.navigate(['/doctor/prescriptionpreview', pp.appointmentRefNo]);
    this.modalRef.hide();
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    //alert(appointmentRefNo);
    //this.router.navigate(['/doctor/prescriptionpreview', appointmentRefNo]);
  }

  editPrescription(query, appRefNo) {
    // sbis-poc/app/issues/1074
    this.modalRef.hide();
    localStorage.setItem("userRefNo", query.userRefNo);
    localStorage.setItem("appointmentRefNo", appRefNo);
    this.router.navigate(['doctor/prescription']);
  }


  monthView() {
    this.view = CalendarView.Month;
    // console.log(this.viewDate);
    this.nextPrevDateChange(this.viewDate);
  }
  weekView() {
    this.view = CalendarView.Week;
    // console.log(this.viewDate);
    this.nextPrevDateChange(this.viewDate);
  }

  emitUserAddressDetails(selectedAddress) {
    this.appointmentForm.patchValue({
      userAddressPk: selectedAddress == null ? null : selectedAddress.id,
    })

  }
  //End Working on app/issues/1281



  // Working on app/issue/2354

  checkHolidayByAppointmentDateAndChamber() {
    let payload = {
      chamberRefNo: this.appointmentForm.value.chamberRefNo,
      appointmentDate: this.appointmentForm.value.appointmentDate
    }
    this._doctorService.checkHolidayByAppointmentDateAndChamber(payload).subscribe(res => {
      if (res.data > 0) {

        if (res.message != null)
          this._toastService.showI18nToast(res.message, 'warning');
      }
    }, error => {
      console.log(error);

    });
  }
  // End Working on app/issue/2354

}
