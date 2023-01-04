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
import { ApiService } from '../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ServiceProviderService {
  private editedMember: BehaviorSubject<any> = new BehaviorSubject(null);
  public memberData = this.editedMember.asObservable();

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getRolesForHospital(hospital: any): Observable<any> {
    return this.apiService.GetRolesForHospital.getByPath(hospital);
  }

  saveRolesForHospital(query: any): Observable<any> {
    return this.apiService.SaveRolesForHospital.postByQuery(query);
  }

  getHospitalList(path): Observable<any> {
    return this.apiService.GetHospitalList.getByPath(path);
  }

  getParentEntityList(path): Observable<any> {
    return this.apiService.GetParentEntityList.getByPath(path);
  }

  saveEntity(query: any): Observable<any> {
    return this.apiService.SaveEntity.postByQuery(query);
  }

  sendOtp(query: any): Observable<any> {
    return this.apiService.SendOtp.postByQuery(query);
  }

  // checkContactno(contactNumber: any): Observable<any> {
  //   return this.apiService.UserMobileNoAddressCheck.getByPath('contactno?q=' + contactNumber);
  // }

  checkUsername(userName: any): Observable<any> {
    return this.apiService.UserEmailAddressCheck.getByPath('email?q=' + userName);
  }

  checkContactno(query: any): Observable<any> {
    return this.apiService.CheckContactno.postByQuery(query);
  }

  roleAdd(query: any): Observable<any> {
    return this.apiService.RoleAdd.postByQuery(query);
  }

  sentOTP(query: any): Observable<any> {
    return this.apiService.ManageOTP.postByQuery(query);
  }

  //Fetch Service Provider details by User PK and Parent Role name
  getServiceProviderEntityValueByPk(query): Observable<any> {
    return this.apiService.GetServiceProviderEntityValueByPkv2.postByQuery(query);
  }

  findOPDByMiscUserMsUserPk(query): Observable<any> {
    return this.apiService.FindOPDByMiscUserMsUserPkv2.postByQuery(query);
  }

  getDocumentByRole(query): Observable<any> {
    return this.apiService.GetDocumentByRolev2.postByQuery(query);
  }

  getUser(userId: any): Observable<any> {
    return this.apiService.ProviderUser.getByPath(userId);
  }
  getUserv2(query): Observable<any> {
    return this.apiService.ProviderUserv2.postByQuery(query);
  }

  // Removed unused service saveFiles(total_form) - app#1214

  saveDocument(formData: any): Observable<any> {
    console.log(formData)
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);

    //return this.apiService.UploadProfiePhoto.upload(formData);
  }

  getDoctorList(): Observable<any> {
    return this.apiService.GetDoctorList.get();
  }

  UserRolesList(query: any): Observable<any> {
    return this.apiService.UserRolesList.postByQuery(query);
  }

  AdminCount(serviceProviderPk: any, parentRoleName: any) {
    let query = serviceProviderPk + '/' + parentRoleName;
    return this.apiService.AdminCount.getByPath(query);
  }

  sendNotification(query: any): Observable<any> {
    return this.apiService.Send_Notification.postByQuery(query);
  }

  getDoctorAppointment(query: any): Observable<any> {
    return this.apiService.GetDoctorAppointment.postByQuery(query);
  }
  getDoctorAppointmentAndChamberUpdate(query: any) {
    return this.apiService.GetDoctorAppointmentAndChamberUpdate.postByQuery(query);
  }
  uploadLogo(formData: any, token: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'v1/serviceprovider/uploadLogo', formData, {
      reportProgress: true,
      responseType: 'text'
    });
    req = req.clone({ headers: req.headers.set('token', token) });
    return this.http.request(req);
  }
  downloadLogo(userId: any, entityName: any): Observable<any> {
    let path = userId + "/" + entityName;
    return this.apiService.DownloadLogo.getByPath(path);
  }


  saveLabTest(query: any): Observable<any> {
    return this.apiService.SaveLabTest.postByQuery(query);
  }
  getAllLabTest(query: any): Observable<any> {
    return this.apiService.GetAllLabTest.postByQuery(query);
  }
  saveTest(query: any): Observable<any> {
    return this.apiService.SaveLabTest.postByQuery(query);
  }
  deleteTest(query: any): Observable<any> {
    return this.apiService.DeleteTest.postByQuery(query);
  }

  saveLabTestExcelData(query: any): Observable<any> {
    return this.apiService.SaveLabTestExcelData.postByQuery(query);
  }
  getMedicalCodeAndName(): Observable<any> {
    return this.apiService.GetMedicalCodeAndName.get();
  }

  // Added for issue app#597
  findCountryStateCityByPin(query: any): Observable<any> {
    return this.apiService.FindCountryStateCityByPin.postByQuery(query);
  }

  // app/issue/843
  getPrescriptionTemplatesByRefNo(query): Observable<any> {
    return this.apiService.GetAllPrescriptionTemplatesForHospitalByRefNo.postByQuery(query);
  }

  getAppointmentsForServiceProviders(searchStr): Observable<any> {
    return this.apiService.GetAppointmentsForServiceProviders.getBySearchString(searchStr);
  }

  getPendingAppointmentsForServiceProviders(query): Observable<any> {
    return this.apiService.GetPendingAppointmentsForServiceProviders.postByQuery(query);
  }

  //https://gitlab.com/sbis-poc/app/issues/1103
  getAllPatientDetailsByOPD(query): Observable<any> {
    return this.apiService.PatientSearchByOPD.postByQuery(query);
  }

  getPastPrescriptionOfSelectedPatientByOPD(query): Observable<any> {
    return this.apiService.GetPatientPastPrescriptionByOPD.postByQuery(query);
  }
  //end of working of //https://gitlab.com/sbis-poc/app/issues/1103


  // Working on app/issues/1438
  getIPDServiceCategories(): Observable<any> {
    return this.apiService.GetIpdServiceCategories.get();
  }

  getIPDServiceDetailsByCategory(query): Observable<any> {
    return this.apiService.GetIpdServiceDetailsByCategory.postByQuery(query);
  }

  deleteIPDServiceDetailsByHospitalRefNo(query): Observable<any> {
    return this.apiService.DeleteIpdServiceDetailsByHospitalRefNo.postByQuery(query);
  }


  saveIPDServiceDetailsByHospitalRefNo(query): Observable<any> {
    return this.apiService.SaveIpdServiceDetailsByHospitalRefNo.postByQuery(query);
  }

  getIpdServiceListByCategory(path): Observable<any> {
    return this.apiService.GetIpdServiceListByCategory.getByPath(path);
  }
  getIpdServiceList(path): Observable<any> {
    return this.apiService.GetIpdServiceList.postByQuery(path);
  }
  // End Working on app/issues/1438

  // Working on app/issues/1429
  saveRoom(query): Observable<any> {
    return this.apiService.SaveHospitalRoom.postByQuery(query);
  }
  getAllHospitalRoomDetails(query): Observable<any> {
    return this.apiService.GetAllHospitalRoomDetails.postByQuery(query);
  }

  getAllHospitalRoomCatrgoryDetails(query): Observable<any> {
    return this.apiService.GetRoomCategoryDetails.postByQuery(query);
  }
   deleteRoom(query){
    return this.apiService.DeleteRoom.postByQuery(query);
   }

  getSpecializationList(): Observable<any> {
    return this.apiService.GetSpecializationByOPD.get();
  }

  getSpecializationListByServiceProviderRefNo(path): Observable<any> {
    return this.apiService.GetSpecializationByOPD.getBySearchString(path);
  }

  
  fetchDoctorListByOPD(query): Observable<any> {
    return this.apiService.GetDoctorListByOpd.postByQuery(query);
  }

  fetchDoctorListByOPDV2(query): Observable<any> {
    return this.apiService.GetDoctorListByOpdV2.postByQuery(query);
  }

  fetchDoctorListByOPDDoctor(query): Observable<any> {
    return this.apiService.GetDoctorListByOpdDoctor.postByQuery(query);
  }
  

  getDepartmentList(): Observable<any> {
    return this.apiService.GetDepartmentList.get();
  }

  getRoomCategoryList(): Observable<any> {
    return this.apiService.GetHospitalRoomCategoryList.get();
  }
  
  saveInpatientAdmission(query): Observable<any> {
    return this.apiService.SaveInpatientAdmission.postByQuery(query);
  }

  fetchRoomList(query): Observable<any> {
    return this.apiService.FetchRoomList.postByQuery(query);
  }

  fetchRoomListByHospital(): Observable<any> {
    return this.apiService.FetchRoomListByHospital.get();
  }

  fetchBedList(query): Observable<any> {
    return this.apiService.FetchBedList.postByQuery(query);
  }

  checkBedOccupancy(query): Observable<any> {
    return this.apiService.BedOccupancy.postByQuery(query);
  }
  
  fetchInpatientList(query): Observable<any> {
      return this.apiService.FetchInpatientList.postByQuery(query);
  }

  //
  fetchIndividualUsersInpatientList(query: string): Observable<any> {
      return this.apiService.FetchIndividualUsersInpatientList.postByQuery(query);
  }

   getInpatientAdmissionDetails(query): Observable<any> {
    return this.apiService.GetInpatientAdmissionDetails.postByQuery(query);
  }
    // Working on app/issues/1499
  getIpdServiceBasicInfoList(path): Observable<any> {
      return this.apiService.GetIpdServiceBasicInfoList.postByQuery(path);
    }
  
    getIpdServiceRateByRefNoAndQuantity(path): Observable<any> {
      return this.apiService.GetIpdServiceRateByRefNoAndQuantity.postByQuery(path);
    }
  
    getAssociatedServiceListByServiceRefNo(path): Observable<any> {
  
        return this.apiService.GetAssociatedServiceListByServiceRefNo.postByQuery(path);
    }
  
  
    getInpatientBillList(path): Observable<any> {
  
      return this.apiService.GetInpatientBillList.postByQuery(path);
    }
  
    saveInpatientBill(path): Observable<any> {
  
      return this.apiService.SaveInpatientBill.postByQuery(path);
    }

    checkDuplicateCategory(query):  Observable<any> {
      return this.apiService.CheckDuplicateCategory.postByQuery(query);
    }

    getAllUsersProcedureInfoByAdmissionRefNo(query): Observable<any> {
      return this.apiService.GetAllUserProcedureByAdmissionRefNo.postByQuery(query);
    }

    getInpatientBillDetailByRefNo(path): Observable<any> {

      return this.apiService.GetInpatientBillDetailByRefNo.postByQuery(path);
    }

      // Working on app/issues/1496
      getBedChargeDetailByAdmission(query): Observable<any>{
        return this.apiService.GetBedChargeDetailByAdmission.postByQuery(query);
      }

      saveInPatientInvoice(query): Observable<any>{
        return this.apiService.SavePatientInvoiceByAdmission.postByQuery(query);
      }

      getAdmissionBasicInfo(query): Observable<any>{
        return this.apiService.GetAdmissionBasicInfo.postByQuery(query);
      }

      getInvoiceByAdmissionRefNo(query): Observable<any>{
        return this.apiService.GetInvoiceByAdmissionRefNo.postByQuery(query);
      }

      getInvoiceListByAppointmentRefNo(query): Observable<any>{
        return this.apiService.GetInvoiceListByAppointmentRefNo.postByQuery(query);
      }

      apiUrl = environment.apiUrl;
      downloadFile(payload): Observable<any>{
        return this.http.post(this.apiUrl+'gen/v3/common/generateReport', payload, { responseType: 'blob' });
       }

       downloadOPDInvoice(payload): Observable<any>{
         let file: any={};
        // return this.http.post(this.apiUrl+'v1/opd/generateAppointmentInvoice', payload, { responseType: 'blob' });
        return this.apiService.DownloadOPDInvoice.getBlob(file,payload);
       }


    // End Working on app/issues/1496


    // End Working on app/issues/1499

    fetchRoomcategoryListByAdmisnRefNo(query): Observable<any> {
      return this.apiService.GetRoomcategoryListByAdmisnRefNo.postByQuery(query);
    }

    //  Working on app/issues/1548
    saveInPatientPayment(query): Observable<any> {
      return this.apiService.SaveInPatientPayment.postByQuery(query);
    }

    checkInvoiceGeneratedByAdmission(query): Observable<any> {
      return this.apiService.CheckInvoiceGenerationByAdmission.postByQuery(query);
    }


    getInPatientPaymentHistory(query): Observable<any> {
      return this.apiService.GetInPatientPaymentHistory.postByQuery(query);
    }
  // End Working on app/issues/1548


  fetchGroupList(): Observable<any> {
        return this.apiService.GetGroupDetails.get();
     }

  //  Working on app/issues/1656
  getResourceListByEntity(): Observable<any> {
    return this.apiService.GetResourceListByEntity.get();
  }

  getAvailabilityCalendarForResource(query): Observable<any> {
    return this.apiService.GetAvailabilityCalendarForResource.postByQuery(query);
  }

  allocateResourceSlot(query): Observable<any> {
    return this.apiService.AllocateResourceSlot.postByQuery(query);
  }

  getRoomCategoryDetailsWithBedResource(query): Observable<any> {
    return this.apiService.GetRoomCategoryDetailsWithBedResource.postByQuery(query);
  }



getResourceAvailablity(query): Observable<any> {
  return this.apiService.GetResourceAvailablity.postByQuery(query);
}
//  End Working on app/issues/1656

saveServiceProviderPincode(query): Observable<any> {
  return this.apiService.SaveServiceProviderPincode.postByQuery(query);
}

retrieveServiceProviderPincode(): Observable<any> {
  return this.apiService.RetrieveServiceProviderPincode.get();
}

//  Working on app/issues/1886
saveHoliday(payload): Observable<any> {
  return this.apiService.SaveUpdateDeleteHoliday.postByQuery(payload);
}

fetchHoliday(): Observable<any> { 
return this.apiService.FetchHolidayDetails.get();
}
//  End Working on app/issues/1886

//  Working on app/issues/1823
getFileInfoByFileType(query): Observable<any> { 
  return this.apiService.GetServiceProviderFileInfoByType.postByQuery(query);
  }
//  End Working on app/issues/1823

cancelBedHistoryByAdmissionRefNo(query): Observable<any> { 
  return this.apiService.CancelBedHistoryByAdmissionRefNo.postByQuery(query);
  }
  
  updateSpDocumentMapWithoutFile(query): Observable<any> { 
  return this.apiService.UpdateSpDocumentMapWithoutFile.postByQuery(query);
  }

  changeDoctorByAdmissionRefNo(query): Observable<any> {
    return this.apiService.ChangeDoctorByAdmissionRefNo.postByQuery(query);
  }

  changeBedByAdmissionRefNo(query): Observable<any> {
    return this.apiService.ChangeBedByAdmissionRefNo.postByQuery(query);
  }

  deleteDoctorHistory(query): Observable<any> {
    return this.apiService.DeleteDoctorHistory.postByQuery(query);
  }

  deleteBedHistory(query): Observable<any> {
    return this.apiService.DeleteBedHistory.postByQuery(query);
  }

  getIpdServiceListTypeAhead(query): Observable<any> {
    return this.apiService.GetIpdServiceListTypeAhead.postByQuery(query);
  }

  getIpdServiceByRefNo(query): Observable<any> {
    return this.apiService.GetIpdServiceByRefNo.postByQuery(query);
  }

  getIpdFeesOfDoctor(query): Observable<any> {
    return this.apiService.GetIpdFeesOfDoctor.postByQuery(query);
  }

  // Working on app/issue/2471
  saveOperationTheaterDetails(query): Observable<any> {
    return this.apiService.SaveOperationTheaterDetails.postByQuery(query);
  }
  
  getAllOperationTheaterDetails(payload): Observable<any> {
    return this.apiService.GetAllOperationTheaterDetails.postByQuery(payload);
  }

  deleteOperationTheaterDetails(query): Observable<any> {
    return this.apiService.DeleteOperationTheaterDetails.postByQuery(query);
  }
  // End Working on app/issue/2471
}

