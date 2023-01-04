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
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IndividualService } from '../../individual.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { environment } from '../../../../../environments/environment';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, EmailValidator } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BroadcastService } from './../../../../core/services/broadcast.service';
import { AuthService } from '../../../../auth/auth.service';
import { GetSet } from '../../../../core/utils/getSet';
import { SBISConstants } from "../../../../SBISConstants";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userProfileData: any = [];
  user_id: any;
  ms_user_id: any;
  userProfileubmitted: any = false;
  masterGender: any = [];
  dateFormat = "";
  userProfileCtrl: FormGroup;
  progress = { percentage: 0, isShowUploadBtn: false };
  domSanitizer: any;
  profileImageSrc = "";
  minDate = new Date();
  maxDate = new Date();
  token: any;
  masterBloodGroup: any = [];
  otpVerify: any = false;
  otpVerifySuccess: any = false;
  allDataFetched: boolean = false;
  user_refNo: string;
  user_roleName: any;

  /* Working on app/issues/782 */
  isRegistrationWorkflowCompleted: boolean = false;
  // isValidProfile: boolean = false;
  workflowSteps: any = [];
  workflow: any;
  /*End Working on app/issues/782 */
  
  // minDate = { year: 1900, month: 1, day: 1 };
  // maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private individualService: IndividualService,
    private translate: TranslateService,
    private toastService: ToastService,
    private frb: FormBuilder,
    private _domSanitizer: DomSanitizer,
    private broadcastService: BroadcastService,
    private authService: AuthService
  ) {
    this.domSanitizer = _domSanitizer;

    this.userProfileCtrl = frb.group({
      'firstName': [null, [Validators.required, Validators.maxLength(50), Validators.minLength(0)]],
      'gender': [null, Validators.required],
      'displayGender': [null],
      'bloodGroup': [null],
      'displayBloodGroup': [null],
      'dateOfBirth': [null, Validators.required],
      'maritialStatus': [null],
      'emailAddress': [null, [Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'),EmailValidator]],
      'contactNo': [null, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      'otp': [null],
      'isEdit': [false],
      'isSubmit': [false]
    });
  }

  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.ms_user_id = user.userId;
    this.user_roleName = user.roleName;
    this.token = user.token;
    this.loadProfileImage();
    this.loadAllMasterData();

    /* Working on app/issues/782 */
    this.workflow = JSON.parse(localStorage.getItem('regw'));
    //this.workflowSteps = workflow.registrationWorkflowSteps;
    this.isRegistrationWorkflowCompleted = this.workflow.registrationWorkflowCompleted;
    // this.isValidProfile = this.workflow.validProfile;
    this.broadcastService.setRegistrationWorkflow(this.workflow);
    // this.broadcastService.getRegistrationWorkflow().subscribe(workflow => {
    //   this.workflowSteps = workflow.registrationWorkflowSteps;
    //   this.isRegistrationWorkflowCompleted = workflow.registrationWorkflowCompleted;
    //   this.isValidProfile = workflow.validProfile
    // });
    
    if(!this.isRegistrationWorkflowCompleted){
      this.userProfileCtrl.patchValue({
        isEdit: true
      })
    }
    /*End Working on app/issues/782 */
  }
  onSubmit(): void {
    console.log()
  }
  getGender(gender: string) {
    let displayGender = this.masterGender.filter(x => x["attributeValue"] == gender)[0];
    if (displayGender) {
      return displayGender["displayValue"];
    } else {
      return;
    }
  }

  //for BLood Group:
  getBloodGroup(bloodGroup: string) {
    let displayBloodGroup = this.masterBloodGroup.filter(x => x["attributeValue"] == bloodGroup)[0];
    if (displayBloodGroup) {
      return displayBloodGroup["displayValue"];
    } else {
      return;
    }
  }

  emailVerify() {
    //let roleName = localStorage.getItem('roleName');
    var path = this.user_roleName + '/' + this.ms_user_id;
    this.authService.resendVerifyMail(path).subscribe((result) => {
      if (result.status === 2000) {
        this.toastService.showI18nToast("USER_PROFILE_TOAST.VERIFICATION_SENT" , 'success');
      }
    })
  }

  mobileVerify() {
    let number = this.userProfileCtrl.get('contactNo').value;
    // console.log(number);
    let query = {
      'contactNo': number,
      'smsActionType': "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      if (result.status === 2000) {
        this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_SENT" , 'success');
      }
    })
    this.otpVerify = true;
    // get controls() { return this.userProfileCtrl.controls; }
  }

  resendOtp() {
    let number = this.userProfileCtrl.get('contactNo').value;
    let query = {
      'contactNo': number,
      'smsActionType': "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_RESEND" , 'success');
    })
  }

  cancelSection() {
    this.otpVerify = false;
  }

  otpSubmit() {
    let number = this.userProfileCtrl.get('contactNo').value;
    let otp = this.userProfileCtrl.get('otp').value;
    // console.log(otp);
    let query = {
      "contactNo": number,
      "verificationCode": otp
    }
    if (otp != null) {
      this.authService.mobileVerification(query).subscribe((result) => {
        if (result.status === 2009) {
          this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_VERIFIED" , 'success');
          this.otpVerifySuccess = true;
        } else {
          this.toastService.showI18nToast(result.message , 'error');
        }
      })
    } else {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.PLEASE_ENTER_OTP" , 'warning');
    }
  }

  checkUserName(emailAddress: any) {
    // if (this.controls.emailAddress.errors !== null) {
    //   // show error msg
    // } else {
      let email = emailAddress.replace('@', '%40');
      this.authService.checkEmailExist(email).subscribe((data) => {
        if (data) {
          if (data.status === 5050) {
            this.toastService.showI18nToast(data.message , 'error');
            // this.userProfileCtrl.reset();
            // this.userProfileCtrl.get('isEdit').value;
            this.toastService.showI18nToast("USER_PROFILE_TOAST.EMAIL_ADDRESS_EXIST" , 'error');
            this.userProfileCtrl.patchValue({
              'emailAddress': ''
            });
            return;
          }
          // show msg
        }
      },
        (error) => {
          // show error
        });
    // }
  }

  checkContactNumber(contactNo: any) {
    // if (this.lControls.phoneNo.errors !== null) {
    //   // show error msg
    // } else {
      let phoneNo = contactNo.replace('+', '%2B');
      this.authService.checkMobileNoExist(phoneNo).subscribe((data) => {
        if (data) {
          if (data.status === 5051) {
            this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_EXIST" , 'error');
            this.userProfileCtrl.patchValue({
              'contactNo': ''
            });
            return;
          }
          // show msg
        }
      },
        (error) => {
          // show error
        });
    // }
  }

  loadUserProfile() {
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((result) => {
      if (result.status === 2000) {
        GetSet.setMinorCount(result.data.minorCount);
        this.userProfileData = result.data;
        // console.log(result.data.dateOfBirth);
        this.broadcastService.setHeaderText('My Profile');
        this.userProfileCtrl.patchValue({
          'firstName': result.data.firstName,
          'gender': result.data.gender,
          'displayGender': this.getGender(result.data.gender),
          'bloodGroup': result.data.bloodGroup,
          'displayBloodGroup': this.getBloodGroup(result.data.bloodGroup),
          'maritialStatus': result.data.maritialStatus,
          'emailAddress': result.data.emailAddress,
          'dateOfBirth': result.data.dateOfBirth ? new Date(result.data.dateOfBirth) : '',
          'contactNo': result.data.contactNo
        });
        this.allDataFetched = true;
      }
    });
  }

  loadProfileImage() {
    this.profileImageSrc="";
    // this.individualService.downloadProfilePhoto(this.ms_user_id).subscribe(result => {
      //let roleName = localStorage.getItem("roleName");
      let path: string = this.user_refNo + "/" + this.user_roleName;//neew add to download profile pic 
      this.individualService.downloadProfilePhotoV2(path).subscribe(result => {//this.ms_user_id
      if (result.status === 2000 && result.data != null && result.data.length > 0) {
        this.profileImageSrc = "data:image/jpeg;base64," + result.data;
        this.broadcastService.setProfileImage(this.profileImageSrc);
      }
      this.progress.percentage = 0;
    })
  }

  selectFile(event: any) {
    this.progress.percentage = 0;
    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 140) {
      document.getElementById("profilePhoto")["value"] = "";
      this.toastService.showI18nToast("USER_PROFILE_TOAST.PIC_LESS_THAN" , 'warning');
      return;
    }
    let formdata: FormData = new FormData();
    formdata.append('userId', this.ms_user_id);
    formdata.append('file', file);

    this.individualService.uploadProfilePhoto(formdata, this.token).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        if (this.progress.percentage > 80) {
          this.progress.percentage = this.progress.percentage - 10;
        }
      } else if (event instanceof HttpResponse) {
        this.progress.percentage = 100;
        document.getElementById("profilePhoto")["value"] = "";
        this.loadProfileImage();
      }
    });

  }

  onTabChange(event) {
    this.router.navigate(['/individual/user-profile-view', event.nextId]);
  }

  loadAllMasterData() {
    this.individualService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.GENDER }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
      }
      this.loadUserProfile();
    });

    this.individualService.getMasterDataBloodGroup({ q: SBISConstants.MASTER_DATA.BLOOD_GROUP }).subscribe(data => {
      if (data.status === 2000) {
        this.masterBloodGroup = data.data;
      }
      this.loadUserProfile();
    });
  }

  returnPreviousPage() {
    this.router.navigate(['/individual/tab-personal']);
  }

  profileSubmit() {
    let profileValue = this.userProfileCtrl.value;
    this.userProfileCtrl.patchValue({
      'displayGender': this.getGender(profileValue.gender),
      'displayBloodGroup': this.getBloodGroup(profileValue.bloodGroup),
      'isSubmit': true
    });
    // console.log(this.userProfileCtrl);
    // console.log(this.userProfileCtrl.invalid);
    if (this.userProfileCtrl.invalid) {
      return;
    }

    let updatedValue={
      'groupId': null,
      'userRefNo': this.user_refNo,
      'firstName': profileValue.firstName,
      'gender': profileValue.gender,
      'bloodGroup': profileValue.bloodGroup,
      'contactNo': profileValue.contactNo,
      'emailAddress': profileValue.emailAddress,
      'dateOfBirth': new Date(profileValue.dateOfBirth),
      'maritialStatus': profileValue.maritialStatus
    };
    this.individualService.updateUserProfile(updatedValue).subscribe((data) => {
      if (data.status === 2000) {
        this.userProfileCtrl.patchValue({
          'isEdit': false
        });
        this.broadcastService.setProfileModificationData(updatedValue);
        // this.loadUserProfile();
        let user = JSON.parse(localStorage.getItem('user'));
        user.userName = updatedValue.firstName;
        localStorage.setItem('user',JSON.stringify(user));
        if(profileValue.emailAddress && !this.userProfileData.emailVerified) {
          this.emailVerify();
        }
      }
      this.isPhoneNoAvailable = false;
      this.isEmailAvailable = false;
      this.toastService.showI18nToast("USER_PROFILE_TOAST.UPDATE_USER_DETAILS", 'success');
    });
    if (this.userProfileData.mobileVerified == false) {
      this.otpVerify = false;
    }

    /* Working on app/issues/782 */
    let payloadWorkflow = JSON.parse(localStorage.getItem('regw'));
    //payloadWorkflow.validProfile = true;
    
    //this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
    //localStorage.setItem('regw',JSON.stringify(payloadWorkflow));

    if(payloadWorkflow.registrationWorkflowCompleted == null || payloadWorkflow.registrationWorkflowCompleted){
      this.ngOnInit();
    }
    else{
      if(payloadWorkflow.currentStepNo == 1)
          payloadWorkflow.currentStepNo++;
      //payloadWorkflow.validProfile = true;    
      this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
      localStorage.setItem('regw',JSON.stringify(payloadWorkflow));
      this.router.navigate(["individual/tab-address"]);
    }
    /*End Working on app/issues/782 */
    //this.ngOnInit();
  }

  replaceNumber(profile: any) {
    let firstName = profile.firstName;
    firstName = firstName.replace(/\d/g, "");
    this.userProfileCtrl.patchValue({
      'firstName': firstName
    });
  }

  resolveGenderValue(gender: any) {
    if (gender == 'O') return 'Other';
    else if (gender == 'F') return 'Female'
    else if (gender == 'M') return 'Male';
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  oldItem: any;
  isPhoneNoAvailable: boolean;;
  isEmailAvailable: boolean;

  editOccupation(ctrl: any) {
    // console.log(ctrl);
    this.oldItem = ctrl.value;
    this.userProfileCtrl.patchValue({
      'isEdit': true
    });
    if (ctrl.value.emailAddress) {
      this.isEmailAvailable = true;
    }
    if (ctrl.value.contactNo) {
      this.isPhoneNoAvailable = true;
    }
    //userProfileCtrl.get('isEdit').value=!userProfileCtrl.get('isEdit').value
  }
  backOperation() {
    this.userProfileCtrl.patchValue({
      'firstName': this.oldItem.firstName,
      'gender': this.oldItem.gender,
      'displayGender': this.getGender(this.oldItem.gender),
      'bloodGroup': this.oldItem.bloodGroup,
      'displayBloodGroup' : this.getBloodGroup(this.oldItem.bloodGroup),
      'maritialStatus': this.oldItem.maritialStatus,
      'emailAddress': this.oldItem.emailAddress,
      'dateOfBirth': this.oldItem.dateOfBirth ? new Date(this.oldItem.dateOfBirth) : '',
      'contactNo': this.oldItem.contactNo,
      'isEdit': false
    });
    this.isPhoneNoAvailable = false;
    this.isEmailAvailable = false;
  }

  onKeydown($event) {
    if ($event.key == '"' || $event.key == '<' || $event.key == '>' || $event.key == '?' || $event.key == '@' || $event.key == '#' || $event.key == '$' || $event.key == '%' || $event.key == '^' || $event.key == '&' || $event.key == '*' || $event.key == '(' || $event.key == ')' || $event.key == '-' || $event.key == '_' || $event.key == '+' || $event.key == '=' || $event.key == '~' || $event.key == "." || $event.key == "," || $event.key == "/" || $event.key == "'" || $event.key == ":" || $event.key == ";" || $event.key == "`" || $event.key == "~" || $event.key == "{" || $event.key == "}" || $event.key == "[" || $event.key == "]" || $event.key == "|" || $event.key == "!") {
    return false;
    }
  }
}
