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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { IndividualService } from './../individual.service';
import { ModalService } from './../../../shared/directive/modal/modal.service'
import { ToastService } from './../../../core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { AuthService } from '../../../auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from './../../../core/services/api.service';
import { AppoinmentService } from './../../appoinment/appoinment.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { GetSet } from 'src/app/core/utils/getSet';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'individual-dashb',
  templateUrl: './individual-dashb.component.html',
  styleUrls: ['./individual-dashb.component.css'],
  providers: [DatePipe]
})
export class IndividualDashbComponent implements OnInit {
  userProfileData: any;
  user_id: any;
  user_refNo: any;
  profileImageSrc = "";
  domSanitizer: any;
  cardItemCount:any;
  appointment_State: any;
  appointmentFor: string;
  user_appState:any;
  SBISConstantsRef = SBISConstants;
  appoinmentList: any;
  conCount : any;
  reqCount : any;
  bpResultdys : any;
  bpResultsys : any;
  weight : any;
  pulse : any;
  unit:any;
  unitPulse : any;
 dateLastMeasured : any;
 dateWt:any;
 datepulse:any;
 datesys:any;
 datedys:any;
 chol:any;
 unitChol:any;
 dateChol:any;
previousMedicalDetailsList: any[] = [];
doctorSearchData: any[] = [];
userDob: string;

  constructor(private route: ActivatedRoute,
    private frb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private _location: Location,
    private toastService: ToastService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private individualService :IndividualService,
    private broadcastService: BroadcastService,
    private _domSanitizer: DomSanitizer,
    private apiService: ApiService,
    public datepipe: DatePipe,
    private appoinmentService: AppoinmentService,
    private authService: AuthService) {



      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('en');
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en'); // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('en');
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en');
      this.domSanitizer = _domSanitizer;
    }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.appointmentFor = SBISConstants.MY_PRESCRIPTION_CONST.OWN;
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.user_appState = user.appointmentState
    this.loadUserProfile();
    this.cartCount();
    this.loadApptData();
    this.loadUserMedicalRecords(this.user_refNo);
    //this.loadUserMedicalRecordsTestFor(this.user_refNo,testFor)
    this.getDoctorSearchData();
  }

  getDoctorSearchData() {
    this.doctorSearchData = [{
      city: 'Kolkata',
      name: 'amri',
      mainSearchName: 'amri',
      location: null,
      speciality: null,
      date: null,
      fees: null,
      rating: null,
      subSpeciality: null,
      qualification: '',
      day: null
    },
    {
      city: 'Kolkata',
      name: 'Neurosciences',
      mainSearchName: 'Neurosciences',
      location: null,
      speciality: null,
      date: null,
      fees: null,
      rating: null,
      subSpeciality: null,
      qualification: '',
      day: null
    }]
  }


  backClicked() {
    this._location.back();
  }

  loadApptData(){
    this.appoinmentService.retrieveAppointmentsOfInUsers(this.appointmentFor).subscribe((result) => {
      this.appoinmentList = result.data;
      //let conCount = 0;
      this.conCount = 0;
      this.reqCount = 0;
      for(let appointment of this.appoinmentList){
        if(appointment.appointmentState == "CON"){
          this.conCount = this.conCount+1;
        }

        if(appointment.appointmentState == "REQ"){
          this.reqCount = this.reqCount+1;
        }
      }
      console.log(this.conCount);
    })
  }


  cartCount(){
    this.apiService.CountOrderById.getByPath(this.user_refNo).subscribe((result) => {
      this.cardItemCount = result.data;
    })
  }

  loadUserProfile(){
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((result) => {
      if (result.status === 2000) {
        console.log(result.data);
        this.userProfileData = result.data;
        //console.log(this.userProfileData);
        document.getElementById("name").innerHTML = result.data.userName;
        if(result.data.dateOfBirth ===null){
          document.getElementById("dob").innerHTML = "DOB - Not Specified";
        }else{
          this.userDob = this.datepipe.transform(result.data.dateOfBirth, 'dd/MM/yyyy')
          document.getElementById("dob").innerHTML = "DOB -" + this.userDob;
        }

        if(result.data.contactNo ===null){
          document.getElementById("mob").innerHTML = "Mobile - Not Specified";
        }else{
          document.getElementById("mob").innerHTML = "Mobile - "+ result.data.contactNo;
        }

        if(result.data.bloodGroup ===null){
          document.getElementById("bg").innerHTML = "Blood Group - Not Specified";
        }else{
          document.getElementById("bg").innerHTML = "Blood Group - "+ result.data.bloodGroup;
        }

        if(result.data.gender ===null){
          document.getElementById("gender").innerHTML = "Gender - Not Specified";
        }else{
          document.getElementById("gender").innerHTML = "Gender - "+ result.data.gender;
        }

        if(result.data.addressList.length == 0){
          document.getElementById("address").innerHTML = "Address - Not Specified";
        }else{
          if(result.data.addressList[0].line2 === null){
            document.getElementById("address").innerHTML = "Address - "+ result.data.addressList[0].line1;
          }else{
            document.getElementById("address").innerHTML = "Address - "+ result.data.addressList[0].line1+result.data.addressList[0].line2;
          }
        }

        if(result.data.emailAddress ===null){
          document.getElementById("email").innerHTML = "Email - Not Specified";
        }else{
          document.getElementById("email").innerHTML = "Gender - "+ result.data.emailAddress;
        }

      } else {
        // handle response
      }
    }, (error) => {
      // show error
    });

    this.broadcastService.setProfileImage("");
    this.broadcastService.getProfileImage().subscribe(profileImageSrc => {
      this.profileImageSrc = profileImageSrc;
    });


  }






  loadUserMedicalRecords(userRefNo) {
    this.individualService.loadUserVitalMedicalAttributes(userRefNo).subscribe((data) => {
      if (data.status == 2000) {
        console.log(data);
        this.previousMedicalDetailsList = data.data;
        let index = -1;
        if(data.data.length == 0){
          this.bpResultdys = "Please update";
          this.bpResultsys = "Please update";
        }

        for(let metrix of data.data) {
          index = index+1;
          this.dateLastMeasured = new Date(metrix.dateStr);
           //console.log(data.data[index].result);
          if(metrix.longName =="Blood pressure - Diastolic"){
            if(data.data[index].result.length > 0){
              this.bpResultdys = data.data[index].result;
              this.datedys = data.data[index].dateStr;
            }else{
              this.bpResultdys = "Please update";
            }

            //this.bpResultdys = metrix.result;
          }
          if(metrix.longName =="Blood pressure - Systolic"){
            this.bpResultsys = data.data[index].result;
            data.data[index].dateStr = this.dateLastMeasured;
            this.datesys = data.data[index].dateStr;
          }

          if(metrix.longName =="Weight"){
            this.weight = data.data[index].result;
            this.unit = data.data[index].unitName;
            this.dateWt =   data.data[index].dateStr;
            //data.data[index].dateStr = this.dateLastMeasured;
          }

          if(metrix.longName =="Pulse"){
            this.pulse = data.data[index].result;
            this.unitPulse = data.data[index].unitName;
            this.datepulse = data.data[index].dateStr;
          }

          if(metrix.longName =="VLDL  CHOLESTEROL"){
            this.chol = data.data[index].result;
            this.unitChol = data.data[index].unitName;
            this.dateChol = data.data[index].dateStr;
          }


        }
        //this.modifyMedicalDetailDisplayArrWithBP(data.data);//calling the method to modify medical details array
      }
    });
  }



  profilepage(){
    this.router.navigate(['/individual/tab-personal']);
  }

  myorderpage(){
    this.router.navigate(['/individual/my-order']);
  }

  orderMedicine(){
    this.router.navigate(['/individual/order-medicine']);
  }

  myappointmentpage(){
    this.router.navigate(['/appoinment']);
  }

  searchDoctor(){
    this.router.navigate(['/search']);
  }

  medicalDetails(){
    this.router.navigate(['/individual//medical-details']);
  }

  hospitalList: any[] =[
    {'hospitalName': 'AMRI Hospitals - Saltlake',searchName:'Saltlake',city:'kolkata', logoName:"amri"},
    {'hospitalName': 'AMRI Hospitals - Dhakuria',searchName:'Dhakuria',city:'kolkata',logoName:"amri"},
    {'hospitalName': 'AMRI Hospitals - Mukundapur',searchName:'Mukundapur',city:'kolkata', logoName:"amri"},
    {'hospitalName': 'AMRI Hospitals - Bhubaneswar',searchName:'Bhubaneswar',city:'Bhubaneswar', logoName:"amri"},
    {'hospitalName': 'AMRI Medical Centre',searchName:'medical',city:'kolkata', logoName:"amri"}
  ];

  vohra: any[] =[
    {'hospitalName': 'DR. VOHRA\'S SKIN CLINIC',searchName:'Skin',city:'kolkata', logoName:"vohra"}
  ];
  hospitalListDisplayFlag: boolean = false;

  hospitalNameClick(hospitalEl, index,searchData) {
    searchData.name = hospitalEl.searchName;
    searchData.city = hospitalEl.city;
    GetSet.setDoctorSearchDetails(searchData);
    let obj: any = {
      logoName:hospitalEl.logoName,
      searchName: hospitalEl.searchName,
      hospitalName: hospitalEl.hospitalName
    }
    GetSet.setSearchPagelogoName(obj);
    this.router.navigate(['search']);
    
  }//end of method

}
