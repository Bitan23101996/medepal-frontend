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

import { Component, OnInit, Input, Output, EventEmitter,Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { HttpResponse, HttpRequest, HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { SBISConstants } from 'src/app/SBISConstants';
import { ToastService } from '../../../../core/services/toast.service';
import { DoctorService } from '../../doctor.service';

@Component({
  selector: 'app-immunization',
  templateUrl: './immunization.component.html',
  styleUrls: ['./immunization.component.css', '../../prescription/prescription.component.css']
})
export class ImmunizationComponent implements OnInit {

  @Input() vaccineList;
  @Input() vaccinationInput;
  @Input() prescriptionDetail: any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  showVaccinationSidebar: boolean = false;
  vaccinationForm: FormGroup;
  dtFormat: any;
  filteredVaccine: any;
  isDuplicateVaccine: any;
  clickedEvent: any = [];
  vacList: any;
  prescriptionRefNo:any = null;
  submitted:boolean = false;
  fileName: any;
  apiUrl = environment.apiUrl;

   // app/issues/2135
   frequentVaccineList: any = [];
   displaySidebarFreq: boolean = false;
   notFoundFrequentRecord: boolean = false;
   clickedFreqEvents: any;
   // End app/issues/2135

  constructor(private _doctorService: DoctorService, private fb: FormBuilder,private renderer: Renderer2,private toastService:ToastService, private http: HttpClient) { }

  ngOnInit() {
    this.fileName = [];
    if(this.vaccinationInput==null){
      this.createForm();
    }
    this.dtFormat = environment.DATE_FORMAT;
    this.isDuplicateVaccine = [];
    this.clickedFreqEvents = []; //app#2135
    /* ******** Auto save modification ******* */
    // If anything changed on Test Form
    this.vaccinationForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.vaccinationForm.dirty){
        this.vaccinationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.vaccinationForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.vaccinationForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }

  ngOnChanges(){
    if(this.vaccinationInput==null || this.vaccinationInput.length == 0){
      this.createForm();
    }
    else{
      let vaccineArray: any = [];
      if(this.vaccinationInput.length > 0){
        for(let i =0; i <this.vaccinationInput.length; i++){
          let obs: FormGroup = this.editForm(this.vaccinationInput[i], i);
          vaccineArray.push(obs);
         
        }
      }
      this.vaccinationForm = this.fb.group({
        isModified: [false],
        vaccinationList: this.fb.array(vaccineArray)
      });
      this.vacList = this.vaccinationForm.value.vaccinationList;
    }
    /* ******** Auto save modification ******* */
    this.vaccinationForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.vaccinationForm.dirty){
        this.vaccinationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.vaccinationForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.vaccinationForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }

  createForm() {
    // /sbis-poc/app/issues/729
    let vacArr: FormGroup[] = [];
    for(let i = 0;i<1;i++){
      vacArr.push(this.fb.group({
        id: [null],
        vaccinePk: [null],
        vaccineName: [null],
        vaccineCode: [null],
        userRefNo: [null],
        vaccinationDate:[null],
        doesNo: [null],
        prescriptionRefNo: [null],
        source: ["PRC"],
        fileName: [null]
      })
      );
    }

    this.vaccinationForm = this.fb.group({
      isModified: [true],
      vaccinationList: this.fb.array(vacArr),
    });
  }

  editForm(res, index): FormGroup {
    // /sbis-poc/app/issues/729
    return this.fb.group({
        id: [res.id],
        vaccinePk: [res.vaccinePk],
        vaccineName: [res.vaccineName],
        vaccineCode: [res.vaccineCode],
        //vaccinationDate:[res.vaccinationDate],
        doesNo: [res.doesNo],
        source: [res.source],
        fileName: [res.fileName]
    })
  }

  get vaccinationList(): FormArray {
    return this.vaccinationForm.get('vaccinationList') as FormArray;
  }

  addVaccine() {
    for(let i = 0; i < this.vaccinationList.length; i++){
      if (this.vaccinationList.controls[i].value.vaccinePk == null && this.vaccinationList.controls[i].value.vaccineName == null ) {
        return;
      }
    }
    //End Working on app/issues/836
    this.vaccinationList.push(this.addEmptyVaccination());

    setTimeout(() => {
      const element = this.renderer.selectRootElement('#cell'+(this.vaccinationList.length-1)+' .vaccineStyle');
       element.focus()
    }, 100);

  }

  addEmptyVaccination(): FormGroup {
    // /sbis-poc/app/issues/729
    return this.fb.group({
        id: [null],
        vaccinePk: [null],
        vaccineName: [null],
        vaccineCode: [null],
        userRefNo: [null],
        vaccinationDate:[null],
        doesNo: [null],
        prescriptionRefNo: [null],
        source: ["PRC"],
        fileName: [null]
    });
  }
  addVaccination(vaccine): FormGroup {
    // /sbis-poc/app/issues/729
    return this.fb.group({
        id: [null],
        vaccinePk: [vaccine.vaccinePk],
        vaccineName: [vaccine.vaccineName],
        vaccineCode: [vaccine.vaccineCode],
        userRefNo: [null],
        vaccinationDate:[null],
        doesNo: [null],
        prescriptionRefNo: [null],
        source: ["PRC"],
        fileName: [null]
    });
  }

  setVaccine(vaccine){
    console.log(vaccine);
    for(let i = 0; i < this.vaccineList.length; i++){
      if (this.vaccineList[i].vaccinePk == vaccine.vaccinePk) {
        this.clickedEvent[i] = true;
      }
    }
    for(let i = 0; i < this.vaccinationList.length; i++){
      if (this.vaccinationList.controls[i].value.vaccinePk == null && this.vaccinationList.controls[i].value.vaccineName == null ) {
        this.vaccinationList.controls.splice(i, 1)
      }
    }

    this.vaccinationList.push(this.addVaccination(vaccine));
    // this.showVaccinationSidebar = false;
    this.vaccinationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
    this.getFormData.emit(this.vaccinationForm.value);
  }

  openVaccinationList(){
    this.showVaccinationSidebar = true;
  }

  getVaccineList(event){
    // this.filteredVaccine = [];
    // for(let i = 0; i < this.vaccineList.length; i++) {
    //     let vaccine = this.vaccineList[i];
    //     if(vaccine.vaccineName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //         this.filteredVaccine.push(vaccine);
    //     }
    // }
    console.log(event.query);
    this._doctorService.getAllVaccineByName(event.query).subscribe((data) => {
      console.log(data.data);
      this.filteredVaccine = data.data;
    });
  }

  setVaccineName(event, i){
    console.log(event);
    for(let i = 0; i < this.vaccineList.length; i++){
      if (this.vaccineList[i].id == event.id) {
        this.clickedEvent[i] = true;
      }
    }
    let vaccineList = this.vaccinationForm.get('vaccinationList') as FormArray;
    let vaccineForm = vaccineList.controls[i] as FormGroup;
    vaccineForm.controls.vaccineName.patchValue(event.vaccineName);
    vaccineForm.controls.vaccinePk.patchValue(event.vaccinePk);
    
    for (let num = 0; num < this.vaccinationList.controls.length; num++) {
      if (num == i) {
        continue;
      }
      if (this.vaccinationList.controls[num].value.vaccinePk === this.vaccinationList.controls[i].value.vaccinePk) {
        let vaccineList = this.vaccinationForm.get('vaccinationList') as FormArray;
        let vaccineForm = vaccineList.controls[i] as FormGroup;
        vaccineForm.controls.vaccineName.patchValue(null);
        vaccineForm.controls.vaccinePk.patchValue(null);
        this.isDuplicateVaccine[i] = true;
        console.log(this.vaccinationForm.value);
        
      }
      else {
        this.isDuplicateVaccine[i] = false;
      }
    }
  }

  deleteVaccine(index) {
    // if(this.vaccinationList.length == 1){
    //   return false;
    // }
    for(let i = 0; i < this.vaccineList.length; i++){
      if (this.vaccineList[i].vaccinePk == this.vaccinationList.controls[index].get('vaccinePk').value) {
        this.clickedEvent[i] = false;
      }
    }
    for(let i = 0; i < this.frequentVaccineList.length; i++){
      if (this.frequentVaccineList[i].vaccineName == this.vaccinationList.controls[index].get('vaccineName').value) {
        this.clickedFreqEvents[i] = false;
      }
    }
    console.log("index = "+index);
    if(this.vaccinationList.controls[index].get('vaccinePk').value === "" || this.vaccinationList.controls[index].get('vaccinePk').value === null){
      this.vaccinationList.controls.splice(index, 1);
      this.vaccinationForm.value.vaccinationList.splice(index, 1);
    }
    else{
      //this.vaccinationList.controls[index].get('status').setValue("CLX");
      this.vaccinationList.controls.splice(index, 1);
      // sbis-poc/app/issues/1151
      this.vaccinationForm.value.vaccinationList.splice(index, 1);
    }
   console.log(this.vaccinationForm.value);
   this.vaccinationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
   this.getFormData.emit(this.vaccinationForm.value);
  }

  managePk(vaccineName, i){
    
    let vaccineList = this.vaccinationForm.get('vaccinationList') as FormArray;
    let vaccineForm = vaccineList.controls[i] as FormGroup;
    for(let i = 0; i < this.vaccineList.length; i++){
      if (this.vaccineList[i].vaccinePk == vaccineForm.controls.vaccinePk.value) {
        this.clickedEvent[i] = false;
      }
    }
    if(vaccineName != vaccineForm.controls.vaccineName.value){
      vaccineForm.controls.vaccinePk.patchValue(null);
    }
    
  }

    // Working on app/issues/937

    uploadVaccineReport(event,vaccinePosition,vaccineDetails)
    {
      let vacList = this.vaccinationForm.get('vaccinationList') as FormArray;
      let vacForm = vacList.controls[vaccinePosition] as FormGroup;
       //vacForm.value.vaccineReport

       if(vacForm.value.vaccineName==null || vacForm.value.vaccineName.trim==""){
        this.toastService.showI18nToast("Please add a vaccine first" , 'warning');
        return;
       }

      const file = event.target.files[0];
      if (Math.round(file.size / 1024) > 500) {      
        this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
        return;
      }
      let formdata = new FormData();
      formdata.append('file', file);
  
      console.log("vaccinationForm:::", this.vaccinationForm);
  
      console.log("vaccineDetails:::",vaccineDetails);
  
      vacForm.controls.fileName.patchValue(file.name);
  
      if (this.prescriptionDetail) {
        let prescriptionForm = this.prescriptionDetail.value;
        this.prescriptionRefNo= prescriptionForm.prescriptionRefNo || this.prescriptionRefNo;
        if (this.prescriptionRefNo!=null) {       
          
          this.saveVaccineReport(formdata,this.prescriptionRefNo,vaccinePosition);
        }
        else{
            this.generatePrescription(formdata,vaccinePosition);
        }      
      } 
    }
  
  
  
    generatePrescription(formdata,vaccinePosition){
      let prescriptionForm = this.prescriptionDetail.value;
      
      let createPrescriptionBody = {
        "appointmentRefNo": prescriptionForm.appointmentRefNo,
        "doctorRefNo": prescriptionForm.doctorRefNo,
        "userRefNo": prescriptionForm.userRefNo,
        "isDraft": "Y",
        "prescriptionRefNo": this.prescriptionRefNo,
      }
      let prescriptionRefNo: string;
      // console.log("createPrescriptionBody", createPrescriptionBody);
      this._doctorService.autoSavePrescription(createPrescriptionBody).subscribe(data => {
        console.log("Autosave from Vaccine");
        console.log(data);
        this.prescriptionRefNo = data['data'].prescriptionRefNo;
        if (data['status'] == '2000')
        this.saveVaccineReport(formdata,data['data'].prescriptionRefNo,vaccinePosition)
      });
    }
  
  
    saveVaccineReport(formdata,prescriptionRefNo,vaccinePosition)
    {
      let currentUser=JSON.parse(localStorage.getItem("user"));
      
      console.log(" currentUser:::", currentUser);
      console.log(" currentUser.refNo:::", currentUser.refNo);
  
  
      let vacList = this.vaccinationForm.get('vaccinationList') as FormArray;
      let vacForm = vacList.controls[vaccinePosition] as FormGroup;
      vacForm.value.vaccineReport
      console.log("vacForm::",vacForm);
      
  
      let documentDtoList = JSON.stringify({
        "id" : vacForm.value.id,
        "userRefNo": currentUser.refNo,
        "vaccinePk": vacForm.value.vaccinePk,
        "vaccineName": vacForm.value.vaccineName,
        "doseNo"   : vacForm.value.doesNo,
        "status"   : "NRM",
        "source"   : "PRC",
        "prescriptionRefNo": prescriptionRefNo,
        "vaccinationDate":this.prescriptionDetail.value.prescriptionDate,
        "fileUploadFor" :SBISConstants.IMAGE_UPLOAD_CONST.VACCINE_REPORT   
     });
     
     formdata.append('document', documentDtoList);
      this.saveDocument(formdata).subscribe(event => {
        if (event instanceof HttpResponse) {
          let response = JSON.parse(event.body);
          if (response.status = 2000) {
            this.toastService.showI18nToast(response.message,"success");          
            
          } else {
            this.toastService.showI18nToast(response.message, 'error')
          }
  
        }
      });
    }
  
    saveDocument(formData:any): Observable<any> {
      let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
       // reportProgress: true,
        responseType: 'text'
      });
      return this.http.request(req);
     
    }
    // End Working on app/issues/937
  
     //Working on app/issues/1411 
    generatePdf(vaccineRecord){
      let prescriptionForm = this.prescriptionDetail.value;
      this.prescriptionRefNo= prescriptionForm.prescriptionRefNo || this.prescriptionRefNo;
      var fileName = "Report";
      var a = document.createElement("a");

  
      return this.http.get(this.apiUrl+"gen/v2/doctor/generateVaccineReport" + "/" + vaccineRecord.vaccineName + "/" + vaccineRecord.vaccinePk + "/" + this.prescriptionRefNo, { responseType:'blob' }).map((result) => {
            //return new Blob([result], { type: 'application/pdf' });
            var file = new Blob([result], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
              a.href = fileURL;
              a.download = this.fileName;
              a.click();
              window.open(fileURL);
              //console.log(result);
              this.toastService.showI18nToast("Download successful.","success");
        }).toPromise();
      }
  //End Working on app/issues/1411 


  // app/issues/2135
  freqVaccine(){
    this.displaySidebarFreq=true;
    this.getFrequentVaccineList();
  }

  getFrequentVaccineList(){
    this._doctorService.getFrequentVaccineList().subscribe((data) => {
      this.frequentVaccineList = data.data;
  
      if(this.frequentVaccineList.length > 0){
        for(let i = 0; i < this.frequentVaccineList.length; i++){
          for(let j=0;j<this.vaccinationList.controls.length;j++){
            if (this.frequentVaccineList[i].vaccineName == this.vaccinationList.controls[j].get('vaccineName').value) {
            this.clickedFreqEvents[i] = true;
            }
          }
        }
      }
      else{
        this.notFoundFrequentRecord=true;
      }
    });
  }

  setFreqVaccine(v) {
    for(let i = 0; i < this.frequentVaccineList.length; i++){
      if (this.frequentVaccineList[i].vaccineName == v.vaccineName) {
        this.clickedFreqEvents[i] = true;
      }
    }

     for(let i = 0; i < this.vaccinationList.length; i++){
      if (this.vaccinationList.controls[i].value.vaccineName == null) {
        this.vaccinationList.controls.splice(i, 1)
      }
    }

    this.vaccinationList.push(this.addFrequentVaccine(v));
      this.vaccinationForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      this.getFormData.emit(this.vaccinationForm.value);
  }

  addFrequentVaccine(vaccine): FormGroup {
    return this.fb.group({
      id: [null],
        vaccinePk: [vaccine.vaccinePk],
        vaccineName: [vaccine.vaccineName],
        vaccineCode: [vaccine.vaccineCode],
        userRefNo: [null],
        vaccinationDate:[null],
        doesNo: [null],
        prescriptionRefNo: [null],
        source: ["PRC"],
        fileName: [null]
    });
  }
  //End app/issues/2135
}
