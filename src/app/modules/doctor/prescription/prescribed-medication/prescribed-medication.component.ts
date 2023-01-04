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
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef,Renderer2 } from '@angular/core';
import { DoctorService } from '../../doctor.service';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { first } from 'rxjs/operators';
import { IndividualService } from '../../../individual/individual.service';

@Component({
  selector: 'app-prescribed-medication',
  templateUrl: './prescribed-medication.component.html',
  styleUrls: ['./prescribed-medication.component.css', '../../prescription/prescription.component.css']
})
export class PrescribedMedicationComponent implements OnInit {

  durationUnitList : any;
  dosageDurationList : any;
  doctorPrescribedMedicationForm : FormGroup;
  prescribedMedicineList : any;
  isDuplicateMedicine: any;
  results: any; //---Autocomplete Medicine name list

  @Input() medicationForm:any;
  @Input() userRefNo: any;
  @Input() doctorRefNo: any;
  @Input() genericFlag: any; // Working on app/issues/2145
  @Output() getFormData = new EventEmitter<FormGroup>();
  medicationData: any;
  @ViewChild('doctorPrescribedMedicationModal') doctorPrescribedMedicationModal: TemplateRef<any>;
  modalRef: BsModalRef;
  config = {
    class: 'custom-modal-width-95-prescription modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  submitted: boolean = false;
  enableSos: any;
  enableFrequency: any;
  clickedEvents: any;
  unitType: any = [];
  repeatMedication: any = [];
  displaySidebar: boolean = false;
  showSubstituteMedicineIcon: any;
  displaySidebarMedicine: boolean = false;
  clickedEvent: any = [];

  constructor(private _doctorService: DoctorService,private fb: FormBuilder, 
    private modalService: ModalService, private bsModalService: BsModalService,
    private _individualService : IndividualService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    //this.allModelAttributeValuesForMedication();
    this.getDosageDurationList();
    this.getDurationUnitList();
    this.getRepeatMedication(this.userRefNo, this.doctorRefNo);
    this.unitType = ['vial', 'ml', 'tabs', 'drop'];
    if(this.medicationForm==null){
      this.createForm();
    }
    //this.prescribedMedicineList = null;
    this.isDuplicateMedicine = [];
    this.enableSos = [];
    this.enableFrequency = [];
    this.showSubstituteMedicineIcon = [];
    /* ******** Auto save modification ******* */
    // If anything changed on Prescribed Medication Form
    this.doctorPrescribedMedicationForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorPrescribedMedicationForm.dirty){
        this.doctorPrescribedMedicationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorPrescribedMedicationForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
      
  })
  /* ******** End of Auto save modification ******* */

  this.clickedEvents = [];

  }

  ngOnChanges(){
    if(this.medicationForm==null || this.medicationForm.length == 0){
      this.createForm();
    }
    else{
      let medicineArray: any = [];
      if(this.medicationForm.length > 0){
        for(let i =0; i <this.medicationForm.length; i++){
          if(this.medicationForm[i].status == 'NRM'){
            let obs: FormGroup = this.editForm(this.medicationForm[i], i);
            medicineArray.push(obs);
            this.substituteMedicineLength[i] = obs.value.substituteMedicineList.length
            this.showSubstituteMedicineIcon[i] = true; // To show substitute icon on all saved medicine
            if(this.medicationForm[i].sosFlag=="Y")
              this.enableSos[i] = true;
            else
              this.enableSos[i] = false;
          }
          console.log(this.enableSos);
          
         
        }
      }
      this.doctorPrescribedMedicationForm = this.fb.group({
        isModified: [false],
        doctorPrescribedMedicineList: this.fb.array(medicineArray),
        printGenericName: this.genericFlag, //app/issues/2145
      });
      this.prescribedMedicineList = this.doctorPrescribedMedicationForm.value.doctorPrescribedMedicineList;

    }

    /* ******** Auto save modification ******* */
    // If anything changed on Prescribed Medication Form
    this.doctorPrescribedMedicationForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorPrescribedMedicationForm.dirty){
        this.doctorPrescribedMedicationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorPrescribedMedicationForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }
  
  // allModelAttributeValuesForMedication(){
  //   this._doctorService.GetAllModelAttributeValuesForMedication()
  //   .subscribe(res =>{
  //     //console.log(JSON.stringify(res));
  //     this.dosageDurationList = res.data[0];
  //     this.durationUnitList = res.data[1];
  //   });
  // }

  getDosageDurationList(){
    this._doctorService.getDosageDurationList()
    .subscribe(res =>{
      //console.log(res);
      this.dosageDurationList = res.masterDataAttributeValues;
      
    });
  }
  getDurationUnitList(){
    this._doctorService.getDurationUnitList()
    .subscribe(res =>{
      //console.log(res);
      this.durationUnitList = res.masterDataAttributeValues;
      
    });
  }

  openModal() {
    //this.modalService.open(id);
    this.modalRef = this.bsModalService.show(this.doctorPrescribedMedicationModal, this.config);
  }

  saveMedicine() {
    this.submitted = true;
    if(this.doctorPrescribedMedicationForm.invalid){
      return;
    }
    this.modalRef.hide();
    //this.modalService.close(id);
    //console.log("length = "+this.doctorPrescribedMedicineList.length);
    //console.log(this.doctorPrescribedMedicationForm.value);
    this.prescribedMedicineList = this.doctorPrescribedMedicationForm.value.doctorPrescribedMedicineList;
    this.medicationData = this.doctorPrescribedMedicationForm.value;
    this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
  }
  
  closeModal() {
    this.modalRef.hide();
  }

  createForm() {
    let medicineArr: FormGroup[] = [];
    for(let i = 0;i<1;i++){
        let subMedicineArr: FormGroup[] = [];
        for(let j = 0;j<1;j++){
          subMedicineArr.push(this.fb.group({
            medicineId: [null],  
            medicineName: [null]
          }));
        }
        medicineArr.push(this.fb.group({
          medicationPk: [null],
          medicationDetailsPk: [null],  
          medicineId: [null],  
          medicineName: [null, Validators.required],
          dosageFrequency: [1], //Working on app/issues/655
          dosageInterval: ['D'],
          duration: [1], //Working on app/issues/655
          durationUnit: ['D'],
          timing: [null],
          status: ["NRM"],
          createdDate: [],
          createdBy: [],
          modifiedDate: [],
          modifiedBy: [],
          sosFlag: [],
          beforeAfterMealFlag: [],
          comments: [''],
          noOfUnit: [1],
          unitType: [""],
          substituteMedicineList: [],
          genericName: [null], //app/issues/2145          
      }));
    }

    this.doctorPrescribedMedicationForm = this.fb.group({
      isModified: [true],
      doctorPrescribedMedicineList: this.fb.array(medicineArr),
      printGenericName: this.genericFlag, //app/issues/2145
    });
  }


  createMedicine(): FormGroup {
    let subMedicineArr: FormGroup[] = [];
        for(let j = 0;j<1;j++){
          subMedicineArr.push(this.fb.group({
            medicineId: [null],  
            medicineName: [null]
          }));
        }
    return this.fb.group({
        medicationPk: [null],
        medicationDetailsPk: [null],  
        medicineId: [null],
        medicineName: [null, Validators.required],
        dosageFrequency: [1], //Working on app/issues/655
        dosageInterval: ['D'],
        duration: [1], //Working on app/issues/655
        durationUnit:  ['D'],
        timing: [null],
        status: ["NRM"],
        createdDate: [],
        createdBy: [],
        modifiedDate: [],
        modifiedBy: [],
        sosFlag: [],
        beforeAfterMealFlag: [],
        comments: [''],
        noOfUnit: [1],
        unitType: [""],
        substituteMedicineList: [],
        genericName: [null] //app/issues/2145
    });
  }

  editForm(res, index): FormGroup {
    let substituteMedicineList: any = [];
    for(let i = 0; i< res.substituteMedicineList.length; i++){
      substituteMedicineList.push(res.substituteMedicineList[i]);
    }
    return this.fb.group({
      medicationPk: [res.medicationPk],
      //medicationDetailsPk: [res.medicationDetailsPk],
      medicineId: [res.medicineId],
      medicineName: [res.medicineName, Validators.required],
      dosageFrequency: [res.dosageFrequency==0?null:res.dosageFrequency],
      dosageInterval: [res.dosageInterval],
      duration: [res.duration==0?null:res.duration],
      durationUnit: [res.durationUnit],
      timing: [res.timing],
      status: [res.status],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy],
      sosFlag: [res.sosFlag],
      beforeAfterMealFlag: [res.beforeAfterMealFlag],
      comments: [res.comments],
      noOfUnit: [res.noOfUnit],
      unitType: [res.unitType],
      substituteMedicineList: [substituteMedicineList],
      genericName: [res.genericName] //app/issues/2145
    })
  }

  get doctorPrescribedMedicineList(): FormArray {
    return this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
  }

  addMedicine() {
    this.submitted = false;
    for (let i = 0; i < this.isDuplicateMedicine.length; i++)
      if (this.isDuplicateMedicine[i]) {
        return;
      }
    //Working on app/issues/836
    for(let i = 0; i < this.doctorPrescribedMedicineList.length; i++){
      if (this.doctorPrescribedMedicineList.controls[i].value.medicineId == null) {
        return;
      }
    }
    //End Working on app/issues/836
    this.doctorPrescribedMedicineList.push(this.createMedicine());
    ////console.log(this.doctorPrescribedMedicineList);

    setTimeout(() => {
      const element = this.renderer.selectRootElement('#cell'+(this.doctorPrescribedMedicineList.length-1)+' .medicationStyle');
       element.focus()
    }, 100);

  }

  deleteMedicine(index) {
    //console.log("index = "+index);
    this.substituteMedicineLength[index] = this.substituteMedicineLength[index+1];
    this.showSubstituteMedicineIcon[index] = true;
    for(let i = 0; i < this.frequentMedicineList.length; i++){
      if (this.frequentMedicineList[i].medicineId == this.doctorPrescribedMedicineList.controls[index].get('medicineId').value) {
        this.clickedEvents[i] = false;
      }
    }
    // if(this.doctorPrescribedMedicineList.length == 1){
    //   return;
    // }
    //this.doctorPrescribedMedicineList.controls.splice(index, 1);
    //this.doctorPrescribedMedicationForm.value.doctorPrescribedMedicineList.splice(index, 1);
    if(this.doctorPrescribedMedicineList.controls[index].get('medicineId').value === "" || this.doctorPrescribedMedicineList.controls[index].get('medicineId').value === null){
      this.doctorPrescribedMedicineList.controls[index].get('medicineName').clearValidators();
      this.doctorPrescribedMedicineList.controls[index].get('medicineName').setErrors(null);
      this.doctorPrescribedMedicineList.controls[index].get('medicineName').reset();
      this.doctorPrescribedMedicineList.controls.splice(index, 1);
      this.doctorPrescribedMedicationForm.value.doctorPrescribedMedicineList.splice(index, 1);
    }
    else{
      this.doctorPrescribedMedicineList.controls[index].get('status').setValue("CXL");
      this.doctorPrescribedMedicineList.controls.splice(index, 1);
    }
    // this.substituteMedicineLength[index] = 0;
    // this.showSubstituteMedicineIcon[index] = false;
   //console.log(this.doctorPrescribedMedicationForm.value);
   this.doctorPrescribedMedicationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
   this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
  }

  getMedicineList(event) {
    //console.log(event.query);
    let query = {
      "_source" : ["product_name", "product_composition", "product_id"],
      "query" : {
      "multi_match": {
          "query": event.query,
          "type":  "cross_fields",
          "fields": ["product_name", "product_composition"]
          }
      }
  }      
  ;
     //console.log(query);
     this._individualService.getMedicinesByNameList(event.query).subscribe((data) => {
      //console.log(data)
      this.results = data.data;
      //console.log(this.results)
    });
  }

  setMedicineName(event, index){
    //console.log(event);
    let medicationList = this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
    let medicineForm = medicationList.controls[index] as FormGroup;
    medicineForm.controls.medicineName.patchValue(event.brandName);
    medicineForm.controls.medicineId.patchValue(event.medicineId);
    medicineForm.controls.genericName.patchValue(event.product_composition);
    if(event.packageType == "vial"){
      medicineForm.controls.unitType.patchValue("vial");
    }
    else if(event.packageType == "strip"){
      medicineForm.controls.unitType.patchValue("tabs");
    }
    else if(event.packageType == "bottle"){
      medicineForm.controls.unitType.patchValue("ml");
    }
    else if(event.brandName.includes("Drop") || event.brandName.includes("drop")){
      medicineForm.controls.unitType.patchValue("drop");
    }
    this.showSubstituteMedicineIcon[index]=true;
    this.substituteMedicineForObj[index] = event;
  }

  managePk(medicineName, i){
    let medicationList = this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    for(let i = 0; i < this.frequentMedicineList.length; i++){
      if (this.frequentMedicineList[i].medicineId == medicineForm.controls.medicineId.value) {
        this.clickedEvents[i] = false;
      }
    }
    if(medicineName != medicineForm.controls.medicineName.value){
      medicineForm.controls.medicineId.patchValue("");
    }
    
  }

  toggleSos(event, i){
    let medicationList = this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    if(event.target.checked){
      this.enableSos[i] = true;
      medicineForm.controls.sosFlag.patchValue('Y');
      medicineForm.controls.dosageFrequency.patchValue(null);
      medicineForm.controls.dosageInterval.patchValue(null);
      //Working on app/issues/878
      medicineForm.controls.duration.patchValue(null);
      medicineForm.controls.durationUnit.patchValue(null);
      //End Working on app/issues/878
      //console.log(this.doctorPrescribedMedicationForm.value);
      
    }
    else{
      this.enableSos[i] = false;
      medicineForm.controls.sosFlag.patchValue('N');
      medicineForm.controls.dosageInterval.patchValue('D');
      medicineForm.controls.dosageFrequency.patchValue(1);
      //Working on app/issues/878
      medicineForm.controls.duration.patchValue(1);
      medicineForm.controls.durationUnit.patchValue("D");
      //End Working on app/issues/878

    }
    this.doctorPrescribedMedicationForm.markAsDirty();
  }

  toggleFrequency(event, i){
    let medicationList = this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    if(event.target.checked){
      this.enableSos[i] = false;
      //this.enableFrequency[i] = true;
      medicineForm.controls.sosFlag.patchValue('N');
      medicineForm.controls.dosageInterval.patchValue('D');
    }
    else{
      this.enableSos[i] = true;
      //this.enableFrequency[i] = false;
    }
    this.doctorPrescribedMedicationForm.markAsDirty();
  }
  
  selectTiming(event, i, timing){
    let medicationList = this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    
      if(timing=="A"){
        if(event.target.checked){
          medicineForm.controls.beforeAfterMealFlag.patchValue('A');
        }
        else{
          medicineForm.controls.beforeAfterMealFlag.patchValue(null);
        }
      }
      if(timing=="B"){
        if(event.target.checked){
          medicineForm.controls.beforeAfterMealFlag.patchValue('B');
        }
        else{
          medicineForm.controls.beforeAfterMealFlag.patchValue(null);
        }
      } 
      this.doctorPrescribedMedicationForm.markAsDirty();
    }

    setMedicine(med){
      for(let i = 0; i < this.frequentMedicineList.length; i++){
        if (this.frequentMedicineList[i].medicineId == med.medicineId) {
          this.clickedEvents[i] = true;
        }
      }
      
      //this.substituteMedicineForIndex++;  //Working on app/issues/682
      //Working on app/issues/836
      for(let i = 0; i < this.doctorPrescribedMedicineList.length; i++){
        if (this.doctorPrescribedMedicineList.controls[i].value.medicineId == null) {
          this.doctorPrescribedMedicineList.controls.splice(i, 1)
        }
      }
      //End Working on app/issues/836
      this.showSubstituteMedicineIcon[this.doctorPrescribedMedicineList.length] = true; //Working on app/issues/682
      this.doctorPrescribedMedicineList.push(this.addFrequentMedicine(med));
  
      this.doctorPrescribedMedicationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
    }
    addFrequentMedicine(med): FormGroup {
      return this.fb.group({
        medicationPk: [null],
        medicationDetailsPk: [null],  
        medicineId: [med.medicineId],
        medicineName: [med.medicineName, Validators.required],
        dosageFrequency: [1],  //Working on app/issues/655
        dosageInterval: ['D'],
        duration: [1],  //Working on app/issues/655
        durationUnit:  ['D'],
        timing: [null],
        status: ["NRM"],
        createdDate: [],
        createdBy: [],
        modifiedDate: [],
        modifiedBy: [],
        sosFlag: [],
        beforeAfterMealFlag: [],
        comments: [''],
        noOfUnit: [1],
        unitType: [''],
        substituteMedicineList: [], //Working on app/issues/682
        genericName: [], //Working on app/issues/2145
    });
    }

    frequentMedicineList: any = [];
    notFoundFrequentRecord: boolean = false;
    getFrequentPrescribedMedicineList(){
      let user = JSON.parse(localStorage.getItem('user'));
      // Issue app#647
      let payload = {
        "refNo" : user.refNo
      }
      this._doctorService.getFrequentPrescribedMedicineList(payload).subscribe((data) => {
        //console.log("Frequent Medicine: ");
        //console.log(data.data);
        this.frequentMedicineList = data.data;
        if(this.frequentMedicineList.length > 0){
          for(let i = 0; i < this.frequentMedicineList.length; i++){
            for(let j=0;j<this.doctorPrescribedMedicineList.controls.length;j++){
              if (this.frequentMedicineList[i].medicineId == this.doctorPrescribedMedicineList.controls[j].get('medicineId').value) {
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

    accordianHeader: any = false;
    accordianHeaderClick() {
      if(this.accordianHeader == false) {
        this.accordianHeader = true;
      } else {
        this.accordianHeader = false;
      }
    }


    // Working On app/issues/591

    
  getRepeatMedication(userRefNo, doctorRefNo){
    let payload = {
      "doctorRefNo": doctorRefNo,
      "userRefNo": userRefNo
    }
    this._doctorService.getRepeatMedicationV2(payload).subscribe((data) => {
      //console.log("Repeat Medicine: ");
      //console.log(data.data);
      this.repeatMedication = data.data;
    });
  }

  repeatMedicine(){
    let medicineArray: any = [];
      if(this.repeatMedication.length > 0){
        for(let i =0; i <this.repeatMedication.length; i++){
            let obs: FormGroup = this.editForm(this.repeatMedication[i], i);
            medicineArray.push(obs);
            this.substituteMedicineLength[i] = obs.value.substituteMedicineList.length;
            this.showSubstituteMedicineIcon[i] = true; // To show substitute icon on all repeat medicine
        }
      }
      this.doctorPrescribedMedicationForm = this.fb.group({
        isModified: [true],
        doctorPrescribedMedicineList: this.fb.array(medicineArray)
      });
      this.doctorPrescribedMedicationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
  }


    substituteMedicineFor: any = "";
    substituteMedicineForId: any = "";
    substituteMedicineForIndex: any = "";
    substituteMedicineForObj: any =[];
    substituteMedicationList: any =[];
    openSubstituteMedicineSidebar(medicine, index){
      //console.log(medicine);
      //console.log(medicine.medicineId);
      this._doctorService.getSubstituteMedicineList(medicine.medicineId).subscribe((data) => {
        //console.log("Substitute Medicine: ");
        this.substituteMedicationList = [];
        //console.log(data.data);
        if(data.data.length > 0) 
          this.substituteMedicationList = data.data;
      });
      //console.log(medicine);
      this.displaySidebar =true;
      this.substituteMedicineFor = medicine.medicineName;
      this.substituteMedicineForId = medicine.medicineId;
      this.substituteMedicineForIndex = index;
      this.substituteMedicine[this.substituteMedicineForIndex] = [];
      this.substituteMedicineText = [];
    }

    substituteMedicineData: any
    substituteMedicineText: any = [];
    substituteMedicine: any = [];
    substituteMedicineLength: any = [];
    setSubstituteMedicine(medicine){
      //console.log(medicine);
      
      let medicationList = this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
      let medicineForm = medicationList.controls[this.substituteMedicineForIndex] as FormGroup;
      ////console.log(medicineForm.controls.substituteMedicineList.value.length);
      // Working on app/issues/719
      this.substituteMedicineText = [];
      if(medicineForm.controls.substituteMedicineList.value!=null && medicineForm.controls.substituteMedicineList.value.length > 0){
        let data = {}
        for(let i=0;i<medicineForm.controls.substituteMedicineList.value.length;i++){
          data = {
            "medicineId": medicineForm.controls.substituteMedicineList.value[i].medicineId,
            "medicineName": medicineForm.controls.substituteMedicineList.value[i].medicineName
          }
          this.substituteMedicineText.push(data); 
        }
      }
      //End Working on app/issues/719
      this.substituteMedicineData = {
        "medicineId": medicine.product_id,
        "medicineName": medicine.product_name
      }
      this.substituteMedicineText.push(this.substituteMedicineData); 
      
      // medicineForm.patchValue({
      //   substituteMedicineList: this.substituteMedicineText
      // })
      medicineForm.controls.substituteMedicineList.patchValue(<FormArray>this.substituteMedicineText);
      //console.log(medicineForm);
      
      
     // this.substituteMedicine[this.substituteMedicineForIndex] = this.substituteMedicineText;
      this.substituteMedicineLength[this.substituteMedicineForIndex] = medicineForm.controls.substituteMedicineList.value.length
      this.doctorPrescribedMedicationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
	  
	  for(let i =0; i <this.substituteMedicationList.length; i++){
		  if(medicine.product_id == this.substituteMedicationList[i].product_id){
			this.clickedEvents[i] = true;
		  }	 
	   }
	  
	  
    }

    removeSubstituteMedicine(medicine, rowIndex, index){
		
	  this._doctorService.getSubstituteMedicineList(medicine.medicineId).subscribe((data) => {
			if(data.data.length > 0) this.substituteMedicationList = data.data;
		});	
		
      let medicationList = this.doctorPrescribedMedicationForm.get('doctorPrescribedMedicineList') as FormArray;
      let medicineForm = medicationList.controls[rowIndex] as FormGroup;
      
      medicineForm.value.substituteMedicineList.splice(index, 1);
      this.substituteMedicineLength[rowIndex] = medicineForm.controls.substituteMedicineList.value.length
      this.doctorPrescribedMedicationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      this.getFormData.emit(this.doctorPrescribedMedicationForm.value);
     // this.doctorPrescribedMedicineList.controls.splice(index, 1);
	 
	 
	 for(let i =0; i <this.substituteMedicationList.length; i++){
		  if(medicine.medicineId == this.substituteMedicationList[i].product_id){
			  //console.log(medicine.medicineId);
			   //console.log(this.substituteMedicationList[i].product_id);
			   this.clickedEvents[i] = false;
		  }	 
	   }
	 
	 
    }


    //End Working On app/issues/591
	
	freqPrescMedicine(){
    this.displaySidebarMedicine=true;
    this.getFrequentPrescribedMedicineList();
  }
  
  // Working on app/issues/2145
  //showGenericFlag:any=null;
  setGenericFlag(event){
    if(event.target.checked){
      this.genericFlag="Y";
      this.doctorPrescribedMedicationForm.patchValue({
        printGenericName: "Y"
      })
    }
    else{
      this.genericFlag="N";
      this.doctorPrescribedMedicationForm.patchValue({
        printGenericName: "N"
      })
    }
  }
  //End Working on app/issues/2145
}
