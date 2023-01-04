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
import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { IndividualService } from 'src/app/modules/individual/individual.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { DomSanitizer } from '@angular/platform-browser';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from 'src/app/core/services/toast.service';
@Component({
  selector: 'app-other-treatment-history-of-patient',
  templateUrl: './other-treatment-history-of-patient.component.html',
  styleUrls: ['./other-treatment-history-of-patient.component.css']
})
export class OtherTreatmentHistoryOfPatientComponent implements OnInit {


  @Input() patientRefNo: any; 
  prescriptionListToview: any[] =[];
  errorMsgObj: any = {
    prescriptionNotFoundFlag: false,
    testReportNotFoundFlag: false
  };
  SBISConstantsRef = SBISConstants;

  download = {
    downloadImageSrc: "",
    contentType: "",
    doctorName: "",
    forUserName: ""
  };
  prescriptionFor: any;
  appRefNo: any; prescription: any;
  prescriptionSBIS: any = false;
  modalRef: BsModalRef;
  
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  prescriptionRefNo: any;
  testReportsListToView: any[]=[];

  constructor(private individualService: IndividualService,
    private toastService: ToastService,
    private bsModalService: BsModalService, private domSanitizer: DomSanitizer,) { }//end of constructor

  ngOnInit() {
    if(this.patientRefNo)
      this.othertreatmentHistoryOfPAtientWSCall(this.patientRefNo);
  }//end of oninit


  othertreatmentHistoryOfPAtientWSCall(patientRefNo: any) {
    let payload:string =  "userRefNo="+patientRefNo;
    this.errorMsgObj.prescriptionNotFoundFlag = false;
    this.errorMsgObj.treatmentHistoryNotFoundFlag = false;
    this.otherPrescriptionOFPAtientWSCall(payload);
    this.otherTestReportOfPatientWSCall(payload);
  }//end of method

  otherTestReportOfPatientWSCall(payload: string) { 
    this.individualService.getOtherTestReportOfPatient(payload).subscribe(res=>{
      if(res.status == 2000){
        this.testReportsListToView = res.data? res.data.ownTestReports : [];
         this.errorMsgObj.testReportNotFoundFlag = (this.testReportsListToView.length == 0)? true: false;
      }
      else
        this.errorMsgObj.testReportNotFoundFlag = true;
    },err=>{
      this.errorMsgObj.testReportNotFoundFlag = true;
    });
  }//end of method

  otherPrescriptionOFPAtientWSCall(payload: string) {
    this.individualService.getOtherPrescriptionsOfPatient(payload).subscribe(res=>{
      if(res.status == 2000){
        this.prescriptionListToview = res.data? res.data.ownPrescriptions : [];
        this.errorMsgObj.prescriptionNotFoundFlag = (this.prescriptionListToview.length == 0)? true: false;
      }
      else
        this.errorMsgObj.prescriptionNotFoundFlag = true;
    },err=>{
      this.errorMsgObj.prescriptionNotFoundFlag = true;
    });
  }//end of method



  testReportDisplayModalFlag: boolean = false;
  openPrescription(prescription: any,forPrescription:boolean) {
    this.testReportDisplayModalFlag = forPrescription? false: true;
    this.download.downloadImageSrc = '';
    this.download.contentType = '';
    this.download.doctorName = prescription.doctorName;
    this.download.forUserName = prescription.forUserName;
    if (prescription.source == 'SBIS') {
      this.prescriptionSBIS = true;
      this.prescription = prescription;
      this.prescriptionRefNo = prescription.prescriptionRefNo;
      this.appRefNo = prescription.appointmentRefNo;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    } else {
      this.prescriptionSBIS = false;
      this.downloadPrescription(forPrescription? prescription.prescriptionRefNo: prescription.documentRefNo,forPrescription);
    }
  }//end of method

  downloadPrescription(prescriptionRefNo,forPrescription:boolean) {
    let query = {
      'downloadFor': forPrescription? SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION: SBISConstants.DOCUMENT_TYPE_CONST.TEST_REPORTS,
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
  }//end of method

}//end of class
