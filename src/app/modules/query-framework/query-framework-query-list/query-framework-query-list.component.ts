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
//sbis-poc/app/issues/861

import { Component, OnInit } from '@angular/core';
import { QueryFrameworkService } from '../query-framework.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-query-framework-query-list',
  templateUrl: './query-framework-query-list.component.html',
  styleUrls: ['./query-framework-query-list.component.css']
})
export class QueryFrameworkQueryListComponent implements OnInit {
  optionGroupedQueryes = [];
  loading: boolean = false;
  queryForm = this.fb.group({
    'queries': [null]
  });
  queryListByCategory:any
  constructor(public queryFrameworkService :QueryFrameworkService,public toastService:ToastService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.getQueryByCategory()
  }

  openQueryComponent(queryId){
    console.log("queryId::",queryId);
    
    this.router.navigate(['custom-analytic-query/query',queryId ]);
  }

  getQueryByCategory(){
    let user = JSON.parse(localStorage.getItem('user'));
    this.queryFrameworkService.getQueryByCategory(user.parentRoleName)
    .subscribe(res => {
      this.queryListByCategory=res.data;
      
      for(let i=0; i < this.queryListByCategory.length; i++){
        let queryGroup = this.queryListByCategory[i];
        let group = {"label" : queryGroup["queryCategoryName"]};
        let items = [];
        let singleWidgetQueryRecords = queryGroup["singleWidgetQueryRecord"];
        for(let j=0; j < singleWidgetQueryRecords.length; j++){
          let singleWidgetQueryRecord = singleWidgetQueryRecords[j];
          let option = {label: singleWidgetQueryRecord["queryName"], value: singleWidgetQueryRecord["queryId"]}
          items.push(option);
        }
        group["items"] = items;
        this.optionGroupedQueryes.push(group)
      }
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    },
    (error) => {
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
      return;
    });
  }

}
