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

import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Route, Router } from '@angular/router';
// import { ToastService } from './../../core/services/toast.service';
import { ToastService } from '../services/toast.service';
import { BroadcastService } from './../../core/services/broadcast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetSet } from '../utils/getSet';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  overlayCount = 0;
  excludeUrls=[
    'v1/inusers/alerts/check-new-alerts',
    'v1/groups/486/inusers',
    '/gen/v1/users/email?q=',
    '/gen/v1/users/contactno?q',
    '/gen/v2/users/email',
    '/gen/v2/users/contactno',
    'v1/inusers/alerts',
    'v1/rating/DoctorByIndividual',
    '/gen/v1/serviceprovider/getHospitalList',
    'gen/v1/cart/item-count',
    'v1/doctor/prescription/autoSavePrescriptionDetails',
    'v1/inusers/get-md-findings-long-name',
    'v1/doctor/prescription/getAllModelAttributeValuesForMedication',
    '/sbis_medicine_idx/_search',
    'v1/doctor/prescription/getLabTestList',
    'gen/v1/medicine/get-medicine-by-name',
    'gen/v1/inusers/favoriteDoctor',
    'gen/v1/doctor/prescription/getDoctorNameList',
    'gen/v1/doctor/prescription/getHospitalNameList',
    'v1/generate/refresh-token',
    'v1/inusers',
    'v3/doctor/get-calendar-doctor-chamber',
    'v2/doctor/get-doctor-chambers',
    'gen/v1/items/get-all-fees',
    'v1/groups/members',
    'http://68.183.80.156:9200/sbis_medicine_idx/_search',
    'gen/v1/get-attribute-by-name',
    'v1/doctor/get-briefResume',
    'v1/getCountryStateCityByPin',
    'v2/inusers/minors/get-all-by-refno',
    'v2/inusers',
    'v4/doctor/get-calendar-doctor-chamber',
    'v1/groups/members',
    'gen/v2/retrive-rating-details',
    'gen/v1/get-attribute-by-name/DOSAGE_DURATION', //Working on app/issues/659
    'gen/v1/get-attribute-by-name/DURATION_UNIT', //Working on app/issues/659
    'v1/doctor/prescription/getRepeatMedication', //Working on app/issues/659
    'v2/doctor/prescription/get-frequent-prescribed-medicine-list', //Working on app/issues/659
    'v2/doctor/prescription/get-frequent-prescribed-test-list', //Working on app/issues/659
    'gen/v1/investigation/get-investigation-by-name', //Working on app/issues/720
    'gen/v1/investigation/get-diagnosis-by-name', //Working on app/issues/747
    'v1/patient/get_medicale_attr_pk_by_systemcode', //Working on app/issues/657
    'v1/get-feedback', //Working on app/issues/772,
    'v1/check-referral-doctor/existence',
    'v1/inusers/get-procedure',//issue number 765
    'v2/get-hospital-list-by-category',//issue number 765
    'v1/retrive/all-topic-by-role',
    'v1/retrive/all-sub-topic-by-topic',
    'v1/retrive-all-sub-topic-images',
    'gen/v1/download-document',
    'v1/find-or-save-medical-attribute',
    'v1/retrive/unique-medical_recordes',
    'gen/v1/get-all-md-attributes',
    'gen/v1/inusers/masterdata',
    'v1/get-md-medical-attribute',
    'v1/get-menu-structure-for-quick-add-flag',
    'v5/doctor/get-calendar-doctor-chamber', // https://gitlab.com/sbis-poc/app/issues/1025
    'v1/patient/fetch-problem-narration-by-appoinmentRefNo', //https://gitlab.com/sbis-poc/app/issues/1199
    'v1/doctor/get-doctor-appointment-view-by-refNo', // Working on app/issues/1281
    'v1/opd/getIpdServiceList', // Working on app/issues/1438
    'v1/opd/getIpdServiceRateByRefNoAndQuantity', // Working on app/issues/1499
    'v1/get-hospital-category-list', // Issue app#1513
    'v1/opd/get-bed-list-by-room',//  Issue app#1513
    'v1/opd/get-room-list-by-department',//Issue app#1513
    'v1/opd/check-bed-occupancy',//Issue app#1513
    'v1/opd/check-duplicate-room-category',
    'v1/opd/getIpdServiceListWithChargeType',// Working on app/issues/1499
    'v1/retrieve/group-invitation-list',
    'gen/v1/groups/inusers/invitation/accept',
    'v1/group-invitation-reject',
    'v2/doctor/save-doctor-appointment',
    'v2/opd/get-inpatient-admission-details',// Working on app/issues/1844
    'v1/opd/getIpdServices', //app#2264
    'v1/get-hospital-list-by-hospital-name'//https://gitlab.com/sbis-poc/app/-/issues/2504
  ];

  excludeToastUrls=[
    'v1/inusers/alerts/check-new-alerts',
    'v1/inusers/alerts',
    'gen/v1/cart/item-count'
  ]

  constructor(private spinner: NgxSpinnerService,
    private router: Router,
    public toastService: ToastService,
    private broadcastService: BroadcastService,
    ) { }

  private startOverlay(): void {
    this.overlayCount = this.overlayCount + 1;
   document.getElementById("overlay").style.display = "block";
   this.spinner.show();
  }
  private stopOverlay(): void {
    this.overlayCount = this.overlayCount - 1;
    if (this.overlayCount <= 0) {
      this.overlayCount = 0;
      document.getElementById("overlay").style.display = "none";
      this.spinner.hide();
    }
  }

  logOut() {
    localStorage.removeItem("user");
    this.broadcastService.setAuth(false);
    this.router.navigate(['/auth/landing']);
  }

  private checkExcluseURL(pr_url){
    for(let lv_url of this.excludeUrls){
      if(pr_url.includes(lv_url)){
        return true;
      }
    }

    return false;
  }

  private checkExcluseToastURL(pr_url){
    for(let lv_url of this.excludeToastUrls){
      if(pr_url.includes(lv_url)){
        return true;
      }
    }

    return false;
  }


  private handleError(er){
    if (er instanceof HttpErrorResponse && er.status==401) {
      let url=window.location.toString();
      if(url.indexOf('/auth/') == -1 && !this.checkExcluseToastURL(er.url)){
        console.log("session expired");
        GetSet.setSessionExpireBoolean(true);
        this.logOut();
        // this.toastService.showI18nToast('LOGIN.SESSION_EXPIRED','error');
      }
    }
  }


  checkBtn(){
    let submitBtn = document.getElementsByTagName("button");

    for(let i=0;i<submitBtn.length;i++){
      if(submitBtn[i].classList.contains("clicked")){
        submitBtn[i].disabled = false;
        submitBtn[i].classList.remove("clicked");
      }
    }
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    try {
      //this.startOverlay();
      // this.spinner.show();
  /*    if(!req.url.includes('v1/inusers/alerts/check-new-alerts') && (!req.url.includes('v1/groups/486/inusers'))
        && (!req.url.includes('/gen/v1/users/email?q=')) && (!req.url.includes('/gen/v1/users/contactno?q'))
        && (!req.url.includes('/gen/v2/users/email')) && (!req.url.includes('/gen/v2/users/contactno')) && (!req.url.includes('v1/inusers/alerts'))
        && (!req.url.includes('v1/rating/DoctorByIndividual')
        && (!req.url.includes('/gen/v1/serviceprovider/getHospitalList'))
        && (!req.url.includes('gen/v1/cart/item-count')))
        && (!req.url.includes('v1/doctor/prescription/autoSavePrescriptionDetails'))
        && (!req.url.includes('v1/inusers/get-md-findings-long-name'))
        && (!req.url.includes('v1/doctor/prescription/getAllModelAttributeValuesForMedication'))
        && (!req.url.includes('/sbis_medicine_idx/_search'))
        && (!req.url.includes('v1/doctor/prescription/getLabTestList'))
        && (!req.url.includes('gen/v1/medicine/get-medicine-by-name'))
        && (!req.url.includes('gen/v1/inusers/favoriteDoctor'))
        && (!req.url.includes('gen/v1/doctor/prescription/getDoctorNameList'))
        && (!req.url.includes('gen/v1/doctor/prescription/getHospitalNameList'))
        && (!req.url.includes('v1/generate/refresh-token'))
        && (!req.url.includes('v1/inusers'))
        && (!req.url.includes('v3/doctor/get-calendar-doctor-chamber'))
        && (!req.url.includes('v2/doctor/get-doctor-chambers'))
        && (!req.url.includes('gen/v1/items/get-all-fees'))
        && (!req.url.includes('v1/groups/members'))
      ) {
        this.spinner.show();
      } */
      /*if(!this.checkExcluseURL(req.url)){
        this.spinner.show();
      }*/
      let token = "";
      let user = JSON.parse(localStorage.getItem('user'));
      if(!req.url.includes('/gen/')){//checking the url includes gen or not[if not then token has been added]-- issue number-- https://gitlab.com/sbis-poc/app/issues/709
        if (user && user.token != null) {
          token =user.token;
          req = req.clone({ headers: req.headers.set('token', token) });
        } 
      }

     

      if (!req.headers.has('Content-Type')) {
        req = req.clone({ headers: req.headers.append('Content-Type', 'application/json') });
      }
      // setting the accept header
      req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

      return next.handle(req).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
       //  this.stopOverlay();
          /*this.spinner.hide();*/

          this.checkBtn();
        }
      }, (err: any) => {
        //this.stopOverlay();
        this.handleError(err);
       /*this.spinner.hide();*/
       this.checkBtn();
      });

    } catch (e) {
      this.handleError(e);
      this.checkBtn();
      //this.stopOverlay();
    }
  }
  

}
