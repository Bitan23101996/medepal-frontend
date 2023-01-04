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
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DoctorService } from '../../doctor.service';
import { AppoinmentService } from 'src/app/modules/appoinment/appoinment.service';

@Component({
  selector: 'app-patient-problem-narration',
  templateUrl: './patient-problem-narration.component.html',
  styleUrls: ['./patient-problem-narration.component.css', '../../prescription/prescription.component.css']
})
export class PatientProblemNarrationComponent implements OnInit {

  doctorSymptom: any;
  doctorSymptomList: any;
  doctorSymptomForm: FormGroup;
  isDuplicateSymptom: any;

  @Input() narrationForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();

  @Input("appointmentRefNo") appointmentRefNo: string;

  symptomData: any;
  modalRef: BsModalRef;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  submitted: boolean =false;
  dirtyFlag: boolean = false;

  clickedEvents: any;
  narrationList: any;

  constructor(private fb: FormBuilder, private modalService: ModalService, 
    private bsModalService: BsModalService,private renderer: Renderer2,
    private _doctorService: DoctorService,
    private appointmentService: AppoinmentService) { }

  ngOnInit() {
    if(this.narrationForm==null){
      this.createForm();
    }

    if(this.appointmentRefNo)
      this.fetchPatientNarrationProblem(this.appointmentRefNo);
      
    this.isDuplicateSymptom = [];
    this.symptomData = null;

    /* ******** Auto save modification ******* */
    // If anything changed on Symptom Form
    this.doctorSymptomForm.valueChanges.distinctUntilChanged().subscribe(formData => {
        // If changed set form control 'isModified' to true
        if(this.doctorSymptomForm.dirty){
          this.doctorSymptomForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
        }
        else{
          this.doctorSymptomForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
        }
        // Emit with changed data list and 'isModified' status
        this.getFormData.emit(this.doctorSymptomForm.value);
        
    })
    /* ******** End of Auto save modification ******* */

    this.clickedEvents = [];

  }//end of oninit



  fetchPatientNarrationProblem(appointmentRefNo: string) {
    this.appointmentService.fetchAllProblemNarration(appointmentRefNo).subscribe(res=>{
      if(res.status == 2000){   
        if(res.data && res.data.length> 0)
          this.narrationList = res.data.map(val => val.narration);           
      }
    });
  }//end of ws call for patient problem narration

  //autocomplete method
  getNarrationList($event){
    this.fetchPatientNarrationProblem(this.appointmentRefNo);
  }//end of method

 
  ngOnChanges(){
    if(this.narrationForm==null || this.narrationForm.length == 0){
      this.createForm();
    }
    else{
      let symptomArray: any = [];
      if(this.narrationForm.length > 0){
        for(let i =0; i <this.narrationForm.length; i++){
          let sym: FormGroup = this.editForm(this.narrationForm[i], i);
          symptomArray.push(sym);
         
        }
      }
      this.doctorSymptomForm = this.fb.group({
        isModified: [false],
        symptomList: this.fb.array(symptomArray)
      });
      this.doctorSymptomList = this.doctorSymptomForm.value.symptomList;
    }

    /* ******** Auto save modification ******* */
    // If anything changed on Symptom Form
    this.doctorSymptomForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorSymptomForm.dirty){
        this.doctorSymptomForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorSymptomForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorSymptomForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }//end of onchanges

  createSymptom(): FormGroup {
    return this.fb.group({
      symptomPk: [null],
      symptom: [null, Validators.required],
      status: ["NRM"],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

  saveSymptom() {
    this.submitted = true;
    if(this.doctorSymptomForm.invalid){
      return;
    }
    this.modalRef.hide();
    console.log(this.doctorSymptomForm.value.symptomList);
    this.doctorSymptomList = this.doctorSymptomForm.value.symptomList;
    console.log("symptomList length = "+this.symptomList.length);
    this.symptomData = this.doctorSymptomForm.value;
    this.getFormData.emit(this.doctorSymptomForm.value);
  }


  createForm() {
    let symptomArr: FormGroup[] = [];
    for(let i = 0;i<1;i++){
      symptomArr.push(this.fb.group({
        symptomPk: [null],
        symptom: [null, Validators.required],
        status: ["NRM"],
        createdDate: [],
        createdBy: [],
        modifiedDate: [],
        modifiedBy: []
      })
      );
    }

    this.doctorSymptomForm = this.fb.group({
      isModified: [true],
      symptomList: this.fb.array(symptomArr),
    });
  }

  editForm(res, index): FormGroup {
    return this.fb.group({
      symptom: [res.symptom, Validators.required],
      symptomPk: [res.symptomPk],
      status: [res.status],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy]
    })
  }

  get symptomList(): FormArray {
    return this.doctorSymptomForm.get('symptomList') as FormArray;
  }

  addSymptom() {
    this.submitted = false;

    for (let i = 0; i < this.isDuplicateSymptom.length; i++){

      if (this.isDuplicateSymptom[i]) {

        return;
      }
    }


    this.symptomList.push(this.createSymptom());

    setTimeout(() => {
      const element = this.renderer.selectRootElement('#cell'+(this.symptomList.length-1)+' .symptom');
       element.focus()
    }, 100);

  }

  deleteDoctorSymptom(index) {
    console.log("index = "+index);
    for(let i = 0; i < this.frequentSymptomList.length; i++){
      if (this.frequentSymptomList[i].symptom == this.symptomList.controls[index].get('symptom').value) {
        this.clickedEvents[i] = false;
      }
    }

    if(this.symptomList.controls[index].get('symptomPk').value === "" || this.symptomList.controls[index].get('symptomPk').value === null){
      this.symptomList.controls[index].get('symptom').clearValidators();
      this.symptomList.controls[index].get('symptom').setErrors(null);
      this.symptomList.controls[index].get('symptom').reset();
      this.symptomList.controls.splice(index, 1);
      this.doctorSymptomForm.value.symptomList.splice(index, 1);
    }
    else{
      this.symptomList.controls[index].get('status').setValue("CXL");
      this.symptomList.controls.splice(index, 1);
    }
   console.log(this.doctorSymptomForm.value);
   this.doctorSymptomForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
   this.getFormData.emit(this.doctorSymptomForm.value);
    
  }

  closeModal() {
    this.modalRef.hide();
  }

  displaySidebarSymptom: boolean = false;
  frequentSymptomList: any = [];
  freqSymptom(){
    this.displaySidebarSymptom=true;
    this.getFrequentSymptomList();
  }
  getFrequentSymptomList(){
    this._doctorService.getFrequentSymptomList().subscribe((data) => {
      this.frequentSymptomList = data.data;
  
      if(this.frequentSymptomList.length > 0){
        for(let i = 0; i < this.frequentSymptomList.length; i++){
          for(let j=0;j<this.symptomList.controls.length;j++){
            if (this.frequentSymptomList[i].symptom == this.symptomList.controls[j].get('symptom').value) {
            this.clickedEvents[i] = true;
            }
          }
        }
      }
      else{
        //this.notFoundFrequentRecord=true;
      }
    });
  }

  setSymptom(ff) {
    for(let i = 0; i < this.frequentSymptomList.length; i++){
      if (this.frequentSymptomList[i].symptom == ff.symptom) {
        this.clickedEvents[i] = true;
      }
    }

     for(let i = 0; i < this.symptomList.length; i++){
      if (this.symptomList.controls[i].value.symptom == null) {
        this.symptomList.controls.splice(i, 1)
      }
    }

    this.symptomList.push(this.addFrequentSymptom(ff));
    console.log(this.symptomList);
    
    this.doctorSymptomForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
    this.getFormData.emit(this.doctorSymptomForm.value);
  }

  addFrequentSymptom(f): FormGroup {
    return this.fb.group({
      symptom: [f.symptom],
      symptomPk: [null],
      status: ['NRM'],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

}
