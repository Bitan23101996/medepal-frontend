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

import { Subscription } from 'rxjs/Subscription';
import { query } from '@angular/core/src/render3';
import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { BroadcastService } from './../../../core/services/broadcast.service';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
//import { AuthService } from '../../../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, EmailValidator } from '@angular/forms';
import { ToastService } from './../../../core/services/toast.service';
import { CoreService } from './../../core.service';
import { AuthService as SocialAuth, GoogleLoginProvider, FacebookLoginProvider } from 'angular-6-social-login-v2';
import { AuthService } from '../../../auth/auth.service';
import { GetSet } from '../../utils/getSet';
import { IndividualService } from '../../../modules/individual/individual.service';
import { AngularFireDatabase } from "@angular/fire/database";//firebase
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserStateRuleService } from 'src/app/auth/userStateRuleService';
import { OverlayPanel } from 'primeng/overlaypanel';
import { environment } from "../../../../environments/environment";
import { SBISConstants } from 'src/app/SBISConstants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('loginModal') loginModal: TemplateRef<any>;
  @ViewChild('privacyAlert') privacyAlert: TemplateRef<any>;
  @ViewChild('termsAlert') termsAlert: TemplateRef<any>;
  @ViewChild('help') help: NgbCarousel;
  @ViewChild("qa") qa: OverlayPanel;
  loginCtrl: FormGroup;
  loginForm: FormGroup;
  otherParentRoleName: any;
  otherRoleName: any;
  otpValue: any = false;
  modalRoles: any = [];
  roleName: any;
  submitted: any = false;
  parentRoleName: any;
  cardItemCount: any;
  userName = "";
  loginUser: any;
  isHeaderLogin: boolean = false;
  isHeaderSignUp: boolean = false;
  isLanding: boolean = true;
  isHeaderVeryfied: boolean = false;
  menus: any;
  alerts: any = [];
  user_id: any;
  userRefNo: any;
  alertPk: any;
  profileImageSrc = "";
  domSanitizer: any;
  alertMsg = false;
  modalRef: BsModalRef;
  user_role: any;
  user_role_to_display: any;
  otpLoginEmail: any = false;
  otpLoginEntry: any = false;
  otpLoginText: any = false;
  otpVerified: any = false;
  givenNumber: any = false;
  passwordEntry: any = false;
  passwordLoginButton: any = false;
  usePassword: any = false;
  loginWithPassword: any = false;
  logoImageSrc = "";
  serviceProviderName = "";
  entityName: any;
  firebaseCount: number = 0;//to get count firebase notification
  firebaseNotifications: any[] = [];//firebase
  firebaseNotificationObj: any;
  @Input() isAuthenticated = false;
  msUserPk: number;
  userRoles: any[] = [];
  userMenu: boolean = false;
  switchPop: boolean = false;
  displaySidebar: boolean = false;
  roleMenu: any[] = [];
  subRoleMenu: any[] = [];
  user_rolePk: number;
  isCarousel: boolean = false;
  download = {
    downloadImageSrc: "",
    contentType: "",
    downloadImages: []
  }
  quickMenu: any;
  subMenuForQuickAdd: any[] = [];
  isOverlay: boolean = false;
  quickAddIcon: any[] = [];
  notificationFirebaseData: any[] = [];
  isFullProfileVerified: boolean = false;
  environmentIdentifier: string;
  environmentIdentifierColor: string;
  userNameForHeader: string;
  childServiceProvider: any[] = [];
  selectedChild: any;
  childServiceProviderRefNo: any;
  isChild: boolean = false;

  constructor(
    private firebaseDatabase: AngularFireDatabase,
    private coreService: CoreService,
    private router: Router,
    private fb: FormBuilder,
    private broadcastService: BroadcastService,
    private _domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private toastService: ToastService,
    private socialAuthService: SocialAuth,
    private authService: AuthService,
    private _individualService: IndividualService,
    private eRef: ElementRef,
    private userStateRuleService: UserStateRuleService
  ) {
    //this.minDate.setDate(this.minDate.getDate() - 1);
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    this.domSanitizer = _domSanitizer;

    this.loginForm = this.fb.group({
      'userName': [null, Validators.required],
      'password': [null, Validators.required],
      // 'otpForNumber': [null],
      'otp': this.otpValue
    });
    this.environmentIdentifier = environment.environment_identifier;
    this.environmentIdentifierColor = environment.environment_identifier_background_color;
  }

  ngOnInit() {

    let rootUrl = window.location.toString();
    if (rootUrl == window.location.origin + '/') {
      this.isAuthenticated = false;
    }


    let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user_role = user.roleName;
      this.msUserPk = user.userId;
      if(user.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR) {
        this.childServiceProviderRefNo = user.childServiceProviderRefNo;
        this.getServiceProviderEntityDetailsList(user);
      }
    }
    //this.broadcastService.setProfileImage(null);
    if (user) {
      this.user_id = user.id;
      this.alertPk = user.alertPk;
      this.user_rolePk = user.rolePk;
    }
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
        this.loginUser = user;
        if (user) this.userName = user.userName;

        let url = window.location.toString();
        if (!user && url.indexOf('/auth/') == -1) {
          this.isHeaderLogin = true;

          this.isHeaderSignUp = url.indexOf('/search') > 0 ? true : false;
        } else {
          this.isHeaderLogin = false;
          this.isHeaderSignUp = false;
          //start of, user can't able to access his/her profile menu without verified
          if (user) {
            this.isFullProfileVerified = user.profileVerified;
            this.isAuthenticated = user.profileVerified;
            if (!user.profileVerified) {
              this.broadcastService.setAuth(user.profileVerified);
            }
          }
          //end of, user can't able to access his/her profile menu without verified
          if (url.indexOf('/auth/verifications') > 0 || url.indexOf('/auth/change-password') > 0) {
            this.isHeaderVeryfied = true;
          } else {
            this.isHeaderVeryfied = false;
          }
        }
        if (url.indexOf('landing') > -1) {
          this.isLanding = true;
          this.isAuthenticated = false;
        } else {
          this.isLanding = false;
        }
      }
    });
    this.getMenus();
    this.broadcastService.setProfileImage("");
    this.broadcastService.getProfileImage().subscribe(profileImageSrc => {
      this.profileImageSrc = profileImageSrc;
    });

    this.broadcastService.getLogo().subscribe(logoImageSrc => {
      this.logoImageSrc = logoImageSrc;
    });

    this.broadcastService.getServiceProviderName().subscribe(serviceProviderName => {
      this.serviceProviderName = serviceProviderName;
    });

    this.broadcastService.getUserData().subscribe(user => {
      this.entityName = user.entityName;
      this.roleName = user.roleName;
    });

    this.broadcastService.getChildSpRefNo().subscribe(user => {
      if (user.roleName == SBISConstants.ROLE_NAMES.BOOKING_OPERATOR) {
        this.getServiceProviderEntityDetailsList(user);
      }
    });

    // setInterval(() => { this.getLetestUserAlertState() }, 5 * 6000);
    // setInterval( ()=>{this.getfirebaseObjects()}, 5*6000);//firebase
    this.broadcastService.getProfileModifiedObservable().subscribe(updatedUserData => {
      this.userName = updatedUserData.firstName;
    });
    // this.countCartOrders();
    // this.broadcastService.getFireBaseNotifications().subscribe(firebaseNotifications => {
    //   this.getfirebaseObjects();//get firebasecount
    // });
    this.userMenu = false;
    this.switchPop = false;
  }

  ngOnChanges() {
    let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user_role = user.roleName;
      if (this.user_role == 'INDIVIDUAL') {
        this.countCartOrders();
        // setInterval( ()=> {this.countCartOrders()}, 5*6000);
      }
      this.authService.getMenuStructureForQuickAdd(this.user_role + '?parentRoleName=' + this.user_role + '&platform=WEB').subscribe(responce => {
        if (responce.status == 2000) {
          this.quickAddIcon = responce.data;
        }
      });
      this.entityName = user.entityName;
      this.isAuthenticated = user.profileVerified;
      if (!user.profileVerified) {
        this.broadcastService.setAuth(user.profileVerified);
      }
      this.notificationFirebaseData = [];

      this.userNameForHeader = user.userName.substring(0, 1);

    }//check of user
    // this.broadcastService.
    this.getRoles();
    this.getfirebaseObjects();//get firebasecount
  }//end of onchanges

  getServiceProviderEntityDetailsList(user) {
    let parentRoleName;
    if (user.parentRoleName == "HOSPITAL") {
      parentRoleName = 'Hospital';
    } else {
      parentRoleName = user.parentRoleName
    }
    let query = {
      "serviceProviderRef": user.serviceProviderRefNo,
      "parentRoleName": parentRoleName
    }
    this.coreService.getServiceProviderEntityValueByPk(query).subscribe(resp => {
      if (resp.status == 1) {
        this.isChild = true;
        this.childServiceProvider = resp.data.childServiceProvider;
        this.selectedChild = this.childServiceProvider[0];
        localStorage.setItem('childServiceProviderRefNo', this.selectedChild.refNo);
      }
    });
  }

  ngAfterViewInit() {
    // this.getAlertValue();//closed --23.07.2019
    this.broadcastService.getLogin().subscribe(loginObj => {
      this.loginForm.patchValue({
        "userName": '',
        "password": '',
        "otp": ''
      })
      this.otpLoginEntry = false;
      this.otpLoginText = false;
      this.otpValue = false;
      this.otpVerified = false;
      this.givenNumber = false;
      this.passwordLoginButton = false;
      this.loginWithPassword = false;
      this.passwordEntry = false;
      this.usePassword = false;
      this.modalRef = this.bsModalService.show(this.loginModal, { class: 'modal-lg' });
    });

    this.broadcastService.getHeaderOrderItem().subscribe(loginObj => {
      this.countCartOrders();
    });

    this.broadcastService.getFireBaseNotifications().subscribe(firebase => {
      this.firebaseNotificationObj = [];
      this.firebaseNotificationObj = firebase;
      this.getfirebaseObjects();
    });
    // this.getfirebaseObjects();//get firebasecount
  }//end of after view init

  changeHospital() {
    this.broadcastService.setHospitalDetails(this.selectedChild.refNo);
    localStorage.setItem('childServiceProviderRefNo', this.selectedChild.refNo);
  }

  loginSuccess(result) {
    let user = {
      id: result.userId,
      userName: result.username,
      token: result.token,
      roleName: result.roleName,
      userId: result.userId,
      parentRoleName: result.entityName,
      entityName: result.entityName,
      firstName: result.username,
      registrationProvider: result.registrationProvider,
      hasPassword: result.hasPassword,
      refNo: result.refNo
    }
    localStorage.setItem("user", JSON.stringify(user));
    this.broadcastService.setProfileModificationData(user);
    let path: string = result.refNo + "/" + result.roleName;//neew add to download profile pic  
    this.apiService.DownloadProfilePic.getByPath(path).subscribe(result => {
      if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
        this.profileImageSrc = "data:image/jpeg;base64," + result.data;
        this.broadcastService.setProfileImage(this.profileImageSrc);
      }
    });

    let query = {
      'entityName': 'INDIVIDUAL',
      'loginWithOtp': false,
      'msUserPk': result.userId,
      'roleName': 'INDIVIDUAL'
    }
    this.authService.getUserStateV2(query).subscribe(data => {
      if (data.status == 2000) {
        let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
        user.id = data.data.userProfileId == 0 ? result.userId : data.data.userProfileId,

          localStorage.setItem("user", JSON.stringify(user));
        this.broadcastService.setAuth(true);
        let getRoutePath = GetSet.getOrderMedicine();
        if (getRoutePath == true) {
          let orderMedicineQuery = GetSet.getOrderMedicineQuery();
          orderMedicineQuery['userRefNo'] = user.refNo;
          this._individualService.getOrderById(user.refNo).subscribe((result) => {
            if (result.status === 2000) {
              if (result.data.length > 0) {
                orderMedicineQuery['requisitionRefNo'] = result.data[0].requisitionRefNo;
                result.data[0].cartItems.forEach(element => {
                  orderMedicineQuery.orderItems.push({
                    itemId: element.itemPk,
                    numUnits: element.numUnits,
                    prescriptionRequired: element.prescriptionRequired,
                    medicine: element.itemName,
                    discount: +element.discount,
                    tax: +element.tax,
                    netAmount: +element.netAmount,
                    patientRefNo: user.refNo,
                    prescriptionRefNo: element.prescriptionRefNo ? element.prescriptionRefNo : null
                  });
                });
              } else {
                orderMedicineQuery['requisitionRefNo'] = null;
              }
              orderMedicineQuery.orderItems.forEach(element => {
                element['patientRefNo'] = user.refNo;
              });
              this.apiService.SaveOrderMedicine.postByQuery(orderMedicineQuery).subscribe((result) => {
              });
              this.countCartOrders();
              this.getfirebaseObjects();//get firebasecount
              this._individualService.getOrderById(user.refNo).subscribe((result) => {
                if (result.status === 2000) {
                  if (result.data.length != 0) {
                    GetSet.setRequisitionRefNo(result.data[0].requisitionRefNo);
                  } else {
                    GetSet.setRequisitionRefNo(null);
                  }
                  this.router.navigate(['/individual/order-medicines']);
                }
              });
            }
          });
          GetSet.setPreviousAddressForReorderMed(null);//new add to set null on previous address value
          //this.router.navigate(['/individual/order-medicine']);
        }
        this.modalRef.hide();
      } else if (data.status == 500) {
        this.toastService.showI18nToast('Authentication Failed', 'error');
      }
    });
  }

  loginWithOtp() {
    let number = this.loginForm.get('userName').value;
    let query = {
      "contactNo": number,
      "smsActionType": "OTPSEND"
    }
    if (number == null) {
      this.toastService.showI18nToast('TOAST_MSG.PLEASE_ENTER_MOBILE_TO_GET_OTP', 'warning');
    } else if (number.length !== 13 && number.includes(+91)) {
      this.toastService.showI18nToast('TOAST_MSG.PHONE_NUMBER_MUST_HAVE_TEN_DIGIT', 'warning');
    } else {
      this.authService.sentOTP(query).subscribe((result) => {
        if (result.status == 2000) {
          this.otpLoginEntry = true;
          this.toastService.showI18nToast('TOAST_MSG.OTP_SENT_ON_MOBILE', 'success');
          this.otpLoginText = true;
          // this.otpLoginEmail = true;
          this.otpValue = true;
          this.otpVerified = true;
          this.givenNumber = true;
          this.passwordLoginButton = true;
        }
      })
    }
  }

  resendOtp() {
    let number = this.loginForm.get('userName').value;
    let query = {
      "contactNo": number,
      "smsActionType": "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      if (result.status == 2000) {
        this.toastService.showI18nToast('OTP resend successfull', 'success');
      }
    });
  }

  passwordLogin() {
    this.otpValue = false;
    this.givenNumber = false;
    this.otpLoginText = true;
    this.passwordEntry = true;
    this.otpLoginEntry = false;
    this.passwordLoginButton = true;
    this.usePassword = true;
    this.loginWithPassword = true;
    this.loginForm.patchValue({
      'userName': '',
      'password': ''
    });
  }

  otpLogin() {
    this.otpValue = true;
    this.otpLoginText = false;
    this.loginWithPassword = false;
    this.passwordEntry = false;
    this.usePassword = false;
    this.otpLoginEntry = false;
    this.passwordLoginButton = false;
    this.loginForm.patchValue({
      'userName': '',
      'password': ''
    });
  }

  // login(){
  //   if(!this.loginCtrl.valid) return;

  //   let formValue=this.loginCtrl.value;
  //   let query = {
  //     'userName': formValue.userName,
  //     'password': formValue.password,
  //     'registrationProvider': "SBIS",
  //     'roleName': "",
  //     'entityName': "",
  //     'loginWithRole': false,
  //     'otp':""
  //   }
  //   this.authService.userLogin(query).subscribe((result) => {
  //     if (result){
  //       this.loginSuccess(result);
  //     }
  //   });
  // }OTPSEND

  // getAlertValue() {//closed -- 23.07.2019
  //   let user = this.getUserFromLocalstorage();// JSON.parse(localStorage.getItem('user'));
  //   if (user) {
  //     // this.user_id = user.id;
  //     this.apiService.GetAlerts.getByPath(user.refNo).subscribe((data) => {
  //       this.alerts = data.data;
  //       this.alertMsg = false;
  //     })
  //   }

  // }//end of method

  //mnethod to get user from localstorage
  getUserFromLocalstorage(): any {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_role_to_display = localStorage.getItem('roleNameToDisplay');
    return user;
  }//end of method

  // getLetestUserAlertState() { //-->>closed because this service is not used now. 
  //   let user = JSON.parse(localStorage.getItem('user'));
  //   if (user) {
  //     this.user_id = user.id;
  //     this.userRefNo = user.refNo
  //     let alertDtoList = [];
  //     this.alerts.forEach(alert => {
  //       let alertDto = {
  //         'alertPk': alert.alertPk,
  //         'nextAttemptScheduled': alert.nextAttemptScheduled
  //       };
  //       alertDtoList.push(alertDto)
  //     });
  //     let query = {
  //       // 'userPk':this.user_id,
  //       'userRefNo': this.userRefNo,
  //       'alertDtoList': alertDtoList
  //     };
  //     this.coreService.checkAlertState(query).subscribe(result => {
  //       var resultData = result.data.totalNewAlertCount;
  //       if (resultData > 0) {
  //         this.alertMsg = true;
  //         return this.alertMsg;
  //       } else if (resultData == 0) {
  //         return this.alertMsg;
  //         // return true;
  //       }
  //     });
  //   }
  // }

  // cancelAlert(data: any) { //closed -- 23.07.2019
  //   let query = [{
  //     alertPk: data.alertPk,
  //     // userPk : data.userPk,
  //     userRefNo: this.userRefNo
  //   }]
  //   this.apiService.cancelAlerts.postByQuery(query).subscribe((data) => {
  //     // this.getAlertValue();//closed--23.07.2019
  //   })
  // }

  logOut() {
    this.closeConnFirebaseDatabase();//to close the connection of firebase database
    /* this.apiService.Logout.get().subscribe((resp) => {
       //do nothing
     })*/

    this.apiService.LogoutV2.postByQuery({ "fcmkey": localStorage.getItem("fcmkey") }).subscribe((resp) => {
      //do nothing
    })
    this.notificationFirebaseData = [];
    this.firebaseCount = 0;
    this.isChild = false;
    localStorage.removeItem('childServiceProviderRefNo');
    GetSet.setNotificationFirebaseData(null);
    localStorage.removeItem("user");
    this.broadcastService.setAuth(false);
    GetSet.setPeerConsultingInvitationLogin(null);
    //this.closeOpenedQuickAddOverlay(); //close opend quickadd overlay
    this.router.navigate(['/auth/landing']);

    /* Working on app/issues/782 */
    document.body.classList.remove('started-screen');
    localStorage.removeItem("regw");
    /*End Working on app/issues/782 */
  }

  closeConnFirebaseDatabase() {//method to close connection with firebase database
    let firebaseDbConn = GetSet.getFirebaseDbConn();
    if (firebaseDbConn) {
      firebaseDbConn.goOffline();
      GetSet.setFirebaseDbConn(null);
      this.firebaseCount = 0;
      this.firebaseNotificationObj = {};
      this.firebaseNotifications = [];
      // console.log("conn close of firebase");
    }//end if
  }//end of method

  goTohangePassword() {
    this.router.navigate(['/individual/change-password']);
  }
  goToProfile() {
    this.router.navigate(['/individual/user-profile-view/tab-personal']);
  }

  // For menu

  getMenus() {
    // this.apiService.GetMenus.get().subscribe(
    //   res => {
    //     this.menus = res;
    //   }
    // );

  }

  phoneEmailValidation(email: any, phone: any) {

    if ((email === null || email === '') && (phone === null || phone === '')) {
      this.toastService.showToast(-1, 'Please provide email/mobile number');
      return false;
    } else if (isNaN(email)) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

      if (reg.test(email) == false) {
        this.toastService.showToast(-1, "Invalid Email");
        return false;
      }

      return true;
    }
    else if (phone.length != 13) {
      this.toastService.showToast(-1, "Phone number must have 10 digits");
      return false;
    } return true;

  }

  get testSubmit() { return this.submitted; }
  get testLoginForm() { return this.loginForm; }
  // convenience getter for easy access to form fields
  get lControls() { return this.loginForm.controls; }

  enterToSend(ev, formValue) {
    const code = (ev.keyCode ? ev.keyCode : ev.which);
    if (code === 13) {
      if (this.otpValue == false) {
        if (formValue.userName && formValue.password && formValue.userName !== null && formValue.password !== null) {
          this.login(formValue);
        }
        else if (formValue.userName === null) {
          this.toastService.showToast(-1, "please enter your email/phone to signin");
          return;
        }
        else if (!this.phoneEmailValidation(formValue.userName, formValue.userName)) {
          return false;
        } else if (formValue.password === null) {
          this.toastService.showToast(-1, "please enter your password");
          return;
        }
      }
    }
  }

  userLogin(loginData: any) {
    let query = {
      'roleName': 'INDIVIDUAL',
      'entityName': 'INDIVIDUAL',
      'loginWithRole': true,
      'userName': loginData.userName,
      'password': loginData.password,
      'otp': this.otpValue
    }

    localStorage.setItem("loginUser", this.loginForm.get('userName').value);
    this.coreService.userLogin(query).subscribe(result => {

      if (typeof result.status != "undefined") {
        if (result.status != 2000) {
          this.toastService.showToast(result.status, result.message);
          return;
        }
      } else if (result) {
        this.loginSuccess(result);
      }

    });

  }

  socialSignup(socialData: any) {
    let query = {
      'userName': socialData.email,
      'socialToken': socialData.token,
      'socialProvider': socialData.provider.toUpperCase(),
      'roleName': 'INDIVIDUAL',
      'loginWithRole': true
    }
    this.coreService.userLogin(query).subscribe((result) => {
      if (result) {
        this.loginSuccess(result);
      }
    });
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


  login(loginData: any) {
    // localStorage.setItem("roleName", this.roleName);
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    if (loginData) {
      loginData.registrationProvider = 'SBIS';
      this.userLogin(loginData);
    }
  }

  roleCheckLogin(loginData) {
    this.login(loginData);
  }

  countCartOrders() {
    let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
    this.user_role = user.roleName;
    if (user.roleName == 'INDIVIDUAL') {
      this.apiService.CountOrderById.getByPath(user.refNo).subscribe((result) => {
        this.cardItemCount = result.data;
      })
    }
  }

  openPrivacyModal() {
    this.modalRef = this.bsModalService.show(this.privacyAlert, { class: 'modal-lg' });
  }

  openTermsModal() {
    this.modalRef = this.bsModalService.show(this.termsAlert, { class: 'modal-lg' });
  }

  goToMyCart() {
    GetSet.setMedicineDetails(null);
    GetSet.setOrderMedicineLabel('MY CART');
    this.router.navigate(['/individual/order-medicine']);
  }

  //method to get firebase count

  getfirebaseObjects() {
    this.firebaseNotifications = [];
    for (let firebase in this.firebaseNotificationObj) {
      this.firebaseNotifications.push(this.firebaseNotificationObj[firebase]);
    }
    if (GetSet.getNotificationFirebaseData()) {
      this.notificationFirebaseData.push(GetSet.getNotificationFirebaseData());
    }
    this.countFirebaseNotification();
  }//end of method

  // method to count firebase notifications
  countFirebaseNotification() {
    this.firebaseCount = 0;
    if (this.notificationFirebaseData.length > 0) {
      this.notificationFirebaseData.forEach((firebase, index) => {
        // console.log("firebase.msg:::::",firebase.msg);
        if (firebase.data.read_flag == 'N') {
          this.firebaseCount = this.firebaseCount + 1;
        }//check if its new notification
      });
    }
  }//end of method

  //onClickFirebaseNotification
  onClickFirebaseNotification() {
    console.log(this.notificationFirebaseData);
    let user = this.getUserFromLocalstorage();
    let userRefNo = user.refNo;
    let firebaseDbConn = GetSet.getFirebaseDbConn();
    // console.log("update firebase");
    this.notificationFirebaseData.forEach(firebase => {
      if (firebase.data.read_flag == 'N') {
        firebase.data.read_flag = 'Y';
        // this.firebaseDatabase.database.ref('notifications/'+this.userRefNo+firebase.notification_id).child("read_flag").set('Y');
        let firebaseElement = {};
        firebaseElement = firebase;
        firebaseElement['read_flag'] = 'Y';
        //firebaseDbConn.ref('notifications/' + userRefNo + '/' + firebase.notification_id).update(firebaseElement);
        // this.firebaseDatabase.database.ref('notifications/'+this.userRefNo+'/'+firebase.notification_id).(firebaseElement);
      }
    });
    this.firebaseCount = 0;

  }//end of method

  getRoles() {
    let user = this.getUserFromLocalstorage();// JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.coreService.getUserRoles(user.loginUserName).subscribe(resp => {
        if (resp.status == 2000) {
          this.userRoles = [];
          for (let role of resp.data.eAddressDetails) {
            if (role.roleName != user.roleName) {
              this.userRoles.push(role);
            }
          }
        }
      });
      // this.coreService.getAllRolesByUser({ "msUserPk": user.userId }).subscribe((resp) => {
      //   if(resp.status == 2000) {
      //     this.userRoles = [];
      //     for(let role of resp.data) {
      //       if(role.roleName != user.roleName) {
      //         this.userRoles.push(role);
      //       }
      //     }
      //     this.activateRole();
      //   }
      // });
    }
  }

  switchWithSelectedRole(role) {
    if (confirm('Are you sure you want to change the role?')) {
      let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('roleNameToDisplay', role.roleDescription);
      this.broadcastService.setAuth(false);
      //this.closeOpenedQuickAddOverlay(); //close opend quickadd overlay
      this.authService.getUserStateByRoles({ "rolePk": role.rolePk, "msUserPk": user.userId, "fcmkey": localStorage.getItem("fcmkey") }).subscribe(resp => {
        if (resp.status == 2000) {
          this.switchRole(resp.data, role);
        } else {
          this.toastService.showI18nToast('Error', 'error');
          this.activateRole();
        }
      });
      this.notificationFirebaseData = [];
      this.firebaseCount = 0;
      GetSet.setNotificationFirebaseData(null);
    } else {
      this.activateRole();
    }
  }

  activateRole() {
    let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.userRoles.forEach((item, index) => {
        item.roleCheck = (item.roleName == user.roleName) ? true : false;
      });
    }
  }


  switchRole(response, role) {
    let isServiceProvider = (role.entityName != 'DOCTOR' && role.entityName != 'INDIVIDUAL') ||
      (role.entityName == 'DOCTOR' && role.roleName == 'ASSISTANT');
    let user = this.getUserFromLocalstorage();//JSON.parse(localStorage.getItem('user'));
    user.entityName = role.entityName;
    user.roleName = role.roleName;
    //user.refNo = (isServiceProvider) ? response.serviceProviderRefNo : response.refNo;
    user.refNo = response.refNo
    user.rolePk = role.rolePk;
    user.userName = response.username;
    user.parentRoleName = role.roleName;
    user.serviceProviderRefNo = response.serviceProviderRefNo;
    user.token = response.newToken;

    // app/issues/935
    let payloadWorkflow = {
      // "isChabmerOrAddressExist": response.chabmerOrAddressExist,
      "registrationWorkflowCompleted": response.registrationWorkflowCompleted,
      "validProfile": response.validProfile,
      "registrationWorkflowSteps": response.registrationWorkflowDTOs,
      "currentStepNo": response.currentStepNo
    }

    localStorage.removeItem("regw");
    this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
    localStorage.setItem("regw", JSON.stringify(payloadWorkflow));

    localStorage.setItem("user", JSON.stringify(user));
    this.userName = response.username;
    this.broadcastService.setAuth(true);

    // Changes for app#782 - registration workflow
    let navigate: any;
    if (response.registrationWorkflowCompleted == null || response.registrationWorkflowCompleted)
      navigate = this.userStateRuleService.userNevigationRules[response.stateString];
    else
      if (isServiceProvider) {
        navigate = this.userStateRuleService.userNevigationRules[response.stateString];
      }
      else {
        navigate = response.stateString;
      }
    // End Changes for app#782

    this.entityName = user.entityName;
    this.router.navigate([navigate]);

    // if (response.stateString == 'DOC_USER_AFTER_PROFILE_VERIFICATION_AFTER_PROFILE_SAVE') {
    //   this.router.navigate(['/searchPatient']);
    //   this.entityName = user.entityName;
    // } else if (response.stateString == 'IN_USER_AFTER_PROFILE_VERIFICATION_LANDING_STRING') {
    //   this.router.navigate(['/individual/tab-personal']);
    //   this.entityName = user.entityName;
    // } else if (response.stateString == "SERVICE_PROVIDER_ENTITY_PROFILE_VERIFICATION_STATUS_FOR_DIAGNOSTICS_ADMIN") {
    //   this.router.navigate(['/opd/opdPharmacyView/diagnostics']);
    //   this.entityName = user.entityName;
    // } else if (response.stateString == "ASSISTANT_USER_AFTER_PROFILE_VERIFICATION") { // Working on app/issues/935
    //   this.router.navigate(['/searchPatient']);
    //   this.entityName = user.entityName;
    // }
    // End Working on app/issues/935
    this.closeConnFirebaseDatabase();
    if (response.refNo) {
      this.setupFirebaseNotifications(response.refNo);
    }

    //for service provider


    if (isServiceProvider) {
      this.apiService.DownloadLogo.getByPath(user.userId + "/" + user.entityName).subscribe(result => {
        if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
          this.broadcastService.setLogo("data:image/jpeg;base64," + result.data);
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
      let path: string = response.refNo + "/" + "DOCTOR";

      this.apiService.DownloadProfilePic.getByPath(path).subscribe(result => {
        if (result["status"] === 2000 && result.data != null && result.data.length > 0) {
          this.broadcastService.setLogo("data:image/jpeg;base64," + result.data);
        }
        else {
          this.broadcastService.setLogo('');
        }
      },
        error => {
          this.broadcastService.setLogo('');
        });

      this.apiService.GetDoctorDetailsByRefNo.postByQuery({ refNo: response.refNo }).subscribe(result => {
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
  }

  switchDropdown() {
    this.switchPop = true;
  }
  userMenuItem() {
    this.userMenu = true;
  }

  slideMenu() {
    document.getElementById('side-bar').classList.add('slide');
    document.getElementById('side-bar').classList.remove('slide-out');
  }

  //firebase
  setupFirebaseNotifications(refNo) {

    let firebaseDBConn = this.firebaseDatabase.database;
    GetSet.setFirebaseDbConn(firebaseDBConn);
    var _this = this;
    firebaseDBConn.ref('notifications/' + refNo).on('value', function (snapshot) {
      let snapshotobj: any = snapshot.val();
      _this.broadcastService.setFireBaseNotifications(snapshotobj);
    });
  }//

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.classList.contains('link-color-userName') || event.target.classList.contains('link-userName-image')) {
      this.switchPop = true;
    } else {
      this.switchPop = false;
    }
  }

  inAppHelp() {
    let user = this.getUserFromLocalstorage();
    this.user_rolePk = user.rolePk;
    this.authService.retrieveTopicByUserRole().subscribe((topic) => {
      if (topic.status == 2000) {
        this.roleMenu = topic.data;
        //this.subRoleMenu = [];
        this.displaySidebar = true;
        this.isCarousel = false;
      }
    });
  }

  selectedIndex = -1;

  goToSubmenu(subTopic, index) {
    this.authService.retrieveSubTopic({ 'topicPk': subTopic.topicPk }).subscribe((sub_topic) => {
      if (sub_topic.status == 2000) {
        this.selectedIndex = index;
        this.subRoleMenu = sub_topic.data;
      }
    });
  }

  goToInsideSubmenu(subHelpEl) {
    this.authService.retrieveAllSubTopicImage({ 'subtopicPk': subHelpEl.subtopicPk, 'platform': 'WEB' }).subscribe((resp) => {
      if (resp.status == 2000) {
        this.isCarousel = true;
        let i = 0;
        this.download.downloadImages = [];
        resp.data.forEach(element => {
          let query = {
            'subTopicImagePk': element.subTopicImagePk,
            "downloadFor": "SUBTOPIC_IMAGE"
          }
          this.authService.imageDownload(query).subscribe((imageResp) => {
            if (imageResp.status == 2000) {
              let downloadImage = {
                'downloadImageSrc': "data:" + ";base64," + imageResp.data.data,
                'index': i,
                'narration': element.narration,
                'subTopic': subHelpEl.subTopic,
                'sequence': element.sequenceNo
              }
              this.download.downloadImages.push(downloadImage);
              i = i + 1;

              this.download.downloadImages.sort((a, b) => a.sequence - b.sequence);
              //console.log(this.download.downloadImages);

            }
            this.onSlideClicked(this.help);
          });
        });
      }
    });
  }

  onSlideClicked(value: any) {
    //console.log( value.slides.last);

    if (document.getElementsByClassName('hide-prev').length > 0) {
      document.getElementById('help-carousal').classList.remove('hide-prev');
    }

    if (document.getElementsByClassName('hide-next').length > 0) {
      document.getElementById('help-carousal').classList.remove('hide-next');
    }

    if (value.slides.first != undefined && value.activeId == value.slides.first.id) {
      document.getElementById('help-carousal').classList.add('hide-prev');
    } else if (value.slides.last != undefined && value.activeId == value.slides.last.id) {
      document.getElementById('help-carousal').classList.add('hide-next');
    }

  }

  //quick add menu
  inQuickAdd() {
    this.quickMenu = [];
    this.selectedIndexForQuickMenu = -1;
    this.subMenuForQuickAdd = [];

    this.authService.getMenuStructureForQuickAdd(this.user_role + '?parentRoleName=' + this.user_role + '&platform=WEB').subscribe((resp) => {
      if (resp.status == 2000) {
        this.quickMenu = resp.data;
        //this.displaySidebarForQuickAdd = true;
        this.isOverlay = !this.isOverlay;
      }
    });
  } //enf of method

  selectedIndexForQuickMenu = -1;

  goToQuickAddSubMenu(subMenu, index) {
    this.selectedIndexForQuickMenu = index;
    this.router.navigate([subMenu.urlPath]);
    //this.qa.hide();
    this.isOverlay = !this.isOverlay;
    // if(this.subMenuForQuickAdd.length != 0) {
    //   this.subMenuForQuickAdd = [];
    //   this.selectedIndexForQuickMenu = -1;
    // } else {
    //   if(subMenu.subMenus.length == 0) {
    //     // this.router.navigate([subMenu.urlPath]);
    //     // this.qa.hide();
    //     // this.isOverlay = !this.isOverlay;
    //     // this.goToInsideQuickAddSubmenu(subMenu);
    //   } else {
    //     this.subMenuForQuickAdd = subMenu.subMenus;
    //   }
    // }
  }

  // goToInsideQuickAddSubmenu(subMenu) {
  //   this.router.navigate([subMenu.urlPath]);
  //   this.qa.hide();
  //   this.isOverlay = !this.isOverlay;
  // }

  inQuickAddExit() {
    this.isOverlay = !this.isOverlay;
  }

  closeOpenedQuickAddOverlay() {
    this.qa.hide(); //if quickadd overlay opend, then close it
    if (this.isOverlay) { //if overlay icon is cross then turn it to plus icon
      this.isOverlay = !this.isOverlay;
    }
  }

}//end of class
