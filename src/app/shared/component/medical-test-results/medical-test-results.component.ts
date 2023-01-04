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

import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroupDirective, FormBuilder, FormGroup, Validators, FormsModule, FormControl, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './../../../core/services/toast.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { IndividualService } from 'src/app/modules/individual/individual.service';
import { environment } from '../../../../environments/environment';
import { GetSet } from 'src/app/core/utils/getSet';

@Component({
  selector: 'app-medical-test-results',
  templateUrl: './medical-test-results.component.html',
  styleUrls: ['./medical-test-results.component.css']
})

export class MedicalTestResultComponent implements OnInit, OnDestroy {
  @Input('selectedPatientDetail') selectedPatientDetail: any;
  @Input('selectedDiagnosticsDetails') selectedDiagnosticsDetails: any;
  @Output('medicalDetailsClose') medicalDetailsClose = new EventEmitter<any>();
  @ViewChild('createViewMedicalRecordsModal') createViewMedicalRecordsModal: TemplateRef<any>;//new add for add medical reports --//working on issue number #210
  addMedicalAttributeForm: FormGroup;//new add for add medical reports
  modalRef: BsModalRef;//to open modal
  testReportsHeadingFlag: boolean = false;
  firstHeading: string = "Add Test Results";
  secondHeading: String = "REPORT UPLOAD";
  uploadForm: FormGroup;
  addMedicalReportModalConfig = {
    class: 'custom-modal-medical-details modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };

  sourceValues: any = [];
  currDate: any;
  attributeItems: FormArray;
  attributeArr: FormArray;
  medicalDetailsList: any[] = [];//taking any arr to store medical details json response
  loggedInuserDet: any = {};//to store logged in user details
  medicalFindingsDetails: any;
  maxDate: any;
  saveMedicalRecordResp: any;
  medicalTestAttributes: any;
  addMedicalReportResults: any[];
  isEdit: boolean = false;
  loading:boolean = false;

  constructor(private toastService: ToastService, private individualService: IndividualService, private bsModalService: BsModalService, private frb: FormBuilder, private datePipe: DatePipe, private broadcastService: BroadcastService, private http: HttpClient) {
    this.createMedicalDetailForm();//--new add for medical records
    this.getCurrentDate();//to get current date 
    this.getSourceValues();//to get source values

    this.uploadForm = frb.group({
      'file': [null, [Validators.required]],
      'documents': [null],
      'fileUploadFor': [SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS],
      'isSubmit': [false]
    });

  }//end of constructor

  ngOnInit() {
    this.loggedInuserDet = JSON.parse(localStorage.getItem("user"));//store logged  in user details
    this.maxDate = new Date();
    if (this.selectedPatientDetail && !this.selectedDiagnosticsDetails) {
      this.firstHeading = "Add Test Results";
    }

    if (this.selectedDiagnosticsDetails) {
      this.getEditedDiagnosticsDetails(); //to get diagnostics details on edited mode
      this.firstHeading = "INVESTIGATION REPORT ENTRY";
    }
    this.medicalTestReportModalOpen();//open medical test report modal
  }//end of oninit

  ngOnDestroy() {
    GetSet.setTriggerPkForLab(null);
    GetSet.setIsLabOrderSendReport(false);
  }

  //method to build form for add medical records --new add for medical records
  createMedicalDetailForm() {
    this.addMedicalAttributeForm = this.frb.group({
      attributeArr: this.frb.array([])
    });
  }//end of method

  createAttributeArrayForm() {
    return this.frb.group({
      parentName: new FormControl(null),
      testResultFileContent: new FormControl(null),
      testResultUploadedFileName: new FormControl(null),
      testresultupload: new FormControl(null),
      attributeItems: this.frb.array([])
    });
  }
  getCurrentDate() {
    let now = new Date();
    this.currDate = this.datePipe.transform(now, 'yyyy-MM-dd');//"dddd, mmmm dS, yyyy, h:MM:ss TT");
  }//end of method
  medicalTestReportModalOpen() {
    this.clearForm();
    this.addMedicalAttributeForm.reset();
    this.modalRef = this.bsModalService.show(this.createViewMedicalRecordsModal, this.addMedicalReportModalConfig);
  }//end of method

  clearForm() {
    this.addMedicalAttributeForm = this.frb.group({
      attributeArr: this.frb.array([])
    });
  }//end of method

  addItem(item, attributeArrLength, longName): void {
    this.attributeArr = this.addMedicalAttributeForm.controls['attributeArr'] as FormArray;
    this.attributeItems = this.attributeArr.controls[this.attributeArr.controls.length - 1]['controls']['attributeItems'] as FormArray;
    this.attributeItems.push(this.createItem(item));
    ((attributeArrLength == this.attributeItems.length) && (this.attributeItems.length > 1)) ?
      this.attributeArr.controls[this.attributeArr.controls.length - 1].patchValue({
        'parentName': longName
      }) : null;
  }//end of method

  createItem(item): FormGroup {
    let frbGrpBody: any = {};
    frbGrpBody = {
      attributeId: item.id,
      value: item.result,
      testresultupload: item.testresultupload ? item.testresultupload : null,
      testResultFileContent: item.testResultFileContent ? item.testResultFileContent : null,
      testResultUploadedFileName: item.testResultUploadedFileName ? item.testResultUploadedFileName : null,
      medicalFindingsPk: item.medicalFindingsPk,
    }
    frbGrpBody['attributeName'] = item.longName;
    frbGrpBody['source'] = item.source ? item.source : '';
    frbGrpBody['unit'] = item.unit;
    frbGrpBody['date'] = item.dateStr;//this.convertForDisplayDate(item.dateStr)//(item.dateStr)

    return this.frb.group(frbGrpBody);
  }//end of Create formGrp

  getSourceValues() {//method to get source values for source dropdown
    this.individualService.getMEdicalDetailsSourceValues({ q: SBISConstants.MASTER_DATA.MEDICAL_DATA_SRC_TYPE }).subscribe((res) => {
      if (res.status == 2000) {
        res.data.forEach(element => {
          if (element.displayValue == "Lab Report") {
            element.attributeValue = "Lab Report";
          }
          if (element.displayValue == "Self Measured") {
            element.attributeValue = "Self Measured";
          }
        });
        this.sourceValues = res.data;
        if (this.selectedDiagnosticsDetails && this.selectedDiagnosticsDetails) {
          let prcEntry = {
            attributeValue: "PRC",
            displayValue: "DOCTOR",
            id: null
          }
          this.sourceValues.push(prcEntry);
        }
      }
    });
  }//end of method

  convert(str) {//method to convert date field to proper 
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }//end of method

  //method to 
  onSelectMedicalAttributes(event, medAttr) {
    this.individualService.getMedicalAttributeListV3({ 'longName': event.longName }).subscribe((resp) => {
      if (resp.status == 2000) {
        this.medicalTestAttributes = resp.data;
        this.attributeArr = this.addMedicalAttributeForm.controls['attributeArr'] as FormArray;
        this.attributeArr.push(this.createAttributeArrayForm());
        resp.data.forEach((element, index) => {
          element.dateStr = element.dateStr ? element.dateStr : this.currDate;
          element.source = SBISConstants.MEDICAL_DETAILS_CONST.DEFAULT_SELECTED_SOURCE_FIELD;
          this.addItem(element, resp.data.length, event.longName);
          //  console.log("this.addMedicalAttributeForm.value",this.addMedicalAttributeForm.value);
        });
      }
    });
  }//end of method

  search(event) {
    if (event.query.length < 3) { //Working on app/issues/717
      this.addMedicalReportResults = [];
      return;
    }
    this.individualService.getMedicalAttributeList({ searchText: event.query }).subscribe((data) => {
      if (data.status == 2000) {
        this.addMedicalReportResults = data.data;
      }
    });
  }//end of search method


  upload(isRecordUpload: boolean, healthAttributeFile: any) {//,addMedicalAttributeFormValues: any
    this.uploadForm.patchValue({
      isSubmit: true
    });

    if (isRecordUpload) {
      if (this.uploadForm.invalid) {
        return;
      }
    }

    this.loading = true;
    document.body.classList.add('hide-bodyscroll');

    let valueData: any = {};
    (isRecordUpload) ? (valueData = this.uploadForm.value) : (valueData['file'] = healthAttributeFile.testResultFileContent);
    let formdata = new FormData();
    let medicalTestReportFileUpload;
    if (this.firstHeading == "REPORT UPLOAD") {
      medicalTestReportFileUpload = JSON.stringify({
        "forRefNo": this.selectedPatientDetail.refNo,
        "byRefNo": this.loggedInuserDet.refNo,
        "fileUploadFor": SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS,
      });
    } else {
      medicalTestReportFileUpload = JSON.stringify({
        "forRefNo": this.selectedPatientDetail.refNo,
        "byRefNo": this.loggedInuserDet.refNo,
        "fileUploadFor": SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS,
        "medicalFindingsPk": healthAttributeFile.medicalFindingsPk ? healthAttributeFile.medicalFindingsPk : null,
        "entityName": this.loggedInuserDet.entityName,
        "prescriptionRefNo": this.selectedPatientDetail.prescriptionRefNo
      });
    }

    formdata.append('file', valueData.file);
    formdata.append('document', medicalTestReportFileUpload);


    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status == 2000) {
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
          //this.toastService.showI18nToast('MY_PRESCRIPTION_TOAST.TEST_REPORT_UPLOADED', 'success');
          this.modalRef.hide();
          this.medicalDetailsClose.emit();
        } else {
          //this.toastService.showI18nToast(response.message, 'error');
        }
      }
    });
  }//end of method

  saveDocument(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
    //return this.apiService.UploadProfiePhoto.upload(formData);
  }


  fileChangeEvent(event, testresult: any, item: any) {
    let fileEvent = event.target.files[0];
    // fileEvent.type[constFilename.key] { //execute }
    if (SBISConstants.FILE_TYPE[fileEvent.type]) {
      //do something
      if (fileEvent.size > 2000000) {
        this.toastService.showI18nToast("File size will not more then 2mb", "warning");
        this.uploadForm.patchValue({
          'documents': null
        });
        item.patchValue({
          'testResultFileContent': null,
          'testResultUploadedFileName': null
        });
        return;
      }
      if (!testresult) {
        this.uploadForm.patchValue({
          file: event.target.files[0]
        });
      } else {
        item.patchValue({
          testResultFileContent: event.target.files[0],
          testResultUploadedFileName: fileEvent.name.toString()
        })
      }
    } else {
      this.toastService.showI18nToast("File type should be pdf or image", "warning");
      this.uploadForm.patchValue({
        'documents': null
      });
      item.patchValue({
        'testResultFileContent': null,
        'testResultUploadedFileName': null
      });
      return;
    }
  }//end of method

  //method to submit health records
  onSubmitHealthRecords(healthAttributeValue: any, id: any) {
    let uploadRecord: boolean = false;
    if (this.testReportsHeadingFlag) {
      uploadRecord = true;
      this.upload(uploadRecord, null);
      //call upload method to save document for test reports
    } else {
      uploadRecord = false;
      // calling a method to submit health records in db
      this.createNewHealthRecord(healthAttributeValue, uploadRecord);
    }//else of boolean check 
  }//end of method

  //method to create/update health attribute[submit health records in db]
  createNewHealthRecord(healthAttributeValue: any, uploadRecord: boolean) {
    healthAttributeValue.attributeArr.forEach((healthAttribute, indexForAttrArr) => {
      let healthRecords = healthAttribute.attributeItems;
      if (healthRecords.length == 0) {
        this.modalRef.hide();
        this.medicalDetailsClose.emit();
        return;
      }//end of if
      let validationFlag: Boolean = true;
      let index: number = 0;
      for (let element of healthRecords) {
        if ((element.value || (element.valueOfDia && element.valueOfSys)) && element.source && element.date) {// && this.attributeItems.controls[0].value.date
          validationFlag = ((index + 1) == healthRecords.length) ? false : true;
        } else {
          validationFlag = true;
          this.setToastMesseges(element);
          break;
        }
        index++;
      }//end of for
      if (!validationFlag) {
        let query = healthRecords.map(x => ({
          'result': x.value,
          'source': x.source,
          'refNo': this.selectedPatientDetail.refNo,
          'attributeId': x.attributeId,
          'dateStr': this.convert(x.date.toString())//x.date// this.datePipe.transform(x.date,this.dateFormat),//'yyyy-dd-MM')
        }));
        this.individualService.saveMedicalRecords(query).subscribe((data) => {
          if(data.status == 2000) {
            let i = 0;
            healthRecords.forEach(element => {
              let saveMedicalRecordData = [];
              saveMedicalRecordData = data.data.filter(x => x.attributeId == element.attributeId);
              healthRecords[i].medicalFindingsPk = saveMedicalRecordData[0].medicalFindingsPk;
              if (healthAttribute.testResultFileContent && healthAttribute.parentName) {//for upload parent level files
                healthRecords[i].testResultFileContent = healthAttribute.testResultFileContent;
                healthRecords[i].testResultUploadedFileName = healthAttribute.testResultUploadedFileName;
              }
              (healthRecords[i].testResultFileContent) ? this.upload(uploadRecord, healthRecords[i]) : null;
              i = i + 1;
            });
            this.attributeArr = this.addMedicalAttributeForm.controls['attributeArr'] as FormArray;
            if (this.attributeArr.length == (indexForAttrArr + 1)) {
              this.toastService.showI18nToast('Diagnostics test report updated successfully', 'success');
              while (this.attributeArr.length !== 0) {
                this.attributeArr.removeAt(0);
              }
              this.modalRef.hide();
              this.medicalDetailsClose.emit();
            }
          }
        });
      }
    });
  }//end of method

  setToastMesseges(element) {
    if (!(element.value || (element.valueOfDia && element.valueOfSys)) || !element.source) {
      let valueValidationMsg: string = (element.value || (element.valueOfDia && element.valueOfSys)) ? '' : 'value ';
      let sourceValidationMsg: string = element.source ? '' : (valueValidationMsg ? 'and source' : 'source');
      let validationMsg: string = 'Please add Health Attribute ' + valueValidationMsg + sourceValidationMsg;
      this.toastService.showI18nToast(validationMsg, 'warning');
    }
  }//end of method

  //validation msg for dia and sys 
  checkBPUpperLowerValues(dia, sys): boolean {
    let diaSysvalueCheckflag: boolean = false;
    if (+dia > +sys) {
      diaSysvalueCheckflag = true;
    } else {
      diaSysvalueCheckflag = false;
    }
    return diaSysvalueCheckflag;
  }//end of method

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

  onCloseModal() {
    this.clearForm();
    this.modalRef.hide();
    this.medicalDetailsClose.emit()
  }

  // Delete method for medical test report row delete
  deleteRecords(arrayIndex, attributeItemIndex) {
    this.attributeArr = this.addMedicalAttributeForm.controls['attributeArr'] as FormArray;
    this.attributeItems = this.attributeArr.controls[arrayIndex]['controls']['attributeItems'] as FormArray;
    this.attributeItems.removeAt(attributeItemIndex);
  }// End of method

  onclickHeading() {//on click second heading
    this.testReportsHeadingFlag = !this.testReportsHeadingFlag;
    if (this.testReportsHeadingFlag) {
      if (this.selectedDiagnosticsDetails && this.selectedDiagnosticsDetails) {
        this.secondHeading = "INVESTIGATION REPORT ENTRY";
        this.firstHeading = "REPORT UPLOAD";
      } else {
        this.secondHeading = "Add Test Results";
        this.firstHeading = "REPORT UPLOAD";
      }
    } else {
      if (this.selectedDiagnosticsDetails && this.selectedDiagnosticsDetails) {
        this.firstHeading = "INVESTIGATION REPORT ENTRY";
        this.secondHeading = "REPORT UPLOAD";
      } else {
        this.firstHeading = "Add Test Results";
        this.secondHeading = "REPORT UPLOAD";
      }
    }
  }

  //Edit/Update <>
  getEditedDiagnosticsDetails() {    
    this.isEdit = true;
    let query = {
      'longName': this.selectedDiagnosticsDetails.medicalAttributeName,
      'unit': this.selectedDiagnosticsDetails.unit ? this.selectedDiagnosticsDetails.unit : null
    }
    this.individualService.findOrSaveMedicalAttribute(query).subscribe((result) => {
      if (result.status == 2000) {
        this.medicalFindingsDetails = result.data;
        let query = {
          "prescriptionRefNo": this.selectedPatientDetail.prescriptionRefNo,
          "attributeId": result.data.id,
          "source": "PRC"
        }
        this.individualService.retrieveMedicalRecordsByTriggerAndAttributeId(query).subscribe((res) => {
          if (res.status == 2000) {
            res.data.forEach(element => {
              element.source = "PRC"
            });
            if(GetSet.getMedicalFindingsDetailsForLabAdmin() == true) {
              res.data[0].result = this.selectedDiagnosticsDetails.result;
              res.data[0].dateStr = this.selectedDiagnosticsDetails.dateStr;
            }
            this.buildMedicalHistoryObjForModal(res.data);
            this.attributeArr = this.addMedicalAttributeForm.controls['attributeArr'] as FormArray;
            this.attributeArr.push(this.createAttributeArrayForm());
            this.addItem(res.data[0], res.data.length, this.selectedDiagnosticsDetails.medicalAttributeName);
          }//end of status check 
        });
      }
    });
  }//end of method
  //method to display modal n build the object
  buildMedicalHistoryObjForModal(res) {
    res.sort((a, b) => {
      const d1 = new Date(a.dateStr);
      const d2 = new Date(b.dateStr);
      return (d1.getTime() - d2.getTime()) * -1;
    });
    let previousMEdDetailsArr: any = [];
    previousMEdDetailsArr = res;
    previousMEdDetailsArr.forEach(prervMedDetArrEl => {
      prervMedDetArrEl["id"] = prervMedDetArrEl.attributeId;
      prervMedDetArrEl["unit"] = prervMedDetArrEl.unitName;
      prervMedDetArrEl["medicalFindingsPk"] = prervMedDetArrEl.medicalFindingsPk;
    });
  }//end of method
  updateSingleMedicalData(formVal, index) {
    let uploadRecord: boolean = false;
    if (this.testReportsHeadingFlag) {
      uploadRecord = true;
      this.upload(uploadRecord, null);
      return;
    }
    formVal.attributeArr.forEach((healthAttribute, indexForAttrArr) => {
      let healthRecords = healthAttribute.attributeItems;
      let validationFlag: Boolean = true;
      let indexCount: number = 0;
      for (let element of healthRecords) {
        if (element.value && element.source && element.date) {
          validationFlag = ((indexCount + 1) == healthRecords.length) ? false : true;
        } else {
          validationFlag = true;
          this.setToastMesseges(element);
          break;
        }
        indexCount++;
      }//end of for
      if (!validationFlag) {
        let query = healthRecords.map(x => ({
          'medicalFindingsPk': x.medicalFindingsPk,
          'result': x.value ,
          'source': null,
          'dateStr': this.convert(x.date.toString()),//x.date// this.datePipe.transform(x.date,this.dateFormat),//'yyyy-dd-MM')
          'prescriptionRefNo': this.selectedPatientDetail.prescriptionRefNo,
          'refNo': this.selectedPatientDetail.refNo,
          'attributeId': x.attributeId
        }));
        if(GetSet.getTriggerPkForLab()) {
          query[0]['triggerPk'] = GetSet.getTriggerPkForLab();
          query[0].source = 'LAB_REPORT';
          if(this.selectedPatientDetail.prescriptionRefNo == 'null') {
            query[0].prescriptionRefNo = null;
          }
        }
        console.log(query);
        
        this.individualService.saveMedicalRecordsByPrescription(query).subscribe((res) => {
          if (res.status == 2000) {
            this.saveMedicalRecordResp = res.data;
            this.saveMedicalRecordResp = this.saveMedicalRecordResp.filter(x => x.attributeId == this.medicalFindingsDetails.id);
            //if(GetSet.getIsLabOrderSendReport() == true) {
              healthRecords[0].medicalFindingsPk = this.saveMedicalRecordResp[0].medicalFindingsPk;
            //}
            (healthRecords[0].testResultFileContent) ? this.upload(false, healthRecords[0]) : null;
          } else { //end of status 2000
            this.toastService.showI18nToast('Problem on saving data', 'error');
            return;
          }
        });
        if (this.attributeArr.length == (indexForAttrArr + 1)) {
          this.toastService.showI18nToast('Diagnostics test report updated successfully', 'success');
          while (this.attributeArr.length !== 0) {
            this.attributeArr.removeAt(0);
          }
          if(GetSet.getMedicalFindingsDetailsForLabAdmin() == true) {
            GetSet.setSaveDelivery(true);
          }
          this.modalRef.hide();
          this.medicalDetailsClose.emit();
        }
      }//end of validation check
    });
  }//end of method
}//end of class

