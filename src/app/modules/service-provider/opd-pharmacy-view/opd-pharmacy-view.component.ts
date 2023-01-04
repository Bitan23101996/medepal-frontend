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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ServiceProviderService } from '../service-provider.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-opd-pharmacy-view',
  templateUrl: './opd-pharmacy-view.component.html',
  styleUrls: ['./opd-pharmacy-view.component.css']
})
export class OpdPharmacyViewComponent implements OnInit {

  serviceProviderData: any;
  user_id: any;
  userRoleName: any;
  role: any;
  pharmacyTimingList: any;
  allDataFetched: boolean = false;

  constructor(private route: ActivatedRoute,private router: Router,private translate: TranslateService,
    private toastService: ToastService,private _serviceProviderService: ServiceProviderService,
    private broadcastService: BroadcastService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("user",user);
    
    if (user) {
      this.user_id = user.id;
      this.role = user.roleName;
    }

    if(this.route.snapshot.paramMap.get("isUpdate") == "Y"){
      //this.toastService.showToast(2000, 'Record Updated Successfully.');
      this.toastService.showI18nToast('OPD_PHARMACY.OPD_PHARMACY_UPDATE_SUCCESS', 'success');
    }

    const url = window.location.href.toString();
    if (url.indexOf('/pharmacy') > 0) {
      this.userRoleName = "Pharmacy";
      this.user_id=user.userId;
      this.broadcastService.setHeaderText(this.userRoleName+' Details');
    }else if (url.indexOf('/diagnostics') > 0){
      this.userRoleName = "Diagnostics";
      this.user_id=user.userId;
      this.broadcastService.setHeaderText(this.userRoleName+' Details');
    }else if (url.indexOf('/opd') > 0){
      this.userRoleName = "Hospital";
      this.broadcastService.setHeaderText('OPD Details');
    }
    // Service provider ref no - issue app#604
    let request={
      "serviceProviderRef":user.serviceProviderRefNo,
      "parentRoleName":this.userRoleName
    }

    this._serviceProviderService.getServiceProviderEntityValueByPk(request).subscribe(res =>{
        console.log(res);
        this.serviceProviderData = res.data;
        this.showSample("INV");
        this.showSample("ADM");
        this.broadcastService.setServiceProviderName(this.serviceProviderData.name);
        if (url.indexOf('/pharmacy') > 0) {
          this.pharmacyTimingList = res.data.pharmacyTimingWeekViewList;
        }  
        if (url.indexOf('/diagnostics') > 0) {
          this.pharmacyTimingList = res.data.pharmacyTimingWeekViewList;
        }
        this.allDataFetched = true;
    });

    // app/issues/935
    if (url.indexOf('opd/opdPharmacyView/opd') > 0) {
      document.body.classList.remove('started-screen');
    }
    // End app/issues/935
  }

  showInvSample: any = "";
  showAdmSample: any = "";
  showSample(doc){
    let date = new Date();
    var mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    let today = [day, mnth, date.getFullYear()].join("");
    if(doc=="INV"){
      let prefix = this.serviceProviderData.invoiceSettingRule.docPrefix;
      this.showInvSample = prefix+"-"+today+"-0001"
    }
    if(doc=="ADM"){
      let prefix = this.serviceProviderData.admissionSettingRule.docPrefix;
      this.showAdmSample = prefix+"-"+today+"-0001"
    }

  }

  editServiceProvider(){
    if(this.userRoleName === "Hospital"){
      this.router.navigate(['opd/my-service-provider/myOpd']);
    }else if(this.userRoleName === "Pharmacy"){
      this.router.navigate(['opd/my-service-provider/myPharmacy']);
    }else if(this.userRoleName === "Diagnostics"){
      this.router.navigate(['opd/my-service-provider/myDiagnostics']);
    }
  }
}
