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
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private authService = new Subject<any>();
  private editedMember = new Subject<any>();
  private profileImage = new Subject<any>();
  private profileModified = new Subject<any>();
  private headerText=new Subject<any>();
  private login=new Subject<any>();
  private headerOrderItem=new Subject<any>();
  private serviceProviderName = new Subject<any>();
  private logo = new Subject<any>();
  private user = new Subject<any>();
  private firebaseNotifications = new Subject<any>();
  /* Working on app/issues/782 */
  private registrationWorkflow = new Subject<any>();
  /*End Working on app/issues/782 */

  /* Working on app/issues/1499 */
  private billingPatientName = new Subject<any>();
  private billingBedNo = new Subject<any>();
  private billingRoomNo = new Subject<any>();
  private billingAdmissionComments = new Subject<any>();
  /*End Working on app/issues/1499 */

  private selectedHospitalSource = new Subject<string>();  
  private childSpRefNo = new Subject<any>();
  private videoConsulting = new Subject<any>();
  hospitalDetails$ = this.selectedHospitalSource.asObservable();

  constructor() { }

  setAuth(isAuthenticated: boolean) {
    this.authService.next(isAuthenticated);
  }
  getAuth(): Observable<any> {
    return this.authService.asObservable();
  }
 
  setMemberData(obj: any) {
    this.editedMember.next(obj);
    
  }
  getMemberData(): Observable<any> {
    return this.editedMember.asObservable();
  }

  setProfileImage(obj: any) {
    this.profileImage.next(obj);
    
  }
  getProfileImage(): Observable<any> {
    return this.profileImage.asObservable();
  }

  setHeaderText(obj: any){
    this.headerText.next(obj);
  }
  getHeaderText():Observable<any> {
    return this.headerText.asObservable();
  }
  getProfileModifiedObservable():Observable<any>{
    return this.profileModified.asObservable();
  }

  setProfileModificationData(obj:any):void{
    this.profileModified.next(obj);
  }

  setLogin(obj: any={}){
    this.login.next(obj);
  }
  getLogin():Observable<any> {
    return this.login.asObservable();
  }

  setHeaderOrderItem(obj: any={}){
    this.headerOrderItem.next(obj);
  }
  getHeaderOrderItem():Observable<any> {
    return this.headerOrderItem.asObservable();
  }
  setUserData(obj: any){
    this.user.next(obj);
  }
  getUserData():Observable<any> {
    return this.user.asObservable();
  }
  setServiceProviderName(obj: any){
    this.serviceProviderName.next(obj);
  }
  getServiceProviderName():Observable<any> {
    return this.serviceProviderName.asObservable();
  }

  setLogo(obj: any) {
    this.logo.next(obj);   
  }
  getLogo(): Observable<any> {
    return this.logo.asObservable();
  }
  setFireBaseNotifications(obj: any) {
    this.firebaseNotifications.next(obj);   
  }
  getFireBaseNotifications(): Observable<any> {
    return this.firebaseNotifications.asObservable();
  }
  /* Working on app/issues/782 */
  setRegistrationWorkflow(obj: any) {
    this.registrationWorkflow.next(obj);   
  }
  getRegistrationWorkflow(): Observable<any> {
    return this.registrationWorkflow.asObservable();
  }
  /*End Working on app/issues/782 */

   /* Working on app/issues/1499 */
  setBillingPatientName(obj: any) {
    this.billingPatientName.next(obj);   
  }
  getBillingPatientName(): Observable<any> {
    return this.billingPatientName.asObservable();
  }
  
  setBillingBedNo(obj: any) {
    this.billingBedNo.next(obj);   
  }
  getBillingBedNo(): Observable<any> {
    return this.billingBedNo.asObservable();
  }
  
  setBillingRoomNo(obj: any) {
    this.billingRoomNo.next(obj);   
  }
  getBillingRoomNo(): Observable<any> {
    return this.billingRoomNo.asObservable();
  }
  
  setBillingAdmissionComments(obj: any) {
    this.billingAdmissionComments.next(obj);   
  }
  getBillingAdmissionComments(): Observable<any> {
    return this.billingAdmissionComments.asObservable();
  }
   /*End Working on app/issues/1499 */

  setHospitalDetails(obj: any) {
    this.selectedHospitalSource.next(obj);
  }

  getHospitalDetails(): Observable<any> {
    return this.selectedHospitalSource.asObservable();
  }

  setVideoConsulting(obj: any) {
    this.videoConsulting.next(obj);
  }

  getVideoConsulting(): Observable<any> {
    return this.videoConsulting.asObservable();
  }

  

  setChildSpRefNo(obj: any) {
    this.childSpRefNo.next(obj);   
  }

  getChildSpRefNo(): Observable<any> {
    return this.childSpRefNo.asObservable();
  }
}
