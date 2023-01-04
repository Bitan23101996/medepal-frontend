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

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { FormGroup } from "@angular/forms";
import { ServerResponse } from '../server-response';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CommonService {

constructor(private http: HttpClient){
}

handleResponse(res): ServerResponse {
  const data = res;
  if (data.error) {
    // const error: Error = { error: data.error, message: data.message };
    // throw new Error(this.errorHandler.parseCustomServerErrorToString(error));
  } else {
    return data;
  }
}
//saveUrl="http://samik-pc:8001/save-doctor-info";
saveUrl="http://samik-pc:9091/save-doctor-info";
getEmailid="http://samik-pc:9091/if-exists-email/";

  saveDoc(doctorForm){
    this.http.post(this.saveUrl, JSON.stringify(doctorForm.value), httpOptions)
    .toPromise()
    .then(res => {
      console.log(JSON.stringify(res));
      alert("Saved Successfully");
    })
  }
  //.pipe(map((this.handleResponse)), catchError(error => Observable.throw(error)))


  apiUrl = environment.apiUrl;
  downloadFile(payload): Observable<any>{		
		return this.http.post(this.apiUrl+'gen/v3/common/generateReport', payload, { responseType: 'blob' });
   }

}


