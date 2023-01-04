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
import { ApiService } from './../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppoinmentService {

  constructor(private apiService: ApiService) { }

  /*getAppoinments(user_refNo: any): Observable<any>{
    return this.apiService.AppointmentsV2.getByPath(user_refNo);//Appointments
  }
  getAppoinmentsForGroupMember(userRefNo: any): Observable<any>{
    return this.apiService.AppointmentsGroupMember.getByPath(userRefNo);
  }*/

  retrieveAppointmentsOfInUsers(userType: any):Observable<any> {
    return this.apiService.RetrieveAppointmentsForInUser.postByQuery(userType);
  }


  deleteAppoinment(query: any): Observable<any> {
    return this.apiService.DeleteAppoinment.deleteByQuery(query);
  }


  getRating(): Observable<any>{
    return this.apiService.RatingParam.getByPath('DOC/IND');
  }

  getRatingv2(): Observable<any>{
    return this.apiService.RatingParam.getByPath('DOCTOR/INDIVIDUAL');
  }

  saveRating(query:any): Observable<any>{
    return this.apiService.Rating.postByQuery(query);
  }
  
  saveRatingV2(query:any): Observable<any>{
    return this.apiService.SaveRatingV2.postByQuery(query);
  }

  updateAppoinment(query: any): Observable<any> {
    return this.apiService.UpdateAppoinment.putByQuery(query);
  }

  findDoctorById(doctorId: any): Observable<any> {
    return this.apiService.FindDoctorById.getByPath(doctorId);
  }

  getAppointMentRating(path: any): Observable<any> {
    return this.apiService.Rating.getByPath(path);
  }

  getAppointMentRatingV2(query: any): Observable<any> {
    return this.apiService.RetingV2.postByQuery(query);
  }

  makeAppointment(query: any): Observable<any> {
    return this.apiService.BookAppointment.postByQuery(query);//Appointments
  }

  makeAppointmentV2(query: any): Observable<any> {
    return this.apiService.BookAppointment.postByQuery(query);//to MAke an appointment
  }

  makeAppointmentV4(query: any): Observable<any> {
    return this.apiService.BookAppointmentV4.postByQuery(query);//to MAke an appointment
  }

  getCalender(query): Observable<any> {
    return this.apiService.CalendarDoctorChambe.getByQuery(query);
  }

  getCalenderForDoctor(query): Observable<any> {
    return this.apiService.CalendarDoctorChamber.postByQuery(query);
  }
  /*getAllMinorsAppoinment(path): Observable<any> {
    return this.apiService.MinorUserViewAppoinment.getByPath(path);
  }*/

  fetchAllProblemNarration(path): Observable<any> {
    return this.apiService.fetchAllProblemNarration.getByPath(path);
  }

  checkOnlineSessionStatusByAppointmentRef(query): Observable<any> { 
    return this.apiService.CheckOnlineSessionStatusByAppointmentRef.postByQuery(query);
  }

  getDoctorsV5(query): Observable<any> {
    return this.apiService.DoctorSearchV5.getByQuery(query);
  }

}
