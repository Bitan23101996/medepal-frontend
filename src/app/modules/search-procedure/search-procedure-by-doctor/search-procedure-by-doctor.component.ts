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
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../doctor/doctor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GetSet } from '../../../core/utils/getSet';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { SBISConstants } from 'src/app/SBISConstants';
@Component({
  selector: 'app-search-procedure-by-doctor',
  templateUrl: './search-procedure-by-doctor.component.html',
  styleUrls: ['./search-procedure-by-doctor.component.css']
})
export class SearchProcedureByDoctorComponent implements OnInit {
  searchPaitent: FormGroup;
  fetchProcedureList: any[];//to store fetched procedure list
  procedureListToDisplay: any[];//to store fetched procedure list
  hospitalList: any;
  userRefNumber: any;
  isPaginator = false;
  showResult = false;
  noResultFound = false;
  refinePanelSearchMsgShow: boolean = false;
  panelVisible = false;
  buttonClassCurrent: any;
  buttonClassAnother: any;
  public todate: Date = new Date();
  fromDate: any;
  toDate: any;
  dateFormat: any;
  chamberList: any;
  // chamber = [];
  searchPanelDisplayMobile = false;
  showSearchSection = false;
  searchPanelShow = false;
  currDate: any;//to store current date

  constructor( private http: HttpClient, private _doctorService: DoctorService, private router: Router,private datePipe: DatePipe,) { 
    this.buildForm();
    this.getCurrentDate();
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
 
    let reqObj = this.searchPaitent.value;
    // reqObj["chembers"] = this.chamber;
    

    this.searchPanelDisplayMobile = false;
    this.showSearchSection = true;
    this.searchPanelShow = false;
    this.formValueChanges();
  }//end of oninit

  //build form
  buildForm(){
    let searchProcedure: any = {
      doctor_ref: new FormControl(this.userRefNumber),
      name: new FormControl(),
      mobile: new FormControl(),
      procedure: new FormControl(),
      hospitalName: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      // chamberName: new FormControl(false),
      hospitalNameToSearch: new FormControl(),
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
      this.refinePanelSearchByFormControls(searchedName,"patientName");
    });    
    this.searchPaitent.get('hospitalNameToSearch').valueChanges.subscribe(searchedHospitalName =>{
      this.refinePanelSearchByFormControls(searchedHospitalName,"procedureLocation");
    });   

    this.searchPaitent.get('fromDate').valueChanges.subscribe(fromDate=> {
      this.refinePanelSearchByFormControls(fromDate,'procedureDate');
    });
    this.searchPaitent.get('toDate').valueChanges.subscribe(toDate=> {
      this.refinePanelSearchByFormControls(toDate,'procedureDate');
    });
  }//end of method

  //method to get procedure date between to n from date
  getDateDifferenceValues(searchArr): any[]{
    let fromDate = this.searchPaitent.get('fromDate').value;
    let toDate = this.searchPaitent.get('toDate').value;
    let listToView : any[] = [];
    if (fromDate != null && toDate != null) {
     listToView = searchArr.filter(x => new Date(this.transformDate(x.procedureDate)) >= new Date(this.transformDate(fromDate)) && new Date(this.transformDate(x.procedureDate)) <= new Date(this.transformDate(toDate)) );
    } else if (fromDate != null) {
      listToView = searchArr.filter(x => new Date(this.transformDate(x.procedureDate)) >= new Date(this.transformDate(fromDate)));
    } else if (this.searchPaitent.get('toDate').value != null) {
      listToView = searchArr.filter(x => new Date(this.transformDate(x.procedureDate)) <= new Date(this.transformDate(toDate)));
    }
   return listToView;
  }//end of method

  //method to transform Date
  transformDate(date): string{
    return this.datePipe.transform(new Date(date),SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER);
  }//end of method

  //method to search according to refine panel
  refinePanelSearchByFormControls(value,fieldName){
    let searchProcedureFormValues = this.searchPaitent.value;
    let searchedArr = this.fetchProcedureList;
    let searchData = "";
    if(fieldName == "procedureLocation"){
      searchProcedureFormValues.hospitalNameToSearch = value;
    }else if(fieldName == "patientName"){
      searchProcedureFormValues.refinePanelPatientName = value;
    }
    let hospitalnameArr = searchProcedureFormValues.hospitalNameToSearch? this.searchWithFieldNameAndSearchData(searchProcedureFormValues.hospitalNameToSearch,"procedureLocation",searchedArr): searchedArr;
    let patientNameArr = searchProcedureFormValues.refinePanelPatientName? this.searchWithFieldNameAndSearchData(searchProcedureFormValues.refinePanelPatientName,"patientName",hospitalnameArr): hospitalnameArr;
    let finalSearchArr = patientNameArr;
    if(this.searchPaitent.get('fromDate').value != null || this.searchPaitent.get('toDate').value!= null)
      finalSearchArr = this.getDateDifferenceValues(patientNameArr);

    this.procedureListToDisplay = finalSearchArr;

    this.procedureListToDisplay.length > 0 ? this.refinePanelSearchMsgShow = false: this.refinePanelSearchMsgShow = true;
  }//end of method

  //method to search according to refine panel
  searchWithFieldNameAndSearchData(searchData,searchField: string,searchedArray: any[]): any[]{
    let filteredProcedureList = searchedArray.filter((procedure)=> {
       return procedure[searchField].toLocaleLowerCase().includes(searchData.toLocaleLowerCase())
    });
    // this.procedureListToDisplay = filteredProcedureList;
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
    this.getProcedureInfoList(reqObj);
 
  }

  //method to get procedule list according to search result
  getProcedureInfoList(searchQuery){
    let requestBody: any = {
      "doctorRefNo":this.userRefNumber,
      "procedureLocation": searchQuery.hospitalName,
      "contactNumber": searchQuery.mobile,
      "patientName": searchQuery.name,
      "procedureName": searchQuery.procedure
    };
    this._doctorService.getAllUsersProcedureInfoByDoctorRefNo(requestBody).subscribe(
      res => {
          this.calculateAge(res.data);
          res.data.sort((a, b) => {
            const d1 = new Date(a.procedureDate);
            const d2 = new Date(b.procedureDate);
            return (d1.getTime() - d2.getTime())*-1;
           });
          this.fetchProcedureList = res.data;
          this.procedureListToDisplay = res.data;//to store procedure list
        
          if (this.procedureListToDisplay.length > 0) {
            this.showResult = true;
            this.noResultFound = false;;
          } else {
            this.showResult = false;
            this.noResultFound = true;
          }
          
        if (this.procedureListToDisplay.length > 5) {
          this.isPaginator = true;
        } else {
          this.isPaginator = false;
        }
        //console.log("searchPaitent", res);
      })
  }//end of method

  //method to calculate age
  calculateAge(arrayToCalculate: any[]) {
    arrayToCalculate.filter(arrayToCalculate=>{
      const bdate = new Date(arrayToCalculate['patientAge']);
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      arrayToCalculate['age'] = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
    });
  }//en dof method

  patientView(userInfo) {
    // const bdate = new Date(presForm.patientDateOfBirth);
    // const timeDiff = Math.abs(Date.now() - bdate.getTime());
    // let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " Y";
    let patient = {
      "name": userInfo.patientName,      
      "age": userInfo.age,//age,
      "gender": userInfo.gender ,
      "ref_no": userInfo.patientRefNo
    }
    GetSet.setPatientDetails(JSON.stringify(patient));
    this.router.navigate(['doctor/procedure',userInfo.procedureRefNo]);
  }

  // getMedicineList(event) {
  //   //console.log(event.query);
  //   let query = {
  //     "_source" : ["product_name", "product_composition", "product_id"],
  //     "query" : {
  //     "multi_match": {
  //         "query": event.query,
  //         "type":  "cross_fields",
  //         "fields": ["product_name", "product_composition"]
  //         }
  //     }
  //   };
  //   this._doctorService.getMedicineList(query).subscribe((data) => {
  //     //console.log(data)
  //     this.hospitalList = data.hits.hits;
  //     //console.log(this.hospitalList)
  //   });
  // }
  getHospitalList(event) {
    this._doctorService.getHospitalListByCategoryV2('H', event.query).subscribe((data) => {
      this.hospitalList = data;
    });
  }//end of method
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
    this.procedureListToDisplay = this.fetchProcedureList;
  }

  resetRefinePanelFields(formControlName,fieldName) { 
    if(formControlName == 'date') {
      this.searchPaitent.controls['fromDate'].setValue(null);
      this.searchPaitent.controls['toDate'].setValue(null);
      this.refinePanelSearchByFormControls(this.searchPaitent.value["hospitalNameToSearch"],"procedureLocation");
    }else{
      this.searchPaitent.value[formControlName] = '';
      this.refinePanelSearchByFormControls(this.searchPaitent.value[formControlName],fieldName);
      this.searchPaitent.controls[formControlName].setValue('');
    }
  }
}
