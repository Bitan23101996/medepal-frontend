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

export class CustomFormService {

    constructor(private apiService: ApiService, private http: HttpClient) { }

    getOptionTypeList(): Observable<any> {
        return this.apiService.GetOptionTypeList.get();
    }

    saveCustomForm(query: any): Observable<any> {
        return this.apiService.SaveCustomForm.postByQuery(query);
    }
    GetFormList(): Observable<any> {
        return this.apiService.GetFormList.get();
    }
    GetCustomFormByRefNo(query: any): Observable<any> {
        return this.apiService.GetCustomFormByRefNo.postByQuery(query);
    }
    saveFilledUpForm(query: any): Observable<any> {
        return this.apiService.SaveFilledUpForm.postByQuery(query);
    }
    getFormListByUserRefNo(query: any): Observable<any> {
        return this.apiService.GetFormListByUserRefNo.postByQuery(query);
    }
    getQuestionResponseByUserRefNo(query: any): Observable<any> {
        return this.apiService.GetQuestionResponseByUserRefNo.postByQuery(query);
    }
    deleteCustomForm(query: any): Observable<any> {
        return this.apiService.DeleteCustomForm.postByQuery(query);
    }
}

