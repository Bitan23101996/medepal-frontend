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
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SBISConstants } from 'src/app/SBISConstants';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor( private translate: TranslateService,
    private toastr: ToastrService) {
      translate.setDefaultLang('en');
      translate.use('en');
     }


  checkBtn(){

       let submitBtn = document.getElementsByTagName("button");

       for(let i=0;i<submitBtn.length;i++){
         //console.log(submitBtn[i].classList.contains("clicked"));
         //console.log(submitBtn[i].classList.value);
         if(submitBtn[i].classList.contains("clicked")){
           console.log(submitBtn[i].classList);
           submitBtn[i].disabled = false;
           submitBtn[i].classList.remove("clicked");
         }
       }
     }

  public showToast(msgType: any, message: string) {

    let snackbarDoc = document.getElementById("snackbar");
    snackbarDoc.className = snackbarDoc.className.replace("show", "");
    snackbarDoc.innerHTML = ""
    let color = {
      fontColor: "",
      bgColor: "",
      preFix: "",
      logo: ""
    }
    if (msgType == 2000) {
      color.fontColor = "#4F8A10";
      color.bgColor = "#DFF2BF";
      color.preFix = "Success!";
      color.logo = "<i style='padding-left: 43px;' class='fas fa-check'></i>";
    } else {
      color.fontColor = "#D8000C";
      color.bgColor = "#FFBABA";
      color.preFix = "Error!";
      color.logo = "<i style='padding-left: 43px;' class='far fa-times-circle'></i>"
    }

    if (message != "Unknown Error") {
      snackbarDoc.style.backgroundColor = color.bgColor;
      snackbarDoc.innerHTML = "<div style='padding-top: 13px;' class='row'>"+color.logo+"<p style='padding-left: 10px;padding-right:20px;color:" + color.fontColor + "'>" + message + "</p><span style='padding-right: 36px;' class='cursor' id='close-toast' style='color:red;'>X</span></div>";
      snackbarDoc.className = "show";
    }
    // setTimeout(function () {
    //   //snackbarDoc.className = snackbarDoc.className.replace("show", "");
    //   //snackbarDoc.innerHTML = "";
    // }, 2000);

    let elToast = document.getElementById("close-toast");
    if (elToast) {
      elToast.addEventListener("click", function () {
        snackbarDoc.className = snackbarDoc.className.replace("show", "");
        snackbarDoc.innerHTML = "";
      });
    }
  }

  public i18nToast(lang:any,jsonkey:any,msgType:any){
    if(lang && lang!=''){
      this.translate.setDefaultLang(lang);
    }
    this.translate.get(jsonkey).subscribe((res: string) => {
     
      if (msgType == 'warning'){
         this.toastr.warning(res);
         setTimeout(() => {
         this.checkBtn();
       },2000);
      }
      else if (msgType == 'error'){
        this.toastr.error(res);
        setTimeout(() => {
        this.checkBtn();
      },2000);
      }
      else if (msgType == 'success') {
        this.toastr.success(res);
      }
      else if (msgType == 'info') {
        this.toastr.info(res);
      }
   });
  }

  public showI18nToast(jsonkey: any, msgType: any) {
    let user = JSON.parse(localStorage.getItem('user'));
    if(user && user.lang && user.lang != ''){
      this.translate.setDefaultLang(user.lang);
    }else{
      this.translate.setDefaultLang('en');
    }
    this.translate.get(jsonkey).subscribe((res: string) => {

      if (msgType == 'warning'){
         this.toastr.warning(res);
         setTimeout(() => {
         this.checkBtn();
       },2000);
      }
      else if (msgType == 'error'){
        this.toastr.error(res);
        setTimeout(() => {
        this.checkBtn();
      },2000);
      }
      else if (msgType == 'success') {
        this.toastr.success(res);
      }
      else if (msgType == 'info') {
        this.toastr.info(res);
      }
   });
  }

  // New method - app#894
  public showI18nToastFadeOut(jsonkey: any, msgType: any) {
    let user = JSON.parse(localStorage.getItem('user'));
    if(user && user.lang && user.lang != ''){
      this.translate.setDefaultLang(user.lang);
    }else{
      this.translate.setDefaultLang('en');
    }
    this.translate.get(jsonkey).subscribe((res: string) => {
     
      if (msgType == 'warning'){
         this.toastr.warning(res, '', {disableTimeOut: false, timeOut: parseInt(SBISConstants.TOAST.FADE_AWAY_TIME)});
      } 
      else if (msgType == 'error'){
        this.toastr.error(res, '', {disableTimeOut: false, timeOut: parseInt(SBISConstants.TOAST.FADE_AWAY_TIME)});
      }
      else if (msgType == 'success') {
        this.toastr.success(res, '', {disableTimeOut: false, timeOut: parseInt(SBISConstants.TOAST.FADE_AWAY_TIME)});
      }
      else if (msgType == 'info') {
        this.toastr.info(res, '', {disableTimeOut: false, timeOut: parseInt(SBISConstants.TOAST.FADE_AWAY_TIME)});
      }
   });
  }
}
