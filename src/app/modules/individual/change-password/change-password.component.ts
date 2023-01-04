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
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { IndividualService } from './../individual.service';
import { ModalService } from './../../../shared/directive/modal/modal.service'
import { ToastService } from './../../../core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  occupationForm: FormGroup;
  user_id: any;
  ms_user_id: any;
  regProvider: any;
  hasPassword: any;
  changePasswordFormSubmitted: any = false;
  forgetSetPassword: any = false;
  setSocialPassword: any;

  subscribe: any;
  showeye: Boolean = false;
  shownew_passwordeye: Boolean = false;
  showrepeat_passwordeye: Boolean = false;
  showSuccessMessageOnChangePassword = false;
  successMsgFor = "changePassword";
 
  constructor(private route: ActivatedRoute,  
    private frb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private _location: Location,
    private toastService: ToastService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private individualService :IndividualService,
    private broadcastService: BroadcastService,
    private authService: AuthService) { 
    
    
      this.changePasswordForm = frb.group({
        'oldPassword': [null, Validators.required],
        'newPassword': [null, [Validators.required,Validators.pattern(/^[A-Za-z\d]{8,20}/)]],
        'repeatPassword': [null, [Validators.required,Validators.pattern(/^[A-Za-z\d]{8,20}/)]],
        'setPassword': [null, [Validators.required,Validators.pattern(/^[A-Za-z\d]{8,20}/)]]
      });
      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('en');
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en'); // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('en');
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en');
    }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.ms_user_id = user.userId;
    this.regProvider = user.registrationProvider;
    this.hasPassword = user.hasPassword;
    if (user.hasPassword == false) {
      this.broadcastService.setHeaderText('Set Password');
    } else {
      this.broadcastService.setHeaderText('Change Password');
    }
    if (this.regProvider == 'SBIS' && this.hasPassword == true) {
      this.forgetSetPassword = true;
    } else if (this.regProvider != 'SBIS' && this.hasPassword == true) {
      this.forgetSetPassword = true;
    }
  }


  backClicked() {
    this._location.back();
  }

  setPassword(formValue) {
    let query = {
      'msUserId': this.ms_user_id,
      'password': this.changePasswordForm.get('setPassword').value
    }
    if (this.regProvider != 'SBIS' && this.hasPassword == false) {
      this.authService.setPassword(query).subscribe((result) => {
        if (result.status === 2000) {
          this.toastService.showI18nToast("TOAST_MSG.PASSWORD_SET_SUCCESSFULLY", 'success');
          // this.router.navigate(['/individual/tab-personal']);
          this.successMsgFor = "setPassword";
          this.showSuccessMessageOnChangePassword = true;
        }
      });
    }
    this.forgetSetPassword = true;
    this.hasPassword = true;
    let user = JSON.parse(localStorage.getItem('user'));
    user.hasPassword = true;
    localStorage.setItem("user", JSON.stringify(user));
   
    // if (this.regProvider != 'SBIS' && this.hasPassword == true) {
    //   this.forgetSetPassword = true;
    // }
  }

  onSubmit(formValue) {
    this.changePasswordFormSubmitted = true;
    // if(this.changePasswordForm.invalid){
    //   return;
    // }
    if (formValue.oldPassword == null && formValue.newPassword == null && formValue.repeatPassword == null) {
      this.toastService.showI18nToast("TOAST_MSG.FILLOUT_FIELDS", 'warning');
    } else if (formValue.newPassword == null) {
      this.toastService.showI18nToast("TOAST_MSG.ENTER_NEW_PASSWORD", 'warning');
    } else if (formValue.repeatPassword == null) {
      this.toastService.showI18nToast('TOAST_MSG.ENTER_NEW_PASSWORD_AGAIN', 'warning');
    } else if(formValue.newPassword!==formValue.repeatPassword){
      this.toastService.showI18nToast('TOAST_MSG.NEW_REPEAT_PASSWORD_NOT_SAME', 'warning');
    }
    else {
    this.individualService.changePassword({
       'oldPassword': formValue.oldPassword,
       'newPassword': formValue.newPassword,
       'repeatPassword': formValue.repeatPassword,
       'userId': this.ms_user_id
      }).subscribe((data) => {
      this.changePasswordFormSubmitted = false;
      if (data.status === 2000) {
      this.toastService.showI18nToast(data.message, 'success');
      // this.router.navigate(['/individual/tab-personal']);
      this.showSuccessMessageOnChangePassword = true;
      } else {
        this.toastService.showI18nToast(data.message, 'error');
      }
      // this.router.navigate(['/individual/tab-personal']);
    },
      (error) => {

      });
    // submit the value get the data show on dashbpard
   }
  }

  
  get passwordChangeControls () { return this.changePasswordForm.controls; }



  ngOnDestroy() {
   //this.subscribe.unsubscribe();
  }

  showPassword(){
    this.showeye = !this.showeye;
  }

  shownewPassword(){
    this.shownew_passwordeye = !this.shownew_passwordeye;
  }

  showRepeatPassword(){
    this.showrepeat_passwordeye = !this.showrepeat_passwordeye;
  }
}
