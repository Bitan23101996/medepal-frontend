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
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class PharmacyRequisitionService {
    private editedMember: BehaviorSubject<any> = new BehaviorSubject(null);
    public memberData = this.editedMember.asObservable();

    constructor(private apiService: ApiService, private http: HttpClient) { }

    GetAppStatus(path) :Observable<any>{
        return this.apiService.GetAppStatus.getByPath(path);
    }

    getPharmacyPkByMsUserId(path) :Observable<any>{
        return this.apiService.GetPharmacyPkByMsUserId.getByPath(path);
    }

    getPharmacyRequisitionList(searchStr) :Observable<any>{
        return this.apiService.GetPharmacyRequisitionList.getBySearchString(searchStr);;
    }

    updatePharmacyRequestDetails(query:any) : Observable<any> {
        return this.apiService.UpdatePharmacyRequestDetails.postByQuery(query);
    }

    rejectPharmacyRequest(query:any) : Observable<any> {
        return this.apiService.RejectPharmacyRequest.postByQuery(query);
    }

    prescriptionDownload(query: any): Observable<any> {
        return this.apiService.PrescriptionDownload.postByQuery(query);
    }
}