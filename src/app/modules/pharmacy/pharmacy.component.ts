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
import { PharmacyService } from './pharmacy.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { Router, Route } from '@angular/router';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { ToastService } from './../../core/services/toast.service';


@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit {

  provider = "PHARMACY";
  userData: any;
  user_id = 0;

  public documentGrp: FormGroup;


  public doc_name = "";
  public doc_description = "";
  public documentFile: File;

  constructor(private renderer: Renderer,
    private formBuilder: FormBuilder,
    private pharmacyService: PharmacyService,
    private toastService: ToastService,
  ) { }
  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.documentGrp = this.formBuilder.group({
      // doc_name: '',
      // doc_description: '',
      // documentFile: File,
      // items: this.formBuilder.array([this.createUploadDocuments()]),
      documents: [[]]
    });

    this.loadUser();

    this.loadPharmacyDetails();

  }

  loadUser() {
    this.pharmacyService.getUser(this.user_id).subscribe(result => {
      if (result.status == 2000) {
        this.userData = result.data;
      }
    })
  }

  loadPharmacyDetails() {
    this.pharmacyService.getDocumentByRole(this.provider).subscribe(result => {
      console.log(result)
      if (result.status == 2000) {
        let docArray = [];
        result.data.forEach(document => {
          docArray.push({ documentRoleMapPk: document.documentRoleMapPk, documentDescription: document.documentDescription, documentType: document.documentType, fileName: "" })
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
    this.pharmacyService.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.toastService.showToast(2000, fileName + " document has been uploades")
      }
    })
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
      this.pharmacyService.saveDocument(formdata).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.toastService.showToast(2000, fileName + " document has been uploades")
        }
      })
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
