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

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../core/services/toast.service';
import { DoctorService } from '../doctor.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { HttpClient, HttpRequest } from "@angular/common/http";
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-doctor-upload',
  templateUrl: './doctor-upload.component.html',
  styleUrls: ['./doctor-upload.component.css']
})
export class DoctorUploadComponent implements OnInit {

  domSanitizer: any;
  user:any;
  signatureSrc="";
  headerImage="";
  footerImage="";

  // app#843
  prescriptionTemplateType="";
  allPrescriptionTemplates:any=[]

  constructor(private fb: FormBuilder, private translate: TranslateService,private toastService: ToastService,
    private _doctorService: DoctorService, private http: HttpClient, private route: ActivatedRoute,private _domSanitizer: DomSanitizer,
    private broadcastService: BroadcastService,
  ) {
    this.domSanitizer = _domSanitizer;
    
  }

  ngOnInit() {
    this.broadcastService.setHeaderText('Configure Prescription');
    this.user = JSON.parse(localStorage.getItem('user'));

    this.getDoctorUploadedUmages();  
    // this.getAllPrescriptionTemplates(); // app#843
  }

  getDoctorUploadedUmages(){
    var request={
      "refNo":this.user.refNo
    }

    this._doctorService.fetchUserDtls(request).subscribe(
      res => {
        console.log("res",res);
        //this.result = res;
        if(res.printGenericName!=null){
          this.showGenericFlag = res.printGenericName;
        }
        else{
          this.showGenericFlag="N";
        }
        

        if(res.signatureFilePath!=null){
         this.signatureSrc = "data:image/jpeg;base64," + res.signatureImage;
        }
        if(res.headerFilePath!=null){
        this.headerImage = "data:image/jpeg;base64," + res.headerImage;
        }
        if(res.footerFilePath!=null){
        this.footerImage = "data:image/jpeg;base64," + res.footerImage;
        }
        if (res.reportTemplateRefNo)
          this.getTemplateDetailsByTemplateId(res.reportTemplateRefNo);
      }
    )
  }

  selectSignatureFile(event: any){

    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("signaturePhoto")["value"] = "";
      this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();

    let documentDtoList = JSON.stringify({
      "fileUploadFor": "DOCTOR",
      "doctor_RefNo":this.user.refNo
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.ngOnInit();
          this.toastService.showI18nToast("DOCTOR_PROFILE.DOCTOR_PROFILE_SIGNATURE_UPLOADED" , 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  uploadHeader(event: any){
    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("headerPhoto")["value"] = "";
      this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();

    let documentDtoList = JSON.stringify({
      "fileUploadFor": "DOCTOR_PRESCRIPTION_HEADER",
      "doctor_RefNo":this.user.refNo
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.ngOnInit();
          this.toastService.showI18nToast("DOCTOR_PROFILE.DOCTOR_PROFILE_HEADER_UPLOADED" , 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  uploadFooter(event: any){

    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("footerPhoto")["value"] = "";
      this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();

    let documentDtoList = JSON.stringify({
      "fileUploadFor": "DOCTOR_PRESCRIPTION_FOOTER",
      "doctor_RefNo":this.user.refNo
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.ngOnInit();
          this.toastService.showI18nToast("DOCTOR_PROFILE.DOCTOR_PROFILE_FOOTER_UPLOADED" , 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
      responseType: 'text'
    });
    return this.http.request(req);
   
  }
  // Working on app/issues/843
  getAllPrescriptionTemplates() {   
    let currentUser=JSON.parse(localStorage.getItem('user')); 
    let payload={entityName:currentUser.entityName,userRefNo:currentUser.refNo}
    this._doctorService.getPrescriptionTemplatesByRefNo(payload).subscribe(res => {
      this.allPrescriptionTemplates=res.data;
    },
    (error) => { 
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
      return;
    });
  }

  savePrescriptionTemplateType(){
    if(this.prescriptionTemplateType.length>0){
      let currentUser=JSON.parse(localStorage.getItem('user'));
      let payload=
      {
        prescriptionTemplateFileName:this.prescriptionTemplateType,
        entityName:currentUser.entityName,
        userRefNo:currentUser.refNo,
        userName:currentUser.userName
      }
      console.log("payload::",payload);
      this._doctorService.savePrescriptionTemplate(payload)
      .subscribe(res=>{
      console.log(res);
      if(res.status==2000)
        this.toastService.showI18nToast("DOCTOR_CHAMBER_VALIDATION.SAVE_SUCCESS" , 'success');
        this.getAllPrescriptionTemplates();
        this.getTemplateDetailsByTemplateId(res.data.refNo);
      },
      (error) => { 
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        return;
      })
    }
    else{
      this.toastService.showI18nToast("DOCTOR_PROFILE.PRESCRIPTION_TEMPLATE_SELECTION_CHECK" , 'warning');
    }
  }
  getTemplateDetailsByTemplateId(templateRefNo) {
    let payload=
        {
          refNo:templateRefNo
        }
    this._doctorService.getPrescriptionTemplateById(payload)
      .subscribe(res => {
        this.prescriptionTemplateType=res.data.templateFileName;
      },
      (error) => { 
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        return;
      });
  }
  // End app/issues/843

  //
  resetDoctorSignatureHeaderFooterImage(imageType:string){
    let query: any = {
      imageType: imageType,
      drRefNo: this.user.refNo
    }
    this._doctorService.resetDoctorSignatureHeaderFooterImage(query).subscribe(res => {
      switch (imageType) {
        case "signature":{
          this.signatureSrc="";
          break;
        }    
        case "header":{
          this.headerImage = "";          
          break;
        }
        case "footer":{
          this.footerImage="";
          break;
        }
          
      }
      this.toastService.showI18nToast('TOAST_MSG.IMAGE_DELETE_SUCCESS_MSG',"success");
    },
    (error) => { 
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
      return;
    });
  }//end of method

  showGenericFlag: any;
  saveGenericFlag(event){
    
    if(event.target.checked){
      this.showGenericFlag="Y";
    }
    else{
      this.showGenericFlag="N";
    }
    let payload={
      "printGenericName": this.showGenericFlag
    }
    this._doctorService.savePrintGenericNameFlag(payload).subscribe(res => {
      if(res.status==2000){
        this.toastService.showI18nToastFadeOut("Saved Successfully","success");  
      }
    },
    (error) => { 
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
      return;
    });
  }
}
