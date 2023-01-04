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
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndividualService {
  private editedMember: BehaviorSubject<any> = new BehaviorSubject(null);
  public memberData = this.editedMember.asObservable();

  constructor(private apiService: ApiService, private http: HttpClient) { }

  fetchOCRResponseByDocumentRefNo(docRefNo:string): Observable<any> {
    return this.apiService.FetchOCRResponseByDocumentRefNo.postByQuery(docRefNo);
  }

  updateOCRResponseByUSer(ocrDetails: any): Observable<any> {
    return this.apiService.UpdateOCRResponseByUser.postByQuery(ocrDetails);
  }
  
  getUserFullProfile(user_ref_no: any) : Observable<any> {
    return this.apiService.UserProfile.getByPath(user_ref_no);
  }

  getMasterDataState(countryId:any) : Observable<any> {
    return this.apiService.Country.getByPath(countryId+"/"+"states");
  }

  getMasterDataCountry() : Observable<any> {
    return this.apiService.Country.get();
  }

  getMasterDataGender(query: any) : Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }

  getMasterDataExerciseType() : Observable<any> {
    return this.apiService.ExerciseType.get();
  }
  updateUserProfile(query: any) : Observable<any> {
    return this.apiService.UserProfile.putByQuery(query);
  }

  deleteAddress(query: any) : Observable<any> {
    return this.apiService.DeleteUserAddresses.deleteByQuery(query);
  }

  deleteExercise(query: any) : Observable<any> {
    return this.apiService.DeleteUserExercise.deleteByQuery(query);
  }
  
  deleteOccupation(query: any) : Observable<any> {
    return this.apiService.DeleteUserOccupations.deleteByQuery(query);
  }

  getGroupsByUserId(path: any) : Observable<any> {
    return this.apiService.UserProfile.getByPath(path+'/groups');
  }

  groupCreate(query:any): Observable<any> {
    return this.apiService.CreateGroup.postByQuery(query);
  }

  updateGroupName(query:any): Observable<any> {
    return this.apiService.CreateGroup.putByQuery(query);
  }

  userFamilyListView(groupId:any): Observable<any> {
    return this.apiService.UserGroup.postByQuery(groupId);
  }

  getMasterDataRelation(query): Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }

  editUserMember(query): Observable<any> {
    return this.apiService.AddMemberToUserGroup.putByQuery(query);
  }

  checkUsername(userName: any): Observable<any> {
    return this.apiService.CheckExistingUserName.getByQuery({q:userName});
  }

  addExistingUserInGroup(query): Observable<any> {
    return this.apiService.AddExistingUser.postByQuery(query);
  }
  GroupNewUserInvitation(query): Observable<any> {
    return this.apiService.GroupNewUserInvitation.postByQuery(query);
  }

  searchUser(query): Observable<any> {
    return this.apiService.SearchUser.getByQuery(query);
  }

  addUserMember(query:any): Observable<any> {
    return this.apiService.AddMemberToUserGroup.postByQuery(query);
  }

  AddGroupUser(query:any): Observable<any> {
    return this.apiService.AddUser.postByQuery(query);
  }
  
  deleteMember(query:any): Observable<any> {
    return this.apiService.DeleteGroupMember.postByQuery(query);
  }
  setMemberData(data: any) {
    this.editedMember.next(data);
  }
  
  changePassword(query: any) : Observable<any> {
    return this.apiService.changepassword.postByQuery(query);
  }
  deleteBulkGroup(query): Observable<any> {
    return this.apiService.UserGroupDelete.postByQuery(query);
  }

  deleteGroup(query): Observable<any> {
    return this.apiService.UserGroupDelete.postByQuery(query);
  }
  LeaveGroupUser(query): Observable<any> {
    return this.apiService.LeaveGroup.postByQuery(query);
  }
  MakeAdminToMember(query): Observable<any> {
    return this.apiService.MakeAdmin.postByQuery(query);
  }
  RevokeAdminToMember(query): Observable<any> {
    return this.apiService.RevokeAdmin.postByQuery(query);
  }
  uploadProfilePhoto(formData:any,token:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'v1/users/upload/profile-image', formData, {
      reportProgress: true,
      responseType: 'text'
    });
    req = req.clone({ headers: req.headers.set('token', token) });
    return this.http.request(req);
    //return this.apiService.UploadProfiePhoto.upload(formData);
  }
  downloadProfilePhoto(userId:any): Observable<any> {
    // return this.apiService.DownloadProfilePic.getByPath(path);
    return this.apiService.DownloadProfiePhoto.getByPath(userId);
  }

  downloadProfilePhotoV2(path:any): Observable<any> {
    return this.apiService.DownloadProfilePic.getByPath(path);
  }
  //method to get med attr list for med details component
  getMedicalAttributeList(query:any): Observable<any> {
    return this.apiService.GetMedicalAttributeLongNameV2.postByQuery(query);
  }

  getMedicalAttributeListV3(query:any): Observable<any> {
    return this.apiService.GetMedicalAttributeLongNameV3.postByQuery(query);
  }

  getChildMedicalAttributeList(parentId:any): Observable<any> {
    return this.apiService.GetChildAttributesByParentsId.getByPath(parentId);
  }

  saveMedicalRecords(query:any): Observable<any> {
    return this.apiService.SaveMedicalRecords.postByQuery(query);
  }

  getMedFindingsGroupDetails(userId): Observable<any> {
    return this.apiService.GetMedicalFindingsGroupDetails.getByPath(userId);
  }

  loadUserVitalMedicalAttributes(userId:any): Observable<any> {
    return this.apiService.LoadVitalMedicalRecords.getByPath(userId);
  }

  loadMedicalAttributeDataForChart(query): Observable<any> {
    return this.apiService.LoadMedicalAttributeDataForChart.postByQuery(query);
  }

  saveFavDoctor(query:any): Observable<any> {
    return this.apiService.SaveFavDoctor.postByQuery(query);
  }

  getFavDoctorForUser(userId:any):Observable<any> {
    return this.apiService.GetFavDoctorForUser.getByPath(userId);
  }

  getMasterDataBloodGroup(query: any) : Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }

  getMedicinesByName(path) : Observable<any> {
    return this.apiService.MedicinesFetchByName.getByPath(path);
  }
  getMedicinesByNameList(path) : Observable<any> {
    return this.apiService.MedicinesFetchByNameList.getByPath(path);
  }
  getMedicinesByMedicineId(path): Observable<any> {
    return this.apiService.MedicinesFetchByMedicineId.getByPath(path);
  }
  getMedicinesById(path) : Observable<any> {
    return this.apiService.MedicinesFetchById.getByPath(path);
  }
  saveOrder(query:any): Observable<any> {
    return this.apiService.SaveOrderMedicine.postByQuery(query);
  }

  DeleteSelectedOrderedMedicine(query: any): Observable<any> {
    return this.apiService.DeleteOrderedMedicine.postByQuery(query);
  }

  saveOrderMultiple(query:any): Observable<any> {
    return this.apiService.SaveOrderMedicineMultiple.postByQuery(query);
  }

  getPrescriptionByUserId(path) : Observable<any> {
    return this.apiService.GetPrescriptionByUserId.getByPath(path);
  }

  getPrescriptionForUser(query) : Observable<any> {
    return this.apiService.GetPrescriptionForUser.postByQuery(query);
  }

  prescriptionUpload(query: any): Observable<any> {
    return this.apiService.PrescriptionUpload.postByQuery(query);
  }

  prescriptionDownload(query: any): Observable<any> {
    return this.apiService.PrescriptionDownload.postByQuery(query);
  }

  //new add to get invoice report for my orders
  getMyOrderInvoiceReport(path): Observable<any> {
    return this.apiService.GetInvoiceReport.getByPath(path);
  }

  getOrderMedicineByUserRefNov3(path) : Observable<any> {
    return this.apiService.getOrderMedicineByUserRefNov3.postByQuery(path);
  }

  getGroupMember(path): Observable<any> {
    return this.apiService.GetGroupMember.getByPath(path);
  }

  placeOrderFromCart(query: any): Observable<any> {
    return this.apiService.PlaceOrderFromCart.postByQuery(query);
  }

  //new add to get medical details history by user id n attribute id
  getMedicalDetailsByUserIdNAttrId(path): Observable<any> {
    return this.apiService.GetMedicalDetHistoryByUSerIdNAttrId.getByPath(path);
  }

  completeMedicinePayment(query: any): Observable<any> {
    return this.apiService.CompleteMedicinePaymentURL.postByQuery(query);
  }
  //to get med attribute list
  getMedicalDetailsAttributeList(): Observable<any> {
    return this.apiService.getAllMedAttributeList.get();
  }
  //to get med det source values MEDICAL_DATA_SRC_TYPE
  getMEdicalDetailsSourceValues(query): Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }
  //to delete medical medical findings from history by attrpk
  deleteMedicalFindingsSingleData(path): Observable<any> {
    return this.apiService.DeleteMedicalFindingsSingleData.deleteByPath(path);
  }
  //to update single medical findings from history
  updateMedicalFindingsSingleData(query): Observable<any> {
    return this.apiService.UpdateMedicalFindingsSingleData.postByQuery(query);
  }

  getValidateDeliverAddress(path): Observable<any> {
    return this.apiService.ValidatePinWithItemId.getByPath(path);
  }
  getReOrderableMedicineDetails(path): Observable<any> {
    return this.apiService.GetReOrderableMedicineDetails.getByPath(path);
  }
  orderMedicineForMultipleRequisition(query): Observable<any> {
    return this.apiService.OrderMedicineForMultipleRequisition.postByQuery(query);
  }

  fetchMedicalTestReports(path): Observable<any> {
    return this.apiService.FetchMedicalTestReports.getByPath(path);
  }
  addMinorReq(query:any): Observable<any> {
    return this.apiService.AddMinorRequest.postByQuery(query);
  }
  listViewOfMinor(path): Observable<any> {
    return this.apiService.AddminorList.getByPath(path);
  }
  getAllFees(query: any): Observable<any> {
    return this.apiService.GetAllFees.postByQuery(query);
  }
  //E-address Get:
  listOfEaddress(path): Observable<any> {
    return this.apiService.MinorEaddressList.getByPath(path);
  }
  //Delete Minor User Guardian:
  deleteMinorUserGuardian(query: any): Observable<any> {
    return this.apiService.guardianMinorDelete.postByQuery(query);
  }
  //Add Guardian along Update:-->

  addMoreGuardain(query: any): Observable<any> {
    return this.apiService.AddGuardianUpdate.postByQuery(query);
  }
  //DELETE MINOR GUARDIAN:-->
  deleteGuardian(query: any): Observable<any> {
    return this.apiService.deleteGuardian.postByQuery(query);
  }
  getAllergyHistory(path): Observable<any> {
    return this.apiService.GetAllergyHistory.getByPath(path);
  }
  deleteAllergy(query: any): Observable<any>{
    return this.apiService.DeleteAllergy.postByQuery(query);
  }
  saveAllergy(query: any): Observable<any> {
    return this.apiService.SaveAllergy.postByQuery(query);
  }
  getMasterDataAllergy(query: any) : Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }
  saveProcedure(query: any) : Observable<any> {
    return this.apiService.SaveProcedure.postByQuery(query);
  }
  getProcedure(path: any) : Observable<any> {
    return this.apiService.GetProcedure.getByPath(path);
  }
  deleteProcedure(query: any) : Observable<any> {
    return this.apiService.DeleteProcedure.postByQuery(query);
  }
  getDisease(path: any) : Observable<any> {
    return this.apiService.GetDisease.getByPath(path);
  }
  deleteDisease(query: any) : Observable<any> {
    return this.apiService.DeleteDisease.postByQuery(query);
  }
  updateDisease(query: any) : Observable<any> {
    return this.apiService.UpdateDisease.postByQuery(query);
  }
  getMinorTestReports(path): Observable<any> {
    return this.apiService.GetMinorTestReport.getByPath(path);
  }
  getOrderById(path): Observable<any> {
    return this.apiService.GetOrderById.getByPath(path);
  }
  getDiagnostics(path): Observable<any> {
    return this.apiService.GetLabTestList.getByPath(path);
  }
  bookDiagnostics(query: any) : Observable<any> {
    return this.apiService.BookDiagnostics.postByQuery(query);
  }
  getUserEmail(userRefNo): Observable<any> {
    return this.apiService.GetUserEmail.getByPath(userRefNo);
  }
  findDiagnosticLab(query: any) : Observable<any> {
    return this.apiService.FindDiagnosticLab.postByQuery(query);
  }
  getDiagnosticsLabOrders(query) : Observable<any> {
    return this.apiService.GetDiagnosticsLabOrders.postByQuery(query);
  }

  getRatingForPharmacy(): Observable<any>{
    return this.apiService.RatingParam.getByPath('PHARMACY/INDIVIDUAL');
  }
  getRatingForDiagnostics(): Observable<any>{
    return this.apiService.RatingParam.getByPath('DIAGNOSTICS/INDIVIDUAL');
  }
  viewRatingV2(query: any): Observable<any>{
    return this.apiService.ViewRatingV2.postByQuery(query);
  }
  getUserReviewsForDiagnostics(drId, pageNo): Observable<any> {
    return this.apiService.UserReviews.getByPath('DIAGNOSTICS/'+drId+'/'+pageNo);
  }
  getUserReviewsForPharmacy(drId, pageNo): Observable<any> {
    return this.apiService.UserReviews.getByPath('PHARMACY/'+drId+'/'+pageNo);
  }
  // Added for issue app#597
  findCountryStateCityByPin(query: any): Observable<any> {
    return this.apiService.FindCountryStateCityByPin.postByQuery(query);
  }

  // //start family history
  // getFamilyHistory(path): Observable<any> {
  //   return this.apiService.GetFamilyHistory.getByPath(path);
  // }
  // saveFamilyHistory(query: any): Observable<any> {
  //   return this.apiService.SaveFamilyHistory.postByQuery(query);
  // }
  // deleteFamilyHistory(query): Observable<any> {
  //   return this.apiService.DeleteFamilyHistory.postByQuery(query);
  // }
  // //end family history

  // //start current medicine history
  // getMedicineHistory(path): Observable<any> {
  //   return this.apiService.GetMedicineHistory.getByPath(path);
  // }
  // saveMedicineHistory(query: any): Observable<any> {
  //   return this.apiService.SaveMedicineHistory.postByQuery(query);
  // }
  // deleteMedicineHistory(query): Observable<any> {
  //   return this.apiService.DeleteMedicineHistory.postByQuery(query);
  // }
  // //end current medicine history

  getGuardianAttributeByName(query: any) : Observable<any> {
    return this.apiService.MasterData.getByQuery(query);
  }

  userFamilyHistorySave(query: any) : Observable<any> {
    return this.apiService.UserFamilyHistorySave.postByQuery(query);
  }
  userFamilyHistoryRetrieve(path: any) : Observable<any> {
    return this.apiService.UserFamilyHistoryRetrieve.getByPath(path);
  }
  userFamilyHistoryDelete(query: any) : Observable<any> {
    return this.apiService.UserFamilyHistoryDelete.postByQuery(query);
  }

  currentMedicineSave(query: any) : Observable<any> {
    return this.apiService.CurrentMedicineSave.postByQuery(query);
  }
  currentMedicineRetrieve(path: any) : Observable<any> {
    return this.apiService.CurrentMedicineRetrieve.getByPath(path);
  }
  currentMedicineDelete(query: any) : Observable<any> {
    return this.apiService.CurrentMedicineDelete.postByQuery(query);
  }
  findOrSaveMedicalAttribute(query: any) : Observable<any> {
    return this.apiService.FindOrSaveMedicalAttribute.postByQuery(query);
  }
  retrieveMedicalRecordsByTriggerAndAttributeId(query: any) : Observable<any> {
    return this.apiService.RetrieveMedicalRecordsByTriggerAndAttributeId.postByQuery(query);
  }
  saveMedicalRecordsByPrescription(query: any) : Observable<any> {
    return this.apiService.SaveMedicalRecordsByPrescription.postByQuery(query);
  }

  getCalenderDoctorChamberV5(query: any) : Observable<any> {
    return this.apiService.GetCalenderDoctorChamber.postByQuery(query);
  }

  retrieveGroupInvitations(): Observable<any> {
    return this.apiService.RetrieveGroupInvitations.get();
  }

  acceptGroupInvitation(query: any): Observable<any> {
    return this.apiService.AcceptGroupInvitation.putByQuery(query);
  }

  rejectGroupInvitation(query: any): Observable<any> {
    return this.apiService.RejectGroupInvitation.postByQuery(query);
  }

  getPrescriptionsByMedicineName(query: any): Observable<any> {
    return this.apiService.GetPrescriptionsByMedicineName.postByQuery(query);
  }

  getUploadedPrescriptions(): Observable<any> {
    return this.apiService.GetUploadedPrescriptions.get();
  }

  // Working on app/issue/1713
  getUserAddresBtRefNoAndAddressType(query: any): Observable<any> {
    return this.apiService.GetUserAddresBtRefNoAndAddressType.postByQuery(query);
  }
  // End Working on app/issue/1713

  //Working on app/issues/1970
  currentMedicineListIPD(query: any) : Observable<any> {
    return this.apiService.CurrentMedicineListIPD.postByQuery(query);
  }
  discontinueCurrentMedicine(query: any) : Observable<any> {
    return this.apiService.DiscontinueCurrentMedicine.postByQuery(query);
  }
  
  //End Working on app/issues/1970
  getPermission(query) : Observable<any> {
    return this.apiService.GetPermission.getByQuery(query);
  }

  setPermission(query: any): Observable<any> {
    return this.apiService.SetPermission.postByQuery(query);
  }

  revokePermission(query: any): Observable<any> {
    return this.apiService.RevokePermission.postByQuery(query);
  }

  registerNewUser(query:any): Observable<any> {//https://gitlab.com/sbis-poc/app/issues/1471
    return this.apiService.RegisterNewUserForProcedure.postByQuery(query);
  }

  updateAppointment(query: any) : Observable<any> {
    return this.apiService.UpdateAppointment.postByQuery(query);
  }

  retrieveAllTestFor(): Observable<any> {
    return this.apiService.RetrieveAllTestFor.get();
  }

  loadUserVitalMedicalAttributesTestFor(userId:any, testFor: any): Observable<any> {
    return this.apiService.LoadVitalMedicalRecords.getByPath(userId+'/?testFor='+testFor);
  }

  currentMedicineListIPDV2(query: any) : Observable<any> {
    return this.apiService.CurrentMedicineListIPDV2.postByQuery(query);
  }

  getOtherPrescriptionsOfPatient(path: any): Observable<any> {
    return this.apiService.GetOtherPrescriptionsOfPatient.getByPath('?'+path);
  }

  getOtherTestReportOfPatient(path: any): Observable<any> {
    return this.apiService.GetOtherTestReportOfPatient.getByPath('?'+path);
  }
}
