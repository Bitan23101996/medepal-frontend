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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { IndividualService } from './../individual.service';
import { ModalService } from './../../../shared/directive/modal/modal.service';
import { ToastService } from './../../../core/services/toast.service';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.css']
})
export class UserProfileViewComponent implements OnInit {

  userProfileData: any;
  user_id: any;
  user_refNo: any;

  @ViewChild('tab') tab;
  subscribe: any;
  routeTabName="";

  constructor(private route: ActivatedRoute,  
    private frb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private _location: Location,
    private toastService: ToastService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private individualService :IndividualService) { 

     }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.loadUserProfile();
  }

  loadUserProfile(){
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((result) => {
      if (result.status === 2000) {
        this.userProfileData = result.data;
      } else {
        // handle response
      }
    }, (error) => {
      // show error
    });
  }

  backClicked() {
    this._location.back();
  }

  ngAfterViewInit() {
    this.subscribe = this.route.params.subscribe(params => {
      this.routeTabName = params['tabName'];
      setTimeout(() => {
        if(this.tab)
        this.tab.select(this.routeTabName);
      });
    });
  }

  // ngOnDestroy() {
  //   this.subscribe.unsubscribe();
  // }

  onTabChange(event){
    this.router.navigate(['/individual/user-profile-view',event.nextId]);
  }

  editAddress(tabName:string,addressId: any) {
    this.router.navigate(['/individual/user-profile-edit/'+tabName+'/'+addressId]);
  }
  editOccupation(tabName: string, occupationId: any) {
    this.router.navigate(['/individual/user-profile-edit/'+tabName+'/'+occupationId]);
  }

  modifyExercise(tabName: string,exerciseId: any) {
    console.log(exerciseId);
    this.router.navigate(['/individual/user-profile-edit/'+tabName+'/'+exerciseId]);
  }
  
  editProfile(tabName: string) {
    this.router.navigate(['/individual/user-profile-edit/'+tabName+'/-1']);
  }
  deleteAddress(address: any) {
    if (confirm('are you sure you want to delete this address ?')) {
      let query= {
        // 'userId': this.user_id,
        'userRefNo': this.user_refNo,
        'addressList': [address.id] 
      }
      this.individualService.deleteAddress(query).subscribe(data=> {
        if (data.status === 2000) {
          this.ngOnInit();
        } 
        this.toastService.showToast(data.status,data.message);
      });
    } else {
      // do nothing
    }
  }
  deleteExercise(exercise: any) {
    if (confirm('are you sure you want to delete this exercise ?')) {
      let query= {
        // 'userId': this.user_id,
        'userRefNo': this.user_refNo,
        'exerciseList': [exercise.id] 
      }
       this.individualService.deleteExercise(query).subscribe(data=> {
        if (data.status === 2000) {
          this.ngOnInit();
        } 
        this.toastService.showToast(data.status,data.message);
      }); 
    } else {
      // do nothing
    }
  }
  deleteOccupation(occupation: any) {
    if (confirm('are you sure you want to delete this occupation ?')) {
      let query= {
        // 'userId': this.user_id,
        'userRefNo': this.user_refNo,
        'occupationList': [occupation.id] 
      }
      this.individualService.deleteOccupation(query).subscribe(data=> {
        if (data.status === 2000) {
          this.ngOnInit();
        } 
        this.toastService.showToast(data.status,data.message);
      });
    } else {
      // do nothing
    }
  }

}
