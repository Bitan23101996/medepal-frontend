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
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { BroadcastService } from './../../core/services/broadcast.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService as SocialAuth, GoogleLoginProvider, FacebookLoginProvider } from 'angular-6-social-login-v2';
import { AuthService } from './../auth.service';
import { ToastService } from './../../core/services/toast.service';
import { ModalService } from './../../shared/directive/modal/modal.service'
import { UserStateRuleService } from './../userStateRuleService'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from './../../core/services/api.service';
import { GetSet } from '../../core/utils/getSet';

import { AngularFireDatabase} from "@angular/fire/database";//firebase
import { JsonTranslation } from '../../shared/translation';
import { SBISConstants } from '../../SBISConstants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('viewForgotPasswordModal') viewForgotPasswordModal: TemplateRef<any>;
  @ViewChild('getUserRoleName') getUserRoleName: TemplateRef<any>;

  loginForm: FormGroup;
  formSubmitAttempt: boolean;
  submitted: any = false;
  bodyText: any;
  otpMobile: any;
  isEmailVerified = false;
  roleName: any;
  otherRoleName: any;
  otherParentRoleName: any;
  parentRoleName: any;
  cookieLawSeen: boolean;
  modalRef: BsModalRef;
  formArray: any;
  isCheckedEmail: any;
  contactNo: any;
  isMobileVerified = false;
  showMobileOtp: any;
  otp: any;
  roleSelectLogin: any = false;
  modalRoles: any = [];
  role: any;
  otpValue: any = false;
  password: any;
  password1: any;
  password2: any;
  IsMatch: boolean = false;
  IsOTP: boolean = false;
  textBoxDisabled: any = false;
  textBoxDisabledInput: any;
  otpLoginText: any = false;
  otpLoginEntry: any = false;
  otpLoginEmail: any = false;
  otpVerified: any = false;
  profileImageSrc: any;
  peerConsultingLoginObj: any;
  logoSrc = "";
  phoneNo:any;
  emailTxt:any = false;
  userName:any;
  phoneField:any = false;
  disableTextbox =false;
  isCheckedMobile:boolean= true;
  emailFld:any;
  showeye: Boolean = false;
  displaySidebar: boolean = false;
  displaySidebarTerms: boolean = false;
  loginUserName: any;
  confirmationMsg: any = [];

  @ViewChild('cookieLaw')
  cookieLawEl: any;

  constructor(
    private firebaseDatabase: AngularFireDatabase,//firebase
    private fb: FormBuilder,
    private broadcastService: BroadcastService,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private toastService: ToastService,
    private socialAuthService: SocialAuth,
    private modalService: ModalService,
    private userStateRuleService: UserStateRuleService,
    private bsModalService: BsModalService,
    private apiService: ApiService,
    private jsonTranslate: JsonTranslation
  ) {
    this.loginForm = this.fb.group({
      'userName': [null, Validators.email],
      'password': [null, Validators.required],
      'fparentRoleName': this.otherParentRoleName,
      'role': this.otherRoleName,
      // 'otpForNumber': [null],
      'otp': this.otpValue,
      'emailAddress': [null, Validators.email],
      'phoneNo': [null, Validators.minLength(10)],
	  'phoneNoFP': [null, Validators.minLength(10)],
	  'password1': [null],
	  'password2': [null],
	  'otpFP':[null],
	  'emailFP':[null],
      'fcmkey':[null]
    });
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

  }

  ngOnInit() {
    //this.cookieLawSeen = this.cookieLawEl.cookieLawSeen;
    this.authService.logout();
    // if the user is loggedin then redireact to landing page
    if (sessionStorage.getItem('auth_key')) {
      // this.router.navigate(['/user-landing']);
    }
    this.roleName = 'INDIVIDUAL';
    this.peerConsultingLoginObj = GetSet.getPeerConsultingInvitationLogin();
    this.emailTxt = true;
    // localStorage.setItem("loginUser", JSON.stringify());
  }//end of oninit

  // login(){
  //   this.broadcastService.setAuth(true);
  //   this.router.navigate(['/individual']);
  // }

  // for Jasmin Test case
  get testSubmit() { return this.submitted; }
  get testLoginForm() { return this.loginForm; }
  // convenience getter for easy access to form fields
  get lControls() { return this.loginForm.controls; }

  userLogin(query: any) {
    query["roleName"] = this.roleName;
    query["parentRoleName"] = this.parentRoleName;
    // console.log(this.loginForm.get('role').value);
    // console.log(this.loginForm.get('fparentRoleName').value);
    if (this.roleName == 'OTHER') {
      query.roleName = this.loginForm.get('role').value;
      query.parentRoleName = this.loginForm.get('fparentRoleName').value;
    }
    // this.otpValue = false;
    query.otp = this.otpValue;


    if(query.phoneNo){
      query.userName = query.phoneNo.internationalNumber;
      this.loginUserName = query.phoneNo.internationalNumber;
    }else{
      query.userName = query.userName;
      this.loginUserName = query.userName;
    }
	query.fcmkey = localStorage.getItem("fcmkey");
    localStorage.setItem("loginUser", this.loginForm.value.userName);

    //debugger;
    this.authService.userLogin(query).subscribe(result => {

      if (typeof result.status != "undefined") {

        if (result.status != 2000) {
          this.toastService.showI18nToast("LOGIN.AUTHENTICATION_ERROR_MSG", 'error');
          return;
        }
      } else if (result) {
        this.loginSuccess(result);
      }

    });

  }

  callToLoggin(query) {
    // console.log("callToLoggin::", query);
    this.authService.userLogin(query).subscribe((result) => {
      if (typeof result.status != "undefined") {
        if (result.status != 2000) {
          this.modalRoles.length = 0;
          this.toastService.showI18nToast("LOGIN.AUTHENTICATION_ERROR_MSG", 'error');
          return;
        }
      } else if (result) {
        result['loginUserName'] = this.userName;
        this.loginSuccess(result);
      }

    });
  }

  loginAfterRoleSelect() {
    this.modalRef.hide();
    let query: any;
    if (this.role.socialProvider) {
      query = {
        'userName': this.role.userName,
        'roleName': this.role.roleName,
        'socialProvider': this.role.socialProvider,
        'socialToken': this.role.socialToken,
      }
      if (this.role.loginWithRole) {
        query['loginWithRole'] = this.role.loginWithRole;
        query['entityName']= this.role.entityName,
        query['rolePk']= this.role.rolePk
      }
    } else {
		
		this.userName = this.loginForm.get('userName').value;
		this.phoneNo = this.loginForm.get('phoneNo').value;
	
		 if(this.phoneNo === null || this.phoneNo === undefined || this.phoneNo == "" ){
			this.userName = this.loginForm.get('userName').value;
		 }else if(this.userName === null || this.userName === undefined || this.userName == "" ){
			this.userName = this.loginForm.get('phoneNo').value.internationalNumber;

		}

      query = {
        'userName': this.userName,
        'password': this.loginForm.get('password').value,
        'registrationProvider': "SBIS",
        'roleName': this.role.roleName,
        'entityName': this.role.entityName,
        'rolePk': this.role.rolePk,
        'loginWithRole': true,
        'otp': this.otpValue,
		'fcmkey':  localStorage.getItem("fcmkey")
        //'phoneNo': this.loginForm.get('phoneNo').value.internationalNumber,
      }
    }
    this.callToLoggin(query);
  }


  login(loginData: any) {
    localStorage.setItem("roleName", this.roleName);
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    if (loginData) {
      loginData.registrationProvider = 'SBIS';
	  loginData['fcmkey'] =  localStorage.getItem("fcmkey");
      this.userLogin(loginData);
    }
  }

  roleCheckLogin(loginData) {
    this.modalRoles.length = 0;
	
	this.userName = this.loginForm.get('userName').value;
	this.phoneNo = this.loginForm.get('phoneNo').value;
	
	 if(this.phoneNo === null || this.phoneNo === undefined || this.phoneNo == "" ){
		this.userName = this.loginForm.get('userName').value;
     }else if(this.userName === null || this.userName === undefined || this.userName == "" ){
		loginData.userName = this.loginForm.get('phoneNo').value.internationalNumber;
		this.userName = loginData.userName; 
    }
	
    if (this.peerConsultingLoginObj) {
      // this.roleName = "DOCTOR";
      // loginData.loginWithRole = true;
      // loginData.entityName = "DOCTOR";
      loginData.rolePk = this.peerConsultingLoginObj.rolePk;
      this.login(loginData);
      // console.log(loginData);
    } else {
      // if(localStorage.getItem('userRoleName')){
      //   let  query = {
      //     'userName': this.loginForm.get('userName').value,
      //     'password': this.loginForm.get('password').value,
      //     'registrationProvider': "SBIS",
      //     'roleName': localStorage.getItem('userRoleName'),
      //     'entityName': localStorage.getItem('userRoleName'),
      //     'loginWithRole': true,
      //     'otp':this.otpValue
      //   }
      //   // this.callToLoggin(query);
      //   return
      // }
	 

     
	 
      this.authService.getUserRoles(this.userName).subscribe((result) => {
		
        if (result.status == 2000) {
          let list: any[] = result.data.eAddressDetails;
          let lastLoginRolePk = localStorage.getItem("lastLoginRolePk");
          for (let role of list) {
            if (lastLoginRolePk) {
              if (role.rolePk == lastLoginRolePk) {
                role.lastroleChecked = true;
                this.role = role;
                this.roleSelectLogin = true;
              } else {
                role.lastroleChecked = false;
              }
            }
            this.modalRoles.push(role);
          }
          if (this.modalRoles.length > 1) {
            //new add to select previous selected item for multiple user           
            this.modalRef = this.bsModalService.show(this.getUserRoleName, { class: 'modal-md' });
          } else {
            if(this.role){
              loginData['entityName']= this.role.entityName? this.role.entityName: '';
              loginData['rolePk']= this.role.rolePk? this.role.rolePk: '';
            }
            this.login(loginData);
          }
        }
      });
    }
  }

  goToSignup() {
    this.router.navigate(['/auth/signUp']);
  }

  closeM() {
    this.modalRef.hide();
    this.loginForm.reset();
    this.modalRoles.length = 0;
    this.roleSelectLogin = false;
  }

  activateRole(roleName) {
    this.role = roleName;
    this.roleSelectLogin = true;
  }

  submitForgetPassEmailMobile(data: any) {
    if (this.isCheckedEmail == true) {
      // let email: any;
	  let data = this.loginForm.get('emailFP').value;
      this.authService.forgotPassword({ 'emailAddress': data }).subscribe(result => {
        // this.toastService.showI18nToast("TOAST_MSG.RESET_PASS_LINK_SENT", 'success');
        if (result.status != 2000) {
          this.bodyText = null;
          return;
        }
        this.isEmailVerified = true;
        // this.modalService.close('forgot-password-modal');
        this.modalRef.hide();
        this.redirectToConfirmPage();
      });
    } else if (this.isCheckedEmail == false) {
      let data = this.loginForm.get('phoneNoFP').value.internationalNumber ;
      this.authService.forgotPassword({ 'contactNo':data }).subscribe(result => {
        this.contactNo = this.loginForm.get('phoneNoFP').value.internationalNumber;
		
        this.toastService.showI18nToast('TOAST_MSG.OTP_SENT', 'success');
        if (result.status != 2000) {
          // this.showMobileOtp = !this.showMobileOtp;
          this.bodyText = null;
          return;
        }
        this.textBoxDisabled = !this.textBoxDisabled;
        this.showMobileOtp = true;
        this.isMobileVerified = true;
		    this.loginForm.get('phoneNoFP').disable();
      })
      // this.modalRef.hide();
      // this.modalService.open('reset-password-popup');
    }
  }

  emailChecked() {
    this.isCheckedEmail = true;
	this.isCheckedMobile = false;
    // console.log(this.isCheckedEmail);
    this.bodyText = null;
    this.textBoxDisabled = false;
    this.textBoxDisabled = !this.textBoxDisabled;
    if (this.showMobileOtp) {
      this.showMobileOtp = !this.showMobileOtp;
    }
    // this.showEmailInput = !this.showEmailInput;
  }

  phoneChecked() {
    this.isCheckedEmail = false;
	this.isCheckedMobile = true;
    this.bodyText = null;
    this.textBoxDisabled = false;
    this.textBoxDisabled = !this.textBoxDisabled;
	this.loginForm.get('phoneNoFP').enable();
    // console.log(this.isCheckedEmail);
    // this.showMobileInput = !this.showMobileInput;
  }

  submitResetPasswordMobile() {
    //  let contactNo = localStorage.getItem('contactNo');
    //  let otp, password
	
    let query = {
      'contactNo': this.loginForm.get('phoneNoFP').value.internationalNumber,
      'otp': this.loginForm.get('otpFP').value,
      'password': this.loginForm.get('password2').value
    }


    if (this.loginForm.get('otpFP').value == null || this.loginForm.get('otpFP').value == "") {
      this.IsOTP = true;
      return false;
    } else {
      this.IsOTP = false;
    }
	
	this.password1 = this.loginForm.get('password1').value;
	this.password2 = this.loginForm.get('password2').value;

    if (this.password1 != this.password2) {
      this.IsMatch = true;
      return false;
    }
    this.IsMatch = false;

    this.authService.resetForgotPasswordForMobile(query).subscribe((result) => {
      if (result.status == 2000) {
        this.toastService.showI18nToast('TOAST_MSG.PASSWORD_UPDATED', 'success');
        this.modalRef.hide();
      } else {
        this.toastService.showI18nToast('TOAST_MSG.INCORRECT_OTP', 'error');
        this.otp = null;
        this.password = null;
      }
    });
  }

  enterToSend(ev, formValue) {

    this.userName = this.loginForm.get('userName').value;
  	this.phoneNo = this.loginForm.get('phoneNo').value;

  	 if(this.phoneNo === null || this.phoneNo === undefined || this.phoneNo == "" ){
  		formValue.userName = this.loginForm.get('userName').value;
       }else if(this.userName === null || this.userName === undefined || this.userName == "" ){
      formValue.userName = this.loginForm.get('phoneNo').value.internationalNumber;
      }


    const code = (ev.keyCode ? ev.keyCode : ev.which);
    if (code === 13) {
      if (this.otpValue == false) {

        
        if (formValue.userName !== null && formValue.password !== null) {
          this.roleCheckLogin(formValue);
          //this.login(formValue);
        }
        else if (formValue.userName === null) {
          this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_EMAIL_MOBILE_TO_SIGNIN', 'warning');
          return;
        }
        else if (!this.phoneEmailValidation(formValue.userName, formValue.userName)) {
          return false;
        } else if (formValue.password === null) {
          this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_PASSWORD_SIGNIN', 'warning');
          return;
        }
        // else {
        //   alert('please provide Email and password');
        // }
      }
      if (this.otpValue == true) {
        if (formValue.userName == null) {
          this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_MOBILE_TO_GET_OTP', 'warning');
        } else if (formValue.userName.length !== 13) {
          this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
        } else {
          this.loginWithOtp();
        }
      }
    }
  }
  
  
  checkValue(ev, formValue){
	  if(this.loginForm.get('phoneNoFP').value == null || this.loginForm.get('phoneNoFP').value == undefined || this.loginForm.get('phoneNoFP').value == "" ){
		  this.bodyText = false;
	  }else{
		  this.bodyText = true;
	  }
  }
  
  checkValueEmail(ev, formValue){
	  if(this.loginForm.get('emailFP').value == null || this.loginForm.get('emailFP').value == undefined || this.loginForm.get('emailFP').value == "" ){
		  this.bodyText = false;
	  }else{
		  this.bodyText = true;
	  }
  }

  enterToOtpLogin(ev, formValue) {
    const code = (ev.keyCode ? ev.keyCode : ev.which);
    if (code === 13) {
      if (formValue.otp === null || formValue.otp === '') {
        this.toastService.showI18nToast('TOAST_MSG.ENTER_OTP_TO_SIGNIN', 'warning');
      }
      else {
        this.roleCheckLogin(formValue);
        //this.login(formValue);
      }
    }
  }

  phoneEmailValidation(email: any, phone: any) {

    if ((email === null || email === '') && (phone === null || phone === '')) {
      this.toastService.showI18nToast('TOAST_MSG.PROVIDE_EMAIL_MOBILE', 'warning');
      return false;
    } else if (isNaN(email)) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (reg.test(email) == false) {
        this.toastService.showI18nToast('TOAST_MSG.INVALID_EMAIL', 'error');
        return false;
      }

      return true;
    }
    else if (phone.length != 13) {
      this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
      return false;
    } return true;

  }

  forgotPasswordModal(id: string) {
    // this.modalService.open(id);
    this.bodyText = null;
    this.otp = null;
    this.password = null;
    this.password1 = null;
    this.password2 = null;
    this.textBoxDisabled = false;
    if (this.showMobileOtp) {
      this.showMobileOtp = !this.showMobileOtp;
    }
    this.modalRef = this.bsModalService.show(this.viewForgotPasswordModal, { class: 'modal-md' });
	//console.log(this.loginForm.get('phoneNoFP').value);
	this.loginForm.get('phoneNoFP').disable();
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  socialSignup(socialData: any) {
    this.modalRoles.length = 0;
    socialData.registrationProvider = socialData.provider;
    socialData.userName = socialData.id;
    socialData.emailAddress = socialData.email;
    socialData.firstName = socialData.name;
    if (socialData.userName && socialData.emailAddress) {
      //1. call /gen/v1/users/roles/{userName}
      this.authService.getUserRoles(socialData.email).subscribe((result) => {
        if (result.status == 2000) {
          let length = result.data.eAddressDetails.length;

          //First time registerd with social 
          if (length == 0) {
            let individualRole = {
              "socialProvider": socialData.provider.toUpperCase(),
              "userName": socialData.email,
              "socialToken": socialData.token,
              "roleName": "INDIVIDUAL",
              "entityName": "INDIVIDUAL",
              "loginWithRole": true

            }
            this.modalRoles.push(individualRole);
            let doctorRole = {
              "socialProvider": socialData.provider.toUpperCase(),
              "userName": socialData.email,
              "socialToken": socialData.token,
              "roleName": "DOCTOR",
              "entityName": "DOCTOR",
              "loginWithRole": true
            }
            this.modalRoles.push(doctorRole);
            this.modalRef = this.bsModalService.show(this.getUserRoleName, { class: 'modal-md' });//https://gitlab.com/sbis-poc/app/issues/985
          } else if (length > 1) {//Registerd with multiple role

            let list = result.data.eAddressDetails;
            for (let role of list) {
              role['socialProvider'] = socialData.provider.toUpperCase();
              role['userName'] = socialData.email;
              role['socialToken'] = socialData.token;
              role['loginWithRole'] = true;
              this.modalRoles.push(role);
            }

            this.modalRef = this.bsModalService.show(this.getUserRoleName, { class: 'modal-md' });// https://gitlab.com/sbis-poc/app/issues/985
          } else { //login with social and single role 
            this.userLogin({
              userName: socialData.email,
              socialToken: socialData.token,
              socialProvider: socialData.provider.toUpperCase()
            });
          }
        }
      })

    }
  }


  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        this.socialSignup(userData);
        // Now sign-in with userData
        // ...
      }
    );
  }

  activateTab(roleName) {
    this.roleName = roleName;
  }
  dismiss(): void {
    this.cookieLawEl.dismiss();
  }

  otpLogin() {
    this.otpLoginText = true;
    this.otpLoginEmail = true;
    this.otpValue = true;
    //console.log(this.loginForm.get('phoneNo').value);
	this.userName = this.loginForm.get('phoneNo').value;
	if(this.userName != null){
		this.userName = this.loginForm.get('phoneNo').value.internationalNumber;
		this.loginForm.get('phoneNo').setValue(this.loginForm.get('phoneNo').value.number);
	}else if(this.userName == null){
		this.loginForm.get('phoneNo').enable();
	}
	
	//this.loginForm.get('phoneNoOTP').setValue(userName);
	//console.log(userName);
	//console.log(this.loginForm.controls);
    //var userName = document.getElementById("user-name")["value"];
    /*var regex=/\S+@\S+\.\S+/;

    var regex = /^[\+\d]+(?:[\d-.\s()]*)$/;

    if (!this.userName.match(regex)) {
      this.loginForm.reset();
    }*/
  }

  loginWithOtp() {
    let number = this.loginForm.get('phoneNo').value.internationalNumber;
	
	
	//this.phoneNo = this.loginForm.get('phoneNo').number ;
    let query = {
      "contactNo": number,
      "smsActionType": "OTPSEND"
    }
    if (number == null) {
      this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_MOBILE_TO_GET_OTP', 'warning');
    } else if (number.length !== 13) {
      this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
    } else {
      this.authService.sentOTP(query).subscribe((result) => {
        if (result.status == 2000) {
          this.otpLoginEntry = true;
          this.toastService.showI18nToast('TOAST_MSG.OTP_SENT_ON_MOBILE', 'success');
          this.otpLoginText = false;
          this.otpLoginEmail = true;
          this.otpValue = true;
          this.otpVerified = true;
		  this.loginForm.get('phoneNo').setValue(this.loginForm.get('phoneNo').value.number);
		  this.loginForm.get('phoneNo').disable();
        }
      })
    }
  }

  resendOtp() {
    let number = this.loginForm.get('phoneNo').value.internationalNumber;
    let query = {
      "contactNo": number,
      "smsActionType": "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      if (result.status == 2000) {
        this.toastService.showI18nToast('TOAST_MSG.OTP_RESEND_ON_MOBILE', 'success');
      }
    })
  }

  resendOtpForForgetPassword() {
    let number = this.loginForm.get('phoneNoFP').value.internationalNumber;
    let query = {
      "contactNo": number,
      "smsActionType": "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      if (result.status == 2000) {
        this.toastService.showI18nToast('TOAST_MSG.OTP_RESEND_ON_MOBILE', 'success');
      }
    })
  }

  passwordLogin() {
    this.otpLoginText = false;
    this.otpLoginEntry = false;
    this.otpValue = false;
    this.otpLoginEmail = false;
	this.phoneNo = this.loginForm.get('phoneNo').value;
	this.emailFld = this.loginForm.get('userName').value;
	//console.log(this.phoneNo)
	
	if(this.emailFld === null || this.phoneNo === undefined || this.phoneNo == ""){
		this.loginForm.get('phoneNo').disable();
	}else if(this.phoneNo != null || this.phoneNo != undefined || this.phoneNo != ""){
		this.loginForm.get('phoneNo').setValue(this.loginForm.get('phoneNo').value.number);
	}
  }

  setFireBAseBroadcast(snapshotobj){//set to broadcast service
    // console.log("................................................................");
    this.broadcastService.setFireBaseNotifications(snapshotobj);
  }//end of method

  loginSuccess(result) {
    let user = {
      //lang: 'en',
      id: result.userId,
      userName: result.username,
      token: result.token,
      roleName: result.roleName,
      rolePk: result.rolePk,
      userId: result.userId,
      parentRoleName: result.entityName,
      entityName: result.entityName,
      firstName: result.username,
      registrationProvider: result.registrationProvider,
      hasPassword: result.hasPassword,
      refNo: result.refNo,
      tokenValidtimeInSec: result.tokenValidtimeInSec,
      // Added service provider name for issue app#604
      serviceProviderName: result.serviceProviderName,
      // Service provider ref no - issue app#604
      serviceProviderRefNo: result.serviceProviderRefNo,
      loginUserName: this.userName
    };
    //firebase
   this.setupFirebaseNotifications(result.refNo);      

    //end of firebase
    localStorage.setItem("lastLoginRolePk", result.rolePk);
    localStorage.setItem("userRoleName", result.roleName);
    localStorage.setItem("user", JSON.stringify(user));
    this.broadcastService.setProfileModificationData(user);
    let path: string = result.refNo + "/" + result.roleName;//neew add to download profile pic
    this.apiService.DownloadProfilePic.getByPath(path).subscribe(result => {//call by user ref number
      if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
        this.profileImageSrc = "data:image/jpeg;base64," + result.data;
        this.broadcastService.setProfileImage(this.profileImageSrc);
      }
    });
    let query = {
      'roleName': result.roleName,
      'entityName': result.entityName,
      'msUserPk': result.userId,
      'loginWithOtp': this.otpValue
    }

    let userDet = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserStateV2(query).subscribe(data => {

      userDet.id = data.data.userProfileId == 0 ? result.userId : data.data.userProfileId,
      userDet.profileVerified = data.data.profileVerified;
      userDet.loginUserName = this.userName;
      // localStorage.setItem("user", JSON.stringify(user));
      // Changes for app#782 - registration workflow
      let isServiceProvider = (result.entityName != 'DOCTOR' && result.entityName != 'INDIVIDUAL') || 
      (result.entityName == 'DOCTOR' && result.roleName =='ASSISTANT');
      let navigate: any;
      if (data.data.registrationWorkflowCompleted == null || data.data.registrationWorkflowCompleted)
        navigate = this.userStateRuleService.userNevigationRules[data.data.stateString];  
      else
        if(isServiceProvider){
          navigate = this.userStateRuleService.userNevigationRules[data.data.stateString];  
        }
        else{
          navigate = data.data.stateString;
        }
      // End Changes for app#782

      if (navigate.toString().indexOf("/auth/") == -1) {
        this.broadcastService.setAuth(true);
      } else {
        this.broadcastService.setAuth(false);
      }
      this.router.navigate([navigate]);
      userDet.lastLoginNavigateUrl = navigate;
      localStorage.setItem("user", JSON.stringify(userDet));

      /* Working on app/issues/782 */
      let payloadWorkflow = {
        // "isChabmerOrAddressExist": data.data.chabmerOrAddressExist,
        "registrationWorkflowCompleted": data.data.registrationWorkflowCompleted,
        "validProfile": data.data.validProfile,
        "registrationWorkflowSteps": data.data.registrationWorkflowDTOs,
        "currentStepNo" : data.data.currentStepNo
      }
      this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
      localStorage.setItem("regw", JSON.stringify(payloadWorkflow));
      /*End Working on app/issues/782 */
    });

    this.broadcastService.setUserData(user);
    if(user.entityName == 'HOSPITAL' || user.entityName == 'PHARMACY' || user.entityName == 'DIAGNOSTICS'){
      this.apiService.DownloadLogo.getByPath(user.id + "/" + user.entityName).subscribe(result => {
        if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
          this.logoSrc = "data:image/jpeg;base64," + result.data;
          this.broadcastService.setLogo(this.logoSrc);
        }
        else
          this.broadcastService.setLogo('');
      },
      error => {
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        this.broadcastService.setLogo('');
      });
    }
    if(user.entityName == 'DOCTOR' && user.roleName == 'ASSISTANT'){
      // Get corresponding doctor's profile photo
      let path: string = result.serviceProviderRefNo + "/" + "DOCTOR"; // app#974

      this.apiService.DownloadProfilePic.getByPath(path).subscribe(result => {
        if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
          this.logoSrc = "data:image/jpeg;base64," + result.data;
          this.broadcastService.setLogo(this.logoSrc);
        }
        else {
          this.broadcastService.setLogo('');
        }
      },
      error => {
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        this.broadcastService.setLogo('');
      });

      // Set the doctor's name in broadcast service as service provider's name
      let payload = {
        refNo: result.refNo
      }
      this.apiService.GetDoctorDetailsByRefNo.postByQuery(payload).subscribe(result => {
        if (result["status"] === 2000 && result.data != null) {
          this.broadcastService.setServiceProviderName(result.data.doctorName);
        }
        else {
          this.broadcastService.setServiceProviderName('');
        }
      },
      error => {
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        this.broadcastService.setServiceProviderName('');
      });
    }
  }//end of login success

  //firebase
  setupFirebaseNotifications(refNo){
   let firebaseDBConn= this.firebaseDatabase.database;
   GetSet.setFirebaseDbConn(firebaseDBConn);//set firebase db conn
   var _this = this;    
   firebaseDBConn.ref('notifications/'+refNo).on('value', function(snapshot) {
      let snapshotobj: any = snapshot.val(); 
        _this.setFireBAseBroadcast(snapshotobj);
      });   
    }//end of setup firebase
   
  enableField(){
    this.phoneNo = this.loginForm.get('phoneNo').value;
    // console.log(this.phoneNo);
	
    if(this.phoneNo === null || this.phoneNo === "" || this.phoneNo === undefined){
		//console.log(this.phoneNo);
      this.emailTxt = false;
      document.getElementById('phone').setAttribute('readonly','true');
      if(document.getElementById('emailLogin') != null){
	       document.getElementById('emailLogin').removeAttribute('id');
      }
	  //this.loginForm.get('userName').enable();

    }
  }
  
  enablePhoneField(){
	  this.userName = this.loginForm.get('userName').value;
	  
	  if(this.userName === null || this.userName === "" || this.userName === undefined){
	  //console.log(this.userName);
	  this.emailTxt = true;
    document.getElementById('phone').removeAttribute('readonly');
    if(document.getElementById('emailLogin') != null){
       document.getElementById('emailLogin').removeAttribute('id');
    }
    //this.loginForm.get('userName').disable();
	  //this.loginForm.get('phoneNo').enable();
    }
  }
  
  showPassword() {
    this.showeye = !this.showeye;
  }
  
  openPrivacy(){
	this.displaySidebar = true;  
  }
  
  openTerms(){
	this.displaySidebarTerms = true;  
  }

  redirectToConfirmPage() {
    //confirm page info set
    let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.FORGOT_PASS_LINK_SENT');
    this.confirmationMsg.push(confMsg);
    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.FORGOT_PASS;
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.FORGOT_PASS;
    confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.FORGOT_PASS;
    confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.FORGOT_PASS;
    GetSet.setConfirmationInfo(confirmationInfo);
    this.router.navigate(['confirmation']);
    //end of confirm page info set
  }

  //end of method
}
