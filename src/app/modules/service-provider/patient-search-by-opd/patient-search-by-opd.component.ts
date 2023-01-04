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
import { FormGroup,FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GetSet } from '../../../core/utils/getSet';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ServiceProviderService } from '../service-provider.service';

@Component({
  selector: 'app-patient-search-by-opd',
  templateUrl: './patient-search-by-opd.component.html',
  styleUrls: ['./patient-search-by-opd.component.css']
})
export class PatientSearchByOPDComponent implements OnInit {
  searchPaitent: FormGroup;
  fetchProcedureList: any[];//to store fetched procedure list
  patientListToDisplay: any[];//to store fetched procedure list
  userRefNumber: any;
  isPaginator = false;
  showResult = false;
  noResultFound = false;
  refinePanelSearchMsgShow: boolean = false;
  panelVisible = false;
  buttonClassCurrent: any;
  buttonClassAnother: any;
  todate: Date = new Date();
  fromDate: any;
  toDate: any;
  dateFormat: any;
  searchPanelDisplayMobile = false;
  showSearchSection = false;
  searchPanelShow = false;
  currDate: any;//to store current date
  loading:boolean=false;

  constructor( private http: HttpClient, private router: Router,private datePipe: DatePipe, private serviceProviderService: ServiceProviderService,private translate: TranslateService) { 
    this.buildForm();
    this.getCurrentDate();
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    let user = JSON.parse(localStorage.getItem('user'));
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.fromDate = this.todate;
    this.toDate = this.todate;
    this.userRefNumber = user.refNo;
    this.showResult = false;
    this.noResultFound = false;
 
    this.searchPanelDisplayMobile = false;
    this.showSearchSection = true;
    this.searchPanelShow = false;
    this.formValueChanges();
  }//end of oninit

  //build form
  buildForm(){
    let searchProcedure: any = {
      opd_ref: new FormControl(this.userRefNumber),
      name: new FormControl(),
      eaddress: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      refinePanelPatientName: new FormControl()
    };
    this.searchPaitent = new FormGroup(searchProcedure);
  }//end of method

  getCurrentDate() {
    let now = new Date();
    this.currDate = this.datePipe.transform(now, 'yyyy-MM-dd');//"dddd, mmmm dS, yyyy, h:MM:ss TT");
  }//end of method

  //method to detect form value changes
  formValueChanges(){
    this.searchPaitent.get('refinePanelPatientName').valueChanges.subscribe(searchedName =>{
      this.refinePanelSearchByFormControls(searchedName,"name");
    }); 

    this.searchPaitent.get('fromDate').valueChanges.subscribe(fromDate=> {
      this.refinePanelSearchByFormControls(fromDate,'lastAppointmentDate');
    });
    this.searchPaitent.get('toDate').valueChanges.subscribe(toDate=> {
      this.refinePanelSearchByFormControls(toDate,'lastAppointmentDate');
    });
  }//end of method

  //method to get procedure date between to n from date
  getDateDifferenceValues(searchArr): any[]{
    let fromDate = this.searchPaitent.get('fromDate').value;
    let toDate = this.searchPaitent.get('toDate').value;
    let listToView : any[] = [];
    if (fromDate != null && toDate != null) {
      let frmDate = moment(fromDate).format(this.dateFormat);
      let tDate = moment(toDate).format(this.dateFormat);
      listToView = searchArr.filter(x => moment(x.lastAppointmentDate).format(this.dateFormat) >= frmDate && moment(x.lastAppointmentDate).format(this.dateFormat) <= tDate);
    } else if (fromDate != null) {
      let frmDate = moment(fromDate).format(this.dateFormat);
      listToView = searchArr.filter(x => moment(x.lastAppointmentDate).format(this.dateFormat) >= frmDate);
    } else if (this.searchPaitent.get('toDate').value != null) {
      let tDate = moment(toDate).format(this.dateFormat);
      listToView = searchArr.filter(x => moment(x.lastAppointmentDate).format(this.dateFormat) <= tDate);
    }
    console.log(listToView);
    return listToView;
  }//end of method

  //method to search according to refine panel
  refinePanelSearchByFormControls(value,fieldName){
    console.log(value);
    let searchProcedureFormValues = this.searchPaitent.value;
    let searchedArr = this.fetchProcedureList;
    if(fieldName == "name"){
      searchProcedureFormValues.refinePanelPatientName = value;
    }
    let patientNameArr = searchProcedureFormValues.refinePanelPatientName? this.searchWithFieldNameAndSearchData(searchProcedureFormValues.refinePanelPatientName,"name",searchedArr): searchedArr;
    let finalSearchArr = patientNameArr;
    if(this.searchPaitent.get('fromDate').value != null || this.searchPaitent.get('toDate').value!= null)
      finalSearchArr = this.getDateDifferenceValues(patientNameArr);

    this.patientListToDisplay = finalSearchArr;

    this.patientListToDisplay.length > 0 ? this.refinePanelSearchMsgShow = false: this.refinePanelSearchMsgShow = true;
  }//end of method

  //method to search according to refine panel
  searchWithFieldNameAndSearchData(searchData,searchField: string,searchedArray: any[]): any[]{
    let filteredProcedureList = searchedArray.filter((procedure)=> {
       return procedure[searchField].toLocaleLowerCase().includes(searchData.toLocaleLowerCase())
    });
    return filteredProcedureList;
  }//end of method

  hideSearchPanel() {
    this.showSearchSection = false;
    this.searchPanelShow = true;
  }

  showSearchPanel() {
    this.showSearchSection = true;
    this.searchPanelShow = false;
  }

  searchPaitentByDoctor() {
    // console.log(this.chamber);
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.searchPanelDisplayMobile = true;
    this.showSearchSection = false;
    this.searchPanelShow = true;;
    this.showResult = true;
    let reqObj = this.searchPaitent.value;
    if (this.searchPaitent.get("fromDate").value != "" && this.searchPaitent.get("toDate").value != "") {
      let fromDate: Date = new Date(this.searchPaitent.get("fromDate").value);
      let toDate: Date = new Date(this.searchPaitent.get("toDate").value);
      reqObj["fromDate"] = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
      reqObj["toDate"] = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
    }
    // reqObj["chembers"] = this.chamber;
    this.getPatientInfoList(reqObj);
 
  }

  //method to get procedule list according to search result
  getPatientInfoList(searchQuery){
    let requestBody: any = {
      "doctorRefNo":this.userRefNumber,
      "eaddress": searchQuery.eaddress,
      "name": searchQuery.name
    };
    this.serviceProviderService.getAllPatientDetailsByOPD(requestBody).subscribe(
      res => {
          // this.calculateAge(res.data);
          this.fetchProcedureList = res.data;
          this.patientListToDisplay = res.data;//to store patient list
        
          if (this.patientListToDisplay.length > 0) {
            this.showResult = true;
            this.noResultFound = false;;
          } else {
            this.showResult = false;
            this.noResultFound = true;
          }
          
        if (this.patientListToDisplay.length > 10) {
          this.isPaginator = true;
        } else {
          this.isPaginator = false;
        }
        //console.log("searchPaitent", res);
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      });
  }//end of method

  // //method to calculate age
  // calculateAge(arrayToCalculate: any[]) {
  //   arrayToCalculate.filter(arrayToCalculate=>{
  //     const bdate = new Date(arrayToCalculate['patientAge']);
  //     const timeDiff = Math.abs(Date.now() - bdate.getTime());
  //     arrayToCalculate['age'] = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
  //   });
  // }//en dof method

  patientView(userInfo) {
    let patient = {
      "name": userInfo.name,      
      "age": userInfo.age,//age,
      "gender": userInfo.gender ,
      "ref_no": userInfo.refNo
    }
    GetSet.setPatientDetails(JSON.stringify(patient));
    this.router.navigate(['opd/patient-detail-view']);
  }

  populateHospitalAddress(chamberType) {
    this.searchPaitent.patchValue({
      hospitalName: chamberType.hospitalName
    });
  }//end of method  

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }
  onValueChange(label: any, dt: Date): void {
    if (label == 'fromDate') {
      this.fromDate = dt;
    }
    if (label == 'toDate') {
      this.toDate = dt;
    }
    if (this.fromDate == this.toDate) {
      this.buttonClassCurrent = 'btn btn-dark';
      this.buttonClassAnother = 'btn btn-light';
    }
    else {
      this.buttonClassCurrent = 'btn btn-light';
      this.buttonClassAnother = 'btn btn-dark';
    }

  }//end of method


  resetAll() {
    this.searchPaitent.reset();
    this.patientListToDisplay = this.fetchProcedureList;
  }

  resetRefinePanelFields(formControlName,fieldName) { 
    if(formControlName == 'date') {
      this.searchPaitent.controls['fromDate'].setValue(null);
      this.searchPaitent.controls['toDate'].setValue(null);
    }else{
      this.searchPaitent.value[formControlName] = '';
      this.refinePanelSearchByFormControls(this.searchPaitent.value[formControlName],fieldName);
      this.searchPaitent.controls[formControlName].setValue('');
    }
  }
}//end of class
