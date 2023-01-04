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
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { DoctorService } from '../doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from 'src/app/core/services/toast.service';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};




@Component({
  selector: 'app-doctor-chamber',
  templateUrl: './doctor-myChamber.component.html',
  styleUrls: ['./doctor-myChamber.component.css']
})



export class DoctorMyChamberComponent implements OnInit {
  states: string[] = [];
  filteredStates: Observable<string[]>;
  cities: Object[] = [];
  filteredCities: Observable<string[]>;
  countries: string[] = [];
  filteredCountries: Observable<string[]>;
  filteredCountriesSingle: any[];
  filteredStateSingle: any[];

  filteredAddressTypesSingle: any[];
  filteredOPDsSingle: any[];
  autoConfirmApp: String = 'N';
  msUserPk: any;
  doctorPk: any;
  chamberPk: any;
  combinedAddress: any = [];
  chamberList: any = [];
  doc_refno: any;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private _doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private broadcastService: BroadcastService) { }

  ngOnInit() {
    this.broadcastService.setHeaderText('My Chambers');
    let user = JSON.parse(localStorage.getItem('user'));
    this.msUserPk = user.userId;
    this.doctorPk = user.id;
    this.doc_refno = user.refNo;
    if (this.msUserPk != null)
      var request = {
        "refNo": this.doc_refno
      }
    this._doctorService.getAllChamberByDoctorRefNo(request).subscribe(
      result => {
        // this.createChamberForm(result);
        console.log("result", result);
        this.getCombinedChamberAddress(result);
        this.chamberList = result.data;
        return;
      }
    )
    //this.createChamberForm(null);

  }
  //****************************END    ON    INIT*****************************//

  sortFunc(a, b) {
    return a.dayOfWeek - b.dayOfWeek
  }

  chamberEdit(chamber_ref) {
    this.router.navigate(['doctor/editChamber', { chamber_ref: chamber_ref }])
  }
  addChamber(){
    this.router.navigate(['doctor/chamber']);
  }

  chamberDelete(index, chamber) {

    let query = {
      "doctorRef": this.doc_refno,
      "chamberRef": chamber.chamberRefNo
    }
    if (confirm('Are you sure to remove this chamber?')) {
      this._doctorService.getDoctorAppointmentForMyChamber(query).subscribe(
        result => {
          console.log("count", result);
          if (result.data != null && result.data != 0) {
            this.toastService.showI18nToast("Can not remove this chamber as there are " + result.data + " pending appointments here", "warning");
          } else {
            ///check query param
            let payload = {
              "chamberRefNo": chamber.chamberRefNo
            }
            this._doctorService.deleteChamber(payload).subscribe(
              res => {
                console.log(res);
                this.toastService.showI18nToast('DOCTOR_CHAMBER.DOCTOR_CHAMBER_REMOVED_SUCCESSFULLY', "success");
                this.ngOnInit();
              },
              (error) => {
                this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
                return;
              })
          }

        },
        (error) => {
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
          return;
        })
    } else {
      setTimeout(()=>{
        document.getElementsByClassName('clicked')[0]['disabled'] = false;
        document.getElementsByClassName('clicked')[0].classList.remove("clicked");
      }, 1000/3);
    }

  }

  getCombinedChamberAddress(result) {
    for (let i = 0; i < result.data.length; i++) {
      this.combinedAddress[i] = "";
      if (result.data[i].line1 == null || result.data[i].line1 == "") {
        if (result.data[i].line2 == null || result.data[i].line2 == "") {
          this.combinedAddress[i] += (result.data[i].city == null || result.data[i].city == "") ? "" : result.data[i].city;
        }
        else {
          this.combinedAddress[i] = result.data[i].line2;
          this.combinedAddress[i] += (result.data[i].city == null || result.data[i].city == "") ? "" : ", " + result.data[i].city;
        }
      }
      else {
        this.combinedAddress[i] = result.data[i].line1;
        if (result.data[i].line2 == null || result.data[i].line2 == "") {
          this.combinedAddress[i] += (result.data[i].city == null || result.data[i].city == "") ? "" : ", " + result.data[i].city;
        }
        else {
          this.combinedAddress[i] += ", " + result.data[i].line2;
          this.combinedAddress[i] += (result.data[i].city == null || result.data[i].city == "") ? "" : ", " + result.data[i].city;
        }
      }

      //this.chamberArray.push(this.chamberForm);
    }
  }
}
