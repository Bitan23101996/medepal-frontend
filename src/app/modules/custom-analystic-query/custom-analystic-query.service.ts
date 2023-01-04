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
// /sbis-poc/app/issues/936
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAnalysticQueryService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getQueryScenario(role) : Observable<any> {
    return this.apiService.GetQueryScenario.getByPath(role);
  }

  fetchAllParamsDataForTypeAhead(query) : Observable<any> {
    return this.apiService.FetchAllParamsDataForTypeAhead.postByQuery(query);
  }

  fetchAllParamsDoctorDataForTypeAhead(query) : Observable<any> {
    return this.apiService.FetchAllDoctorParamsDataForTypeAhead.postByQuery(query);
  }

  
  fetchQueryColumnsScenarioRefNo(query) : Observable<any> {
    return this.apiService.FetchQueryColumnsScenarioRefNo.postByQuery(query);
  }

  fetchAllParamsDataByParam(query) : Observable<any> {
    return this.apiService.FetchAllParamsDataByParam.postByQuery(query);
  }
  
  fetchCustomAnalysticResultList(query): Observable<any> {
    return this.apiService.FetchCustomAnalysticResultList.postByQuery(query);
  }

  // Working on app/issue/2202
  getDefaultParamsByQueryId(query): Observable<any> {
    return this.apiService.GetDefaultParamsByQueryId.postByQuery(query);
  }
}
