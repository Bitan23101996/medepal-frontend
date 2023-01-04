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
export class SearchService {
  constructor(private apiService: ApiService) { }

  getDoctors(query): Observable<any> {
    return this.apiService.DoctorSearch.getByQuery(query);
  }

  getDoctorsV5(query): Observable<any> {
    return this.apiService.DoctorSearchV5.getByQuery(query);
  }

  getCalender(query): Observable<any> {
    return this.apiService.CalendarDoctorChambe.getByQuery(query);
  }

  getCalenderForDoctor(query): Observable<any> {
    return this.apiService.CalendarDoctorChamber.postByQuery(query);
  }

  getQualification(): Observable<any> {
    return this.apiService.DoctorQualification.get();
  }

  getSpecialization(): Observable<any> {
    return this.apiService.DoctorSpecialization.get();
  }

  searchUser(query): Observable<any> {
    return this.apiService.SearchUser.getByQuery(query);
  }

  makeAppointment(query: any): Observable<any> {
    return this.apiService.BookAppointment.postByQuery(query);//Appointments
  }

  getUserReviews(drId, pageNo): Observable<any> {
    return this.apiService.UserReviews.getByPath('DOCTOR/'+drId+'/'+pageNo);
  }

  getDoctorRating(path: any): Observable<any> {
    return this.apiService.Rating.getByPath(path);
  }

  saveRating(query:any): Observable<any>{
    return this.apiService.Rating.postByQuery(query);
  }
  
  getRating(): Observable<any>{
    return this.apiService.RatingParam.getByPath('DOC/IND');
  }

  getRatingv2(): Observable<any>{
    return this.apiService.RatingParam.getByPath('DOCTOR/INDIVIDUAL');
  }

  viewRating(path: any): Observable<any>{
    return this.apiService.ViewRating.getByPath(path);
  }

  viewRatingV2(query: any): Observable<any>{
    return this.apiService.ViewRatingV2.postByQuery(query);
  }

  downloadProfilePhoto(path:any): Observable<any> {
    // return this.apiService.DownloadProfiePhoto.getByPath(userId);
    return this.apiService.DownloadProfilePic.getByPath(path);
  }
  
  downloadProfilePhotoForDoctor(path): Observable<any> {
    return this.apiService.DownloadProfilePic.getByPath(path);
  }
  //to fetch city list for doctor search
  fetchCityListForDoctorSearch(): Observable<any> {
    return this.apiService.FetchCityListForDoctorSearch.get();
  }

  //method to get additional chambers
  getAdditionalChambers(path, query): Observable<any> {
    return this.apiService.GetAdditionalDoctorChamberList.postByPathQuery(path,{'drRefNo':query});
  }

  getDocResume(path): Observable<any> {
    return this.apiService.GetDocResume.getByPath(path);
  }

  getOnlineDoctors(): Observable<any> {
    return this.apiService.GetOnlineDoctors.get();
  }
}

