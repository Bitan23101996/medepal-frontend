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
import { ApiService } from "../../core/services/api.service";
import { HttpClient } from "selenium-webdriver/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DeliveryService {

    constructor(private apiService: ApiService) { }
    
    getPharmacyPkByMsUserId(path) :Observable<any>{
        return this.apiService.GetPharmacyPkByMsUserId.getByPath(path);
    }

    getAppStatus(path) :Observable<any>{
        return this.apiService.GetAppStatus.getByPath(path);
    }

    getReasonList(reasonCodeFor) :Observable<any>{
        return this.apiService.GetReasonList.getByPath(reasonCodeFor);
    }

    getOrderDeliveryList(searchStr) :Observable<any>{
        return this.apiService.GetOrderDeliveryList.getBySearchString(searchStr);;
    }

    saveDelivery(query:any) : Observable<any> {
        return this.apiService.SaveDelivery.postByQuery(query);
    }
    
    getDeliveryFlow(query:any) : Observable<any> {
        return this.apiService.GetDeliveryFlow.postByQuery(query);
    }
    getDeliveryFlowv2(query:any) : Observable<any> {
        return this.apiService.GetDeliveryFlowv2.postByQuery(query);
    }

    downloadDocument(query: any): Observable<any> {
        return this.apiService.DownloadDocument.postByQuery(query);  
    }
    
}    
