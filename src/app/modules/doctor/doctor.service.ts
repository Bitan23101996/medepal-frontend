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
import { initServicesIfNeeded } from '@angular/core/src/view';

import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DoctorService {
  private editedMember: BehaviorSubject<any> = new BehaviorSubject(null);
  public memberData = this.editedMember.asObservable();

  constructor(private apiService: ApiService, private http: HttpClient) { }

  saveDoctor(query: any): Observable<any> {
    return this.apiService.SaveDoctor.postByQuery(query);
  }

  saveDoctoruploadProfilePhoto(formData: any, token: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'v1/doctor/save-doctor-info/saveDoctorWithProfileImage', formData, {
      reportProgress: true,
      responseType: 'text'
    });
    let header = new HttpHeaders();
    header = header.append('content-type', 'multipart/form-data');
    header.set('token', token);
    req = req.clone({ headers: req.headers.set('token', token) });
    return this.http.request(req);
    //return this.apiService.UploadProfiePhoto.upload(formData);
  }

  saveDoctorAddress(query: any): Observable<any> {
    return this.apiService.SaveDoctorAddress.postByQuery(query);
  }

  GetAddressType(): Observable<any> {
    return this.apiService.GetAddressType.get();
  }

  GetCountry(): Observable<any> {
    return this.apiService.GetCountry.get();
  }
 
  GetEmail(path): Observable<any> {
    return this.apiService.GetEmail.getByPath(path);
  }

  GetPh(path): Observable<any> {
    return this.apiService.GetPh.getByPath(path);
  }

  GetStates(path): Observable<any> {
    return this.apiService.GetStates.getByPath(path);
  }

  GetQualificationList(): Observable<any> {
    return this.apiService.GetQualificationList.get();
  }

  GetSpecializationList(): Observable<any> {
    return this.apiService.GetSpecializationList.get();
  }

  GetOPDCategory(): Observable<any> {
    return this.apiService.GetOPDCategory.get();
  }

  GetOPDType(): Observable<any> {
    return this.apiService.GetOPDType.get();
  }

  GetHospitalListByCategory(path): Observable<any> {
    return this.apiService.GetHospitalListByCategory.getByPath(path);
  }

  GetHospitalByName(path): Observable<any> {
    return this.apiService.GetHospitalByName.getByPath(path);
  }

  ValidateChamberTimingList(query: any): Observable<any> {
    return this.apiService.ValidateChamberTimingList.postByQuery(query);
  }

  SaveChamberDetails(query: any): Observable<any> {
    return this.apiService.SaveChamberDetails.postByQuery(query);
  }
  saveDoctorChamber(query):Observable<any>{
    return this.apiService.SaveDoctorChamber.postByQuery(query);
  }
  FindPatient(searchStr): Observable<any> {
    return this.apiService.FindPatient.getBySearchString(searchStr);
  }

  GetAppStatus(path): Observable<any> {
    return this.apiService.GetAppStatus.getByPath(path);
  }

  getRangedAppointments(query: any): Observable<any> {
    return this.apiService.GetRangedAppointments.postByQuery(query);
  }

  getDoctorAppointments(doctorPk, msUserPk): Observable<any> {
    return this.apiService.GetDoctorAppointments.getByPath(doctorPk + "/" + msUserPk);
  }

  searchPaitientByDoctor(query: any): Observable<any> {
    return this.apiService.SearchPaitientByDoctor.postByQuery(query);
  }


  cancelDoctorAppointment(path): Observable<any> {
    return this.apiService.CancelDoctorAppointment.getByPath(path);
  }

  confirmAllAppointment(path): Observable<any> {
    return this.apiService.ConfirmAllAppointment.getByPath(path);
  }

  saveDoctorAppointment(query: any): Observable<any> {
    return this.apiService.SaveDoctorAppointment.postByQuery(query);
  }

  checkOverlappingDoctorAppointment(query: any): Observable<any> {
    return this.apiService.CheckOverlappingDoctorAppointment.postByQuery(query);
  }

  getUserByName(path): Observable<any> {
    return this.apiService.GetUserByName.getByPath(path);
  }

  GetAllModelAttributeValuesForMedication(): Observable<any> {
    return this.apiService.AllModelAttributeValuesForMedication.get();
  }

  savePrescription(query: any): Observable<any> {
    return this.apiService.SavePrescription.postByQuery(query);
  }

  getMedicalAttributeList(query: any): Observable<any> {
    return this.apiService.GetMedicalAttributeLongName.getByPath(query);
  }

  getInfoAndMedicalHistoryForUser(userPk: any): Observable<any> {
    return this.apiService.GetInfoAndMedicalHistoryForUser.getByPath(userPk);
  }

  fetchQualification(qualificationPk: any): Observable<any> {
    return this.apiService.FetchQualification.getByPath(qualificationPk);
  }

  fetchSpecialization(specializationPk: any): Observable<any> {
    return this.apiService.FetchSpecialization.getByPath(specializationPk);
  }


  getDoctorAppointmentForMyChamber(query: any): Observable<any> {
    return this.apiService.GetDoctorAppointmentForMyChamberv2.postByQuery(query);
  }

  getDoctorProfileByMsUserPk(msUserPk: any): Observable<any> {
    return this.apiService.GetDoctorProfileByMsUserPk.getByPath(msUserPk);
  }

  saveDoctorHoliday(query: any): Observable<any> {
    return this.apiService.SaveDoctorHoliday.postByQuery(query);
  }

  getIndividualUserData(mobile: any): Observable<any> {
    return this.apiService.GetIndividualUserData.getByPath(mobile);
  }

  fetchDoctorByOpd(doctorPk: any, miscUserPk: any): Observable<any> {
    let query = doctorPk + '/' + miscUserPk;
    return this.apiService.FetchDoctorByOpd.getByPath(query);
  }
  checkIfAvgVisitDurGrtStartEndTime(avgVisitDur, startTime, endTime) {

    let startTimeTmp = startTime.replace(/:/g, '');
    startTimeTmp = startTimeTmp.substring(0, 4);
    let endTimeTemp = endTime.replace(/:/g, '');
    endTimeTemp = endTimeTemp.substring(0, 4);
    let hourStartTime = startTimeTmp.substring(0, 2);
    let minuteStartTime = startTimeTmp.substring(2, 4);
    let totalMinuteStartTime = parseInt(hourStartTime) * 60 + parseInt(minuteStartTime);

    let hourEndTime = endTimeTemp.substring(0, 2);
    let minuteEndTime = endTimeTemp.substring(2, 4);
    let totalMinuteEndTime = parseInt(hourEndTime) * 60 + parseInt(minuteEndTime);
    let timeDiff = totalMinuteEndTime - totalMinuteStartTime;
    if (timeDiff < (parseInt(avgVisitDur))) {
      return true;
    }
    else {
      return false;
    }
  }

  checkIfAvgVisitDurGrtStartEndTimeNGB(avgVisitDur, startTime, endTime) {
    let onlyStartHour = startTime.substring(0, startTime.indexOf(":"));
    let onlyEndHour = endTime.substring(0, endTime.indexOf(":"));


    let onlyMinStart = startTime.substring(0, startTime.lastIndexOf(":"));


    onlyMinStart = onlyMinStart.substring(onlyMinStart.indexOf(":") + 1);
    
    let onlyMinEnd = endTime.substring(0, endTime.lastIndexOf(":"));
    onlyMinEnd = onlyMinEnd.substring(onlyMinEnd.indexOf(":") + 1);


    let totalHour = onlyStartHour - onlyEndHour;
    if(totalHour < 0 ){
      totalHour = totalHour*-1;
    }
    let totalHourtoMin = totalHour*60;


    let totalMin = onlyMinStart - onlyMinEnd;

    if(totalMin < 0 ){
      totalMin = totalMin*-1;
    }

    let totalStay = totalHourtoMin + totalMin;



    if (totalStay < (parseInt(avgVisitDur))) {
      return true;
    }
    else {
      return false;
    }
  }

  getPastPrescriptionApi(userPk: any, doctorPk: any, appointmentPk: any): Observable<any> {
    let path = doctorPk + '/' + userPk + '/' + appointmentPk;
    return this.apiService.GetPastPrescription.getByPath(path);
  }
  getUserPkByRefno(refno: any): Observable<any> {
    return this.apiService.GetUserPkByRefno.getByPath(refno);
  }
  GetprescriptionByAppoRef(query: any): Observable<any> {
    return this.apiService.GetPrescriptionByAppoRef.getByPath(query);
  }
  GetprescriptionByAppoRefV2(query: any): Observable<any> {
    return this.apiService.GetPrescriptionByAppoRefV2.postByQuery(query);
  }

  getChamberTimingForDoctor(path): Observable<any> {
    return this.apiService.GetChamberTimingForDoctor.getByPath(path);
  }

  getAverageVisitDurationForDoctor(path): Observable<any> {
    return this.apiService.GetAverageVisitDurationForDoctor.getByPath(path);
  }
  getChamberPkForDoctorMiscUser(path): Observable<any> {
    return this.apiService.GetChamberPkForDoctorMiscUser.getByPath(path);
  }

  getMedicineList(path): Observable<any> {
    return this.apiService.GetMedicineList.postByQuery(path);
  }
  getMasterDataGender(query: any): Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }

  saveCreatePrescriptionByDoctor(query: any): Observable<any> {
    return this.apiService.SaveCreatePrescriptionByDoctor.postByQuery(query);
  }
  checkUniqueHospitalForDoctor(doctorPk: any, hospitalPk: any): Observable<any> {
    let path = doctorPk + '/' + hospitalPk;
    return this.apiService.CheckUniqueHospitalForDoctor.getByPath(path);
  }
  autoSavePrescription(query: any): Observable<any> {
    return this.apiService.AutoSavePrescription.postByQuery(query);
  }
  getPrescriptionByAppoRefNo(path): Observable<any> {
    return this.apiService.GetPrescriptionByAppoRefNo.getByPath(path);
  }
  getPrescriptionByAppoRefNoV2(query): Observable<any> {
    return this.apiService.GetPrescriptionByAppoRefV2.postByQuery(query);
  }
  getVitalData(): Observable<any> {
    return this.apiService.GetVitalData.get();
  }
  checkOverBookingExcceeded(query: any): Observable<any> {
    return this.apiService.CheckOverBookingExcceeded.postByQuery(query);
  }
  appointmentExitsForPatient(user_pk: any, chamberPk: any): Observable<any> {
    let query = user_pk + '/' + chamberPk;
    return this.apiService.AppointmentExitsForPatient.getByPath(query);
  }
  checkAppointmentExistsForUserInSelectedTimeRange(query: any): Observable<any> {
    return this.apiService.CheckAppointmentExistsForUserInSelectedTimeRange.postByQuery(query);
  }
  getLabTestList(path): Observable<any> {
    return this.apiService.GetLabTestList.getByPath(path);
  }

  //get medical details for user
  getUserVitalMedicalAttributes(userId: any): Observable<any> {
    return this.apiService.LoadALLMedicalRecords.getByPath(userId);
  }

  saveDoctorNote(query: any): Observable<any> {
    return this.apiService.SaveDoctorNote.postByQuery(query);
  }

  doctorNameList(): Observable<any> {
    return this.apiService.DoctorNameList.get();
  }
  hospitalNameList(): Observable<any> {
    return this.apiService.HospitalNameList.get();
  }
  getAllPastNote(doctorPk: any, userPk: any): Observable<any> {
    return this.apiService.GetAllPastNote.getByPath(doctorPk + '/' + userPk);
  }

  getDoctorDetailsByRefNo(query: any): Observable<any> {
    return this.apiService.GetDoctorDetailsByRefNo.postByQuery(query);
  }
  getChamberDetailsByRefNo(query: any): Observable<any> {
    return this.apiService.GetChamberDetailsByRefNo.postByQuery(query);
  }
  getPatientDetailsByRefNo(query: any): Observable<any> {
    return this.apiService.GetPatientDetailsByRefNo.postByQuery(query);
  }

  getAllChamberByDoctorRefNo(query: any): Observable<any> {
    return this.apiService.FetchAllChamberByDoctorRefNo.postByQuery(query);
  }
  fetchHolidayList(query: any): Observable<any> {
    return this.apiService.FetchHolidayList.postByQuery(query);
  }
  updateDoctorHoliday(query: any): Observable<any> {
    return this.apiService.UpdateDoctorHoliday.postByQuery(query);
  }

  cancelDoctorAppointmentV2(query): Observable<any> {
    return this.apiService.CancelDoctorAppointmentV2.postByQuery(query);
  }

  confirmAllAppointmentv2(path): Observable<any> {
    return this.apiService.ConfirmAllAppointmentV2.postByQuery(path);
  }

  pendingAppointmentNumber(query): Observable<any> {
    return this.apiService.PendingAppointmentNumberv2.postByQuery(query);
  }

  fetchUserDtls(query): Observable<any> {
    return this.apiService.FetchUserDtls_v2.postByQuery(query);
  }


  getAllChambersv2(query): Observable<any> {
    return this.apiService.GetAllChambersv2.postByQuery(query);
  }

  fetchChamberDtls(query): Observable<any> {
    return this.apiService.FetchChamberDtls_V2.postByQuery(query);
  }

  deleteChamberListAndApointmentForMyChamber(query): Observable<any> {
    return this.apiService.DeleteChamberListAndApointmentForMyChamberV2.postByQuery(query);
  }
  getDoctorChamberv2(query): Observable<any> {
    return this.apiService.GetDoctorChamber_v2.postByQuery(query);
  }
  getDoctorChamberv3(query): Observable<any> {
    return this.apiService.GetDoctorChamber_v3.postByQuery(query);
  }

  fetchDoctorByOpdv2(query): Observable<any> {
    return this.apiService.FetchDoctorByOpdv2.postByQuery(query);
  }

  getAddressesForDoctor(query): Observable<any> {
    return this.apiService.GetAddressesForDoctor.postByQuery(query);
  }
  
  getDoctorName(query): Observable<any> {
    return this.apiService.GetDoctorNameV2.postByQuery(query);
  }

  checkUniqueHospitalForDoctorV2(query): Observable<any> {
    return this.apiService.CheckUniqueHospitalForDoctorV2.postByQuery(query);
  }

  getPastPrescriptionApiV2(path: any): Observable<any> {
    return this.apiService.GetPastPrescriptionV2.postByQuery(path);
  }
  getAllPastNoteV2(query: any): Observable<any> {
    return this.apiService.GetAllPastNote2.postByQuery(query);
  }
  //Replacing getDoctorAppointments()
  getDoctorAppointmentsV2(query: any): Observable<any> {
    return this.apiService.GetDoctorAppointmentsV2.postByQuery(query);
  }
  //It will replace GET_CHAMBER_TIMING_OPD, GET_AVERAGE_VISIT_DURATION_OPD and GET_CHAMBER_PK_OPD
  getChamberDetailsByOPD(query: any): Observable<any> {
    return this.apiService.GetChamberDetailsByOPD.postByQuery(query);
  }
  getDosageDurationList(): Observable<any> {
    return this.apiService.GetDosageDurationList.get();
  }
  getDurationUnitList(): Observable<any> {
    return this.apiService.GetDurationUnitList.get();
  }
  deleteChamber(query: any): Observable<any> {
    return this.apiService.DeleteChamber.postByQuery(query);
  }
  manageAppoinment(query: any): Observable<any> {
    return this.apiService.ManageAppoinment.postByQuery(query);
  }

    // app#1479
  /* cancelMultipleAppointments(query: any): Observable<any> {
    return this.apiService.CancelMultipleAppointments.postByQuery(query);
  } */
  
  // app#1479
  cancelMultipleAppointmentsV2(query: any): Observable<any> {
    return this.apiService.CancelMultipleAppointmentsV2.postByQuery(query);
  }
  searchAndCancelAppointmentV2(query: any): Observable<any> {
    return this.apiService.SearchAndCancelAppointmentV2.postByQuery(query);
  }
  getAllChamberListv2(query: any): Observable<any> {
    return this.apiService.GetAllChamberListv2.postByQuery(query);
  }
  validateChamberTimingList2(query: any): Observable<any> {
    return this.apiService.ValidateChamberTimingList2.postByQuery(query);
  }
  checkOverlappingDoctorAppointmentV2(query: any): Observable<any> {
    return this.apiService.CheckOverlappingDoctorAppointmentV2.postByQuery(query);
  }
  checkAppointmentExistsForUserInSelectedTimeRangeV2(query: any): Observable<any> {
    return this.apiService.CheckAppointmentExistsForUserInSelectedTimeRangeV2.postByQuery(query);
  }
  checkOverBookingExcceededV2(query: any): Observable<any> {
    return this.apiService.CheckOverBookingExcceededV2.postByQuery(query);
  }
  saveCreatePrescriptionByDoctorV2(query: any): Observable<any> {
    return this.apiService.SaveCreatePrescriptionByDoctorV2.postByQuery(query);
  }
  saveCreatePrescriptionByDoctorV3(query: any): Observable<any> {
    return this.apiService.SaveCreatePrescriptionByDoctorV3.postByQuery(query);
  }
  getRangedAppointmentsV2(query: any): Observable<any> {
    return this.apiService.GetRangedAppointmentsV2.postByQuery(query);
  }
  getHospitalListByCategoryV2(category: any, searchText: any): Observable<any> {
    let path = category + '/' + searchText;
    return this.apiService.GetHospitalListByCategoryV2.getByPath(path);
  }

  getHospitalListBySearchText(searchText: any ): Observable<any> {//it will fetch the list where hospital name like searchtext n sp_type= 'HOSPITAL'
    return this.apiService.GetHospitalListBySearchText.getByPath(searchText);
  }

  setFeedback(query: any): Observable<any> {
    return this.apiService.SetFeedback.postByQuery(query);
  }
  getFeedback(query: any): Observable<any> {
    return this.apiService.GetFeedback.postByQuery(query);
  }

  feedbackDownloadFile(query: any): Observable<any> {
    return this.apiService.FeedbackDownloadFile.postByQuery(query);
  }
  getAllNonVerifiedDoctor(): Observable<any> {
    return this.apiService.GetAllNonVerifiedDoctor.get();
  }
  filterAllNonVerifiedDoctor(query: any): Observable<any> {
    return this.apiService.FilterAllNonVerifiedDoctor.postByQuery(query);
  }
  getRegistrationApprovalStatusList(): Observable<any> {
    return this.apiService.GetRegistrationApprovalStatusList.get();
  }
  getDoctorListForVerification(searchStr) :Observable<any>{
    return this.apiService.GetDoctorListForVerification.getBySearchString(searchStr);;
  }
  saveDoctorRegistrationVerificationHistory(query: any): Observable<any> {
    return this.apiService.SaveDoctorRegistrationVerificationHistory.postByQuery(query);
  }
  getDoctorRegistrationVerificationHistory(query: any): Observable<any> {
    return this.apiService.GetDoctorRegistrationVerificationHistory.postByQuery(query);
  }
  // Changed below 2 services - issue app#647
  getFrequentPrescribedTestList(query: any): Observable<any> {
    return this.apiService.GetFrequentPrescribedTestList.postByQuery(query);
  }
  getFrequentPrescribedMedicineList(query: any): Observable<any> {
    return this.apiService.GetFrequentPrescribedMedicineList.postByQuery(query);
  }
  getPastPrescriptionApiV3(path: any): Observable<any> {
    return this.apiService.GetPastPrescriptionV3.postByQuery(path);
  }
  //sbis-poc/app/issues/862
  getPastPrescriptionApiV4(path: any): Observable<any> {
    return this.apiService.GetPastPrescriptionV4.postByQuery(path);
  }
  getRecentMedicationByUserRefNo(path: any): Observable<any> {
    return this.apiService.GetRecentMedicationByUserRefNo.postByQuery(path);
  }
  getRepeatMedication(path): Observable<any> {
		return this.apiService.GetRepeatMedication.postByQuery(path);
  }
  //working on app#1936
  getRepeatMedicationV2(path): Observable<any> {
		return this.apiService.GetRepeatMedicationV2.postByQuery(path);
  }
  //end working on app#1936
  // Added for issue app#597
  findCountryStateCityByPin(query: any): Observable<any> {
    return this.apiService.FindCountryStateCityByPin.postByQuery(query);
  }

  //Working on app/issues/595
  getHomeVisitDetailsByDoctorRefNo(query: any): Observable<any> {
    return this.apiService.GetHomeVisitDetailsByDoctorRefNo.postByQuery(query);
  }
  discontinueHomeVisit(query: any): Observable<any> {
    return this.apiService.DiscontinueHomeVisit.postByQuery(query);
  }
  pendingHomeVisitCount(query: any): Observable<any> {
    return this.apiService.PendingHomeVisitCount.postByQuery(query);
  }
  getHomeVisitableDoctor(query: any): Observable<any> {
    return this.apiService.GetHomeVisitableDoctor.postByQuery(query);
  }
  //End Working on app/issues/595

  //Working on app/issues/591
  getSubstituteMedicineList(query: any): Observable<any> {
    return this.apiService.GetSubstituteMedicineList.getByPath(query);
  }
  //End Working on app/issues/591
  getAssociateUserByEaddress(path: any): Observable<any> {
    return this.apiService.GetAssociateUserByEaddress.getByPath(path);
  }
  makeAppointmentV4(query: any): Observable<any> {
    return this.apiService.BookAppointmentV4.postByQuery(query);//to MAke an appointment
  }

  //group masterData Image Ref number list get
  getMasterMedicalImageGroupMap(): Observable<any>{
    return this.apiService.MasterMedicalImageGroupMap.get();
  }

  downloadDocument(query: any): Observable<any> {
      return this.apiService.DownloadDocument.postByQuery(query);  
  }

  retrieveDrRecentImages(query: any):  Observable<any> {
    return this.apiService.RetrieveDrRecentImages.postByQuery(query);  
  }

  postDrRecentImages(query: any):  Observable<any> {
    return this.apiService.PostDrRecentImages.postByQuery(query);  
  }

  //Working on app/issues/688
  getOnlineConsultancyDetailsByDoctorRefNo(query: any): Observable<any> {
    return this.apiService.GetOnlineConsultancyDetailsByDoctorRefNo.postByQuery(query);
  }
  discontinueOnlineConsultancy(query: any): Observable<any> {
    return this.apiService.DiscontinueOnlineConsultancy.postByQuery(query);
  }
  getOnlineConsultancyProvidedDoctor(query: any): Observable<any> {
    return this.apiService.GetOnlineConsultancyProvidedDoctor.postByQuery(query);
  }
  //End Working on app/issues/688
  
  //Working on app/issues/720
  getInvestigationTypeAheadList(path) : Observable<any> {
    return this.apiService.GetInvestigationTypeAheadList.getByPath(path);
  }
  //End Working on app/issues/720

  getMedicaleAttrPKBySystemCode(path) : Observable<any> {
    return this.apiService.GetMedicaleAttrPKBySystemCode.getByPath(path);
  }


  //Working on app/issues/747
  getDiagnosisTypeAheadList(path) : Observable<any> {
    return this.apiService.GetDiagnosisInfoByName.getByPath(path);
  }
  //End Working on app/issues/747

  doctorReferralSave(query) : Observable<any> {
    return this.apiService.DoctorReferralSave.postByQuery(query);
  }
  retrieveDoctorReferral(path) : Observable<any> {
    return this.apiService.RetrieveDoctorReferral.getByPath(path);
  }
  checkDoctorUser(query) : Observable<any> {
    return this.apiService.CheckDoctorUser.postByQuery(query);
  }
  resendDoctorReferralMail(query) : Observable<any> {
    return this.apiService.ResendDoctorReferralMail.postByQuery(query);
  }
  





  //working on issue number 765
  saveAndUpdateProcedureNotes(query): Observable<any> {
    return this.apiService.SaveAndUpdateProcedureNotes.postByQuery(query);
  }
  getProcedureNotes(path): Observable<any> {
    return this.apiService.GetProcedureNotes.getByPath(path);
  }

  //to get Assistant values 
  getAssistantsValues(query): Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }

  getAllUsersProcedureInfoByDoctorRefNo(query): Observable<any> {
    return this.apiService.GetAllUsersProcedureInfoByDocRefNo.postByQuery(query);
  }

    // app/issues/843
    getPrescriptionTemplateById(query):Observable<any>{
      return this.apiService.GetAllUsersPrescriptionTemplateByRefNo.postByQuery(query);
    }
    savePrescriptionTemplate(query):Observable<any>{
      return this.apiService.SavePrescriptionTemplate.postByQuery(query);
    }
    getPrescriptionTemplatesByRefNo(query):Observable<any>{    
      return this.apiService.GetAllPrescriptionTemplatesForHospitalByRefNo.postByQuery(query);
    }
    // End app/issues/843  

    //Working on app/issues/937
    getVaccinationListByUserRefNo(query):Observable<any>{
        return this.apiService.GetVaccinationListByUserRefNo.postByQuery(query);
    }
  //End Working on app/issues/937

    // app/issues/1014
    getFrequentDiagnosisList(): Observable<any> {
      return this.apiService.GetFrequentDiagnosisList.get();
    }

    getMasterDataFees(query): Observable<any> {
      return this.apiService.MasterData.getByQuery(query);
    }

    // app/issues/1185
    getInvoiceListByAppointment(query):Observable<any>{
        return this.apiService.GetInvoiceListByAppointment.postByQuery(query);
    }
    saveInvoiceForAppointment(query):Observable<any>{
      return this.apiService.SaveInvoiceForAppointment.postByQuery(query);
    }
    deleteInvoiceForAppointment(query):Observable<any>{
      return this.apiService.DeleteInvoiceForAppointment.postByQuery(query);
    }
    getChargeListByChamber(query):Observable<any>{
      return this.apiService.GetChargeListByChamber.postByQuery(query);
    }
    // End app/issues/1185

    // app/issues/1058
    FindPatientV3(searchStr): Observable<any> {
      return this.apiService.FindPatientV3.getBySearchString(searchStr);
    }
    findUserDetailsByAppointment(query):Observable<any>{
      return this.apiService.FindUserDetailsByAppointment.postByQuery(query);
    }
    //End app/issues/1058

    // app/issues/915
    confirmPendingAppointments(query): Observable<any> {
        return this.apiService.ConfirmPendingDoctorAppointments.postByQuery(query);
    }
    // End app/issues/915

    // Working on app/issues/1267
    createBlankPrescription(query): Observable<any> {
      return this.apiService.CreateBlankPrescription.postByQuery(query);
    }
    //End Working on app/issues/1267

  // Working on app/issues/1281
    getDoctorAppointmentsV3(query: any): Observable<any> {
      return this.apiService.GetDoctorAppointmentsV3.postByQuery(query);
    }
    getAppointmentsViewByRefNo(query: any): Observable<any> {
      return this.apiService.GetAppointmentsViewByRefNo.postByQuery(query);
    }
  //End Working on app/issues/1281

  // Working on app/issues/1323
  savePrescriptionV2(query: any): Observable<any> {
    return this.apiService.SavePrescriptionV2.postByQuery(query);
  }
  //End Working on app/issues/1323

  // app/issues/988
  savePrescriptionV3(query: any): Observable<any> {
    return this.apiService.SavePrescriptionV3.postByQuery(query);
  }

  // Working on app/issues/937
  getAllVaccineByName(path): Observable<any> {
    return this.apiService.GetAllVaccineByName.getByPath(path);
  }
  //End Working on app/issues/937

  //Working on app/issues/1424
  getPaymentModeList(): Observable<any> {
    return this.apiService.GetPaymentModeList.get();
  }
  //End Working on app/issues/1424

  fetchInpatientList(): Observable<any> {
    return this.apiService.FetchInpatientList.get();
 }
//Working on app/issues/1548
    GetPaymentModeCategory(): Observable<any> {
      return this.apiService.GetPaymentModeCategory.get();
  
    }
// //End Working on app/issues/1548

 //Working on app/issues/1615
 getOnlineConsultationDetailsByDoctorRefNo(query: any): Observable<any> {
  return this.apiService.GetOnlineConsultationDetailsByDoctorRefNo.postByQuery(query); 
 }
//End Working on app/issues/1615

  //https://gitlab.com/sbis-poc/app/issues/1716
  resetDoctorSignatureHeaderFooterImage(query:any): Observable<any> {
    return this.apiService.ResetDoctorSignatureImage.postByQuery(query);
  }
  //end https://gitlab.com/sbis-poc/app/issues/1716
  getProcedureNoteByRefNo(query: any): Observable<any> {
    return this.apiService.GetProcedureNoteByRefNo.postByQuery(query);
  }

  getFrequentFindingList(): Observable<any> {
    return this.apiService.GetFrequentFindingList.get();
  }
  getFrequentSymptomList(): Observable<any> {
    return this.apiService.GetFrequentSymptomList.get();
  }

  //Working on app/issues/1623
  getDoctorHolidayListByHospitalRefNo(query: any): Observable<any> {
    return this.apiService.GetDoctorHolidayListByHospitalRefNo.postByQuery(query); 
   }
  //End Working on app/issues/1623

  //Working on app/issues/1615
  getOrGenerateSessionAndTokenForVideoChat(query: any): Observable<any> {
    return this.apiService.GetOrGenerateSessionAndTokenForVideoChat.postByQuery(query);
  }

  saveStartSessionForVideoChat(query: any): Observable<any> {
    return this.apiService.SaveStartSessionForVideoChat.postByQuery(query);
  }

  endSessionForVideoChat(query: any): Observable<any> {
    return this.apiService.EndSessionForVideoChat.postByQuery(query);
  }
  //End Working on app/issues/1615

  // Working on app/issues/1970
  getPastPrescriptionApiV5(path: any): Observable<any> {
    return this.apiService.GetPastPrescriptionV5.postByQuery(path);
  }
  getPrescriptionByAdmisionOrAppointmentAndPrescriptionRefNo(path: any): Observable<any> {
    return this.apiService.GetPrescriptionByAdmisionOrAppointmentAndPrescriptionRefNo.postByQuery(path);
  }
  // End Working on app/issues/1970

  // Working on app/issues/2086
  checkOverlappingDoctorAppointmentV3(query: any): Observable<any> {
    return this.apiService.CheckOverlappingDoctorAppointmentV3.postByQuery(query);
  }
  // End Working on app/issues/2086

   // app/issues/2135
   getFrequentAdviceList(): Observable<any> {
    return this.apiService.GetFrequentAdviceList.get();
  }
  getFrequentVaccineList(): Observable<any> {
    return this.apiService.GetFrequentVaccineList.get();
  }
  // Working on app/issues/2009
  getHospitalListByDoctorRefNo(query: any): Observable<any> {
        return this.apiService.GetHospitalListByDoctorRefNo.postByQuery(query);
  }
  // End Working on app/issues/2009

   // Working on app/issues/2145
   savePrintGenericNameFlag(query: any): Observable<any> {
    return this.apiService.SavePrintGenericNameFlag.postByQuery(query);
  }
  // End Working on app/issues/2145
  //app#2236
  getAssociateUserByRefNo(path: any): Observable<any> {
    return this.apiService.GetAssociateUserByRefNo.getByPath(path);
  }

  getRegistrationTxnDetails(query): Observable<any> {
    return this.apiService.GetRegistrationTxnDetails.postByQuery(query);
  }

   // Working on app/issues/2355
   checkHolidayByAppointmentDateAndChamber(query: any): Observable<any> {
    return this.apiService.CheckHolidayByAppointmentDateAndChamber.postByQuery(query);
  }
  // End Working on app/issues/2355

  // Working on app/issues/2399
  checkOverlappingDoctorAppointmentV4(query: any): Observable<any> {
    return this.apiService.CheckOverlappingDoctorAppointmentV4.postByQuery(query);
  }
  // End Working on app/issues/2399

}
