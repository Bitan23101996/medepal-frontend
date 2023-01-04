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

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { ToastService } from './../../core/services/toast.service';
import { ModalService } from './../../shared/directive/modal/modal.service'
import { strictEqual } from 'assert';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verifications',
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.css']
})
export class VerificationsComponent implements OnInit {
  user_id: any;
  ms_user_id: any;
  userName: any;
  roleName: String;
  mobile_otp: any;
  mobile_no: any;
  isEmailVerified=false;
  user_name: any;
  logUser: string;
  isEmailLogin: boolean;
  entityName: any;
  modalRef: BsModalRef;
  config = {
    class: 'modal-md',
    backdrop: true,
    ignoreBackdropClick: true
  };
  @ViewChild('mobile_otp_modal') mobile_otp_modal: TemplateRef<any>;

 constructor(
   private router: Router,
   private authService: AuthService,
   private modalService: ModalService,
   private toastService: ToastService,
   private bsModalService: BsModalService,
   private translate: TranslateService
 ) {
   // this language will be used as a fallback when a translation isn't found in the current language
   translate.setDefaultLang('en');
   // the lang to use, if the lang isn't available, it will use the current loader to get them
   translate.use('en');
  }

 ngOnInit() {
  let user = JSON.parse(localStorage.getItem('user'));
  if(!user){
    this.router.navigate(['/auth/login']);
    return;
  }
  this.user_id = user.id;
  this.ms_user_id = user.userId;
  this.userName = user.userName;
  this.roleName = user.roleName;
  this.entityName = user.entityName;
  
 // this.authService.logUserProfile(this.user_id);

  let loginUser = localStorage.getItem('loginUser');
  //this.user_name = loginUser.userName;
  // console.log(loginUser);
  this.logUser = loginUser;
  this.emailMobileCheck();
}

emailMobileCheck() {
  if (this.logUser.includes('@')) {
    this.isEmailLogin = true;
   }else{
    this.isEmailLogin = false;
   }
}

skipVerification() {
  this.router.navigate(['/individual/user-profile-view/tab-personal']);
}
resendVerification() {
  var path = this.roleName+ '/' + this.ms_user_id;
  this.authService.resendVerifyMail(path).subscribe(result=>{
    if (result.status != 2000) {
      return;
    }
    this.isEmailVerified = true;
    this.toastService.showI18nToast('USER_PROFILE_TOAST.VERIFICATION_SENT','success');
    setTimeout(() => {
      this.isEmailVerified = false;
    }, 6000);
  })
}

sendOtp() {
  let mobileNo = localStorage.getItem("loginUser");
  let query = {
    "contactNo": mobileNo,
    "smsActionType": "OTPSEND"
  }
  this.authService.sentOTP(query).subscribe((result) => {
    if (result.status === 2000) {
      this.modalRef = this.bsModalService.show(this.mobile_otp_modal, this.config);
      this.toastService.showI18nToast("OTP send successfully", "success");
    }
  });
}

resendOtp() {
  let mobileNo = localStorage.getItem("loginUser");
  let query = {
    "contactNo": mobileNo,
    "smsActionType": "OTPSEND"
  }
  this.authService.sentOTP(query).subscribe((result) => {
    if (result.status === 2000) {
      this.toastService.showI18nToast("OTP send successfully", "success");
    }
  });
}

submitOtp(otp: any) {
  if(otp == null) {
    this.toastService.showI18nToast("Please enter OTP to continue", "warning");
    return;
  }
  let mobileNo = localStorage.getItem("loginUser");
  this.authService.mobileVerification({'contactNo': mobileNo,'verificationCode': otp}).subscribe((result) => {
    if (result.status == 2009) {
      this.closeModal();
      this.toastService.showI18nToast("Mobile no verified!", "success");
      if(this.roleName === 'INDIVIDUAL'){
        this.router.navigate(['/individual/tab-personal']);
      }else if(this.roleName === 'DOCTOR'){
        this.router.navigate(['/searchPatient']);
      }else if(this.entityName === 'HOSPITAL'){
        this.router.navigate(['/opd/opdPharmacyView/opd']);
      }else if(this.entityName === 'PHARMACY'){
        this.router.navigate(['/opd/opdPharmacyView/pharmacy']);
      }
      return;
    } 
    if(result.status == 5056) {
      this.toastService.showI18nToast("Wrong OTP entered", "error");
    }
  });
}

closeModal() {
  this.modalRef.hide();
  this.mobile_otp = null;
}

}
