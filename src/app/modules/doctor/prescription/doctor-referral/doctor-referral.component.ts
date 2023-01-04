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
import {  Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-doctor-referral',
  templateUrl: './doctor-referral.component.html',
  styleUrls: ['./doctor-referral.component.css', '../../prescription/prescription.component.css']
})
export class DoctorReferralComponent implements OnInit {

  @Input() referralForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  @ViewChild('referralModal') referralModal: TemplateRef<any>;
  referralData: any;
  modalRef: BsModalRef;
  doctorReferralForm: FormGroup;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  isDoctor: boolean =true;
  isHospital: boolean =false;
  submitted: boolean =false;
  hospitalNameList: any=[];
  doctorNameList: any=[];
  referralNameList: any=[];

  constructor(private fb: FormBuilder, private _doctorService: DoctorService, private bsModalService: BsModalService, private modalService: ModalService) { }

  ngOnInit() {
    if(this.referralForm==null){
      this.createForm();
    }
    else{
      this.editForm(this.referralForm);
    }

    //this.referralData = "";

    this._doctorService.doctorNameList().subscribe(data => {
      if(data['status']=='2000'){        
        this.doctorNameList = data['data'];
      }
    });

    this._doctorService.hospitalNameList().subscribe(data => {
      if(data['status']=='2000'){
        this.hospitalNameList = data['data'];
      }
    });

    
    /* ******** Auto save modification ******* */
    // If anything changed on Diagnosis Form
    this.doctorReferralForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorReferralForm.dirty){
        this.doctorReferralForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorReferralForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorReferralForm.value);
      
  })
  /* ******** End of Auto save modification ******* */

  }

  ngOnChanges() {
  /* ******** Auto save modification ******* */
  // Working on app/issues/731
  if(this.referralForm==null){
    this.createForm();
  }
  else{
    this.editForm(this.referralForm);
  }
  //End Working on app/issues/731
  
    // If anything changed on Diagnosis Form
    this.doctorReferralForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorReferralForm.dirty){
        this.doctorReferralForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorReferralForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorReferralForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }

  createForm(){
    this.doctorReferralForm = this.fb.group({
      referredName: [null],
      referralPk: [],
      referralStatus: ["NRM"],
      referralType: ['D'],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: [],
      isModified: [true]
   });
   this.referralData = this.doctorReferralForm.value;
  }

  editForm(res){
    this.doctorReferralForm = this.fb.group({
      referredName: [res.referredName],
      referralPk: [res.referralPk],
      referralStatus: [res.referralStatus],
      referralType: [res.referralType],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy],
      isModified: [false]
   });
   this.referralData = this.doctorReferralForm.value;

    if(res.referralType === 'D'){
      console.log("referralType = "+res.referralType);
      this.isDoctor = true;
      this.isHospital = false;
    }

    if(res.referralType === 'H'){
      console.log("referralType = "+res.referralType);
      this.isDoctor = false;
      this.isHospital = true;
    }
  }

  filteredReferralSingle(event) {
    let query = event.query;
    
    if(this.doctorReferralForm.value.referralType === 'D')
      this.referralNameList = this.filterReferralName(query, this.doctorNameList);
    if(this.doctorReferralForm.value.referralType === 'H')
      this.referralNameList = this.filterReferralName(query, this.hospitalNameList);
            
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

  setReferralType(referralType){
    if(referralType === 'D'){
      this.isDoctor = true;
      this.isHospital = false;
    }

    if(referralType === 'H'){
      this.isDoctor = false;
      this.isHospital = true;
    }
    
    this.doctorReferralForm.patchValue({
      referralType : referralType,
      referredName : ''
    }) 
  }

  referredNameSelect(referredName){
    this.doctorReferralForm.patchValue({
      referredName : referredName
    })
  }

  openReferralModal() {
    //this.modalService.open(id);
    this.modalRef = this.bsModalService.show(this.referralModal, this.config);
  }

  closeModal() {
    this.modalRef.hide();
  }

  saveReferral(){
    this.referralData = this.doctorReferralForm.value;
    this.getFormData.emit(this.doctorReferralForm.value);
    
    this.modalRef.hide();
  }

}
