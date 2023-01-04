/*******************************************************************************
 * * |///////////////////////////////////////////////////////////////////////|
 * * |                                                                       |
 * * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
 * * | All Rights Reserved                                                   |
 * * |                                                                       |
 * * | This document is the sole property of StellaBlue Interactive          |
 * * | Services Pvt. Ltd.                                                    |
 * * | No part of this document may be reproduced in any form or             |
 * * | by any means - electronic, mechanical, photocopying, recording        |
 * * | or otherwise - without the prior written permission of                |
 * * | StellaBlue Interactive Services Pvt. Ltd.                             |
 * * |                                                                       |
 * * |///////////////////////////////////////////////////////////////////////|
 ******************************************************************************/
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef,Renderer2  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-doctor-diagnosis',
  templateUrl: './doctor-diagnosis.component.html',
  styleUrls: ['./doctor-diagnosis.component.css', '../../prescription/prescription.component.css']
})
export class DoctorDiagnosisComponent implements OnInit {

  doctorDiagnosis: any;
  diagnosisList: any;
  doctorDiagnosisForm: FormGroup;
  isDuplicateDiagnosis: any;

  @Input() diagnosisForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  diagnosisData: any;
  @ViewChild('doctorDiagnosisModal') doctorDiagnosisModal: TemplateRef<any>;
  modalRef: BsModalRef;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  submitted: boolean =false;
  //Working on app/issues/747
  diagnosisNameList: any;
  //Working on app/issues/747
  // app/issues/1014
  frequentDiagnosisList: any = [];
  displaySidebarDiagnosis: boolean = false;
  notFoundFrequentRecord: boolean = false;
  clickedEvents: any;
  // End app/issues/1014
  constructor(private fb: FormBuilder, private modalService: ModalService, private bsModalService: BsModalService, private _doctorService: DoctorService,private renderer: Renderer2) { }

  ngOnInit() {
    if(this.diagnosisForm==null){
      this.createForm();
    }
    this.isDuplicateDiagnosis = [];
    //this.diagnosisList=null;

    /* ******** Auto save modification ******* */
    // If anything changed on Diagnosis Form
    this.doctorDiagnosisForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorDiagnosisForm.dirty){
        this.doctorDiagnosisForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorDiagnosisForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorDiagnosisForm.value);

  })
  /* ******** End of Auto save modification ******* */

  // app/issues/1014
  this.clickedEvents = [];

  // End app/issues/1014
  }
//Working on app/issues/747
  getDiagnosisList(event) {
    console.log(event.query);
    this._doctorService.getDiagnosisTypeAheadList(event.query).subscribe((data) => {
      console.log("Lab Test: ");
      console.log(data.data);
      this.diagnosisNameList = data.data;
    });

    //End Working on app/issues/747
  }
  //Working on app/issues/747
  setDiagnosisName(event, i){
    console.log(event);
    let diagnosisList = this.doctorDiagnosisForm.get('doctorDiagnosisList') as FormArray;
    let diagnosisForm = diagnosisList.controls[i] as FormGroup;
    diagnosisForm.controls.diagnosis.patchValue(event.Description);
    diagnosisForm.controls.icd10Code.patchValue(event.Code);

    for (let num = 0; num < this.diagnosisList.controls.length; num++) {
      if (num == i) {
        continue;
      }
      if (this.diagnosisList.controls[num].value.diagnosis === this.diagnosisList.controls[i].value.diagnosis) {
        this.submitted = false;
        this.diagnosisList.controls[i].diagnosis.patchValue(null);
        this.diagnosisList.controls[i].icd10Code.patchValue(null);
        this.isDuplicateDiagnosis[i] = true;

      }
      else {
        this.isDuplicateDiagnosis[i] = false;
      }
    }
  }

  ngOnChanges(){
    if(this.diagnosisForm==null || this.diagnosisForm.length==0){
      this.createForm();
    }
    else{
      let diagnosisArray: any = [];
      if(this.diagnosisForm.length > 0){
        for(let i =0; i <this.diagnosisForm.length; i++){
          let obs: FormGroup = this.editForm(this.diagnosisForm[i], i);
          diagnosisArray.push(obs);

        }
      }
      this.doctorDiagnosisForm = this.fb.group({
        isModified: [false],
        doctorDiagnosisList: this.fb.array(diagnosisArray)
      });
      //this.doctorObservationForm.controls.doctorObservationList.patchValue(observationArray)
      this.diagnosisList = this.doctorDiagnosisForm.value.doctorDiagnosisList;
    }

      /* ******** Auto save modification ******* */
    // If anything changed on Diagnosis Form
    this.doctorDiagnosisForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorDiagnosisForm.dirty){
        this.doctorDiagnosisForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorDiagnosisForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorDiagnosisForm.value);

  })
  /* ******** End of Auto save modification ******* */
  }

  openModal() {
    //this.modalService.open(id);
    this.modalRef = this.bsModalService.show(this.doctorDiagnosisModal, this.config);
  }

  saveDiagnosis() {
    this.submitted = true;
    if(this.doctorDiagnosisForm.invalid){
      return;
    }
    //this.modalService.close(id);
    this.modalRef.hide();
    console.log("length = "+this.doctorDiagnosisList.length);
    console.log(this.doctorDiagnosisForm.value);
    this.diagnosisList = this.doctorDiagnosisForm.value.doctorDiagnosisList;
    this.diagnosisData = this.doctorDiagnosisForm.value;
    this.getFormData.emit(this.doctorDiagnosisForm.value);
  }

  closeModal() {
    this.modalRef.hide();
  }

  createForm() {
    let diagnosisArr: FormGroup[] = [];
    for(let i = 0;i<1;i++){
      diagnosisArr.push(this.fb.group({
        diagnosisPk: [null],
        diagnosis: [null, Validators.required],
        icd10Code:[],
        status: ["NRM"],
        createdDate: [],
        createdBy: [],
        modifiedDate: [],
        modifiedBy: []
      })
      );
    }

    this.doctorDiagnosisForm = this.fb.group({
      isModified: [true],
      doctorDiagnosisList: this.fb.array(diagnosisArr),
    });
  }

  editForm(res, index): FormGroup {
    return this.fb.group({
      diagnosis: [res.diagnosis, Validators.required],
      diagnosisPk: [res.diagnosisPk],
      status: [res.status],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy]
    })
  }

  createDiagnosis(): FormGroup {
    return this.fb.group({
      diagnosisPk: [null],
      diagnosis: [null, Validators.required],
      status: ["NRM"],
      icd10Code:[],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

  get doctorDiagnosisList(): FormArray {
    return this.doctorDiagnosisForm.get('doctorDiagnosisList') as FormArray;
  }

  addDiagnosis() {
    this.submitted = false;
    for (let i = 0; i < this.isDuplicateDiagnosis.length; i++)
      if (this.isDuplicateDiagnosis[i]) {
        return;
      }

    this.doctorDiagnosisList.push(this.createDiagnosis());

    setTimeout(() => {
        const element = this.renderer.selectRootElement('#cell'+(this.doctorDiagnosisList.length-1)+' .diagnosisStyle');
         element.focus()
      }, 100);
  }

  deleteDoctorDiagnosis(index) {

    for(let i = 0; i < this.frequentDiagnosisList.length; i++){
      if (this.frequentDiagnosisList[i].diagnosis == this.doctorDiagnosisList.controls[index].get('diagnosis').value) {
        this.clickedEvents[i] = false;
      }
    }


    // if(this.doctorDiagnosisList.length == 1){
    //   return;
    // }
    console.log("index = "+index);
    // this.doctorDiagnosisList.controls.splice(index, 1);
    // this.doctorDiagnosisForm.value.doctorDiagnosisList.splice(index, 1);
    if(this.doctorDiagnosisList.controls[index].get('diagnosisPk').value === "" || this.doctorDiagnosisList.controls[index].get('diagnosisPk').value === null){
      this.doctorDiagnosisList.controls[index].get('diagnosis').clearValidators();
      this.doctorDiagnosisList.controls[index].get('diagnosis').setErrors(null);
      this.doctorDiagnosisList.controls[index].get('diagnosis').reset();
      this.doctorDiagnosisList.controls.splice(index, 1);
      this.doctorDiagnosisForm.value.doctorDiagnosisList.splice(index, 1);
    }
    else{
      this.doctorDiagnosisList.controls[index].get('status').setValue("CXL");
      this.doctorDiagnosisList.controls.splice(index, 1);
    }
    // app/issues/1014
    this.doctorDiagnosisForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
    this.getFormData.emit(this.doctorDiagnosisForm.value);
    // End app/issues/1014
   console.log(this.doctorDiagnosisForm.value);
   this.doctorDiagnosisForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
   this.getFormData.emit(this.doctorDiagnosisForm.value);
  }

  // app/issues/1014
  getFrequentDiagonosisList(){
  this._doctorService.getFrequentDiagnosisList().subscribe((data) => {
    this.frequentDiagnosisList = data.data;

    if(this.frequentDiagnosisList.length > 0){
      for(let i = 0; i < this.frequentDiagnosisList.length; i++){
        for(let j=0;j<this.doctorDiagnosisList.controls.length;j++){
          if (this.frequentDiagnosisList[i].diagnosis == this.doctorDiagnosisList.controls[j].get('diagnosis').value) {
          this.clickedEvents[i] = true;
          }
        }
      }
    }
    else{
      this.notFoundFrequentRecord=true;
    }
  });
}

  freqDiagnosis(){
    this.displaySidebarDiagnosis=true;
    this.getFrequentDiagonosisList();
  }

  setDiagnosis(fd) {
    for(let i = 0; i < this.frequentDiagnosisList.length; i++){
      if (this.frequentDiagnosisList[i].diagnosis == fd.diagnosis) {
        this.clickedEvents[i] = true;
      }
    }

     for(let i = 0; i < this.doctorDiagnosisList.length; i++){
      if (this.doctorDiagnosisList.controls[i].value.diagnosis == null) {
        this.doctorDiagnosisList.controls.splice(i, 1)
      }
    }

    this.doctorDiagnosisList.push(this.addFrequentDiagnosis(fd));
      this.doctorDiagnosisForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      this.getFormData.emit(this.doctorDiagnosisForm.value);
  }

  addFrequentDiagnosis(frequentDiagnosis): FormGroup {
    return this.fb.group({
      diagnosisPk: [null],
      diagnosis: [frequentDiagnosis.diagnosis],
      status: ["NRM"],
      icd10Code:[frequentDiagnosis.icd10_code],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }
  // End app/issues/1014
}
