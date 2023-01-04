
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

import { ViewChild, Renderer2 ,ElementRef} from '@angular/core';
import { Component, OnInit, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Route, Router } from '@angular/router';
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
import { Location, PlatformLocation, LocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { GetSet } from '../../core/utils/getSet';
import { SBISConstants } from '../../SBISConstants';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { JsonTranslation } from '../../shared/translation';
import { AngularFireDatabase } from "@angular/fire/database";//firebase
import { ServiceProviderService } from 'src/app/modules/service-provider/service-provider.service';
import { CoreService } from 'src/app/core/core.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('appStore') appStore: TemplateRef<any>;
  @ViewChild('cookieLaw') cookieLawEl: any;
  @ViewChild('video') video: TemplateRef<any>;
  @ViewChild('download') download: TemplateRef<any>;
  @ViewChild('confirmationAlert') confirmationAlert: TemplateRef<any>;
  config = {
    class: 'modal-md',
    backdrop: true,
    ignoreBackdropClick: true
  };
  @ViewChild('viewForgotPasswordModal') viewForgotPasswordModal: TemplateRef<any>;
  @ViewChild('getUserRoleName') getUserRoleName: TemplateRef<any>;
  @ViewChild('landing') landing: NgbCarousel;
  @ViewChild('passwordFocus') passwordFocus: ElementRef;


  isEmailVerified = false;
  modalRef: BsModalRef;
  cookieLawSeen: boolean;
  displaySidebar: boolean = false;
  displaySidebarTerms: boolean = false;
  displaySidebarSignUp: boolean = false;
  landingUrl: string = '/';
  mobOrEmail: boolean = false;
  otpMobileArea: boolean = false;
  verifyOTP: boolean = false;
  sendOTP: boolean = true;
  signupForm: FormGroup;
  signupScreen1: boolean = true;
  signupScreen2: boolean = false;
  roleArea: boolean = true;
  roleName: any;
  mediumName: any;
  docReferralDetails: any;
  checkUser: any = false;
  msUserPk: any;
  roleList: any = [];
  userRolePk: any;
  signupOtpVerify: any = false;
  signupOtpSection: any = true;
  signupMainSection: any = false;
  phoneNo: any;
  verify: any = false;
  activeRoleList: any = false;
  selectedRole: any;
  submitted: any = false;
  showSuccessMsgOnEmailSignup: boolean = false;
  emailId: any;
  signupDataFrom: any;
  otp: any;
  othersForm: FormGroup;
  otpVerifyButton: any = false;
  emailSection: any = false;
  mobileSection: any = false;
  emailOtp: any;
  mobileOtp: any;
  isDisabled: boolean = true;
  show_eye: boolean = false;
  showDoctor_eye: boolean = false;
  SignUpPrivacy: boolean = false;
  SignUpTerms: boolean = false;
  displaySidebarLogin: boolean = false;
  groupId: any;
  userRefNo: any;
  gender: any;
  bloodGroup: any;
  dateOfBirth: any;
  maritialStatus: any;
  token: any;
  refNo: any;
  media: any;
  mediaEmail: any;
  mediaPhone: any;
  blankMail: boolean = false;
  mailError: boolean = false;
  multiRoleArea: boolean = false;
  //contactExist: boolean = false;
  userName: any;
  loginForm: FormGroup;
  otherParentRoleName: any;
  otherRoleName: any;
  otpValue: any = false;
  emailTxt: any = false;
  peerConsultingLoginObj: any;
  modalRoles: any = [];
  parentRoleName: any;
  loginUserName: any;
  role: any;
  roleSelectLogin: any;
  //getUserRoleName:any;
  profileImageSrc: any;
  logoSrc: any;
  otpLoginText: any = false;
  otpLoginEmail: any = false;
  otpLoginEntry: any = false;
  emailFld: any;
  otpVerified: any = false;
  bodyText: any;
  password: any;
  password1: any;
  password2: any;
  textBoxDisabled: any = false;
  textBoxDisabledInput: any;
  showMobileOtp: any;
  isCheckedEmail: any;
  isCheckedMobile: any;
  IsOTP: boolean = false;
  IsMatch: boolean = false;
  contactNo: any;
  isMobileVerified = false;
  confirmationMsg: any = [];
  firstStep: boolean = true;
  secondStep: boolean = false;
  landingArea: boolean = true;
  environmentIdentifier: string;
  environmentIdentifierColor: string;
  docArea: boolean = true;
  mobileLogin: boolean = true;
  lastLoginInfo: any;
  loginTypeCheck: string;
  mobileBrowserCheck: boolean = false;
  userNameLocal: any;
  userPasswordLocal: any;

  constructor(
    private bsModalService: BsModalService,
    location: PlatformLocation,
    private _location: Location,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private authService: AuthService,
    private socialAuthService: SocialAuth,
    private broadcastService: BroadcastService,
    private userStateRuleService: UserStateRuleService,
    private http: HttpClient,
    private apiService: ApiService,
    private jsonTranslate: JsonTranslation,
    private renderer: Renderer2,
    private firebaseDatabase: AngularFireDatabase,//firebase
    private _serviceProviderService: ServiceProviderService,
    private coreService: CoreService
  ) {
    if (GetSet.getSessionExpireBoolean()) {
      toastService.showI18nToast('LOGIN.SESSION_EXPIRED', 'error');
    }
    location.onHashChange((x) => {
      console.log(x);
      if (x['oldURL'].includes('/auth/landing') && (x['oldURL'] != x['newURL']) && (!x['newURL'].includes('/auth/login')) && (!x['newURL'].includes('/auth/signUp')) && (!x['newURL'].includes('/search')) && (!x['newURL'].includes('/individual/order-medicine'))) {
        this.toastService.showI18nToast('Sorry, you have logged out of MEDePAL. Login again to use MEDePAL.', 'error');
        this.router.navigate([this.landingUrl]);
      }
    });
    // window.onpopstate = function (e) {
    //   window.history.forward(); 
    //   }

    translate.setDefaultLang('en');
    // the lang to use, if the lang isn{{ 'LOGIN.LOGIN_HEADER' | translate }} available, it will use the current loader to get them
    translate.use('en');

    this.signupForm = this.fb.group({     // {5}
      'phoneNo': [null, Validators.minLength(10)],
      // 'userName': [null, Validators.email],
      'password': [null, [Validators.required, Validators.pattern(/^[A-Za-z\d]{8,20}/)]],
      'emailAddress': [null, Validators.email],
      'firstName': [null],
      'otp': this.otp,
      'mobileOtp': [null, Validators.required],
      'emailOtp': [null, Validators.required],
    });

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
      'otpFP': [null],
      'emailFP': [null],
      'fcmkey': [null]
    });

    this.environmentIdentifier = environment.environment_identifier;
    this.environmentIdentifierColor = environment.environment_identifier_background_color;
  }//end of constructor


  ngOnInit() {
    this.cookieLawSeen = this.cookieLawEl.cookieLawSeen;

    if (sessionStorage.getItem('auth_key')) {
      this.router.navigate(['/verifications']);
    }
    // this.roleName = 'INDIVIDUAL';

    /*login */
    this.authService.logout();
    // if the user is loggedin then redireact to landing page
    if (sessionStorage.getItem('auth_key')) {
      // this.router.navigate(['/user-landing']);
    }
    this.roleName = 'INDIVIDUAL';
    this.peerConsultingLoginObj = GetSet.getPeerConsultingInvitationLogin();
    this.emailTxt = true;

    this.checkRoute();

  }//end of oninit

  ngAfterViewInit() {
    //console.log(this.landing.slides.length);

    if (this.landing.slides.length == 1) {
      this.landing.showNavigationArrows = false;
      this.landing.showNavigationIndicators = false;
    }
  }

  ngOnDestroy() {
    GetSet.setSessionExpireBoolean(false);
  }

  loginMethod(event, type) {
    //console.log(event.target.value);
    this.loginTypeCheck = type;
    if (event.target.value == "userMobile") {
      this.mobileLogin = true;
      setTimeout(() => {
      if (this.loginForm.get('phoneNo').value != "") {
        this.loginForm.get('phoneNo').setValue('');
      }

      if (this.loginForm.get('password').value != "") {
        this.loginForm.get('password').setValue('');
      }


      if(this.loginForm.get('phoneNo').disable){
        this.loginForm.get('phoneNo').enable();
      }

      if (document.getElementById('phone') != null) {
        const element = this.renderer.selectRootElement('#phone');
        //console.log(element);
        element.value = "";
        element.focus();
      }
      if (this.loginForm.get('userName').value != "") {
        this.loginForm.get('userName').setValue('');
      }
    }, 500);

    } else if (event.target.value == "userEmail") {

      this.mobileLogin = false;

      setTimeout(() => {
        const element = this.renderer.selectRootElement('#emailLogin');

        element.value = "";
        element.focus();

        if (this.loginForm.get('userName').value != "") {
          this.loginForm.get('userName').setValue('');
        }

        if (this.loginForm.get('password').value != "") {
          this.loginForm.get('password').setValue('');
        }

        console.log(element.value);

      }, 500);


    }
  }

  //method to get route param
  checkRoute() {
    let docReferralDet = GetSet.getDocReferralInvitationAcceptDetails();
    if (docReferralDet) {
      this.openSignUp();
      this.roleArea = true;
      if (GetSet.getDocReferralInvitationAcceptDetails()) {
        this.docReferralDetails = GetSet.getDocReferralInvitationAcceptDetails();
        this.signupForm.patchValue({
          'emailAddress': this.docReferralDetails.emailOfReferralDoctor,
          'phoneNo': this.docReferralDetails.contactNumberOfReferralDoctor,
          'firstName': this.docReferralDetails.nameOfReferralDoctor
        });
        this.roleName = 'DOCTOR';
        this.mobOrEmail = true;
      }
    }
  }//end of get route param

  //method to callback of show sidebar
  sidenavShow() {
    let docReferralDet = GetSet.getDocReferralInvitationAcceptDetails();
    if (docReferralDet) {
      this.activateTab(this.roleName);
      (docReferralDet.emailOfReferralDoctor) ? this.otpEmail() : this.otpMobile();
    }
  }//end of method

  dismiss(): void {
    this.cookieLawEl.dismiss();
  }


detectPlatform(){
  if (navigator.userAgent.match(/Android/i)|| navigator.userAgent.match(/webOS/i)|| navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)) {
                this.mobileBrowserCheck = true;
            } else {
                this.mobileBrowserCheck = false;
            }


}




  openVideoModal(ev: any) {
    this.modalRef = this.bsModalService.show(this.video, { class: 'modal-lg video' });


  }

  openDownloadModal(ev: any) {
    this.modalRef = this.bsModalService.show(this.download, { class: 'modal-md' });
      this.detectPlatform();
  }

  openPrivacy() {
    this.displaySidebar = true;
  }

  openPrivacySignUp() {
    this.SignUpPrivacy = true;
  }

  openTerms() {
    this.displaySidebarTerms = true;
  }

  openTermsSignUp() {
    this.SignUpTerms = true;
  }

  openLogin() {
    //console.log('login fired');
    this.displaySidebarLogin = true;
    let lastLoginTypeCheck = localStorage.getItem('loginTypeCheck');
    let element: HTMLElement; //document.getElementById(findId);
    if(lastLoginTypeCheck == 'email') {
      element = document.getElementById('emailLoginCheck');
    } else {
      element = document.getElementById('mobileLoginCheck');
    }
    element.click();


    const phelement = this.renderer.selectRootElement('#phone');
    phelement.value = "";

    if(this.loginForm.get('phoneNo').value != null){
      this.loginForm.get('phoneNo').patchValue("");
    }

    if(this.loginForm.get('userName').value != null || this.loginForm.get('userName').value != ""){
      this.loginForm.get('userName').patchValue("");
    }
    // setTimeout(function () {

    // }, 1000 / 60);
  }

  openSignUp() {
    this.displaySidebarSignUp = true;
  }

  closeSignUp() {
    this.signupForm.reset();
    this.displaySidebarSignUp = false;
    //this.signupForm.get('phoneNo').setValue('');
    this.mobOrEmail = false;
    this.verifyOTP = false;
    this.multiRoleArea = false;
    this.otpMobileArea = false;
    this.emailSection = false;
    this.signupScreen2 = false;
    this.signupScreen1 = true;
    this.roleArea = true;
    if (document.getElementById('emailBtn') != null) {
      document.getElementById('emailBtn').classList.remove('active');
    }

    if (document.getElementById('mobileBtn') != null) {
      document.getElementById('mobileBtn').classList.remove('active');
    }

    if (document.getElementById('signUpDoc') != null) {
      document.getElementById('signUpDoc').classList.remove('active');
    }

    if (document.getElementById('signUpInd') != null) {
      document.getElementById('signUpInd').classList.remove('active');
    }


  }

  closeLogin() {
    this.displaySidebarLogin = false;
    this.mobileLogin = true;
    this.loginForm.reset();

    if (document.getElementById('phone') != null) {
      const element = this.renderer.selectRootElement('#phone');
      console.log(element);
      element.value = "";
    }



    this.firstStep = true;
    this.secondStep = false;

    if (this.otpLoginText) {
      this.passwordLogin();
    }

    if (this.otpLoginEntry) {
      this.passwordLogin();
      this.otpVerified = false;
      this.loginForm.get('phoneNo').enable();
    }

    if (document.getElementById('errorMsg') != null) {
      document.getElementById("errorMsg").innerHTML = "";
      document.getElementById("errorMsg").classList.remove('validation-bg');
    }

  }



  otpMobile() {
    this.otpMobileArea = true;
    document.getElementById('mobileBtn').classList.add('active');
    document.getElementById('emailBtn').classList.remove('active');
    this.emailSection = false;
    this.mediumName = "M";
    this.sendOTP = true;
    /*const element = this.renderer.selectRootElement('#phone');
    setTimeout(() => element.focus(), 0);

    setTimeout(() => {
      const element = this.renderer.selectRootElement('#phone');
       element.focus()
    }, 100);*/

  }

  otpEmail() {
    this.otpMobileArea = false;
    this.emailSection = true;
    document.getElementById('mobileBtn').classList.remove('active');
    document.getElementById('emailBtn').classList.add('active');
    this.mediumName = "E";
    this.sendOTP = true;
  }

  verifyMobile() {
    this.verifyOTP = true;
    this.sendOTP = false;
  }

  signupVerify() {
    this.signupScreen1 = false;
    this.signupScreen2 = true;
  }

  changeProvider() {
    if (this.othersForm.value.provider == "Pharmacy") {
      this.router.navigate(['/pharmacy/addPharmacy']);
    } else if (this.othersForm.value.provider == "OPD") {
      this.router.navigate(['/opd/opdPharmacy']);
    }
  }

  // Jasmin test case getter function
  get testSignupSubmit() { return this.submitted; }
  get testSignupForm() { return this.signupForm; }
  // convenience getter for easy access to form fields
  get lControls() { return this.signupForm.controls; }
  checkUserEmail(email: any) {
    if (this.lControls.emailAddress.errors !== null && this.lControls.emailAddress.errors.email === true) {
      // show msg that of wrong email
    } else if (this.lControls.emailAddress.errors !== null && this.lControls.emailAddress.errors.required === true) {
      // show required msg
    } else {

    }
  }
  /* checkUserName(userName: any) {
  } */
  checkEmailAddress(event: any) {
    if (this.lControls.emailAddress.errors !== null) {
      // show error msg
    } else {
      if (this.signupForm.get('emailAddress').value) {
        let query = {
          'eaddress': this.signupForm.get('emailAddress').value,
          'roleName': this.roleName
        }
        this.authService.checkUsername(query).subscribe((result) => {
          if (result.data.eaddressAvailableCode == 2102) {
            //success
            this.mobOrEmail = false;
            this.roleArea = false;
          } else if (result.data.eaddressAvailableCode == 2101) {
            if (result.data.userType == "PSEUDO") {
              this.checkUser = true;
              this.msUserPk = result.data.msUserPk;
            } else {
              this.checkUser = true;
              let errorMsg = result.data.message;
              document.getElementById("errorMsg").innerHTML = errorMsg;
              document.getElementById("errorMsg").classList.add('validation-bg');
              //this.toastService.showI18nToast(result.data.message , "error");

              this.signupForm.patchValue({
                'emailAddress': ""
              });
            }
          } else if (result.data.eaddressAvailableCode == 2103) {
            this.roleList.length = 0;
            this.msUserPk = result.data.msUserPk;
            let list = result.data.eAddressDetails;
            for (let role of list) {
              this.userRolePk = role.rolePk;
              role['userName'] = this.signupForm.get('emailAddress').value;
              role['addNewRole'] = this.roleName;
              this.roleList.push(role);
              //console.log(this.roleList);
              this.activateRole(role);
            }
            if (result.data.userType == "PSEUDO") {
              //do nothing
            } else {
              /*if(this.modalRef == undefined){
                this.modalRef = this.bsModalService.show(this.confirmationAlert, this.config);
              }*/
              this.multiRoleArea = true;
              this.mobOrEmail = false;
              this.roleArea = false;

            }
          }
        });
      }
    }
  }

  checkContactNumber(contactNo: any) {
    if (this.lControls.phoneNo.errors !== null) {
      // show error msg
    } else {
      if (this.signupForm.get('phoneNo').value) {
        let query = {
          'eaddress': this.signupForm.get('phoneNo').value.internationalNumber,
          'roleName': this.roleName
        }
        this.authService.checkContactno(query).subscribe((result) => {
          if (result.data.eaddressAvailableCode == 2102) {
            //success
            this.mobOrEmail = false;
            this.roleArea = false;
          } else if (result.data.eaddressAvailableCode == 2101) {
            if (result.data.userType == "PSEUDO") {
              this.checkUser = true;
              this.msUserPk = result.data.msUserPk;
            } else {
              this.checkUser = false;
              let errorMsg = "User exist. Please login with your credential.";//result.data.message; -- https://gitlab.com/sbis-poc/app/-/issues/2732
              document.getElementById("errorMsgSignUp").innerHTML = errorMsg;
              document.getElementById("errorMsgSignUp").classList.add('validation-bg');

              //this.toastService.showI18nToast(result.data.message , "error");
              //this.signupForm.get('phoneNo') = null;
              console.log(this.signupForm);
              this.signupForm.patchValue({
                'phoneNo': ""
              });
              //this.contactExist = true;
            }
          } else if (result.data.eaddressAvailableCode == 2103) {
            this.roleList.length = 0;
            this.msUserPk = result.data.msUserPk;
            let list = result.data.eAddressDetails;
            for (let role of list) {
              this.userRolePk = role.rolePk;
              role['userName'] = this.signupForm.get('phoneNo').value;
              role['addNewRole'] = this.roleName;
              this.roleList.push(role);
              this.activateRole(role);
            }
            if (result.data.userType == "PSEUDO") {
              //do nothing
            } else {
              //this.modalRef = this.bsModalService.show(this.confirmationAlert, this.config);
              this.multiRoleArea = true;
              this.mobOrEmail = false;
              this.roleArea = false;
            }
          }
        });
      }
    }
  }


  verifyScreenResendOtp() {
    let query = {
      'msUserPk': this.msUserPk,
      'rolePk': this.userRolePk
    }

    /*this.authService.sendVerificationCodeRequest(query).subscribe((result) =>{
      if (result.status == 2000) {
        this.toastService.showI18nToast('TOAST_MSG.OTP_RESEND_SUCCESSFULLY','success');
      }
    })*/
  }


  closeModal() {
    this.activeRoleList = false;
    this.modalRef.hide();
    //this.signupForm.reset();
  }

  verifyExistingEmailMobile() {
    // this.signupOtpVerify = true;
    //this.otpVerifyButton = false;
    //this.isDisabled = true;
    //this.signupMainSection = true;
    //this.signupOtpSection = true;
    //this.verify = true;
    let query = {
      'msUserPk': this.msUserPk,
      'rolePk': this.userRolePk
    }
    /*this.authService.sendVerificationCodeRequest(query).subscribe((result) =>{
      if (result.status == 2000) {
        // this.toastr.success('OTP sent successfully!');
        //this.toastService.showI18nToast("TOAST_MSG.OTP_SENT_SUCCESSFULLY", "success");
      }
    });*/
    console.log(this.modalRef);
    this.modalRef.hide();


    if (this.selectedRole.primaryEmailAddress != null) {
      this.emailSection = true;
    }
    if (this.selectedRole.primaryContactNo != null) {
      this.mobileSection = true;
    }
  }

  resendOtpExistingUser(type) {
    let query = {};
    query = {
      'msUserPk': this.msUserPk,
      'rolePk': this.userRolePk
    }
    if (type == 'email') {
      query['eaddressType'] = 'E';
      query['eaddress'] = this.signupForm.get('emailAddress').value;
      query['roleName'] = this.roleName
    } else if (type == 'mobile') {
      query['eaddressType'] = 'M';
      query['eaddress'] = this.signupForm.value.phoneNo.internationalNumber;
      query['roleName'] = this.roleName
    }
    this.authService.sendVerificationCodeRequest(query).subscribe((result) => {
      console.log(result);
      if (result.status == 2000) {
        this.toastService.showI18nToast("TOAST_MSG.OTP_SENT_SUCCESSFULLY", "success");
      }
    });
  }

  verifyEmailForDiffRole() {
    document.getElementById('verifyErrorMsg').innerHTML = "";
    document.getElementById("verifyErrorMsg").classList.remove('validation-bg');
    this.emailOtp = this.signupForm.get('emailOtp').value;
    if (this.emailOtp == null) {
      //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_OTP','warning');
      let verifyErrorMsg = "Please enter OTP";
      document.getElementById('verifyErrorMsg').innerHTML = verifyErrorMsg;
      document.getElementById("verifyErrorMsg").classList.add('validation-bg');
      return;
    }
    let query = {
      'msUserPk': this.msUserPk,
      'otp': this.emailOtp,
      'rolePk': this.userRolePk,
      'eaddressType': 'E',
      'eaddress': this.signupForm.get('emailAddress').value,
      'roleName': this.roleName
    }
    if (this.docReferralDetails) {
      query['referralRefNo'] = this.docReferralDetails.referralRefNo;
    }
    /*if(type == 'email') {
      query['eaddressType'] = 'E';
    } else if(type == 'mobile') {
      query['eaddressType'] = 'M';
    }*/

    this.authService.manageVerificationRequestForEmail(query).subscribe((result) => {
      if (result.status == 2000) {
        console.log(this.roleList.length);

        if (this.roleList.length > 0) {
          this.token = result.data.token;
          this.refNo = result.data.refNo;
          this.loginSuccess(result);
        } else {
          this.emailOtp = '';
          //this.toastService.showI18nToast("TOAST_MSG.EMAIL_OTP_VERIFIED_SUCCESSFULLY", "success");
          this.otpVerifyButton = true;
          this.isDisabled = false;
          this.signupScreen2 = true;
          this.signupScreen1 = false;
          this.token = result.data.token;
          this.refNo = result.data.refNo;
        }


      } else {
        document.getElementById('verifyErrorMsg').innerHTML = "Wrong OTP Entered";
        document.getElementById("verifyErrorMsg").classList.add('validation-bg');
        //this.toastService.showI18nToast("TOAST_MSG.WRONG_OTP_ENTERED", "error");
        this.emailOtp = null;
      }

    });
  }

  verifyMobileForDiffRole() {

    document.getElementById('verifyErrorMsg').innerHTML = "";
    document.getElementById("verifyErrorMsg").classList.remove('validation-bg');
    this.mobileOtp = this.signupForm.get('mobileOtp').value;

    if (this.mobileOtp == null) {
      //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_OTP','warning');
      document.getElementById('verifyErrorMsg').innerHTML = "Please enter OTP";
      document.getElementById("verifyErrorMsg").classList.add('validation-bg');
      return;
    }

    console.log(this.roleName);
    let query = {
      'msUserPk': this.msUserPk,
      'otp': this.mobileOtp,
      'rolePk': this.userRolePk,
      'eaddressType': 'M',
      'eaddress': this.signupForm.value.phoneNo.internationalNumber,
      'roleName': this.roleName
    }
    this.authService.manageVerificationRequestForMobile(query).subscribe((result) => {
      console.log(result);
      if (result.status == 2000) {
        //this.toastService.showI18nToast("TOAST_MSG.MOBILE_OTP_VERIFIED_SUCCESSFULLY", "success");
        console.log(this.roleList.length);
        if (this.roleList.length > 0) {
          this.token = result.data.token;
          this.refNo = result.data.refNo;
          this.loginSuccess(result);
        } else {
          this.otpVerifyButton = true;
          this.isDisabled = false;
          this.signupScreen2 = true;
          this.signupScreen1 = false;
          this.token = result.data.token;
          this.refNo = result.data.refNo;
          console.log(this.refNo);
        }



      } else {
        //this.toastService.showI18nToast("TOAST_MSG.WRONG_OTP_ENTERED", "error");
        document.getElementById('verifyErrorMsg').innerHTML = "Wrong OTP entered";
        document.getElementById("verifyErrorMsg").classList.add('validation-bg');
        this.mobileOtp = null;
      }
    })
  }

  // implimented by @SHANU
  /**
   *
   * @param signupData
   */






  phoneCheckSignup(signupData: any) {
    //let number = this.signupForm.get('phoneNo').value;

    document.getElementById("errorMsgSignUp").innerHTML = "";
    document.getElementById("errorMsgSignUp").classList.remove('validation-bg');

    let number;
    if (signupData.phoneNo != null) {
      number = signupData.phoneNo.internationalNumber;
    }
    //console.log(signupData.phoneNo.internationalNumber);
    let query = {
      "contactNo": number,
      "smsActionType": "OTPSEND"
    }
    /*if (signupData.emailAddress === null && signupData.phoneNo === null) {
     //this.toastService.showI18nToast('','TOAST_MSG.PLEASE_FILL_OUT_THE_FIELD','warning');
     //this.toastService.showI18nToast('TOAST_MSG.PLEASE_FILL_OUT_THE_FIELD','warning');
    }
    //If sign-up with email-address and mobile no both
    else if ((signupData.emailAddress !== null) && (signupData.phoneNo !== null)) {
      //let number = this.signupForm.get('phoneNo').value;
  let number = signupData.phoneNo.internationalNumber;
      if (number.length > 3 && number.length < 13) {
        this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT','warning');
        return false;
      }
      else if (!this.phoneEmailValidation(signupData.emailAddress)) {
        return false;
      }
      else if (signupData.firstName == null) {
        //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_YOUR_NAME','warning');
      }
      else if (signupData.password == null) {
        //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_PASSWORD','warning');
      }
      else if (signupData.password.length<8) {
        this.toastService.showI18nToast('TOAST_MSG.PASSWORD_SHOULD_BE_EIGHT_CARR','warning');
        return false;
      }
      else {//If all validation done. Call signup servie

            this.signupOtpVerify = true;
            this.signupOtpSection = false;
            this.signupMainSection = true;
            let signupQuery = {
              'emailAddress': signupData.emailAddress,
              'contactNo': signupData.phoneNo.internationalNumber,
              'password': signupData.password,
              'name': signupData.firstName,
              'registrationProvider': signupData.registrationProvider,
              'roleName': this.roleName,
              'contactNoVerified': false
            }
            if(this.docReferralDetails) {
              signupQuery['referralRefNo'] = this.docReferralDetails.referralRefNo;
              signupQuery['signUpForReferralDoctor'] = true;
            }
            this.authService.userSignUp(signupQuery).subscribe((result) => {
        console.log(result);
              if (result && result.status == 2000) {
                this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY_VERIFY_OTP','success');
              } else {
                this.toastService.showI18nToast('TOAST_MSG.SOMETHING_WENT_WRONG','warning');
              }
            });
           this.phoneNo = number;

      }
    }*///If sign-up with mobile no

    if (this.emailSection == true && (signupData.emailAddress == null || signupData.emailAddress == "")) {
      document.getElementById("errorMsgSignUp").innerHTML = "Please specify an email address";
      document.getElementById("errorMsgSignUp").classList.add('validation-bg');
      return false;
    }



    if (this.otpMobileArea == true && (signupData.phoneNo === null || signupData.phoneNo.internationalNumber == "")) {
      document.getElementById("errorMsgSignUp").innerHTML = "Please specify a phone number";
      document.getElementById("errorMsgSignUp").classList.add('validation-bg');
      return false;
    }


    if (this.otpMobileArea == true && (signupData.phoneNo !== null || signupData.phoneNo.internationalNumber !== "")) {

      //if(this.contactExist == false){
      if (signupData.phoneNo.internationalNumber.length <= 10) {
        document.getElementById("errorMsgSignUp").innerHTML = "Please provide a 10 digit mobile numbert";
        document.getElementById("errorMsgSignUp").classList.add('validation-bg');
        return false;
      } else {
        this.signup(signupData);
      }
      //  }
      //this.signup(signupData);
    } else if (this.emailSection == true && (signupData.emailAddress !== null || signupData.emailAddress !== "")) {
      this.mailError = false;
      if (!this.phoneEmailValidation(signupData.emailAddress)) {
        return false;
      } else {
        this.signup(signupData);
      }


    }

  }

  verifyOtpSignup(signupData: any) {
    let query = {
      "contactNo": signupData.phoneNo.internationalNumber,
      "verificationCode": signupData.otp
    }
    if (signupData.otp != null) {
      this.authService.mobileVerification(query).subscribe((result) => {
        console.log(query)
        if (result.status === 2009) {
          this.toastService.showI18nToast('TOAST_MSG.MOBILE_NO_VERIFIED_SUCCESSFULLY', 'success');
          this.loginOnVerifiedMobileSignUP(signupData);
          this.signupScreen1 = false;
          this.signupScreen2 = true;
        } else {
          // this.toastr.warning(result.message);
          this.toastService.showI18nToast(result.message, 'warning');
        }
      })
    } else {
      this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_OTP', 'warning');
    }
  }

  loginOnVerifiedMobileSignUP(signupData: any) {
    let loginQuery = {
      'userName': signupData.phoneNo.internationalNumber,
      'password': signupData.password,
      'roleName': this.roleName,
      'registrationProvider': 'SBIS',
      'otp': false
    }
    this.authService.userLogin(loginQuery).subscribe(result => {
      if (typeof result.status != "undefined") {
        if (result.status != 2000) {
          this.toastService.showI18nToast(result.message, 'warning');
          return;
        }

      } else if (result) {
        this.loginSuccess(result);

        //console.log(this.signupScreen2);
      }

    });
  }

  resendOtp(signupData: any) {
    let query = {
      "contactNo": this.phoneNo,
      "smsActionType": "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      if (result.status == 2000) {
        this.toastService.showI18nToast('TOAST_MSG.OTP_RESEND_SUCCESSFULLY', 'success');
      }
    })
  }

  // impliment end by SHANU






  signup(signupData: any) {
    console.log(signupData);
    this.submitted = true;

    if (signupData.emailAddress != null) {
      this.checkEmailAddress(signupData.emailAddress);
    }

    if (signupData.phoneNo != null) {
      this.checkContactNumber(signupData.phoneNo);

    }



    if (signupData.emailAddress == null) {


      signupData.emailAddress = signupData.phoneNo.internationalNumber;

    } else {
      signupData.emailAddress = signupData.emailAddress;
    }

    // if (this.signupForm.invalid) {
    //   return;
    // }

    signupData.registrationProvider = 'SBIS';




    console.log(signupData.emailAddress);
    const payload: any = {
      'eaddress': signupData.emailAddress,
      //'contactNo': signupData.phoneNo?signupData.phoneNo.internationalNumber:null,
      //'password': signupData.password,
      //'name': signupData.firstName,
      //'registrationProvider': signupData.registrationProvider,
      'roleName': this.roleName,
      'eaddressType': this.mediumName
    };
    if (this.checkUser) {
      payload['signUpForPsedoUser'] = true;
      payload['msUser'] = this.msUserPk;
    }
    if (this.docReferralDetails) {
      payload['referralRefNo'] = this.docReferralDetails.referralRefNo;
      payload['signUpForReferralDoctor'] = true;
    }
    //this.userRegister(payload);
    this.authService.userSignUp(payload).subscribe(result => {


      if (result && result.status == 2000) {
        /* Working on app/issues/782 */

        //result['eaddress'] = signupData.emailAddress;
        /*if(this.contactExist == true){
          return false;
        }*/


        //console.log(result);
        if (this.roleName == "INDIVIDUAL" || this.roleName == "DOCTOR") {
          this.showSuccessMsgOnEmailSignup = true;
          this.emailId = signupData.emailAddress;
          //this.toastService.showI18nToast('TOAST_MSG.OTP_SENT_SUCCESSFULLY','success');
          this.sendOTP = false;
          this.verifyOTP = true;
        }
        else {
          this.showSuccessMsgOnEmailSignup = false;
          this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY_LINK_SENT_EMAIL', 'success');
          this.goToLogin();
        }

        /* Working on app/issues/782 */

      } else if (result.status == 5050) {
        this.toastService.showI18nToast('You are registered as ' + this.roleName + '. Please login to access your account.', 'error');
        console.log("Something went wrong");
        return false;
      }
    });
    this.signupDataFrom = signupData;
  }

  enterToSend(ev, formValue) {
    const code = (ev.keyCode ? ev.keyCode : ev.which);
    if (code === 13) {

      this.phoneCheckSignup(formValue);
    }
  }

  enterToSignin(ev, formValue) {
    const code = (ev.keyCode ? ev.keyCode : ev.which);
    if (code === 13) {
      if (formValue.otp == null) {
        this.toastService.showI18nToast('TOAST_MSG.OTP_FOR_SIGNIN', 'warning');
      } else {
        this.verifyOtpSignup(formValue);
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
  ///////////////////////////////////
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
            this.coreService.getCommonRoles().subscribe(res => {
              if (res.status == 2000) {
                res.data.forEach(el => {
                  let obj = {
                    "socialProvider": socialData.provider.toUpperCase(),
                    "userName": socialData.email,
                    "socialToken": socialData.token,
                    "loginWithRole": true,
                    "roleName": el.roleName,
                    "roleDescription": el.roleDescription
                  }
                  this.modalRoles.push(obj);
                });
                this.modalRef = this.bsModalService.show(this.getUserRoleName, { class: 'modal-md' });//https://gitlab.com/sbis-poc/app/issues/985
              }
            });
          } else if (length > 1) {//Registerd with multiple role
            let list = result.data.eAddressDetails;
            for (let role of list) {
              role['socialProvider'] = socialData.provider.toUpperCase();
              role['userName'] = socialData.email;
              role['socialToken'] = socialData.token;
              role['roleDescription'] = role.roleDescription;
              role['roleName'] = role.roleName;
              role['loginWithRole'] = true;
              this.modalRoles.push(role);
            }
            this.modalRef = this.bsModalService.show(this.getUserRoleName, { class: 'modal-md' });// https://gitlab.com/sbis-poc/app/issues/985
          } else { //login with social and single role
            this.userLogin({
              roleName: result.data.eAddressDetails[0].roleName,
              userName: socialData.email,
              socialToken: socialData.token,
              socialProvider: socialData.provider.toUpperCase()
            });
          }
        }
      });

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
        console.log(userData);

        this.socialSignup(userData);
        // Now sign-in with userData
        // ...
      }
    );
  }

  //////////////////////////////////////////
  phoneEmailValidation(email: any) {

    // if (email === null || email === '') {
    //   this.toastService.showToast(-1, 'Please provide email/mobile number');
    //   return false;
    // }
    if (isNaN(email)) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (reg.test(email) == false) {
        //this.toastService.showI18nToast('TOAST_MSG.INVALID_EMAIL','error');
        document.getElementById("errorMsgSignUp").innerHTML = "Invalid Email";
        document.getElementById("errorMsgSignUp").classList.add('validation-bg');
        return false;
      }

      return true;
    }
    // else if (phone.length != 10) {
    //   this.toastService.showToast(-1, "Phone number must have 10 digits");
    //   return false;
    // }

  }

  activateTab(roleName) {
    this.roleName = roleName;

    if (this.roleName == "DOCTOR") {
      this.mobOrEmail = true;
      document.getElementById('signUpDoc').classList.add('active');
      document.getElementById('signUpInd').classList.remove('active');
    } else if (this.roleName == "INDIVIDUAL") {
      this.mobOrEmail = true;
      document.getElementById('signUpInd').classList.add('active');
      document.getElementById('signUpDoc').classList.remove('active');
    }

    if (this.signupForm.get('phoneNo').value != null || this.signupForm.get('phoneNo').value != undefined) {
      let phoneExist = this.signupForm.get('phoneNo').value.number;
      this.signupForm.get('phoneNo').setValue(phoneExist);
    }
  }

  backToSignup() {
    this.signupOtpVerify = false;
    this.signupMainSection = false;
    this.signupForm.reset();
    this.verify = false;
    this.emailSection = false;
    this.mobileSection = false;
    this.emailOtp = null;
    this.mobileOtp = null;
  }

  activateRole(selectedRole) {
    this.activeRoleList = true;
    this.selectedRole = selectedRole;

  }







  setPassword(result) {

    if (this.mediumName == "M") {
      this.media = this.signupForm.get('phoneNo').value.internationalNumber;
    } else if (this.mediumName == "E") {
      this.media = this.signupForm.get('emailAddress').value;
    }


    let query = {
      'msUserId': '',
      'oldPassword': this.media,
      'newPassword': this.signupForm.get('password').value
    }
    //if (this.regProvider != 'SBIS' && this.hasPassword == false) {
    this.authService.setPasswordLanding(query, this.token).subscribe((result) => {
      if (result.status === 2000) {
        console.log(result);
        // call login service

        //this.toastService.showI18nToast("TOAST_MSG.PASSWORD_SET_SUCCESSFULLY", 'success');
        // this.router.navigate(['/individual/tab-personal']);
        //this.successMsgFor = "setPassword";
        //this.showSuccessMessageOnChangePassword = true;
      }
    });
    //}
    //this.forgetSetPassword = true;
    //this.hasPassword = true;
    let user = JSON.parse(localStorage.getItem('user'));
    //user.hasPassword = true;
    localStorage.setItem("user", JSON.stringify(user));

    // if (this.regProvider != 'SBIS' && this.hasPassword == true) {
    //   this.forgetSetPassword = true;
    // }
  }


  signUpInDiffRole() {

    document.getElementById('nameError').innerHTML = "";
    document.getElementById('passwordError').innerHTML = "";
    document.getElementById("nameError").classList.remove('validation-bg');
    document.getElementById("passwordError").classList.remove('validation-bg');

    if ((this.signupForm.get('firstName').value == null || this.signupForm.get('firstName').value == "") && (this.signupForm.get('password').value == null || this.signupForm.get('password').value == "")) {
      document.getElementById('nameError').innerHTML = "Please specify name";
      document.getElementById('passwordError').innerHTML = "Please create password";
      document.getElementById("nameError").classList.add('validation-bg');
      document.getElementById("passwordError").classList.add('validation-bg');
      return false;
    } else if (this.signupForm.get('firstName').value == null || this.signupForm.get('firstName').value == "") {
      document.getElementById('nameError').innerHTML = "Please specify name";
      document.getElementById("nameError").classList.add('validation-bg');
      return false;
    } else if (this.signupForm.get('password').value == null || this.signupForm.get('password').value == "") {
      document.getElementById('passwordError').innerHTML = "Please create password";
      document.getElementById("passwordError").classList.add('validation-bg');
      return false
    } else if (this.signupForm.get('password').value != null && this.signupForm.get('password').value.length < 8) {
      document.getElementById('passwordError').innerHTML = "Password minimum length 8 character";
      document.getElementById("passwordError").classList.add('validation-bg');
      return false
    }


    if (this.mediumName == "M") {
      this.mediaPhone = this.signupForm.get('phoneNo').value.internationalNumber;
      this.mediaEmail = null;
      this.media = this.signupForm.get('phoneNo').value.internationalNumber;
    } else if (this.mediumName == "E") {
      this.mediaEmail = this.signupForm.get('emailAddress').value;
      this.mediaPhone = null;
      this.media = this.signupForm.get('emailAddress').value;
    }

    if (this.roleName == "INDIVIDUAL") {



      let query = {
        'msUserPk': this.msUserPk,
        'roleName': this.roleName,
        'rolePk': this.userRolePk,
        'groupId': null,
        'userRefNo': this.refNo,
        'firstName': this.signupForm.get('firstName').value,
        'gender': null,
        'bloodGroup': null,
        'dateOfBirth': '',
        'maritialStatus': '',
        //'token': this.token,
        'contactNo': this.mediaPhone,
        'emailAddress': this.mediaEmail
      }


      this.authService.landingUserSignUp(query, this.token).subscribe((result) => {

        if (result.status == 2000) {
          this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY', 'success');

          let passwordquery = {
            'msUserId': '',
            'oldPassword': this.media,
            'newPassword': this.signupForm.get('password').value
          }

          this.authService.setPasswordLanding(passwordquery, this.token).subscribe((result) => {
            if (result.status === 2000) {
              //console.log(result);

              let query = {
                'userName': this.media,
                'password': this.signupForm.get('password').value,
                'roleName': this.roleName,
                'registrationProvider': 'SBIS',
                'otp': false
              }

              this.authService.userLogin(query).subscribe((result) => {
                this.loginSuccess(result);
              })

            }
          });

          //this.setPassword(result);
        } else {
          // this.toastr.error(result.message);
          this.toastService.showI18nToast(result.message, 'error');
        }
      })
    } else if (this.roleName == "DOCTOR") {
      let query = {
        "doctorName": this.signupForm.get('firstName').value,
        "dateOfBirth": "",
        "mobileNo1": "",
        "mobileNo2": "",
        "mobileNo3": "",
        "landlineNo": "",
        "briefresume": "",
        "emailId": " ",
        "registrationNo": " ",
        "registrationStatus": "N",
        "email_verification_status": "",
        //'token': this.token,
        "contact_verification_status": "",
        "otp": null,
        "homeVisitFlag": "N",
        "doctorSpecializationList": [],
        "yearsOfExperience": 0,
        "doctorQualificationList": [],
        "status": "NRM",
        "refNo": this.refNo,
        "gender": " ",
        "createdBy": null,
        "createdDate": null,
        "modifiedBy": null,
        "modifiedDate": null,
        "isModified": true,
        "yearOfRegistration": null,
        "signatureFilePath": null,
        "signatureFileName": null,
        "onlineConsultation": null

      }


      this.authService.landingUserSignUpDoctor(query, this.token).subscribe((result) => {

        if (result.status == 2000) {
          this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY', 'success');

          let passwordquery = {
            'msUserId': '',
            'oldPassword': this.media,
            'newPassword': this.signupForm.get('password').value
          }

          this.authService.setPasswordLanding(passwordquery, this.token).subscribe((result) => {
            if (result.status === 2000) {
              //console.log(result);

              let query = {
                'userName': this.media,
                'password': this.signupForm.get('password').value,
                'roleName': this.roleName,
                'registrationProvider': 'SBIS',
                'otp': false
              }

              this.authService.userLogin(query).subscribe((result) => {
                this.loginSuccess(result);
              })

            }
          });

          //this.setPassword(result);
        } else {
          // this.toastr.error(result.message);
          this.toastService.showI18nToast(result.message, 'error');
        }
      })

    }





  }

  loginSuccess(result) {

    let user = {
      id: result.userId,
      userName: result.username,
      token: this.roleList.length > 0 ? this.token : result.token,
      roleName: this.roleList.length > 0 ? this.roleName : result.roleName,
      userId: result.userId,
      parentRoleName: this.roleList.length > 0 ? this.roleName : result.roleName,
      firstName: this.roleList.length > 0 ? this.userName : result.username,
      refNo: this.roleList.length > 0 ? this.refNo : result.refNo,  //Working om app/issues/746
      groupId: null,
      userRefNo: this.roleList.length > 0 ? this.refNo : result.refNo,
      //firstName: this.signupForm.get('firstName').value,
      gender: "",
      bloodGroup: "",
      dateOfBirth: "",
      maritialStatus: ""

    }
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
    this.broadcastService.setProfileModificationData(user);

    //console.log(result);

    let query = {
      'roleName': this.roleList.length > 0 ? this.roleName : result.roleName,
      'entityName': this.roleList.length > 0 ? this.roleName : result.entityName,
      'msUserPk': '',
      'loginWithOtp': false
    }


    //this.authService.getUserState(result.entityName + '/' + result.roleName + '/' + result.userId).subscribe(data => {
    let userDet = JSON.parse(localStorage.getItem('user'));
    this.authService.getLandingUserStateV2(query, this.token).subscribe(data => {
      console.log(data);
      userDet.id = data.data.userProfileId == 0 ? result.userId : data.data.userProfileId,
        userDet.profileVerified = data.data.profileVerified;
      // localStorage.setItem("user", JSON.stringify(user));
      // Changes for app#782 - registration workflow

      if (this.roleList.length > 0) {
        result.entityName = this.roleName;
      } else {
        result.entityName = result.entityName;
      }


      let isServiceProvider = (result.entityName != 'DOCTOR' && result.entityName != 'INDIVIDUAL') ||
        (result.entityName == 'DOCTOR' && result.roleName == 'ASSISTANT');

      let navigate: any;
      if (data.data.registrationWorkflowCompleted == null || data.data.registrationWorkflowCompleted)
        navigate = this.userStateRuleService.userNevigationRules[data.data.stateString];
      else if (isServiceProvider) {
        navigate = this.userStateRuleService.userNevigationRules[data.data.stateString];
      }
      else {
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
        "currentStepNo": data.data.currentStepNo
      }
      this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
      localStorage.setItem("regw", JSON.stringify(payloadWorkflow));
      /*End Working on app/issues/782 */
    })
  }

  onKeydown($event) {
    if ($event.key == '"' || $event.key == '<' || $event.key == '>' || $event.key == '?' || $event.key == '@' || $event.key == '#' || $event.key == '$' || $event.key == '%' || $event.key == '^' || $event.key == '&' || $event.key == '*' || $event.key == '(' || $event.key == ')' || $event.key == '-' || $event.key == '_' || $event.key == '+' || $event.key == '=' || $event.key == '~' || $event.key == "." || $event.key == "," || $event.key == "/" || $event.key == "'" || $event.key == ":" || $event.key == ";" || $event.key == "`" || $event.key == "~" || $event.key == "{" || $event.key == "}" || $event.key == "[" || $event.key == "]" || $event.key == "|" || $event.key == "!") {
      return false;
    }
  }

  showPassword() {
    this.show_eye = !this.show_eye;
  }

  showDoctorPassword() {
    this.showDoctor_eye = !this.showDoctor_eye;
  }




  onKeydownPhone(event) {
    if(event.keyCode != 8) {
      if(event.target.value.length > 9) {
        // this.toastService.showI18nToast("Mobile no cannot be grater than 10 digit", "error");
        return false;
      }
    }
  }


  onPaste(event) {
    if(event.length > 10) {
      // this.toastService.showI18nToast("Mobile no cannot be grater than 10 digit", "error");
      return false;
    }
  }










  /* login */

  enableField() {
    this.phoneNo = this.loginForm.get('phoneNo').value;
    // console.log(this.phoneNo);

    if (this.phoneNo === null || this.phoneNo === "" || this.phoneNo === undefined) {
      //console.log(this.phoneNo);
      this.emailTxt = false;
      document.getElementById('phone').setAttribute('readonly', 'true');
      if (document.getElementById('emailLogin') != null) {
        document.getElementById('emailLogin').removeAttribute('id');
      }
      //this.loginForm.get('userName').enable();

    }
  }

  enablePhoneField() {
    this.userName = this.loginForm.get('userName').value;

    if (this.userName === null || this.userName === "" || this.userName === undefined) {
      //console.log(this.userName);
      this.emailTxt = true;
      document.getElementById('phone').removeAttribute('readonly');
      if (document.getElementById('emailLogin') != null) {
        document.getElementById('emailLogin').removeAttribute('id');
      }
      //this.loginForm.get('userName').disable();
      //this.loginForm.get('phoneNo').enable();
    }
  }

  login(loginData: any) {
    localStorage.setItem("roleName", this.roleName);
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    if (loginData) {
      loginData.registrationProvider = 'SBIS';
      loginData['fcmkey'] = localStorage.getItem("fcmkey");
      this.userLogin(loginData);
    }
  }

  userLogin(query: any) {
    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');

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


    if (query.phoneNo) {
      query.userName = query.phoneNo.internationalNumber;
      this.loginUserName = query.phoneNo.internationalNumber;
    } else {
      query.userName = query.userName;
      this.loginUserName = query.userName;
    }
    query.fcmkey = localStorage.getItem("fcmkey");
    localStorage.setItem("loginUser", this.loginForm.value.userName);

    //debugger;
    this.authService.userLogin(query).subscribe(result => {

      if (typeof result.status != "undefined") {

        if (result.status != 2000) {
          //this.toastService.showI18nToast("LOGIN.AUTHENTICATION_ERROR_MSG", 'error');
          document.getElementById("errorMsg").innerHTML = this.translate.instant("LOGIN.AUTHENTICATION_ERROR_MSG");
          document.getElementById("errorMsg").classList.add('validation-bg');
          this.loginForm.reset();
          const element = this.renderer.selectRootElement('#phone');
          element.value = "";
          return;
        }
      } else if (result) {
        this.loginSuccessLogin(result);
      }

    });

  }

  roleCheckLogin(loginData) {
    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');

    if (this.loginForm.get('password').value == null || this.loginForm.get('password').value == '') {
      document.getElementById("errorMsg").innerHTML = this.translate.instant("VALIDATION.VALIDATION_PASSWORD_REQUIRED");
      document.getElementById("errorMsg").classList.add('validation-bg');
      return false;
    }

    this.modalRoles.length = 0;

    this.userName = this.loginForm.get('userName').value;
    this.phoneNo = this.loginForm.get('phoneNo').value;

    if (this.phoneNo === null || this.phoneNo === undefined || this.phoneNo == "") {
      this.userName = this.loginForm.get('userName').value;
    } else if (this.userName === null || this.userName === undefined || this.userName == "") {
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
          let i = 1;
          for (let role of list) {
            role['id'] = 'role_check' + i;
            i = i + 1;
            if (role.rolePk == lastLoginRolePk) {
              role.lastroleChecked = true;
              role['checked'] = true;
              this.role = role;
            } else {
              role.lastroleChecked = false;
              role['checked'] = false;
              this.role = role;
            }
            //  }
            this.modalRoles.push(role);
          }
          if (this.modalRoles.length > 1) {
            this.firstStep = false;
            this.secondStep = true;
            let findId = this.modalRoles.findIndex(x => x.checked == true);
            setTimeout(function () {
              let element: HTMLElement = document.getElementById(findId);
              element ? element.click() : '';
            }, 1000 / 60);


            this.userNameLocal = this.userName;
            this.userPasswordLocal = loginData.password;

            //localStorage.setItem("userNameLocal",this.userName);
            //localStorage.setItem("userPasswordLocal",loginData.password);

          } else {
            localStorage.setItem('loginTypeCheck', this.loginTypeCheck);
            if (this.role) {
              loginData['entityName'] = this.role.entityName ? this.role.entityName : '';
              loginData['rolePk'] = this.role.rolePk ? this.role.rolePk : '';
            }
            this.roleName = this.role.roleName;
            localStorage.setItem("roleNameToDisplay", this.modalRoles[0].roleDescription);
            this.login(loginData);
          }
        }
      });
    }
  }

  loginSuccessLogin(result) {
    this.displaySidebarLogin = false;
    this.landingArea = false;

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
        (result.entityName == 'DOCTOR' && result.roleName == 'ASSISTANT');
      let navigate: any;
      if (data.data.registrationWorkflowCompleted == null || data.data.registrationWorkflowCompleted)
        navigate = this.userStateRuleService.userNevigationRules[data.data.stateString];
      else
        if (isServiceProvider) {
          navigate = this.userStateRuleService.userNevigationRules[data.data.stateString];
        }
        else {
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
        "currentStepNo": data.data.currentStepNo
      }
      this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
      localStorage.setItem("regw", JSON.stringify(payloadWorkflow));
      /*End Working on app/issues/782 */
    });

    this.broadcastService.setUserData(user);
    if (user.entityName == 'HOSPITAL' || user.entityName == 'PHARMACY' || user.entityName == 'DIAGNOSTICS') {
      this.apiService.DownloadLogo.getByPath(user.id + "/" + user.entityName).subscribe(result => {
        if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
          this.logoSrc = "data:image/jpeg;base64," + result.data;
          this.broadcastService.setLogo(this.logoSrc);
        }
        else
          this.broadcastService.setLogo('');
      },
        error => {
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
          this.broadcastService.setLogo('');
        });
    }
    if (user.entityName == 'DOCTOR' && user.roleName == 'ASSISTANT') {
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
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
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
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
          this.broadcastService.setServiceProviderName('');
        });
    }

    //to set clinic's admin name 
    if (user.roleName == 'ADMIN') {
      let request = {
        "serviceProviderRef": user.serviceProviderRefNo,
        "parentRoleName": "Hospital"//user.parentRoleName
      }

      this._serviceProviderService.getServiceProviderEntityValueByPk(request).subscribe(res => {
        this.broadcastService.setServiceProviderName(res.data.name);
      });

    }
    this.broadcastService.setChildSpRefNo(user);
    // 
  }//end of login success

  //firebase
  setupFirebaseNotifications(refNo) {
    let firebaseDBConn = this.firebaseDatabase.database;
    GetSet.setFirebaseDbConn(firebaseDBConn);//set firebase db conn
    var _this = this;
    firebaseDBConn.ref('notifications/' + refNo).on('value', function (snapshot) {
      let snapshotobj: any = snapshot.val();
      _this.setFireBAseBroadcast(snapshotobj);
    });
  }//end of setup firebase

  setFireBAseBroadcast(snapshotobj) {//set to broadcast service
    // console.log("................................................................");
    this.broadcastService.setFireBaseNotifications(snapshotobj);
  }//end of method

  loginAfterRoleSelect() {

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
        query['entityName'] = this.role.entityName,
          query['rolePk'] = this.role.rolePk
      }
    } else {

      this.userName = this.role.userName;

      query = {
        'userName': this.userName,
        'password': this.role.password,
        'registrationProvider': "SBIS",
        'roleName': this.role.roleName,
        'entityName': this.role.entityName,
        'rolePk': this.role.rolePk,
        'loginWithRole': true,
        'otp': this.otpValue,
        'fcmkey': localStorage.getItem("fcmkey")
        //'phoneNo': this.loginForm.get('phoneNo').value.internationalNumber,
      }
    }
    localStorage.setItem("loginUser", this.loginForm.value.userName);
    localStorage.setItem("roleNameToDisplay", this.role.roleDescription);
    this.callToLoggin(query);
    localStorage.setItem('loginTypeCheck', this.loginTypeCheck);

    if(this.modalRef){
    //  console.log(this.modalRef);
      this.modalRef.hide();
    }

  }

  callToLoggin(query) {
    // console.log("callToLoggin::", query);
    if (document.getElementById("errorMsg") != null) {
      document.getElementById("errorMsg").innerHTML = "";
      document.getElementById("errorMsg").classList.remove('validation-bg');
    }

    this.authService.userLogin(query).subscribe((result) => {
      if (typeof result.status != "undefined") {
        if (result.status != 2000) {
          this.modalRoles.length = 0;
          //this.toastService.showI18nToast("LOGIN.AUTHENTICATION_ERROR_MSG", 'error');
          this.firstStep = true;
          this.secondStep = false;
          this.loginForm.reset();
          const element = this.renderer.selectRootElement('#phone');
          element.value = "";
          if (this.firstStep) {
            document.getElementById("errorMsg").innerHTML = this.translate.instant("LOGIN.AUTHENTICATION_ERROR_MSG");
            document.getElementById("errorMsg").classList.add('validation-bg');
          }
          return;
        }
      } else if (result) {
        result['loginUserName'] = this.userName;
        this.loginSuccessLogin(result);
      }

    });
  }


  otpLogin() {
    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');
    this.otpLoginText = true;
    this.otpLoginEmail = true;
    this.otpValue = true;
    //console.log(this.loginForm.get('phoneNo').value);
    this.userName = this.loginForm.get('phoneNo').value;
    if (this.userName != null) {
      this.userName = this.loginForm.get('phoneNo').value.internationalNumber;
      this.loginForm.get('phoneNo').setValue(this.loginForm.get('phoneNo').value.number);
    } else if (this.userName == null) {
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

  passwordLogin() {

    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');

    this.otpLoginText = false;
    this.otpLoginEntry = false;
    this.otpValue = false;
    this.otpLoginEmail = false;
    this.phoneNo = this.loginForm.get('phoneNo').value;
    this.emailFld = this.loginForm.get('userName').value;
    //console.log(this.phoneNo)

    if (this.emailFld === null || this.phoneNo === undefined || this.phoneNo == "") {
      //this.loginForm.get('phoneNo').disable();
    } else if (this.phoneNo != null || this.phoneNo != undefined || this.phoneNo != "") {
      this.loginForm.get('phoneNo').setValue(this.loginForm.get('phoneNo').value.number);
    }
  }

  loginWithOtpLogin() {

    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');

    let numberObj = this.loginForm.get('phoneNo').value;

    if (numberObj == null) {
      //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_MOBILE_TO_GET_OTP', 'warning');
      document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PLEASE_ENTER_MOBILE_TO_GET_OTP");
      document.getElementById("errorMsg").classList.add('validation-bg');
      return false;
    }

    let number = this.loginForm.get('phoneNo').value.internationalNumber;


    //this.phoneNo = this.loginForm.get('phoneNo').number ;
    let query = {
      "contactNo": number,
      "smsActionType": "OTPSEND",
      "check": true
    }

    if (number.length !== 13) {
      //this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
      document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT");
      document.getElementById("errorMsg").classList.add('validation-bg');
      return false;
    } else {
      this.authService.sentOTP(query).subscribe((result) => {
        if (result.status == 2000) {
          this.otpLoginEntry = true;
          //this.toastService.showI18nToast('TOAST_MSG.OTP_SENT_ON_MOBILE', 'success');
          this.otpLoginText = false;
          this.otpLoginEmail = true;
          this.otpValue = true;
          this.otpVerified = true;
          this.loginForm.get('phoneNo').setValue(this.loginForm.get('phoneNo').value.number);
          this.loginForm.get('phoneNo').disable();
        } else if (result.status == 2102) {
          document.getElementById("errorMsg").innerHTML = result.message;
          document.getElementById("errorMsg").classList.add('validation-bg');
        }
      })
    }
  }

  enterToOtpLogin(ev, formValue) {

    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');



    const code = (ev.keyCode ? ev.keyCode : ev.which);
    if (code === 13) {
      if (formValue.otp === null || formValue.otp === '') {
        //this.toastService.showI18nToast('TOAST_MSG.ENTER_OTP_TO_SIGNIN', 'warning');
        document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.ENTER_OTP_TO_SIGNIN");
        document.getElementById("errorMsg").classList.add('validation-bg');
      }
      else {
        this.roleCheckLogin(formValue);
        //this.login(formValue);
      }
    }
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

  checkValue(ev, formValue) {
    if (this.loginForm.get('phoneNoFP').value == null || this.loginForm.get('phoneNoFP').value == undefined || this.loginForm.get('phoneNoFP').value == "") {
      this.bodyText = false;
    } else {
      this.bodyText = true;
    }
  }

  checkValueEmail(ev, formValue) {
    if (this.loginForm.get('emailFP').value == null || this.loginForm.get('emailFP').value == undefined || this.loginForm.get('emailFP').value == "") {
      this.bodyText = false;
    } else {
      this.bodyText = true;
    }
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
      let data = this.loginForm.get('phoneNoFP').value.internationalNumber;
      this.authService.forgotPassword({ 'contactNo': data }).subscribe(result => {
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

  redirectToConfirmPage() {
    //confirm page info set
    let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.FORGOT_PASS_LINK_SENT');
    this.confirmationMsg.push(confMsg);
    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    //primary button
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.FORGOT_PASS;
    //end primary button
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.FORGOT_PASS;
    confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.FORGOT_PASS;
    //secondary button [Remember That:: button two ('buttonTwoName') is only given if we want another button]
    // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.FORGOT_PASS;
    //end secondary button
    GetSet.setConfirmationInfo(confirmationInfo);
    this.router.navigate(['confirmation']);
    //end of confirm page info set
  }

  showSignup() {
    this.displaySidebarLogin = false;
    this.displaySidebarSignUp = true;
  }

  showLogin() {
    this.displaySidebarLogin = true;
    this.displaySidebarSignUp = false;
  }


  resendOtpLogin() {
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


  activateRoleLogin(role) {
    role.userName = this.userNameLocal;
  //  role.userName = localStorage.getItem("userNameLocal");
    //role.password = localStorage.getItem("userPasswordLocal");
    role.password = this.userPasswordLocal;
    //console.log(role.userName);
    let roleDetails = {
      'roleName': role.roleName,
      'rolePk': role.rolePk
    }
    this.role = role;
    this.roleSelectLogin = true;
    //console.log(role);
  }


  enterToSendLogin(ev, formValue) {

    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');

    this.userName = this.loginForm.get('userName').value;
    this.phoneNo = this.loginForm.get('phoneNo').value;

    if (this.phoneNo === null || this.phoneNo === undefined || this.phoneNo == "") {
      formValue.userName = this.loginForm.get('userName').value;
    } else if (this.userName === null || this.userName === undefined || this.userName == "") {
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
          //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_EMAIL_MOBILE_TO_SIGNIN', 'warning');
          document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PLEASE_ENTER_EMAIL_MOBILE_TO_SIGNIN");
          document.getElementById("errorMsg").classList.add('validation-bg');
          return false;
        }
        else if (!this.phoneEmailValidationLogin(formValue.userName, formValue.userName)) {
          return false;
        } else if (formValue.password === null) {
          //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_PASSWORD_SIGNIN', 'warning');
          document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PLEASE_ENTER_PASSWORD_SIGNIN");
          document.getElementById("errorMsg").classList.add('validation-bg');
          return false;
        }
        // else {
        //   alert('please provide Email and password');
        // }
      }
      if (this.otpValue == true) {
        if (formValue.userName == null) {
          //this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_MOBILE_TO_GET_OTP', 'warning');
          document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PLEASE_ENTER_MOBILE_TO_GET_OTP");
          document.getElementById("errorMsg").classList.add('validation-bg');
        } else if (formValue.userName.length !== 13) {
          //this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
          document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT");
          document.getElementById("errorMsg").classList.add('validation-bg');
        } else {
          this.loginWithOtpLogin();
        }
      }
    }



  }

  passFocus(ev){
    const code = (ev.keyCode ? ev.keyCode : ev.which);

    if(ev.shiftKey && ev.keyCode === 9){
      return false;
    }else if(code === 9){
      this.passwordFocus.nativeElement.focus();
    }
  }

  phoneEmailValidationLogin(email: any, phone: any) {

    document.getElementById("errorMsg").innerHTML = "";
    document.getElementById("errorMsg").classList.remove('validation-bg');

    if ((email === null || email === '') && (phone === null || phone === '')) {
      //this.toastService.showI18nToast('TOAST_MSG.PROVIDE_EMAIL_MOBILE', 'warning');
      document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PROVIDE_EMAIL_MOBILE");
      document.getElementById("errorMsg").classList.add('validation-bg');
      return false;
    } else if (isNaN(email)) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (reg.test(email) == false) {
        //this.toastService.showI18nToast('TOAST_MSG.INVALID_EMAIL', 'error');
        document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.INVALID_EMAIL");
        document.getElementById("errorMsg").classList.add('validation-bg');
        return false;
      }

      return true;
    }
    else if (phone.length != 13) {
      //this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
      document.getElementById("errorMsg").innerHTML = this.translate.instant("TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT");
      document.getElementById("errorMsg").classList.add('validation-bg');
      return false;
    } return true;

  }

  highlightItem(event, item, blockName, blockArea) {

    let allElements = Array.from(document.querySelectorAll('.desc-box-pad.active'));
    let hideElements = Array.from(document.querySelectorAll('.dis-none'));
    let hideBlocks = Array.from(document.querySelectorAll('.area-show'));


    for (let element of allElements) {
      element.classList.remove('active')
    }

    for (let hideElement of hideElements) {
      hideElement.classList.remove('dis-none')
    }

    for (let hideBlock of hideBlocks) {
      hideBlock.classList.remove('area-show');
      //hideBlock.classList.add('hidden');
    }

    if (event.target.classList.contains(item)) {
      document.getElementById(blockName).classList.add('active');
      document.getElementById(blockArea).classList.add('area-show');
      event.target.classList.add('dis-none');
      //blockArea = true;
      //document.getElementById(blockArea).classList.add('visible');
    }
  }


}
