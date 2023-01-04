import { Observable } from 'rxjs';
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
import 'rxjs/add/observable/interval';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { AppoinmentService } from './appoinment.service';
import { ToastService } from '../../core/services/toast.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../shared/directive/modal/modal.service';
import { IndividualService } from './../individual/individual.service';
import { PaymentService } from './../payment/payment.service';
import { UtilsFactory } from './../../core/utils/factory';
import { AuthService } from './../../auth/auth.service';
import { environment } from '../../../environments/environment';
import { SearchService } from '../search/search.service';
import { BroadcastService } from './../../core/services/broadcast.service';
import { GetSet } from './../../core/utils/getSet';
import { ActivatedRoute, Router } from "@angular/router";
import { SBISConstants } from 'src/app/SBISConstants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonTranslation } from '../../shared/translation';
import { ServiceProviderService } from '../service-provider/service-provider.service';
import { DoctorService } from '../doctor/doctor.service';
import { element } from '@angular/core/src/render3';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-appoinment',
  templateUrl: './appoinment.component.html',
  styleUrls: ['./appoinment.component.css']
})
export class AppoinmentComponent implements OnInit,OnDestroy {
  @ViewChild('giveRatingTemplate') giveRatingTemplate: TemplateRef<any>;
  @ViewChild('bookAppoinmentModal') bookAppoinmentModal: TemplateRef<any>;
  // sbis-poc/app/issues/594
  @ViewChild('problemNarration') problemNarration: TemplateRef<any>;
  @ViewChild('someVar') el: ElementRef;


  editRating: any;
  ratingReview: any;
  reviewTitle: any;
  minDate = new Date();
  dateFormat;
  appRefNO: any;
  editp: any[];
  calenderList: any[];
  appoinmentList: any[]=[];
  user_id: any;
  userRefNo: any;
  appointmentCancelBy: any;
  apStatus: any;
  refund_Request: any;
  appointmentRefNo: any;
  appointmentCxlReason: any;
  appointment_State: any;
  modalRef: BsModalRef;
  ratingList = [];
  memberMyselfButton: any = false;
  allDataFetched: boolean = false;
  appointmentDetails: any = null;
  minorCount: number;
  appAppointment: any = {
    userPk: null,
    appointmentRefNo: null,
    chamberRefNo: null,
    doctorRefNo: null,
    appointmentDate: new Date(),
    remarks: "General Check-Up",
    appointmentTime: '',
    timeTo: '',
    appointmentBy: null,
    totalFees: 0,
    status: "REQ",
    fullTime: null
  };
  appSIgnUp: any = {
    userName: '',
    mobileNo: '',
    firstName: '',
    password: 'test1234',
    registrationProvider: 'SBIS',
    userType: 'SUDO'
  };
  appointmentId: any = null;
  status: String = '';
  paymentMode: String = '';
  paytmRespObj: any = {};

  appoinmentFilter: any = {
    appStatus: [],
    appDoctorName: [],
    appChamberName: [],
  };
  appoinmentListCopy: any[] = [];
  appoinmentStatusFilterData: any = [];
  appoinmentDoctorFilterData: any = [];
  appoinmentChamberFilterData: any = [];
  appoinmentsFilterByStatus: any[] = [];
  appoinmentsFilterByDoctor: any[] = [];
  appoinmentsFilterByChamber: any[] = [];
  triggeringActionType: any = "APPOINTMENT";
  // sbis-poc/app/issues/594
  problemNarrationForm: FormGroup;
  selectedFiles: any;
  isUpload: any = false;
  rolePk: any;
  myNarration: boolean = false;
  appointment: any;
  problemNarrations: any;
  roleName: any;
  // appointmentForType: string;
  isDoctorNarrate: boolean = false;
  confirmationMsg: any = [];
  headingsArray: any[] = [];//to display the headings on right side
  appointmentFor: string;
  headingToDisplay: string = "My Appointments"; //to display the heading on html page
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  previewModalRef: BsModalRef;
  @ViewChild('previewModal') previewModal: TemplateRef<any>;
  appRefNo: any;
  // sbis-poc/app/issues/594
  previewProblemNarration: any;
  isAnyDoctorComment: any = false;
  isAnyIndividualComment: any = false;
  patientTime: any;
  patientName: any;
  doctorTime: any;
  doctorName: any;
  orderState: any = {};
  orderStateOutForDelivery: any;
  SBISConstantsRef = SBISConstants;
  visibleSidebarAppointmentDetails: boolean = false;
  loading: boolean = false;
  mySelectedAppointmentDetails: any;
  onlineAppointmentsSubscriber: any;
  appoinmentTypeLists: any = [];
  appoinmentUser = {
    userType: null,
    userName: "",
    emailAddress: "",
    contactNo: "",
    firstName: "",
    lastName: "",
    searchText: "",
    existingUser: null
  };
  appoinment = null;

  constructor(
    private appoinmentService: AppoinmentService,
    private toastService: ToastService,
    private searchService: SearchService,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private _modalService: ModalService,
    private _authService: AuthService,
    private _paymentService: PaymentService,
    private _individualService: IndividualService,
    private broadcastService: BroadcastService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private jsonTranslate: JsonTranslation,
    private _serviceProvider: ServiceProviderService,
    private doctorService: DoctorService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.dateFormat = environment.DATE_FORMAT;
    this.orderState = SBISConstants.ORDER_STATE;
    this.orderStateOutForDelivery = SBISConstants.ORDER_STATE_OUT_FOR_DELIVERY;
  }
  ngOnDestroy(): void {
    if(this.onlineAppointmentsSubscriber) { /* Avoid producing a console error if we try to close a subscription that is already closed. */
      this.onlineAppointmentsSubscriber.unsubscribe();
    }
  }//end of ondestroy
  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.loadInitialData();
  }//end of oninit



  //method to load initial data
  loadInitialData() {
    this.broadcastService.setHeaderText('Appointment Details');
    this.appointmentFor = SBISConstants.MY_PRESCRIPTION_CONST.OWN;
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.userRefNo = user.refNo;
    this.rolePk = user.rolePk;
    this.roleName = user.roleName;
    GetSet.setTriggeringActionType("APPOINTMENT");
    GetSet.setAdvancePay(false);
    // this.appointmentForType = "myself";
    this.appointmentCancelBy = user.appointmentCxlBy;
    this.apStatus = user.status;
    this.refund_Request = user.refundRequest;
    this.appointmentRefNo = user.appointmentRefNo;
    this.appointmentCxlReason = user.appointmentCxlReason;
    this.appointment_State = user.appointmentState;
    this.loadAppoinmentData();
    this.loadRatingData();
    this.minorCount = GetSet.getMinorCount();
    // sbis-poc/app/issues/594
    this.problemNarrationForm = this.fb.group({
      patientProblemNarration: [],
      doctorProblemNarration: [],
      file: [null]
    });
    this.problemNarrationForm.controls["patientProblemNarration"].valueChanges.subscribe(value => {
      this.myNarration = true;
      if (typeof value === "undefined" || value == null || value.replace(/^\s+|\s$/g, "") == "") {
        this.myNarration = false;
      }
    });
    this.problemNarrationForm.controls["doctorProblemNarration"].valueChanges.subscribe(value => {
      this.myNarration = true;
      if (typeof value === "undefined" || value == null || value.replace(/^\s+|\s$/g, "") == "") {
        this.myNarration = false;
      }
    });
    this.constructHeadingsArray();
  }//end of method

  //method to construct headers array -- to display the headers to the right side of the page
  constructHeadingsArray() {
    this.headingsArray.push({ appointmentFor: SBISConstants.MY_PRESCRIPTION_CONST.OWN, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.OWN_LABEL });
    this.headingsArray.push({ appointmentFor: SBISConstants.MY_PRESCRIPTION_CONST.GROUP, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.GROUP_LABEL });
    this.headingsArray.push({ appointmentFor: SBISConstants.MY_PRESCRIPTION_CONST.MINOR, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.MINOR_LABEL });
    this.headingsArray.push({ appointmentFor: SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE_LABEL });
  }//end of method

  //method to set the data according to second header click
  onClickSecondHeader(clickedPrescriptionForLabelName: string) {
    this.loading=true;
    document.body.classList.add('hide-bodyscroll');
    this.appointmentFor = clickedPrescriptionForLabelName;
    this.loadAppoinmentData();
  }//end of method 

  // sbis-poc/app/issues/594
  openPreview(problemNarration: any) {
    this.previewProblemNarration = problemNarration;
    this.previewModalRef = this.bsModalService.show(this.previewModal, { class: 'modal-lg' });
  }

  getUrl(problemNarration: any, prefix: string, postfix: string) {
    let url: string = 'data:' + problemNarration["fileType"] + ';base64,' + problemNarration["fileResponseBody"];
    if (typeof prefix !== "undefined" && prefix != null && prefix != "") {
      url = prefix + url;
    }
    if (typeof postfix !== "undefined" && postfix != null && postfix != "") {
      url = url + postfix;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  problemNarrationFileSelected(event) {
    let fileEvent = event.target.files[0];
    if ((fileEvent.type == "image/jpeg") || (fileEvent.type == "application/pdf") || (fileEvent.type == "image/png")) {
      //do nothing
    } else {
      this.toastService.showI18nToast("File type should be jpg/png/pdf", "warning");
      return;
    }
    if (fileEvent.size > 2000000) {
      this.toastService.showI18nToast("File size will not more then 2mb", "warning");
      return;
    }
    this.problemNarrationForm.patchValue({
      file: event.target.files[0]
    });
    this.selectedFiles = fileEvent.name;
    this.isUpload = true;
  }

  onSubmit() {
    let valueData = this.problemNarrationForm;
    let formdata = new FormData();
    let prescriptionFileUpload = JSON.stringify({
      "narration": this.roleName == "DOCTOR" ? valueData.get("doctorProblemNarration").value : valueData.get("patientProblemNarration").value,
      "userRefNo": this.userRefNo,
      "userRole": this.rolePk,
      "appoinmentRefNo": this.appointment["appointmentRefNo"],
      "fileUploadFor": "PATIENT_PROBLEM_NARRATION"
    });
    if (this.isUpload == true) {
      formdata.append('file', valueData.value.file);
    }
    formdata.append('document', prescriptionFileUpload);
    this.uploadDocumentWithComment(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.problemNarrationForm.reset();
          this.problemNarrationForm.get("file").reset();
          this.myNarration = false;
          this.isAnyDoctorComment = false;
          this.isAnyIndividualComment = false;
          this.problemNarrationForm.patchValue({ patientProblemNarration: "" });
          this.problemNarrationForm.patchValue({ doctorProblemNarration: "" });
          if (this.roleName == "DOCTOR") {
            this.toastService.showI18nToast("Your message is submitted successfully to the Patient", 'success');
          }
          else {
            this.toastService.showI18nToast("Your message is submitted successfully to the Doctor", 'success');
          }
          this.appoinmentService.fetchAllProblemNarration(this.appointment["appointmentRefNo"]).subscribe(result => {
            if (result.status == 2000) {
              if (result.data.length > 0) {
                let isDoctorCommented = result.data.find(x => x.createdByUserRole == "DOCTOR");
                isDoctorCommented ? this.isDoctorNarrate = true : this.isDoctorNarrate = false;
              } else {
                this.isDoctorNarrate = false;
              }
              this.problemNarrations = result.data;
              this.selectedFiles = "";
              let arrOfProblems: any[] = this.problemNarrations;
              this.modalRef.hide();
              for (let i = 0; i < arrOfProblems.length; i++) {
                let problem = arrOfProblems[i];
                if (problem["createdByUserRole"] == "DOCTOR") {
                  this.isAnyDoctorComment = true;
                  this.problemNarrationForm.patchValue({ doctorProblemNarration: problem["narration"] });
                  this.patientName = problem["createdBYUserName"];
                  this.patientTime = problem["createdDate"];
                }
                else if (problem["createdByUserRole"] == "INDIVIDUAL") {
                  this.isAnyIndividualComment = true;
                  this.problemNarrationForm.patchValue({ patientProblemNarration: problem["narration"] });
                  this.patientName = problem["createdBYUserName"];
                  this.patientTime = problem["createdDate"];
                }
              }
            }
          });
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  uploadDocumentWithComment(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'v1/patient/save-problem-narration', formData, {
      responseType: 'text'
    });
    return this.http.request(req);
  }

  problemNarrationComment() {
    this.onSubmit();
  }

  onCloseOverlay(pupUpId: any) {
    // this._modalService.close(pupUpId);
    pupUpId.hide();
  }

  onClosePopUp(pupUpId: string) {
    this._modalService.close(pupUpId);
  }

  loadAppoinmentData() {
    this.appoinmentService.retrieveAppointmentsOfInUsers(this.appointmentFor).subscribe((result) => {
      if (result.status === 2000) {
        result.data.forEach(element => {
          element['due'] = (+element.netAmount) - (+element.paidAmount);
          if(!element.onlineConsultation) {
            element.onlineConsultation = 'N'
          }
        });
        result.data.sort((a, b) => {
          const d1 = new Date(a.appointmentDate);
          const d2 = new Date(b.appointmentDate);
          return (d1.getTime() - d2.getTime()) * -1;
        });

        switch (this.appointmentFor) {
          case SBISConstants.MY_PRESCRIPTION_CONST.OWN: {
            this.headingToDisplay = 'My Appointments';
            result.data = this.calculateOutstandingAmount(result.data);//to calculate outstanding amount
            this.memberMyselfButton = false;
            // this.conStructAppointmentData(result);
            break;
          } case SBISConstants.MY_PRESCRIPTION_CONST.GROUP: {
            this.headingToDisplay = 'Group Member Appointments';
            this.memberMyselfButton = true;
            // this.conStructAppointmentData(result);
            break;
          } case SBISConstants.MY_PRESCRIPTION_CONST.MINOR: {
            this.headingToDisplay = 'Minor Appointments';
            this.memberMyselfButton = true;
            break;
          }
          case SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE: {
            this.headingToDisplay = 'Associate Appointments';
            this.memberMyselfButton = true;
            break;
          }
        }//end of switch
        this.conStructAppointmentData(result);

      }else{
        this.loading=false;
        document.body.classList.remove('hide-bodyscroll');
      }//end of status check
    });
  }//end of method

  //Mysel
  conStructAppointmentData(result) {
    this.appoinmentList = result.data;
    this.appoinmentListCopy = [...this.appoinmentList];
    // showing filter with unique values
    // generate array by filtering unique appoinment status 
    Observable.merge(this.appoinmentList)
      .distinct((x: any) => x.appointmentState)
      .subscribe(y => {
        this.appoinmentStatusFilterData.push(y);
      });
    // generate array by filtering unique appoinment Doctors 
    Observable.merge(this.appoinmentList)
      .distinct((x: any) => x.doctorName)
      .subscribe(y => {
        this.appoinmentDoctorFilterData.push(y);
      });

    // generate array by filtering unique appoinment Chambers
    Observable.merge(this.appoinmentList)
      .distinct((x: any) => x.chamberName)
      .subscribe(y => {
        this.appoinmentChamberFilterData.push(y);
      });
    this.loading=false;
    document.body.classList.remove('hide-bodyscroll');
    this.allDataFetched = true;
    if(GetSet.getVideoChatBooleanFromRazorPay()) {
      let data = GetSet.getVideoChatData();
      let appointment = this.appoinmentList.find(x => x.appointmentRefNo == data.appointmentRefNo);
      console.log(appointment);
      this.onChatClick(appointment);
      GetSet.setVideoChatData(null);
      GetSet.setVideoChatBooleanFromRazorPay(false);
    }

    this.onlineAppointmentTimerCall();
  }//end of method
  onlineAppointmentTimerCall() {
    this.onlineAppointmentsSubscriber = Observable.interval(60000)
    .subscribe((val) => { this.checkOnlineAppointmentsWSCall(); });
  }//end of method

  //calculate outstanding amount
  calculateOutstandingAmount(response): any {
    let index = 0;
    for (let resultData of response) {
      response[index]['outstandingAmount'] = ((response[index].netAmount) && (response[index].netAmount > 0)) ? ((+response[index].netAmount) - (+response[index].paidAmount)) : 0;
      index = index + 1;
    }//end of for
    return response;
  }//end of method

  changeAppoinmentStatusFilter(value: any, isChecked: boolean) {
    let a: any[] = [];
    this.appoinmentsFilterByStatus = [];
    if (isChecked) {
      this.appoinmentFilter.appStatus.push(value);
    } else {
      let index = this.appoinmentFilter.appStatus.findIndex(x => x === value);
      this.appoinmentFilter.appStatus.splice(index, 1);
    }

    for (let i = 0; i < this.appoinmentFilter.appStatus.length; i++) {
      a = this.appoinmentListCopy.filter(item => {
        return item.appointmentState.indexOf(this.appoinmentFilter.appStatus[i]) > -1;
      });
      for (let j = 0; j < a.length; j++) {
        if (this.appoinmentsFilterByStatus.indexOf(a[j]) === -1) {
          this.appoinmentsFilterByStatus.push(a[j]);
        }
      }
    }
    this.getDataOnChange();

  }
  changeAppoinmentDoctorFilter(value: any, isChecked: boolean) {
    let c: any[] = [];
    this.appoinmentsFilterByDoctor = [];
    if (isChecked) {
      this.appoinmentFilter.appDoctorName.push(value);
    } else {
      let index = this.appoinmentFilter.appDoctorName.findIndex(x => x === value);
      this.appoinmentFilter.appDoctorName.splice(index, 1);
    }
    for (let i = 0; i < this.appoinmentFilter.appDoctorName.length; i++) {
      c = this.appoinmentListCopy.filter(item => {
        return item.doctorName.indexOf(this.appoinmentFilter.appDoctorName[i]) > -1;
      });
      for (let j = 0; j < c.length; j++) {
        if (this.appoinmentsFilterByDoctor.indexOf(c[j]) === -1) {
          this.appoinmentsFilterByDoctor.push(c[j]);
        }
      }
    }
    this.getDataOnChange();
  }
  changeAppoinmentChamberFilter(value: any, isChecked: boolean) {
    let e: any[] = [];
    this.appoinmentsFilterByChamber = [];
    if (isChecked) {
      this.appoinmentFilter.appChamberName.push(value);
    } else {
      let index = this.appoinmentFilter.appChamberName.findIndex(x => x === value);
      this.appoinmentFilter.appChamberName.splice(index, 1);
    }
    for (let i = 0; i < this.appoinmentFilter.appChamberName.length; i++) {
      e = this.appoinmentListCopy.filter(item => {
        return item.chamberName.indexOf(this.appoinmentFilter.appChamberName[i]) > -1;
      });
      for (let j = 0; j < e.length; j++) {
        if (this.appoinmentsFilterByChamber.indexOf(e[j]) === -1) {
          this.appoinmentsFilterByChamber.push(e[j]);
        }
      }
    }
    this.getDataOnChange();
  }
  getDataOnChange() {
    this.appoinmentList = [];
    let newArray: any[] = [];
    if (this.appoinmentsFilterByStatus.length !== 0 && this.appoinmentsFilterByDoctor.length !== 0
      && this.appoinmentsFilterByChamber.length !== 0) {
      newArray = [...this.appoinmentsFilterByStatus, ...this.appoinmentsFilterByDoctor, ...this.appoinmentsFilterByChamber];
    } else if (this.appoinmentsFilterByDoctor.length === 0 && this.appoinmentsFilterByChamber.length === 0) {
      newArray = [...this.appoinmentsFilterByStatus];
    } else if (this.appoinmentsFilterByStatus.length === 0 && this.appoinmentsFilterByChamber.length === 0) {
      newArray = [...this.appoinmentsFilterByDoctor];
    } else if (this.appoinmentsFilterByStatus.length === 0 && this.appoinmentsFilterByDoctor.length === 0) {
      newArray = [...this.appoinmentsFilterByChamber];
    } else if (this.appoinmentsFilterByChamber.length === 0) {
      newArray = [...this.appoinmentsFilterByStatus, ...this.appoinmentsFilterByDoctor];
    } else if (this.appoinmentsFilterByStatus.length === 0) {
      newArray = [...this.appoinmentsFilterByDoctor, ...this.appoinmentsFilterByChamber];
    } else if (this.appoinmentsFilterByDoctor.length === 0) {
      newArray = [...this.appoinmentsFilterByStatus, ...this.appoinmentsFilterByChamber];
    } else {
      newArray = [];
    }
    if (this.hasDuplicates(newArray)) {
      this.appoinmentList = newArray.filter(function (value, index, self) {
        return (self.indexOf(value) !== index);
      });
    } else {
      this.appoinmentList = newArray;
    }
  }

  hasDuplicates(arr) {
    return arr.some(function (value, index, array) {
      return array.indexOf(value, index + 1) !== -1;
    });
  }
  loadRatingData() {
    this.appoinmentService.getRatingv2().subscribe((result) => {
      if (result.status === 2000) {
        this.ratingList = result.data;
        this.ratingList.forEach(item => {
          item["ratingParameterScore"] = 0;
        })
      }
    })
  }

  deleteAppoinment(appoinment: any) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      // let roleName: string = localStorage.getItem('roleName');
      let user = JSON.parse(localStorage.getItem('user'));
      let query = {
        // appointmentCxlBy: this.user_id,
        appointmentCxlByRefNo: this.userRefNo,
        // appointmentRefNo: appoinment.appointmentRefNo,
        appointmentRefNo: appoinment.appointmentRefNo,
        appointmentState: 'CXL',
        entityName: user.entityName
      }
      this.appoinmentService.deleteAppoinment(query).subscribe((data) => {
        if (data.status == 2000) {
          this.loadAppoinmentData();
          this.toastService.showI18nToast('TOAST_MSG.APPOINTMENT_CANCELED', 'success');
        }
        if (data.status == 5061) {
          this.loadAppoinmentData();
          this.toastService.showI18nToast(data.message, 'error');
        }
      });
    }
  }

  giveRating(appointment: any) {
    // this.modalRef = this.bsModalService.show(this.giveRatingTemplate, { class: 'modal-lg' });
    // this.modalRef["appoinment"] = appoinment;
    this.editRating = null;
    GetSet.setRatingFor('DOCTOR');
    this.appointment = appointment;
    this.ratingList.forEach(item => {
      item["ratingParameterScore"] = 0;
    });
    let query = {
      "triggeringRefNo": appointment.appointmentRefNo,
      "triggeringActionType": "APPOINTMENT"
    }
    this.appoinmentService.getAppointMentRatingV2(query).subscribe((result) => {
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

  /** editted by shanu */
  loadProfileImage(doctor) {
    doctor["profileImageSrc"] = "";
    // if (!doctor.msUserPk) return;
    let path: string = doctor.doctorRefNo + "/" + "DOCTOR";
    this.searchService.downloadProfilePhoto(path).subscribe(result => {
      if (result.status === 2000 && result.data != null && result.data.length > 0) {
        this.appoinment["profileImageSrc"] = "data:image/jpeg;base64," + result.data;
      }
    })
  }

  problemNarrationCommentDocDownload(problemNarration) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:' + problemNarration["fileType"] + ';base64,' + problemNarration["fileResponseBody"]);
    element.setAttribute('download', problemNarration["fileName"]);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  openModifyAppoinment(modalId: any, appoinment: any) {
    this.modalRef = this.bsModalService.show(this.bookAppoinmentModal, { class: 'modal-xl' });
    let user: any = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.appAppointment.userPk = user.id;
      this._individualService.getUserFullProfile(user.refNo).subscribe(res => {
        this.appSIgnUp.userName = res.data.firstName;
        this.appSIgnUp.mobileNo = res.data.contactNo;
      });
    }
    this.appAppointment.appointmentRefNo = appoinment.appointmentRefNo;
    this.appAppointment.appointmentDate = appoinment.appointmentDate;

    this.appoinmentService.findDoctorById(appoinment.doctorRefNo).subscribe(res => {//appoinment.doctorRefNo
      this.appointmentDetails = res;
      this.loadProfileImage(this.appointmentDetails);
      this.appointmentDetails['clinicList'] = [];
      this.appointmentDetails['timeList'] = [];
      this.appointmentDetails.doctorChamberList.forEach(item => {
        this.appointmentDetails['clinicList'].push({ id: item.refNo, label: item.hospitalName });
      });
      if (this.appointmentDetails.clinicList) {
        this.appAppointment.chamberRefNo = this.appointmentDetails.clinicList.filter(x => x['id'] === appoinment.refNo)[0];

        let timingList = this.appointmentDetails.doctorChamberList.filter(element => element['chamberRefNo'] === this.appAppointment.chamberRefNo.id)[0];
        timingList.chamberTimingList.forEach(item => {
          let time = item.startTime + '-' + item.endTime;
          this.appointmentDetails['timeList'].push({ id: item.dayOfWeek, label: item.startTime });
        });

        this.appAppointment.fullTime = this.appointmentDetails.timeList.filter(data => data['label'] === appoinment.appointmentTime)[0];

      }

      let chamber = this.appointmentDetails.doctorChamberList.filter(x => x['chamberRefNo'] === this.appAppointment.chamberRefNo.id)[0];
      let query = {
        doctorRefNo: this.appointmentDetails.doctorRefNo,
        chamberRefNo: chamber.chamberRefNo
      }
      this.searchService.getCalender(query).subscribe(result => {
        this.calenderList = result.data;
      })
      this.appointmentDetails["appAppointment"] = this.appAppointment;
    });
  }

  onChangeClinic(event: any) {
    if (!event.value) {
      return;
    }
    let chamber = this.appointmentDetails.doctorChamberList.filter(x => x['chamberRefNo'] === event.value.id)[0];
    let query = {
      doctorRefNo: this.appointmentDetails.doctorRefNo,
      chamberRefNo: chamber.chamberRefNo
    }
    this.searchService.getCalender(query).subscribe(result => {

      this.calenderList = result.data;
    })
  }

  onSelectDate(event: any) {
    this.appointmentDetails['timeList'] = [];
    let d = new Date(Date.parse(event));
    this.appAppointment.appointmentDate = d;
    let month = d.getMonth() <= 9 ? ('0' + (d.getMonth() + 1)) : d.getMonth() + 1;
    let day = d.getDate() <= 9 ? ('0' + d.getDate()) : d.getDate();
    let dateStrig = d.getFullYear() + '-' + month + '-' + day;

    let doctorAvailableOnSelectedDate = this.calenderList.filter(x => x["calendarDate"] == dateStrig)[0];
    if (!doctorAvailableOnSelectedDate) {
      this.toastService.showI18nToast('TOAST_MSG.DOC_NOT_AVAILABLE_DATE', 'error');
      return;
    }
    doctorAvailableOnSelectedDate.timeSlots.forEach(item => {
      if (!item.occupied) {
        let time = item.fromTime.substring(0, 5) + "-" + item.toTime.substring(0, 5);
        this.appointmentDetails["timeList"].push({ id: time, label: time });
      }

    })
    if (this.appointmentDetails["timeList"].length == 0) {
      this.toastService.showI18nToast('TOAST_MSG.NO_SLOT_AVAILABLE', 'error');
    }
  }

  modifyAppointment() {
    if (!this.appAppointment.refNo) {
      this.toastService.showI18nToast("Select clinic", 'warning');
      return;
    } else if (!this.appAppointment.appointmentDate) {
      this.toastService.showI18nToast("TOAST_MSG.SELECT_APPOINTMENT_DATE", 'warning');
      return;
    } else if (!this.appAppointment.fullTime) {
      this.toastService.showI18nToast("TOAST_MSG.SELECT_APPOINTMENT_TIME", 'warning');
      return;
    }
    let user: any = localStorage.getItem('user');

    if (user) {
      user = JSON.parse(user);

      this.makeAppontment(user.refNo);
    } else {
      this._authService.userSignUp(this.appSIgnUp).subscribe(result => {
        if (result && result.status == 2000) {
          this.makeAppontment(result.data.id);//have to send by ref no
        }
      });
    }
  }

  makeAppontment(userRefNo: any) {
    let fullTIme = this.appAppointment.fullTime.label.split('-');
    const query = {
      appointmentByRefNo: userRefNo,
      appointmentRefNo: this.appAppointment.appointmentRefNo,
      doctorRefNo: this.appointmentDetails.doctorRefNo,
      totalFees: this.appointmentDetails.visit,
      chamberRefNo: this.appAppointment.refNo.id,
      appointmentDate: this.appAppointment.appointmentDate,
      appointmentTime: fullTIme[0] + ":00",
      timeTo: fullTIme[1] + ":00",
      appointmentDateStr: this.convert(this.appAppointment.appointmentDate.toString()),
      status: "REQ"
    };

    this.appoinmentService.updateAppoinment(query).subscribe(resp => {
      if (resp && resp.status !== 2000) {
        this.toastService.showI18nToast(resp.message, 'error');
        return;
      }
      this.appointmentId = this.appAppointment.appointmentRefNo;
      this._modalService.close('modify-appoinment-popup');
      this._modalService.open('payment-method-popup');
    });
  }

  paymentMethod(method: String) {
    this.paymentMode = method;
    var paymentObj = { appointmentId: this.appointmentId, paymentMode: this.paymentMode };

    this._paymentService.paymentInitiate(paymentObj).subscribe((resp: any) => {
      if (resp && resp.status === 2000) {
        if (this.paymentMode === 'PAYTM') {
          this._modalService.close('payment-method-popup');
          this._modalService.open('paytm-popup');
          this.paytmRespObj = resp.data;
          setTimeout(() => {
            this.el.nativeElement.submit();
          }, 500);
        } else if (this.paymentMode === 'PAYPAL') {
          window.location.href = resp.data.redirectUrl;
        }
      }
    });
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }

  goToDoctorPres(appointmentRefNo: any) {
    this.appRefNo = appointmentRefNo
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
  }
  // sbis-poc/app/issues/594
  openProblemNarration(appoinment: any, userName: string, doctorName: string) {
    this.modalRef = this.bsModalService.show(this.problemNarration, { class: 'modal-lg' });
    this.appointment = appoinment;
    this.isAnyDoctorComment = false;
    this.isAnyIndividualComment = false;
    this.patientTime = this.doctorTime = "";
    this.patientName = this.doctorName = "";
    this.doctorName = doctorName;
    this.patientName = userName;
    this.problemNarrationForm.patchValue({ patientProblemNarration: "" });
    this.problemNarrationForm.patchValue({ doctorProblemNarration: "" });
    this.appoinmentService.fetchAllProblemNarration(this.appointment["appointmentRefNo"]).subscribe(result => {
      if (result.status == 2000) {
        if (result.data.length > 0) {
          let isDoctorCommented = result.data.find(x => x.createdByUserRole == "DOCTOR");
          isDoctorCommented ? this.isDoctorNarrate = true : this.isDoctorNarrate = false;
        } else {
          this.isDoctorNarrate = false;
        }
        this.problemNarrations = result.data;
        let arrOfProblems: any[] = this.problemNarrations;
        for (let i = 0; i < arrOfProblems.length; i++) {
          let problem = arrOfProblems[i];
          if (problem["createdByUserRole"] == "DOCTOR") {
            this.isAnyDoctorComment = true;
            this.problemNarrationForm.patchValue({ doctorProblemNarration: problem["narration"] });
            this.doctorName = problem["createdBYUserName"];
            this.doctorTime = problem["createdDate"];
          }
          else if (problem["createdByUserRole"] == "INDIVIDUAL") {
            this.isAnyIndividualComment = true;
            this.problemNarrationForm.patchValue({ patientProblemNarration: problem["narration"] });
            this.patientName = problem["createdBYUserName"];
            this.patientTime = problem["createdDate"];
          }
        }
      }
    });
  }

  //method to pay due amount by razorpay
  payOrder(appointment) {
    GetSet.setAppointmentResp(appointment);
    appointment['orderRefNo'] = appointment.orderRefNo;
    appointment['appointmentPk'] = null;
    appointment['payableAmount'] = appointment.outstandingAmount;
    appointment['discount'] = 0.0;
    appointment['tax'] = 0.0;
    GetSet.setPlaceOrderData(appointment);
    GetSet.setTransactionType(SBISConstants.TRANSACTION_TYPE.APPOINTMENT);
    GetSet.setAppointmentPaymentData(null);
    GetSet.setAppointmentPaymentData(appointment);

    //set confirmation msg
    let date = new Date(appointment.appointmentDate);
    let day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    let month = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
    let year = date.getUTCFullYear();
    appointment.appointmentDate = day + '-' + month + '-' + year;
    this.confirmationMsg = [];
    if (appointment.appointmentState == 'REQ') {
      let confMsgForReq;
      if(appointment.onlineConsultation == 'Y' || appointment.opdType == 'L') {
        confMsgForReq = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_CON_WITH_DOC') + appointment.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + appointment.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.AT') + appointment.appointmentTime.slice(0, -3) + " .";
        this.confirmationMsg.push(confMsgForReq);
      } else {
        confMsgForReq = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_RQST_WITH_DOC') + appointment.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + appointment.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.AT') + appointment.appointmentTime.slice(0, -3) + this.jsonTranslate.translateJson('CONFIRMATION_MSG.BEEN_SENT_TO_DOC');
        this.confirmationMsg.push(confMsgForReq);
        this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.WILL_RCV_UPDATE_NOTE'));
      }
    } else if (appointment.appointmentState == 'CON') {
      let confMsgForCon = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_CON_WITH_DOC') + appointment.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + appointment.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.AT') + appointment.appointmentTime.slice(0, -3) + " .";
      this.confirmationMsg.push(confMsgForCon);
    }

    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.APPOINTMENT;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.APPOINTMENT;
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.APPOINTMENT;
    // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.APPOINTMENT;
    GetSet.setConfirmationInfo(confirmationInfo);
    // end of set confirmation msg

    this.router.navigate(['/payment/razor-pay']);
  }

  openAppointmentDetails(appoinment) {
    appoinment['paymentDetails'] = [{
      'date': appoinment.appointmentDate,
      'totalAmount': appoinment.netAmount,
      'paidAmount': appoinment.paidAmount,
      'paymentStatus': appoinment.paymentStatus
    }];
    let invoiceDetailsArr = [];
    appoinment.invoiceNoList.forEach(element => {
      invoiceDetailsArr.push({'invoiceNo': element,'appointmentRefNo': appoinment.appointmentRefNo});
    });
    appoinment['invoiceList'] = invoiceDetailsArr;
    this.mySelectedAppointmentDetails = appoinment;
    this.visibleSidebarAppointmentDetails = true;
  }

  closeSideBar() {
    this.visibleSidebarAppointmentDetails = false;
  }
  

  downloadInvoice(invoiceDetails, type) {
    var a = document.createElement("a");
    var fileName = "Details";
    let query = { "invoiceNo": invoiceDetails.invoiceNo, "appointmentRefNo": invoiceDetails.appointmentRefNo };
    this._serviceProvider.downloadOPDInvoice(query).subscribe(resp => {
      if (type == 'PRINT') {
        var file = new Blob([resp], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        var w = window.open("about:blank");
        var iframe = document.createElement('iframe');
        iframe.src = fileURL;
        iframe.focus();
        iframe.onload = function () {
          iframe.contentWindow.print();
        };
        w.document.body.appendChild(iframe);
        w.document.body.style.display = "none";
      } else {
          const blob = new Blob([resp], { type: 'application/pdf' });
          const url= window.URL.createObjectURL(blob);
          a.href = url;
          // a.download = fileName;
          a.click();
          window.open(url, '_blank');
        }
      });
    }
  //Working on app#1615
  iframeSrc: any;
  refNo: any;
  showVideoChat: boolean = false;
  @ViewChild('vcModal') vcModal: TemplateRef<any>;
  onChatClick(q){
    if(confirm("Are you sure you wanted to start the video conference?")) {
      if(q.paymentStatus == 'PENDING') {
        GetSet.setVideoChatData(q);
        this.payOrder(q);
        return;
      }
      
      this.refNo = q.appointmentRefNo;
      this.showVideoChat = true;
    }
  }


  checkOnlineAppointmentsWSCall() {
    if(this.appoinmentList.length > 0){
      let currentDate = new Date();
      let todaysAppointmentList: any[] = this.appoinmentList.filter(x=> 
        (currentDate.getDate() == new Date(x.appointmentDate).getDate() && 
        currentDate.getMonth() == new Date(x.appointmentDate).getMonth()
        && currentDate.getFullYear() == new Date(x.appointmentDate).getFullYear()));
      if(todaysAppointmentList.length > 0){
        let todaysAppointmentRefNoArr: string[] = todaysAppointmentList.map(x=> x.appointmentRefNo);
        let queryObj: any  = {
          appointments: todaysAppointmentRefNoArr
        }
        this.appoinmentService.checkOnlineSessionStatusByAppointmentRef(queryObj).subscribe(res=>{
          if(res.status == 2000)
            this.constructOnlineAppointments(res);
        });

      }//end of todays appointment list check
    }//end of apppointment list check
  }//end of ng do check
  constructOnlineAppointments(res: any) {//method to construct online appointment
    this.appoinmentList.forEach(element => {
      res.data.appointmentStatus.forEach(onlineAppointment => {
        if(onlineAppointment.appRefNo == element.appointmentRefNo)
          element["isDoctorOnline"] = true;
        else
          element["isDoctorOnline"] = undefined;
      });
    });
  }//end of method

  //method to setColor according to online 
  getColor(appointments){
    if(appointments.isDoctorOnline != undefined)
      return 'green';
    else
      return 'blue';    
  }//end of method

  getAppointmentTypeList() {
    return [
      { id: "1", label: "For me" },
      { id: "2", label: "For my group user" },
      { id: "3", label: "Person Known to me" }
    ];
  }//end of method

  openBookAppoinment(appointmentDetails) {
    this.appoinmentTypeLists = this.getAppointmentTypeList();
    console.log(appointmentDetails);
    
    let queryStr = "drRefNo:"+appointmentDetails.doctorRefNo+",resolveLatlon:N,onlineConsultation:N";

    let query = {
      search: queryStr,
      recordsPerPage: 100,
      page: 0
    }
    this.appoinmentService.getDoctorsV5(query).subscribe(data => {
      if (data.data != null && data.data.length > 0) {
        data.data.forEach(doctor => {
          if(!doctor.onlineConsultation) {
            doctor.onlineConsultation = 'N';
          }
          
        });
        this.appoinment = data.data[0];
        let selectedChamber = this.appoinment.doctorChamberList.filter(x => x.chamberRefNo == appointmentDetails.chamberRefNo);
        GetSet.setReBookData(selectedChamber[0]);
        this.modalRef = this.bsModalService.show(this.bookAppoinmentModal, { class: 'modal-xl' });
        this.loadProfileImage(this.appoinment);
        console.log(this.appoinment);
      } else {
        this.toastService.showI18nToast("Currently doctor is not accepting appointments", 'warning');
      }
    });
  }//end of method

  backClicked() {
    this.modalRef.hide();
  }//end of method

}//end of class
