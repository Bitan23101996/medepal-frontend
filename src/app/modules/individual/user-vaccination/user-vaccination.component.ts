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

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
//import { environment } from 'src/environments/environment.prod';
import { SBISConstants } from 'src/app/SBISConstants';
import {FormGroupDirective, FormControl,FormsModule } from '@angular/forms';
import { environment } from 'src/environments//environment';


@Component({
  selector: 'app-user-vaccination',
  templateUrl: './user-vaccination.component.html',
  styleUrls: ['./user-vaccination.component.css'],
  providers: [FormGroupDirective]
})
export class UserVaccinationComponent implements OnInit {


  brands: any;
  vaccinations: any;
  isChecked: true;
  mandetoryVaccinations: any;
  optionalVaccinations: any = [];
  // maxDate = new Date();
  maxDate: Date;
  userVactinationData: any;
  dobNotAvailable: boolean = false;
  alreadySavedVacccineDueDateExceed: boolean = false;
  oldUnsavedItems: any = [];
  allDataFetched : boolean = false;
  loading: boolean = false;
   dateFormat = "";
   vaccinationDate : any;
  //oldSavedItems: any = [];
  
  

  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    private apiService: ApiService,
    private broadcastService: BroadcastService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    this.maxDate = new Date();
	
	
 
  }
  
  updated(arg,vaccination:any){
	  vaccination.vaccinationDate = arg;

  }

  ngOnInit() {
    // this.carService.getCarsSmall().then(cars => this.cars = cars);

    //this.getVaccinationMasterData();
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.broadcastService.setHeaderText('Vaccination');
    this.populateUiByValccinationDetails();
	this.dateFormat = environment.DATE_FORMAT;
  }


  populateUiByValccinationDetails() {
    const user = ['undefined', null].indexOf(localStorage.getItem('user')) === -1 ? JSON.parse(localStorage.getItem('user')) : {};
    if (user.id) {
      this.apiService.UserVaccinationData.getByPath(user.refNo).subscribe(data => {
        this.vaccinations = data.data;
        this.dobNotAvailable = this.vaccinations.filter(v => v.dueDate == SBISConstants.DOB.DOB_NOT_AVAILABLE)[0] ? true : false;
        this.vaccinations.forEach(masterEle => {
          if (masterEle.vaccinationDate) {//refNo
            masterEle["isSelected"] = true;
            masterEle["alreadySavedVacccineDueDateExceed"] = false;
          }

          if (!this.dobNotAvailable && !masterEle.vaccinationDate) {//refNo
            masterEle["isDueDateExcced"] = masterEle.dueDate ? this.checkDate(masterEle.dueDate) : false;
          } else {
            masterEle["isDueDateExcced"] = false;
          }
        });
        this.mandetoryVaccinations = this.vaccinations.filter(v => v.mandatoryOptionalFlag === "M");
        this.optionalVaccinations = this.vaccinations.filter(v => v.mandatoryOptionalFlag === "O");
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      })


    }
    this.allDataFetched= true;

  }

  btnUpdateClicked() {
    const user = ['undefined', null].indexOf(localStorage.getItem('user')) === -1 ? JSON.parse(localStorage.getItem('user')) : {};

    let toBeUpdate = this.vaccinations.filter(vaccination => vaccination.isSelected)
      .map(v => {
 
        v.isDueDateExcced = false;
        //v.refNo = user.id;
  

        return {
          id: v.id,
          vaccinePk: v.vaccinePk,
          refNo: user.refNo,
          // refNo: v.refNo ? v.refNo : user.id,
          doesNo: v.doesNo,
          // //vaccinationDate:v.isSelected ? v.vaccinationDate:null
          vaccinationDate: v.vaccinationDate
        };
      });
    let query = {
      refNo: user.refNo,
      vaccineMasterDataDtoList: toBeUpdate
    }
    if (this.oldUnsavedItems && this.oldUnsavedItems.length > 0 ) {
      this.apiService.SaveUpdateUserVaccinationData.postByQuery(query).subscribe(data => {
        //if (data.data.status === 2000) {
           this.populateUiByValccinationDetails();
          //this.ngOnInit();
         
         /* this.vaccinations.forEach(element => {
            if(data.data.lenght>0){
              let vac = data.data.find(x => x.vaccinePk == element.vaccinePk && x.doesNo == element.doesNo);
              if(vac){
                element.id = vac.id;
               
              }else{
                element.id = null;
              }
            }else{
              element.id = null;
            }
            
            
          })*/
       // }
        this.toastService.showI18nToast("Successful!",'success');
      });
      this.oldUnsavedItems = [];
      //this.oldSavedItems = [];
    }




  }

  checkDate(givenDate) {
    var today = new Date();
    var dateParts = givenDate.split("-");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    if (dateObject > today) {
      return false;
    } else {
      return true;
    }
  }

 

  changeClass($event, vaccination: any, isDueDateExceed: boolean) {

    if (!this.dobNotAvailable) {
      if (vaccination.id) {
        this.handleSavedVactionationChange($event, vaccination, isDueDateExceed);
      }
      if (!vaccination.id) {
        this.handleUnSavedVactionationChange($event, vaccination, isDueDateExceed);
      }
    }

  }

  handleSavedVactionationChange($event, vaccination: any, isDueDateExceed: boolean) {
    if ($event.target.checked) {
      let v = this.oldUnsavedItems.filter(e => e.vaccineName == vaccination.vaccineName)[0];
      if (v) {
        this.oldUnsavedItems = this.oldUnsavedItems.filter(e => e.vaccineName != vaccination.vaccineName);
        let dueDateForAlreadySavedV = this.checkDate(v.dueDate);  
        if(dueDateForAlreadySavedV){
          vaccination.isDueDateExcced = false;
          vaccination.alreadySavedVacccineDueDateExceed = false;
        }else{
          vaccination.alreadySavedVacccineDueDateExceed = false;
        }
       
      }
    } else if (!$event.target.checked) {
      let dueDateForAlreadySavedV = this.checkDate(vaccination.dueDate);
      this.oldUnsavedItems.push(vaccination);
      if (dueDateForAlreadySavedV && !this.dobNotAvailable ){
        vaccination.isDueDateExcced = dueDateForAlreadySavedV;
        vaccination.alreadySavedVacccineDueDateExceed = true;
      }else{
        vaccination.alreadySavedVacccineDueDateExceed = true;
      }
    }
  }
  handleUnSavedVactionationChange($event, vaccination: any, isDueDateExceed: boolean) {
    if (!$event.target.checked) {
      let v = this.oldUnsavedItems.filter(e => e.vaccineName == vaccination.vaccineName)[0];
      if (v) {
        this.oldUnsavedItems = this.oldUnsavedItems.filter(e => e.vaccineName != vaccination.vaccineName);
        let dueDate = this.checkDate(v.dueDate);
        if (dueDate) {
          vaccination.isDueDateExcced = false;
        }
        vaccination.refNo = null;
        vaccination.alreadySavedVacccineDueDateExceed = false;
      }else{
        vaccination.alreadySavedVacccineDueDateExceed = false;
      }
    } else if ($event.target.checked) {
      this.oldUnsavedItems.push(vaccination);
      if (isDueDateExceed && !this.dobNotAvailable) {
        vaccination.isDueDateExcced = false;
      }
    }
  }
}
