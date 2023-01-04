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
import { CustomFormService } from '../../../modules/custom-form/custom-form.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  @ViewChild('showChart') showChart: TemplateRef<any>;
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  @ViewChild('noteModal') noteModal: TemplateRef<any>;
  @ViewChild('noteListModal') noteListModal: TemplateRef<any>;
  @ViewChild('discontinueMedicineModal') discontinueMedicineModal: TemplateRef<any>; //Working on app/issues/1970
  
  @Input() userRefNo: any = null;
  @Input() doctorRefNo: any = null;
  @Input() screenFlag: any;
  @Input() admissionRefNo: any = null; //Working on app/issues/1970
  @Output() getFormData = new EventEmitter<any>();

  loggedInUser: any;
  allergyList: any = [];
  procedureHistoryList: any = [];
  diseaseHistoryList: any = [];
  recentMedicationList: any =[];
  domSanitizer: any;
  patientProfileImageSrc = "";
  medicalDetailsList: any[] = [];//taking any arr to store medical details json response
  chartData: any = {};//to store graph value
  doctorNoteList: any;
  modalRef: BsModalRef;
  pastPrescriptionList: any = [];
  age: any;
  userProfileData: any;
  noOfNote: any;
  appRefNo: any;
  config = {
    // class: 'custom-modal-width modal-lg',
    // backdrop: true,
    // ignoreBackdropClick: true
    class: 'modal-lg',
  };

  prescriptionForm: FormGroup;
  doctorNoteForm: FormGroup;
  showMedicalTestReport: boolean = false;//working on issue number  #214, #210
  familyHistoryList: any = []; // Working on app/issues/1183
  displayAddEditPatientDetialsSidebar:boolean=false;
  patientDetailsList : any = []; //app#1183
  dateFormat: any; //Working on app/issues/1970
  showHistoryFlag: boolean=false;//Working on app/issues/1970

  displayOtherTreatmentHistoryOFPatientSidebar:boolean=false;
  constructor(private individualService: IndividualService, private broadcastService: BroadcastService, private _domSanitizer: DomSanitizer, private modalService: ModalService,
    private router: Router, private apiService: ApiService, private customFormService: CustomFormService,
    private _doctorService: DoctorService, private dateFormatPipe: DateFormatPipe, private bsModalService: BsModalService, private fb: FormBuilder, private route: ActivatedRoute,
    private _location: Location, private frb: FormBuilder,private http: HttpClient, private toastService: ToastService) {
    this.domSanitizer = _domSanitizer;
  }

  ngOnInit() {
    console.log("userRefNo :",this.userRefNo," "," doctorRefNo:",this.doctorRefNo, " "," doctorRefNo:",this.admissionRefNo);
    this.dateFormat = environment.DATE_FORMAT //Working on app/issues/1970
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    //Working on app/issues/1970
    const url = window.location.href.toString();
    if (url.indexOf('/prescription') > 0) {
      this.showHistoryFlag=true;
    }else{
      this.showHistoryFlag=false;
    }
    if(this.doctorRefNo!=null){
      this.getPastPrescriptionV2(this.userRefNo, this.doctorRefNo);
      this.openNoteList(this.userRefNo, this.doctorRefNo);
    }
    if(this.admissionRefNo!=null){
      //this.getCurrentMedicineList(this.admissionRefNo);
    }
    //End Working on app/issues/1970
    this.getAllergyList(this.userRefNo);
    this.getProcedureHistoryList(this.userRefNo);
    this.getDiseaseHistoryList(this.userRefNo);
    this.getRecentMedicationList(this.userRefNo);
    this.getPatientDetailsByRefNo(this.userRefNo);
    this.loadUserMedicalRecords(this.userRefNo);
    this.getUserFamilyHistoryList(this.userRefNo);// Working on app/issues/1183
    if(this.admissionRefNo==null)
      this.getSubmittedFormList(this.userRefNo); //Working on app/issues/1780
   // this.patientDetailsList;
    //console.log("patientDetailsList ::",this.patientDetailsList);
    
  }

  //Working on app/issues/1970
  currentMedicationList: any=[];
  getCurrentMedicineList(admissionRefNo){
    let payload = {
      "admissionRefNo":admissionRefNo
    }
    this.individualService.currentMedicineListIPD(payload).subscribe((currentMedicine) => {
			if(currentMedicine.status == 2000) {
        this.currentMedicationList=currentMedicine.data
			}
    });
  }
  //End Working on app/issues/1970

  getAllergyList(userRefNo){
    this.individualService.getAllergyHistory(userRefNo).subscribe((result) => {
			if (result.status === 2000) {
        // console.log("================Allergy History================");
        // console.log(result.data);
				this.allergyList = result.data;
			}
		});
  }
  getProcedureHistoryList(userRefNo){
    this.individualService.getProcedure(userRefNo).subscribe((result) => {
			if (result.status === 2000) {
        // console.log("================Procedure History================");
        // console.log(result.data);
				this.procedureHistoryList = result.data;
			}
		});
  }
  getDiseaseHistoryList(userRefNo){
    this.individualService.getDisease(userRefNo).subscribe((result) => {
			if (result.status === 2000) {
        // console.log("================Disease History================");
        // console.log(result.data);
        this.diseaseHistoryList = result.data;
			}
		});
  }
  getRecentMedicationList(userRefNo){
    // Working on app/issues/1183
    /*   let payload={
        "userRef": userRefNo
      }
      this._doctorService.getRecentMedicationByUserRefNo(payload).subscribe((result) => {
        if (result.status === 2000) {
          // console.log("================Recent Medication================");
          // console.log(result.data);
          this.recentMedicationList = result.data;
          
        }
      }); */
    this.individualService.currentMedicineRetrieve(this.userRefNo).subscribe((currentMedicine) => {
			if(currentMedicine.status == 2000) {
        this.recentMedicationList=currentMedicine.data
			}
    });
    
    // End Working on app/issues/1183
  }

  getPatientDetailsByRefNo(userRefNo) {
    let payload = {
      refNo: userRefNo
    }
    this._doctorService.getPatientDetailsByRefNo(payload).subscribe(data => {
      // console.log("================USER DETAILS================");
      // console.log(data['data']);

      this.userProfileData = data['data'];
      // if (data['data'].dateOfBirth != null) {
      //   const bdate = new Date(data['data'].dateOfBirth);
      //   const timeDiff = Math.abs(Date.now() - bdate.getTime());
      //   this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
      // }
      // Working on app/issues/897
      //let roleName = localStorage.getItem("roleName");
      let roleName = "INDIVIDUAL"; 
      //End Working on app/issues/897
      let path: string = null;
      if(data['data']===undefined){
        path =userRefNo + "/" + roleName;//neew add to download profile pic
      }
      else{
        path =data['data'].refNo + "/" + roleName;//neew add to download profile pic
      }
      
      this.apiService.DownloadProfilePic.getByPath(path).subscribe(result => {
        if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
          this.patientProfileImageSrc = "data:image/jpeg;base64," + result.data;
        }
      });

    });
  }

  getPastPrescriptionV2(userRefNo, doctorRefNo) {
    let payload = {
      doctorRefNo: doctorRefNo,
      userRefNo: userRefNo,
    }
    this._doctorService.getPastPrescriptionApiV2(payload)
      .subscribe(data => {
        this.pastPrescriptionList = data.data;
        for (let pp of this.pastPrescriptionList) {
          pp.prescriptionDateFormatted = this.dateFormatPipe.transform(pp.prescriptionDate);
        }
        //console.log("getPastPrescriptionApi", data.data);
      },
        (error) => {
          alert("Internal Server Problem");
          return;
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
        this.noOfNote = this.doctorNoteList.length;
        // console.log(this.doctorNoteList);

      }
    });
    // console.log(this.doctorNoteList);
    // this.modalRef = this.bsModalService.show(this.noteModal, this.config);
  }

  openNoteModal(){
    let payload = {
      doctorRefNo: this.doctorRefNo,
      userRefNo : this.userRefNo
    }
    this._doctorService.getAllPastNoteV2(payload).subscribe(data => {
      if(data['status']=='2000'){
        this.doctorNoteList = data['data'];
      }
    });
    console.log(this.doctorNoteList);
    //this.modalRef = this.bsModalService.show(this.noteListModal, this.config);
    this.displayNotesSidebar = true;
  }

  loadUserMedicalRecords(userRefNo) {
    this._doctorService.getUserVitalMedicalAttributes(userRefNo).subscribe((result) => {
      if (result.status == 2000) {
        //let medDetList = result.data;
        this.medicalDetailsList = result.data;
        // this.medicalDetailsList = medDetList;
        this.modifyMedicalDetailDisplayArrWithBP(result.data);
      }
    });
  }//end of method

  /**
 * modifyMedicalDetailDisplayArrWithBP ==> method to modify medical detail array
 */
  public modifyMedicalDetailDisplayArrWithBP(medDetList) {
    // console.log("medDetList", medDetList);
    //debugger;
    this.medicalDetailsList = medDetList.filter(clbckFn => clbckFn.parentName != SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME);
    let bpDiaObj: any = medDetList.find(findElOfDia => findElOfDia.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME);
    let bpSysObj: any = medDetList.find(findElOfSys => findElOfSys.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME);
    if (bpDiaObj || bpSysObj) {
      let bpObj: any = {
        attributeBPDiaId: bpDiaObj.attributeId,
        attributeBPSysId: bpSysObj.attributeId,
        createdDate: bpDiaObj.createdDate,
        endDate: bpDiaObj.endDate ? bpDiaObj.endDate : null,
        bpSysLongName: bpSysObj.longName,
        bpDiaLongName: bpDiaObj.longName,
        longName: bpDiaObj.parentName,
        parentName: bpDiaObj.parentName,
        valueOfDia: bpDiaObj.result,
        valueOfSys: bpSysObj.result,
        result: bpSysObj.result + "/" + bpDiaObj.result,
        shortNameForBPDia: bpDiaObj.shortName ? bpDiaObj.shortName : null,
        source: bpDiaObj.source,
        startDate: bpDiaObj.startDate ? bpDiaObj.startDate : null,
        triggerPk: bpDiaObj.triggerPk ? bpDiaObj.triggerPk : null,
        unitName: bpDiaObj.unitName,
        userPk: null,
        medicalFindingsPkForDia: bpDiaObj.medicalFindingsPkForDia,
        medicalFindingsPkForSys: bpDiaObj.medicalFindingsPkForSys
      }
        this.medicalDetailsList.push(bpObj);
    }//end of check if obj has values
  }//end of method

  
  onSelect(pp) {
    this.appRefNo = pp.appointmentRefNo
    //this.router.navigate(['/doctor/prescriptionpreview', pp.appointmentRefNo]);
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, this.config);
  }

  openPatientDetails(){
    this.getFormData.emit(true);
  }
  
  closeNewModal(id) {
    this.modalService.close(id);
  }//end of method

  //method to show medical attribute in graph -- added on 30/07/2019 because this was omited!
  showHealthAttributeProgress(medicalDetail, id) {
    this.chartData = {};
    // this.modalService.open(id);
    let queryForChart = {
      refNo: this.userRefNo,
      attributeId: medicalDetail.attributeId,
      startDate: medicalDetail.startDate,
      endDate: medicalDetail.endDate
    }
    let queryForChartBpDia = {};
    if (medicalDetail.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
      queryForChart.attributeId = medicalDetail.attributeBPSysId;
      queryForChartBpDia['refNo'] = this.userRefNo;//this.user_id;
      queryForChartBpDia['attributeId'] = medicalDetail.attributeBPDiaId;
      queryForChartBpDia['startDate'] = medicalDetail.startDate;
      queryForChartBpDia['endDate'] = medicalDetail.endDate;
    }
    //console.log(queryForChart);
    let labelsArray: string[] = [];
    let dataArray = [];//to store all result value for chart
    let referenceRangeToValArr = [];//to store all refRange to values
    let referenceRangeFromValArr = [];//to store all ref range from values
    this.individualService.loadMedicalAttributeDataForChart(queryForChart).subscribe((data) => {
      //console.log(data.data);
      if (data.status === 2000) {
        let resArrOfChartData = data.data;
        resArrOfChartData.reverse();
        resArrOfChartData.forEach(function (x) {
          let mydate = new Date(x['dateStr']);
          let year = mydate.getFullYear();
          let month = (1 + mydate.getMonth()).toString();
          month = month.length > 1 ? month : '0' + month;
          let day = mydate.getDate().toString();
          day = day.length > 1 ? day : '0' + day;
          // labelsArray.push(month + '/' + day + '/' + year);
          labelsArray.push(day + '-' + month + '-' + year);
          dataArray.push(x['result']);
          x['referenceRangeFrom'] ? referenceRangeFromValArr.push(x['referenceRangeFrom']) : null;
          x['referenceRangeTo'] ? referenceRangeToValArr.push(x['referenceRangeTo']) : null;

        });
        let label = medicalDetail.longName;
        if (medicalDetail.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
          this.individualService.loadMedicalAttributeDataForChart(queryForChartBpDia).subscribe((res) => {
            if (res.status == 2000) {
              let dataArrForDia: any[] = [];
              let refRangeFromValArrForBPDia: any[] = [];
              let refRangeToValArrForBPDia: any[] = [];
              res.data.reverse();
              res.data.forEach(function (x) {
                dataArrForDia.push(x['result']);
                x['referenceRangeFrom'] ? refRangeFromValArrForBPDia.push(x['referenceRangeFrom']) : null;
                x['referenceRangeTo'] ? refRangeToValArrForBPDia.push(x['referenceRangeTo']) : null;
              });
              this.chartData = {
                labels: labelsArray,
                datasets: [{
                  label: medicalDetail.bpSysLongName,//attributeBPSysId,
                  data: dataArray,
                  fill: false,
                  borderColor: '#4bc0c0'
                },
                {
                  label: medicalDetail.bpDiaLongName,//attributeBPDiaId,
                  data: dataArrForDia,
                  fill: false,
                  borderColor: '#565656'
                }]
              }//end of chartdata
              referenceRangeToValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME + ')', referenceRangeToValArr) : null;
              referenceRangeFromValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME + ')', referenceRangeFromValArr) : null;
              refRangeToValArrForBPDia.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME + ')', referenceRangeToValArr) : null;
              refRangeFromValArrForBPDia.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME + ')', referenceRangeFromValArr) : null;

            }//end of if status check            
          });
        } else {
          this.chartData = {
            labels: labelsArray,
            datasets: [{
              label: label,
              data: dataArray,
              fill: false,
              borderColor: '#4bc0c0'
            }]
          }//end of chartdata
          console.log("this.chartData::",this.chartData);
          referenceRangeToValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To', referenceRangeToValArr) : null;
          referenceRangeFromValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From', referenceRangeFromValArr) : null;
        }//end of else bp check
      }//end of res status match
    });//end of wscall

    this.chartData? this.modalService.open(id): this.toastService.showI18nToast("no data found","warning");
  }//end of method
  //to build chartData if ref range arr is available
  buildChartDataByRefRangeArr(refRangeChartLebelName, refRangeArr) {
    let refRangeJson: any = {};
    refRangeJson.label = refRangeChartLebelName;
    refRangeJson.data = refRangeArr;
    refRangeJson.fill = false;
    refRangeJson.borderColor = 'green';
    this.chartData.datasets.push(refRangeJson);
  }//end of build chart data

  ////working on issue number  #210  
  onMedicalTestReportAdd() {
    this.showMedicalTestReport = true;
  }//end of method

  medicalDetailsClose(){
    this.showMedicalTestReport = false;
    this.loadUserMedicalRecords(this.userRefNo);
  }//end of method

   /*Working on app/issues/1087 */
  addDiseaseHistory(){
    
  }
  /*End Working on app/issues/1087 */



  //Working on app/issues/1183
  getUserFamilyHistoryList(userRefNo){
    this.individualService.userFamilyHistoryRetrieve(this.userRefNo).subscribe((familyHistory) => {
			if(familyHistory.status == 2000) {
        this.familyHistoryList = familyHistory.data;
       
        
      }
		});

  }

  displayOtherTreatmentHistoryOFPatientAccordian: boolean = false;
  //new add to show other treatment history of a patient
  openOrCloseOtherTreatmentHistoryOfPatientSideBar(isOpenFlag: boolean){
    this.displayOtherTreatmentHistoryOFPatientSidebar = isOpenFlag? true: false;
  }//end of method

  openOrCloseOtherTreatmentHistoryOfPatientAccordian(){
    this.displayOtherTreatmentHistoryOFPatientAccordian = !this.displayOtherTreatmentHistoryOFPatientAccordian;
  }//end of method

  //end of new add to show other treatment history of a patient

  screenName: any;
  openAddEditPatientSideBar(screenName){
    this.displayAddEditPatientDetialsSidebar=true;
    this.screenName=screenName;
    this.showCurrentUpdationSection()
    // console.log(screenName,"  ",this.displayAddEditPatientDetialsSidebar," ",screenName,"    patientDetailsList:",this.patientDetailsList);

    
  }

  closePatientDetailsSidebar(){
    this.displayAddEditPatientDetialsSidebar = false;
    this.showCurrentUpdationSection()
  }

  showCurrentUpdationSection(){
    switch(this.screenName){
          case "DH":
                      if(this.displayAddEditPatientDetialsSidebar)
                        this.patientDetailsList=this.diseaseHistoryList //app#1183

                      else
                      this.getDiseaseHistoryList(this.userRefNo);
                       break;
          case "AG":
                      if(this.displayAddEditPatientDetialsSidebar)
                       this.patientDetailsList=this.allergyList  //app#1183
                     else
                      this.getAllergyList(this.userRefNo);
                      
                      break;
          case "FH":
                    if(this.displayAddEditPatientDetialsSidebar)
                       this.patientDetailsList=this.familyHistoryList //app#1183
                    else
                      this.getUserFamilyHistoryList(this.userRefNo);
                     
                      break;
          case "RM":
                      if(this.displayAddEditPatientDetialsSidebar)
                        this.patientDetailsList=this.recentMedicationList //app#1183
                      else
                      this.getRecentMedicationList(this.userRefNo);
                     
                      break;
          
          case "PH":
                      if(this.displayAddEditPatientDetialsSidebar)
                        this.patientDetailsList=this.procedureHistoryList //app#1183
                      else
                      this.getProcedureHistoryList(this.userRefNo);
                      break;
    }
  }
  // End Working on app/issues/1183

  // Working on app/issues/1780
  submittedFormList: any = [];
  getSubmittedFormList(userRefNo){
    let payload = {
      userRef : userRefNo
    }
    this.customFormService.getFormListByUserRefNo(payload).subscribe((res) => {
                       if(res.status == 2000) {
        this.submittedFormList = res.data;


      }
               });
  }

  questionResponse: any;
  displayResponseSidebar: boolean = false;
  displayNotesSidebar: boolean = false;
  formRefNo: any;
  form: any;
  answerSet: any = [];
  editMode: boolean = false;
  getQuestionResponse(form){
    this.form = form;
    let payload = {
      userRefNo : this.userRefNo,
      formRefNo: form.formRefNo,
      responseDate: form.responseDate
    }
    this.customFormService.getQuestionResponseByUserRefNo(payload).subscribe((res) => {
    console.log("getQuestionResponseByUserRefNo::",res);

                       if(res.status == 2000) {
        this.formRefNo = form.formRefNo;
        this.questionResponse = res.data;
        console.log(this.questionResponse);
        this.displayResponseSidebar = true;

      }
               });
  }

  closeResponseSidebar(){
    this.displayResponseSidebar = false;
  }

  closeNotesSidebar(){
    this.displayNotesSidebar = false;
  }

  setAnswerSet(answerSet){
    this.answerSet = answerSet;
  }

  saveResponse() {
    if(this.answerSet.length==0){
      this.toastService.showI18nToastFadeOut("You have not attempt any questions. Hence can not save..", "error");
      return;
    }
    let payload = {
      userRefNo: this.userRefNo,
      formRefNo: this.formRefNo,
      appointmentRefNo: null,
      admissionRefNo: null,
      responseDtoList: this.answerSet
    }
    this.customFormService.saveFilledUpForm(payload).subscribe((res) => {
        console.log(res.data);
        this.toastService.showI18nToastFadeOut("Form successfully submitted", "success");
        this.getSubmittedFormList(this.userRefNo);
        this.editMode = false;
    })
  }

  editResponse(){
    this.editMode = true;
  }

  // End Working on app/issues/1780

  // Working on app/issues/1970
  effictiveFrom:any=null;
  showDate: boolean=false;
  discontinueForm:FormGroup;
  errMsg:any="";
  medicine:any;
  discontinueMedicine(medicine){
    this.medicine=medicine;
    this.discontinueForm=this.fb.group({
      discontinueDate: [null]
    })
    this.effictiveFrom=null;
    this.modalRef = this.bsModalService.show(this.discontinueMedicineModal, {class: 'modal-sm',});
  }

  setEffectiveFrom(value){
    if(value=="I"){
      this.showDate = false;
      this.errMsg="";
      this.discontinueForm.reset();
    }
    else if(value=="T"){
      this.showDate = false;
      this.errMsg="";
      this.discontinueForm.reset();
    }
    else{
      this.showDate = true;
    }
    this.effictiveFrom = value
  }
  discontinue(){
    if(this.effictiveFrom=="O" && (this.discontinueForm.value.discontinueDate==null || this.discontinueForm.value.discontinueDate=="")){
      this.errMsg="Please enter date";
    }
    else{
      this.errMsg="";
    }
    let payload = {
      "medicineId": this.medicine.medicineId,
      "effictiveFrom": this.effictiveFrom,
      "effictiveFromDate": this.discontinueForm.value.discontinueDate
    }
    console.log(payload);
    this.individualService.discontinueCurrentMedicine(payload).subscribe((res)=>{
      if(res.status==2000){
        this.toastService.showI18nToastFadeOut(this.medicine.medicineName+" discontinued","success");
        this.modalRef.hide();
        this.getCurrentMedicineList(this.admissionRefNo);
      }
    })
    
  }
  // End Working on app/issues/1970

}//end of patient details
