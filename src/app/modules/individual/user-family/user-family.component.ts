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
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { IndividualService } from './../individual.service';
import { ToastService } from './../../../core/services/toast.service';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { ModalService } from './../../../shared/directive/modal/modal.service'

@Component({
  selector: 'app-user-family',
  templateUrl: './user-family.component.html',
  styleUrls: ['./user-family.component.css']
})
export class UserFamilyComponent implements OnInit {
  userFamilyMembers: any = [];
  groupId: any;
  relationData: any;
  qName: any = 'RELATION';
  searchUser: any;
  userList: any = [];
  addedUsers: any = [];
  persisRelation: any='';
  subscribe: any;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    private individualService: IndividualService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private modalService: ModalService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }
  ngOnInit() {
    this.subscribe = this.activatedRoute.params.subscribe(params => {
      this.groupId = params['groupId'];
      if (this.groupId) {
        this.individualService.userFamilyListView(this.groupId).subscribe((data) => {
          this.processUserFamilyListView(data);
        }, (error) => {
          // error msg
        });
      }
    });
    this.individualService.getMasterDataRelation({q:this.qName}).subscribe((data) => {
      if (data.status === 2000) {
        this.relationData = data.data;
        //this.persisRelation = this.relationData[0].attributeValue;
      } else {
        alert(data.message);
      }
    }, (error) => {
      // show error
    });
  }
  backClicked() {
    this._location.back();
  }
  setRelation (relation: any) {
   
    this.persisRelation = relation;
  }
  createGroup () {
    this.router.navigate(['/individual/group-details']);
  }
  processUserFamilyListView(profileData: any) {
    if (profileData.status === 2000) {
      this.userFamilyMembers = profileData.data;
    } else {
      // handle response
    }
  }
  addExistinguser (userData: any) {
    if(this.persisRelation==''){
      this.toastService.showToast(-1,'Relation cannot be blank');
        return;
    }
    else{
      console.log(this.persisRelation);
    this.individualService.addExistingUserInGroup({
      'relationshipName' : this.persisRelation,
      'groupId': this.groupId,
      'memberIds': [userData.id]
    }).subscribe(data => {
      if (data.status === 2000) {
        this.ngOnInit();
        this.toastService.showToast(data.status,data.message);
        this.addedUsers.splice(userData);
      }
    }, (error) => {

    });
    }
    
  }
  clearData () {
    this.addedUsers = [];
    this.searchUser = [];
    this.userList = [];
  }
  removeUser (user) {
    const a = this.addedUsers.filter((e) => {
      return e.id === user.id;
    });
    a.splice(0, 1);
  }
  addFamilyMember() {
    this.individualService.setMemberData(null);
    this.router.navigate(['/individual/add-user-family-member', this.groupId]);
  }
  editMember(memberData) {
    this.individualService.setMemberData(memberData);
    this.router.navigate(['/individual/add-user-family-member', this.groupId]);
  }
  deleteMember(memberParam: any) {
    if (confirm('are you sure you want to delete this member ?')) {
      this.individualService.deleteMember(memberParam).subscribe((data) => {
        if (data.status === 2000) {
          this.toastService.showToast(data.status,data.message);
          this.ngOnInit();
        }
      }, (error) => {
  
      });
    } else {
      //do nothing
    }
    
  }
  addExistingFamilyMember(id: any) {
    if (id) {
      this.modalService.open(id);
    } else {
      console.error('no modal id');
    }
  }
  closeModal(id: any) {
    if (id) {
      this.modalService.close(id);
      this.clearData();
    } else {
      console.error('no modal id');
    }
  }
  selectUser (user: any) {
    this.persisRelation='';
   if((this.addedUsers.filter(x=>x["id"] ==user.id).length)==0){
      this.addedUsers.pop();
      this.addedUsers.push( user);
    }
  }
  userSearch(text: any) {
    if(text==''){
      this.toastService.showToast(-1,'Please enter some text here');
      return;
    }
    else{
      this.individualService.searchUser({q:text, pgno: 1 ,size: 100}).subscribe(data => {
        if (data.status === 2000) {
          this.userList = data.data.users;
        } else {
          this.toastService.showToast(data.status,data.message);
        }
      }, (error) => {
        // show error
      });
    }
    
  }

}
