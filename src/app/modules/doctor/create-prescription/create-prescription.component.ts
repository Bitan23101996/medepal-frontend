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


import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';

import { FormBuilder, Validators } from '@angular/forms';

import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DoctorService } from '../doctor.service';
import { IndividualService } from '../../individual/individual.service';
import { SBISConstants } from "../../../SBISConstants";
import { GetSet } from 'src/app/core/utils/getSet';
import { CommonPrescriptionComponent } from 'src/app/shared/component/common-prescription/common-prescription.component';
@Component({
  selector: 'app-create-prescription',
  templateUrl: './create-prescription.component.html',
  styleUrls: ['./create-prescription.component.css']
})
export class CreatePrescriptionComponent implements OnInit {
  @ViewChild('createprescriptionModal')
  createprescriptionModal: TemplateRef<any>;
  modalRef: BsModalRef;
  chamberList: any[] = [];
  user_roleName: any
  entityName: string;
  roleList: any = [];
  userRolePk: any;
  fromTime: any;
  toTime: any;
  dtFormat = "";
  masterGender: any = [];
  endTimingErrorFlag: any = false;
  isGender = false;
  isDob = false;
  isName = false;
  doctorRefNo: any;
  mainUser: any;
  countMinor: any;
  parentUser: boolean = false;
  minorCount: any = [];
  @ViewChild('minorModal') minorModal: TemplateRef<any>;
  @ViewChild('prescriptionForm') prescriptionForm: CommonPrescriptionComponent;
  minorUsers: any[] = [];
  displaySidebar: boolean = false;
  dateDisabled: boolean = false;
  isGuardian: boolean = false;
  minorGuardian: any;
  isNewMinor: boolean = false;
  getUserDetails: any;
  associateUser: any;
  isMinorDisable: boolean = false;
  maxDate: Date;
  usingComponentStr: string = "create-prescription";
  isPopulated: boolean = false;
  prescriptionFlag: boolean = false;
  // /sbis-poc/app/issues/1119
  isPopulateOnlyPatientDetails: boolean = false;
  createPrescription = this.fb.group({
    appointmentRefNo: [null],
    appointmentByRefNo: null,
    patientDateOfBirth: [null],
    patientGender: [null, [Validators.required]],
    chamberRefNo: [''],
    doctorRefNo: [null],
    status: ['NRM'],
    remarks: null,
    appointmentDate: new Date(),
    appointmentTime: [null],
    appointmentDateStr: [null],
    totalFees: [null],
    patientName: [null, [Validators.required]],
    appointmentState: [null],
    doctorChamber: [null],
    isExistingInUser: [false],
    patientContactNo: [null, [Validators.required]],
    existingrolePk: [null],
    patientRefNo: [null],
    entityName: [this.entityName],
    isSerial: [false],
    forMinor: [false],
    guardianName: [null],
    isMinor: [null],
    guardianContactNo: [null],
    guardianEmailId: [null],
    minorRelationship: [null],
    patientAgeInMonth: [null],
    patientEmailId: [null],
    referredBy: [null], //Working on app/issues/937
    userAddressPk: [null],
    addressForm: this.fb.group({
      id:[null],
      line1: [null, [Validators.minLength(5), Validators.maxLength(100)]],
      line2: [null],
      country: ['India'],
      state: [null],
      city: [null, [Validators.minLength(3), Validators.maxLength(50)]],
      pinCode: [null, [Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      addressType: ['Inpatient'],
      isSubmit: [false],
      isDirty: [false]
    }),
    onlineConsultationFlag: [false]
  });
  submitted: boolean = false;
  pageHeadingInfoName: string = 'prescription';

  constructor(private bsModalService: BsModalService, private http: HttpClient,
    private fb: FormBuilder, private _toastService: ToastService, private _doctorService: DoctorService,
    private broadcastService: BroadcastService, private authService: AuthService, private router: Router, private individualService: IndividualService, ) {

  }

  ngOnInit() {
    this.broadcastService.setHeaderText('New Prescription');
    this.prescriptionFlag = true;
    this.dtFormat = environment.DATE_FORMAT;
    this.maxDate = new Date();
    let user = JSON.parse(localStorage.getItem('user'));
    this.doctorRefNo = user.refNo;
    this.user_roleName = user.roleName;
    this.entityName = user.entityName;
    this._doctorService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.GENDER }).subscribe(data => {
      if (data.status === 2000) 
        this.masterGender = data.data;
    });   
    var request = {
      "refNo": user.refNo
    }
    this._doctorService.getAllChamberByDoctorRefNo(request).subscribe(
      result => {
        this.chamberList = result.data;
        return;
      });
    //sbis-poc/app/issues/721
    let patientDetails = JSON.parse(localStorage.getItem('patientDetails'));
    localStorage.removeItem('patientDetails')
    if (patientDetails != null) {
      // /sbis-poc/app/issues/1119
      this.isPopulateOnlyPatientDetails = true;
      this.createPrescription.patchValue({
        patientContactNo: patientDetails.contactNo
      });
      if(patientDetails.contactNo!=null){
        this.prescriptionForm.populatePatientDetailsByPhone(patientDetails.contactNo);
      }
      else{
        this.prescriptionForm.populateAssociatedPatientDetailsByRefNo(patientDetails.userRefNo);
      }
    }
  }
  //end of oninit

  emitUserDetails(event) {
    this.getUserDetails = event;
  }

  emitDisplaySidebar(event) {
    this.displaySidebar = event;
  }

  guardianDitailsForMinor() {
    if (this.createPrescription.value.forMinor) {
      this.isNewMinor = false;
    } else {
      let contactNo = this.createPrescription.value.guardianContactNo;
      this.createPrescription.patchValue({
        'patientContactNo': contactNo
      });
      this.isNewMinor = false;
    }
  }//end of method
  savecreatePrescription() {
   /* if (this.createPrescription.get("patientAgeInMonth").value != null && this.createPrescription.get("patientAgeInMonth").value != "") {
      let dob = +this.createPrescription.get("patientAgeInMonth").value;
      let patientDateOfBirth = new Date();
      patientDateOfBirth.setFullYear(patientDateOfBirth.getFullYear() - dob);
      this.createPrescription.patchValue({
        patientDateOfBirth: patientDateOfBirth.toString()
      });
    } */
    //some change has been added bcz of procedure note
    if (this.procedureFlag)
    this.createProcedure();
    
    else {
      var d = new Date();
      d.getHours();
      d.getMinutes();
      d.getSeconds();   
      
      // let diff = this.getDOBDiff(d);
      this.createPrescription.patchValue({
        entityName: this.entityName
      });
      let presForm = this.createPrescription.value; 

      let addressForm =  presForm.addressForm;
      console.log(addressForm);
      if(addressForm.pinCode=="" && addressForm.line1=="" && addressForm.state=="" 
        && addressForm.city=="" && addressForm.addressType==""){
          this.createPrescription.controls.addressForm.patchValue({
            isSubmit: false
          })
      }
      else{
        this.createPrescription.controls.addressForm.patchValue({
          isSubmit: true
        })
      }
      if(addressForm.pinCode!="" && addressForm.line1!="" && addressForm.state!="" 
        && addressForm.city!="" && addressForm.addressType!=""){
          // this.createPrescription.controls.addressForm.patchValue({
          //   isSubmit: true
          // })
      }
      else if(addressForm.pinCode=="" && addressForm.line1=="" && addressForm.state=="" 
      && addressForm.city=="" && addressForm.addressType==""){
        // this.createPrescription.controls.addressForm.patchValue({
        //   isSubmit: false
        // })
      }
      else{
        this._toastService.showI18nToast('Must enter full address information or none' , "error");
        return;
      }
      this.createPrescription.controls.addressForm.patchValue({
        isDirty: this.createPrescription.controls.addressForm.dirty
      })
      console.log(addressForm);
          
      // console.log(presForm);
      // #916 prescription save changes
      if (presForm.patientGender == null || presForm.chamberRefNo == '') {//changed bcz there was no star mark beside the patient name field
        this._toastService.showI18nToast('VALIDATION.SPECIFY_PATIENT_DETAILS', "error");
        return;
      }
      if(presForm.patientName == '' || presForm.patientName == null || !presForm.patientName){
        this._toastService.showI18nToast('Please enter patient name', "error");
        return; 
      }
     //start new add 
      if (!presForm.forMinor) {
        if(!presForm.patientContactNo){
          this._toastService.showI18nToast('Please enter patient mobile no', "error");
          return;
        }
      }
      //end of new add

      let minorValidation = this.minorValidation(presForm);//calling a method to check minor validation
      if(!minorValidation && minorValidation!= undefined){
        return;
      }

      if (this.getUserDetails.status == 5001 && presForm.forMinor == false) {
        if (presForm.patientName == '' || !presForm.patientName) {
          this._toastService.showI18nToast('please enter patient name', "error");
          return;
        }
      }    

      let request = {
        "chamberRef": this.createPrescription.value.chamberRefNo
      }

      //Step 1: Find chamber details
      //Step 2: Create prescription + book appointment
      this._doctorService.getDoctorChamberv3(request).subscribe((res) => {
       if (res.status != 2000) {
          this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
          return;
        }
        let appointmentTime = this.zeroPad(d.getHours()) + ":" + this.zeroPad(d.getMinutes()) + ":" + this.zeroPad(d.getSeconds());
        d.setMinutes(d.getMinutes() + res.data['averageVisitDuration']);
        d = new Date(d);
       let appointmentDateStr = this.convert(this.createPrescription.value.appointmentDate.toString());
        let query = {};
        query = {
          'patientDateOfBirth': presForm.patientDateOfBirth,
          'patientGender': presForm.patientGender,
          'patientName': presForm.patientName,
          'doctorRefNo': this.doctorRefNo,
          'entityName': 'INDIVIDUAL',
          'appointmentTime': appointmentTime,
          'appointmentDateStr': appointmentDateStr,
          'chamberRefNo': presForm.chamberRefNo,
          'isSerial': presForm.isSerial,
          'referredBy': presForm.referredBy, //Working on app/issues/937
          'patientContactNo': presForm.patientContactNo? presForm.patientContactNo: null,
          'userAddressPk' : presForm.userAddressPk, //app#2367
          'addressForm': this.createPrescription.controls.addressForm.value,
          'onlineConsultation': (presForm.onlineConsultationFlag == true) ? 'Y' : 'N'
        }
        if (presForm.patientDateOfBirth == null) {
          query['patientAgeInMonth'] = presForm.patientAgeInMonth * 12;
        }
        if (this.getUserDetails.status == 2000) {
          query['appointmentByRefNo'] = presForm.appointmentByRefNo? presForm.appointmentByRefNo: null;
          query['patientRefNo'] = presForm.patientRefNo? presForm.patientRefNo: null;
          if (this.associateUser && this.associateUser.name == 'Other') {
            query['patientContactNo'] = null;//presForm.patientContactNo;
          }          
        } else if (this.getUserDetails.status == 5001) {
          query['userContactNo'] = presForm.patientContactNo;          
        }
        this._doctorService.saveCreatePrescriptionByDoctorV3(query).subscribe((res) => {
          if (res.status == 2000) {
            // sbis-poc/app/issues/1074
            localStorage.setItem("userRefNo", res['data'].userRefNo);
            localStorage.setItem("appointmentRefNo", res['data'].appointmentRefNo);
            this.router.navigate(['doctor/prescription']);
          } else {
            this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
            return;
          }
        });
      });
    }
  }
  getDOBDiff(d): any {//method to get dob diff
    let dob = this.createPrescription.get('patientDateOfBirth').value;
    let diff = null;

    if (dob != null) {
      var dateOfBirth = new Date(dob);
      diff = d.getFullYear() - dateOfBirth.getFullYear();
    } else {
      diff = this.createPrescription.get('patientAgeInMonth').value;
    }

    return diff;
  }//end of method
  zeroPad(num) {
    if (num.toString().length == 1) {
      num = '0' + num;
    }
    return num;
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }

  timeValidation(startTime, endTime, label) {
    let startTimeTmp = startTime.replace(/:/g, '');
    startTimeTmp = startTimeTmp.substring(0, 4);
    let endTimeTemp = endTime.replace(/:/g, '');
    endTimeTemp = endTimeTemp.substring(0, 4);
    let hourStartTime = startTimeTmp.substring(0, 2);
    let minuteStartTime = startTimeTmp.substring(2, 4);
    let totalMinuteStartTime = parseInt(hourStartTime) * 60 + parseInt(minuteStartTime);

    let hourEndTime = endTimeTemp.substring(0, 2);
    let minuteEndTime = endTimeTemp.substring(2, 4);
    let totalMinuteEndTime = parseInt(hourEndTime) * 60 + parseInt(minuteEndTime);
    //let timeDiff =  totalMinuteEndTime- totalMinuteStartTime;
    if (totalMinuteStartTime >= totalMinuteEndTime) {
      this.endTimingErrorFlag = true;
      return this.endTimingErrorFlag;
    }
    else {
      this.endTimingErrorFlag = false;
      return this.endTimingErrorFlag;
    }
  }

  emitAssociateUser(event) {
    this.associateUser = event;
  }

  checkMobileLength() {
    let mob = this.createPrescription.value.patientContactNo;
    if (this.createPrescription.value.forMinor) {
      mob = this.createPrescription.value.guardianContactNo;
    }
    if ((mob.length > 3 && mob.length != 13))
      return false;
    else
      return true;
  }

  back() {
    this.router.navigate(['searchPatient']);
  }

  //method to check minor validation
  minorValidation(presForm) {
    if ((this.createPrescription.controls.patientAgeInMonth.value == null
      || this.createPrescription.controls.patientAgeInMonth.value.trim == '')
      && this.createPrescription.controls.patientDateOfBirth.value == null) {
      this._toastService.showI18nToastFadeOut("Please enter date of birth or age.", "error");
      return false;
    }
     
      if(presForm.forMinor && !presForm.patientName){
        this._toastService.showI18nToast('please enter patient name', "error");
        return false;
      }      
  }//end of method

  //issue number 765
  procedureFlag: boolean = false;
  secondHeading: String = "New Procedure Record";

  createProcedure() {//method to route to proicedure page
    let presForm = this.createPrescription.value;
    if ((presForm.patientDateOfBirth || presForm.patientAgeInMonth) && presForm.patientName && presForm.patientGender) {
      let age = "";
      if(presForm.patientDateOfBirth){
        const bdate = new Date(presForm.patientDateOfBirth);
        const timeDiff = Math.abs(Date.now() - bdate.getTime());
        age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
      }else
        age = presForm.patientAgeInMonth + "Y";
      let patientRefNo = null;
      if (presForm.forMinor) {
        //new add for minor 
        let minorValidation = this.minorValidation(presForm);//calling a method to check minor validation
        if(!minorValidation && minorValidation!= undefined){
          return;
        }
        var d = new Date();
        d.getHours();
        d.getMinutes();
        d.getSeconds();

        let diff = this.getDOBDiff(d);
        let query = {
          'name': presForm.patientName,
          'contactNo': null,
          'emailAddress': null,
          'dateOfBirth': presForm.patientDateOfBirth,
          'relationship': 'Guardian',
          'gender': presForm.patientGender,
          // 'bloodGroup': null,
          'userRefNum': this.getUserDetails.data.individualUserBasicInfo.refNo,
          "guardianDto": []
        }
        if (diff < 18) {
          if(presForm.patientRefNo){
            patientRefNo = presForm.patientRefNo;
            this.procedureRoute(presForm, patientRefNo, age);
          }
          else{this.individualService.addMinorReq(query).subscribe((data) => {
            if (data.status === 2000) {
              patientRefNo = data.data.userRefNo;
              this.procedureRoute(presForm, patientRefNo, age);
            }
          });}
        }
      } else {//if the patient details is not matching for minor profile
        if(this.getUserDetails.data.individualUserBasicInfo && this.getUserDetails.data.individualUserBasicInfo.refNo)
          this.procedureRoute(presForm, this.getUserDetails.data.individualUserBasicInfo.refNo, age);
        else
          this.createNewUserByPatientDetailsAndRouteToProcedure(presForm,age);
        
      }
    } else {
      (!presForm.patientGender)?this._toastService.showI18nToast("Please specify Patients details", 'error'): this._toastService.showI18nToast("Please enter patient detail", 'error');
    }
  }//end of method

  //method to create new user and route to procedure
  createNewUserByPatientDetailsAndRouteToProcedure(presForm: any,age){
    let query = {
      'patientDateOfBirth': presForm.patientDateOfBirth,
      'patientGender': presForm.patientGender,
      'patientName': presForm.patientName,
      'doctorRefNo': this.doctorRefNo,
      'entityName': 'INDIVIDUAL',
      'isSerial': presForm.isSerial,
      'patientContactNo': presForm.patientContactNo? presForm.patientContactNo: null,
      'isPatientPhNoNotNullAndNotRegistered': true,
      'ageInMonth': presForm.patientAgeInMonth * 12
    }
    this.individualService.registerNewUser(query).subscribe(res=>{
      if(res.status == 2000){
        this.procedureRoute(presForm,res.data,age)
      }
    });
  }//end of method

  //method to route procedure page
  procedureRoute(presForm, refNo, age) {
    let patient = {
      "name": presForm.patientName,
      "age": age,
      "gender": presForm.patientGender,
      "ref_no": refNo//presForm.patientRefNo?presForm.patientRefNo: minorRefNo
    }
    GetSet.setPatientDetails(JSON.stringify(patient));
    this.router.navigate(['doctor/procedure']);
  }//end of method to route procedure

  //end of working on //https://gitlab.com/sbis-poc/app/issues/918

  onclickSecondHeading() {//on click second heading
    this.procedureFlag = this.procedureFlag ? false : true;
    if (this.procedureFlag) {
      this.prescriptionFlag = false;
      this.pageHeadingInfoName = 'procedure record';
      this.secondHeading = "New Prescription";
      this.broadcastService.setHeaderText('New Procedure Record');
    } else {
      this.prescriptionFlag = true;
      this.pageHeadingInfoName = 'prescription';
      this.secondHeading = "New Procedure Record";
      this.broadcastService.setHeaderText('New Prescription');
    }
  }
  //issue number 765

  emitUserAddressDetails(selectedAddress){
    this.createPrescription.patchValue({
      userAddressPk: selectedAddress == null ? null : selectedAddress.id,
    })
    
  }

}
