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

import { Component, OnInit, ViewChild, ViewChildren, TemplateRef, Input, ElementRef, Renderer2, Directive } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DoctorService } from 'src/app/modules/doctor/doctor.service';
import { IndividualService } from './../../individual/individual.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from '../../../core/services/toast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { auditTime } from 'rxjs/operators';
import { Location } from '@angular/common';
import { SBISConstants } from './../../../SBISConstants';
import { ModalService } from './../../../shared/directive/modal/modal.service'
import { timer } from 'rxjs';

// const autoTimer: any = {
//   TIMER: 5000
// }
import { DateFormatPipe } from 'src/app/shared/pipes/date-format/date-format.pipe';
import { ApiService } from '../../../core/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CoreService } from 'src/app/core/core.service';
import { GlobalvideoService } from '../../../core/services/globalvideo.service';


@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css'],
  providers: [DateFormatPipe]
})
export class PrescriptionComponent implements OnInit {
  @ViewChild('showChart') showChart: TemplateRef<any>;
  prescriptionForm: FormGroup;

  prescriptionNarrationForm: any;
  prescriptionVitalForm: any;
  prescriptionObservationForm: any;
  prescriptionTestForm: any;
  prescriptionDiagnosisForm: any;
  prescriptionMedicationForm: any;
  prescriptionAdviceForm: any;
  prescriptionNoteForm: FormGroup;
  prescriptionReferralForm: any;
  prescriptionVaccinationForm: any; // Working on app/issues/937

  previewPrescriptionData: any;
  previewScreen: boolean = false;
  doctorPk: any;
  doctorRefNo: any
  appointmentPk: any;
  userPk: any;
  userRefNo: any;
  visitPk: any;
  individualUserData: any;
  age: any = "Not Specified";
  printOrViewFlag: boolean = false;
  dtFormat = "";
  minDate = new Date();
  doctorDtl: any = {
    'name': null,
    'regNo': null
  };
  prescriptionDate = new Date();
  doctorDetails: any;
  doctorQualifications: any = [];
  doctorSpecializations: any = [];
  fileName = "Prescription";
  reportType = "PRES";
  pk: any;
  prescriptionRefNo: any;
  pastPrescription: any = [];
  doctorChamberDetails: any;
  panelVisible = false;

  isVitalShow = false;

  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  @ViewChild('noteListModal') noteListModal: TemplateRef<any>;

  modalRef: BsModalRef;
  public show_area: boolean = false;
  public show_diagarea: boolean = false;
  public show_test: boolean = false;
  public show_medic: boolean = true;
  public show_advice: boolean = false;
  public show_date: boolean = false;
  public show_note: boolean = false;
  public show_referral: boolean = false;
  public show_vaccination: boolean = false; // Working on app/issues/937
  show_canvas_paint: boolean = false;//new add for canvas-painting
  previousDrewImage: any = {};
  prescriptionId: "";
  appointmentRefNo: any;
  narrationForm: any = [];
  observationForm: any = [];
  diagnosisForm: any = [];
  adviceForm: any = [];
  labTestForm: any = [];
  medicationForm: any = [];
  vitalForm: any = [];
  noteForm: any;
  referralForm: any;
  vaccinationForm: any = []; // Working on app/issues/937
  doctorNameList: any = [];// Working on app/issues/937
  referralNameList: any = [];// Working on app/issues/937

  autoTimer: any;
  stopTimer: boolean = false;
  showAutosaveMsg: boolean = false;
  autosaveFlag: any;
  config = {
    // class: 'custom-modal-width modal-lg',
    // backdrop: true,
    // ignoreBackdropClick: true
    class: 'modal-lg',
  };
  autoTimerSubscription: any;
  isModifiedPrescription: boolean = false;
  patientProfileImageSrc: any = null;
  domSanitizer: any;

  medicalDetailsList: any[] = [];//taking any arr to store medical details json response
  chartData: any = {};//to store graph value

  noteList: any;
  doctorNoteList: any;
  noOfNote: any;
  refferedName: any = null;
  loggedInUser: any;
  printSectionId = "print-section";
  //Working on app/issues/731
  screenFlag: any = "prescription";
  preprinted: string;
  //Working on app/issues/731
  vaccineList: any = []; // Working on app/issues/937
  online: any = "N";
  spFlag: boolean = false;

  //Modification for IPD prescription
  admissionRefNo: any;

  constructor(private fb: FormBuilder,
    private _doctorService: DoctorService,
    private individualService: IndividualService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private broadcastService: BroadcastService,
    private _toastService: ToastService,
    private bsModalService: BsModalService,
    private modalService: ModalService,
    private dateFormatPipe: DateFormatPipe,
    private apiService: ApiService,
    private _location: Location,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private globalvideoservice: GlobalvideoService,
    private _domSanitizer: DomSanitizer) {
    this.domSanitizer = _domSanitizer;
  }


  ngOnInit() {
    this.broadcastService.setHeaderText('Prescription');
    let user = JSON.parse(localStorage.getItem('user'));
    this.doctorRefNo = user.refNo;
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    //console.log(this.loggedInUser.refNo);
    this.dtFormat = environment.DATE_FORMAT;
    //this.doctorPk = this.route.snapshot.paramMap.get("doctorPk");
    //this.appointmentPk = this.route.snapshot.paramMap.get("appointmentPk");
    //this.userPk = this.route.snapshot.paramMap.get("userPk");
    // /sbis-poc/app/issues/1074
    this.userRefNo = localStorage.getItem('userRefNo'); //this.route.snapshot.paramMap.get("userRefNo");
    //this.visitPk = this.route.snapshot.paramMap.get("visitPk");
    // /sbis-poc/app/issues/1074
    this.appointmentRefNo = localStorage.getItem('appointmentRefNo'); // this.route.snapshot.paramMap.get("appointmentRefNo");
    console.log(this.appointmentRefNo);
    let onl = localStorage.getItem('online');
    if(onl=="Y"){
      this.online = true;
    }
    else{
      this.online = false;
    }

    console.log(onl);
    console.log(this.online);
    this.globalvideoservice.setValue(this.online);

    /*this.globalvideoservice.getValue().subscribe((value) => {
      this.online = value;
    });*/

    //Modification for IPD prescription
    this.admissionRefNo = localStorage.getItem('admissionRefNo');
    if(this.admissionRefNo==null){
      this.screenFlag="prescription";
    }
    else{
      this.screenFlag="ipd";
      //this.getPrespriptionByAdmissionRefNo();
    }
    

    this.autoTimer = environment.AUTO_SAVE_PRESCRIPTION_TIME;
    this.autosaveFlag = environment.AUTO_SAVE_PRESCRIPTION_FLAG;

    this.prescriptionObservationForm = [];
    this.prescriptionTestForm = [];
    this.prescriptionDiagnosisForm = [];
    this.prescriptionMedicationForm = [];
    this.prescriptionAdviceForm = [];
    this.prescriptionVitalForm = [];
    this.prescriptionVaccinationForm = []; // Working on app/issues/937
    this.prescriptionNarrationForm = [];



    this.prescriptionForm = this.fb.group({
      //prescriptionPk: [],
      prescriptionDate: [],
      //visitPk: [this.visitPk],
      nextCheckUpDate: [],
      medicalFindingsList: [],
      observationList: [],
      doctorRecommendedTestList: [],
      patientProblemNarration: [],
      diagnosisList: [],
      medicationDTOList: [],
      adviceList: [],
      status: ["NRM"],
      // userPk: [this.userPk],
      // doctorPk: [this.doctorPk],
      // appointmentPk: [this.appointmentPk],
      userRefNo: [this.userRefNo],
      doctorRefNo: [this.doctorRefNo],
      appointmentRefNo: [this.appointmentRefNo],
      isDraft: ["Y"],
      // createdDate: [],
      // createdBy: [],
      // modifiedDate: [],
      // modifiedBy: [],
      observationFormDirty: false,
      medicationFormDirty: false,
      adviceFormDirty: false,
      diagnosisFormDirty: false,
      testFormDirty: false,
      vitalFormDirty: false,
      prescriptionFormDirty: false,
      noteFormDirty: false,
      referralFormDirty: false,
      reportReviewDate: [],
      doctorNote: [],
      doctorReferral: [],
      prescriptionRefNo: [],
      vaccinationFormDirty: false, // Working on app/issues/937
      vaccinationList: [], // Working on app/issues/937
      referredBy: [null], // Working on app/issues/937
      symptomFormDirty: false,
      symptomList: [],
      admissionRefNo: [this.admissionRefNo], //Modification for IPD prescription
      shareWithPatient:[],  //Modification for IPD prescription
      printGenericName: [null]
    }); 

    //this.autoSaveTimer();
    console.log(this.appointmentRefNo);
    //Modification for IPD prescription// Working on app/issues/1970
    if(this.appointmentRefNo!=null){
      this.getChamberDetailsByRefNo(this.appointmentRefNo);
      this.getPrespription();
      this.getDoctorDetailsByRefNo(this.loggedInUser.refNo);
    }
    else{
      let prescriptionRefNo = localStorage.getItem("prescriptionRefNo");
      this.getPrespriptionByAdmissionRefNo(prescriptionRefNo);
    }
    this.getPatientDetailsByRefNo(this.userRefNo);
    //End Modification for IPD prescription

    // Working on app/issues/937
    this._doctorService.doctorNameList().subscribe(data => {
      if (data['status'] == '2000') {
        this.doctorNameList = data['data'];
      }
    });
    //End Working on app/issues/937

    //this.getPastPrescription(this.userPk, this.doctorPk, this.appointmentPk);

    //Commented for Working on app/issues/731
    //this.getPastPrescriptionV2(this.userRefNo, this.loggedInUser.refNo, this.appointmentRefNo);
    //End Commented for Working on app/issues/731

    // this._doctorService.getInfoAndMedicalHistoryForUser(this.userPk).subscribe(data => {
    //   //console.log("User Data; ");
    //   //console.log(data['data']);

    //   this.individualUserData = data['data'];
    //   if (data['data'].dateOfBirth != null) {
    //     const bdate = new Date(data['data'].dateOfBirth);
    //     const timeDiff = Math.abs(Date.now() - bdate.getTime());
    //     this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " years";
    //   }

    //   this.apiService.DownloadProfiePhoto.getByPath(data['data'].msUserPk).subscribe(result=>{
    //     if (result["status"] === 2000 && result.data !=null && result.data.length>0) {
    //       this.patientProfileImageSrc = "data:image/jpeg;base64," + result.data;
    //     }
    //   });

    // });

    //Commented for Working on app/issues/731
    //this.loadUserMedicalRecords();
    //End Commented for Working on app/issues/731

    // this._doctorService.getChamberByAppointmentPk(this.appointmentPk).subscribe(data => {
    //   //console.log("Appointment Data; ");
    //   //console.log(data['data']);
    //   this.doctorChamberDetails = data['data'];

    // });

    // this._doctorService.getAllPastNote(this.doctorPk , this.userPk).subscribe(data => {
    //   if(data['status']=='2000'){
    //     this.noteList = data['data'];
    //     this.noOfNote = this.noteList.length;
    //   }
    // });

    //Commented for Working on app/issues/731
    // let payload = {
    //   doctorRefNo: this.doctorRefNo,
    //   userRefNo : this.userRefNo
    // }
    // this._doctorService.getAllPastNoteV2(payload).subscribe(data => {
    //   if(data['status']=='2000'){
    //     this.noteList = data['data'];
    //     this.noOfNote = this.noteList.length;
    //   }
    // });
    //End Commented for Working on app/issues/731

    // calling the Auto timer function when component loads
    this.oberserableTimer();

  }

  // Working on app/issues/1970
  getPrespriptionByAdmissionRefNo(prescriptionRefNo) {
    let payload = {
      "admissionRefNo": this.admissionRefNo,
      "prescriptionRefNo": prescriptionRefNo
    }
    this._doctorService.getPrescriptionByAdmisionOrAppointmentAndPrescriptionRefNo(payload).subscribe(data => {
      if (data['data'] != null) {
        // If no prescription is created set only Problem Narration if returned - app#708
        if (data['data'].prescriptionRefNo == null) {
          this.prescriptionForm.patchValue({
            referredBy: data['data'].referredBy
          })
          this.genericFlag = data['data'].printGenericName;
        }
        else {
          this.genericFlag = data['data'].printGenericName;
          this.downloadDrewImageFile(data['data'].prescriptionRefNo)
          this.populatePrescriptionForm(data['data']);
          let doctor = data['data'].doctor;
          if (doctor.headerFilePath != null) {
            this.headerImage = "data:image/jpeg;base64," + doctor.headerImage;
          }
          if (doctor.footerFilePath != null) {
            this.footerImage = "data:image/jpeg;base64," + doctor.footerImage;
          }
          this.downloadDrewImageFile(data['data'].prescriptionRefNo);//getting drew prescription
        }
      }
      else {
      }

    });
  }
  //End Working on app/issues/1970

  getDoctorDetailsByRefNo(refNo) {
    let payload = {
      refNo: refNo
    }
    this._doctorService.getDoctorDetailsByRefNo(payload).subscribe(data => {
      //console.log("================DOCTOR DETAILS================");
      //console.log(data);
      this.doctorDetails = data["data"];
      this.spFlag = this.doctorDetails.specializationType == 'O' ? false: true;

      /*if(!this.spFlag){
        document.getElementById('medicationArea').classList.add('d-none');
        document.getElementById('splCheck').classList.add('d-none');
      }*/

    });
  }

  getChamberDetailsByRefNo(appointmentRefNo) {
    let payload = {
      refNo: appointmentRefNo
    }
    this._doctorService.getChamberDetailsByRefNo(payload).subscribe(data => {
      //console.log("================CHABMER DETAILS================");
      //console.log(data);
      this.doctorChamberDetails = data['data'];

    });
  }

  getPatientDetailsByRefNo(userRefNo) {
    let payload = {
      refNo: userRefNo
    }
    this._doctorService.getPatientDetailsByRefNo(payload).subscribe(data => {

      this.individualUserData = data['data'];
      if (data['data'].dateOfBirth != null) {
        const bdate = new Date(data['data'].dateOfBirth);
        const timeDiff = Math.abs(Date.now() - bdate.getTime());
        // app#823 - if age < 1 year show in month; if < 1 month show in days; also handle singular / plural
        let ageInDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        if (ageInDays == 1)
          this.age = "1 day";
        else if (ageInDays < 30)
          this.age = ageInDays + " days";
        else if (ageInDays < 60)
          this.age = "1 month";
        else if (ageInDays < 365)
          this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + " months";
        else if (ageInDays <= 2 * 365)
          this.age = "1 year";
        else
          this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " years";

      }
      // this.apiService.DownloadProfiePhoto.getByPath(data['data'].msUserPk).subscribe(result=>{
      // let roleName = "INDIVIDUAL";
      // let path: string =data['data'].refNo + "/" + roleName;//neew add to download profile pic
      // this.apiService.DownloadProfilePic.getByPath(path).subscribe(result=>{
      //   if (result["status"] === 2000 && result.data !=null && result.data.length>0) {
      //     this.patientProfileImageSrc = "data:image/jpeg;base64," + result.data;
      //   }
      // });
    });

    // Working on app/issues/937
    let payload1 = {
      userRef: userRefNo
    }
    this._doctorService.getVaccinationListByUserRefNo(payload1).subscribe(data => {
      //console.log("================VACCINE DETAILS================");
      //console.log(data['data']);
      this.vaccineList = data['data'];
    });
    // Working on app/issues/937
  }

  /* ******** Auto save modification ******* */
  initiateAutoSaveObservation: boolean = false;
  initiateAutoSaveAdvice: boolean = false;
  initiateAutoSaveMedication: boolean = false;
  initiateAutoSaveDiagnosis: boolean = false;
  initiateAutoSaveVital: boolean = false;
  initiateAutoSaveTest: boolean = false;
  initiateAutoSavePrescription: boolean = false;
  initiateAutoSaveNote: boolean = false;
  initiateAutoSaveReferral: boolean = false;
  initiateAutoSaveVaccination: boolean = false; // Working on app/issues/937
  initiateAutoSaveSymptom: boolean = false;

  oberserableTimer() {
    const source = timer(this.autoTimer + 5000, this.autoTimer);
    if (this.autosaveFlag) { // If auto save flag is on in environment.ts
      this.autoTimerSubscription = source.subscribe(val => {
        //console.log("Timer counter(no of call) " + val);

        //If blank prescription - nothing happens if open idle
        // if (this.prescriptionForm.value.adviceList == null && this.prescriptionForm.value.diagnosisList == null
        //   && this.prescriptionForm.value.doctorRecommendedTestList == null && this.prescriptionForm.value.medicalFindingsList == null
        //   && this.prescriptionForm.value.medicationDTOList == null && this.prescriptionForm.value.nextCheckUpDate == null
        //   && this.prescriptionForm.value.observationList == null && (this.prescriptionForm.value.patientProblemNarration == null
        //     || this.prescriptionForm.value.patientProblemNarration == "")) {
        if (this.prescriptionVitalForm.length == 0 && this.prescriptionNarrationForm.length == 0
          && this.prescriptionObservationForm.length == 0 && this.prescriptionTestForm.length == 0
          && this.prescriptionDiagnosisForm.length == 0 && this.prescriptionForm.value.nextCheckUpDate == null
          && this.prescriptionMedicationForm.length == 0 && this.prescriptionAdviceForm.length == 0
          && this.prescriptionNoteForm == null && this.prescriptionReferralForm == null
          && this.prescriptionVaccinationForm.length == 0 // Working on app/issues/937
          && (this.prescriptionForm.value.referredBy == null || this.prescriptionForm.value.referredBy == "")  // Working on app/issues/937
        ) {
          //console.log("No data is inserted/ new prescription");
        }
        else { //If filled up / saved prescription
          if (!this.stopTimer) {
            //console.log(this.prescriptionForm.value);

            this.prescriptionForm.valueChanges.subscribe(formData => {

              if (this.prescriptionForm.dirty) {
                this.isModifiedPrescription = true;
                this.initiateAutoSavePrescription = true;
                this.prescriptionForm.patchValue({
                  prescriptionFormDirty: true,
                  //patientProblemNarration: this.prescriptionNarrationForm
                })
              }
              else {
                this.isModifiedPrescription = false;
                this.initiateAutoSavePrescription = false;
              }
            })

            // /* ******** Narration ******* */
            // // If prescriptionFormDirty flag is set true (if isModified is set true) in Narration, call the auto save API
            // if (this.prescriptionForm.value.prescriptionFormDirty || this.isModifiedPrescription) {
            //   this.prescriptionForm.patchValue({
            //     patientProblemNarration: this.prescriptionNarrationForm
            //   })
            //   //console.log("Updated prescription for Narration: ");
            //   //console.log(this.prescriptionForm.value);
            //   // API Calling 
            //   this.initiateAutoSavePrescription = true;
            //   //this.autoSave(this.prescriptionForm.value);
            // }
            // else { // If observationFormDirty flag is set false
            //   this.initiateAutoSavePrescription = false;
            //   // this.prescriptionForm.patchValue({
            //   //   observationList: [] 
            //   // })
            //   //console.log("If no change in Narration: ");
            //   //console.log(this.prescriptionForm.value);
            // }
            // // Set observationFormDirty flag false for next timer call 
            // // this.prescriptionForm.patchValue({
            // //   prescriptionFormDirty: false
            // // })
            // /* ******** End of Narration ******* */

            /* ******** Symptom ******* */
            // If symptomFormDirty flag is set true (if isModified is set true) in symptom, call the auto save API
            if (this.prescriptionForm.value.symptomFormDirty) {
              this.prescriptionForm.patchValue({
                symptomList: this.prescriptionNarrationForm
              })
              this.initiateAutoSaveSymptom = true;
            }
            else { // If symptomFormDirty flag is set false
              this.initiateAutoSaveSymptom = false;
              
            }
            /* ******** End of Symptom ******* */

            /* ******** Observation ******* */
            // If observationFormDirty flag is set true (if isModified is set true) in observation, call the auto save API
            if (this.prescriptionForm.value.observationFormDirty) {
              this.prescriptionForm.patchValue({
                observationList: this.prescriptionObservationForm
              })
              //console.log("Updated prescription for observation: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveObservation = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If observationFormDirty flag is set false
              this.initiateAutoSaveObservation = false;
              // this.prescriptionForm.patchValue({
              //   observationList: [] 
              // })
              //console.log("If no change in observation: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set observationFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   observationFormDirty: false
            // })
            /* ******** End of Observation ******* */


            /* ******** Medication ******* */
            // If MedicationFormDirty flag is set true (if isModified is set true) in Medication, call the auto save API
            if (this.prescriptionForm.value.medicationFormDirty) {
              this.prescriptionForm.patchValue({
                medicationDTOList: this.prescriptionMedicationForm
              })
              //console.log("Updated prescription after Medication: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveMedication = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If medicationFormDirty flag is set false
              // this.prescriptionForm.patchValue({
              //   medicationDTOList: [] 
              // })
              this.initiateAutoSaveMedication = false;
              //console.log("If no change in Medication: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set MedicationFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   medicationFormDirty: false
            // })
            /* ******** End of Medication ******* */


            /* ******** Advice ******* */
            // If AdviceFormDirty flag is set true (if isModified is set true) in Advice, call the auto save API
            if (this.prescriptionForm.value.adviceFormDirty) {
              this.prescriptionForm.patchValue({
                adviceList: this.prescriptionAdviceForm
              })
              //console.log("Updated prescription after Advice: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveAdvice = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If adviceFormDirty flag is set false
              // this.prescriptionForm.patchValue({
              //   adviceList: [] 
              // })
              this.initiateAutoSaveAdvice = false;
              //console.log("If no change in Advice: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set AdviceFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   adviceFormDirty: false
            // })
            /* ******** End of Advice ******* */




            /* ******** Diagnosis ******* */
            // If DiagnosisFormDirty flag is set true (if isModified is set true) in Diagnosis, call the auto save API
            if (this.prescriptionForm.value.diagnosisFormDirty) {
              this.prescriptionForm.patchValue({
                diagnosisList: this.prescriptionDiagnosisForm
              })
              //console.log("Updated prescription after Diagnosis: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveDiagnosis = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If DiagnosisFormDirty flag is set false
              // this.prescriptionForm.patchValue({
              //   adviceList: [] 
              // })
              this.initiateAutoSaveDiagnosis = false;
              //console.log("If no change in Diagnosis: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set DiagnosisFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   diagnosisFormDirty: false
            // })
            /* ******** End of Diagnosis ******* */



            /* ******** Test ******* */
            // If TestFormDirty flag is set true (if isModified is set true) in Test, call the auto save API
            if (this.prescriptionForm.value.testFormDirty) {
              this.prescriptionForm.patchValue({
                doctorRecommendedTestList: this.prescriptionTestForm
              })
              //console.log("Updated prescription after Test: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveTest = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If TestFormDirty flag is set false
              // this.prescriptionForm.patchValue({
              //   adviceList: [] 
              // })
              this.initiateAutoSaveTest = false;
              //console.log("If no change in Test: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set TestFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   testFormDirty: false
            // })
            /* ******** End of Test ******* */



            /* ******** Vital ******* */
            // If vitalFormDirty flag is set true (if isModified is set true) in Vital, call the auto save API
            if (this.prescriptionForm.value.vitalFormDirty) {

              this.prescriptionForm.patchValue({
                medicalFindingsList: this.prescriptionVitalForm
              })
              //console.log("Updated prescription after Vital: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveVital = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If vitalFormDirty flag is set false
              // this.prescriptionForm.patchValue({
              //   adviceList: [] 
              // })
              this.initiateAutoSaveVital = false;
              //console.log("If no change in Vital: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set vitalFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   vitalFormDirty: false
            // })
            /* ******** End of Vital ******* */


            /* ******** Note ******* */
            // If noteFormDirty flag is set true (if isModified is set true) in Note, call the auto save API
            if (this.prescriptionForm.value.noteFormDirty) {
              this.prescriptionForm.patchValue({
                doctorNote: this.prescriptionNoteForm
              })
              //console.log("Updated prescription after Note: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveNote = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If noteFormDirty flag is set false
              // this.prescriptionForm.patchValue({
              //   adviceList: [] 
              // })
              this.initiateAutoSaveNote = false;
              //console.log("If no change in Note: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set noteFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   noteFormDirty: false
            // })
            /* ******** End of Note ******* */



            /* ******** Referral ******* */
            // If referralFormDirty flag is set true (if isModified is set true) in Referral, call the auto save API
            if (this.prescriptionForm.value.referralFormDirty) {
              this.prescriptionForm.patchValue({
                doctorReferral: this.prescriptionReferralForm
              })
              //console.log("Updated prescription after Referral: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveReferral = true;
              //this.autoSave(this.prescriptionForm.value);
            }
            else { // If referralFormDirty flag is set false
              // this.prescriptionForm.patchValue({
              //   adviceList: [] 
              // })
              this.initiateAutoSaveReferral = false;
              //console.log("If no change in Referral: ");
              //console.log(this.prescriptionForm.value);
            }
            // Set referralFormDirty flag false for next timer call 
            // this.prescriptionForm.patchValue({
            //   referralFormDirty: false
            // })
            /* ******** End of Referral ******* */


            // Working on app/issues/937
            /* ******** Vaccination ******* */
            // If vaccinationFormDirty flag is set true (if isModified is set true) in Vaccination, call the auto save API
            if (this.prescriptionForm.value.vaccinationFormDirty) {
              this.prescriptionForm.patchValue({
                vaccinationList: this.prescriptionVaccinationForm
              })
              //console.log("Updated prescription for Vaccination: ");
              //console.log(this.prescriptionForm.value);
              // API Calling 
              this.initiateAutoSaveObservation = true;
            }
            else { // If observationFormDirty flag is set false
              this.initiateAutoSaveVaccination = false;
              //console.log("If no change in observation: ");
              //console.log(this.prescriptionForm.value);
            }

            /* ******** End of Vaccination ******* */
            //End Working on app/issues/937


            if (this.initiateAutoSaveObservation || this.initiateAutoSaveMedication
              || this.initiateAutoSaveAdvice || this.initiateAutoSaveDiagnosis
              || this.initiateAutoSavePrescription || this.initiateAutoSaveVital
              || this.initiateAutoSaveTest || this.isModifiedPrescription
              || this.initiateAutoSaveNote || this.initiateAutoSaveReferral
              || this.initiateAutoSaveVaccination || this.initiateAutoSaveSymptom) {  //Working on app/issues/937
              //console.log(this.prescriptionForm.value);
              this.autoSave(this.prescriptionForm.value);
              this.isModifiedPrescription = false;
              this.initiateAutoSavePrescription = false;
              this.prescriptionForm.controls.nextCheckUpDate.markAsPristine();
              this.prescriptionForm.controls.reportReviewDate.markAsPristine();
              this.prescriptionForm.controls.referredBy.markAsPristine();  //Working on app/issues/937
            }

            this.prescriptionForm.patchValue({
              vitalFormDirty: false,
              testFormDirty: false,
              diagnosisFormDirty: false,
              adviceFormDirty: false,
              medicationFormDirty: false,
              observationFormDirty: false,
              prescriptionFormDirty: false,
              noteFormDirty: false,
              referralFormDirty: false,
              vaccinationFormDirty: false, //Working on app/issues/937
              symptomFormDirty: false
            })




          }
        }
      });
    }
  }
  /* ******** End of Auto save modification ******* */


  // autoSaveTimer() {
  //   if (this.autosaveFlag) {
  //     this.prescriptionForm.valueChanges.subscribe(formData => {
  //       //console.log(formData);
  //       if (!this.stopTimer) {
  //         //this.autoSave(formData);
  //       }
  //     })
  //   }
  // }

  autoSave(formData) {
    this._doctorService.autoSavePrescription(formData).subscribe(data => {
      //console.log(data);
      // alert(data['data'].prescriptionPk);
      if (data['status'] == '2000') {
        //this.pk = data['data'].prescriptionPk;
        this.prescriptionRefNo = data['data'].prescriptionRefNo;
        this.prescriptionForm.patchValue({
          //prescriptionPk: this.pk
          prescriptionRefNo: this.prescriptionRefNo
        })
        //this.populatePrescriptionForm(data['data']);
        this.showAutosaveMsg = true;
        setTimeout(() => {
          this.showAutosaveMsg = false;
        }, 3000);

      }
      else {
        alert(data['message']);
      }
      //window.location.reload();  
    })
  }

  createPrescriptionForm() {
    this.prescriptionForm = this.fb.group({
      //prescriptionPk: [],
      prescriptionDate: [],
      // visitPk: [this.visitPk],
      // doctorPk: [this.doctorPk],
      nextCheckUpDate: [],
      medicalFindingsList: [],
      observationList: [],
      doctorRecommendedTestList: [],
      patientProblemNarration: [],
      diagnosisList: [],
      medicationDTOList: [],
      adviceList: [],
      doctorNote: [],
      doctorReferral: [],
      status: ["NRM"],
      userRefNo: [this.userRefNo],
      doctorRefNo: [this.doctorRefNo],
      appointmentRefNo: [this.appointmentRefNo],
      isDraft: ["Y"],
      // createdDate: [],
      // createdBy: [],
      // modifiedDate: [],
      // modifiedBy: [],
      observationFormDirty: false,
      medicationFormDirty: false,
      adviceFormDirty: false,
      diagnosisFormDirty: false,
      testFormDirty: false,
      vitalFormDirty: false,
      prescriptionFormDirty: false,
      noteFormDirty: false,
      referralFormDirty: false,
      symptomFormDirty: false,
      symptomList: [],
      reportReviewDate: [],
      prescriptionRefNo: [],
      admissionRefNo: [this.admissionRefNo], //Modification for IPD prescription
      shareWithPatient:[],  //Modification for IPD prescription
      printGenericName: [null]
    });

  }
  populatePrescriptionForm(res) {
    this.narrationForm = res.symptomList;
    this.observationForm = res.observationList;
    this.adviceForm = res.adviceList;
    this.diagnosisForm = res.diagnosisList;
    this.labTestForm = res.doctorRecommendedTestList;
    this.medicationForm = res.medicationDTOList;
    this.vitalForm = res.medicalFindingsList;
    this.noteForm = res.doctorNote;
    this.referralForm = res.doctorReferral;
    this.vaccinationForm = res.vaccinationList; // Working on app/issues/937
    this.prescriptionNarrationForm = res.symptomList;
    this.refferedName = res.doctorReferral != null ? res.doctorReferral.referredName : null;
    this.prescriptionForm = this.fb.group({
      //prescriptionPk: [res.prescriptionPk],
      prescriptionDate: [res.prescriptionDate],
      //visitPk: [this.visitPk],
      nextCheckUpDate: [res.nextCheckUpDate != null ? new Date(res.nextCheckUpDate) : null],
      medicalFindingsList: [res.medicalFindingsList],
      observationList: [res.observationList],
      doctorRecommendedTestList: [res.doctorRecommendedTestList],
      patientProblemNarration: [res.patientProblemNarration],
      diagnosisList: [res.diagnosisList],
      medicationDTOList: [res.medicationDTOList],
      adviceList: [res.adviceList],
      doctorNote: [res.doctorNote],
      doctorReferral: [res.doctorReferral],
      status: [res.status],
      // userPk: [this.userPk],
      // doctorPk: [this.doctorPk],
      // appointmentPk: [this.appointmentPk],
      userRefNo: [this.userRefNo],
      doctorRefNo: [this.doctorRefNo],
      appointmentRefNo: [this.appointmentRefNo],
      //isDraft: [res.isDraft],
      isDraft: ["Y"],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy],
      observationFormDirty: false,
      medicationFormDirty: false,
      adviceFormDirty: false,
      diagnosisFormDirty: false,
      testFormDirty: false,
      vitalFormDirty: false,
      prescriptionFormDirty: false,
      noteFormDirty: false,
      referralFormDirty: false,
      symptomFormDirty: false,
      symptomList: [res.symptomList],
      reportReviewDate: [res.reportReviewDate != null ? new Date(res.reportReviewDate) : null],
      prescriptionRefNo: [res.prescriptionRefNo],
      vaccinationFormDirty: false, // Working on app/issues/937
      vaccinationList: [res.vaccinationList], // Working on app/issues/937
      referredBy: [res.referredBy], // Working on app/issues/937
      admissionRefNo: [this.admissionRefNo], //Modification for IPD prescription
      shareWithPatient:[res.shareWithPatient], //Modification for IPD prescription
      printGenericName: [res.printGenericName]
    });
    //this.autoSaveTimer();
  }

  headerImage = "";
  footerImage = "";
  genericFlag: any = null;
  getPrespription() {
    let payload = {
      "appointmentRef": this.appointmentRefNo
    }
    //  this._doctorService.getPrescriptionByAppoRefNo(this.appointmentRefNo).subscribe(data => {
    this._doctorService.getPrescriptionByAppoRefNoV2(payload).subscribe(data => {
      //console.log(data['data']);
      if (data['data'] != null) {
        // If no prescription is created set only Problem Narration if returned - app#708
        if (data['data'].prescriptionRefNo == null) {
          //this.narrationForm = data['data'].patientProblemNarration;
          this.prescriptionForm.patchValue({
            referredBy: data['data'].referredBy,
          })
          this.genericFlag = data['data'].printGenericName;
        }
        else {
          this.genericFlag = data['data'].printGenericName;
          this.downloadDrewImageFile(data['data'].prescriptionRefNo)
          this.populatePrescriptionForm(data['data']);
          let doctor = data['data'].doctor;
          if (doctor.headerFilePath != null) {
            this.headerImage = "data:image/jpeg;base64," + doctor.headerImage;
          }
          if (doctor.footerFilePath != null) {
            this.footerImage = "data:image/jpeg;base64," + doctor.footerImage;
          }
          this.downloadDrewImageFile(data['data'].prescriptionRefNo);//getting drew prescription
        }
      }
      else {
        //this.createPrescriptionForm();
        //this.autoSaveTimer();
      }

    });
  }

  previewPrescription() {
    // this.prescriptionForm = this.fb.group({
    //   nextCheckUpDate: this.prescriptionForm.controls.nextCheckUpDate.value,
    //   prescriptionVitalForm: this.prescriptionVitalForm,
    //   observationList: this.prescriptionObservationForm,
    //   testList: this.prescriptionTestForm,
    //   narration: this.prescriptionNarrationForm,
    //   diagnosisList: this.prescriptionDiagnosisForm,
    //   medicationList: this.prescriptionMedicationForm,
    //   adviseList: []
    // });
    if ((this.prescriptionForm.value.adviceList == null && this.prescriptionForm.value.diagnosisList == null
      && this.prescriptionForm.value.doctorRecommendedTestList == null && this.prescriptionForm.value.medicalFindingsList == null
      && this.prescriptionForm.value.medicationDTOList == null && this.prescriptionForm.value.nextCheckUpDate == null
      && this.prescriptionForm.value.observationList == null 
      && (this.prescriptionForm.value.referredBy == null || this.prescriptionForm.value.referredBy == "") //Working on app/issues/937
      && this.prescriptionForm.value.doctorNote == null
      && this.prescriptionForm.value.doctorReferral == null
      && this.prescriptionForm.value.vaccinationList == null
      && this.prescriptionForm.value.symptomList == null)
    ) {
      // this._toastService.showToast(404, "Please fill anything on Prescription...");
      this._toastService.showI18nToast("Prescription is Blank.", "error");
    }
    else {
      this.stopTimer = true;
      this.autoSave(this.prescriptionForm.value); // Working on app/issues/1323
      this.previewPrescriptionData = this.prescriptionForm.value;
      // sbis-poc/app/issues/644 start
      if (this.prescriptionForm.get("medicalFindingsList").value != null) {
        let totalNoOfMedicales = this.prescriptionForm.get("medicalFindingsList").value.length;
        for (let i = 0; i < totalNoOfMedicales && !this.isVitalShow; i++) {
          let medical = this.prescriptionForm.get("medicalFindingsList").value[i];
          if (medical["result"] != null) {
            this.isVitalShow = true;
          }
        }
      }
      // sbis-poc/app/issues/644 end
      //console.log("Submit");
      //console.log(this.prescriptionForm.value);
      this.previewScreen = true;
      this.broadcastService.setHeaderText("Prescription Preview");
    }
  }

  backToPrescription() {
    this.previewScreen = false;
    //console.log("Back");
    //console.log(this.prescriptionForm.value);
    this.broadcastService.setHeaderText('Prescription')
  }

  getVitalData(prescriptionForm) {
    /* ******** Auto save modification ******* */
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        vitalFormDirty: true,
        medicalFindingsList: prescriptionForm.vitalList
      })
      this.prescriptionVitalForm = prescriptionForm.vitalList;
      ////console.log(this.prescriptionObservationForm);
      // this.prescriptionForm.patchValue({
      //   medicalFindingsList: prescriptionForm.vitalList,
      // })
    }
    /* ******** End of Auto save modification ******* */
    // this.prescriptionVitalForm = prescriptionForm.value.vitalList;
    // //console.log('MM' + this.prescriptionVitalForm);
    // this.prescriptionForm.patchValue({
    //   medicalFindingsList: this.prescriptionVitalForm,
    // })
    // // this.autoSaveTimer();
  }

  //method to get prescriptionRefNo by event emiter --susmita
  getCanvasData(canvasJson) {
    // //console.log("susmita-->>canvasJson result by event emiter::",canvasJson);
    (canvasJson.saved) ? this.show_canvas_paint = false : this.show_canvas_paint = true;
    this.prescriptionForm.value.prescriptionRefNo = canvasJson.prescriptionRefNo;
    //app#2113
    this.prescriptionForm.patchValue({
      prescriptionRefNo: canvasJson.prescriptionRefNo
    })
    //End app#2113
    //call image download service
    this.downloadDrewImageFile(canvasJson.prescriptionRefNo);
  }//end of method

  download = {
    downloadImageSrc: "",
    contentType: "",
    doctorName: "",
    forUserName: ""
  }
  // downloadFile() {
  //   const link = document.createElement('a');
  //   link.href = this.download.downloadImageSrc;
  //   link.download = this.download.forUserName.replace(/\./g, '_') + "_" + this.download.doctorName.replace(/\./g, '_');
  //   link.click();
  // }

  //method to downlad file
  downloadDrewImageFile(prescriptionRefNo) {
    let query = {
      'downloadFor': 'DOCTOR_PRESCRIPTION_DRAW',
      'prescriptionRefNo': prescriptionRefNo
    }
    this.individualService.prescriptionDownload(query).subscribe((result) => {
      if (result.status != 2000) {
        return;
      }
      this.download.contentType = result.data.contentType;
      this.download.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
    });
    // this.downloadFile();
  }//end of method

  //method to edit image
  editImage() {
    this.previousDrewImage['url'] = this.download.downloadImageSrc;
    this.show_canvas_paint = true;
  }

  //https://gitlab.com/sbis-poc/app/issues/1120
  deleteImage() {
    if (this.prescriptionForm.controls['prescriptionRefNo'].value) {
      this.previousDrewImage['url'] = this.download.downloadImageSrc;
      let requestPayload = {
        "fileUploadFor": "DOCTOR_PRESCRIPTION_DRAW",
        "prescriptionRefNo": this.prescriptionForm.controls['prescriptionRefNo'].value
      }
      this.coreService.deleteDocument(requestPayload).subscribe(res => {
        if (res.status === 2000){
          this.download = {
            downloadImageSrc: "",
            contentType: "",
            doctorName: "",
            forUserName: ""
          };
          this.show_canvas_paint = false;
        }

      });
    }
  }//end of method
  //susmita-----

  getObservationData(prescriptionForm) {
    /* ******** Auto save modification ******* */
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        observationFormDirty: true,
        observationList: prescriptionForm.doctorObservationList
      })
      this.prescriptionObservationForm = prescriptionForm.doctorObservationList;
      ////console.log(this.prescriptionObservationForm);
      // this.prescriptionForm.patchValue({
      //   observationList: prescriptionForm.doctorObservationList,
      // })
    }
    /* ******** End of Auto save modification ******* */
  }

  getNarrationData(prescriptionForm) {
    /* ******** Auto save modification ******* */
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        symptomFormDirty: true,
        symptomList: prescriptionForm.symptomList
      })
      this.prescriptionNarrationForm = prescriptionForm.symptomList;
      ////console.log(this.prescriptionNarrationForm);
      // this.prescriptionForm.patchValue({
      //   patientProblemNarration: this.prescriptionNarrationForm,
      // })
    }
    /* ******** End of Auto save modification ******* */
  }

  getTestData(prescriptionForm) {
    // /sbis-poc/app/issues/729
    //if(prescriptionForm.isModified){
    this.prescriptionForm.patchValue({
      testFormDirty: true,
      doctorRecommendedTestList: prescriptionForm.doctorTestList
    })
    this.prescriptionTestForm = prescriptionForm.doctorTestList;
    ////console.log(this.prescriptionObservationForm);
    // this.prescriptionForm.patchValue({
    //   doctorRecommendedTestList: prescriptionForm,
    // })
    //}
  }

  getDiagnosisData(prescriptionForm) {
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        diagnosisFormDirty: true,
        diagnosisList: prescriptionForm.doctorDiagnosisList
      })
      this.prescriptionDiagnosisForm = prescriptionForm.doctorDiagnosisList;
      ////console.log(this.prescriptionObservationForm);
      // this.prescriptionForm.patchValue({
      //   diagnosisList: prescriptionForm.doctorDiagnosisList,
      // })
    }
  }

  getMedicationData(prescriptionForm) {
    /* ******** Auto save modification ******* */
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        medicationFormDirty: true,
        medicationDTOList: prescriptionForm.doctorPrescribedMedicineList,
        printGenericName: prescriptionForm.printGenericName 
      })
      this.prescriptionMedicationForm = prescriptionForm.doctorPrescribedMedicineList;
      ////console.log(this.prescriptionObservationForm);
      // this.prescriptionForm.patchValue({
      //   medicationDTOList: prescriptionForm.doctorPrescribedMedicineList
      // })
    }
    /* ******** End of Auto save modification ******* */
  }

  getAdviceData(prescriptionForm) {
    /* ******** Auto save modification ******* */
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        adviceFormDirty: true,
        adviceList: prescriptionForm.adviceList
      })
      this.prescriptionAdviceForm = prescriptionForm.adviceList;
      ////console.log(this.prescriptionObservationForm);
      // this.prescriptionForm.patchValue({
      //   adviceList: prescriptionForm.adviceList,
      // })
    }
    /* ******** End of Auto save modification ******* */
  }

  getNoteData(prescriptionForm) {
    /* ******** Auto save modification ******* */
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        noteFormDirty: true,
        doctorNote: prescriptionForm
      })
      this.prescriptionNoteForm = prescriptionForm;
      ////console.log(this.prescriptionObservationForm);
      // this.prescriptionForm.patchValue({
      //   doctorNote: this.prescriptionNoteForm,
      // })
    }
    /* ******** End of Auto save modification ******* */
  }


  getReferralData(prescriptionForm) {
    /* ******** Auto save modification ******* */
    if (prescriptionForm.isModified) {
      this.refferedName = prescriptionForm.referredName;
      this.prescriptionForm.patchValue({
        referralFormDirty: true,
        doctorReferral: prescriptionForm
      })
      this.prescriptionReferralForm = prescriptionForm;
      ////console.log(this.prescriptionObservationForm);
      // this.prescriptionForm.patchValue({
      //   doctorReferral: this.prescriptionReferralForm,
      // })
    }
    /* ******** End of Auto save modification ******* */
  }

  // Working on app/issues/937
  getVaccinationData(prescriptionForm) {
    if (prescriptionForm.isModified) {
      this.prescriptionForm.patchValue({
        vaccinationFormDirty: true,
        vaccinationList: prescriptionForm.vaccinationList
      })
      this.prescriptionVaccinationForm = prescriptionForm.vaccinationList;
    }
  }
  //End Working on app/issues/937

  handelPrePrinted(e) {
    if (e.target.checked) {
      this.preprinted = "Y";
    }
    else {
      this.preprinted = "N";
    }
  }

  savePrescription() {
    this.stopTimer = true;
    //console.log(this.prescriptionForm.value);
    this.prescriptionForm.patchValue({
      isDraft: 'N'
    })
    // Working on app/issues/1323
    let payload = {
      "prescriptionRefNo": this.prescriptionForm.value.prescriptionRefNo,
      "prescriptionDate": this.prescriptionForm.value.prescriptionDate,
      "userRefNo": this.prescriptionForm.value.userRefNo,
      "appointmentRefNo": this.prescriptionForm.value.appointmentRefNo,
      "isDraft": 'N',
    }

    this._doctorService.savePrescriptionV3(payload).subscribe(data => {   // Working on app/issues/1323
    //this._doctorService.savePrescription(this.prescriptionForm.value).subscribe(data => { // Working on app/issues/1323
     // //console.log(data);
      // alert(data['data'].prescriptionPk);
      if (data['status'] == '2000') {
        //this.pk = data['data'].prescriptionPk;
        this.prescriptionRefNo = this.prescriptionForm.value.prescriptionRefNo;

        //alert("Prescription saved successfully.");
        this.printOrViewFlag = true;
      }
      else {
        this._toastService.showI18nToastFadeOut(data['message'], 'error');
      }
      //window.location.reload();  
    })
  }

  // backToAppointment() {
  //   this._doctorService.updateVisitDtls(this.visitPk).subscribe(data => {
  //     //console.log(data);
  //     if (data['data'] != null)
  //       // this.router.navigate(['doctor/calendar']);
  //       this.router.navigate(['searchPatient']);
  //   });
  //   //this.router.navigate(['doctor/calendar']);
  // }

  backToAppointment() {
    this.router.navigate(['searchPatient']);
  }

  specializations = "";
  qualifications = "";
  // getDoctorDtl() {
  //   this._doctorService.FindbyDoctorIdV2(this.doctorPk).subscribe(data => {
  //     //console.log(data);
  //     this.doctorDetails = data;
  //     //console.log(this.doctorDetails);
  //     let spec = [];
  //     let qual = []
  //     spec = this.doctorDetails.doctorSpecializations;
  //     qual = this.doctorDetails.doctorQualifications;
  //     // var x: string = "";
  //     // for(let i = 0; i < this.doctorSpecializations.length; i++){
  //     //   x.concat(this.doctorSpecializations[i].specialization, ',')
  //     // }
  //     //console.log(this.doctorSpecializations);

  //     for (let i = 0; i < spec.length; i++) {
  //       this.doctorSpecializations.push(spec[i].specialization)
  //     }
  //     //console.log(this.doctorSpecializations);

  //     for (let i = 0; i < qual.length; i++) {
  //       this.doctorQualifications.push(qual[i].qualificationShort)
  //     }
  //     this.specializations = this.doctorSpecializations.join(',')
  //     //console.log(this.specializations);

  //     this.qualifications = this.doctorQualifications.join(',')
  //     //console.log(this.qualifications);

  //     this.doctorDtl.name = "Dr. " + data.doctorName;
  //     this.doctorDtl.regNo = data.registrationNo;
  //   });
  // }

  // debugger;
  // getPastPrescription(userPk, doctorPk, appointmentPk) {

  //   this._doctorService.getPastPrescriptionApi(userPk, doctorPk, appointmentPk)
  //     .subscribe(data => {
  //       this.pastPrescription = data.data;
  //       for (let pp of this.pastPrescription) {
  //         pp.prescriptionDateFormatted = this.dateFormatPipe.transform(pp.prescriptionDate);
  //       }
  //       //console.log("getPastPrescriptionApi", data.data);
  //     },
  //       (error) => {
  //         alert("Internal Server Problem");
  //         return;
  //       });
  // }


  popupOpen(id) {
    var event = document.createEvent("Event");
    event.initEvent("click", false, true);
    document.getElementById(id).dispatchEvent(event);
  }

  getPastPrescriptionV2(userRefNo, doctorRefNo, appointmentRefNo) {
    let payload = {
      doctorRefNo: doctorRefNo,
      userRefNo: userRefNo,
      appointmentRefNo: appointmentRefNo
    }
    this._doctorService.getPastPrescriptionApiV2(payload)
      .subscribe(data => {
        this.pastPrescription = data.data;
        for (let pp of this.pastPrescription) {
          pp.prescriptionDateFormatted = this.dateFormatPipe.transform(pp.prescriptionDate);
        }
        //console.log("getPastPrescriptionApi", data.data);
      },
        (error) => {
          alert("Internal Server Problem");
          return;
        });
  }

  appRefNo: any;
  onSelect(pp) {
    this.appRefNo = pp.appointmentRefNo
    //this.router.navigate(['/doctor/prescriptionpreview', pp.appointmentRefNo]);
    this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, this.config);
  }


  observationArea() {


    const element = this.renderer.selectRootElement('#observ');
    setTimeout(() => element.focus(), 0);

    if (this.prescriptionForm.value.observationList != null) {
      if (this.prescriptionForm.value.observationList.length != 0) {
        this.show_area = this.show_area;
        //document.getElementById('observationArea').classList.remove('opened');
      } else {
        this.show_area = !this.show_area;
        if (this.show_area) {
          document.getElementById('observationArea').classList.add('opened');
        } else {
          document.getElementById('observationArea').classList.remove('opened');
        }
      }
    } else {
      this.show_area = !this.show_area;
      if (this.show_area) {
        document.getElementById('observationArea').classList.add('opened');
      } else {
        document.getElementById('observationArea').classList.remove('opened');
      }

      //this.show_area = true;
    }
    //this.popupOpen("observe");
  }

  diagnosisArea() {

    const element = this.renderer.selectRootElement('.diagnosisStyle');
    setTimeout(() => element.focus(), 0);


    //this.show_diagarea = !this.show_diagarea;


    if (this.prescriptionForm.value.diagnosisList != null) {
      if (this.prescriptionForm.value.diagnosisList.length != 0) {
        this.show_diagarea = this.show_diagarea;
        //this.show_diagarea = true;
      } else {
        this.show_diagarea = !this.show_diagarea;
        if (this.show_diagarea) {
          document.getElementById('diagnosisArea').classList.add('opened');
        } else {
          document.getElementById('diagnosisArea').classList.remove('opened');
        }
      }
    } else {
      this.show_diagarea = !this.show_diagarea;
      if (this.show_diagarea) {
        document.getElementById('diagnosisArea').classList.add('opened');
      } else {
        document.getElementById('diagnosisArea').classList.remove('opened');
      }
    }
    //this.popupOpen("diagn-popup");
  }

  noteArea() {

    const element = this.renderer.selectRootElement('#docNote');
    setTimeout(() => element.focus(), 0);

    if (this.prescriptionForm.value.doctorNote != null) {
      this.show_note = this.show_note;
      //this.show_note = true;
    } else {
      this.show_note = !this.show_note;
      if (this.show_note) {
        document.getElementById('noteArea').classList.add('opened');
      } else {
        document.getElementById('noteArea').classList.remove('opened');
      }
    }
    //this.popupOpen("notePopup");
  }

  referralArea() {
    const element = this.renderer.selectRootElement('.referalStyle');
    setTimeout(() => element.focus(), 0);

    if (this.prescriptionForm.value.doctorReferral != null) {
      this.show_referral = this.show_referral;
      //this.show_referral = true;
    } else {
      this.show_referral = !this.show_referral;
      if (this.show_referral) {
        document.getElementById('referArea').classList.add('opened');
      } else {
        document.getElementById('referArea').classList.remove('opened');
      }
      //this.show_referral = true;
    }
    //this.popupOpen("referalPopup");
  }

  test() {

    //this.show_test = !this.show_test;

    const element = this.renderer.selectRootElement('.labTestStyle');
    setTimeout(() => element.focus(), 0);

    //let elmnt = document.getElementById("test");
    if (this.prescriptionForm.value.doctorRecommendedTestList != null) {
      if (this.prescriptionForm.value.doctorRecommendedTestList.length != 0) {
        this.show_test = this.show_test;
        //this.show_test = true;
      } else {
        this.show_test = !this.show_test;
        if (this.show_test) {
          document.getElementById('testArea').classList.add('opened');
        } else {
          document.getElementById('testArea').classList.remove('opened');
        }
      }
    } else {
      this.show_test = !this.show_test;
      if (this.show_test) {
        document.getElementById('testArea').classList.add('opened');
      } else {
        document.getElementById('testArea').classList.remove('opened');
      }
    }
    //this.popupOpen("investigatePopup");
  }

  medication() {
    //this.show_medic = !this.show_medic;
    //this.modalRef = this.bsModalService.show(this.doctorPrescribedMedicationModal, this.config);

    const element = this.renderer.selectRootElement('.medicationStyle');
    setTimeout(() => element.focus(), 0);

    if (this.prescriptionForm.value.medicationDTOList != null) {
      if (this.prescriptionForm.value.medicationDTOList.length != 0) {
        this.show_medic = this.show_medic;

        //this.show_medic = true;
      } else {
        this.show_medic = !this.show_medic;
        if (this.show_medic) {
          document.getElementById('medicationArea').classList.add('opened');
        } else {
          document.getElementById('medicationArea').classList.remove('opened');
        }

        //this.show_medic = true;
      }
    } else {
      this.show_medic = !this.show_medic;
      if (this.show_medic) {
        document.getElementById('medicationArea').classList.add('opened');
      } else {
        document.getElementById('medicationArea').classList.remove('opened');
      }
    }

    //this.popupOpen("medicationpop");
  }


  advice() {
    //this.show_advice = !this.show_advice;
    const element = this.renderer.selectRootElement('#adviceStyle');
    setTimeout(() => element.focus(), 0);


    if (this.prescriptionForm.value.adviceList != null) {
      if (this.prescriptionForm.value.adviceList.length != 0) {
        this.show_advice = this.show_advice;
        //this.show_advice = true;
      } else {
        this.show_advice = !this.show_advice;
        if (this.show_advice) {
          document.getElementById('adviceArea').classList.add('opened');
        } else {
          document.getElementById('adviceArea').classList.remove('opened');
        }
      }
    } else {
      this.show_advice = !this.show_advice;
      if (this.show_advice) {
        document.getElementById('adviceArea').classList.add('opened');
      } else {
        document.getElementById('adviceArea').classList.remove('opened');
      }//this.show_advice = true;
    }
    //this.popupOpen("advise-popup");
  }

  nextcheckDate() {
    //this.show_date = !this.show_date;

    const element = this.renderer.selectRootElement('.follow');
    setTimeout(() => element.focus(), 0);

    if (this.prescriptionForm.value.nextCheckUpDate != null) {
      if (this.prescriptionForm.value.nextCheckUpDate.length != 0) {
        this.show_date = this.show_date;
      } else {
        this.show_date = !this.show_date;
        if (this.show_date) {
          document.getElementById('followUpArea').classList.add('opened');
        } else {
          document.getElementById('followUpArea').classList.remove('opened');
        }
      }
    } else {
      this.show_date = !this.show_date;
      if (this.show_date) {
        document.getElementById('followUpArea').classList.add('opened');
      } else {
        document.getElementById('followUpArea').classList.remove('opened');
      }
    }
  }

  // Working on app/issues/937
  vaccinationDetails() {

    const element = this.renderer.selectRootElement('.vaccineStyle');
    setTimeout(() => element.focus(), 0);

    //console.log(this.prescriptionForm.value.vaccinationList);
    if (this.prescriptionForm.value.vaccinationList != null) {
      if (this.prescriptionForm.value.vaccinationList.length != 0) {
        this.show_vaccination = this.show_vaccination;
      } else {
        this.show_vaccination = !this.show_vaccination;
        if (this.show_vaccination) {
          document.getElementById('vaccineArea').classList.add('opened');
        } else {
          document.getElementById('vaccineArea').classList.remove('opened');
        }
      }
    } else {
      this.show_vaccination = !this.show_vaccination;
      if (this.show_note) {
        document.getElementById('vaccineArea').classList.add('opened');
      } else {
        document.getElementById('vaccineArea').classList.remove('opened');
      }
    }
  }

  //End Working on app/issues/937


  //new add for canvas-painting
  drawPrescription() {
    // if (this.prescriptionRefNo

    const element = this.renderer.selectRootElement('#canvFocus');
    setTimeout(() => element.focus(), 0);

    this.previousDrewImage = {};

    //this.show_canvas_paint = !this.show_canvas_paint;

    if (!this.show_canvas_paint) {
      this.show_canvas_paint = true;
      if (this.show_canvas_paint) {
        document.getElementById('canvasArea').classList.add('opened');
      } else {
        document.getElementById('canvasArea').classList.remove('opened');
      }
    }

    if (this.show_canvas_paint && document.getElementById('canvas') != null) {
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      let check = this.isDrawnOn();
      if (check === true) {
        //alert("Canvas has been drawn on! \nThe result has returned " + check);
        //this.show_canvas_paint = this.show_canvas_paint;
        document.getElementById('paint').classList.add('disableLinks');
      } else {
        document.getElementById('paint').classList.remove('disableLinks');
        //alert("Canvas is empty! \nThe result has returned " + check);
        this.show_canvas_paint = !this.show_canvas_paint;
        if (this.show_canvas_paint) {
          document.getElementById('canvasArea').classList.add('opened');
        } else {
          document.getElementById('canvasArea').classList.remove('opened');
        }
      }

    }



    /*if(this.show_canvas_paint && this.download.downloadImageSrc != ''){
      document.getElementById('paint').classList.add('disableLinks');
      //console.log('aaa');
    }else{
      document.getElementById('paint').classList.remove('disableLinks');
       //console.log('bbb');
    }

    setTimeout(function(){
      const element = this.renderer.selectRootElement('#canvasSave');
      //console.log(element);
      element.focus();
    },3000);*/

  }


  isDrawnOn() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    let context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var result = null;
    var counter = 0;
    var last = data.length - 1;
    for (var i = 0; i < data.length; i++) {
      if (i === last && counter !== 0 && counter === last) {
        result = false;
        break;
      } else if (data[i] !== 0 && data[i] > 0) {
        result = true;
        break;
      } else {
        counter++;
        continue;
      }
    }
    return result;
  }


  //end of new add for canvas-painting

  backToPrevious() {
    this._location.back();
    //window.history.back();
  }

  // loadUserMedicalRecords() {
  //   this._doctorService.getUserVitalMedicalAttributes(this.userRefNo).subscribe((result) => {
  //     if (result.status == 2000) {
  //       let medDetList = result.data;
  //       this.medicalDetailsList = medDetList;
  //       //console.log(this.medicalDetailsList);
  //       this.modifyMedicalDetailDisplayArrWithBP(medDetList);
  //     }
  //   });
  // }//end of method
  //method to open chart modal
  // showHealthAttributeProgress(medicalDetail,id) {
  //   this.chartData = {};
  //   this.modalService.open(id);
  //   let queryForChart = {
  //     refNo: this.userRefNo,
  //     attributeId: medicalDetail.attributeId,
  //     startDate: medicalDetail.startDate,
  //     endDate: medicalDetail.endDate
  //   }
  //   let queryForChartBpDia = {};
  //   if (medicalDetail.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
  //     queryForChart.attributeId = medicalDetail.attributeBPSysId;
  //    // queryForChartBpDia['userPk'] = parseInt(this.userPk);//this.user_id;
  //     queryForChartBpDia['attributeId'] = medicalDetail.attributeBPDiaId;
  //     queryForChartBpDia['startDate'] = medicalDetail.startDate;
  //     queryForChartBpDia['endDate'] = medicalDetail.endDate;
  //     queryForChartBpDia['refNo'] = this.userRefNo;
  //   }
  //   ////console.log(queryForChart);
  //   let labelsArray: string[] = [];
  //   let dataArray = [];//to store all result value for chart
  //   let referenceRangeToValArr = [];//to store all refRange to values
  //   let referenceRangeFromValArr = [];//to store all ref range from values
  //   this.individualService.loadMedicalAttributeDataForChart(queryForChart).subscribe((data) => {
  //     ////console.log(data.data);
  //     if (data.status === 2000) {
  //       let resArrOfChartData = data.data;
  //       resArrOfChartData.reverse();
  //       resArrOfChartData.forEach(function (x) {
  //         let mydate = new Date(x['dateStr']);
  //         let year = mydate.getFullYear();
  //         let month = (1 + mydate.getMonth()).toString();
  //         month = month.length > 1 ? month : '0' + month;
  //         let day = mydate.getDate().toString();
  //         day = day.length > 1 ? day : '0' + day;
  //         labelsArray.push(month + '/' + day + '/' + year);
  //         dataArray.push(x['result']);
  //         x['referenceRangeFrom']? referenceRangeFromValArr.push(x['referenceRangeFrom']): null;
  //         x['referenceRangeTo']? referenceRangeToValArr.push(x['referenceRangeTo']): null;

  //       });
  //       let label = medicalDetail.longName;
  //       if (medicalDetail.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
  //         this.individualService.loadMedicalAttributeDataForChart(queryForChartBpDia).subscribe((res) => {
  //           if (res.status == 2000) {
  //             let dataArrForDia: any[] = [];
  //             let refRangeFromValArrForBPDia: any[] = [];
  //             let refRangeToValArrForBPDia: any[] = [];
  //             res.data.reverse();              
  //             res.data.forEach(function (x) {
  //               dataArrForDia.push(x['result']);
  //               x['referenceRangeFrom']? refRangeFromValArrForBPDia.push(x['referenceRangeFrom']): null;
  //               x['referenceRangeTo']? refRangeToValArrForBPDia.push(x['referenceRangeTo']): null;
  //             });
  //             this.chartData = {
  //               labels: labelsArray,
  //               datasets: [{
  //                 label: medicalDetail.bpSysLongName,//attributeBPSysId,
  //                 data: dataArray,
  //                 fill: false,
  //                 borderColor: '#4bc0c0'
  //               },
  //               {
  //                 label: medicalDetail.bpDiaLongName,//attributeBPDiaId,
  //                 data: dataArrForDia,
  //                 fill: false,
  //                 borderColor: '#565656'
  //               }]
  //             }//end of chartdata
  //             referenceRangeToValArr.length> 0 ? this.buildChartDataByRefRangeArr('Reference Range To('+SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME+')',referenceRangeToValArr): null;       
  //             referenceRangeFromValArr.length> 0 ? this.buildChartDataByRefRangeArr('Reference Range From('+SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME+')',referenceRangeFromValArr): null; 
  //             refRangeToValArrForBPDia.length> 0 ? this.buildChartDataByRefRangeArr('Reference Range To('+SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME+')',referenceRangeToValArr): null;       
  //             refRangeFromValArrForBPDia.length> 0 ? this.buildChartDataByRefRangeArr('Reference Range From('+SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME+')',referenceRangeFromValArr): null; 

  //           }//end of if status check            
  //         });
  //       } else {
  //         this.chartData = {
  //           labels: labelsArray,
  //           datasets: [{
  //             label: label,
  //             data: dataArray,
  //             fill: false,
  //             borderColor: '#4bc0c0'
  //           }]
  //         }//end of chartdata
  //         referenceRangeToValArr.length> 0 ? this.buildChartDataByRefRangeArr('Reference Range To',referenceRangeToValArr): null;       
  //         referenceRangeFromValArr.length> 0 ? this.buildChartDataByRefRangeArr('Reference Range From',referenceRangeFromValArr): null;       
  //       }//end of else bp check
  //     }//end of res status match
  //   });//end of wscall
  // }//end of method
  //  //to build chartData if ref range arr is available
  //  buildChartDataByRefRangeArr(refRangeChartLebelName,refRangeArr){
  //   let refRangeJson: any ={};
  //   refRangeJson.label = refRangeChartLebelName;
  //   refRangeJson.data = refRangeArr;
  //   refRangeJson.fill = false;
  //   refRangeJson.borderColor = 'green';
  //   this.chartData.datasets.push(refRangeJson);
  // }//end of build chart data
  //   /**
  //  * modifyMedicalDetailDisplayArrWithBP ==> method to modify medical detail array
  //  */
  // public modifyMedicalDetailDisplayArrWithBP(medDetList) {
  //   this.medicalDetailsList = medDetList.filter(clbckFn => clbckFn.parentName != SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME);
  //   let bpDiaObj: any = medDetList.find(findElOfDia => findElOfDia.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME);
  //   let bpSysObj: any = medDetList.find(findElOfSys => findElOfSys.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME);
  //   if (bpDiaObj || bpSysObj) {
  //   let bpObj: any = {
  //     attributeBPDiaId: bpDiaObj.attributeId,
  //     attributeBPSysId: bpSysObj.attributeId,
  //     createdDate: bpDiaObj.createdDate,
  //     endDate: bpDiaObj.endDate ? bpDiaObj.endDate : null,
  //     bpSysLongName: bpSysObj.longName,
  //     bpDiaLongName: bpDiaObj.longName,
  //     longName: bpDiaObj.parentName,
  //     parentName: bpDiaObj.parentName,
  //     valueOfDia: bpDiaObj.result,
  //     valueOfSys: bpSysObj.result,
  //     result: bpSysObj.result + "/" + bpDiaObj.result,
  //     shortNameForBPDia: bpDiaObj.shortName ? bpDiaObj.shortName : null,
  //     source: bpDiaObj.source,
  //     startDate: bpDiaObj.startDate ? bpDiaObj.startDate : null,
  //     triggerPk: bpDiaObj.triggerPk ? bpDiaObj.triggerPk : null,
  //     unitName: bpDiaObj.unitName,
  //     userPk: null,
  //     medicalFindingsPkForDia: bpDiaObj.medicalFindingsPkForDia,
  //     medicalFindingsPkForSys: bpDiaObj.medicalFindingsPkForSys
  //   }
  //     this.medicalDetailsList.push(bpObj);
  //   }
  // }//end of method

  closeNewModal(id) {
    this.modalService.close(id);
  }//end of method

  ngOnDestroy() {
    this.autoTimerSubscription.unsubscribe();
    //localStorage.removeItem("online");
    //localStorage.removeItem("admissionRefNo");
    //localStorage.removeItem("appointmentRefNo");
    localStorage.removeItem("prescriptionRefNo");
  }

  // openNoteList(){
  //   this._doctorService.getAllPastNote(this.doctorPk , this.userPk).subscribe(data => {
  //     if(data['status']=='2000'){
  //       this.doctorNoteList = data['data'];
  //     }
  //   });
  //   //console.log(this.doctorNoteList);   
  //   this.modalRef = this.bsModalService.show(this.noteListModal, this.config);
  // }

  openNoteList() {
    let payload = {
      doctorRefNo: this.doctorRefNo,
      userRefNo: this.userRefNo
    }
    this._doctorService.getAllPastNoteV2(payload).subscribe(data => {
      if (data['status'] == '2000') {
        this.doctorNoteList = data['data'];
      }
    });
    //console.log(this.doctorNoteList);
    this.modalRef = this.bsModalService.show(this.noteListModal, this.config);
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

  //Working on app/issues/731
  showPatientDetails: boolean = false;
  getPatientInfo(showFlag) {
    this.showPatientDetails = showFlag;
  }
  closePatientInfo(showFlag) {
    this.showPatientDetails = showFlag;
  }
  //End Working on app/issues/731

  // Working on app/issues/937
  filteredReferralSingle(event) {
    let query = event.query;
    this.referralNameList = this.filterReferralName(query, this.doctorNameList);
  }

  filterReferralName(query, referralName: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < referralName.length; i++) {
      let referred = referralName[i];
      if (referred.toLowerCase().toString().indexOf(query.toLowerCase()) != -1) {
        filtered.push(referred);
      }
    }
    return filtered;
  }

  referredNameSelect(referredName) {
    this.prescriptionForm.patchValue({
      referredBy: referredName
    })
    //console.log(this.prescriptionForm.value);

  }
  // Working on app/issues/937

  // Working on app/issues/1615
  endChat(){
    let payload = {
      "appointmentRef": this.appointmentRefNo
    }
	  // this._doctorService.endSessionForVideoChat(payload).subscribe(res => {
    //   console.log(res["data"]);
    //   if(res["status"]=2000){
    //     console.log("DisConnected");
    //     this.online = false;
    //   }
    // });
  }

  // Working on app/issues/1970
  setShareWithPatient(event){
    if(event.target.checked){
      this.prescriptionForm.patchValue({
        shareWithPatient: "Y"
      })
    }
    else{
      this.prescriptionForm.patchValue({
        shareWithPatient: "N"
      })
    }
    console.log(this.prescriptionForm.value);
    
  }

  backToInpatientSummary(){
    this.router.navigate(['opd/inpatient-summary']);
  }
  //End Working on app/issues/1970

}//end of class
