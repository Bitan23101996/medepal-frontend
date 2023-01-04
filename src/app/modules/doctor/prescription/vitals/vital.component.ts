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
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { DoctorService } from '../../doctor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-vital',
  templateUrl: './vital.component.html',
  styleUrls: ['./vital.component.css', '../../prescription/prescription.component.css']
})
export class VitalComponent implements OnInit {

  constructor( private fb: FormBuilder, private modalService: ModalService, private _doctorService: DoctorService, private bsModalService: BsModalService) { }
  prescriptionVital:any;

  @Input() vitalForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  vitalData: any;
  vitalNameAndId = [];
  vitalName:string[]=[];
  text:String[];
  @ViewChild('vitalModal') vitalModal: TemplateRef<any>;
  modalRef: BsModalRef;
  vitalDataForm: FormGroup;
  valName:string[];
  //vitalArr: FormGroup;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  hasData: boolean = false;
  
  ngOnInit() {
    if(this.vitalForm==null || this.vitalForm.length == 0){
      this.createForm();
      this._doctorService.getVitalData().subscribe((data) => {
      data.data = this.reArrangeArray(data.data);
      if(!this.hasData){
        this.vitalNameAndId = data.data;
        console.log(this.vitalNameAndId);
        
        for(let i=0; i < this.vitalNameAndId.length; i++){        
          this.vitalList.push(this.fb.group({
                longName: [this.vitalNameAndId[i].longName],
                medicalAttributePk: [this.vitalNameAndId[i].id],
                result:[null],
                userPk: [1],
                id: [],
                source: [],
                triggerPk: [],
                originalFileName: [],
                storageKeyName: [],
                medicalAttributeName: [this.vitalNameAndId[i].longName],
                createdBy: [],
                createdDate: [],
                modifiedDate:[],
                modifiedBy: [],
                testDate: [],
                unit: [this.vitalNameAndId[i].unit],
                systemCode: [this.vitalNameAndId[i].systemCode]
              }))
          //this.doctorAddressList.push(this.createItem());
          
        }
        console.log(this.vitalDataForm);
        //this.createForm();
      }
       
      });
    }
    
    this.text = [];
    this.vitalData = "";
   
    /* ******** Auto save modification ******* */
    // If anything changed on Vital Form
    this.vitalDataForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.vitalDataForm.dirty){
        this.vitalDataForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.vitalDataForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.vitalDataForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
    
    
  }
  
  
  ngOnChanges(){
    if(this.vitalForm==null || this.vitalForm.length == 0){
      this.createForm();
    }
    else{
      this.hasData = true;
      let vitalArray: any = [];
      this.vitalForm = this.reArrangeArray(this.vitalForm);
      if(this.vitalForm.length > 0){
        for(let i =0; i <this.vitalForm.length; i++){
          let obs: FormGroup = this.editForm(this.vitalForm[i], i);
          vitalArray.push(obs);         
        }
      }
      this.vitalDataForm = this.fb.group({
        isModified: [false],
        vitalList: this.fb.array(vitalArray)
      });
      //this.doctorObservationForm.controls.doctorObservationList.patchValue(observationArray)
      //this.doctorAdviceList = this.vitalDataForm.value.vitalList;
    }

    /* ******** Auto save modification ******* */
    // If anything changed on Vital Form
    this.vitalDataForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.vitalDataForm.dirty){
        this.vitalDataForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.vitalDataForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.vitalDataForm.value);
      
  })
  /* ******** End of Auto save modification ******* */

  }

  //method to rearrange the array
  reArrangeArray(arrayToBeSorted): any[]{
  //to rearrange the dia and sys value of the array
  let findIndexForSys =  arrayToBeSorted.findIndex(x=> x.systemCode == 'L833');
  let findIndexForDia = arrayToBeSorted.findIndex(x=> x.systemCode == 'L722');
  if(findIndexForSys != -1 && findIndexForDia != -1)
   [ arrayToBeSorted[findIndexForDia],arrayToBeSorted[findIndexForSys]]=[ arrayToBeSorted[findIndexForSys],arrayToBeSorted[findIndexForDia]]

   return arrayToBeSorted;
  }//end of method

  get vitalList(): FormArray {
    return this.vitalDataForm.get('vitalList') as FormArray;
  }
  createForm() {
    let form: FormGroup[] = [];
    // this.vitalDataForm = this.fb.group({
    //   vitalPk: [null],
    //   vitalName: [null],
    //   vitalValue:[null]
    // });
    this.vitalDataForm = this.fb.group({
      isModified: [true],
      vitalList: this.fb.array(form)
    });

    

    return this.vitalDataForm;

    

    
    // for(let i = 0;i<this.vitalName.length;i++){
    //   vitalArr.push(this.fb.group({
    //     vName: [null]
    //   })
    //   );
    // }

    // this.vitalDataForm = this.fb.group({
    //   findingList: this.fb.array(this.vitalArr),
    // });

    
  }
  
  createItem(): FormGroup {

    let grp = this.fb.group({
      vitalPk: [null],
      vitalName: [null],
      vitalValue:[null]
    });
    return grp;
  }

  editForm(res, index): FormGroup {
    return this.fb.group({
      longName: [res.medicalAttributeName],
      medicalAttributePk: [res.medicalAttributePk],
      result:[res.result],
      userPk: [res.userPk],
      //id: [res.id],
      source: [res.source],
      triggerPk: [res.triggerPk],
      originalFileName: [res.originalFileName],
      storageKeyName: [res.storageKeyName],
      medicalAttributeName: [res.medicalAttributeName],
      // createdBy: [res.createdBy],
      // createdDate: [res.createdDate],
      // modifiedDate:[res.modifiedDate],
      // modifiedBy: [res.modifiedBy],
      testDate: [res.testDate],
      unit: [res.unit],
      systemCode: [res.systemCode]
    })
  }

  // get vitalList(): FormArray {
  //   return this.vitalDataForm.get('vitalList') as FormArray;
  // }

  savePrescription()
  {
    this.vitalData = this.vitalDataForm;
    //this.vitalData = this.vitalList;
    
    console.log("1st");
    console.log('KK'+this.vitalData);
    
    //this.getFormData.emit(this.vitalDataForm);
    this.getFormData.emit(this.vitalData);
    console.log("2nd");
    console.log(this.vitalDataForm.value);
    
    //this.modalService.close(id);
    this.modalRef.hide();
  }

  openModal() {
      this.text = [];
      //this.modalService.open(id);
      this.modalRef = this.bsModalService.show(this.vitalModal, this.config);
  }

  closeModal() {
    this.modalRef.hide();
  }

}
