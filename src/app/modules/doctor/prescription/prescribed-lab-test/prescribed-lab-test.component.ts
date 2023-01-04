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
import { FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { DoctorService } from '../../doctor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-prescribed-lab-test',
  templateUrl: './prescribed-lab-test.component.html',
  styleUrls: ['./prescribed-lab-test.component.css', '../../prescription/prescription.component.css']
})
export class PrescribedLabTestComponent implements OnInit {

  doctorTest: any;
  testList: any;
  doctorTestForm: FormGroup;
  isDuplicateTest: any;

  @Input() testForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  testData: any;
  labTestList: any;
  isDuplicateLabTest: any;
  testD: any[] = [];
  @ViewChild('testModal') testModal: TemplateRef<any>;
  modalRef: BsModalRef;
  config = {
    class: 'custom-modal-width-prescription modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  submitted: boolean =false;
  clickedEvent: any = [];
  displaySidebarInvestigation: boolean =false;

  constructor(private fb: FormBuilder, private modalService: ModalService, private _doctorService: DoctorService, private bsModalService: BsModalService,private renderer: Renderer2) { }

  ngOnInit() {
    if(this.testForm==null){
      this.createForm();
    }
    this.isDuplicateTest = [];
    //this.testList=null;
    this.testData = null;
    this.isDuplicateLabTest = [];

    // this._doctorService.getMedicalAttributeList('T').subscribe((data) => {
    //   console.log("Lab Test: ");
    //   console.log(data.data);
    //   this.labTestList = data.data;
    //   for(let i=0; i < this.labTestList.length; i++){
    //     let val:String = this.labTestList[i];
    //     let valName:string[] = val.toString().split(',');
    //     //this.test.push(valName[1]);
    //     this.testD.push({
    //       testId: valName[0],
    //       testN: valName[1],
    //     })
    //   }
    //   console.log(this.testD);
    // });
   
    /* ******** Auto save modification ******* */
    // If anything changed on Test Form
    this.doctorTestForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorTestForm.dirty){
        this.doctorTestForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorTestForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorTestForm.value);
      
  })
  /* ******** End of Auto save modification ******* */

  

  }

  ngOnChanges(){
    if(this.testForm==null || this.testForm.length == 0){
      this.createForm();
    }
    else{
      let testArray: any = [];
      if(this.testForm.length > 0){
        for(let i =0; i <this.testForm.length; i++){
          let obs: FormGroup = this.editForm(this.testForm[i], i);
          testArray.push(obs);
         
        }
      }
      this.doctorTestForm = this.fb.group({
        isModified: [false],
        doctorTestList: this.fb.array(testArray)
      });
      this.testList = this.doctorTestForm.value.doctorTestList;
    }
    /* ******** Auto save modification ******* */
    // If anything changed on Test Form
    this.doctorTestForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorTestForm.dirty){
        this.doctorTestForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorTestForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorTestForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }

  openModal() {
    //this.modalService.open(id);
    this.modalRef = this.bsModalService.show(this.testModal, this.config);
  }

  createTest(): FormGroup {
    // /sbis-poc/app/issues/729
    return this.fb.group({
      recommendedTestPk: [null],
      medicalAttributePk: [null],
      comments: [''],
      medicalAttributeName: [null, Validators.required],
      systemCode:[null],
      status: ["NRM"],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

  saveTest() {
    this.submitted = true;
    if(this.doctorTestForm.invalid){
      return;
    }
    //console.log("Test = "+id);
    //this.modalService.close(id);
    this.modalRef.hide();
    console.log("length = "+this.doctorTestList.length);
    console.log(this.doctorTestForm.value);
    this.testList = this.doctorTestForm.value.doctorTestList;
    console.log("test List length = "+this.testList.length);
    this.testData = this.doctorTestForm.value;
    this.getFormData.emit(this.doctorTestForm.value);
  }


  createForm() {
    // /sbis-poc/app/issues/729
    let testArr: FormGroup[] = [];
    for(let i = 0;i<1;i++){
      testArr.push(this.fb.group({
        recommendedTestPk: [null],
        medicalAttributePk: [null],
        systemCode:[null],
        comments: [''],
        medicalAttributeName: [null, Validators.required],
        status: ["NRM"],
        createdDate: [],
        createdBy: [],
        modifiedDate: [],
        modifiedBy: []
      })
      );
    }

    this.doctorTestForm = this.fb.group({
      isModified: [true],
      doctorTestList: this.fb.array(testArr),
    });
  }

  editForm(res, index): FormGroup {
    // /sbis-poc/app/issues/729
    return this.fb.group({
      recommendedTestPk: [res.recommendedTestPk],
      medicalAttributePk: [res.medicalAttributePk],
      systemCode:[res.systemCode],
      comments: [res.comments],
      medicalAttributeName: [res.medicalAttributeName, Validators.required],
      status: [res.status],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy]
    })
  }

  get doctorTestList(): FormArray {
    return this.doctorTestForm.get('doctorTestList') as FormArray;
  }

  addTest() {
    this.submitted = false;
    for (let i = 0; i < this.isDuplicateTest.length; i++)
      if (this.isDuplicateTest[i]) {
        return;
      }
    //Working on app/issues/836
    for(let i = 0; i < this.doctorTestList.length; i++){
      if (this.doctorTestList.controls[i].value.id == null && this.doctorTestList.controls[i].value.medicalAttributeName == null ) {
        return;
      }
    }
    //End Working on app/issues/836
    this.doctorTestList.push(this.createTest());

    setTimeout(() => {
      const element = this.renderer.selectRootElement('#cell'+(this.doctorTestList.length-1)+' .labTestStyle');
       element.focus()
    }, 100);

  }

  deleteTest(index) {
    for(let i = 0; i < this.frequentTestList.length; i++){
      if (this.frequentTestList[i].id == this.doctorTestList.controls[index].get('medicalAttributePk').value) {
        this.clickedEvent[i] = false;
      }
    }
    console.log("index = "+index);
    // if(this.doctorTestList.length == 1){
    //   return;
    // }
    // this.doctorTestList.controls.splice(index, 1);
    // this.doctorTestForm.value.doctorTestList.splice(index, 1);
    if(this.doctorTestList.controls[index].get('medicalAttributePk').value === "" || this.doctorTestList.controls[index].get('medicalAttributePk').value === null){
      this.doctorTestList.controls.splice(index, 1);
      this.doctorTestForm.value.doctorTestList.splice(index, 1);
    }
    else{
      this.doctorTestList.controls[index].get('status').setValue("CLX");
      this.doctorTestList.controls.splice(index, 1);
    }
   console.log(this.doctorTestForm.value);
   this.doctorTestForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
   this.getFormData.emit(this.doctorTestForm.value);
  }

  duplicateCheck(event, i){
    //this.doctorTestList.controls[i].value.longName = event.target.innerText;
    this.doctorTestList.controls[i].patchValue({
      medicalAttributeName: event.target.selectedOptions[0].innerText

    })
    for (let num = 0; num < this.doctorTestList.controls.length; num++) {
      if (num == i) {
        continue;
      }
      if (this.doctorTestList.controls[num].value.medicalAttributePk === this.doctorTestList.controls[i].value.medicalAttributePk) {
        // alert("This test already prescribed.");
        // console.log(this.doctorTestList.controls[i].value);
        this.doctorTestList.controls[i].patchValue({
          medicalAttributePk: [null],
        });
        this.isDuplicateLabTest[i] = true;
      }
      else {
        this.isDuplicateLabTest[i] = false;
      }
    }

    // for(let i = 0; i < this.doctorTestList.length; i++){
    //   if(i == index){
    //     continue;
    //   }
    //   console.log(this.doctorTestList.value[index].medicalAttributePk);
    //   console.log(this.doctorTestList.value[i].medicalAttributePk);
    //   // if(attributePk == this.doctorTestList.value[i].medicalAttributePk){
    //   //   alert("This test already prescribed.");
    //   //   this.doctorTestList.value[i].medicalAttributePk = 0;
    //   // }

    // }
  }

  closeModal() {
    this.modalRef.hide();
  }

  getTestList(event) {
    console.log(event.query);
    this._doctorService.getInvestigationTypeAheadList(event.query).subscribe((data) => {
      console.log("Lab Test: ");
      console.log(data.data);
      this.labTestList = data.data;
    });

    //End Working on app/issues/720
  }

  setTestName(event, i){
    console.log(event);
    for(let i = 0; i < this.frequentTestList.length; i++){
      if (this.frequentTestList[i].id == event.id) {
        this.clickedEvent[i] = true;
      }
    }
    let testList = this.doctorTestForm.get('doctorTestList') as FormArray;
    let testForm = testList.controls[i] as FormGroup;
    testForm.controls.medicalAttributeName.patchValue(event.longName);
    testForm.controls.systemCode.patchValue(event.systemCode);
    // /sbis-poc/app/issues/729
    this._doctorService.getMedicaleAttrPKBySystemCode(event.systemCode).subscribe((data) => {
      console.log("Lab Test: ");
      console.log("data>>>"+ JSON.stringify(data));
      // this.labTestList = data.data;
      if(data.data != null){
        testForm.controls.medicalAttributePk.patchValue(data.data);
      }
       
    }); 
    
    for (let num = 0; num < this.doctorTestList.controls.length; num++) {
      if (num == i) {
        continue;
      }
      if (this.doctorTestList.controls[num].value.systemCode === this.doctorTestList.controls[i].value.systemCode) {
        // alert("This test already prescribed.");
        // console.log(this.doctorTestList.controls[i].value);
        // this.doctorTestList.controls[i].patchValue({
        //   medicalAttributePk: [null],
        //   medicalAttributeName: [null]
        // });
        this.submitted = false;
        let testList = this.doctorTestForm.get('doctorTestList') as FormArray;
        let testForm = testList.controls[i] as FormGroup;
        testForm.controls.medicalAttributePk.patchValue(null);
        testForm.controls.systemCode.patchValue(null);
        testForm.controls.medicalAttributeName.patchValue(null);
        this.isDuplicateLabTest[i] = true;
        console.log(this.doctorTestForm.value);
        
      }
      else {
        this.isDuplicateLabTest[i] = false;
      }
    }
  }

  managePk(testName, i){
    
    let testList = this.doctorTestForm.get('doctorTestList') as FormArray;
    let testForm = testList.controls[i] as FormGroup;
    for(let i = 0; i < this.frequentTestList.length; i++){
      if (this.frequentTestList[i].id == testForm.controls.medicalAttributePk.value) {
        this.clickedEvent[i] = false;
      }
    }
    if(testName != testForm.controls.medicalAttributeName.value){
      testForm.controls.medicalAttributePk.patchValue("");
    }
    
  }

  frequentTestList: any = [];
  notFoundFrequentRecord: boolean = false;
  getFrequentPrescribedTestList(){
    let user = JSON.parse(localStorage.getItem('user'));
    // Issue app#647
    let payload = {
      "refNo" : user.refNo
    }
    this._doctorService.getFrequentPrescribedTestList(payload).subscribe((data) => {
      console.log("Frequent Test: ");
      console.log(data.data);
      this.frequentTestList = data.data;
      if(this.frequentTestList.length > 0){
        for(let i = 0; i < this.frequentTestList.length; i++){
          for(let j=0;j<this.doctorTestList.controls.length;j++){
            if(this.frequentTestList[i].id!=null){
              if (this.frequentTestList[i].id == this.doctorTestList.controls[j].get('medicalAttributePk').value) {
                this.clickedEvent[i] = true;
              }
            }
            else{
              if (this.frequentTestList[i].longName == this.doctorTestList.controls[j].get('medicalAttributeName').value) {
                this.clickedEvent[i] = true;
              }
            }
          }
        }
      }
      else{
        this.notFoundFrequentRecord=true;
      }
      
     
      
    });
  }


  setTest(test){
   
    let testList = this.doctorTestForm.get('doctorTestList') as FormArray;
    
    for(let i = 0; i < this.frequentTestList.length; i++){
      if(this.frequentTestList[i].id!=null){
        if (this.frequentTestList[i].id == test.id) {
          this.clickedEvent[i] = true;
        }
      }
      else{
        if (this.frequentTestList[i].longName == test.longName) {
          this.clickedEvent[i] = true;
        }
      }
        
    }
    // this.frequentTestList.forEach(function (e) {
    //   if (e.id == test.id) {
    //     this.clickedEvent = true;
    //   }
    // });
    // testList.controls.forEach(function (e) {
    //   if (e.value.medicalAttributePk == test.id) {
    //     this.clickedEvent = true;
    //   }
    // });
    //Working on app/issues/836
    for(let i = 0; i < this.doctorTestList.length; i++){
      if (this.doctorTestList.controls[i].value.id == null && this.doctorTestList.controls[i].value.medicalAttributeName == null ) {
        this.doctorTestList.controls.splice(i, 1)
      }
    }
    //End Working on app/issues/836
    this.doctorTestList.push(this.addFrequentTest(test));
    this.doctorTestForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
    this.getFormData.emit(this.doctorTestForm.value);

  }
  addFrequentTest(test): FormGroup {
    // /sbis-poc/app/issues/729
    return this.fb.group({
      recommendedTestPk: [null],
      medicalAttributePk: [test.id],
      comments: [''],
      medicalAttributeName: [test.longName, Validators.required],
      status: ["NRM"],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: []
    });
  }

  showFBody: any = true;
  toggleSlide(){
      this.showFBody = !this.showFBody;
  }
  accordianHeader: any = false;
  accordianHeaderClick() {
    if(this.accordianHeader == false) {
      this.accordianHeader = true;
    } else {
      this.accordianHeader = false;
    }
  }
  
  displaySideBar(){
  this.displaySidebarInvestigation = true;
  this.getFrequentPrescribedTestList();
  }

}
