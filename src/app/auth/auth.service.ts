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
import { Observable } from 'rxjs/Observable';
import { ApiService } from './../core/services/api.service';
import { BroadcastService } from './../core/services/broadcast.service';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpRequest,HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Api } from './../core/services/api';
import { IModel } from './../core/services/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   apiUrl = environment.apiUrl;

  constructor(private apiService: ApiService, private broadcastService: BroadcastService, private router: Router,private http: HttpClient) { }

  logout() {
    localStorage.removeItem("user");
    this.broadcastService.setAuth(false);
    this.router.navigate(['']);
    localStorage.removeItem("onlineDoc");
  }

  getToken(){
    return localStorage.getItem('user');
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }

  userSignUp(query: any): Observable<any> {
    return this.apiService.UserRegister.postByQuery(query);
  }



  landingUserSignUp(query: any, token: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': token
      })
    };

    httpOptions.headers = httpOptions.headers.set('token', token);
    return this.http.put<any>(this.apiUrl + 'v2/inusers',query,httpOptions);

  }

  landingUserSignUpDoctor(query: any, token: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': token
      })
    };

    httpOptions.headers = httpOptions.headers.set('token', token);
    return this.http.post<any>(this.apiUrl + 'v1/doctor/save-doctor-info',query,httpOptions);

  }

  userLogin(query: any): Observable<any> {
    return this.apiService.UserLogin.postByQuery(query);
  }
  // checkUsername(userName: any): Observable<any> {
  //   return this.apiService.UserProfileCheck.getByPath('email?q=' + userName);
  // }
  checkUsername(query: any): Observable<any> {
    return this.apiService.UserProfileCheck.postByQuery(query);
  }

  checkContactno(query: any): Observable<any> {
    return this.apiService.UserMobileCheck.postByQuery(query);
  }

  checkMobileNoExist(mobileNo: any): Observable<any> {
    return this.apiService.UserMobileNoAddressCheck.getByPath("contactno?q="+mobileNo);
  }

  checkEmailExist(email: any): Observable<any> {
    return this.apiService.UserEmailAddressCheck.getByPath("email?q="+email);
  }

  forgotPassword(forgotPassword: any): Observable<any> {
    return this.apiService.ForGorPassWord.postByQuery(forgotPassword);
  }

  resetPassword(forgotPassword: any): Observable<any> {
    return this.apiService.ForGorPassWord.postByQuery(forgotPassword);
  }

  resendVerifyMail(path: any): Observable<any> {
    return this.apiService.ReSendVarification.getByPath(path);
  }

  mobileVerification(mobileVerificationData: any): Observable<any> {
    return this.apiService.MobileVerify.postByQuery(mobileVerificationData);
  }

  verifyEmailLink(query): Observable<any> {
    return this.apiService.VerifyEmail.postByQuery(query);
  }

  verifyForgetPassWordLink(vrifyResetPassWord: any): Observable<any> {
    return this.apiService.VerifyResetPassWord.postByQuery(vrifyResetPassWord);
  }

  resetUserPassword(resetPassWord: any): Observable<any> {
    return this.apiService.ResetPassWord.postByQuery(resetPassWord);
  }

  getUserState(path): Observable<any> {
    return this.apiService.GetUserState.getByPath(path)
  }

  getUserStateV2(query): Observable<any> {
    return this.apiService.GetUserStateV2.postByQuery(query)
  }

  getLandingUserStateV2(query: any, token: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': token
      })
    };

    httpOptions.headers = httpOptions.headers.set('token', token);
    return this.http.post<any>(this.apiUrl + 'v2/user-state',query,httpOptions);

    //return this.apiService.GetUserStateV2.postByQuery(query)
  }

  getUserProfilePk(path): Observable<any> {
    return this.apiService.GetUserProfilePk.getByPath(path)
  }

  checkAlertState(query): Observable<any> {
    return this.apiService.checkNewAlerts.postByQuery(query)
  }

  resetForgotPasswordForMobile(query): Observable<any> {
    return this.apiService.ResetPasswordMobile.postByQuery(query)
  }

  sentOTP(query: any): Observable<any> {
    return this.apiService.ManageOTP.postByQuery(query);
  }

  verifyOTP(query: any): Observable<any> {
    return this.apiService.ManageOTP.postByQuery(query);
  }

  setPassword(query: any): Observable<any> {
    return this.apiService.SetPassword.postByQuery(query);
  }

  setPasswordLanding(query: any,token:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': token
      })
    };

    httpOptions.headers = httpOptions.headers.set('token', token);
    return this.http.post<any>(this.apiUrl + 'v1/users/changepassword',query,httpOptions);
    //return this.apiService.SetPassword.postByQuery(query);
  }

  sendVerificationCodeRequest(query: any): Observable<any> {
    return this.apiService.SendVerificationCode.postByQuery(query);
  }

  manageVerificationRequestForEmail(query: any): Observable<any> {
    return this.apiService.EmailVerificationRequestManage.postByQuery(query);
  }

  manageVerificationRequestForMobile(query: any): Observable<any> {
    return this.apiService.MobileVerificationRequestManage.postByQuery(query);
  }

  userSignUpRequest(query: any): Observable<any> {
    return this.apiService.SignupDiffRole.postByQuery(query);
  }

  getUserRoles(path): Observable<any> {
    return this.apiService.GetUserRole.getByPath(path);
  }

  acceptGroupInvitation(query: any): Observable<any> {
    return this.apiService.AcceptGroupInvitation.putByQuery(query);
  }

  peerConsultingInvitation(query): Observable<any> {
    return this.apiService.PeerConsultingValidate.postByQuery(query);
  }

  getUserStateByRoles(query): Observable<any> {
    return this.apiService.GetUserStateByRoles.postByQuery(query);
  }

  doctorReferralInvitation(query) : Observable<any> {
    return this.apiService.DoctorReferralInvitation.postByQuery(query);
  }

  //In-Application Help
  retrieveTopicByUserRole(): Observable<any> {
    return this.apiService.RetrieveTopicByUserRole.get();
  }
  retrieveSubTopic(query): Observable<any> {
    return this.apiService.RetrieveSubTopic.postByQuery(query);
  }
  retrieveAllSubTopicImage(query): Observable<any> {
    return this.apiService.RetrieveAllSubTopicImage.postByQuery(query);
  }
  imageDownload(query: any): Observable<any> {
    return this.apiService.ImageDownload.postByQuery(query);
  }
  //end of In-Application Help

  verifySetResetPasswordLink(query: any): Observable<any> {
    return this.apiService.SetResetPasswordVerificationURl.postByQuery(query);
  }

  getMenuStructureForQuickAdd(path): Observable<any> {
    return this.apiService.GetMenuStructureForQuickAdd.getByPath(path);
  }

   //Working on #1813
  userSignUpRequestV2(query: any): Observable<any> {
    return this.apiService.SignupDiffRoleV2.postByQuery(query);
  }
   //End Working on #1813
}
