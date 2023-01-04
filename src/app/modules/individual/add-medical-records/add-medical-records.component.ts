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

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroupDirective, FormBuilder, FormGroup, Validators, FormsModule, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { HttpClient, HttpEvent,HttpHeaders, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './../../../core/services/toast.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IndividualService } from '../individual.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { DoctorService } from '../../doctor/doctor.service';
import { GetSet } from 'src/app/core/utils/getSet';
import { SBISConstants } from 'src/app/SBISConstants';
import { CoreService } from 'src/app/core/core.service';
@Component({
  selector: 'app-add-medical-records',
  templateUrl: './add-medical-records.component.html',
  styleUrls: ['./add-medical-records.component.css'],
  providers: [FormGroupDirective]
})
export class AddMedicalRecordsComponent implements OnInit {
  @ViewChild('testReportsUpload') testReportsUpload: TemplateRef<any>;//to upload doc by modal
  @ViewChild('testReportPreviewModal') testReportPreviewModal: TemplateRef<any>;//to show uploaded doc
  @ViewChild('docSendEmailModal') docSendEmailModal: TemplateRef<any>;//to send doc via email
  ocrFlag: boolean = false;//to show ocr details
  ocrResponse: any = {};//to store ocrResponse
  ocrForm: FormGroup;
  tests: FormArray;
  modalRef: BsModalRef;//for modal
  formData = new FormData();
  uploadForm: FormGroup;
  user_id: any;
  user_name: any;
  userRefNo: any
  testReportsData: any = [];
  myTestReports: any = [];
  minorTestReports: any = [];
  minorTestReportListToView: any = [];
  testReportsForMe: any = [];
  testReportsListToView: any = [];
  mygroupTestReports: any = [];
  patientNamelist: any[] = [];
  myTestReportFiltering: any = [];
  patientNames: any[] = [];
  doctorNames: any[] = [];
  filterDate = {
    fromDate: "",
    toDate: ""
  };
  testReportSBIS: any = false;
  download = {
    downloadImageSrc: "",
    contentType: "",
    doctorName: "",
    forUserName: ""
  }
  dateFormat = "";
  appRefNo: string = '';
  filteredModeForPatient: any = false;
  filteredModeForDoctor: any = false;
  fetchAllData: boolean = false;//to show n hide data
  errorMsgShowFlag: boolean = false;//to show error msg
  testReportsButton: boolean = false;//for group member/myself
  domSanitizer: any;//doc purpose
  maxDate: any;
  minorFlag: boolean = true;
  minorBtn: boolean = false;
  groupReportsButton: boolean = false;
  minorList: any = false;
  myGroupList: any = false;
  emailSendFormGroup: FormGroup;
  user_email: any;//to get user email
  refinePanelShowFlag: boolean = false;//to show n hide data
  isMyTestReport: boolean = true;
  loading: boolean = false;
  panelVisible = false;

  constructor(
    private frb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private _location: Location,
    private individualService: IndividualService,

    private bsModalService: BsModalService,
    private broadcastService: BroadcastService,
    private toastService: ToastService,
    private http: HttpClient,
    private _domSanitizer: DomSanitizer,
    private doctorService: DoctorService,
    private coreService: CoreService,
    private datePipe: DatePipe
  ) {
    this.domSanitizer = this._domSanitizer;//to load img
    this.uploadForm = frb.group({
      // 'doctorName': [null, [Validators.required]],
      'forUserPk': [null, [Validators.required]],
      // 'testName': [null, [Validators.required]],
      'file': [null, [Validators.required]],
      'documents': [null],
      // 'date': [new Date()],
      'fileUploadFor': [SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS],
      'isSubmit': [false]
    });
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    this.buildForm();
  }//end of constructor

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    document.body.classList.add('prescription-screen');
    this.dateFormat = environment.DATE_FORMAT;
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_name = user.userName;
    this.userRefNo = user.refNo;
    this.loadTestReportsData();
    // this.getMinorTestReports();
    this.maxDate = new Date();
    let minorCount = GetSet.getMinorCount();
    this.minorBtn = true;
    this.groupReportsButton = true;

    (minorCount > 0) ? this.minorFlag = true : this.minorFlag = false;
    this.getUserEmail();//to get user email
  }//end of method

  pagesArray: FormArray;
  tesstResultArray: FormArray;
  buildForm() {
    let formGroupJson: any = {
      "email": new FormControl(null, [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)]),
      "documentRefNo": new FormControl()
    };
    this.emailSendFormGroup = new FormGroup(formGroupJson);

    this.ocrForm = this.frb.group({
      doctorName: new FormControl(),
      patientName: new FormControl(),
      testDate: new FormControl(),
      tests: this.frb.array([this.createFormGroup()]),
    });
  }//end of method

  createFormGroup(): FormGroup {//to 
    return this.frb.group({
      unit: '',
      testName: '',
      result: ''
    });
  }//end of method

  getUserEmail() {//method to get user email
    this.individualService.getUserEmail(this.userRefNo).subscribe(res => {
      if (res.status == 2000) {
        this.user_email = res.data ? res.data : null;
      }
    });
  }//end of method

  //07-05-2019 implementation
  loadTestReportsData() {
    this.individualService.fetchMedicalTestReports(this.userRefNo).subscribe((response) => {
      if (response.status == 2000) {
        // console.log("response of fetchMedicalTestReports::", response);
        this.testReportsData = response.data.ownTestReports;
        this.myTestReports = response.data.ownTestReports;
        this.testReportsForMe = response.data.ownTestReports;
        this.mygroupTestReports = response.data.groupTestReports;
        this.testReportsListToView = this.myTestReports;
        this.myTestReportFiltering = this.testReportsListToView;
        this.bindPatientNameList();
        this.testReportFilter();
        this.refinePanelShow();
        (response.data.ownTestReports.length == 0) ? this.errorMsgShowFlag = true : this.errorMsgShowFlag = false;
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
        this.fetchAllData = true;
      }//end of status check
    }, err => {
      // console.log("err of get order med::", err);
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    });
  }//end of method

  refinePanelShow() {
    (this.testReportsListToView.length > 0) ? this.refinePanelShowFlag = true : this.refinePanelShowFlag = false;
    if (this.testReportsListToView.length > 0)
      this.sortTestReportListByDesendingOrder();
  }
  heading: string = "My Test Report";
  getMyTestReportList() {
    // this.minorFlag = false;
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.heading = "My Test Report";
    // this.broadcastService.setHeaderText('My Prescriptions');
    this.testReportsListToView = [];
    this.individualService.fetchMedicalTestReports(this.userRefNo).subscribe(resp => {
      if (resp.status == 2000) {
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
        this.testReportsListToView = resp.data.ownTestReports;
        (this.testReportsListToView.length > 0) ? this.errorMsgShowFlag = false : this.errorMsgShowFlag = true;
        this.testReportFilter();
        this.refinePanelShow();
      }
    }, err => {
      // console.log("err of get order med::", err);
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    });
    // this.testReportsListToView = this.testReportsForMe;
    this.myGroupList = false;
    this.minorList = false;
    this.bindPatientNameList();

    this.minorBtn = true;
    this.testReportsButton = false;
    this.groupReportsButton = true;
    this.refinePanelShow();
  }

  getMyGroupTestReportList() {
    // this.minorFlag = false;
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.minorBtn = true;
    this.testReportsButton = true;
    this.groupReportsButton = false;
    this.heading = "Group Member Test Report";
    this.testReportsListToView = [];
    this.individualService.fetchMedicalTestReports(this.userRefNo).subscribe(resp => {
      if (resp.status == 2000) {
        this.testReportsListToView = resp.data.groupTestReports;
        (this.testReportsListToView.length > 0) ? this.errorMsgShowFlag = false : this.errorMsgShowFlag = true;
        this.testReportFilter();
        this.refinePanelShow();
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      }
    }, err => {
      // console.log("err of get order med::", err);
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    });
    // this.testReportsListToView = this.mygroupTestReports;
    this.minorList = false;
    this.myGroupList = true;
    this.bindPatientNameList();

    this.refinePanelShow();
  }

  testReportFilter() {
    this.patientNames = [];
    this.doctorNames = [];
    this.myTestReportFiltering = this.testReportsListToView;
    for (let testReport of this.testReportsListToView) {
      if (this.doctorNames.filter(x => x.doctorName == testReport.doctorName).length == 0) {
        this.doctorNames.push({ doctorName: testReport.doctorName, selected: false });
      }
      if (this.patientNames.filter(x => x.forUserName == testReport.forUserName).length == 0) {
        this.patientNames.push({ forUserName: testReport.forUserName, selected: false });
      }
    }
    this.updatePrescroptionList();
  }//end of method

  applyDateFilter() {
    this.updatePrescroptionList();
  }
  changeDate(evt, dateType) {
    dateType == 'from' ? this.filterDate.fromDate = evt : this.filterDate.toDate = evt;
    if (evt == null) return;

    //console.log(evt)
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
  }//end of method

  docFilterForPatient(selectedObj) {
    selectedObj["selected"] = !selectedObj["selected"];
    this.updatePrescroptionList();
  }//end of method

  docFilterForDoctor(selectedObj) {
    selectedObj["selected"] = !selectedObj["selected"];
    this.updatePrescroptionList();
  }//end of method

  resetAllFilterForPatient() {
    this.patientNames.forEach(item => {
      item["selected"] = false;
    });
    this.updatePrescroptionList();
  }//end of method

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

  updatePrescroptionList() {
    let selectedPatient = this.patientNames.filter(x => x.selected);
    let selectedDoctor = this.doctorNames.filter(x => x.selected);
    this.myTestReportFiltering.forEach(function (item, index) {
      item["index"] = index;
    });
    this.testReportsListToView = [];
    if (selectedPatient.length > 0 && selectedDoctor.length > 0) {
      selectedPatient.forEach(itemX => {
        selectedDoctor.forEach(itemY => {
          let filterList = this.myTestReportFiltering.filter(x => x['forUserName'] == itemX['forUserName'] && x['doctorName'] == itemY['doctorName']);
          if (filterList.length > 0) {
            this.bindFilterList(filterList);
          }
        });
      });
    } else if (selectedPatient.length > 0) {
      let arLength = selectedPatient.length;
      for (let i = 0; i < arLength; i++) {
        let pationtObj = selectedPatient[i];

        let filterList = this.myTestReportFiltering.filter(x => (typeof pationtObj['forUserName'] != "undefined" && pationtObj['forUserName'] == x['forUserName']));
        if (filterList.length > 0) {
          this.bindFilterList(filterList);
        }
      }
    } else if (selectedDoctor.length > 0) {
      let arLength = selectedDoctor.length;
      for (let i = 0; i < arLength; i++) {
        let doctorObj = selectedDoctor[i];

        let filterList = this.myTestReportFiltering.filter(x => (typeof doctorObj['doctorName'] != "undefined" && doctorObj['doctorName'] == x['doctorName']));
        if (filterList.length > 0) {
          this.bindFilterList(filterList);
        }
      }
    } else {
      this.testReportsListToView = this.myTestReportFiltering;
    }

    if (this.filterDate.fromDate != "" && this.filterDate.toDate != "") {
      this.testReportsListToView = this.testReportsListToView.filter(x =>
        new Date(this.transformDate(x.prescriptionDate)) >= new Date(this.transformDate(this.filterDate.fromDate)) && new Date(this.transformDate(x.prescriptionDate)) <= new Date(this.transformDate(this.filterDate.toDate)));
    } else if (this.filterDate.fromDate != "") {
      this.testReportsListToView = this.testReportsListToView.filter(x =>
        new Date(this.transformDate(x.prescriptionDate)) >= new Date(this.transformDate(this.filterDate.fromDate)));
    } else if (this.filterDate.toDate != "") {
      this.testReportsListToView = this.testReportsListToView.filter(x =>
        new Date(this.transformDate(x.prescriptionDate)) <= new Date(this.transformDate(this.filterDate.toDate)));
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

    (this.testReportsListToView.length > 0) ? this.errorMsgShowFlag = false : this.errorMsgShowFlag = true;
  }//end of method

  //method to transform Date
  transformDate(date): string {
    return this.datePipe.transform(new Date(date), SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER);
  }//end of method

  //method to return max from date
  returnMaxFromDate(): any {
    let maxDate: any = this.maxDate;
    if (this.filterDate.toDate != "")
      return new Date(this.filterDate.toDate);
    else
      return maxDate;
  }//end of method

  bindFilterList(filterList) {
    filterList.forEach(item => {
      if (this.testReportsListToView.filter(y => y['index'] == item['index']).length == 0) {
        this.testReportsListToView.push(item)
      }
    });
  }//end of method

  bindPatientNameList() {
    this.patientNamelist = [];
    if (this.minorList) {
      this.isMyTestReport = false;
      this.individualService.listViewOfMinor(this.userRefNo).subscribe((respForMinor) => {
        for (let minorMember of respForMinor.data) {
          if (minorMember.minor.userRefNo != this.userRefNo) {
            if (this.patientNamelist.length == 0) {
              this.patientNamelist.push({ forUserName: minorMember.minor.name, userRefNo: minorMember.minor.userRefNo, selected: false });
            } else {
              if (this.patientNamelist.find(x => x.userRefNo === minorMember.minor.userRefNo)) {
                //do nothing
              } else {
                this.patientNamelist.push({ forUserName: minorMember.minor.name, userRefNo: minorMember.minor.userRefNo, selected: false });
              }
            }
          }
        }
      });
    } else if (this.myGroupList) {
      this.isMyTestReport = false;
      this.individualService.getGroupMember(this.userRefNo + '?permission=ALL').subscribe((result) => {
        for (let groupMember of result.data) {
          if (groupMember.userRefNo != this.userRefNo) {
            if (this.patientNamelist.length == 0) {
              this.patientNamelist.push({ forUserName: groupMember.name, userRefNo: groupMember.userRefNo, selected: false });
            } else {
              if (this.patientNamelist.find(x => x.userRefNo === groupMember.userRefNo)) {
                //do nothing
              } else {
                this.patientNamelist.push({ forUserName: groupMember.name, userRefNo: groupMember.userRefNo, selected: false });
              }
            }

          }
        }
      });
    } else {
      //do nothing
      let user = JSON.parse(localStorage.getItem('user'));
      // let query = {
      //   forUserName: user.userName,
      //   userRefNo: user.refNo,
      //   selected: false
      // }
      // this.patientNamelist.push(query);
      this.uploadForm.patchValue({
        'forUserPk': user.refNo
      });
      this.isMyTestReport = true;
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'wmv' || ext.toLowerCase() == 'mp4') {
        return true;
    }
    else {
        return false;
    }
  }





  onUploadModal() {
    this.uploadForm.patchValue({
      'documents': null
    });
    this.uploadForm.reset();
    if (this.isMyTestReport) {
      this.uploadForm.patchValue({
        'forUserPk': this.userRefNo
      });
    }
    // this.uploadForm.controls.date.setValue(new Date());
    this.uploadForm.controls.fileUploadFor.setValue(SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS);
    this.modalRef = this.bsModalService.show(this.testReportsUpload, { class: 'modal-lg' });
  }//end of method

  onSubmit() {
    this.uploadForm.patchValue({
      isSubmit: true
    });

    if (this.isMyTestReport == false) {
      if (this.uploadForm.invalid) {
        return;
      }
    }
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');



    //console.log(this.fNames);

    let valueData = this.uploadForm.value;



    let formdata = new FormData();




    let prescriptionFileUpload = new Blob([JSON.stringify({
      "forRefNo": valueData.forUserPk,
      "byRefNo": this.userRefNo,
      // "doctorName": valueData.doctorName,
      // "testName": valueData.testName.longName,
      "fileUploadFor": valueData.fileUploadFor,
      // "date": valueData.date
    })], {
      type: "application/json"
    });

    formdata.append('file', valueData.file);
    formdata.append('document', prescriptionFileUpload);



    if(this.uploadForm.status == "INVALID"){
      return;
    }

    this.saveDocument(formdata).subscribe(event => {
    
      if (event.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        document.getElementById('fileNames').innerHTML = "Uploading...";
        console.log(percentDone);
      }else if (event instanceof HttpResponse) {
        document.getElementById('fileNames').classList.add('progress-complete');
        document.getElementById('fileNames').innerHTML = "Upload Complete";
        let response = JSON.parse(event.body);
        if (response.status == 2000) {
          // this.loadTestReportsData();
          this.modalRef.hide();
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
          this.toastService.showI18nToast('MY_PRESCRIPTION_TOAST.TEST_REPORT_UPLOADED', 'success');
          if (this.minorList == true) {
            this.individualService.getMinorTestReports(this.userRefNo).subscribe((forMinor) => {
              this.testReportsListToView = forMinor.data.minorTestReports;
              this.refinePanelShow();//called to show refine panel according to response data
            });
          } else if (this.myGroupList == true) {
            this.individualService.fetchMedicalTestReports(this.userRefNo).subscribe((forGroup) => {
              this.testReportsListToView = forGroup.data.groupTestReports;
              this.refinePanelShow();//called to show refine panel according to response data
            });
          } else {
            this.individualService.fetchMedicalTestReports(this.userRefNo).subscribe((forMe) => {
              this.testReportsListToView = forMe.data.ownTestReports;
              this.refinePanelShow();//called to show refine panel according to response data
            });
          }
          this.fetchAllData = true;

        } else {
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
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
    let documentDtoList = new Blob([JSON.stringify({
      "forUserPk": valueData.forUserPk,
      "byUserPk": valueData.byUserPk,
      "doctorName": valueData.doctorName,
      "testName": valueData.testName.longName,
      "fileUploadFor": valueData.fileUploadFor,
    })], {
      type: "application/json"
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
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
    //return this.apiService.UploadProfiePhoto.upload(formData);
  }  

  openPrescription(testReport: any) {
    this.ocrFlag = false;
    this.download.downloadImageSrc = '';
    this.download.contentType = '';
    this.download.doctorName = testReport.doctorName;
    this.download.forUserName = testReport.forUserName;

    if (testReport.source == 'SBIS') {
      this.testReportSBIS = true;
      this.appRefNo = testReport.appointmentRefNo
      this.modalRef = this.bsModalService.show(this.testReportPreviewModal, { class: 'modal-lg' });
    } else {
      this.testReportSBIS = false;
      this.individualService.fetchOCRResponseByDocumentRefNo(testReport.documentRefNo).subscribe(response => {
        if (response.status == 2000) {
          this.ocrResponse = response.data;
          if (this.ocrResponse.pages && (this.ocrResponse.pages.length > 0)){
            this.setFormData(this.ocrResponse,testReport);
            this.ocrFlag = true;
          }
          this.downloadTestReport(testReport.documentRefNo);
        }
      }); 
    }
  }//end of method

  downloadFile() {
    const link = document.createElement('a');
    link.href = this.download.downloadImageSrc;
    link.download = this.download.forUserName.replace(/\./g, '_') + "_" + this.download.doctorName.replace(/\./g, '_');
    link.click();
  }

  downloadTestReport(documentRefNo) {
    let query = {
      'downloadFor': SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS,
      'documentRefNo': documentRefNo
    }
    this.individualService.prescriptionDownload(query).subscribe((result) => {
      if (result.status != 2000) {
        this.toastService.showI18nToast('MEDICAL_REPORTS.TEST_REPORT_DOWNLOAD_INFO_MSG', "info");
        return;
      }

      this.download.contentType = result.data.contentType;
      this.download.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
      this.modalRef = this.bsModalService.show(this.testReportPreviewModal, { class: 'modal-lg' })
    });
  }//end of method  

  //method to search autocomplete dropdown in test reports
  results: any = [];
  search(event) {
    // console.log("event.query::", event.query);
    if (event.query.length < 4) {
      this.results = [];
      return;
    }
    this.doctorService.getLabTestList(event.query).subscribe((data) => {
      this.results = data.data;
    });
  }//end of method

  //end of 07-05-19 implementation

  //method to sort data by decending order
  sortTestReportListByDesendingOrder() {
    //https://gitlab.com/sbis-poc/app/issues/1220
    this.testReportsListToView.length > 0 ? this.testReportsListToView.sort((a, b) => {
      const d1 = new Date(a.prescriptionDate);
      const d2 = new Date(b.prescriptionDate);
      return (d1.getTime() - d2.getTime()) * -1;
    }) : null;
    //https://gitlab.com/sbis-poc/app/issues/1220
  }



  // backClicked() {
  //   this._location.back();
  // }
  profileSubmit(searchValue) {
    console.log(searchValue);
    // submit the value get the data show on dashbpard
  }

  //new add for minor
  minorClick() {
    this.minorFlag = true;
    this.heading = "minor Test Report";
    this.testReportsListToView = [];
    this.individualService.getMinorTestReports(this.userRefNo).subscribe(resp => {
      if (resp.status == 2000) {
        this.testReportsListToView = resp.data.minorTestReports;
        (this.testReportsListToView.length > 0) ? this.errorMsgShowFlag = false : this.errorMsgShowFlag = true;
        this.testReportFilter();
        this.refinePanelShow();
      }
    });
    // this.testReportsListToView = this.minorTestReportListToView;
    this.myGroupList = false;
    this.minorList = true;
    this.bindPatientNameList();
    this.testReportFilter();
    this.minorBtn = false;
    this.testReportsButton = true;
    this.groupReportsButton = true;
  }//end of method

  openEmailPopup(selectedTestReport) {
    this.emailSendFormGroup.controls["email"].setValue(this.user_email ? this.user_email : "");
    this.emailSendFormGroup.controls["documentRefNo"].setValue(selectedTestReport.documentRefNo);
    this.modalRef = this.bsModalService.show(this.docSendEmailModal, { class: 'modal-lg' });
  }

  sendDocViaEmail() {//method to send document via emial
    let emailJson: any = {
      "documentRefNo": this.emailSendFormGroup.get('documentRefNo').value,
      "sendMailFor": SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS,
      "emailAddress": this.emailSendFormGroup.get('email').value
    }

    this.coreService.sendDocViaEmail(emailJson).subscribe(res => {
      if (res.status == 2000) {
        let toastMsg: string = "Document has been sent to your email id " + emailJson.emailAddress;
        this.toastService.showI18nToast(toastMsg, "success");
      } else {
        this.toastService.showI18nToast('COMMON.COMMON_SERVER_ERROR_MSG', "error");
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

  setFormData(res,testReport:any) {
    let tests = this.ocrForm.get('tests') as FormArray;
    if (res.pages.length > 0) {
      this.ocrForm.controls["doctorName"].setValue(res.pages[0].doctor);
      this.ocrForm.controls["patientName"].setValue((res.pages[0].patient)? (res.pages[0].patient): testReport.forUserName);
      this.ocrForm.controls["testDate"].setValue(res.pages[0].testDate);
      tests.removeAt(0);
      res.pages.forEach((pages, index) => {
        pages.tests.forEach((test, tIndex) => {
          tests.push(this.addPreviousTests(test));
        });
      });
      // console.log("ocrForm::", this.ocrForm);
    }
  }//end of method
  addPreviousTests(element): FormGroup {//to 
    return this.frb.group({
      unit: element.unit ? element.unit : '',
      testName: element.testName ? element.testName : '',
      result: element.result ? element.result : ''
    });
  }//end of method

  saveOCR() {
    let ocrObj: any = {};
    ocrObj.documentRefNo = this.ocrResponse.documentRefNo;
    ocrObj.status = this.ocrResponse.status;
    ocrObj.numPages = this.ocrResponse.numPages;
    let pages: any[] = [];
    let pagesObj: any =
    {
      "patient": this.ocrForm.controls['patientName'].value,
      "status": this.ocrResponse.pages[0].status,
      "pageNo": this.ocrResponse.pages[0].pageNo,
      "doctor": this.ocrForm.controls['patientName'].value,
      "testDate": this.ocrForm.controls['testDate'].value
    };
    let tests = this.ocrForm.get('tests') as FormArray;
    let testList: any[] = [];
    if (tests.length > 0) {
      tests.controls.forEach(test => {
        testList.push({
          testName: ((test['controls']['testName'].value) ? test['controls']['testName'].value : null),
          result: ((test['controls']['result'].value) ? (test['controls']['result'].value) : null),
          unit: ((test['controls']['unit'].value) ? (test['controls']['unit'].value) : null),
        });
      });
      pagesObj['tests'] = testList;
      pages.push(pagesObj);
      ocrObj['pages']= pages;
      this.individualService.updateOCRResponseByUSer(ocrObj).subscribe(res=>{
        if(res.status == 2000){
          this.modalRef.hide();
          this.toastService.showI18nToast('MEDICAL_REPORTS.OCR_UPDATE_SUCCESS_MSG', "success");
        }
        else
          this.toastService.showI18nToast('COMMON.COMMON_SERVER_ERROR_MSG', "error");
      });
    }
  }
}
