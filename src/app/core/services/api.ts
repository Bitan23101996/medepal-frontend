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

import { IApiResponse } from './models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class Api<T> {

  constructor(protected http: HttpClient, protected actionUrl: string, protected TModel?: new (...args) => T) {
  }

  get(): Observable<IApiResponse> {
    let req = this.http.get<IApiResponse>(`${this.actionUrl}`)
    return this.getResponse(req);
  }
  
  getBySearchString(searchStr): Observable<IApiResponse> {
    let req = this.http.get<IApiResponse>(`${this.actionUrl}`+searchStr)
    return this.getResponse(req);
  }
    
  getByPath(path: any): Observable<IApiResponse> {
    let req = this.http.get<IApiResponse>(`${this.actionUrl}` + '/' + path)
    return this.getResponse(req);
  }


  getByQuery(query: any): Observable<IApiResponse> {
    let queryParams = this.createQueryParams(query);
    let req = this.http.get<IApiResponse>(`${this.actionUrl}`, {
      params: queryParams
    });
    return this.getResponse(req);
  }

  getByPathQuery(path:any , query: any): Observable<IApiResponse> {
    let queryParams = this.createQueryParams(query);
    let req = this.http.get<IApiResponse>(`${this.actionUrl}`+ '/' + path, {
      params: queryParams
    });
    return this.getResponse(req);
  }
 

  postByQuery(query: any): Observable<IApiResponse> {
    let req = this.http.post<IApiResponse>(`${this.actionUrl}`, query)
    return this.getResponse(req);
  }

  postByPathQuery(path: any , query: any): Observable<IApiResponse> {
    let req = this.http.post<IApiResponse>(`${this.actionUrl}`+ '?' + path, query)
    return this.getResponse(req);
  } 
  
  putByQuery(query: any): Observable<IApiResponse> {
    let req = this.http.put<IApiResponse>(`${this.actionUrl}`, query)
    return this.getResponse(req);
  }

  deleteByPath(path: any): Observable<IApiResponse> {
    let req = this.http.delete<IApiResponse>(`${this.actionUrl}` + '/' + path)
    return this.getResponse(req);
  }

  deleteByQuery(query: any): Observable<IApiResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: query
    };
    let req = this.http.delete<IApiResponse>(`${this.actionUrl}` , httpOptions)
    return this.getResponse(req);
  }

  upload(formdata: any): Observable<any> {
    const req = new HttpRequest('POST', `${this.actionUrl}`, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  getBlob(fileType: any, query: any = {}): Observable<any> {
    // const queryParams = this.createQueryParams(query);

    return this.http.post(this.actionUrl,query, {
      responseType: 'blob',
    }).map((res) => {
      return new Blob([res], { type: fileType });
    });

    // return this.http.get(this.actionUrl, {
    //   params: queryParams,
    //   responseType: 'blob',
    // }).map((res) => {
    //   return new Blob([res], { type: fileType });
    // });
  }



  private fromJson(toObject, json: any): T {
    return Object.assign(toObject, json);
  }

  private createQueryParams(query: any): HttpParams {
    let params = new HttpParams();

    for (const key in query) {
      params = params.append(key, query[key]);
    }

    return params;
  }

  private createRouteURL(routeParams: any): string {
    let urlResult = this.actionUrl;
    if (routeParams) {
      for (const param in routeParams) {
        const myRegExp = new RegExp(':' + param);
        urlResult = urlResult.replace(myRegExp, routeParams[param]);
      }
    }
    return urlResult;
  }
  
  private getResponse(req){
    if (this.TModel) {
      return req.map(response => {
        const objTModel = new this.TModel();
        response.data = this.fromJson(objTModel, response.data);
        return response;
      });
    }

    return req;
  }
}
