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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServerResponse } from './server-response';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { FormGroup } from "@angular/forms";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};




@Injectable({
  providedIn: 'root'
})
export class DoctorServiceComponent {

  

  constructor(
    private router: Router,
    //private baseService: BaseService, 
    private http: HttpClient
  ) { }

  handleResponse(res): ServerResponse {
    const data = res;
    if (data.error) {
      // const error: Error = { error: data.error, message: data.message };
      // throw new Error(this.errorHandler.parseCustomServerErrorToString(error));
    } else {
      return data;
    }
  }
  // logUserProfile(user_id: any) {
  //   this.baseService.get(apiPath.LOAD_USER_PROFILE + user_id ).subscribe((data: ServerResponse) => {
  //     if (data.status === 2000) {
  //         if (data.data.profileverified === true) {
  //           this.router.navigate(['/user-landing']);
  //         }
  //     }
  //   },
  // (error) => {

  // });
  // }
  // userFamilyListView(user_id: any) {
  //   return this.baseService.get(apiPath.USER_FAMILY_LIST_VIEW + user_id);
  // }
  // getUserFullProfile(user_id: any) {
  //  return this.baseService.get(apiPath.USER_FULL_PROFILE + user_id);
  // }
  // updateUserProfile(profileData: any) {
  //   return this.baseService.get/*put*/(apiPath.UPDATE_USER_PROFILE /*, profileData*/);
  // }
  // getQualificationList() {
  //   return this.baseService.get/*put*/(apiPath.GET_QUALIFICATION_DOCTOR /*, profileData*/);
  // }
  // getSpecializationList() {
  //   return this.baseService.get/*put*/(apiPath.GET_SPECIALIZATION_DOCTOR /*, profileData*/);
  // }
  // getAddressTypeList() {
  //   return this.baseService.get/*put*/(apiPath.GET_ADDRESSTYPE_DOCTOR /*, profileData*/);
  // }
  // getEmailList(path)
  // {
  //   return this.baseService.get1/*put*/(path /*, profileData*/);
  // }
  // addUserMember(memberData: any) {
  //   console.log(memberData);
  //   return this.baseService.post(apiPath.ADD_USER_MEMBER, memberData).subscribe((data: ServerResponse) => {
  //     if (data.status === 2000) {
  //       this.router.navigate(['user-family']);
  //     }
  //   },
  // (error) => {

  // });
  // }

  //saveUrl="http://samik-pc:8001/save-doctor-info";
saveUrl="http://samik-pc:9091/save-doctor-info";
getEmailid="http://samik-pc:9091/if-exists-email/";

  saveDoc(doctorForm){
    this.http.post(this.saveUrl, JSON.stringify(doctorForm.value), httpOptions)
    .toPromise()
    .then(res => {
      console.log(JSON.stringify(res));
      alert("Saved Successfully");
    })
  }

}
