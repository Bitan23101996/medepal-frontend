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
//sbis-poc/app/issues/603
import { Injectable } from '@angular/core';
import { ApiService } from './../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Api } from 'src/app/core/services/api';

@Injectable({
  providedIn: 'root'
})
export class QueryFrameworkService {
  apiUrl = environment.apiUrl;

  constructor(private apiService: ApiService, private http: HttpClient) { }


  fetchAllQueryResult(queryId: string, entityCode: string): Observable<any> {
    ///sbis-poc/app/issues/1301
    let path = queryId + '/' + entityCode;
    return this.apiService.FetchAllQueryResult.getByPath(path);
  }


  handleNotification(query: any): Observable<any> {
    return this.apiService.HandleNotification.postByQuery(query);
  }

  handleAction(query: any): Observable<any> {
    return this.apiService.HandleAction.postByQuery(query);
  }


  // Working on app/issues/861

  getQueryByCategory(queryId: string): Observable<any>{
    return this.apiService.GetQueryByCategory.getByPath(queryId);

  }
  // End Working on app/issues/861

 
  
}
