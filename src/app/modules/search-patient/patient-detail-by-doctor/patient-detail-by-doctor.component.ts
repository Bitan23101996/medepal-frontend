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
import { IndividualService } from '../../individual/individual.service';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DoctorService } from '../../doctor/doctor.service';
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

@Component({
  selector: 'app-patient-detail-by-doctor',
  templateUrl: './patient-detail-by-doctor.component.html',
  styleUrls: ['./patient-detail-by-doctor.component.css'],
  providers: [DateFormatPipe]
})
export class PatientDetailByDoctorComponent implements OnInit {
  @ViewChild('showChart') showChart: TemplateRef<any>;
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  @ViewChild('noteModal') noteModal: TemplateRef<any>;
  prescriptionForm: FormGroup;
  doctorNoteForm: FormGroup;
  prescriptionId: "";
  appointmentRefNo: any;
  narrationForm: any;
  observationForm: any = [];
  diagnosisForm: any = [];
  adviceForm: any = [];
  labTestForm: any = [];
  medicationForm: any = [];
  vitalForm: any = [];
  noteForm: any;
  referralForm: any;

  modalRef: BsModalRef;
  userProfileData: any;
  domSanitizer: any;
  patientProfileImageSrc = "";
  age: any;
  pastPrescription: any = [];
  appRefNo: any;
  refferedName: any = null;
  previewPrescriptionData: any;
  doctorNoteList: any;
  doctorPk: any;
  userpk: any;
  selectedPatientRefNo: string;
  ms_userPk: any;
  returnUrl: any;
  medicalDetailsList: any[] = [];//taking any arr to store medical details json response
  chartData: any = {};//to store graph value
  config = {
    // class: 'custom-modal-width modal-lg',
    // backdrop: true,
    // ignoreBackdropClick: true
    class: 'modal-lg',
  };
  loggedInUser: any;
  allergyList: any = [];
  procedureHistoryList: any = [];
  diseaseHistoryList: any = [];
  recentMedicationList: any =[];
  uploadForm: FormGroup;
  @ViewChild('testReportsUpload') testReportsUpload: TemplateRef<any>;//to upload doc by modal
  userRefNo: string;
  results: any = [];
  maxDate: any;
  //Working on app/issues/731
  screenFlag: any = "patient";
  //Working on app/issues/731

  constructor(private individualService: IndividualService, private broadcastService: BroadcastService, private _domSanitizer: DomSanitizer, private modalService: ModalService,
    private router: Router, private apiService: ApiService,
    private _doctorService: DoctorService, private dateFormatPipe: DateFormatPipe, private bsModalService: BsModalService, private fb: FormBuilder, private route: ActivatedRoute,
    private _location: Location, private frb: FormBuilder,private http: HttpClient, private toastService: ToastService) {
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
      doctorRefNo: [this.loggedInUser.refNo],
      patientRefNo: [this.selectedPatientRefNo]
    });

  }

  ngOnInit() {
    // let user_pk;
    //    this.route.queryParams.subscribe((params) => {
    //     this.returnUrl = params.returnUrl;
    // });
    let refno = this.route.snapshot.paramMap.get('refno');
    this.selectedPatientRefNo = refno;
    let user = JSON.parse(localStorage.getItem('user'));
    this.userRefNo = user.refNo;
    this.maxDate = new Date();
    this.doctorPk = user.id;
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    
    //Commented for Working on app/issues/731
    // this.getAllergyList(this.selectedPatientRefNo);
    // this.getProcedureHistoryList(this.selectedPatientRefNo);
    // this.getDiseaseHistoryList(this.selectedPatientRefNo);
    // this.getRecentMedicationList(this.selectedPatientRefNo);
    // //this.getPastPrescriptionV2(refno, this.loggedInUser.refNo);
    // this.getPastPrescriptionV3(refno, this.loggedInUser.refNo);
    // this.getPatientDetailsByRefNo(refno);
    // this.openNoteList(refno, this.loggedInUser.refNo);
    //End Commented for Working on app/issues/731

    //debugger;
    this._doctorService.getUserPkByRefno(refno).subscribe(data => {
      // sbis-poc/app/issues/721
      localStorage.setItem("patientDetails", JSON.stringify(data.data));
      // user_pk=data.data.id;
      this.userpk = data.data.id;

      this.ms_userPk = data.data.userId;
      //this.userProfileData = data.data;
      //  this.loadProfileImage( this.ms_userPk);
      //  this.getPastPrescription(this.userpk,this.doctorPk);
      //  this.openNoteList(this.userpk,this.doctorPk);
      
      //Commented for Working on app/issues/731
      //this.loadUserMedicalRecords(this.selectedPatientRefNo);//this.userpk);
      //End Commented for Working on app/issues/731

      //  if(data.data.dateOfBirth!=null){
      //   const bdate = new Date(data.data.dateOfBirth);
      //   const timeDiff = Math.abs(Date.now() - bdate.getTime() );
      //   this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      //  }else{
      //   this.age="Not Specified"
      //  }
    })



    //this.createForm();
  }

/************************************************************
 * This screen  is modified two different commonent
 * <app-patient-details> and <app-treatment-history>.
 * All the related functions are moved to those components.
 * ********************************************************* */
  //Commented for Working on app/issues/731


//   getAllergyList(userRefNo){
//     this.individualService.getAllergyHistory(userRefNo).subscribe((result) => {
// 			if (result.status === 2000) {
//         console.log("================Allergy History================");
//         console.log(result.data);
// 				this.allergyList = result.data;
// 			}
// 		});
//   }
//   getProcedureHistoryList(userRefNo){
//     this.individualService.getProcedure(userRefNo).subscribe((result) => {
// 			if (result.status === 2000) {
//         console.log("================Procedure History================");
//         console.log(result.data);
// 				this.procedureHistoryList = result.data;
// 			}
// 		});
//   }
//   getDiseaseHistoryList(userRefNo){
//     this.individualService.getDisease(userRefNo).subscribe((result) => {
// 			if (result.status === 2000) {
//         console.log("================Disease History================");
//         console.log(result.data);
// 				this.diseaseHistoryList = result.data;
// 			}
// 		});
//   }
//   getRecentMedicationList(userRefNo){
//     let payload={
//       "userRef": userRefNo
//     }
//     this._doctorService.getRecentMedicationByUserRefNo(payload).subscribe((result) => {
// 			if (result.status === 2000) {
//         console.log("================Recent Medication================");
//         console.log(result.data);
// 				this.recentMedicationList = result.data;
// 			}
// 		});
//   }

//   getPatientDetailsByRefNo(userRefNo) {
//     let payload = {
//       refNo: userRefNo
//     }
//     this._doctorService.getPatientDetailsByRefNo(payload).subscribe(data => {
//       console.log("================USER DETAILS================");
//       console.log(data['data']);

//       this.userProfileData = data['data'];
//       if (data['data'].dateOfBirth != null) {
//         const bdate = new Date(data['data'].dateOfBirth);
//         const timeDiff = Math.abs(Date.now() - bdate.getTime());
//         this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
//       }
//       let roleName = localStorage.getItem("roleName");
//       let path: string =data['data'].refNo + "/" + roleName;//neew add to download profile pic
//       this.apiService.DownloadProfilePic.getByPath(path).subscribe(result => {
//         if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
//           this.patientProfileImageSrc = "data:image/jpeg;base64," + result.data;
//         }
//       });

//     });
//   }

//   getPastPrescriptionV2(userRefNo, doctorRefNo) {
//     let payload = {
//       doctorRefNo: doctorRefNo,
//       userRefNo: userRefNo,
//     }
//     this._doctorService.getPastPrescriptionApiV2(payload)
//       .subscribe(data => {
//         this.pastPrescription = data.data;
//         for (let pp of this.pastPrescription) {
//           pp.prescriptionDateFormatted = this.dateFormatPipe.transform(pp.prescriptionDate);
//         }
//         console.log("getPastPrescriptionApi", data.data);
//       },
//         (error) => {
//           alert("Internal Server Problem");
//           return;
//         });
//   }

//   getPastPrescriptionV3(userRefNo, doctorRefNo) {
//     let payload = {
//       doctorRefNo: doctorRefNo,
//       userRefNo: userRefNo,
//     }
//     this._doctorService.getPastPrescriptionApiV3(payload)
//       .subscribe(data => {
//         this.pastPrescription = data.data;
//         console.log("getPastPrescriptionApi", data.data);
//       },
//         (error) => {
//           alert("Internal Server Problem");
//           return;
//         });
//   }


//   openNoteList(userRefNo, doctorRefNo) {
//     let payload = {
//       doctorRefNo: doctorRefNo,
//       userRefNo: userRefNo
//     }
//     this._doctorService.getAllPastNoteV2(payload).subscribe(data => {
//       if (data['status'] == '2000') {
//         this.doctorNoteList = data['data'];
//         console.log(this.doctorNoteList);

//       }
//     });
//     console.log(this.doctorNoteList);
//     // this.modalRef = this.bsModalService.show(this.noteModal, this.config);
//   }

//   loadUserProfile(user_pk) {
//     this.individualService.getUserFullProfile(user_pk).subscribe((result) => {
//       if (result.status === 2000) {
//         this.userProfileData = result.data;
//         console.log(result);
//         if (result.data.dateOfBirth != null) {
//           const bdate = new Date(result.data.dateOfBirth);
//           const timeDiff = Math.abs(Date.now() - bdate.getTime());
//           this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
//         } else {
//           this.age = "Not Specified"
//         }

//       }
//     });
//   }

//   loadProfileImage(ms_userPk) {
//     this.patientProfileImageSrc = "";
//     this.individualService.downloadProfilePhoto(ms_userPk).subscribe(result => {
//       console.log("patientProfileImageSrc", result);
//       if (result.status === 2000 && result.data != null && result.data.length > 0) {
//         this.patientProfileImageSrc = "data:image/jpeg;base64," + result.data;

//       }

//     })
//   }

//   getPastPrescription(user_pk, doctorPk) {

//     this._doctorService.getPastPrescriptionApi(user_pk, doctorPk, 0)
//       .subscribe(data => {
//         console.log("getPastPrescriptionApi", data.data);
//         this.pastPrescription = data.data;
//         for (let pp of this.pastPrescription) {
//           pp.prescriptionDateFormatted = this.dateFormatPipe.transform(pp.prescriptionDate);
//         }

//       },
//         (error) => {
//           alert("Internal Server Problem");
//           return;
//         });
//   }

//   openPrescriptionModal(pp) {
//     this.appRefNo = pp.appointmentRefNo
//     //this.router.navigate(['/doctor/prescriptionpreview', pp.appointmentRefNo]);
//     this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, this.config);
//   }



//   createPrescriptionForm() {
//     this.prescriptionForm = this.fb.group({
//       prescriptionPk: [],
//       prescriptionDate: [],
//       visitPk: [0],
//       doctorPk: [this.doctorPk],
//       nextCheckUpDate: [],
//       medicalFindingsList: [],
//       observationList: [],
//       doctorRecommendedTestList: [],
//       patientProblemNarration: [],
//       diagnosisList: [],
//       medicationDTOList: [],
//       adviceList: [],
//       doctorNote: [],
//       doctorReferral: [],
//       status: ["NRM"],
//       userPk: [this.userpk],
//       appointmentPk: [0],
//       isDraft: ["Y"],
//       createdDate: [],
//       createdBy: [],
//       modifiedDate: [],
//       modifiedBy: [],
//       observationFormDirty: false,
//       medicationFormDirty: false,
//       adviceFormDirty: false,
//       diagnosisFormDirty: false,
//       testFormDirty: false,
//       vitalFormDirty: false,
//       prescriptionFormDirty: false,
//       noteFormDirty: false,
//       referralFormDirty: false,
//       reportReviewDate: []
//     });

//   }
//   populatePrescriptionForm(res) {
//     this.narrationForm = res.patientProblemNarration;
//     this.observationForm = res.observationList;
//     this.adviceForm = res.adviceList;
//     this.diagnosisForm = res.diagnosisList;
//     this.labTestForm = res.doctorRecommendedTestList;
//     this.medicationForm = res.medicationDTOList;
//     this.vitalForm = res.medicalFindingsList;
//     this.noteForm = res.doctorNote;
//     this.referralForm = res.doctorReferral;
//     this.refferedName = res.doctorReferral != null ? res.doctorReferral.referredName : null;
//     this.prescriptionForm = this.fb.group({
//       prescriptionPk: [res.prescriptionPk],
//       prescriptionDate: [res.prescriptionDate],
//       visitPk: [0],
//       nextCheckUpDate: [res.nextCheckUpDate != null ? new Date(res.nextCheckUpDate) : null],
//       medicalFindingsList: [res.medicalFindingsList],
//       observationList: [res.observationList],
//       doctorRecommendedTestList: [res.doctorRecommendedTestList],
//       patientProblemNarration: [res.patientProblemNarration],
//       diagnosisList: [res.diagnosisList],
//       medicationDTOList: [res.medicationDTOList],
//       adviceList: [res.adviceList],
//       doctorNote: [res.doctorNote],
//       doctorReferral: [res.doctorReferral],
//       status: [res.status],
//       userPk: [this.userpk],
//       doctorPk: [this.doctorPk],
//       appointmentPk: [0],
//       isDraft: [res.isDraft],
//       createdDate: [res.createdDate],
//       createdBy: [res.createdBy],
//       modifiedDate: [res.modifiedDate],
//       modifiedBy: [res.modifiedBy],
//       observationFormDirty: false,
//       medicationFormDirty: false,
//       adviceFormDirty: false,
//       diagnosisFormDirty: false,
//       testFormDirty: false,
//       vitalFormDirty: false,
//       prescriptionFormDirty: false,
//       noteFormDirty: false,
//       referralFormDirty: false,
//       reportReviewDate: [res.reportReviewDate != null ? new Date(res.reportReviewDate) : null],
//     });
//     //this.autoSaveTimer();
//   }

//   getPrespription() {
//     this._doctorService.getPrescriptionByAppoRefNo(this.appointmentRefNo).subscribe(data => {
//       console.log(data['data']);
//       if (data['data'] != null) {
//         this.populatePrescriptionForm(data['data']);
//       }
//       else {
//         //this.createPrescriptionForm();
//         //this.autoSaveTimer();
//       }

//     });
//   }

//   previewPrescription() {
//     // this.prescriptionForm = this.fb.group({
//     //   nextCheckUpDate: this.prescriptionForm.controls.nextCheckUpDate.value,
//     //   prescriptionVitalForm: this.prescriptionVitalForm,
//     //   observationList: this.prescriptionObservationForm,
//     //   testList: this.prescriptionTestForm,
//     //   narration: this.prescriptionNarrationForm,
//     //   diagnosisList: this.prescriptionDiagnosisForm,
//     //   medicationList: this.prescriptionMedicationForm,
//     //   adviseList: []
//     // });
//     if (this.prescriptionForm.value.adviceList == null && this.prescriptionForm.value.diagnosisList == null
//       && this.prescriptionForm.value.doctorRecommendedTestList == null && this.prescriptionForm.value.medicalFindingsList == null
//       && this.prescriptionForm.value.medicationDTOList == null && this.prescriptionForm.value.nextCheckUpDate == null
//       && this.prescriptionForm.value.observationList == null && (this.prescriptionForm.value.patientProblemNarration == null
//         || this.prescriptionForm.value.patientProblemNarration == "") && this.prescriptionForm.value.doctorNote == null
//       && this.prescriptionForm.value.doctorReferral == null) {
//       // this._toastService.showToast(404, "Please fill anything on Prescription...");
//       //this._toastService.showI18nToast("Please fill anything on Prescription...", "error");
//     }
//     else {
//       this.previewPrescriptionData = this.prescriptionForm.value;
//       console.log("previewPrescriptionData", this.prescriptionForm.value);
//       // this.previewScreen = true;
//       this.broadcastService.setHeaderText("Prescription Preview");
//     }
//   }

//   // openNoteList(user_pk,doctorPk){
//   //   this._doctorService.getAllPastNote(doctorPk , user_pk).subscribe(data => {
//   //     if(data['status']=='2000'){
//   //       this.doctorNoteList = data['data'];
//   //     }
//   //   });
//   //   console.log(this.doctorNoteList);   
//   //   //this.modalRef = this.bsModalService.show(this.noteListModal, this.config);
//   // }

//   //method to open chart modal
//   showHealthAttributeProgress(medicalDetail, id) {
//     this.chartData = {};
//     this.modalService.open(id);
//     let queryForChart = {
//       refNo: this.selectedPatientRefNo,
//       attributeId: medicalDetail.attributeId,
//       startDate: medicalDetail.startDate,
//       endDate: medicalDetail.endDate
//     }
//     let queryForChartBpDia = {};
//     if (medicalDetail.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
//       queryForChart.attributeId = medicalDetail.attributeBPSysId;
//       queryForChartBpDia['refNo'] = this.selectedPatientRefNo;//this.user_id;
//       queryForChartBpDia['attributeId'] = medicalDetail.attributeBPDiaId;
//       queryForChartBpDia['startDate'] = medicalDetail.startDate;
//       queryForChartBpDia['endDate'] = medicalDetail.endDate;
//     }
//     //console.log(queryForChart);
//     let labelsArray: string[] = [];
//     let dataArray = [];//to store all result value for chart
//     let referenceRangeToValArr = [];//to store all refRange to values
//     let referenceRangeFromValArr = [];//to store all ref range from values
//     this.individualService.loadMedicalAttributeDataForChart(queryForChart).subscribe((data) => {
//       //console.log(data.data);
//       if (data.status === 2000) {
//         let resArrOfChartData = data.data;
//         resArrOfChartData.reverse();
//         resArrOfChartData.forEach(function (x) {
//           let mydate = new Date(x['dateStr']);
//           let year = mydate.getFullYear();
//           let month = (1 + mydate.getMonth()).toString();
//           month = month.length > 1 ? month : '0' + month;
//           let day = mydate.getDate().toString();
//           day = day.length > 1 ? day : '0' + day;
//           // labelsArray.push(month + '/' + day + '/' + year);
//           labelsArray.push(day + '-' + month + '-' + year);
//           dataArray.push(x['result']);
//           x['referenceRangeFrom'] ? referenceRangeFromValArr.push(x['referenceRangeFrom']) : null;
//           x['referenceRangeTo'] ? referenceRangeToValArr.push(x['referenceRangeTo']) : null;

//         });
//         let label = medicalDetail.longName;
//         if (medicalDetail.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
//           this.individualService.loadMedicalAttributeDataForChart(queryForChartBpDia).subscribe((res) => {
//             if (res.status == 2000) {
//               let dataArrForDia: any[] = [];
//               let refRangeFromValArrForBPDia: any[] = [];
//               let refRangeToValArrForBPDia: any[] = [];
//               res.data.reverse();
//               res.data.forEach(function (x) {
//                 dataArrForDia.push(x['result']);
//                 x['referenceRangeFrom'] ? refRangeFromValArrForBPDia.push(x['referenceRangeFrom']) : null;
//                 x['referenceRangeTo'] ? refRangeToValArrForBPDia.push(x['referenceRangeTo']) : null;
//               });
//               this.chartData = {
//                 labels: labelsArray,
//                 datasets: [{
//                   label: medicalDetail.bpSysLongName,//attributeBPSysId,
//                   data: dataArray,
//                   fill: false,
//                   borderColor: '#4bc0c0'
//                 },
//                 {
//                   label: medicalDetail.bpDiaLongName,//attributeBPDiaId,
//                   data: dataArrForDia,
//                   fill: false,
//                   borderColor: '#565656'
//                 }]
//               }//end of chartdata
//               referenceRangeToValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME + ')', referenceRangeToValArr) : null;
//               referenceRangeFromValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME + ')', referenceRangeFromValArr) : null;
//               refRangeToValArrForBPDia.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME + ')', referenceRangeToValArr) : null;
//               refRangeFromValArrForBPDia.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME + ')', referenceRangeFromValArr) : null;

//             }//end of if status check            
//           });
//         } else {
//           this.chartData = {
//             labels: labelsArray,
//             datasets: [{
//               label: label,
//               data: dataArray,
//               fill: false,
//               borderColor: '#4bc0c0'
//             }]
//           }//end of chartdata
//           referenceRangeToValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To', referenceRangeToValArr) : null;
//           referenceRangeFromValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From', referenceRangeFromValArr) : null;
//         }//end of else bp check
//       }//end of res status match
//     });//end of wscall
//   }//end of method
//   //to build chartData if ref range arr is available
//   buildChartDataByRefRangeArr(refRangeChartLebelName, refRangeArr) {
//     let refRangeJson: any = {};
//     refRangeJson.label = refRangeChartLebelName;
//     refRangeJson.data = refRangeArr;
//     refRangeJson.fill = false;
//     refRangeJson.borderColor = 'green';
//     this.chartData.datasets.push(refRangeJson);
//   }//end of build chart data

//   loadUserMedicalRecords(userRefNo) {
//     this._doctorService.getUserVitalMedicalAttributes(userRefNo).subscribe((result) => {
//       if (result.status == 2000) {
//         let medDetList = result.data;
//         this.medicalDetailsList = result.data;
//         // this.medicalDetailsList = medDetList;
//         this.modifyMedicalDetailDisplayArrWithBP(medDetList);
//       }
//     });
//   }//end of method

//   /**
//  * modifyMedicalDetailDisplayArrWithBP ==> method to modify medical detail array
//  */
//   public modifyMedicalDetailDisplayArrWithBP(medDetList) {
//     // console.log("medDetList", medDetList);
//     //debugger;
//     this.medicalDetailsList = medDetList.filter(clbckFn => clbckFn.parentName != SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME);
//     let bpDiaObj: any = medDetList.find(findElOfDia => findElOfDia.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME);
//     let bpSysObj: any = medDetList.find(findElOfSys => findElOfSys.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME);
//     let bpObj: any = {
//       attributeBPDiaId: bpDiaObj.attributeId,
//       attributeBPSysId: bpSysObj.attributeId,
//       createdDate: bpDiaObj.createdDate,
//       endDate: bpDiaObj.endDate ? bpDiaObj.endDate : null,
//       bpSysLongName: bpSysObj.longName,
//       bpDiaLongName: bpDiaObj.longName,
//       longName: bpDiaObj.parentName,
//       parentName: bpDiaObj.parentName,
//       valueOfDia: bpDiaObj.result,
//       valueOfSys: bpSysObj.result,
//       result: bpSysObj.result + "/" + bpDiaObj.result,
//       shortNameForBPDia: bpDiaObj.shortName ? bpDiaObj.shortName : null,
//       source: bpDiaObj.source,
//       startDate: bpDiaObj.startDate ? bpDiaObj.startDate : null,
//       triggerPk: bpDiaObj.triggerPk ? bpDiaObj.triggerPk : null,
//       unitName: bpDiaObj.unitName,
//       userPk: null,
//       medicalFindingsPkForDia: bpDiaObj.medicalFindingsPkForDia,
//       medicalFindingsPkForSys: bpDiaObj.medicalFindingsPkForSys
//     }
//     if (bpDiaObj || bpSysObj) {
//       this.medicalDetailsList.push(bpObj);
//     }
//   }//end of method

//   closeNewModal(id) {
//     this.modalService.close(id);
//   }//end of method

//   newPrescription() {
//     this.router.navigate(['doctor/createPrescription']);
//   }



//   openNoteModal() {
//     //this.modalService.open(id);
//     this.createForm();
//     this.modalRef = this.bsModalService.show(this.noteModal, this.config);
//   }

//   closeModal() {
//     this.modalRef.hide();
//   }


//   saveNote() {
//     //debugger;
//     console.log(this.doctorNoteForm.value);
//     this._doctorService.saveDoctorNote(this.doctorNoteForm.value).subscribe(data => {
//       console.log("NoteForm", data);
//       this.modalRef.hide();
//       this.doctorNoteForm.patchValue({
//         note: ""
//       });
//       // this.openNoteList(this.userpk,this.doctorPk);
//       this.openNoteList(this.selectedPatientRefNo, this.loggedInUser.refNo);

//     },
//       (error) => {
//         alert("Internal Server Problem");
//         return;
//       });

//   }

//   back() {
//     //this.router.navigateByUrl(this.returnUrl);
//     //this.router.navigate(['searchPatientByDoctor']);
//     this._location.back();
//     //window.history.back();
//   }

//   onUploadModal() {
//     this.uploadForm.patchValue({
//       'documents': null
//     });
//     this.uploadForm.reset();
//     // this.uploadForm.controls.date.setValue(new Date());
//     this.uploadForm.controls.fileUploadFor.setValue(SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS);
//     this.modalRef = this.bsModalService.show(this.testReportsUpload, { class: 'modal-lg' });
//   }//end of method

//   onSubmit() {
//     this.uploadForm.patchValue({
//       isSubmit: true
//     });

//     if (this.uploadForm.invalid) {
//       return;
//     }
//     let valueData = this.uploadForm.value;

//     let formdata = new FormData();
//     let prescriptionFileUpload = new Blob([JSON.stringify({
//       "forRefNo": this.selectedPatientRefNo,
//       "byRefNo": this.userRefNo,
//       // "doctorName": valueData.doctorName,
//       //"testName": valueData.testName.longName,
//       "fileUploadFor": valueData.fileUploadFor,
//       //"date": valueData.date
//     })], {
//         type: "application/json"
//       });

//     formdata.append('file', valueData.file);
//     formdata.append('document', prescriptionFileUpload);


//     this.saveDocument(formdata).subscribe(event => {
//       if (event instanceof HttpResponse) {
//         let response = JSON.parse(event.body);
//         if (response.status == 2000) {
//           this.modalRef.hide();
//           this.toastService.showI18nToast('MY_PRESCRIPTION_TOAST.TEST_REPORT_UPLOADED', 'success');
//         } else {
//           this.toastService.showI18nToast(response.message, 'error');
//         }
//       }
//     });
//   }

//   saveDocument(formData: any): Observable<any> {
//     let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
//       // reportProgress: true,
//       responseType: 'text'
//     });
//     return this.http.request(req);
//     //return this.apiService.UploadProfiePhoto.upload(formData);
//   }

//   search(event) {
//     if (event.query.length < 4) {
//       this.results = [];
//       return;
//     }
//     this._doctorService.getLabTestList(event.query).subscribe((data) => {
//       this.results = data.data;
//     });
//   }//end of method

//   prescriptionFileSelected(event) {
//     let fileEvent = event.target.files[0];
//     if(fileEvent.type == "application/pdf") {
//       //do nothing
//     } else {
//       this.toastService.showI18nToast("File type should be pdf", "warning");
//       return;
//     }
//     if(fileEvent.size > 2000000) {
//       this.toastService.showI18nToast("File size will not more then 2mb", "warning");
//       return;
//     }
//     this.uploadForm.patchValue({
//       file: event.target.files[0]
//     });
//   }

//End Commented for Working on app/issues/731

/************************************************************
 * ************************End*******************************
 * This screen  is modified two different commonent
 * <app-patient-details> and <app-treatment-history>.
 * All the related functions are moved to those components.
 * ********************************************************* */


}
