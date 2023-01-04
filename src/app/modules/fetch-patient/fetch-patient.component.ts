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
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SBISConstants } from 'src/app/SBISConstants';
import { Router,Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { DoctorService } from '../doctor/doctor.service';
import { BroadcastService } from '../../core/services/broadcast.service';
import { environment } from '../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppoinmentService } from '../appoinment/appoinment.service';
import { ToastService } from '../../core/services/toast.service';
import { HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ServiceProviderService } from '../service-provider/service-provider.service';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format/date-format.pipe';

@Component({
  selector: 'app-fetch-patient',
  templateUrl: './fetch-patient.component.html',
  styleUrls: ['./fetch-patient.component.css'],
  providers: [DateFormatPipe]
})
export class FetchPatientComponent implements OnInit {
  fetchPatientForm: FormGroup;
  searchList: any;
  chamberList: any;
  statusList: any;
  todate: Date = new Date();
  searchStr: String = "";
  chamber = [];
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
  SBISConstantsRef: any = SBISConstants;
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
  @ViewChild('homeVisitAppointmentModal') homeVisitAppointmentModal: TemplateRef<any>;
  //End Working on app/issues/595
  // sbis-poc/app/issues/594
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
  @ViewChild('previewModal') previewModal: TemplateRef<any>;
  @ViewChild('problemNarration') problemNarration: TemplateRef<any>;
  previewProblemNarration:any;
  isAnyDoctorComment:any = false;
  isAnyIndividualComment:any = false;
  patientTime:any;
  patientName:any;
  doctorTime:any;
  doctorName:any;
  showImpPageInfo:any;
  isPendingAppointment: boolean = false;
  pendingConfirm: boolean = false;
  loading: boolean = false;
  videoStart:any;

  // Following attribute introduced and set subsequently for sbis-poc/app/issues/665
  uiType: any;
  APP_STATE_STATUS = SBISConstants.APPOINTMENT_STATE_STATUS; // Wprking on app/issue/2403
  constructor(private fb: FormBuilder,
    private _doctorService: DoctorService,
    private router: Router,
    private broadcastService: BroadcastService,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private appoinmentService: AppoinmentService,
    private _toastService: ToastService,
    private http: HttpClient,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private dateFormatPipe: DateFormatPipe,
    private serviceProviderService: ServiceProviderService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
    translate.use('help_en');
    this.minDate = new Date();


    this.router.events.subscribe((event: Event) => {
           if (event instanceof NavigationStart) {
               //console.log("aaa");// Show loading indicator
           }

           if (event instanceof NavigationEnd) {
             const url = window.location.href.toString();
             if (url.indexOf("/req") >  0) {
               this.pendingConfirm = true;

             } else{
               this.pendingConfirm = false;

             }

           }

           if (event instanceof NavigationError) {
               // Hide loading indicator

               // Present error to user
               console.log(event.error);
           }
       });




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
    else if (url.indexOf('/req') > 0) {
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
      this.title = "My Appointments";
      this.appointmentStatus = true;
      this.isPendingAppointment = true;
      this.pendingAppointments();
       //Working on app/issues/595
       this.pendingHomeVisit();
       //End Working on app/issues/595
    }

    this.broadcastService.setHeaderText('My Appointment');
    let user = JSON.parse(localStorage.getItem('user'));
    //this.doctorRefNo = user.refNo;
    //Working on app/issues/1058
    if(user.roleName=='DOCTOR'){
      this.doctorRefNo = user.refNo;
    }
    else if(user.roleName=='ASSISTANT'){
      this.doctorRefNo = user.serviceProviderRefNo;
    }
    else{
      this.doctorRefNo = user.refNo;
    }
    
    //End Working on app/issues/1058

    this.dateFormat = environment.DATE_FORMAT;
    this.searchList = null;
    this.chamberList = null;
    this.statusList = null;
    this.chamber = [];
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
    this.getAllChembers(this.user.refNo);
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
    if (url.indexOf('searchPatient') > 0) {
      document.body.classList.remove('started-screen');
    }
    // End app/issues/935
  }
  // sbis-poc/app/issues/594
  openPreview(problemNarration:any){
    this.previewProblemNarration = problemNarration;
    this.previewModalRef = this.bsModalService.show(this.previewModal, { class: 'modal-lg' });
  }

  getUrl(problemNarration:any, prefix:string, postfix: string){
      let url: string = 'data:'+ problemNarration["fileType"] +';base64,' + problemNarration["fileResponseBody"];
      if(typeof prefix !== "undefined" && prefix != null && prefix != ""){
        url = prefix + url;
      }
      if(typeof postfix !== "undefined" && postfix != null && postfix != ""){
        url = url + postfix;
      }
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  problemNarrationFileSelected(event) {
    let fileEvent = event.target.files[0];
    if((fileEvent.type == "image/jpeg") || (fileEvent.type == "application/pdf") || (fileEvent.type == "image/png")) {
      //do nothing
    } else {
      this._toastService.showI18nToast("File type should be jpg/png/pdf", "warning");
      return;
    }
    if(fileEvent.size > 2000000) {
      this._toastService.showI18nToast("File size will not more then 2mb", "warning");
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
      "narration": this.roleName == "DOCTOR"?valueData.get("doctorProblemNarration").value:valueData.get("patientProblemNarration").value,
      "userRefNo": this.userRefNo,
      "userRole": this.rolePk,
      "appoinmentRefNo": this.appoinment["appointmentRefNo"],
      "fileUploadFor": "PATIENT_PROBLEM_NARRATION"
    });
    if(this.isUpload == true){
      formdata.append('file', valueData.value.file);
    }
    formdata.append('document', prescriptionFileUpload);
  
  
    this.uploadDocumentWithComment(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          //console.log(response);
          this.problemNarrationForm.reset();
          this.problemNarrationForm.get("file").reset();
          this.myNarration = false;
          this.isAnyDoctorComment = false;
          this.isAnyIndividualComment = false;
          this.problemNarrationForm.patchValue({patientProblemNarration: ""});
          this.problemNarrationForm.patchValue({doctorProblemNarration: ""});
          if(this.roleName == "DOCTOR"){
            this._toastService.showI18nToast("Your message is submitted successfully to the Patient", 'success');
          }
          else{
            this._toastService.showI18nToast("Your message is submitted successfully to the Doctor", 'success');
          }
          this.appoinmentService.fetchAllProblemNarration(this.appoinment["appointmentRefNo"]).subscribe(result => {
            if(result.status == 2000) {
              this.problemNarrations = result.data;
              this.selectedFiles = "";
              let arrOfProblems:any[] = this.problemNarrations;
              this.modalRef.hide();
              for(let i = 0; i < arrOfProblems.length; i++){
              let problem = arrOfProblems[i];
              if(problem["createdByUserRole"] == "DOCTOR"){
                this.isAnyDoctorComment = true;
                this.problemNarrationForm.patchValue({doctorProblemNarration: problem["narration"]});
                // if(this.roleName == problem["createdByUserRole"]){
                //   this.problemNarrationForm.patchValue({doctorProblemNarration: problem["narration"]});
                // }
                // else{
                //   this.problemNarrationForm.patchValue({patientProblemNarration: problem["narration"]});
                // }
              }
              else if(problem["createdByUserRole"] == "INDIVIDUAL"){
                this.isAnyIndividualComment = true;
                this.problemNarrationForm.patchValue({patientProblemNarration: problem["narration"]});
                // if(this.roleName == problem["createdByUserRole"]){
                //   this.problemNarrationForm.patchValue({patientProblemNarration: problem["narration"]});
                // }
                // else{
                //   this.problemNarrationForm.patchValue({doctorProblemNarration: problem["narration"]});
                // }
              }
            }
            }
          });
        } else {
          this._toastService.showI18nToast(response.message, 'error')
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
    
  // sbis-poc/app/issues/594
  accordianHeaderClick() {
    this.accordianHeader = !this.accordianHeader;
  }

  problemNarrationCommentDocDownload(problemNarration){

    var element = document.createElement('a');
    element.setAttribute('href', 'data:'+ problemNarration["fileType"] +';base64,' + problemNarration["fileResponseBody"]);
    element.setAttribute('download', problemNarration["fileName"]);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
    
    
    // sbis-poc/app/issues/594
    openProblemNarration(appoinment: any, patientName){
      this.modalRef = this.bsModalService.show(this.problemNarration, {class: 'modal-lg'});
      this.appoinment = appoinment;
      this.isAnyDoctorComment = false;
      this.isAnyIndividualComment = false;
      this.patientTime = this.doctorTime = "";
      this.patientName = this.doctorName = "";
      let user = JSON.parse(localStorage.getItem('user'));
      this.doctorName = user.userName;
      this.patientName = patientName;
     
      this.problemNarrationForm.patchValue({patientProblemNarration: ""});
      this.problemNarrationForm.patchValue({doctorProblemNarration: ""});
      this.appoinmentService.fetchAllProblemNarration(this.appoinment["appointmentRefNo"]).subscribe(result => {
        if(result.status == 2000) {
          this.problemNarrations = result.data;
          let arrOfProblems:any[] = this.problemNarrations;
          for(let i = 0; i < arrOfProblems.length; i++){
          let problem = arrOfProblems[i];
          if(problem["createdByUserRole"] == "DOCTOR"){
            this.isAnyDoctorComment = true;
            this.problemNarrationForm.patchValue({doctorProblemNarration: problem["narration"]});
            this.doctorName = problem["createdBYUserName"];
            this.doctorTime = problem["createdDate"];
          }
          else if(problem["createdByUserRole"] == "INDIVIDUAL"){
            this.isAnyIndividualComment = true;
            this.problemNarrationForm.patchValue({patientProblemNarration: problem["narration"]});
            this.patientName = problem["createdBYUserName"];
            this.patientTime = problem["createdDate"];
          }
        }
        }
      });
    }
    

  //Working on app/issues/595
  pendingHomeVisit() {
    let request = {
      "refNo": this.user.refNo
    }
    this._doctorService.pendingHomeVisitCount(request)
      .subscribe(data => {
        if (data['status'] == '2000') {
          this.pendingHomeVisitCnt = data['data'];
        }
      });
  }



  pendingAppointments() {
    let request = {
      "refNo": this.user.refNo
    }
    this._doctorService.pendingAppointmentNumber(request)
      .subscribe(data => {
        if (data['status'] == '2000') {
          this.pendingAppointment = data['data'];
          if(document.getElementById('welcome-msg') != null){
            if(this.fromDate == this.toDate){
              document.getElementById('welcome-msg').innerHTML = this.translate.instant("IMPINFO.TOP_HEADING_FETCH_PATIENT") + '&nbsp;' + this.dateFormatPipe.transform(this.fromDate);
            }else{
              document.getElementById('welcome-msg').innerHTML = this.translate.instant("IMPINFO.TOP_HEADING_LIST_OF_ALL_PENDING_APPOINTMENTS"); // + '&nbsp;' +this.dateFormatPipe.transform(this.fromDate) + '&nbsp;' + "to" + '&nbsp;' +this.dateFormatPipe.transform(this.toDate)
            }
          }
        }
      });
  }
  //End Working on app/issues/595

  createFetchPatientForm(appStat: any) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.fetchPatientForm = this.fb.group({
      doctor: this.user.id,
      doctorRefNo: this.doctorRefNo,
      patientName: '',
      chamberName: false,
      appStatus: false,
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  onValueChange(label: any, dt: Date): void {
    if (label == 'fromDate' && dt) {
      this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
    }
    if (label == 'toDate' && dt) {
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
  }

  searchPatient() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.searchList = null;
    this.searchStr = "";

    //Working on app/issues/1058

    // if (this.fetchPatientForm.value.doctor != "" && this.searchStr == "")
    //   this.searchStr = "doctor:" + this.fetchPatientForm.value.doctor;
    // else if (this.fetchPatientForm.value.doctor != "" && this.searchStr != "")
    //   this.searchStr = this.searchStr + ";doctor:" + this.fetchPatientForm.value.doctor;


    if (this.fetchPatientForm.value.doctorRefNo != "" && this.searchStr == "")
      this.searchStr = "doctor:" + this.fetchPatientForm.value.doctorRefNo;
    else if (this.fetchPatientForm.value.doctorRefNo != "" && this.searchStr != "")
      this.searchStr = this.searchStr + ";doctor:" + this.fetchPatientForm.value.doctorRefNo;      

   //End Working on app/issues/1058
  
   if (this.fetchPatientForm.value.patientName != "" && this.searchStr == "")
      this.searchStr = "patientName:" + this.fetchPatientForm.value.patientName;
    else if (this.fetchPatientForm.value.patientName != "" && this.searchStr != "")
      this.searchStr = this.searchStr + ";patientName:" + this.fetchPatientForm.value.patientName;

    if (this.chamber.length != 0 && this.searchStr == "")
      this.searchStr = "chamberName:" + this.chamber;
    else if (this.chamber.length != 0 && this.searchStr != "")
      this.searchStr = this.searchStr + ";chamberName:" + this.chamber;

    if (this.stat.length != 0 && this.searchStr == "")
      this.searchStr = "status:" + this.stat;
    else if (this.stat.length != 0 && this.searchStr != "")
      this.searchStr = this.searchStr + ";status:" + this.stat;


    //Working on app/issues/1383

    if(this.fetchPatientForm.value.fromDate==null || this.fetchPatientForm.value.fromDate==""){
      let dt =new Date("01/01/1950"); // If FROM DATE is null then seatch starts from 01/01/1950
      this.fromDate = ('0' + dt.getDate()).slice(-2) +  '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear();
      //dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); 
    }

    if(this.fetchPatientForm.value.toDate==null || this.fetchPatientForm.value.toDate==""){
      let dt =new Date("01/01/2300"); // If TO DATE is null then seatch starts from 01/01/2300
      this.toDate = ('0' + dt.getDate()).slice(-2) +  '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear();
      //dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2); 

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

    this.searchStr = this.searchStr + ";homeVisitFlag:"+this.homeVisitFlag;
    //console.log("searchStr = " + this.searchStr);

    this._doctorService.FindPatientV3('?search=' + this.searchStr)
    //this._doctorService.FindPatient('?search=' + this.searchStr) //Comment for app/issues/1058
      .subscribe(res => {
        this.searchList = null;
        this.cntCON = 0;
        this.cntCOM = 0;
        this.cntVIP = 0;
        this.cntREQ = 0;
        this.cntREJ = 0;
        this.cntCXL = 0;
        if (res.status == 1 && res.data.length != 0) {
          res.data.forEach(ele => {
            ele['due'] = (+ele.fees) - (+ele.payAmount);
          });
          console.log(res.data);
          this.countAppStatus(res.data);
          this.searchList = res.data;
          this.searchListLength = res.data.length;
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
          this.allDataFetched = true;
          if (res.data.length > 5) {
            this.isPaginator = true;
          }
        } else if (res.data.length == 0 && res.status == 1) {
          this.searchList = null;
          this.isPaginator = false;
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
          this.allDataFetched = true;
          this.searchListLength = 0;
          //alert("No Appointment Found in the given date range.");
        } else if (res.status == 0) {
          alert(res.message);
          this.searchList = null;
          this.isPaginator = false;
          this.allDataFetched = true;
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
          this.searchListLength = 0;
        }

        //console.log(this.searchList);
        this.pendingAppointments();
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      });
  }

  getAllChembers(refno) {
    let request = {
      "refNo": refno
    };
    this._doctorService.getAllChambersv2(request)
      .subscribe(res => {
        //console.log(JSON.stringify(res));
        this.chamberList = res;
      });
  }

  getAllAppStatus(name) {
    this._doctorService.GetAppStatus(name)
      .subscribe(res => {
        this.statusList = res;
      });
  }

  chamberChange(e, type) {
    if (e.target.checked) {
      this.chamber.push(type.chamberRefNo);
    }
    else {
      let index = this.findIndexToUpdateChamber(type.chamberRefNo);
      this.chamber.splice(index, 1);
    }
  }

  findIndexToUpdateChamber(chamberRefNo) {
    for (let i = 0; i < this.chamber.length; i++) {
      if (this.chamber[i] == chamberRefNo)
        return i;
    }
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

  startVisit(query, appointment) {
    appointment.appointmentState = this.APP_STATE.VIP;
    appointment.appointmentDateStr = this.convert(appointment.appointmentDate.toString());
    appointment.doctorRefNo = query.doctorRefNo;
    appointment.userRefNo = query.userRefNo;
    appointment.chamberRefNo = appointment.doctorChamber.refNo;
    this._doctorService.saveDoctorAppointment(appointment).subscribe(data => {
      //console.log(data);
      if (data['status'] == '2000') {
        if (data['data'].appointmentState === this.APP_STATE.VIP) {
          // sbis-poc/app/issues/1074
          localStorage.setItem("userRefNo", query.userRefNo);
          localStorage.setItem("appointmentRefNo", data['data'].appointmentRefNo);
          this.router.navigate(['doctor/prescription']);
        }
        else {
          window.location.reload();
        }
      }
      else {
        alert(data['message']);
        window.location.reload();
      }
    })
  }

  resumeAppointment(query, appointment) {
    //appointment.appointmentState = this.APP_STATE.VIP;
    appointment.appointmentDateStr = this.convert(appointment.appointmentDate.toString());
    appointment.doctorRefNo = query.doctorRefNo
    appointment.userRefNo = query.userRefNo;
    appointment.chamberRefNo = appointment.doctorChamber.refNo;
    this._doctorService.saveDoctorAppointment(appointment).subscribe(data => {
      //console.log(data);
      if (data['status'] == '2000') {
        if (data['data'].appointmentState === this.APP_STATE.VIP) {
          // sbis-poc/app/issues/1074
          localStorage.setItem("userRefNo", query.userRefNo);
          localStorage.setItem("appointmentRefNo", data['data'].appointmentRefNo);
          this.router.navigate(['doctor/prescription']);
        }
        else {
          window.location.reload();
        }
      }
      else {
        alert(data['message']);
        window.location.reload();
      }

    })
  }

  appRefNo: any;
  viewPrescription(appointmentRefNo) {
    this.customType = ""; //Working on app/issues/1267
    // alert(appointmentRefNo);
    this.appRefNo = appointmentRefNo;
    //this.router.navigate(['/doctor/prescriptionpreview', pp.appointmentRefNo]);
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    //alert(appointmentRefNo);
    //this.router.navigate(['/doctor/prescriptionpreview', appointmentRefNo]);
  }

  pendingAppointmentListView() {
    this.isPendingAppointment = true;
    this.router.navigate(['/searchPatient/req']);
  }

   //Working on app/issues/595
   pendingHomeVisitListView() {
    this.isPendingAppointment = true;
    this.router.navigate(['/searchPatient/home']);
  }
   //End Working on app/issues/595

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
      
      // Working on app/issues/915

      /*
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
        }) */

      let pendingAppointmentRefnos=[]

      for(let searchedAppointment of this.searchList) {
        if(searchedAppointment.appStatus=="Requested"){
          pendingAppointmentRefnos.push(searchedAppointment.appointment.appointmentRefNo);
        }
      }
      let query = {
        "drRefNo": this.searchList[0].doctorRefNo,
        "pendingAppointments": pendingAppointmentRefnos
      }

      this._doctorService.confirmPendingAppointments(query).subscribe(data => {
        //console.log("Pending Request status:::",data);

        if (data['status'] == '2000') {
          this._toastService.showI18nToast('Your  pending appointments are confirmed.', "success");
        } else {
          alert(data['message']);
        }
        this.searchPatient();
        if (this.appointmentStatus !== "REQ") {
          this.pendingAppointments();
        }
      })
      // End app#915
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
    //this.broadcastService.setIsCommonTemplate(true);
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

    this.isPendingAppointment = true;
    if(!this.router.url.endsWith("/searchPatient")){
        this.router.navigate(['/searchPatient']);
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
      //toDate: ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear()
      fromDate:null,
      toDate:null
    });

    // End Working on app/issues/1383
  }

  resetChamberName() {
    this.fetchPatientForm.patchValue({
      chamberName: ''
    });
    this.chamber = [];
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
    chamberName: '',
    patientName: ''
    });
    this.chamber = [];
    this.stat = [];
  }


  editPrescription(query, appointment, visitPk, appRefNo) {
    // sbis-poc/app/issues/1074
    localStorage.setItem("userRefNo", query.userRefNo);
    localStorage.setItem("appointmentRefNo", appRefNo);
    this.router.navigate(['doctor/prescription']);
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

  manageDoctorAppointment(patientList, appointment, appointmentState,buttonState:string){
    //console.log(appointment.appointmentRefNo);
    let payload = {
      appointmentRefNo: appointment.appointmentRefNo,
      appointmentState: appointmentState
    };
    let manageAppointmentPermission=false;
    // Working on app/issue/2403
    if(appointmentState==this.APP_STATE.NO_SHOW || appointmentState==this.APP_STATE.COMPLETED ){
      if(confirm("Do You Want to "+this.APP_STATE_STATUS[appointmentState]+" this Appointment?")){
        (appointmentState==this.APP_STATE.COMPLETED)? this.createBlankPrescriptionWSCall(appointment): null;
        manageAppointmentPermission=true;
      }
    }
    else{
      manageAppointmentPermission=true;
    }

    if(manageAppointmentPermission){
      let videoChatOpenBoolean: boolean = false;
      console.log(patientList.appointment.onlineConsultation);
      if(buttonState == SBISConstants.APPOINTMENT_BUTTON_CONST.START_VISIT_BUTTON &&
      (patientList.opdType=='L' || patientList.appointment.onlineConsultation == SBISConstants.YES_NO_CONST.YES_ENUM) &&
       (patientList.payAmount >= patientList.fees) && (patientList.appStatus != 'Completed')){
        this.constructVideoChat(patientList);
         videoChatOpenBoolean = true;
       }else{
         console.log("bbb");
       }

      this.manageAppointmentWSCall(patientList,payload,videoChatOpenBoolean);

    } // End Working on app/issue/2403
  }//end of method
  manageAppointmentWSCall(patientListEl:any,payload:any,fromChatIconClick: boolean) {
    this._doctorService.manageAppoinment(payload).subscribe((data) => {
      console.log("manageAppoinment::",data);
      
      if (data.status == 2000) {
        if(fromChatIconClick)
           this.router.navigate(['doctor/prescription']) ;
        if (data['data'].appointmentState === this.APP_STATE.VIP) {
          // sbis-poc/app/issues/1074
          localStorage.setItem("userRefNo", patientListEl.userRefNo);
          localStorage.setItem("appointmentRefNo", data['data'].appointmentRefNo);
          this.router.navigate(['doctor/prescription']);
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
            //console.log(this.videoStart);

        /*if(("onlineDoc" in localStorage) && ("offlineStatus" in localStorage) ){
          localStorage.removeItem("onlineDoc");
          localStorage.removeItem("offlineStatus");
        }

        console.log("onlineDoc" in localStorage);
        console.log("offlineStatus" in localStorage);*/

        if(this.videoStart == null ||  this.videoStart == undefined){
          localStorage.setItem("online", SBISConstants.YES_NO_CONST.NO_ENUM);
          //localStorage.setItem("offlineStatus", SBISConstants.YES_NO_CONST.YES_ENUM);
          //console.log("ccc");
        }else{
          localStorage.setItem("online", SBISConstants.YES_NO_CONST.YES_ENUM);
        }
      }
      if(data.status == 5061) {
        this._toastService.showI18nToast(data.message, "error");
        this.searchPatient();
        this.pendingAppointments();
      }
    });
  }//end of method
  // Working on app/issues/595
  userAddress: any = null;
  setHomeVisitAppointment(query, appointment, appointmentState){
    this.userAddress = null;
    // Working on app/issues/1058
    let payload = {
      appointmentRef: appointment.appointmentRefNo
    }
    this._doctorService.findUserDetailsByAppointment(payload).subscribe((data) => {
      //console.log(data);
      if (data['status'] == '2000') {
        this.userAddress = data["data"]
      }      
    });
    // End Working on app/issues/1058
    this.homeVisitSetTimeForm = this.fb.group({
      appointmentRefNo: [appointment.appointmentRefNo],
      patientName: [query.patientName],
      appointmentDate: [this.convertStrToDt(appointment.appointmentDate)],
      appointmentTime: [null],
      timeTo:[null]
    })
    //console.log(this.homeVisitSetTimeForm.value);
    
    this.homeVisitAppointment = query;
    this.modalRef = this.bsModalService.show(this.homeVisitAppointmentModal, { class: 'modal-lg' });
  }

  confirmHomeVisitAppointment(appointmentState){
    this.submitted = true;
    if(this.homeVisitSetTimeForm.invalid){
      return;
    }
    let payload = {
      appointmentRefNo: this.homeVisitSetTimeForm.value.appointmentRefNo,
      appointmentState: appointmentState,
      appointmentTime: this.homeVisitSetTimeForm.value.appointmentTime+":00",
      timeTo: this.homeVisitSetTimeForm.value.timeTo,
      homeVisitIndicator: true
    }
    
    this._doctorService.manageAppoinment(payload).subscribe((data) => {
      //console.log(data);
      if (data['status'] == '2000') {
        if (data['data'].appointmentState === this.APP_STATE.CONFIRMED) {
          this._toastService.showI18nToast('Your Appointment is confirmed.', "success");
          this.modalRef.hide();
          this.searchPatient();
          if (this.appointmentStatus !== "REQ") {
            this.pendingAppointments();
          }
        }
      }      
    });
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
    //console.log(this.homeVisitSetTimeForm.value)
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

  // End Working on app/issues/595

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
      //console.log("Invoice");  
      //console.log(res);
      if(res.status == 2000) {
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
        this.invoiceList = res["data"];
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
      this.createBlankPrescriptionWSCall(appointment);
    }//end of confirm box    
  }//end of method
  createBlankPrescriptionWSCall(appointment: any) {
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
  }//end of method

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
          //console.log("appoinment:::",q);
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

        this.loading = true;
        document.body.classList.add('hide-bodyscroll');
        
        formdata.append('document', documentDtoList);
          this.saveDocument(formdata).subscribe(event => {
            if (event instanceof HttpResponse) {
              let response = JSON.parse(event.body);
              if (response.status = 2000) {
                this.loading = false;
                document.body.classList.remove('hide-bodyscroll');
                this._toastService.showI18nToast(response.message,"success");           
                if(q.appointment.appointmentState == this.APP_STATE.CONFIRMED){
                  this.searchPatient();
                }
              } else {
                this.loading = false;
                document.body.classList.remove('hide-bodyscroll');
                this._toastService.showI18nToast(response.message, 'error')
              }
      
            }
          });
       
    }

    saveDocument(formData:any): Observable<any> {
      let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
       // reportProgress: true,
        responseType: 'text'
      });
      return this.http.request(req);
     
    }

  //End Working on app/issues/1292

  iframeSrc: any;
  refNo: any;
  showIframe: boolean = false;
  // onChatClick(q){
  //   //console.log(q);
  //   this.showIframe = true;
  //   this.refNo = q.appointment.appointmentRefNo;
  //   this.iframeSrc = "https://tokbox.com/embed/embed/ot-embed.js?embedId=6cad1b31-ad55-408e-8fe1-236cdbaf211b&room="+q.appointment.appointmentRefNo+"&iframe=true"
    
  // }
  onChatClick(query){
    // console.log(query);
    if(confirm("Are you sure you wanted to start the video conference?")) {
      this.constructVideoChat(query);
      let payload: any ={
         appointmentRefNo: query.appointment.appointmentRefNo,
         appointmentState: this.setAppointmentStateAccordingToTermAndCondition(query)
       };
      
      this.manageAppointmentWSCall(query,payload,true);
    }
    //  this.router.navigate(['doctor/prescription']);
  }
  constructVideoChat(query: any) {
      console.log(query);
      this.videoStart = query.appointment.onlineConsultation;
      localStorage.setItem("userRefNo", query.userRefNo);
     localStorage.setItem("online", SBISConstants.YES_NO_CONST.YES_ENUM);
     localStorage.setItem("appointmentRefNo", query.appointment.appointmentRefNo);
  }//end of method
  setAppointmentStateAccordingToTermAndCondition(q: any): string {
    if(q.appStatus==='Requested' && q.homeVisitIndicator == 'N')
      return this.APP_STATE.CONFIRMED;
    else if(q.appStatus==='Confirmed' || q.appStatus==='Visit In Progress')
      return this.APP_STATE.VIP;
    else
      return q.appoinment.appointmentState;
  }//end of method

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
}
