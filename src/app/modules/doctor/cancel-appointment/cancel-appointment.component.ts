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
import { FormBuilder, Validators, FormGroup, FormArray, FormControl, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { DoctorService } from '../doctor.service';
//import { window } from 'rxjs-compat/operator/window';
import { environment } from '../../../../environments/environment';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format/date-format.pipe';
import { TimeFormatPipe } from 'src/app/shared/pipes/time-format/time-format.pipe';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-cancel-appointment',
  templateUrl: './cancel-appointment.component.html',
  styleUrls: ['./cancel-appointment.component.css'],
  providers: [DateFormatPipe]
})

export class CancelAppointmentComponent implements OnInit {

  chamberList: any = [];
  // currentChamberList: any = [];
  appointments: FormGroup;
  doctorPk: any;
  chamberPk = null;
  from = null;
  to = null;
  user: any;
  showChamberFlag = false;
  markAsHoliday = false;
  chamber = 0;
  dtFormat = "";
  fromDate: any;
  toDate: any;
  minDate: Date;
  action: any;
  fromDateValidator: any;
  showBtnFlag: any;
  shwReason : boolean = false; //app/Issues/1497
  @ViewChild('search') search: NgForm;
  dateFormat: any;
  a : any;
  loading: boolean = false;


  constructor(private fb: FormBuilder, private http: HttpClient,
    private _doctorService: DoctorService,
    private toastService: ToastService,
    private router: Router,
    private dateFormatPipe: DateFormatPipe,
    private broadcastService: BroadcastService) { 
      this.minDate = new Date();
    }

  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    const url = window.location.href.toString();
    console.log("URL = "+url);

    if (url.indexOf('/cancel') > 0){
      this.broadcastService.setHeaderText('Cancel Appointment');
      this.action = "cancel";
    }

    if (url.indexOf('/holiday') > 0){
      this.broadcastService.setHeaderText('Mark as Holiday');
      this.action = "holiday";
    }
    
    this.dtFormat = environment.DATE_FORMAT;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.doctorPk = this.user.id;
    //this.getDoctorProfilePkFromMsUserPk(this.user.userId);
    this.fromDateValidator = true;
    this.showBtnFlag = false;
    let request={
          "refNo":this.user.refNo
         };
     this._doctorService.getAllChamberListv2(request)
      .subscribe(res => {
        this.chamberList = res;
      },
        err => {
          console.log(err);
        }
      )
    this.appointments = this.fb.group({
      appointmentList: []
    })
  }
  //****************************END    ON    INIT*****************************//

  get appointmentList(): FormArray {
    return this.appointments.get('appointmentList') as FormArray;
  }

  // getDoctorProfilePkFromMsUserPk(userPk) {
  //   this._doctorService.getDoctorProfilePkFromMsUserPk(userPk)
  //     .subscribe(res => {
  //       this.doctorPk = res['data'];
  //    });
  // }

  onValueChange(label: any, dt: Date): void {
    if (label == 'fromDate') {
      this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
      this.validateFromAndToDate(this.fromDate, this.toDate);
    }
    if (label == 'toDate') {
      this.toDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
      this.validateFromAndToDate(this.fromDate, this.toDate);
    }
  }

  validateFromAndToDate(fromDate: any, toDate: any): boolean {
    if (fromDate != undefined && toDate != undefined) {
      if (fromDate > toDate){
        this.toastService.showI18nToast('APPOINTMENT.APPOINTMENT_FROM_DATE_LT_TO_DATE', 'error');
        return false;
      }
      else
        return true;
    }
    else
      return true;
  }
  searchAppointment() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    if (this.search.valid) {
      console.log(this.search.value);
      this.chamber = this.search.value.chamber;
      console.log(this.search.value.chamber)
      let endDate = this.fromDate;
      if(typeof this.toDate !== "undefined")
        endDate = this.toDate;
      
      let payload = {};
        
      payload = {
        doctorRefNo : this.user.refNo,
        chamberRefNo : this.chamber == 0 ? "" : this.chamber,
        fromDate : this.fromDate,
        toDate : endDate
      }
      console.log(payload);
      //this._doctorService.getRangedAppointments("" + this.user.id + "/" + ((this.chamber == 0) ? "" : this.chamber) + "?from=" + this.fromDate + "&to=" + endDate + "").subscribe(
        //this._doctorService.getRangedAppointments(payload).subscribe(
        this._doctorService.getRangedAppointmentsV2(payload).subscribe(
        res => {
          let appointmentList: FormGroup[] = [];

          for (let i = 0; i < res['data'].length; i++) {
            console.log(res['data'][i]);

            var fb = this.fb.group({
              isChecked: '',
              //appointmentPk: res['data'][i].appointmentPk,
              appointmentRefNo: res['data'][i].appointmentRefNo,
              chamberName: res['data'][i].chamber,
              appointmentCxlReason: null,
              // appointmentState: res['data'][i].appointmentState,
              patientName: res['data'][i].patientName + " (" + res['data'][i].age + "/" + res['data'][i].gender + ")",
              appointmentDate: res['data'][i].appointmentDate,
              appointmentDateStr: this.convert(res['data'][i].appointmentDate.toString()),
              // remarks: res['data'][i].remarks,
              appointmentTime: res['data'][i].appointmentTime,
              appointmentTimeStr :this.convert1(res['data'][i].appointmentTime.toString()),
              //doctorPk: res['data'][i].doctorPk,
              //userPk: res['data'][i].userPk,
              // emailId: res['data'][i].emailId,
              doctorRefNo: this.user.refNo
            });
            appointmentList.push(fb);
            // if (this.currentChamberList.indexOf(res['data'][i].chamberPk) === -1)
            //   this.currentChamberList.push(res['data'][i].chamberPk);
          }
          this.appointments = this.fb.group({
            appointmentCxlReason: null, // app/Issues/1497
            appointmentList: this.fb.array(appointmentList)
          })
         // console.log(this.appointments);
          //console.log(this.appointments.controls.appointmentList.value);
          
          //app/Issues/1497
          if(this.appointmentList.length > 0){
            this.shwReason = true;
          }else{
            this.shwReason = false;
          }

          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
        },
        err => {
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
        }
      )
    }
  }

  cancelAppointments() {
    for (let i = 0; i < this.appointmentList.value.length; i++) {
      console.log(this.appointmentList.value[i]);
      
      if (!this.appointmentList.value[i].isChecked) {
        continue;
      }
      else {
        this.appointmentList.value[i].appointmentState = 'CXL';
        this._doctorService.saveDoctorAppointment(this.appointmentList.value[i])
          .toPromise()
          .then(res => {
            console.log(JSON.stringify(res));
            if (res['status'] == '2000') {

              this.appointmentList.removeAt(this.appointmentList.value.findIndex(app => app.appointmentPk === res['data'].appointmentPk));
              this.toastService.showI18nToast("Selected appointments have been cancelled successfully","success");
            }
            else {
              this.toastService.showI18nToast(res['message'],"error");
            }
          });
      }
    }
    
  }
  appointmentCxlRsn : any;//app/Issues/1497
  cancelMultipleAppointments() {
    console.log(this.appointments.value.appointmentCxlReason);
    let query = {};
    let payload = [];
    let requestQuery:any; //app/Issues/1497
    
    if (confirm('Are you sure to cancel all selected appointments?')) {
      for (let i = 0; i < this.appointmentList.value.length; i++) {
        console.log(this.appointmentList.value[i]);
        if (!this.appointmentList.value[i].isChecked) {
          continue;
        }
        else {
          let query = {
            appointmentCxlByRefNo: this.user.refNo,
            appointmentRefNo: this.appointmentList.value[i].appointmentRefNo,
            appointmentState: 'CXL',
            entityName: this.user.entityName
          }
         
          payload.push(query);
           
        }
        console.log("Del data",payload);
        
      }
     //app/Issues/1497
      requestQuery={
        cancelAppointmentList:payload,
        appointmentCxlRsn: this.appointments.value.appointmentCxlReason
      
      }
  
      this._doctorService.cancelMultipleAppointmentsV2(requestQuery).subscribe((data) => {
        if (data['status'] == '2000') {
          this.toastService.showI18nToast("Selected appointments have been cancelled successfully","success");
          this.searchAppointment();
        }
        else{
          this.toastService.showI18nToast(data['message'],"error");
        }
      });
    }
    
  }

  setValidator(index) {
    if (this.appointmentList.controls[index].value.isChecked) {
      this.appointments.controls.appointmentList['controls'][index].controls.appointmentCxlReason.setValidators(Validators.required);
      this.appointments.controls.appointmentList['controls'][index].controls.appointmentCxlReason.updateValueAndValidity();
      console.log(this.appointments.controls.appointmentList['controls'][index].controls.appointmentCxlReason);
      this.showBtnFlag = true;
    }
    else {
      this.appointments.controls.appointmentList['controls'][index].controls.appointmentCxlReason.setValidators(null);
      this.appointments.controls.appointmentList['controls'][index].controls.appointmentCxlReason.updateValueAndValidity();
      console.log(this.appointments.controls.appointmentList['controls'][index].controls.appointmentCxlReason);
      this.showBtnFlag = false;
    }
  }

  selectAll(event) {
    if (event.target.checked) {
      this.showBtnFlag = true;
      this.appointmentList.controls.forEach(app => {
        app['controls'].isChecked.setValue(true);
        app['controls'].appointmentCxlReason.setValidators(Validators.required);
        app['controls'].appointmentCxlReason.updateValueAndValidity();
      });
    }
    else {
      this.showBtnFlag = false;
      this.appointmentList.controls.forEach(app => {
        app['controls'].isChecked.setValue(false);
        app['controls'].appointmentCxlReason.setValidators(null);
        app['controls'].appointmentCxlReason.updateValueAndValidity();
      });
    }
  }

  showChamber(chamber) {
    if (chamber == 'A') {
      this.showChamberFlag = false;
      this.chamber = 0;
    }
    else {
      this.showChamberFlag = true;
    }
  }

  cancelAllAppointments(search: NgForm) {
    let endDate = this.fromDate;
    if(typeof this.toDate !== "undefined")
      endDate = this.toDate;

    if(typeof this.fromDate !== "undefined"){  
      this.fromDateValidator = true;
      
      if (!this.validateFromAndToDate(this.fromDate, this.toDate))
        return;
  
      let searchPath = this.user.refNo + "&" + this.fromDate + "&" + endDate + "&" + (search.value.chamber == 0 ? null : search.value.chamber);
      console.log("searchPath = "+searchPath);
      
      let payload = {};
      payload = {
        fetchCancelStr : searchPath
      }

      if (confirm('Any appointments during this period will be cancelled. Do you want to proceed?')) {
        this._doctorService.searchAndCancelAppointmentV2(payload).subscribe(res => {
          if (res['status'] == '2000') {
            this.toastService.showI18nToast(res['message'],"success");
            this.search.controls.chamber.setValue(0);
            this.router.navigate(['doctor/holidayList',{}]);
          }
        });
      } else { }
    }else{
      this.fromDateValidator = false;
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  }
  convert1(str:string)
  {
    let strsplitArr: string [] = str.toString().split(':');
    return strsplitArr[0] + ':' + strsplitArr[1];
  }
  

  fetchdate()
  {
              //document.getElementById('welcome-msg').innerHTML ='hi' + '&nbsp;' + this.dateFormatPipe.transform(this.from);
            this.a= document.getElementsByName('to').item
              
  }

}
