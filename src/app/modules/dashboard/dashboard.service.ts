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
import { environment } from './../doctor/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService, private http: HttpClient) { }
  //https://gitlab.com/sbis-poc/app/issues/853 --[dashboard issue(request method has been changed to POST call)]
  getDashboardWidgetList(query): Observable<any> { //rolePk,userProfilePk
    // return this.apiService.getDashboardWidgetList.getByPath(rolePk+"/"+userProfilePk);
    return this.apiService.getDashboardWidgetList.postByQuery(query);
  }//end of method
}//end of class
