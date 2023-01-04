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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { IndividualService } from './../individual.service';
import { ModalService } from './../../../shared/directive/modal/modal.service'
import { ToastService } from './../../../core/services/toast.service';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-user-family-member',
  templateUrl: './add-user-family-member.component.html',
  styleUrls: ['./add-user-family-member.component.css']
})
export class AddUserFamilyMemberComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  addMember: FormGroup;
  formData = new FormData();
  user_id: any;
  UserGroups: any = [];
  submitted: Boolean = false;
  groupId: any;
  multipleMember: any = [];
  type: any;
  editedMemberData: any;
  editData: any;
  editMem: any = false;
  relationData: any;
  qName: any = 'RELATION';
  relationshipId: any;
  subscribe: any;

  constructor(
    private frb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private _location: Location,
    private individualService: IndividualService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private toastService: ToastService,
    private broadcastService: BroadcastService
  ) {
    this.addMember = frb.group({
      'firstName': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      'lastName': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      'userName': [null, [Validators.required, Validators.minLength]],
      'relation': [null, Validators.required],
      'groupId': [null, Validators.required],
      'age': [null, [Validators.max(150), Validators.min(0)]],
      'validate': ''
    });
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.individualService.getGroupsByUserId(this.user_id)
    .subscribe(data=> {
      if (data.status === 2000) {
        this.UserGroups = data.data;
      }
    }, (error) => {

    });
    this.individualService.getMasterDataRelation({q:this.qName}).subscribe((data) => {
      if (data.status === 2000) {
        this.relationData = data.data;
      } else {
        alert(data.message);
      }
    }, (error) => {
      // show error
    });
    this.subscribe = this.activatedRoute.params.subscribe(params => {
      this.groupId = params['groupId'];
      if (this.groupId) {
       this.addMember.patchValue({
         'groupId': this.groupId
       });
      }
    });
    this.editData  = this.individualService.memberData.subscribe((data) => {
      if (data) {
        this.editMem = true;
        this.relationshipId = data.relationshipId;
        this.addMember.patchValue({
         'firstName': data.firstName,
        'lastName': data.lastName,
        'userName': data.userName,
        'relation': data.relationshipName,
        'groupId': data.groupId,
        'age': data.age
        });
      }
    });
  }
  ngOnDestroy() {
    this.editData.unsubscribe();
  }
  // initItemRows() {
  //   return this.frb.group({
  //     // list all your form controls here, which belongs to your form array
  //     'firstName': [null, Validators.required],
  //     'lastName': [null, Validators.required],
  //     'userName': [null, [Validators.required, Validators.minLength]],
  //     'relation': [null, Validators.required],
  //     'groupId': [null, Validators.required],
  //     'validate': ''
  //   });
  // }
  // deleteRow(index: number) {
  //   // control refers to your formarray
  //   const control = <FormArray>this.addMember.controls['itemRows'];
  //   // remove the chosen row
  //   control.removeAt(index);
  // }

  // addNewRow() {
  //   // control refers to your formarray
  //   const control = <FormArray>this.addMember.controls['itemRows'];
  //   // add new formgroup
  //   control.push(this.initItemRows());
  // }


  goToUserGroup(value: any) {
    if (value === '99') {
      this.router.navigate(['/individual/group-details']);
    }
  }
  backClicked() {
    this._location.back();
  }
  // convenience getter for easy access to form fields
  get fcl() { return this.addMember.controls; }
  addMore (memberData: any) {
    this.multipleMember.push(memberData);
    this.addMember.reset();
  }
  editUserMember(memberData: any) {
    this.submitted = true;
    // stop here if form is invalid
     if (this.addMember.invalid) {
      return;
    }
    if(!this.phoneEmailValidation(memberData.userName)){
      return;
    }
    this.individualService.editUserMember({
      'userId': this.user_id,
      'userName': memberData.userName,
      'groupId': memberData.groupId,
      'relationshipName': memberData.relation,
      'firstName': memberData.firstName,
      'lastName': memberData.lastName,
      'relationshipId' : this.relationshipId,
      'age': memberData.age,
      }).subscribe(data=> {
        if (data.status != 2000) {
          this.toastService.showToast(data.status, data.message);
          return;
        }
        this.toastService.showToast(data.status, data.message);
        this.router.navigate(['/individual/user-family',this.groupId]);
      }, (error) => {

      });
  }
  checkUserName(memberForm: any) {
    if (memberForm.userName) {
      this.individualService.checkUsername(memberForm.userName).subscribe(data => {
        if (data) {
          if (data.status === 5002) {
            alert(data.message);
            this.addMember.patchValue({
              'userName': ''
            });
          }
          // show msg
        }
      }, (error) => {

      });
    }
  }
  addUserMembers(memberData: any) {
    this.submitted = true;
     // stop here if form is invalid
     if (this.addMember.invalid || !memberData.age) {
      this.addMember.get('age').markAsTouched({onlySelf: true});
      return;
    }
    if(!this.phoneEmailValidation(memberData.userName)){
      return;
    }
    this.individualService.addUserMember({
      'userId': this.user_id,
      'userName': memberData.userName,
      'groupId': memberData.groupId,
      'relationshipName': memberData.relation,
      'firstName': memberData.firstName,
      'lastName': memberData.lastName,
      'age': memberData.age
      }).subscribe(data => {
        if (data.status != 2000) {
          this.toastService.showToast(data.status, data.message);
          return;
        }
        this.toastService.showToast(data.status, data.message);
        this.router.navigate(['/individual/user-family',this.groupId]);
      }, (error) => {
        // show error
      });
    // submit the value get the data show on dashbpard
  }

  phoneEmailValidation(value){
    if (isNaN(value)) 
    {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(value) == false) 
        {
          this.toastService.showToast(-1,"Invalid Email");
            return false;
        }

        return true;
    }
   else if(value.length!=10){
      this.toastService.showToast(-1,"Phone number must have 10 digits");
      return false;
    }
    else{
      return true;
    }
  }


}
