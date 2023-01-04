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
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../doctor.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastService } from '../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-doctor-holiday-list',
  templateUrl: './doctor-holiday-list.component.html',
  styleUrls: ['./doctor-holiday-list.component.css']
})
export class DoctorHolidayListComponent implements OnInit {
  //fetchHolidayForm: FormGroup;
  title: String = "Doctor Holiday List";
  isPaginator = false;
  chamberArr = [];
  chamberList : any;
  searchList : any;
  searchStr : String = "";
  user: any;
  searchListLength: any;
  allDataFetched = false;
  holidayData: any;
  modalRef: BsModalRef;
  minDate = new Date();
  minDateTo: any;
  updateHolidayForm: FormGroup;
  dateFormat:any;
  holidayFrom: any;
  holidayTo: any;
  allFetchData: boolean = false;
  holidayAddDisableFlag: boolean;
  oldItems: any[] = [];

  // @ViewChild('doctorHolidayUpdateModal') doctorHolidayUpdateModal: TemplateRef<any>;

  constructor(private fb: FormBuilder,
              private router: Router,
              private _doctorService: DoctorService,
              private broadcastService: BroadcastService,
              private bsModalService: BsModalService,
              private toastService: ToastService,
              private translate: TranslateService,
              public datepipe: DatePipe) { 
                translate.setDefaultLang('en');
                translate.use('en');
              }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.searchList = null;
    this.chamberList = null;
    //this.chamberArr.push("ALL");
    this.dateFormat=environment.DATE_FORMAT;

    // Changed title (app#711)
    this.broadcastService.setHeaderText('Unavailability Calendar');
    let query = {
      refNo : this.user.refNo
    }
    this._doctorService.getAllChamberByDoctorRefNo(query).subscribe(data => {
      console.log(data);   
      if(data['status']=='2000'){
        this.chamberList = data.data;
      }
    });

    this.initialFormGroup();
    this.getHolidays();
  }

  initialFormGroup() {
    this.updateHolidayForm = this.fb.group({
      holiday: this.fb.array([]),
    });
  }

  convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ date.getFullYear(), mnth, day].join("-");
  }

  getHolidays(){
    this.searchList= null;
    this.searchStr = "";
    this.searchStr = "doctorRefNo:"+this.user.refNo+";chamber:"+this.chamberArr;

    console.log("searchStr = "+this.searchStr);
    let payload = {
      "searchStr" : this.searchStr  
    }
    this._doctorService.fetchHolidayList(payload).subscribe(data =>{
      if (data['status'] == '2000') {
        this.searchList=data.data;
        console.log(this.searchList);        
        this.searchListLength = data.data.length;
        this.allDataFetched = true;
        if(data.data.length>5){
          this.isPaginator = true;
        }
        let holidayList = data['data'];
        holidayList.forEach(t =>{
          let holidayArr = <FormArray>this.updateHolidayForm.controls.holiday;
         
          holidayArr.push(this.fb.group({
            'holidayFrom' : new Date(t.holidayFrom),
            'holidayTo' : new Date(t.holidayTo),
            'doctorHolidayChamberDTOList' : [t.doctorHolidayChamberDTOList],
            'isEdit': [false],
            'isSubmit': [false]
          }));
        });
        this.allFetchData = true;
      }
    });
  }

  editHoliday(ctrl: any) {
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit,
    });
    let chamberList = ctrl.value.doctorHolidayChamberDTOList;
    for(let i = 0; i< chamberList.length;i++){
      if(chamberList[i].ischecked){
        let payload = {
          "doctorHolidayPk": chamberList[i].doctorHolidayPk==null?null:chamberList[i].doctorHolidayPk,
          "chamberRefNo" : chamberList[i].chamberRefNo
        }
        this.chamberRefList.push(payload);
      }
    }
    
    this.holidayAddDisableFlag = true;
    this.oldItems.push(ctrl.value);
    this.newRow = false;  

  }

  cancelHoliday(ctrl, inx, iconType) {
    this.holidayAddDisableFlag = false;
    let arrayControl = this.updateHolidayForm.get('holiday') as FormArray;
    arrayControl.removeAt(inx);
    if (iconType == 'edit') {
      let data = ctrl.value;
      let formControl = this.fb.group({
            'holidayFrom' : new Date(data.holidayFrom),
            'holidayTo' : new Date(data.holidayTo),
            'doctorHolidayChamberDTOList' : [data.doctorHolidayChamberDTOList],
            'isEdit': [false],
            'isSubmit': [false]
      });
      arrayControl.insert(inx, formControl);
    }
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
    this.newRow = false;
    this.chamberRefList = [];
  }//end of method

  deleteHoliday(ctrl: any, index: number) {
    let data = ctrl.value;
    console.log(data);
    if (confirm('Are you want to cancel this holiday?')){
      let payload = {
        "doctorRefNo" : this.user.refNo,
        "holidayFromDateStr" : this.convert(data.holidayFrom.toString()),
        "holidayToDateStr" : this.convert(data.holidayTo.toString()),
        "action" : "DELETE" 
      }
      this._doctorService.updateDoctorHoliday(payload).subscribe(data =>{
        if(data['status']=='2000'){
          this.toastService.showI18nToast("Holiday Canceled Successfully.", 'success');
          this.initialFormGroup();
          this.getHolidays();
          if (this.holidayAddDisableFlag) {
            this.holidayAddDisableFlag = false;
          }
        }else 
          this.toastService.showI18nToast("Internal Server Error Occurred.", 'error');   
      });
    }else{

    }
    this.newRow = false;
    this.chamberRefList = [];
    
  }//end of method

  saveHoliday(ctrl: any, action: any) {
    if(this.chamberRefList.length==0){
      this.toastService.showI18nToast("Please select atleast one chamber","error");
      return;
    }
    let data = ctrl.value;
    ctrl.patchValue({
      'isSubmit': true
    });
    if (ctrl.invalid) {
      return;
    }
    let chamberArr = [];
    for(let i=0;i<this.chamberRefList.length;i++){
      let chamberRow = {};
      chamberRow = {
        "chamberRefNo": this.chamberRefList[i].chamberRefNo ,
        "ischecked": true,
        "holidayFrom": data.holidayFrom,
        "holidayTo": data.holidayTo,
        "doctorHolidayPk" : this.chamberRefList[i].doctorHolidayPk==null?null:this.chamberRefList[i].doctorHolidayPk
      }
      chamberArr.push(chamberRow);
    }
    
    let payload = {
      "doctorHolidayPk" : data.doctorHolidayPk==null?null:data.doctorHolidayPk,
      "doctorHolidayChamberDTOList" : chamberArr,
      "holidayFromDateStr" : this.convert(data.holidayFrom.toString()),
      "holidayToDateStr" : data.holidayTo==null?this.convert(data.holidayFrom.toString()):this.convert(data.holidayTo.toString()),
      "status" : data.status,
      "doctorRefNo" : this.user.refNo,
      "action" : action 
    }
    console.log(payload);
    
    this._doctorService.updateDoctorHoliday(payload).subscribe(data =>{
      if(data['status']=='2000'){
        this.toastService.showI18nToast(data['message'], 'success');
        this.initialFormGroup();
        this.getHolidays();
        this.holidayAddDisableFlag = false;
        this.chamberRefList = [];
      }else 
        this.toastService.showI18nToast(data['message'], 'error');   
    });

    this.oldItems = [];
    this.newRow = false;
  }//end of method

  newRow: boolean = false;
  addHoliday(){
    let ctrl = <FormArray>this.updateHolidayForm.controls.holiday;
    let chamberArr = [];
    for(let i=0;i<this.chamberList.length;i++){
      let chamberRow = {};
      chamberRow = {
        "chamberRefNo": this.chamberList[i].chamberRefNo ,
        "chamberName": this.chamberList[i].hospitalName,
        "ischecked": false
      }
      chamberArr.push(chamberRow);
    }
    let formControl = this.fb.group({
      'holidayFrom' : [null],
      'holidayTo' : [null],
      'doctorHolidayChamberDTOList' : [chamberArr],
      'isEdit': [true],
      'isSubmit': [false]
    });

    let formGroupArray = this.fb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.updateHolidayForm.get('holiday') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item = arrayControl.at(i);
      formGroupArray.push(item);
    }
    this.updateHolidayForm.setControl('holiday', formGroupArray);
    this.holidayAddDisableFlag = true;
    this.newRow = true;
  }

  chamberRefList: any = [];
  setChamber(event, chamberDto, index){
    if(event.target.checked){
      let payload = {
        "doctorHolidayPk": chamberDto.doctorHolidayPk==null?null:chamberDto.doctorHolidayPk,
        "chamberRefNo" : chamberDto.chamberRefNo
      }
      this.chamberRefList.push(payload);
    }
    else{
      let index = this.findIndexToUpdateChamber(chamberDto.chamberRefNo);
      console.log("index = " + index)
      this.chamberRefList.splice(index, 1);

      console.log(this.chamberRefList);
    }
  }
  findIndexToUpdateChamber(chamberRefNo) {
    for (let i = 0; i < this.chamberRefList.length; i++) {
      if (this.chamberRefList[i].chamberRefNo == chamberRefNo)
        return i;
    }
  }

}
