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
import { Component, OnInit, TemplateRef, ViewChild, Query, OnDestroy } from '@angular/core';
import { IndividualService } from '../individual.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { FormGroupDirective, FormBuilder, FormGroup, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { ToastService } from './../../../core/services/toast.service';
import { ApiService } from './../../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { GetSet } from 'src/app/core/utils/getSet';
import { SBISConstants } from 'src/app/SBISConstants';
import { CoreService } from 'src/app/core/core.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-my-prescriptions',
  templateUrl: './my-prescriptions.component.html',
  styleUrls: ['./my-prescriptions.component.css'],
  providers: [FormGroupDirective]
})
export class MyPrescriptionsComponent implements OnInit, OnDestroy {
  @ViewChild('prescriptionUpload') prescriptionUpload: TemplateRef<any>;

  user_id: any;
  user_name: any;
  user_email: string;
  headingToDisplay: string = "My Prescriptions"; //to display the heading on html page
  headingsArray: any[] = [];//to display the headings on right side
  myPrescriptionsFiltering: any = [];
  myPrescriptions: any = [];
  myGroupPresciption: any = [];
  prescriptionsForMe: any = [];
  minorPrescription: any = [];
  prescriptionsForMyGroup: any = [];
  patientNames: any[] = [];
  doctorNames: any[] = [];
  modalRef: BsModalRef;
  patientNamelist: any[] = [];
  uploadForm: FormGroup;
  prescriptionListToview: any = [];
  filteredModeForPatient: any = false;
  filteredModeForDoctor: any = false;
  prescriptionSBIS: any = false;
  refinePanelShowFlag: boolean = false;//to show n hide data
  download = {
    downloadImageSrc: "",
    contentType: "",
    doctorName: "",
    forUserName: ""
  }
  domSanitizer: any;
  dateFormat = "";
  filterDate = {
    fromDate: "",
    toDate: ""
  };
  errorMsgShowFlag: boolean = false;//to show error msg
  maxDate: any;
  user_refNo: any;
  myGroupList: any = false;
  minorList: any = false;
  minorCount: any = false;
  prescriptionFor: string;
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  @ViewChild('docSendEmailModal') docSendEmailModal: TemplateRef<any>;
  appRefNo: any;
  prescriptionRefNo: any;
  panelVisible = false;
  SBISConstantsRef = SBISConstants;
  prescriptionFileUpload: FormGroup;
  emailSendFormGroup: FormGroup;
  fetchAllData: boolean = false;
  loading:boolean = false;
  prescription: any;
  constructor(
    private individualService: IndividualService,
    private modalService: ModalService,
    private bsModalService: BsModalService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService,
    private frb: FormBuilder,
    private apiService: ApiService,
    private broadcastService: BroadcastService,
    private _domSanitizer: DomSanitizer,
    private coreService: CoreService,
    private datePipe: DatePipe
  ) {
    this.domSanitizer = _domSanitizer;
    this.uploadForm = frb.group({
      'doctorName': [null, [Validators.required]],
      'forUserPk': [null, [Validators.required]],
      'file': [null, [Validators.required]],
      'documents': [null],
      'date': [new Date()],
      'fileUploadFor': [SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION],
      'isSubmit': [false]
    });
    this.buildForm();
    this.customiseDesignOfBodyAcordingToUrl();
  }//end of constructor

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.loadInitialData();//to load initial data
  }//end of oninit

  //method to load initialData
  loadInitialData() {
    this.maxDate = new Date();
    this.dateFormat = environment.DATE_FORMAT;
    this.prescriptionFor = SBISConstants.MY_PRESCRIPTION_CONST.OWN;
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_name = user.userName;
    this.user_refNo = user.refNo;
    this.prescriptionFileUpload = this.formBuilder.group({
      documents: [[]]
    });
    this.getUserEmail();//to get user email
    this.loadPrescriptionData();//get the prescription list ws call
    GetSet.setPreviousAddressForReorderMed(null);
    if (GetSet.getMinorCount() == 0) {
      this.minorCount = false;
    } else {
      this.minorCount = true;
    }
    this.constructHeadingsArray();

  }//end of method

  customiseDesignOfBodyAcordingToUrl(){
    const url = window.location.href.toString();
    if(url.endsWith("/my-prescription"))
      document.body.classList.add('prescription-screen');
    else
        document.body.classList.remove('prescription-screen');
  }//end of method

  ngOnDestroy(){
    document.body.classList.remove('prescription-screen');
  }//end of method

  //method to construct headers array -- to display the headers to the right side of the page
  constructHeadingsArray() {
    this.headingsArray.push({ prescriptionFor: SBISConstants.MY_PRESCRIPTION_CONST.OWN, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.OWN });
    this.headingsArray.push({ prescriptionFor: SBISConstants.MY_PRESCRIPTION_CONST.GROUP, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.GROUP });
    this.headingsArray.push({ prescriptionFor: SBISConstants.MY_PRESCRIPTION_CONST.MINOR, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.MINOR });
    this.headingsArray.push({ prescriptionFor: SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE });
  }//end of method

  buildForm() {
    let formGroupJson: any = {
      "email": new FormControl(null, [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
      "prescriptionRefNo": new FormControl()
    };
    this.emailSendFormGroup = new FormGroup(formGroupJson);
  }//end of build form

  getUserEmail() {//method to get user email
    this.individualService.getUserEmail(this.user_refNo).subscribe(res => {
      if (res.status == 2000) {
        this.user_email = res.data ? res.data : null;
      }
    });
  }//end of method

  loadPrescriptionData() {
    this.prescriptionListToview = [];
    let prescriptionListToViewLocal: any = [];
    this.individualService.getPrescriptionForUser(
      { "prescriptionFor": (this.prescriptionFor == SBISConstants.MY_PRESCRIPTION_CONST.OWN ? null : this.prescriptionFor) })
      .subscribe((result) => {
        if (result.status != 2000) {
          return;
        }
        switch (this.prescriptionFor) {
          case SBISConstants.MY_PRESCRIPTION_CONST.OWN: {
            this.headingToDisplay = 'My Prescriptions';
            this.myGroupList = false;
            this.minorList = false;
            this.myPrescriptions = result.data.ownPrescriptions;
            this.prescriptionsForMe = result.data.ownPrescriptions;
            prescriptionListToViewLocal = result.data.ownPrescriptions;
            break;
          }
          case SBISConstants.MY_PRESCRIPTION_CONST.GROUP: {
            this.headingToDisplay = 'Group Member Prescriptions';
            this.myGroupList = true;
            this.minorList = false;
            this.myGroupPresciption = result.data.groupPrescriptions;
            prescriptionListToViewLocal = result.data.groupPrescriptions;
            break;
          }
          case SBISConstants.MY_PRESCRIPTION_CONST.MINOR: {
            this.headingToDisplay = 'Minor Prescriptions';
            this.myGroupList = false;
            this.minorList = true;
            this.minorPrescription = result.data.minorPrescriptions;
            prescriptionListToViewLocal = result.data.minorPrescriptions;
            break;
          }
          case SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE: {
            this.headingToDisplay = 'Associate Prescriptions';
            this.minorPrescription = result.data.associatePrescriptions;
            prescriptionListToViewLocal = result.data.minorPrescriptions;
            break;
          }

        }
        this.prescriptionListToview = prescriptionListToViewLocal;
        this.myPrescriptionsFiltering = this.prescriptionListToview;
        this.sortDataByDate();//https://gitlab.com/sbis-poc/app/issues/895
        this.patientNamelist = [];
        this.bindPationNameList();
        this.prescriptionFilter();
        this.refinePanelShow();
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
        (prescriptionListToViewLocal.length == 0) ? this.errorMsgShowFlag = true : this.errorMsgShowFlag = false;
        this.fetchAllData = true;
      });
  }//end of method

  //method to sort data by date
  sortDataByDate() {
    //https://gitlab.com/sbis-poc/app/issues/895
    this.prescriptionListToview.length > 0 ? this.prescriptionListToview.sort((a, b) => {
      const d1 = new Date(a.prescriptionDate);
      const d2 = new Date(b.prescriptionDate);
      return (d1.getTime() - d2.getTime()) * -1;
    }) : null;
    //https://gitlab.com/sbis-poc/app/issues/895
  }//end of method

  refinePanelShow() {
    (this.prescriptionListToview.length > 0) ? this.refinePanelShowFlag = true : this.refinePanelShowFlag = false;
  }

  prescriptionFileSelected(event) {
    this.uploadForm.patchValue({
      file: event.target.files[0]
    });
  }

  onSubmit() {
    this.uploadForm.patchValue({
      isSubmit: true
    });

    if (this.uploadForm.invalid) {
      return;
    }
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    
    let valueData = this.uploadForm.value;

    let formdata = new FormData();
    let prescriptionFileUpload = JSON.stringify({
      "forRefNo": valueData.forUserPk,
      "byRefNo": this.user_refNo,
      "doctorName": valueData.doctorName,
      "fileUploadFor": valueData.fileUploadFor,
      "uploadDate": valueData.date
    });

    formdata.append('file', valueData.file);
    formdata.append('document', prescriptionFileUpload);

    if(this.uploadForm.status == "INVALID"){
      return;
    }

    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status == 2000) {
          this.modalRef.hide();
          this.toastService.showI18nToast('MY_PRESCRIPTION_TOAST.PRESCRIPTION_UPLOADED', 'success');
          this.individualService.getPrescriptionByUserId(this.user_refNo).subscribe((resp) => {
            if (this.minorList == true) {
              this.prescriptionListToview = resp.data.minorPrescriptions;
            } else if (this.myGroupList == true) {
              this.prescriptionListToview = resp.data.groupPrescriptions;
            } else {
              this.prescriptionListToview = resp.data.ownPrescriptions;
            }
          });
          this.loadPrescriptionData();
          this.fetchAllData = true;
          this.refinePanelShow();
        } else {
          this.toastService.showI18nToast(response.message, 'error');
          this.fetchAllData = false;
          this.refinePanelShow();
        }
      }
    });
  }

  onUpload(formValue) {
    let valueData = this.uploadForm.value;
    let formdata: FormData = new FormData();
    formdata.append('file', valueData.documents);
    let documentDtoList = JSON.stringify({
      "forUserPk": valueData.forUserPk,
      "byUserPk": valueData.byUserPk,
      "doctorName": valueData.doctorName,
      "fileUploadFor": valueData.fileUploadFor,
    });
    formdata.append('document', documentDtoList);
    let fileName = formValue.fileName;
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.toastService.showI18nToast('MY_PRESCRIPTION_TOAST.PRESCRIPTION_UPLOADED', 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  saveDocument(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      responseType: 'text'
    });
    return this.http.request(req);
  }

  //method to set the data according to second header click
  onClickSecondHeader(clickedPrescriptionForLabelName: string) {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.prescriptionFor = clickedPrescriptionForLabelName;
    this.loadPrescriptionData();
  }//end of method 

  bindPationNameList() {
    this.patientNamelist = [];
    if (this.minorList) {
      this.individualService.listViewOfMinor(this.user_refNo).subscribe((respForMinor) => {
        for (let minorMember of respForMinor.data) {
          if (minorMember.minor.id != this.user_id) {
            this.patientNamelist.push({ forUserName: minorMember.minor.name, userRefNo: minorMember.minor.userRefNo, selected: false });
          }
        }
      });
    } else if (this.myGroupList) {
      this.individualService.getGroupMember(this.user_refNo + '?permission=ALL').subscribe((result) => {
        for (let groupMember of result.data) {
          if (groupMember.userRefNo != this.user_refNo) {
            this.patientNamelist.push({ forUserName: groupMember.name, userRefNo: groupMember.userRefNo, selected: false });
          }
        }
      });
    } else {
      let user = JSON.parse(localStorage.getItem('user'));
      let query = {
        forUserName: user.userName,
        userRefNo: user.refNo,
        selected: false
      }
      this.patientNamelist.push(query);
    }
  }

  prescriptionFilter() {
    this.patientNames = [];
    this.doctorNames = [];
    this.myPrescriptionsFiltering = this.prescriptionListToview;
    for (let prescription of this.prescriptionListToview) {
      if (this.doctorNames.filter(x => x.doctorName == prescription.doctorName).length == 0) {
        this.doctorNames.push({ doctorName: prescription.doctorName, selected: false });
      }
      if (this.patientNames.filter(x => x.forUserName == prescription.forUserName).length == 0) {
        this.patientNames.push({ forUserName: prescription.forUserName, selected: false });
      }
    }
    this.updatePrescroptionList();
  }

  uploadModal() {
    this.uploadForm.patchValue({
      'documents': null
    });
    this.uploadForm.reset();
    this.uploadForm.controls.date.setValue(new Date());
    this.uploadForm.controls.fileUploadFor.setValue(SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION);
    this.modalRef = this.bsModalService.show(this.prescriptionUpload, { class: 'modal-lg' });
  }

  bindFilterList(filterList) {
    filterList.forEach(item => {
      if (this.prescriptionListToview.filter(y => y['index'] == item['index']).length == 0) {
        this.prescriptionListToview.push(item)
      }
    });
  }

  updatePrescroptionList() {
    let selectedPatient = this.patientNames.filter(x => x.selected);
    let selectedDoctor = this.doctorNames.filter(x => x.selected);
    this.myPrescriptionsFiltering.forEach(function (item, index) {
      item["index"] = index;
    });
    this.prescriptionListToview = [];
    if (selectedPatient.length > 0 && selectedDoctor.length > 0) {
      selectedPatient.forEach(itemX => {
        selectedDoctor.forEach(itemY => {
          let filterList = this.myPrescriptionsFiltering.filter(x => x['forUserName'] == itemX['forUserName'] && x['doctorName'] == itemY['doctorName']);
          if (filterList.length > 0) {
            this.bindFilterList(filterList);
          }
        });
      });
    } else if (selectedPatient.length > 0) {
      let arLength = selectedPatient.length;
      for (let i = 0; i < arLength; i++) {
        let pationtObj = selectedPatient[i];

        let filterList = this.myPrescriptionsFiltering.filter(x => (typeof pationtObj['forUserName'] != "undefined" && pationtObj['forUserName'] == x['forUserName']));
        if (filterList.length > 0) {
          this.bindFilterList(filterList);
        }
      }
    } else if (selectedDoctor.length > 0) {
      let arLength = selectedDoctor.length;
      for (let i = 0; i < arLength; i++) {
        let doctorObj = selectedDoctor[i];

        let filterList = this.myPrescriptionsFiltering.filter(x => (typeof doctorObj['doctorName'] != "undefined" && doctorObj['doctorName'] == x['doctorName']));
        if (filterList.length > 0) {
          this.bindFilterList(filterList);
        }
      }
    } else {
      this.prescriptionListToview = this.myPrescriptionsFiltering;
    }

    if (this.filterDate.fromDate != "" && this.filterDate.toDate != "") {
      this.prescriptionListToview = this.prescriptionListToview.filter(x => 
        new Date(this.transformDate(x.prescriptionDate)) >= new Date(this.transformDate(this.filterDate.fromDate)) && new Date(this.transformDate(x.prescriptionDate)) <= new Date(this.transformDate(this.filterDate.toDate)) );
    } else if (this.filterDate.fromDate != "") {
      this.prescriptionListToview = this.prescriptionListToview.filter(x => 
       new Date(this.transformDate(x.prescriptionDate)) >= new Date(this.transformDate(this.filterDate.fromDate)) );
    } else if (this.filterDate.toDate != "") {
      this.prescriptionListToview = this.prescriptionListToview.filter(x => 
        new Date(this.transformDate(x.prescriptionDate)) <=  new Date(this.transformDate(this.filterDate.toDate)) );
    }

    if (selectedPatient.length > 0) {
      this.filteredModeForPatient = true;
    } else {
      this.filteredModeForPatient = false;
    }

    if (selectedDoctor.length > 0) {
      this.filteredModeForDoctor = true;
    } else {
      this.filteredModeForDoctor = false;
    }
    (this.prescriptionListToview.length > 0) ? this.errorMsgShowFlag = false : this.errorMsgShowFlag = true;
    this.sortDataByDate();//https://gitlab.com/sbis-poc/app/issues/895
  }//end of method

  //method to transform Date
  transformDate(date): string{
    return this.datePipe.transform(new Date(date),SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER);
  }//end of method

  //method to return max from date
  returnMaxFromDate(): any{
    let maxDate: any = this.maxDate;
    if(this.filterDate.toDate != "")
      return new Date(this.filterDate.toDate);
    else
      return maxDate;
  }//end of method

  docFilterForPatient(selectedObj) {
    selectedObj["selected"] = !selectedObj["selected"];
    this.updatePrescroptionList();
  }

  docFilterForDoctor(selectedObj) {
    selectedObj["selected"] = !selectedObj["selected"];
    this.updatePrescroptionList();
  }

  resetAllFilterForPatient() {
    this.patientNames.forEach(item => {
      item["selected"] = false;
    });
    this.updatePrescroptionList();
  }

  applyDateFilter() {
    this.updatePrescroptionList();
  }
  changeDate(evt, dateType) {
    dateType == 'from' ? this.filterDate.fromDate = evt : this.filterDate.toDate = evt;
    if (evt == null) return;
    if (this.filterDate.fromDate != null && this.filterDate.fromDate.toString() == 'Invalid Date') {
      setTimeout(() => {
        this.filterDate.fromDate = "";
        this.applyDateFilter()
      })
    } else if (this.filterDate.toDate != null && this.filterDate.toDate.toString() == 'Invalid Date') {
      setTimeout(() => {
        this.filterDate.toDate = "";
        this.applyDateFilter()
      })
    } else {
      setTimeout(() => {
        this.applyDateFilter()
      })
    }
  }

  resetDateRange() {
    this.filterDate.fromDate = "";
    this.filterDate.toDate = "";
    this.applyDateFilter()
  }

  resetAllFilterForDoc() {
    this.doctorNames.forEach(item => {
      item["selected"] = false;
    });
    this.updatePrescroptionList();
  }

  resetAllFilter() {
    this.doctorNames.forEach(item => {
      item["selected"] = false;
    });
    this.patientNames.forEach(item => {
      item["selected"] = false;
    });
    this.resetDateRange();
    this.updatePrescroptionList();
  }

  downloadFile() {
    const link = document.createElement('a');
    link.href = this.download.downloadImageSrc;
    link.download = this.download.forUserName.replace(/\./g, '_') + "_" + this.download.doctorName.replace(/\./g, '_');
    link.click();
  }

  downloadPrescription(prescriptionRefNo) {
    let query = {
      'downloadFor': SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION,
      'documentRefNo': prescriptionRefNo
    }
    this.individualService.prescriptionDownload(query).subscribe((result) => {
      if (result.status != 2000) {
        this.toastService.showI18nToast("Right now unable to view this prescription", "info");
        return;
      }

      this.download.contentType = result.data.contentType;
      this.download.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-xl' });
    });
  }

  openPrescription(prescription: any) {
    this.download.downloadImageSrc = '';
    this.download.contentType = '';
    this.download.doctorName = prescription.doctorName;
    this.download.forUserName = prescription.forUserName;
    GetSet.setPrescriptionPreviewFromOrderMedicine(false);
    if (prescription.source == 'SBIS') {
      this.prescriptionSBIS = true;
      prescription.prescriptionFor = this.prescriptionFor;
      this.prescription = prescription;
      this.prescriptionRefNo = prescription.prescriptionRefNo;
      this.appRefNo = prescription.appointmentRefNo;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    } else {
      this.prescriptionSBIS = false;
      this.downloadPrescription(prescription.prescriptionRefNo);
    }
  }

  openEmailPopup(prescription) {
    this.emailSendFormGroup.controls["email"].setValue(this.user_email ? this.user_email : "");
    this.emailSendFormGroup.controls["prescriptionRefNo"].setValue(prescription.prescriptionRefNo);
    this.modalRef = this.bsModalService.show(this.docSendEmailModal, { class: 'modal-lg' });
  }
  sendDocViaEmail() {//method to send document via emial
    let emailJson: any = {
      "documentRefNo": this.emailSendFormGroup.get('prescriptionRefNo').value,
      "sendMailFor": SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION,
      "emailAddress": this.emailSendFormGroup.get('email').value
    }

    this.coreService.sendDocViaEmail(emailJson).subscribe(res => {
      if (res.status == 2000) {
        let toastMsg: string = "Prescription has been sent to your email id " + emailJson.emailAddress;
        this.toastService.showI18nToast(toastMsg, "success");
      } else {
        this.toastService.showI18nToast("Sorry some error occured.Please try again", "error");
      }
    })
    this.modalRef.hide();
  }//end of method

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

}//end of class
