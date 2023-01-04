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
export class PeerConsultingService {

  private editedMember: BehaviorSubject<any> = new BehaviorSubject(null);
  public memberData = this.editedMember.asObservable();

  constructor(private apiService: ApiService, private http: HttpClient) { }

  peerConsultingForDoc(path: any): Observable<any> {
    return this.apiService.PeerConsultingForDoc.getByPath(path);
  }
  PeerConsultingCreate(query: any): Observable<any> {
    return this.apiService.PeerConsultingCreate.postByQuery(query);
  }
  getPeerConsultingByDoc(path: any): Observable<any> {
    return this.apiService.GetPeerConsultingByDoc.getByPath(path);
  }
  peerConsultingComment(query: any): Observable<any> {
    return this.apiService.PeerConsultingComment.postByQuery(query);
  }
  peerConsultingDownloadFile(query: any): Observable<any> {
    return this.apiService.PeerConsultingDownloadFile.postByQuery(query);
  }
  patientDiagnosisDetails(path: any): Observable<any>{
    return this.apiService.PatientDiagnosisDetails.getByPath(path);
  }
}
