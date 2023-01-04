
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
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef ,ElementRef,Directive,AfterViewInit,Renderer2} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-doctor-observation',
  templateUrl: './doctor-observation.component.html',
  styleUrls: ['./doctor-observation.component.css', '../../prescription/prescription.component.css']
})
export class DoctorObservationComponent implements OnInit {

  doctorObservation: any;
  observationList: any;
  doctorObservationForm: FormGroup;
  isDuplicateObservation: any;

  @Input() observationForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  observationData: any;
  @ViewChild('observationModal') observationModal: TemplateRef<any>;
  modalRef: BsModalRef;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  submitted: boolean =false;
  dirtyFlag: boolean = false;

  clickedEvents: any;

  // //canvas test
  // canvas;
  // stage;
  // drawingCanvas;
  // oldPt;
  // oldMidPt;
  // title;
  // color = "#828b20";
  // stroke=5;
  // colors = [];
  // index;
  // captures: Array<any>;
  // brushSize:any[]=[{size:5+'px',bs:5},{size:10+'px',bs:10},{size:15+'px',bs:15},{size:20+'px',bs:20},{size:25+'px',bs:25}];
  // //canvas test

  constructor(private fb: FormBuilder, private modalService: ModalService, 
    private bsModalService: BsModalService,private renderer: Renderer2,
    private _doctorService: DoctorService) { }

  ngOnInit() {
    if(this.observationForm==null){
      this.createForm();
    }
    //this.doctorObservationArray = [];
    this.isDuplicateObservation = [];
    //this.observationList=null;
    this.observationData = null;

    /* ******** Auto save modification ******* */
    // If anything changed on Observation Form
    this.doctorObservationForm.valueChanges.distinctUntilChanged().subscribe(formData => {
        // If changed set form control 'isModified' to true
        if(this.doctorObservationForm.dirty){
          this.doctorObservationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
        }
        else{
          this.doctorObservationForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
        }
        // Emit with changed data list and 'isModified' status
        this.getFormData.emit(this.doctorObservationForm.value);
        
    })
    /* ******** End of Auto save modification ******* */

    this.clickedEvents = [];
  }
 
  ngOnChanges(){
    if(this.observationForm==null || this.observationForm.length == 0){
      this.createForm();
    }
    else{
      let observationArray: any = [];
      if(this.observationForm.length > 0){
        for(let i =0; i <this.observationForm.length; i++){
          let obs: FormGroup = this.editForm(this.observationForm[i], i);
          observationArray.push(obs);
         
        }
      }
      this.doctorObservationForm = this.fb.group({
        isModified: [false],
        doctorObservationList: this.fb.array(observationArray)
      });
      //this.doctorObservationForm.controls.doctorObservationList.patchValue(observationArray)
      this.observationList = this.doctorObservationForm.value.doctorObservationList;
    }
    // //canvas test
    // this.canvasTest();
    // //canvas test
     /* ******** Auto save modification ******* */
    // If anything changed on Observation Form
    this.doctorObservationForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorObservationForm.dirty){
        this.doctorObservationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorObservationForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorObservationForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }

  openModal() {
    console.log(this.doctorObservationForm);
    this.modalRef = this.bsModalService.show(this.observationModal, this.config);
  }

  

  createObservation(): FormGroup {
    return this.fb.group({
      observationPk: [null],
      observation: [null, Validators.required],
      observationStatus: ["NRM"],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

  SaveObservation() {
    this.submitted = true;
    if(this.doctorObservationForm.invalid){
      return;
    }
    this.modalRef.hide();
    console.log(this.doctorObservationForm.value.doctorObservationList);
    this.observationList = this.doctorObservationForm.value.doctorObservationList;
    console.log("observationList length = "+this.observationList.length);
    this.observationData = this.doctorObservationForm.value;
    this.getFormData.emit(this.doctorObservationForm.value);
  }


  createForm() {
    let observationArr: FormGroup[] = [];
    for(let i = 0;i<1;i++){
      observationArr.push(this.fb.group({
        observationPk: [null],
        observation: [null, Validators.required],
        observationStatus: ["NRM"],
        createdDate: [],
        createdBy: [],
        modifiedDate: [],
        modifiedBy: []
      })
      );
    }

    this.doctorObservationForm = this.fb.group({
      isModified: [true],
      doctorObservationList: this.fb.array(observationArr),
    });
  }

  editForm(res, index): FormGroup {
    return this.fb.group({
      observation: [res.observation, Validators.required],
      observationPk: [res.observationPk],
      observationStatus: [res.observationStatus],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy]
    })
  }

  get doctorObservationList(): FormArray {
    return this.doctorObservationForm.get('doctorObservationList') as FormArray;
  }

  addObservation() {
    this.submitted = false;

    for (let i = 0; i < this.isDuplicateObservation.length; i++){

      if (this.isDuplicateObservation[i]) {

        return;
      }
    }


    this.doctorObservationList.push(this.createObservation());

    setTimeout(() => {
      const element = this.renderer.selectRootElement('#cell'+(this.doctorObservationList.length-1)+' .observs');
       element.focus()
    }, 100);

  }

  deleteDoctorOvservation(index) {
    console.log("index = "+index);
    for(let i = 0; i < this.frequentFindingList.length; i++){
      if (this.frequentFindingList[i].finding == this.doctorObservationList.controls[index].get('observation').value) {
        this.clickedEvents[i] = false;
      }
    }
    // if(this.doctorObservationList.length == 1){
    //   return;
    // }
    if(this.doctorObservationList.controls[index].get('observationPk').value === "" || this.doctorObservationList.controls[index].get('observationPk').value === null){
      this.doctorObservationList.controls[index].get('observation').clearValidators();
      this.doctorObservationList.controls[index].get('observation').setErrors(null);
      this.doctorObservationList.controls[index].get('observation').reset();
      this.doctorObservationList.controls.splice(index, 1);
      this.doctorObservationForm.value.doctorObservationList.splice(index, 1);
    }
    else{
      this.doctorObservationList.controls[index].get('observationStatus').setValue("CXL");
      this.doctorObservationList.controls.splice(index, 1);
    }
   console.log(this.doctorObservationForm.value);
   this.doctorObservationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
   this.getFormData.emit(this.doctorObservationForm.value);
    
  }

  closeModal() {
    this.modalRef.hide();
  }

  displaySidebarFinding: boolean = false;
  frequentFindingList: any = [];
  freqFinding(){
    this.displaySidebarFinding=true;
    this.getFrequentFindingList();
  }
  getFrequentFindingList(){
    this._doctorService.getFrequentFindingList().subscribe((data) => {
      this.frequentFindingList = data.data;
  
      if(this.frequentFindingList.length > 0){
        for(let i = 0; i < this.frequentFindingList.length; i++){
          for(let j=0;j<this.doctorObservationList.controls.length;j++){
            if (this.frequentFindingList[i].finding == this.doctorObservationList.controls[j].get('observation').value) {
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

  setFinding(ff) {
    for(let i = 0; i < this.frequentFindingList.length; i++){
      if (this.frequentFindingList[i].finding == ff.finding) {
        this.clickedEvents[i] = true;
      }
    }

     for(let i = 0; i < this.doctorObservationList.length; i++){
      if (this.doctorObservationList.controls[i].value.observation == null) {
        this.doctorObservationList.controls.splice(i, 1)
      }
    }

    this.doctorObservationList.push(this.addFrequentFinding(ff));
    console.log(this.doctorObservationList);
    
    this.doctorObservationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
    this.getFormData.emit(this.doctorObservationForm.value);
  }

  addFrequentFinding(f): FormGroup {
    return this.fb.group({
      observation: [f.finding],
      observationPk: [null],
      observationStatus: ['NRM'],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

}
