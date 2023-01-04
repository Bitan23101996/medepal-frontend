
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

import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format/date-format.pipe';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { Location } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { IndividualService } from '../../../modules/individual/individual.service';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { GetSet } from 'src/app/core/utils/getSet';
import { ServiceProviderService } from 'src/app/modules/service-provider/service-provider.service';

@Component({
  selector: 'app-treatment-history',
  templateUrl: './treatment-history.component.html',
  styleUrls: ['./treatment-history.component.css']
})
export class TreatmentHistoryComponent implements OnInit {

  // @ViewChild('testReportsUpload') testReportsUpload: TemplateRef<any>;//to upload doc by modal--https://gitlab.com/sbis-poc/app/issues/1163 issue
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  @ViewChild('noteModal') noteModal: TemplateRef<any>;
  @ViewChild('procedurePreviewModal') procedurePreviewModal: TemplateRef<any>; //Working on #1387
  @Input() userRefNo: any;
  @Input() doctorRefNo: any;
  @Input() screenFlag: any;
  @Output() treatmentFormData = new EventEmitter<any>();

  loggedInUser: any;
  domSanitizer: any;
  doctorNoteList: any;
  modalRef: BsModalRef;
  pastPrescription: any = [];
  userProfileData: any;
  appRefNo: any;
  config = {
    // class: 'custom-modal-width modal-lg',
    // backdrop: true,
    // ignoreBackdropClick: true
    class: 'modal-lg',
  };
  patientPrescriptionDetail: any = {};
  uploadForm: FormGroup;
  prescriptionForm: FormGroup;
  doctorNoteForm: FormGroup;
  showDiagnosticsTestReport: boolean = false;
  medicalDiagnosticDetailsData: any;
  user: any;

  constructor(private individualService: IndividualService, private broadcastService: BroadcastService, private _domSanitizer: DomSanitizer, private modalService: ModalService,
    private router: Router, private apiService: ApiService,private serviceProviderService: ServiceProviderService,
    private _doctorService: DoctorService, private dateFormatPipe: DateFormatPipe, private bsModalService: BsModalService, private fb: FormBuilder, private route: ActivatedRoute,
    private _location: Location, private frb: FormBuilder, private http: HttpClient, private toastService: ToastService,private doctorService: DoctorService) {
    this.domSanitizer = _domSanitizer;
    this.uploadForm = frb.group({
      //'testName': [null, [Validators.required]],
      'file': [null, [Validators.required]],
      'documents': [null],
      //'date': [new Date()],
      'fileUploadFor': [SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS],
      'isSubmit': [false]
    });
  }
  createForm() {
    this.doctorNoteForm = this.fb.group({
      note: [null],
      noteStatus: ["NRM"],
      doctorRefNo: [this.doctorRefNo],
      patientRefNo: [this.userRefNo]
    });

  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    //this.getPastPrescriptionV3(this.userRefNo, this.doctorRefNo);
    if(this.screenFlag == 'opd'){         //[//https://gitlab.com/sbis-poc/app/issues/1103]
      this.user = JSON.parse(GetSet.getPatientDetails());
      this.getPastPrescriptionsOfSelectedPatientByOPD(this.user.ref_no);
    }else{                              //[//https://gitlab.com/sbis-poc/app/issues/1103]
      this.user = GetSet.getPatientDetailsByDoctor();
      this.getPastPrescriptionV4(this.userRefNo, this.doctorRefNo);
    }
  }

  newPrescription() {
    this.router.navigate(['doctor/createPrescription']);
  }



  openNoteModal() {
    //this.modalService.open(id);
    this.createForm();
    this.modalRef = this.bsModalService.show(this.noteModal, this.config);
  }

  closeModal() {
    this.modalRef.hide();
  }


  saveNote() {
    //debugger;
    //console.log(this.doctorNoteForm.value);
    this._doctorService.saveDoctorNote(this.doctorNoteForm.value).subscribe(data => {
      //console.log("NoteForm", data);
      this.modalRef.hide();
      this.doctorNoteForm.patchValue({
        note: ""
      });
      // this.openNoteList(this.userpk,this.doctorPk);
      this.openNoteList(this.userRefNo, this.doctorRefNo);

    },
      (error) => {
        alert("Internal Server Problem");
        return;
      });

  }

  back() {
    //this.router.navigateByUrl(this.returnUrl);
    //this.router.navigate(['searchPatientByDoctor']);
    this._location.back();
    //window.history.back();
  }

 /* onUploadModal() { --closed because of https://gitlab.com/sbis-poc/app/issues/1163 issue
    this.uploadForm.patchValue({
      'documents': null
    });
    this.uploadForm.reset();
    this.uploadForm.controls.fileUploadFor.setValue(SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS);
    this.modalRef = this.bsModalService.show(this.testReportsUpload, { class: 'modal-lg' });
  }//end of method */

  onSubmit() {
    this.uploadForm.patchValue({
      isSubmit: true
    });

    if (this.uploadForm.invalid) {
      return;
    }
    let valueData = this.uploadForm.value;

    let formdata = new FormData();
    let prescriptionFileUpload = JSON.stringify({
      "forRefNo": this.userRefNo,
      "byRefNo": this.doctorRefNo,
      // "doctorName": valueData.doctorName,
      //"testName": valueData.testName.longName,
      "fileUploadFor": valueData.fileUploadFor,
      //"date": valueData.date
   });

    formdata.append('file', valueData.file);
    formdata.append('document', prescriptionFileUpload);


    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status == 2000) {
          this.modalRef.hide();
          this.toastService.showI18nToast('MY_PRESCRIPTION_TOAST.TEST_REPORT_UPLOADED', 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error');
        }
      }
    });
  }

  saveDocument(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
    //return this.apiService.UploadProfiePhoto.upload(formData);
  }

    prescriptionFileSelected(event) {
    let fileEvent = event.target.files[0];
    if(fileEvent.type == "application/pdf") {
      //do nothing
    } else {
      this.toastService.showI18nToast("File type should be pdf", "warning");
      return;
    }
    if(fileEvent.size > 2000000) {
      this.toastService.showI18nToast("File size will not more then 2mb", "warning");
      return;
    }
    this.uploadForm.patchValue({
      file: event.target.files[0]
    });
  }

  openNoteList(userRefNo, doctorRefNo) {
    let payload = {
      doctorRefNo: doctorRefNo,
      userRefNo: userRefNo
    }
    this._doctorService.getAllPastNoteV2(payload).subscribe(data => {
      if (data['status'] == '2000') {
        this.doctorNoteList = data['data'];
        //console.log(this.doctorNoteList);

      }
    });
    //console.log(this.doctorNoteList);
    // this.modalRef = this.bsModalService.show(this.noteModal, this.config);
  }

  /* getPastPrescriptionV3(userRefNo, doctorRefNo) {
    let payload = {
      doctorRefNo: doctorRefNo,
      userRefNo: userRefNo,
    }
    this._doctorService.getPastPrescriptionApiV3(payload)
      .subscribe(data => {
        this.pastPrescription = data.data;
      },
        (error) => {
          alert("Internal Server Problem");
          return;
        });
  } */

  //sbis-poc/app/issues/862 start
  showDataFlag: boolean = false; // Working on app/issues/1161
  getPastPrescriptionV4(userRefNo, doctorRefNo) {
    let payload = {
      doctorRefNo: doctorRefNo,
      userRefNo: userRefNo,
    }
   this.showDataFlag = false; // Working on app/issues/1161
    this._doctorService.getPastPrescriptionApiV4(payload)
      .subscribe(data => {
        console.log(data.data);
        
        this.calculateProcedureStartTime(data.data);
        this.getUploadedDocumentListAndSetTheListToTheArray(data.data);//new add to get uploaded document list by document ref number
      },
        (error) => {
          alert("Internal Server Problem");
          return;
        });
  }//end of method

  getUploadedDocumentListAndSetTheListToTheArray(responseArray: any[]) {
    responseArray.forEach((element,index) => {
      element['uploadedMRImages'] = [];
      element.uploadedMedicalRecordList.forEach((el,ind)=>{
        let query = {
          'downloadFor': SBISConstants.IMAGE_UPLOAD_CONST.TEST_REPORT,
          'documentRefNo': el
        }
        this.doctorService.downloadDocument(query).subscribe((result) => {
          if (result.status == 2000) {                
            let imgSrc = "data:"+((result.data.contentType)? result.data.contentType: "image/jpeg")+";base64,"+ result.data.data;
            let imgURL: any = "data:"+((result.data.contentType)? result.data.contentType: "image/jpeg")+";base64,"+ result.data.data;
            element.uploadedMRImages.push({imgSrc: imgURL, contentType: result.data.contentType, actualSrc: imgSrc});
          }              
        });
      });
      if((index+1) == responseArray.length){
        this.pastPrescription = [];
        this.pastPrescription = responseArray;
      }
    });
  }//end of method

   //Call this method in the image source, it will sanitize it.
   transform(imgSrc){
    return this._domSanitizer.bypassSecurityTrustResourceUrl(imgSrc);
  }//end of method

   //method to open image in new tab
   openImageInNewTab(imgSrc){
    var image = new Image();
    image.src = imgSrc;
    var w = window.open("");
    w.document.write(image.outerHTML);
  }//end of method

  openPdf(src){
    var newTab = window.open();
    newTab.document.body.innerHTML = '<iframe width="100%" height="101%" style="padding: 0;margin:0;" src="'+src+'""></iframe>';
    newTab.document.body.style.overflow = "hidden";
    newTab.document.body.style.margin = "0";
    newTab.document.body.style.padding = "0";

  }

  //create a common method to store past prescription from response and calculate procedure start time
  calculateProcedureStartTime(response){
    this.pastPrescription = response;
    if(this.pastPrescription && this.pastPrescription.length>0){
      for(let i=0; i < this.pastPrescription.length; i++){
        let prescription = this.pastPrescription[i];
        if((!prescription["prescription"]) && prescription["procedureStartTime"]){
            let sT = prescription["procedureStartTime"].substring(3,5);
            let stSub = prescription["procedureStartTime"].substring(0,2);
            prescription["procedureStartTime"] = (((+stSub)>12)?((+stSub)-12): stSub )+":"+sT + (((+stSub)>12)?" PM": " AM");
        }
      }
    }
    this.showDataFlag = true; // Working on app/issues/1161
  }//end of method

  //method to get selected patient's past prescription by opd [//https://gitlab.com/sbis-poc/app/issues/1103]
  getPastPrescriptionsOfSelectedPatientByOPD(selectedPatientRefNo: string){
    this.serviceProviderService.getPastPrescriptionOfSelectedPatientByOPD({userRefNo: selectedPatientRefNo}).
    subscribe(res=>{
      if(res.status == 2000){
        this.calculateProcedureStartTime(res.data);
      }
    },err=>{

    });
  } //end of method [end of working of //https://gitlab.com/sbis-poc/app/issues/1103]

  openProcedure(pp){
    this.fetchUserDetailsByUserRefNo("editProcedure",pp.procedureRefNo);
  }
  //sbis-poc/app/issues/862 end

  openPrescriptionModal(pp) {
    this.appRefNo = pp.appointmentRefNo
    //this.router.navigate(['/doctor/prescriptionpreview', pp.appointmentRefNo]);
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, this.config);
  }

  cancelPatientPreview() {
    this.treatmentFormData.emit(false);
  }

  onProcedureNote() {//issue number #765
    this.fetchUserDetailsByUserRefNo("procedure");
  }//end of method

  peerConsulting() {//issue number #765
    this.fetchUserDetailsByUserRefNo("peerConsulting");
  }
  //issue number 765

//shanu
  //edit diagnostics test details
  onClickEditDiagnosticsTestDetails(diagnosticsTestDetails, prescription,editAddStr: string) {
    if(editAddStr == 'edit'){
      this.patientPrescriptionDetail['prescriptionRefNo'] = prescription.prescriptionRefNo;
      this.medicalDiagnosticDetailsData = diagnosticsTestDetails;
    }else{
      this.medicalDiagnosticDetailsData = "";
    }
    this.patientPrescriptionDetail['refNo'] = this.userRefNo;
    this.patientPrescriptionDetail['name'] = (this.user)?(this.user.name? this.user.name : ''): prescription.individualUserEntity.name;
    (editAddStr == 'edit')? this.showDiagnosticsTestReport = true: this.fetchUserDetailsByUserRefNo("testReport");
  } // end of method

  //close diagnostics edit modal
  medicalDetailsClose(){
    this.showDiagnosticsTestReport = false;
  }//end of method
//shanu

//creating a method to fetch user details [https://gitlab.com/sbis-poc/app/issues/1163] --susmita--
fetchUserDetailsByUserRefNo(calledFrom: string , procedureRefNo?: string){
  let payload = {
    refNo: this.userRefNo
  }
  let age: any;
  //taking a json to store patient details
  let patient: any = {};
  this._doctorService.getPatientDetailsByRefNo(payload).subscribe(data => {
    if (data['data']) {
      if (data['data'].dateOfBirth != null) {
        const bdate = new Date(data['data'].dateOfBirth);
        const timeDiff = Math.abs(Date.now() - bdate.getTime());
        age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " Y";
        patient["name"] = data['data'].name;
        patient["age"]  = age;
        patient["gender"] =  data['data'].gender;
        patient["ref_no"] = this.userRefNo;
        switch(calledFrom){
          case "procedure":{
            this.commonRouteByParameter(calledFrom,patient);
            break;
          }
          case "editProcedure":{
            this.commonRouteByParameter(calledFrom,patient,procedureRefNo);
            break;
          }
          case "testReport":{
            this.patientPrescriptionDetail['name'] = patient.name;
            this.commonRouteByParameter(calledFrom,patient);
            break;
          }
          case "peerConsulting":{
            patient["mobile"] = "+919230325697";
            patient["ms_user_pk"] = "1";
            patient["prescriptionDate"] = "2019-07-16";
            this.commonRouteByParameter(calledFrom,patient);
            break;
          }
        }
      }      
    }
  });  
}//end of method -- [https://gitlab.com/sbis-poc/app/issues/1163]

//a common method to route procedure/test-report/peer-consulting
commonRouteByParameter(whereToRoute: string,patient: any,procedureRefNo?: string){
  GetSet.setPatientDetails(JSON.stringify(patient));
  switch(whereToRoute){
    case "peerConsulting":{
      this.router.navigate(['peerconsulting/peer-consulting-request']);
      break;
    }
    case "procedure":{
      this.router.navigate(['doctor/procedure']);
      break;
    }
    case "editProcedure":{
      this.router.navigate(['doctor/procedure',procedureRefNo]);
      break;
    }
    case "testReport":{
      this.showDiagnosticsTestReport = true;
      break;
    }
  }//end of switch
}//end of method

//Working on #1387
procedureNote: any=null;
openProcedureModal(procedure){
  let payload = {
    refNo: this.userRefNo
  }
  let age: any;
  //taking a json to store patient details
  let patient: any = {};
  this._doctorService.getPatientDetailsByRefNo(payload).subscribe(data => {
    if (data['data']) {
      if (data['data'].dateOfBirth != null) {
        const bdate = new Date(data['data'].dateOfBirth);
        const timeDiff = Math.abs(Date.now() - bdate.getTime());
        age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " Y";
        patient["name"] = data['data'].name;
        patient["age"]  = age;
        patient["gender"] =  data['data'].gender;
        patient["ref_no"] = this.userRefNo;
      }
    }
  })
  procedure["patient"] = patient
  console.log(procedure);
  this.procedureNote = procedure;
  this.modalRef = this.bsModalService.show(this.procedurePreviewModal, this.config);
}
//End Working on #1387

}//end of class
