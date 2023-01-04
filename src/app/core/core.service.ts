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


@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private apiService: ApiService) { }

  getUserRoles(path): Observable<any> {
    return this.apiService.GetUserRole.getByPath(path);
  }

  getUserState(path): Observable<any> {
    return this.apiService.GetUserState.getByPath(path)
  }

  checkAlertState(query): Observable<any> {
    return this.apiService.checkNewAlerts.postByQuery(query)
  }

  userLogin(query: any): Observable<any> {
    return this.apiService.UserLogin.postByQuery(query);
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

  sendDocViaEmail(query: any): Observable<any> {
    return this.apiService.SendDocumentViaEmail.postByQuery(query);
  }
  getAllRolesByUser(query): Observable<any> {
    return this.apiService.GetAllRolesByUser.postByQuery(query);
  }

  //working on system admin issue[set password for a user]-[https://gitlab.com/sbis-poc/app/issues/1008]
  getUSerDetailsBySearchData(query): Observable<any> {
    return this.apiService.GetUserDetailsBySearchData.postByQuery(query);
  }  
  // [https://gitlab.com/sbis-poc/app/issues/1008]
  setPasswordBySysAdmin(query): Observable<any> {
    return this.apiService.SetPasswordBySysAdmin.postByQuery(query);
  }
  //https://gitlab.com/sbis-poc/app/issues/1120
  deleteDocument(query): Observable<any> {
    return this.apiService.DeleteDocument.deleteByQuery(query);
  }

  getCommonRoles(): Observable<any> {
    return this.apiService.RetrieveCommonRoles.get();
  }

  
  // https://gitlab.com/sbis-poc/app/-/issues/2618
  getChatSession(query): Observable<any> {
    return this.apiService.GetChatSession.postByQuery(query);
  }

  closeChatSession(query): Observable<any> { //https://gitlab.com/sbis-poc/app/-/issues/2626
      return this.apiService.CloseChatSession.postByQuery(query);
  }
  // https://gitlab.com/sbis-poc/app/-/issues/2618

  //Fetch Service Provider details by User PK and Parent Role name
  getServiceProviderEntityValueByPk(query): Observable<any> {
    return this.apiService.GetServiceProviderEntityValueByPkv2.postByQuery(query);
  }

  //to verify chat link
  chatVerifyLinkForIndividualUser(query): Observable<any> {
    return this.apiService.ChatVerifyLinkForIndividualUser.postByQuery(query);
  }

}
