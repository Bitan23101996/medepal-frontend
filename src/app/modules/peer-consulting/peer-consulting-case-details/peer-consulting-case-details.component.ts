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
import { GetSet } from '../../../core/utils/getSet';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { PeerConsultingService } from '../peer-consulting.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-peer-consulting-case-details',
  templateUrl: './peer-consulting-case-details.component.html',
  styleUrls: ['./peer-consulting-case-details.component.css']
})
export class PeerConsultingCaseDetailsComponent implements OnInit {

  peerConsultingCaseDetails: any;
  myOpinion: any;
  userRefNumber: any;
  uploadForm: FormGroup;
  selectedFiles: any;
  isUpload: any = false;
  modalRef: BsModalRef;
  download={
    downloadImageSrc : "",
    contentType:"",
    doctorName:"",
    forUserName:""
  }
  domSanitizer: any;
  accordianHeader: any = false;
  patientDiagnosisDetailsArr: any[] = [];
  userName: any;
  ownStatus: any;
  otherStatus: any;

  @ViewChild('peerConsultingDownloadedFilePreview') peerConsultingDownloadedFilePreview: TemplateRef<any>;

  constructor(
    private broadcastService: BroadcastService,
    private peerConsultingService: PeerConsultingService,
    private toastService: ToastService,
    private frb: FormBuilder,
    private http: HttpClient,
    private bsModalService: BsModalService,
    private _domSanitizer: DomSanitizer,
    private translate: TranslateService,
    private _location: Location
  ) {
    // this language will be used as a {{ 'LOGIN.LOGIN_HEADER' | translate }}llback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn{{ 'LOGIN.LOGIN_HEADER' | translate }} available, it will use the current loader to get them
    translate.use('en');

    this.domSanitizer = _domSanitizer;
    this.uploadForm = frb.group({
      'doctorName': [null, [Validators.required]],
      'forUserPk': [null, [Validators.required]],
      'file': [null, [Validators.required]],
      'documents': [null],
      'date': [new Date()],
      'fileUploadFor': ['PRESCRIPTION'],
      'isSubmit': [false]
    });
  }

  ngOnInit() {
    this.broadcastService.setHeaderText('Peer Consulting Case Details');
    let user = JSON.parse(localStorage.getItem('user'));
    this.userRefNumber = user.refNo;
    this.userName = user.firstName;
    let peerData = GetSet.getPeerConsultingCaseDetails();
    this.peerConsultingCaseDetails = JSON.parse(peerData);
    this.patientDiagnosisDetails();
	
	if(localStorage.getItem('status') != null){
		//let consultingStatus = localStorage.getItem('status');
		this.ownStatus = false;
		this.otherStatus = true;
	}else{
		this.ownStatus = true;
		this.otherStatus = false;
	}
	localStorage.removeItem('status');	
  }

  setPeerConsultingComment() {
    let query = {
      "consultingPanelRefNo": this.peerConsultingCaseDetails.peerConsultingRefNo,
      "userRefNo": this.userRefNumber,
      "userType": "DOCTOR",
      "message": this.myOpinion
    }
    if(this.isUpload == true) {// comment with attached document
      this.onSubmit(query);
    } else { // only comment
      this.peerConsultingService.peerConsultingComment(query).subscribe((result) => {
        if(result.status == 2000) {
          this.peerConsultingCaseDetails.comments.push(result.data);
          this.myOpinion = "";
          this.isUpload = false;
          this.myOpinion = "";
          this.uploadForm.reset();
          this.selectedFiles = "";
          this.toastService.showI18nToast("successfull", 'success');
        }
      });
    }
    
  }

  onSubmit(query) {
    let valueData = this.uploadForm.value;

    let formdata = new FormData();
    let prescriptionFileUpload = JSON.stringify({
      "pcPanelRefNo": this.peerConsultingCaseDetails.peerConsultingRefNo,
      "userRefNo": this.userRefNumber,
      "userType": "DOCTOR",
      "commentMessage": this.myOpinion,
      "fileUploadFor": "PC_COMMENT_DOC"
     });

    formdata.append('file', valueData.file);
    formdata.append('document', prescriptionFileUpload);


    this.uploadDocumentWithComment(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.myOpinion = "";
          this.uploadForm.reset();
          this.selectedFiles = "";
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  uploadDocumentWithComment(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {      
      responseType: 'text'
    });
    return this.http.request(req);   
  }

  peerConsultingFileSelected(event) {
    let fileEvent = event.target.files[0];
    if((fileEvent.type == "image/jpeg") || (fileEvent.type == "application/pdf") || (fileEvent.type == "image/png")) {
      //do nothing
    } else {
      this.toastService.showI18nToast("File type should be jpg/png/pdf", "warning");
      return;
    }
    if(fileEvent.size > 2000000) {
      this.toastService.showI18nToast("File size will not more then 2mb", "warning");
      return;
    } 
    this.uploadForm.patchValue({
      file: event.target.files[0]
    });
    this.selectedFiles = fileEvent.name;
    this.isUpload = true;
  }

  peerConsultingCommentDocDownload(comment) {

    if( comment.docs.length <=0)
      return;
    let query = {
      "downloadFor": "PC_COMMENT_DOC",
      "documentRefNo": comment.docs[0].documentRefNo
    }
    this.peerConsultingService.peerConsultingDownloadFile(query).subscribe((result) => {
      if(result.status == 2000) {
        //do nothing
        this.download.contentType=result.data.contentType;
        this.download.downloadImageSrc = "data:"+result.data.contentType+";base64," + result.data.data;
        this.modalRef = this.bsModalService.show(this.peerConsultingDownloadedFilePreview, { class: 'modal-lg' });
      }
    });
 
  }

  accordianHeaderClick() {
    if(this.accordianHeader == false) {
      this.accordianHeader = true;
    } else {
      this.accordianHeader = false;
    }
  }

  backClicked() {
    this._location.back();
  }

  patientDiagnosisDetails() {
    this.peerConsultingService.patientDiagnosisDetails(this.peerConsultingCaseDetails.doctorRefNo+"/"+this.peerConsultingCaseDetails.patientRefNo).subscribe((resp) => {
      if(resp.status == 2000) {
		  resp.data.sort((a, b) => {
            const d1 = new Date(a.prescriptionDt);
            const d2 = new Date(b.prescriptionDt);
            return (d2.getTime() - d1.getTime());
        });
		 // console.log(resp);
        this.patientDiagnosisDetailsArr = resp.data;
        for(let date of this.patientDiagnosisDetailsArr){
          date['peerConsDt'] = new Date(date.prescriptionDt);
        }
      }
    })
  }

}
