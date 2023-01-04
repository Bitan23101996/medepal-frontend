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
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../doctor/doctor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GetSet } from '../../../core/utils/getSet';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-patient-by-doctor',
  templateUrl: './search-patient-by-doctor.component.html',
  styleUrls: ['./search-patient-by-doctor.component.css']
})
export class SearchPatientByDoctorComponent implements OnInit {
  searchPaitent: FormGroup;
  medicationForm : FormGroup;
  doctorPk:any;
  fetchpatientList:[];
  results:any;
  userRefNumber: any;
  isPaginator=false;
  showResult=false;
  noResultFound=false;
  panelVisible = false;
  buttonClassCurrent:any;
  buttonClassAnother:any;
  public todate: Date = new Date();
  fromDate: any;
  toDate: any;
  dateFormat: any;
  chamberList:any;
  chamber = [];
  searchPanelDisplayMobile=false;
  showSearchSection = false;
  searchPanelShow = false;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private _doctorService: DoctorService,private router: Router, private arouter: ActivatedRoute) { }
  
  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    let user = JSON.parse(localStorage.getItem('user'));
    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.fromDate = this.todate;
    this.toDate = this.todate;
    
    this.doctorPk = user.id;
    this.userRefNumber = user.refNo;
	this.showResult=false;
  this.noResultFound = false;
  this.searchPaitent = this.fb.group({

    doctor_ref: [this.userRefNumber],
    name: [""],
    mobile:[""],
    disease:[""],
    medication:[""],
    fromDate: [""],
    toDate: [""],
    chamberName: false
  });
  let previousValue = JSON.parse(localStorage.getItem('previousValue'));
  this.getAllChembers(this.userRefNumber);
  if(previousValue!=null && previousValue!=""){
  //  /sbis-poc/app/issues/524
 this.searchPaitent = this.fb.group({

    doctor_ref: [this.userRefNumber],
    name: [previousValue.name],
    mobile:[previousValue.mobile],
    disease:[previousValue.disease],
    medication:[previousValue.medication],
    //gitlab.com/sbis-poc/app/issues/723
    fromDate: [(typeof previousValue.fromDate === "undefined" || previousValue.fromDate == null || previousValue.fromDate == "")?"":new Date(previousValue.fromDate)],
    toDate: [(typeof previousValue.toDate === "undefined" || previousValue.toDate == null || previousValue.toDate == "")?"":new Date(previousValue.toDate)],
    chamberName: false
  });
  //  /sbis-poc/app/issues/524 start
  this.chamber = previousValue.chamber;
  let reqObj = this.searchPaitent.value;
  reqObj["chembers"] = this.chamber;
  //  /sbis-poc/app/issues/524 end
    this._doctorService.searchPaitientByDoctor(this.searchPaitent.value).subscribe(
      res=>
      {
        previousValue="";
        localStorage.setItem("previousValue",JSON.stringify(previousValue));
        this.fetchpatientList=res.data;
    if(this.fetchpatientList.length>0){
      this.showResult=true;
      this.noResultFound=false;;
    }else{
      this.showResult=false;
      this.noResultFound=true;
    }
    
        if(this.fetchpatientList.length>5){
          this.isPaginator=true;
        }else{
          this.isPaginator=false;
        }
  })
  }
  
    this.searchPanelDisplayMobile = false;
	this.showSearchSection = true;
	this.searchPanelShow = false;
	
  }
  
  hideSearchPanel(){
    this.showSearchSection = false;		
	this.searchPanelShow = true;
  }
  
  showSearchPanel(){
	  this.showSearchSection = true;
	  this.searchPanelShow = false;	  
  }

  searchPaitentByDoctor(){
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
	this.searchPanelDisplayMobile =true;
	this.showSearchSection = false;
	this.searchPanelShow = true;;
    this.showResult=true;
    let reqObj = this.searchPaitent.value;
    if(this.searchPaitent.get("fromDate").value != "" && this.searchPaitent.get("toDate").value != ""){
      let fromDate:Date = new Date(this.searchPaitent.get("fromDate").value);
      let toDate:Date = new Date(this.searchPaitent.get("toDate").value);
      reqObj["fromDate"] = fromDate.getFullYear()+"-"+(fromDate.getMonth()+1)+"-"+fromDate.getDate();
      reqObj["toDate"] = toDate.getFullYear()+"-"+(toDate.getMonth()+1)+"-"+toDate.getDate();
    }
    reqObj["chembers"] = this.chamber

    this._doctorService.searchPaitientByDoctor(reqObj).subscribe(
      res=>
      {
        this.fetchpatientList=res.data;
		if(this.fetchpatientList.length>0){
			this.showResult=true;
			this.noResultFound=false;;
		}else{
			this.showResult=false;
			this.noResultFound=true;
		}
		
        if(this.fetchpatientList.length>5){
          this.isPaginator=true;
        }else{
          this.isPaginator=false;
        }
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
  })
  }

  patientView(patientDetails){
    //  /sbis-poc/app/issues/524
    var payload={
      "doctor_ref":this.searchPaitent.value.doctor_ref,
      "name":this.searchPaitent.value.name,
      "mobile":this.searchPaitent.value.mobile,
      "disease":this.searchPaitent.value.disease,
      "medication":this.searchPaitent.value.medication,
      "chamber": this.chamber,
      "fromDate": this.searchPaitent.value.fromDate,
      "toDate": this.searchPaitent.value.toDate
    }
    localStorage.setItem("previousValue",JSON.stringify(payload));
    GetSet.setPatientDetailsByDoctor(patientDetails);
    this.router.navigate(['searchPatientByDoctor/patientDetailForDoctor',{refno: patientDetails.ref_no}]);
    //this.router.navigate(['searchPatientByDoctor/patientDetailForDoctor', {refno: refno}],{ queryParams: { returnUrl: this.router.url }});
  }

  getMedicineList(event) {
    let query = {
      "_source" : ["product_name", "product_composition", "product_id"],
      "query" : {
      "multi_match": {
          "query": event.query,
          "type":  "cross_fields",
          "fields": ["product_name", "product_composition"]
          }
      }
    };
    this._doctorService.getMedicineList(query).subscribe((data) => {
      this.results = data.hits.hits;
    });
  }

  setMedicineName(event){
    this.searchPaitent.patchValue({
      medication:event._source.product_name
    });
  }

  refinePanelDisplay(){
      this.panelVisible = !this.panelVisible;
    }

    refinePanelhide(){
      this.panelVisible = false;
    }

    // issue app#593
    onValueChange(label: any, dt: Date): void {
      //console.log(dt);
      // this.fetchPatientForm.patchValue({
      //   fromDate : ('0' + dt.getDate()).slice(-2) + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear(),
      // })
      if (label == 'fromDate') {
        this.fromDate = dt;
        // ('0' + dt.getDate()).slice(-2) + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getFullYear();
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
    }

    resetSearchDate() {
      this.searchPaitent.patchValue({
        fromDate: this.todate.getDate(),
        toDate: this.todate.getDate()
      });
    }

    resetAll() {
      this.searchPaitent.reset();
    }

    resetChamberName() {
      this.searchPaitent.patchValue({
        chamberName: ''
      });
      this.chamber = [];
    }

    changeClassButton1() {
      this.buttonClassCurrent = 'btn btn-dark';
      this.buttonClassAnother = 'btn btn-light';
    }
  
    changeClassButton2() {
      this.buttonClassCurrent = 'btn btn-light';
      this.buttonClassAnother = 'btn btn-dark';
    }

    getAllChembers(refno) {
      let request = {
        "refNo": refno
      };
      this._doctorService.getAllChambersv2(request)
        .subscribe(res => {
          this.chamberList = res;
        });
    }
    //  /sbis-poc/app/issues/524
    isCheckedChamber(chamberRefNo){
      return this.chamber.indexOf(chamberRefNo) != -1
    }

    chamberChange(e, type) {
      if (e.target.checked) {
        this.chamber.push(type.chamberRefNo);
      }
      else {
        let index = this.findIndexToUpdateChamber(type.chamberRefNo);
        this.chamber.splice(index, 1);
      }
    }
  
    findIndexToUpdateChamber(chamberRefNo) {
      for (let i = 0; i < this.chamber.length; i++) {
        if (this.chamber[i] == chamberRefNo)
          return i;
      }
    }
  
}
