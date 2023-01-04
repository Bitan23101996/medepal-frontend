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
export class BillingService {
    constructor(private apiService: ApiService) { }

    getBillingPlanList(): Observable<any> {
        return this.apiService.GetBillingPlanList.get();
    }
    getIpAddress(): Observable<any> {
        return this.apiService.GetIpAddress.get();
    }
    saveBillingPlanForDoctor(query) : Observable<any> {
        return this.apiService.SaveBillingPlanForDoctor.postByQuery(query);
    }
    saveDoctorContract(query) : Observable<any> {
        return this.apiService.SaveDoctorContract.postByQuery(query);
    }
    getMyBillingPlan(): Observable<any> {
        return this.apiService.GetMyBillingPlan.get();
    }
    getMyBills(query): Observable<any> {
        return this.apiService.GetMyBills.postByQuery(query);
    }
    getBillingUnitList(): Observable<any> {
        return this.apiService.GetBillingUnitList.get();
    }
    getMyBillDetailsView(query): Observable<any> {
        return this.apiService.GetMyBillDetailsView.postByQuery(query);
    }


    generateMyBill(query): Observable<any> {
        return this.apiService.GenerateMyBill.postByQuery(query);
    }

    //Working on app/issues/1412
    getDoctorBillingSummary(): Observable<any> {
        return this.apiService.GetDoctorBillingSummary.get();
    }
    //End Working on app/issues/1412

    //Working on app/issues/1758  
    getBillingPlanListV2(): Observable<any> {
        return this.apiService.GetBillingPlanListV2.get();
    }
    //End Working on app/issues/1758  

    //working on https://gitlab.com/sbis-poc/app/-/issues/2109
    SaveSPBillingPlan(reqBody: any): Observable<any> {
        return this.apiService.SaveSPBillingPlan.postByQuery(reqBody);
    }

    GetSPBillingPlan(reqBody:any): Observable<any> {
        return this.apiService.GetSPBillingPlan.postByQuery(reqBody);
    }

    GetSPBillingPlanDetails(): Observable<any> {
        return this.apiService.GetSPBillingPlanDetails.get();
    }
    GetSPBillingSummary(): Observable<any> {
        return this.apiService.GetSPBillingSummary.get();
    }
    GetSPBillDetailsView(reqBody:any): Observable<any> {
        return this.apiService.GetSPBillDetailsView.postByQuery(reqBody);
    }

    //end of working on https://gitlab.com/sbis-poc/app/-/issues/2109
}
