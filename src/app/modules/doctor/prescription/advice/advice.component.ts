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
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef,Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css', '../../prescription/prescription.component.css']
})
export class AdviceComponent implements OnInit {

  doctorAdvice: any;
  doctorAdviceList: any;
  doctorAdviceForm: FormGroup;
  isDuplicateAdvice: any;

  @Input() adviceForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  adviceData: any;

  @ViewChild('adviceModal') adviceModal: TemplateRef<any>;
  modalRef: BsModalRef;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  submitted: boolean =false;
   // app/issues/2135
   frequentAdviceList: any = [];
   displaySidebarAdvice: boolean = false;
   notFoundFrequentRecord: boolean = false;
   clickedEvents: any;
   // End app/issues/2135

  constructor(private fb: FormBuilder, private modalService: ModalService, 
    private bsModalService: BsModalService,private renderer: Renderer2, private _doctorService:DoctorService) { }

  ngOnInit() {
    if(this.adviceForm==null){
      this.createForm();
    }
    this.isDuplicateAdvice = [];
    //this.doctorAdviceList=null;
    this.adviceData = null;
    this.clickedEvents = [];

    /* ******** Auto save modification ******* */
    // If anything changed on Observation Form
    this.doctorAdviceForm.valueChanges.distinctUntilChanged().subscribe(formData => {
        // If changed set form control 'isModified' to true
        if(this.doctorAdviceForm.dirty){
          this.doctorAdviceForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
        }
        else{
          this.doctorAdviceForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
        }
        // Emit with changed data list and 'isModified' status
        this.getFormData.emit(this.doctorAdviceForm.value);
        
    })
    /* ******** End of Auto save modification ******* */
  }

  ngOnChanges(){
    if(this.adviceForm==null || this.adviceForm.length==0){
      this.createForm();
    }
    else{
      let adviceArray: any = [];
      if(this.adviceForm.length > 0){
        for(let i =0; i <this.adviceForm.length; i++){
          let obs: FormGroup = this.editForm(this.adviceForm[i], i);
          adviceArray.push(obs);
         
        }
      }
      this.doctorAdviceForm = this.fb.group({
        isModified: [false],
        adviceList: this.fb.array(adviceArray)
      });
      //this.doctorObservationForm.controls.doctorObservationList.patchValue(observationArray)
      this.doctorAdviceList = this.doctorAdviceForm.value.adviceList;
    }
    /* ******** Auto save modification ******* */
    // If anything changed on Observation Form
    this.doctorAdviceForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorAdviceForm.dirty){
        this.doctorAdviceForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorAdviceForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorAdviceForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }

  openModal() {
    this.modalRef = this.bsModalService.show(this.adviceModal, this.config);
    //this.modalService.open(id);
  }

  

  createAdvice(): FormGroup {
    return this.fb.group({
      advice: [null, Validators.required],
      doctorAdvicePk: [null],
      status: ["NRM"],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

  closeModal() {
    //this.modalService.close(id);
    this.modalRef.hide();
  }


  saveAdvice() {
    this.submitted = true;
    if(this.doctorAdviceForm.invalid){
      return;
    }
    //this.modalService.close(id);
    this.modalRef.hide();
    console.log(this.doctorAdviceForm.value.adviceList);
    this.doctorAdviceList = this.doctorAdviceForm.value.adviceList;
    console.log("Advice List length = "+this.doctorAdviceList.length);
    this.adviceData = this.doctorAdviceForm.value;
    this.getFormData.emit(this.doctorAdviceForm.value);
  }


  createForm() {
    let adviceArr: FormGroup[] = [];
    for(let i = 0;i<1;i++){
      adviceArr.push(this.fb.group({
        advice: [null, Validators.required],
        doctorAdvicePk: [null],
        status: ["NRM"],
        createdDate: [],
        createdBy: [],
        modifiedDate: [],
        modifiedBy: []
      })
      );
    }

    this.doctorAdviceForm = this.fb.group({
      isModified: [true],
      adviceList: this.fb.array(adviceArr),
    });
  }

  editForm(res, index): FormGroup {
    return this.fb.group({
      advice: [res.advice, Validators.required],
      doctorAdvicePk: [res.doctorAdvicePk],
      status: [res.status],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy]
    })
  }

  get adviceList(): FormArray {
    return this.doctorAdviceForm.get('adviceList') as FormArray;
  }

  addAdvice() {
    this.submitted = false;
    for (let i = 0; i < this.isDuplicateAdvice.length; i++)
      if (this.isDuplicateAdvice[i]) {
        return;
      }
   
    this.adviceList.push(this.createAdvice());

    setTimeout(() => {
      const element = this.renderer.selectRootElement('#cell'+(this.adviceList.length-1)+' .advices');
       element.focus()
    }, 100);
  }

  deleteAdvice(index) {
    for(let i = 0; i < this.frequentAdviceList.length; i++){
      if (this.frequentAdviceList[i].advice == this.adviceList.controls[index].get('advice').value) {
        this.clickedEvents[i] = false;
      }
    }
    // if(this.adviceList.length == 1){
    //   return;
    // }
    console.log("index = "+index);
    // this.adviceList.controls.splice(index, 1);
    // this.doctorAdviceForm.value.adviceList.splice(index, 1);
    if(this.adviceList.controls[index].get('doctorAdvicePk').value === "" || this.adviceList.controls[index].get('doctorAdvicePk').value === null){
      this.adviceList.controls[index].get('advice').clearValidators();
      this.adviceList.controls[index].get('advice').setErrors(null);
      this.adviceList.controls[index].get('advice').reset();
      this.adviceList.controls.splice(index, 1);
      this.doctorAdviceForm.value.adviceList.splice(index, 1);
    }
    else{
      this.adviceList.controls[index].get('status').setValue("CXL");
      this.adviceList.controls.splice(index, 1);
      
    }
   console.log(this.doctorAdviceForm.value);
   this.doctorAdviceForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
   this.getFormData.emit(this.doctorAdviceForm.value);
  }

  // app/issues/2135
  freqAdvice(){
    this.displaySidebarAdvice=true;
    this.getFrequentAdviceList();
  }

  getFrequentAdviceList(){
    this._doctorService.getFrequentAdviceList().subscribe((data) => {
      this.frequentAdviceList = data.data;
  
      if(this.frequentAdviceList.length > 0){
        for(let i = 0; i < this.frequentAdviceList.length; i++){
          for(let j=0;j<this.adviceList.controls.length;j++){
            if (this.frequentAdviceList[i].advice == this.adviceList.controls[j].get('advice').value) {
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

  setAdvice(fd) {
    for(let i = 0; i < this.frequentAdviceList.length; i++){
      if (this.frequentAdviceList[i].advice == fd.advice) {
        this.clickedEvents[i] = true;
      }
    }

     for(let i = 0; i < this.adviceList.length; i++){
      if (this.adviceList.controls[i].value.advice == null) {
        this.adviceList.controls.splice(i, 1)
      }
    }

    this.adviceList.push(this.addFrequentAdvice(fd));
      this.doctorAdviceForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      this.getFormData.emit(this.doctorAdviceForm.value);
  }

  addFrequentAdvice(frequentData): FormGroup {
    return this.fb.group({
      doctorAdvicePk: [null],
      advice: [frequentData.advice],
      status: ["NRM"],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }
  // app/issues/2135
}
