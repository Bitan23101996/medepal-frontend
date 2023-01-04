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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService as SocialAuth, GoogleLoginProvider, FacebookLoginProvider } from 'angular-6-social-login-v2';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './../auth.service';
import { ToastService } from '../../core/services/toast.service';
import { BroadcastService } from './../../core/services/broadcast.service';
import { UserStateRuleService } from './../userStateRuleService';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { GetSet } from '../../core/utils/getSet';
import { SBISConstants } from '../../SBISConstants';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  @ViewChild('confirmationAlert') confirmationAlert: TemplateRef<any>;
  @ViewChild('privacyAlert') privacyAlert: TemplateRef<any>;
  @ViewChild('termsAlert') termsAlert: TemplateRef<any>;
  config = {
    class: 'modal-md',
    backdrop: true,
    ignoreBackdropClick: true
  };
  signupForm: FormGroup;
  othersForm: FormGroup;
  modalRef: BsModalRef;
  signupDataFrom: any;
  signupOtpVerify: any = false;
  signupOtpSection: any = true;
  submitted: any = false;
  verify: any = false;
  phoneNo: any;
  otp: any;
  emailOtp: any;
  mobileOtp: any;
  userRolePk: any;
  roleList: any = [];
  activeRoleList: any = false;
  emailSection: any = false;
  mobileSection: any = false;
  signupMainSection: any = false;
  msUserPk: any;
  isDisabled: boolean = true;
  // emailOtpVerifyButton: any = false;
  otpVerifyButton: any = false;
  selectedRole: any ;
  phoneno = /^\d{10}$/;
  email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  checkUser: any = false;
  roleName: any;
  show_eye: Boolean = false;
  showDoctor_eye: Boolean = false;
  displaySidebar: boolean = false;
  displaySidebarTerms: boolean = false;
  docReferralDetails: any;

  /* Working on app/issues/782 */
  showSuccessMsgOnEmailSignup: boolean = false;
  emailId: any;
  successMsgFor = "signUp";
  /*End Working on app/issues/782 */

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuth,
    private translate: TranslateService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private userStateRuleService: UserStateRuleService,
    private bsModalService: BsModalService,
    private toastr: ToastrService
  ) {
    this.signupForm = this.fb.group({     // {5}
      'phoneNo': [null, Validators.minLength(10)],
      // 'userName': [null, Validators.email],
      'password': [null, [Validators.required, Validators.pattern(/^[A-Za-z\d]{8,20}/)]],
      'emailAddress': [null, Validators.email],
      'firstName': [null, Validators.required],
      'otp': this.otp
    });
    this.othersForm = this.fb.group({     // {5}
      'provider': [""],
    });
    // this language will be used as a {{ 'LOGIN.LOGIN_HEADER' | translate }}llback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn{{ 'LOGIN.LOGIN_HEADER' | translate }} available, it will use the current loader to get them
    translate.use('en');
  }

  openPrivacyModal() {
      this.modalRef = this.bsModalService.show(this.privacyAlert, { class: 'modal-lg' });
  }

  openTermsModal() {
      this.modalRef = this.bsModalService.show(this.termsAlert, { class: 'modal-lg' });
  }

  ngOnInit() {
    if (sessionStorage.getItem('auth_key')) {
      this.router.navigate(['/verifications']);
    }
    this.roleName = 'INDIVIDUAL';

    if(GetSet.getDocReferralInvitationAcceptDetails()) {
      this.docReferralDetails = GetSet.getDocReferralInvitationAcceptDetails();
      this.signupForm.patchValue({
        'emailAddress': this.docReferralDetails.emailOfReferralDoctor,
        'phoneNo': this.docReferralDetails.contactNumberOfReferralDoctor,
        'firstName': this.docReferralDetails.nameOfReferralDoctor
      });
      this.roleName = 'DOCTOR';
    }
  }

  changeProvider(){
    if(this.othersForm.value.provider=="Pharmacy"){
      this.router.navigate(['/pharmacy/addPharmacy']);
    }else if(this.othersForm.value.provider=="OPD"){
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
      if(this.signupForm.get('emailAddress').value) {
        let query = {
          'eaddress': this.signupForm.get('emailAddress').value,
          'roleName': this.roleName
        }   
        this.authService.checkUsername(query).subscribe((result) => {
          if (result.data.eaddressAvailableCode == 2102) {
            //success
          } else if (result.data.eaddressAvailableCode == 2101) {
              if(result.data.userType == "PSEUDO") {
                this.checkUser = true;
                this.msUserPk = result.data.msUserPk;
              } else {
                this.checkUser = false;
                this.toastService.showI18nToast(result.data.message , "error");
                this.signupForm.patchValue({
                  'emailAddress': ""
              });
            }
          } else if (result.data.eaddressAvailableCode == 2103) {
            this.roleList.length = 0;
            this.msUserPk = result.data.msUserPk;
            let list = result.data.eAddressDetails;
            for(let role of list) {
              this.userRolePk = role.rolePk;
              role['userName']=this.signupForm.get('emailAddress').value;
              role['addNewRole']=this.roleName;
              this.roleList.push(role);
              //console.log(this.roleList);
              this.activateRole(role);
            }
            if(result.data.userType == "PSEUDO") {
              //do nothing
            } else {
              this.modalRef = this.bsModalService.show(this.confirmationAlert, this.config);
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
      if(this.signupForm.get('phoneNo').value != null) {
        let query = {
          'eaddress': this.signupForm.get('phoneNo').value.internationalNumber,
          'roleName': this.roleName
        }
        this.authService.checkContactno(query).subscribe((result) => {
          if (result.data.eaddressAvailableCode == 2102) {
            //success
          } else if (result.data.eaddressAvailableCode == 2101) {
            if(result.data.userType == "PSEUDO") {
              this.checkUser = true;
              this.msUserPk = result.data.msUserPk;
            } else {
              this.checkUser = false;
              this.toastService.showI18nToast(result.data.message , "error");
              this.signupForm.patchValue({
                'phoneNo': " "
              });
            }
          } else if (result.data.eaddressAvailableCode == 2103) {
            this.roleList.length = 0;
            this.msUserPk = result.data.msUserPk;
            let list = result.data.eAddressDetails;
            for(let role of list) {
              this.userRolePk = role.rolePk;
              role['userName']=this.signupForm.get('phoneNo').value;
              role['addNewRole']=this.roleName;
              this.roleList.push(role);
              this.activateRole(role);
            }
            if(result.data.userType == "PSEUDO") {
              //do nothing
            } else {
              this.modalRef = this.bsModalService.show(this.confirmationAlert, this.config);
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
  
  this.authService.sendVerificationCodeRequest(query).subscribe((result) =>{
    if (result.status == 2000) {
      this.toastService.showI18nToast('TOAST_MSG.OTP_RESEND_SUCCESSFULLY','success');
    }
  })
  }
  

  closeModal() {
    this.activeRoleList = false;
    this.modalRef.hide();
    this.signupForm.reset();
  }

  verifyExistingEmailMobile() {
    // this.signupOtpVerify = true;
    this.otpVerifyButton = false;
    this.isDisabled = true;
    this.signupMainSection = true;
    this.signupOtpSection = true;
    this.verify = true;
    let query = {
      'msUserPk': this.msUserPk,
      'rolePk': this.userRolePk
    }
    this.authService.sendVerificationCodeRequest(query).subscribe((result) =>{
      if (result.status == 2000) {
        // this.toastr.success('OTP sent successfully!');
        //this.toastService.showI18nToast("TOAST_MSG.OTP_SENT_SUCCESSFULLY", "success");
      }
    });
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
    if(type == 'email') {
      query['eaddressType'] = 'E';
    } else if(type == 'mobile') {
      query['eaddressType'] = 'M';
    }
    this.authService.sendVerificationCodeRequest(query).subscribe((result) =>{
      if (result.status == 2000) {
        this.toastService.showI18nToast("TOAST_MSG.OTP_SENT_SUCCESSFULLY", "success");
      }
    });
  }

  verifyEmailForDiffRole() {
    if(this.emailOtp == null){
        this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_OTP','warning');
        return;
     }
    let query = {
      'msUserPk': this.msUserPk,
      'otp': this.emailOtp,
      'rolePk': this.userRolePk
    }
    this.authService.manageVerificationRequestForEmail(query).subscribe((result) => {
      if (result.status == 2000) {
        this.emailOtp = '';
        this.toastService.showI18nToast("TOAST_MSG.EMAIL_OTP_VERIFIED_SUCCESSFULLY", "success");
        this.otpVerifyButton = true;
        this.isDisabled = false;
      } else {
        this.toastService.showI18nToast("TOAST_MSG.WRONG_OTP_ENTERED", "error");
        this.emailOtp = null;
      }
    });
  }

  verifyMobileForDiffRole() {
    if(this.mobileOtp == null){
      this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_OTP','warning');
      return;
    }
    let query = {
      'msUserPk': this.msUserPk,
      'otp': this.mobileOtp,
      'rolePk': this.userRolePk
    }
    this.authService.manageVerificationRequestForMobile(query).subscribe((result) => {
      if (result.status == 2000) {
        this.toastService.showI18nToast("TOAST_MSG.MOBILE_OTP_VERIFIED_SUCCESSFULLY", "success");
        this.otpVerifyButton = true;
        this.isDisabled = false;
      }else {
        this.toastService.showI18nToast("TOAST_MSG.WRONG_OTP_ENTERED", "error");
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
    let number;
    if(signupData.phoneNo != null) {
      number = signupData.phoneNo.internationalNumber;
    }
	  //console.log(signupData.phoneNo.internationalNumber);
      let query = {
        "contactNo" : number,
        "smsActionType": "OTPSEND"
      }
      if (signupData.emailAddress === null && signupData.phoneNo === null && signupData.firstName === null && signupData.password === null) {   
       //this.toastService.showI18nToast('','TOAST_MSG.PLEASE_FILL_OUT_THE_FIELD','warning');
       this.toastService.showI18nToast('TOAST_MSG.PLEASE_FILL_OUT_THE_FIELD','warning');
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
          this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_YOUR_NAME','warning');
        }
        else if (signupData.password == null) {
          this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_PASSWORD','warning');
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
                if (result && result.status == 2000) {
                  this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY_VERIFY_OTP','success');
                } else {
                  this.toastService.showI18nToast('TOAST_MSG.SOMETHING_WENT_WRONG','warning');
                }
              });
             this.phoneNo = number;
  
        }
      }//If sign-up with mobile no 
      else if (signupData.phoneNo !== null) {
        if (number.length > 3 && number.length < 13) {
          this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT','warning');
          return false;
        }      
        else if (signupData.firstName == null) {
          this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_YOUR_NAME','warning');
        }
        else if (signupData.password == null) {
          this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_PASSWORD','warning');
        }
        else if (signupData.password.length<8) {
          this.toastService.showI18nToast('TOAST_MSG.PASSWORD_SHOULD_BE_EIGHT_CARR','warning');
          return false;
        }else {   
              this.signupOtpVerify = true;
              this.signupMainSection = true;
              this.verify = false;
              let signupQuery = {               
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
                if (result && result.status == 2000) {
                  this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY_VERIFY_OTP','success');
                } else {
                  this.toastService.showI18nToast('TOAST_MSG.SOMETHING_WENT_WRONG','error');
                }
              });
              this.phoneNo = number;
         
      }
    } else if(signupData.emailAddress !== null) {
      
      if (!this.phoneEmailValidation(signupData.emailAddress)) {
        return false;
      }
       else if (signupData.firstName == null) {
        this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_YOUR_NAME','warning');
        return false;
      } else if (signupData.password == null) {
        this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_PASSWORD','error');
        return false;
      } 
      else if (signupData.password.length<8) {
        this.toastService.showI18nToast('TOAST_MSG.PASSWORD_SHOULD_BE_EIGHT_CARR','warning');
        return false;
      }
      else {
        this.signup(signupData);
      }
    } 
    
  }

  verifyOtpSignup(signupData: any) {
    let query = {
      "contactNo": this.phoneNo,
      "verificationCode": signupData.otp
    }
    if (signupData.otp != null) {
      this.authService.mobileVerification(query).subscribe((result) => {
        if (result.status === 2009) {   
          this.toastService.showI18nToast('TOAST_MSG.MOBILE_NO_VERIFIED_SUCCESSFULLY','success');  
          this.loginOnVerifiedMobileSignUP(signupData);
        } else {
          // this.toastr.warning(result.message);
          this.toastService.showI18nToast(result.message,'warning');
        }
      })
    } else {
      this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_OTP','warning');
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
        this.toastService.showI18nToast(result.message,'warning');
        return;
      }    
     
    } else if (result) {
      this.loginSuccess(result);

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
      this.toastService.showI18nToast('TOAST_MSG.OTP_RESEND_SUCCESSFULLY','success');
    }
  })
}

// impliment end by SHANU

  signup(signupData: any) {
   
    this.submitted = true;
     
    // if (this.signupForm.invalid) {
    //   return;
    // }
    
    signupData.registrationProvider = 'SBIS';
    if (signupData.emailAddress !== null || signupData.emailAddress !== '') {
      this.checkEmailAddress(signupData.emailAddress);
    }
    const payload = {
      'emailAddress': signupData.emailAddress,
      'contactNo': signupData.phoneNo?signupData.phoneNo.internationalNumber:null,
      'password': signupData.password,
      'name': signupData.firstName,
      'registrationProvider': signupData.registrationProvider,
      'roleName': this.roleName
    };
    if(this.checkUser) {
      payload['signUpForPsedoUser'] = true;
      payload['msUser'] = this.msUserPk;
    }
    if(this.docReferralDetails) {
      payload['referralRefNo'] = this.docReferralDetails.referralRefNo;
      payload['signUpForReferralDoctor'] = true;
    }
    //this.userRegister(payload);
    this.authService.userSignUp(payload).subscribe(result => {
      if (result && result.status == 2000) {
        /* Working on app/issues/782 */
         if(this.roleName == "INDIVIDUAL" || this.roleName == "DOCTOR"){
          this.showSuccessMsgOnEmailSignup = true;
          this.emailId = signupData.emailAddress;
         }  
         else{
          this.showSuccessMsgOnEmailSignup = false;
          this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY_LINK_SENT_EMAIL','success');
          this.goToLogin();
         } 

        /* Working on app/issues/782 */
        
      } else {
        this.toastService.showI18nToast('TOAST_MSG.SOMETHING_WENT_WRONG','error');
      }
    });
    this.signupDataFrom = signupData;
  }
  socialSignup(socialData: any) {
    socialData.registrationProvider = 'GOOGLE';
    socialData.userName = socialData.id;
    socialData.emailAddress = socialData.email;
    socialData.firstName = socialData.name;   
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
        this.toastService.showI18nToast('TOAST_MSG.OTP_FOR_SIGNIN','warning');
      } else {
        this.verifyOtpSignup(formValue);
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
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
        console.log(socialPlatform + ' sign in data : ', userData);
        this.socialSignup(userData);
       
      }
    );
  }
  phoneEmailValidation(email: any) {

    // if (email === null || email === '') {
    //   this.toastService.showToast(-1, 'Please provide email/mobile number');
    //   return false;
    // } 
    if (isNaN(email)) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (reg.test(email) == false) {
        this.toastService.showI18nToast('TOAST_MSG.INVALID_EMAIL','error');
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
	if(this.signupForm.get('phoneNo').value != null || this.signupForm.get('phoneNo').value != undefined){
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
    this.selectedRole= selectedRole;

  }


  signUpInDiffRole() {
    let query = {
      'msUserPk': this.msUserPk,
      'roleName': this.roleName,
      'rolePk': this.userRolePk
    }
    this.authService.userSignUpRequest(query).subscribe((result) => {
      if (result.status == 2000) {
        this.toastService.showI18nToast('TOAST_MSG.SIGNED_UP_SUCCESSFULLY','success');
        let query = {
          'userName': this.selectedRole.userName,
          'roleName':this.selectedRole.addNewRole,
          'loginWithRole':true,
          'loginAfterRoleAdd': true
        }
        // call login service
        this.authService.userLogin(query).subscribe((result) => {
          if (result) {
            this.loginSuccess(result);
            
          }
        })
      }else{
        // this.toastr.error(result.message);
        this.toastService.showI18nToast(result.message,'error'); 
      }
    })
  }

  loginSuccess(result) {
    let user = {
      id: result.userId,
      userName: result.username,
      token: result.token,
      roleName: result.roleName,
      userId: result.userId,
      parentRoleName: result.entityName,
      firstName:result.username,
      refNo: result.refNo, //Working om app/issues/746
    }
    localStorage.setItem("user", JSON.stringify(user));
    this.broadcastService.setProfileModificationData(user); 

    let query = {
      'roleName': result.roleName,
      'entityName': result.entityName,
      'msUserPk': result.userId
    }
    //this.authService.getUserState(result.entityName + '/' + result.roleName + '/' + result.userId).subscribe(data => {
    let userDet = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserStateV2(query).subscribe(data => {
      // let user = JSON.parse(localStorage.getItem('user'));
      // user.id = data.data.userProfileId == 0 ? result.userId : data.data.userProfileId, 
      // localStorage.setItem("user", JSON.stringify(user));
      // this.broadcastService.setAuth(true);
      // let nevigate = this.userStateRuleService.userNevigationRules[data.data.stateString];      
      // this.router.navigate([nevigate]);

      // /* Working on app/issues/782 */
      // let payloadWorkflow = {
      //   // "isChabmerOrAddressExist": data.data.chabmerOrAddressExist,
      //   "registrationWorkflowCompleted": data.data.registrationWorkflowCompleted,
      //   "validProfile": data.data.validProfile,
      //   "registrationWorkflowSteps": data.data.registrationWorkflowDTOs,
      //   "currentStepNo" : data.data.currentStepNo
      // }
      // this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
      // localStorage.setItem("regw", JSON.stringify(payloadWorkflow));
      /*End Working on app/issues/782 */
      userDet.id = data.data.userProfileId == 0 ? result.userId : data.data.userProfileId,
      userDet.profileVerified = data.data.profileVerified;
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
    })
  }

  onKeydown($event) {
    if ($event.key == '"' || $event.key == '<' || $event.key == '>' || $event.key == '?' || $event.key == '@' || $event.key == '#' || $event.key == '$' || $event.key == '%' || $event.key == '^' || $event.key == '&' || $event.key == '*' || $event.key == '(' || $event.key == ')' || $event.key == '-' || $event.key == '_' || $event.key == '+' || $event.key == '=' || $event.key == '~' || $event.key == "." || $event.key == "," || $event.key == "/" || $event.key == "'" || $event.key == ":" || $event.key == ";" || $event.key == "`" || $event.key == "~" || $event.key == "{" || $event.key == "}" || $event.key == "[" || $event.key == "]" || $event.key == "|" || $event.key == "!") {
    return false;
    }
  }

  showPassword(){
    this.show_eye = !this.show_eye;
  }

  showDoctorPassword(){
    this.showDoctor_eye = !this.showDoctor_eye;
  }
  
  openPrivacy(){
	this.displaySidebar = true;  
  }
  
  openTerms(){
	this.displaySidebarTerms = true;  
  }
}
