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

import { Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { ServiceProviderService } from '../service-provider.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { Router, Route } from '@angular/router';
import { HttpClient, HttpEvent, HttpRequest,HttpResponse, HttpEventType } from '@angular/common/http';
import { ToastService } from './../../../core/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit {

  provider = "PHARMACY";
  userData: any;
  user_id = 0;
  user_refno:any;

  public documentGrp: FormGroup;
  user:any;

  public doc_name = "";
  public doc_description = "";
  public documentFile: File;

  constructor(private renderer: Renderer,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private pharmacyService: ServiceProviderService,
    private toastService: ToastService,
    private _domSanitizer: DomSanitizer,
    private broadcastService: BroadcastService
  ) { }
  ngOnInit() {
    this.broadcastService.setHeaderText("Upload Documents");
    this.user = JSON.parse(localStorage.getItem('user'));
    this.user_id = this.user.userId;
    this.provider = this.user.entityName;
    this.user_refno=this.user.refNo;
    this.documentGrp = this.formBuilder.group({
      // doc_name: '',
      // doc_description: '',
      // documentFile: File,
      // items: this.formBuilder.array([this.createUploadDocuments()]),
      documents: [[]]
    });

    this.loadUser();
  
   
    
  }

  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
     // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);

    //return this.apiService.UploadProfiePhoto.upload(formData);
  }

  loadUser() {
    let request={
      "serviceProviderRef":this.user.refNo,
      "parentRoleName":this.provider
    }
    this.pharmacyService.getUserv2(request).subscribe(result => {
      if (result.status == 2000) {
        this.userData = result.data;
        
        this.loadPharmacyDetails();
      }
    });
  }

  loadPharmacyDetails() {
   var request={
     "parentRoleName":this.user.entityName,
     "serviceProviderRef":this.user_refno,
     "roleName":this.user.roleName // Working on app/issue/2042
   };
    this.pharmacyService.getDocumentByRole(request).subscribe(result => {
      console.log(result)
      if (result.status == 2000) {
        let docArray = [];
        result.data.forEach(document => {
          docArray.push({ documentRoleMapPk: document.documentRoleMapPk,
            
            documentDescription: document.documentDescription, 
            documentType: document.documentType, 
            fileName: document.documentName ? document.documentName :"" ,
            uploaded: document.spDocumentMapPk ? true : false,
            verified: document.verified,
            documentNumber:document.documentNumber,
            printInInvoice:document.printInInvoice=="Y"?true:false,
            
          })
        });
        this.documentGrp.patchValue({
          documents: docArray
        })
      }
    })
  }

  createUploadDocuments(): FormGroup {
    return this.formBuilder.group({
      doc_name: '',
      doc_description: '',
      documentFile: File,
    });
  }

  get items(): FormArray {
    return this.documentGrp.get('items') as FormArray;
  };

  addItem(): void {
    this.items.insert(0, this.createUploadDocuments())
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }
  public fileSelectionEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
      }

      this.documentFile = (fileInput.target.files[0]);



      console.log("the document  is" + JSON.stringify(fileInput.target.files[0].name));
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onUpload(doc) {
    console.log(" onUpload DOC:::",doc);
    
    let formdata: FormData = new FormData();
    formdata.append('file', doc.file);
    let documentDtoList = JSON.stringify({
      "serviceProviderPk": this.userData.serviceProviderPk,
      "fileUploadFor": "SERVICE_PROVIDER",
      "documentRoleMapPk": doc.documentRoleMapPk,
      "serviceProvider": this.userData.pharmacy ? "PHARMACY" : "HOSPITAL",
      "documentNumber":doc.documentNumber,
      "printInInvoice":doc.printInInvoice==true?"Y":"N"

    });
    formdata.append('document', documentDtoList);
    let fileName = doc.fileName;
    if(doc.file==null){
      let payload = {
        "serviceProviderPk": this.userData.serviceProviderPk,
        "fileUploadFor": "SERVICE_PROVIDER",
        "documentRoleMapPk": doc.documentRoleMapPk,
        "serviceProvider": this.userData.pharmacy ? "PHARMACY" : "HOSPITAL",
        "documentNumber":doc.documentNumber,
        "printInInvoice":doc.printInInvoice==true?"Y":"N"

      };
      this.pharmacyService.updateSpDocumentMapWithoutFile(payload).subscribe(response=>{
        this.toastService.showI18nToast("Updated Successfully", 'success');
        this.loadPharmacyDetails();
      },
      error=>{
        console.log(error);
        
      })

      
    }
    else{
      this.saveDocument(formdata).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.toastService.showToast(2000, fileName + " document has been uploaded")
          this.loadPharmacyDetails();
        }
      } )
    }
    
  }


  public OnSubmit(formValue: any) {
    // let total_form: FormData[] = [];
    this.documentGrp.value.documents.forEach(doc => {
      let formdata: FormData = new FormData();
      formdata.append('file', doc.file);
      let documentDtoList = JSON.stringify({
        "serviceProviderPk": this.userData.serviceProviderPk,
        "fileUploadFor": "SERVICE_PROVIDER",
        "documentRoleMapPk": doc.documentRoleMapPk,
        "serviceProvider": this.userData.pharmacy ? "PHARMACY" : "HOSPITAL"
      });

      formdata.append('document', documentDtoList);
      let fileName = doc.fileName;
      if(doc.file==null){
        let payload = {
          "serviceProviderPk": this.userData.serviceProviderPk,
          "fileUploadFor": "SERVICE_PROVIDER",
          "documentRoleMapPk": doc.documentRoleMapPk,
          "serviceProvider": this.userData.pharmacy ? "PHARMACY" : "HOSPITAL",
          "documentNumber":doc.documentNumber,
          "printInInvoice":doc.printInInvoice==true?"Y":"N"
    
        };
        this.pharmacyService.updateSpDocumentMapWithoutFile(payload).subscribe(response=>{
          this.toastService.showI18nToast("Updated Successfully", 'success');
          this.loadPharmacyDetails();
        },
        error=>{
          console.log(error);
          
        })
      }
      else{
        this.pharmacyService.saveDocument(formdata).subscribe(event => {
          if (event instanceof HttpResponse) {
            this.toastService.showToast(2000, fileName + " document has been uploaded")
          }
        })
      }
     
   
    });
    

    // formValue.items.forEach(element => {
    //   let upl_fom: FormData = new FormData();
    //   console.log("each element is", element);
    //   upl_fom.append('document_category', element.doc_name);
    //   upl_fom.append('document_details', element.doc_description);
    //   upl_fom.append('document_file', element.documentFile);
    //   total_form.push(upl_fom);
    // });

    // this.pharmacyService.saveFiles(total_form).subscribe(data => {
    //   console.log("result is ", data)
    // })
  }


}
