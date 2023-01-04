/*******************************************************************************
 * * |///////////////////////////////////////////////////////////////////////|
 * * |                                                                       |
 * * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
 * * | All Rights Reserved                                                   |
 * * |                                                                       |
 * * | This document is the sole property of StellaBlue Interactive          |
 * * | Services Pvt. Ltd.                                                    |
 * * | No part of this document may be reproduced in any form or             |
 * * | by any means - electronic, mechanical, photocopying, recording        |
 * * | or otherwise - without the prior written permission of                |
 * * | StellaBlue Interactive Services Pvt. Ltd.                             |
 * * |                                                                       |
 * * |///////////////////////////////////////////////////////////////////////|
 ******************************************************************************/
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SBISConstants } from 'src/app/SBISConstants';
import { Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { environment } from '../../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppoinmentService } from '../../appoinment/appoinment.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DoctorService } from '../../doctor/doctor.service';
import { ServiceProviderService } from '../service-provider.service';

@Component({
  selector: 'app-opd-appointment',
  templateUrl: './opd-appointment.component.html',
  styleUrls: ['./opd-appointment.component.css']
})
export class OPDAppointmentComponent implements OnInit,OnDestroy {
  fetchPatientForm: FormGroup;
  searchList: any;
  chamberList: any;
  statusList: any;
  todate: Date = new Date();
  searchStr: String = "";
  // chamber = [];
  stat = [];
  doctorPk: any;
  user: any;
  dateFormat: any;
  fromDate: any;
  toDate: any;
  appointmentStatus: any;
  isCommonTemplate = false;
  isPaginator = false;
  activeDayIsOpen: boolean;
  viewDate: Date;
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  modalRef: BsModalRef;
  buttonClassCurrent: any;
  buttonClassAnother: any;
  pendingAppointment: any;
  allDataFetched = false;
  APP_STATE = SBISConstants.APPOINTMENT_STATE;
  searchListLength: any;
  title: any;
  columnName: any;
  minDate: Date;
  prevDateEnableFlag = false;
  panelVisible = false;
  doctorRefNo: any;
  pendingHomeVisitCnt: any;
  homeVisitFlag: any = "N";
  // Working on app/issues/595
  submitted: boolean = false;
  fromTime: any;
  toTime: any;
  homeVisitSetTimeForm: FormGroup;
  homeVisitAppointment: any;
  // @ViewChild('homeVisitAppointmentModal') homeVisitAppointmentModal: TemplateRef<any>;
  problemNarrationForm:FormGroup;
  selectedFiles: any;
  isUpload: any = false;
  rolePk: any;
  myNarration: boolean = false;
  appoinment: any;
  problemNarrations: any;
  accordianHeader: boolean = false;
  userRefNo: any;
  // sbis-poc/app/issues/594
  roleName: any;
  previewModalRef: BsModalRef;
  // @ViewChild('previewModal') previewModal: TemplateRef<any>;
  // @ViewChild('problemNarration') problemNarration: TemplateRef<any>;
  previewProblemNarration:any;
  isAnyDoctorComment:any = false;
  isAnyIndividualComment:any = false;
  patientTime:any;
  patientName:any;
  doctorTime:any;
  doctorName:any;
  loading: boolean = false;

  // Following attribute introduced and set subsequently for sbis-poc/app/issues/665
  uiType: any;
  childSpRefNo: string;
  sbisConstantRef: typeof SBISConstants;
  private childSubscription;

  constructor(private fb: FormBuilder,
    private _doctorService: DoctorService,
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private broadcastService: BroadcastService,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private appoinmentService: AppoinmentService,
    private _toastService: ToastService,
    private http: HttpClient,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.minDate = new Date();
    this.sbisConstantRef = SBISConstants;
  }

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.dateFormat = environment.DATE_FORMAT;
    this.stat = [];
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userRefNo = this.user.refNo;
    this.rolePk = this.user.rolePk;
    this.roleName = this.user["roleName"];
    const url = window.location.href.toString();
    //Working on app/issues/595
    if (url.indexOf('/home') > 0) {
      this.uiType = 'home';
      this.appointmentStatus = "REQ";
      this.title = "Pending Home Visit";
      let index = this.findIndexToUpdateStatus("REQ");
      if (index >= 0) { }
      else {
        this.stat.push('REQ');
        this.homeVisitFlag = "Y";
      }
    }
    //End Working on app/issues/595
    else if (url.indexOf('/appointments/req') > 0) {
      this.uiType = 'req';
      this.appointmentStatus = "REQ";
      this.title = "Appointments Pending Confirmation";
      //this.columnName = "Payment Due"; 
      let index = this.findIndexToUpdateStatus("REQ");
      if (index >= 0) { }
      else {
        this.stat.push('REQ');
        this.homeVisitFlag = "N";
      }
    } else {
      this.uiType = 'all';
      this.title = "Appointments";
      this.appointmentStatus = true;
      this.pendingAppointments();
      //  //Working on app/issues/595
      //  this.pendingHomeVisit();
      //  //End Working on app/issues/595
    }

    // this.broadcastService.setHeaderText('My Appointment');
    let user = JSON.parse(localStorage.getItem('user'));
    this.childSpRefNo = localStorage.getItem('childServiceProviderRefNo');
    this.doctorRefNo = user.refNo;
    this.dateFormat = environment.DATE_FORMAT;
    this.searchList = null;
    this.chamberList = null;
    this.statusList = null;
    /*this.chamber = [];*/
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.prevDateEnableFlag = false;
    this.searchListLength = 0;
    this.activeDayIsOpen = false;
    this.isPaginator = false;
    this.viewDate = new Date();

    if (this.appointmentStatus === 'REQ') {
      // this.fromDate = null;
      this.fromDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
      this.toDate = null;
    }
    else {
      this.fromDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
      this.toDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
    }
    if (this.viewDate <= new Date()) {
      this.prevDateEnableFlag = true;
    }
    this.createFetchPatientForm(this.appointmentStatus);
    this.searchPatient();
    // this.getAllChembers(this.user.refNo);
    this.getAllAppStatus("APPOINTMENT_STATUS");

    // sbis-poc/app/issues/594
    this.problemNarrationForm = this.fb.group({
        patientProblemNarration: [],
        doctorProblemNarration: [],
        file: [null]
      });
    this.problemNarrationForm.controls["patientProblemNarration"].valueChanges.subscribe(value => {

      this.myNarration = true;
      if(typeof value === "undefined" || value == null || value.replace(/^\s+|\s$/g, "") == ""){
        this.myNarration = false;
      }
    });
    this.problemNarrationForm.controls["doctorProblemNarration"].valueChanges.subscribe(value => {

      this.myNarration = true;
      if(typeof value === "undefined" || value == null || value.replace(/^\s+|\s$/g, "") == ""){
        this.myNarration = false;
      }
    });

    // app/issues/935
    if (url.indexOf('opd/appointments') > 0) {
      document.body.classList.remove('started-screen');
    }
    // End app/issues/935

    this.childSubscription = this.broadcastService.getHospitalDetails().subscribe(data => {
      this.childSpRefNo = data;
      this.pendingAppointments();
      this.searchPatient();
    });
  }//end of oninit
    
  // sbis-poc/app/issues/594
  accordianHeaderClick() {
    this.accordianHeader = !this.accordianHeader;
  }

  pendingAppointments() {
    let request = { //https://gitlab.com/sbis-poc/app/-/issues/2727
      "serviceProviderRef": this.user.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR ? this.childSpRefNo: null
    }
    this.serviceProviderService.getPendingAppointmentsForServiceProviders(request)
      .subscribe(data => {
        if (data['status'] == '2000') {
          this.pendingAppointment = data['data'];
        }
      });
  }

  createFetchPatientForm(appStat: any) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.fetchPatientForm = this.fb.group({
      doctor: this.user.id,
      doctorRefNo: this.doctorRefNo,
      patientName: '',
      doctorName: '',
      /*chamberName: false,*/
      appStatus: false,
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  onValueChange(label: any, dt: Date): void {
   
    if (label == 'fromDate') {
      this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
    }
    if (label == 'toDate') {
      this.toDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
    }
    if (this.fromDate == this.toDate) {
      this.buttonClassCurrent = 'btn btn-dark';
      this.buttonClassAnother = 'btn btn-light';
    }
    else {
      this.buttonClassCurrent = 'btn btn-light';
      this.buttonClassAnother = 'btn btn-dark';
    }
  }//end of method

  

  searchPatient() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.searchList = null;
    this.searchStr = "";
    this.searchStr = (this.userRefNo)?"opd:" + this.userRefNo: "";
    // if (this.fetchPatientForm.value.doctor != "" && this.searchStr == "")
    //   this.searchStr = "opd:" + this.userRefNo;
    // else if (this.fetchPatientForm.value.doctor != "" && this.searchStr != "")
    //   this.searchStr = this.searchStr + ";doctor:" + this.fetchPatientForm.value.doctor;

    if (this.fetchPatientForm.value.patientName != "" && this.searchStr == "")
      this.searchStr = "patientName:" + this.fetchPatientForm.value.patientName;
    else if (this.fetchPatientForm.value.patientName != "" && this.searchStr != "")
      this.searchStr = this.searchStr + ";patientName:" + this.fetchPatientForm.value.patientName;

      if (this.fetchPatientForm.value.doctorName != "" && this.searchStr == "")
      this.searchStr = "doctorName:" + this.fetchPatientForm.value.doctorName;
    else if (this.fetchPatientForm.value.doctorName != "" && this.searchStr != "")
      this.searchStr = this.searchStr + ";doctorName:" + this.fetchPatientForm.value.doctorName;

    /*if (this.chamber.length != 0 && this.searchStr == "")
      this.searchStr = "chamberName:" + this.chamber;
    else if (this.chamber.length != 0 && this.searchStr != "")
      this.searchStr = this.searchStr + ";chamberName:" + this.chamber;*/

    if (this.stat.length != 0 && this.searchStr == "")
      this.searchStr = "status:" + this.stat;
    else if (this.stat.length != 0 && this.searchStr != "")
      this.searchStr = this.searchStr + ";status:" + this.stat;

    //Working on app/issues/1383

      if(this.fetchPatientForm.value.fromDate==null || this.fetchPatientForm.value.fromDate==""){
        let dt =new Date("01/01/1950");
        this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); 
      }

      if(this.fetchPatientForm.value.toDate==null || this.fetchPatientForm.value.toDate==""){
        let dt =new Date("01/01/2300");
        this.toDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); 
      }
    // End Working on app/issues/1383



    //if (this.appointmentStatus != 'REQ') {
    if (this.fromDate != "" && this.searchStr == "" && this.fromDate != null)
      this.searchStr = "fromDate:" + this.fromDate;
    else if (this.fromDate != "" && this.searchStr != "" && this.fromDate != null)
      this.searchStr = this.searchStr + ";fromDate:" + this.fromDate;
    //}

    //if (this.appointmentStatus != 'REQ') {
    if (this.toDate != "" && this.searchStr == "" && this.toDate != null)
      this.searchStr = "toDate:" + this.toDate;
    else if (this.toDate != "" && this.searchStr != "" && this.toDate != null)
      this.searchStr = this.searchStr + ";toDate:" + this.toDate;
    //}

    // this.searchStr = this.searchStr + ";homeVisitFlag:"+this.homeVisitFlag;


    let queryParam: string = (this.user.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR) ? 
    "?spRefNo="+this.childSpRefNo + "&search=" + this.searchStr
    : '?search=' + this.searchStr;
    this.serviceProviderService.getAppointmentsForServiceProviders(queryParam)
      .subscribe(res => {
        this.searchList = null;
        this.cntCON = 0;
        this.cntCOM = 0;
        this.cntVIP = 0;
        this.cntREQ = 0;
        this.cntREJ = 0;
        this.cntCXL = 0;
        if (res.status == 2000) {
          res.data.forEach(ele => {
            ele['due'] = (+ele.fees) - (+ele.payAmount);
          });
          this.countAppStatus(res.data);
          this.searchList = res.data;
          this.searchListLength = res.data.length;
          if (res.data.length > 10) {
            this.isPaginator = true;
          }else if (res.data.length == 0){
          this.searchList = null;
          this.isPaginator = false;
          this.searchListLength = 0;
          }else{
            this.isPaginator = false;
          }
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
          this.allDataFetched = true;
        }
        this.pendingAppointments();
      });
  }

  getAllAppStatus(name) {
    this._doctorService.GetAppStatus(name)
      .subscribe(res => {
        this.statusList = res;
      });
  }

  statusChange(e, type) {
    if (e.target.checked) {
      let index = this.findIndexToUpdateStatus(type.attributeValue);
      if (index >= 0) {

      } else {
        this.stat.push(type.attributeValue);
      }
    }
    else {
      let index = this.findIndexToUpdateStatus(type.attributeValue);
      this.stat.splice(index, 1);
    }
  }

  findIndexToUpdateStatus(attributeValue) {
    for (let i = 0; i < this.stat.length; i++) {
      if (this.stat[i] == attributeValue)
        return i;
    }
  }

  appRefNo: any;
   viewPrescription(appointmentRefNo) {
    // alert(appointmentRefNo);
    this.appRefNo = appointmentRefNo;
    //this.router.navigate(['/doctor/prescriptionpreview', pp.appointmentRefNo]);
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    //alert(appointmentRefNo);
    //this.router.navigate(['/doctor/prescriptionpreview', appointmentRefNo]);
  } 

  pendingAppointmentListView() {
    this.router.navigate(['/opd/appointments/req']);
  }

  cancelAppointment(appointmentref, action) {
    if (confirm('Are you sure to ' + action + ' this appointment?')) {

      let request = {
        "refNo": appointmentref
      }

      this._doctorService.cancelDoctorAppointmentV2(request).subscribe(data => {
        if (data['status'] == '2000') {
          alert(data['message']);
        } else {
          alert(data['message']);
        }
        //window.location.reload();
        this.searchPatient();
        this.pendingAppointments();
      })
    } else {
      // do nothing
    }

  }



  confirmAll() {
    if (confirm('Are you sure to confirm all appointments from today?')) {
      let request = {
        "refNo": this.user.refNo,
        "drRefNo": ""
      }
      this._doctorService.confirmAllAppointmentv2(request).subscribe(data => {
        if (data['status'] == '2000') {
          //alert(data['message']);
          this._toastService.showI18nToast('Your all pending appointments are confirmed.', "success");
        } else {
          alert(data['message']);
        }
        //window.location.reload();
        this.searchPatient();
        if (this.appointmentStatus !== "REQ") {
          this.pendingAppointments();
        }
      })
    } else {
      // do nothing
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }
  ngOnDestroy() {
    this.childSubscription.unsubscribe();
  }

  changeClassButton1() {
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
  }

  changeClassButton2() {
    this.buttonClassCurrent = 'btn btn-light';
    this.buttonClassAnother = 'btn btn-dark';
  }

  goToPreviousDate() {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      this.viewDate.getDate() - 1);

    if (this.viewDate <= new Date()) {
      this.prevDateEnableFlag = true;
    }

    var mnth = ("0" + (this.viewDate.getMonth() + 1)).slice(-2),
      day = ("0" + this.viewDate.getDate()).slice(-2);
    var tempDate = [this.viewDate.getFullYear(), mnth, day].join("-");

    this.fromDate = tempDate;
    this.toDate = tempDate;

    this.searchPatient();

    this.fetchPatientForm.patchValue({
      fromDate: ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear(),
      toDate: ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear()
    })
  }

  goToNextDate() {
    this.prevDateEnableFlag = false;
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      this.viewDate.getDate() + 1);

    var mnth = ("0" + (this.viewDate.getMonth() + 1)).slice(-2),
      day = ("0" + this.viewDate.getDate()).slice(-2);
    var tempDate = [this.viewDate.getFullYear(), mnth, day].join("-");

    this.fromDate = tempDate;
    this.toDate = tempDate;

    this.searchPatient();

    this.fetchPatientForm.patchValue({
      fromDate: ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear(),
      toDate: ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear()
    })
  }

  goToCurrentDate() {

    if(!this.router.url.endsWith("/opd/appointments")){
        this.router.navigate(['/opd/appointments']);
    }
      
    this.viewDate = new Date();

    var mnth = ("0" + (this.viewDate.getMonth() + 1)).slice(-2),
      day = ("0" + this.viewDate.getDate()).slice(-2);
    var tempDate = [this.viewDate.getFullYear(), mnth, day].join("-");

    this.fromDate = tempDate;
    this.toDate = tempDate;

    this.searchPatient();

    this.fetchPatientForm.patchValue({
      fromDate: ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear(),
      toDate: ('0' + new Date(tempDate).getDate()).slice(-2) + '-' + ('0' + (new Date(tempDate).getMonth() + 1)).slice(-2) + '-' + new Date(tempDate).getFullYear()
    })
  }

  resetAppStatus() {
    this.fetchPatientForm.patchValue({
      appStatus: ''
    });
    this.stat = [];
  }

  resetSearchDate() {

    // Working on app/issues/1383
    this.fetchPatientForm.patchValue({
      // fromDate: ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear(),
      // toDate: ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear()
      fromDate:null,
      toDate:null
    });
    // End Working on app/issues/1383
  }

  resetAll() {
    this.fetchPatientForm.patchValue({
      appStatus: '',
    // Working on app/issues/1383    
      // fromDate: ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear(),
      //toDate: ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear()
      fromDate:null,
      toDate:null,
    // End Working on app/issues/1383
     
      /*chamberName: '',*/
      doctorName: '',
      patientName: ''
    });
    /*this.chamber = [];*/
    this.stat = [];
  }


  editPrescription(query, appointment, visitPk, appRefNo) {
    this.router.navigate(['doctor/prescription', { userRefNo: query.userRefNo, appointmentRefNo: appRefNo }]);
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

  rejectOrCancelDoctorAppointment(appointment, appointmentState){
    let stateTxt = appointmentState==this.APP_STATE.CANCELLED?'cancel':'reject';
    let stateSuccessTxt = appointmentState==this.APP_STATE.CANCELLED?'cancelled':'rejected'
    
    if (confirm('Are you sure you want to '+stateTxt+' this appointment?')) {
      let query = {
        appointmentCxlByRefNo: this.user.refNo,
        appointmentRefNo: appointment.appointmentRefNo,
        appointmentState: appointmentState,
        entityName: this.user.entityName
      }
      this.appoinmentService.deleteAppoinment(query).subscribe((data) => {
        // Issue app#844
        if(data.status == 2000) {
          this._toastService.showI18nToast('Appointment '+stateSuccessTxt+' successfully', "success");
          this.searchPatient();
          this.pendingAppointments();
        }
        if(data.status == 5061) {
          this._toastService.showI18nToast(data.message, "error");
          this.searchPatient();
          this.pendingAppointments();
        }
      });
    }
  }
  APP_STATE_STATUS = SBISConstants.APPOINTMENT_STATE_STATUS; // Wprking on app/issue/2403
  manageDoctorAppointment(query, appointment, appointmentState){
    let payload = {
      appointmentRefNo: appointment.appointmentRefNo,
      appointmentState: appointmentState
    }
    let manageAppointmentPermission=false;
    // Working on app/issue/2403
    if(appointmentState==this.APP_STATE.NO_SHOW || appointmentState==this.APP_STATE.COMPLETED ){
      if(confirm("Do You Want to "+this.APP_STATE_STATUS[appointmentState]+" this Appointment?")){
        manageAppointmentPermission=true;
      }
    }
    else{
      manageAppointmentPermission=true;
    }
    if(manageAppointmentPermission){
      this._doctorService.manageAppoinment(payload).subscribe((data) => {
        if (data.status == 2000) {
          if (data['data'].appointmentState === this.APP_STATE.VIP) {
            this.router.navigate(['doctor/prescription', { userRefNo: query.userRefNo, appointmentRefNo: data['data'].appointmentRefNo }]);
          }
          else if (data['data'].appointmentState === this.APP_STATE.CONFIRMED) {
            this._toastService.showI18nToast('Your Appointment is confirmed.', "success");
            this.searchPatient();
            if (this.appointmentStatus !== "REQ") {
              this.pendingAppointments();
            }
          }
          // Working on app/issues/595
          else if(data['data'].appointmentState === this.APP_STATE.NO_SHOW || data['data'].appointmentState === this.APP_STATE.COMPLETED){
            this.searchPatient();
          }
          // End Working on app/issues/595
        }
        if(data.status == 5061) {
          this._toastService.showI18nToast(data.message, "error");
          this.searchPatient();
          this.pendingAppointments();
        }
      });
    }
  }
  // Working on app/issues/595

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

  timeValidate(label, time) {
    this.submitted = false;
    let startTime: any;
    let endTime: any;
    let startTimeM: any;
    let endTimeM: any;

    if (label == 'stTime') {
      //this.timingForm.controls.appointmentTime.setValue(time.substring(0,5)+":00");

      endTime = this.homeVisitSetTimeForm.controls.timeTo.value;
      if (endTime != null || endTime != "" || isNaN(endTime)) {
        startTimeM = parseInt(time.split(':')[1]);
        endTimeM = parseInt(endTime.split(':')[1]);
        startTime = parseInt(time.split(':')[0]);
        endTime = parseInt(endTime.split(':')[0]);


        if (startTime > endTime) {
          this.startTimingErrorFlag = true;
          this.homeVisitSetTimeForm.patchValue({
            appointmentTime: ""
          });
          //alert("Start time can not be greater than end time.")
          // timing.value.startTime = "";
          // //timing.value.startTime.setValue("");
          // timingList.at(i).patchValue({
          //   startTime: ""
          // })
        }
        else {
          if (startTime == endTime) {
            if (startTimeM >= endTimeM) {
              this.startTimingErrorFlag = true;
              // timingList.at(i).patchValue({
              //   startTime: ""
              // })
              this.homeVisitSetTimeForm.patchValue({
                appointmentTime: ""
              });
            }
            else {
              //timing.value.startTime.setValue(time.substring(0,5)+":00");
              this.startTimingErrorFlag = false;
              this.endTimingErrorFlag = false;
            }
          }
          else {
            //timing.value.startTime.setValue(time.substring(0,5)+":00");
            this.startTimingErrorFlag = false;
            this.endTimingErrorFlag = false;
          }

        }
      }
    }
    if (label == 'ndTime') {
      endTime = time;
      startTime = this.homeVisitSetTimeForm.controls.appointmentTime.value;
      if (startTime != null || startTime != "" || isNaN(startTime)) {
        endTimeM = parseInt(time.split(':')[1]);
        startTimeM = parseInt(startTime.split(':')[1]);
        endTime = parseInt(time.split(':')[0]);
        startTime = parseInt(startTime.split(':')[0]);
        if (startTime > endTime) {
          this.endTimingErrorFlag = true;
          this.homeVisitSetTimeForm.patchValue({
            timeTo: ""
          });
          //alert("End time can not be less than Start time.")
          //timing.value.endTime = "";
          //timing.value.endTime.setValue("");
        }
        else {
          if (startTime == endTime) {
            if (startTimeM >= endTimeM) {
              this.endTimingErrorFlag = true;
              this.homeVisitSetTimeForm.patchValue({
                timeTo: ""
              });
            }
            else {
              this.endTimingErrorFlag = false;
              this.startTimingErrorFlag = false;
            }
          }
          else {
            this.endTimingErrorFlag = false;
            this.startTimingErrorFlag = false;
          }

          // timing.value.endTime.setValue(time.substring(0,5)+":00");
        }
      }
    }
  }

  convertStrToDt(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  }




//method to print the prescription

// Working on app/issues/1185
displaySidebarInvoice: boolean =false;
appointmentRefNo: any;
invoiceList: any = [];
showInvoice(appointmentRefNo){
  this.displaySidebarInvoice = true;
  this.appointmentRefNo = appointmentRefNo;
  this.loading = true;
  document.body.classList.add('hide-bodyscroll');
  let payload = {
    appointmentRefNo: this.appointmentRefNo
  }
  this.serviceProviderService.getInvoiceListByAppointmentRefNo(payload).subscribe(res => {
  //this._doctorService.getInvoiceListByAppointment(payload).subscribe(res => {
    if(res.status == 2000) {
      this.invoiceList = res["data"];
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    }
  });
}
closeInvoice(){
  this.displaySidebarInvoice = false;
}
//End Working on app/issues/1185

// Working on app/issues/1267
customType: any ="";
createBlankPrescription(appointment){

  if(confirm("Are you sure to create a blank prescription?")){
    let payload = {
      appointmentRefNo: appointment.appointmentRefNo,
      appointmentState: this.APP_STATE.COMPLETED
    }
    this._doctorService.createBlankPrescription(payload).subscribe(res => {
      this.appRefNo = appointment.appointmentRefNo;
      this.customType = "BLANK";
      this.searchPatient();  
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
      
    });
  }
}

//End Working on app/issues/1267

//Working on app/issues/1292
uploadPrescription(event,q){
  const file = event.target.files[0];
  if (Math.round(file.size / 1024) > 500) {      
    this._toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
    return;
  }
 // if(confirm("Are you sure to upload hardcopy of prescription?")){
      let documentDtoList = null;
      let formdata = new FormData();
      formdata.append('file', file);
      //Working on app/issues/2045
      // if(q.appointment.appointmentState == this.APP_STATE.COMPLETED){
      //   documentDtoList = JSON.stringify({
      //     "appointmentRefNo": q.appointment.appointmentRefNo,
      //     "roleName": this.user.roleName,
      //     "entityName": this.user.entityName,
      //     "refNo": this.user.refNo,
      //     "fileUploadFor" :SBISConstants.DOCUMENT_TYPE_CONST.BLANK_PRESCRIPTION
      //   });
      // }
      // if(q.appointment.appointmentState == this.APP_STATE.CONFIRMED){
      //   documentDtoList = JSON.stringify({
      //     "appointmentRefNo": q.appointment.appointmentRefNo,
      //     "roleName": this.user.roleName,
      //     "entityName": this.user.entityName,
      //     "refNo": this.user.refNo,
      //     "appointmentState": this.APP_STATE.COMPLETED,
      //     "fileUploadFor" :SBISConstants.DOCUMENT_TYPE_CONST.BLANK_PRESCRIPTION
      //   });
      // }
      if(q.appointment.appointmentState == this.APP_STATE.COMPLETED){
        documentDtoList = JSON.stringify({
          //'uploadDate': new Date(),
          'fileUploadFor': SBISConstants.DOCUMENT_TYPE_CONST.BLANK_PRESCRIPTION,
          "appointmentRefNo": q.appointment.appointmentRefNo,
          "forRefNo": q.userRefNo,
          "byRefNo": this.user.refNo,
          "doctorName": null,
          "roleName": this.user.roleName,
          "entityName": this.user.entityName
        });
      }
      if(q.appointment.appointmentState == this.APP_STATE.CONFIRMED){
        documentDtoList = JSON.stringify({
          //'uploadDate': new Date(),
          'fileUploadFor': SBISConstants.DOCUMENT_TYPE_CONST.BLANK_PRESCRIPTION,
          "appointmentRefNo": q.appointment.appointmentRefNo,
          "appointmentState": this.APP_STATE.COMPLETED,
          "forRefNo": q.userRefNo,
          "byRefNo": this.user.refNo,
          "doctorName": null,
          "roleName": this.user.roleName,
          "entityName": this.user.entityName
        });
      }
    //End Working on app/issues/2045
    formdata.append('document', documentDtoList);
      this.saveDocument(formdata).subscribe(event => {
        if (event instanceof HttpResponse) {
          let response = JSON.parse(event.body);
          if (response.status = 2000) {
            this._toastService.showI18nToast(response.message,"success");           
            if(q.appointment.appointmentState == this.APP_STATE.CONFIRMED){
              this.searchPatient();
            }
          } else {
            this._toastService.showI18nToast(response.message, 'error')
          }
  
        }
      });
   // }
}

saveDocument(formData:any): Observable<any> {
  let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
   // reportProgress: true,
    responseType: 'text'
  });
  return this.http.request(req);
 
}

//End Working on app/issues/1292


cntCON: any = 0;
  cntCOM: any = 0;
  cntVIP: any = 0;
  cntREQ: any = 0;
  cntREJ: any = 0;
  cntCXL: any = 0;
  countAppStatus(app){
    for(let i=0;i<app.length;i++){
      if(app[i].appointment!=null){
        if(app[i].appointment.appointmentState==this.APP_STATE.CONFIRMED){
          this.cntCON++;
        }
        if(app[i].appointment.appointmentState==this.APP_STATE.COMPLETED){
          this.cntCOM++;
        }
        if(app[i].appointment.appointmentState==this.APP_STATE.VIP){
          this.cntVIP++;
        }
        if(app[i].appointment.appointmentState==this.APP_STATE.REQUESTED){
          this.cntREQ++;
        }
        if(app[i].appointment.appointmentState==this.APP_STATE.REJECTED){
          this.cntREJ++;
        }
        if(app[i].appointment.appointmentState==this.APP_STATE.CANCELLED){
          this.cntCXL++;
        }
      }
    }
    
  }

}//end of class
