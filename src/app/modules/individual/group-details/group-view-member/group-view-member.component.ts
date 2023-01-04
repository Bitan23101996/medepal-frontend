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
import { TranslateService } from '@ngx-translate/core';
import { IndividualService } from '../../../individual/individual.service';
import { group } from '@angular/animations';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { BroadcastService } from '../../../../core/services/broadcast.service';
import { SBISConstants } from "../../../../SBISConstants";

@Component({
  selector: 'app-group-view-member',
  templateUrl: './group-view-member.component.html',
  styleUrls: ['./group-view-member.component.css']
})
export class GroupViewMemberComponent implements OnInit {

  userFamilyMembers: any = [];
  groupId: any;
  user_id: any;
  loginUserName: any;
  leaveGroupButton : any = true;
  groupOwnerName : any;
  allDataFetched: boolean = false;
  qName: any = 'RELATION';
  relationList: any = [
    { name: 'Fother', code: 'NY' },
    { name: 'Mother', code: 'RM' },
    { name: 'Wife', code: 'LDN' },
    { name: 'Friend', code: 'IST' },
    { name: 'Son', code: 'PRS' }
  ];

  constructor(
    private translate: TranslateService,
    private individualService: IndividualService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private broadcastService: BroadcastService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
   }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    // console.log(user);
    this.loginUserName = user.userName;
    this.groupOwnerName = localStorage.getItem('groupOwnerName');
    if (this.groupOwnerName == this.loginUserName) {
      this.leaveGroupButton = false;
    }
    this.broadcastService.setHeaderText('Group View Members');
    this.groupId = this.activatedRoute.snapshot.params.id;
    this.individualService.userFamilyListView(this.groupId ).subscribe((data) => {
      this.processUserFamilyListView(data);
    }, (error) => {
      //error msg
    });

    this.individualService.getMasterDataRelation({ q: SBISConstants.MASTER_DATA.RELATION }).subscribe((data) => {
      if (data.status === 2000) {
        this.relationList = data.data;
        this.relationList.forEach(item => {
          item["label"] = item.displayValue;
        });
      } else {
        this.toastService.showI18nToast(data.message, 'success');
      }
    }, (error) => {
      // show error
    });
   this.allDataFetched =true;
  }

  processUserFamilyListView(profileData: any) {
    if (profileData.status === 2000) {

      this.userFamilyMembers = profileData.data;
       let loggedinUserOwner =  false;
       for(let groupmember of this.userFamilyMembers){
          if(groupmember.id == this.user_id ){
            if("OWNER" == groupmember.groupRole )
               loggedinUserOwner = true;
            break;
          }
          groupmember['loggedinUserOwner'] = loggedinUserOwner;
       }

       let makeAdminBtn = 'None';  
       for(let groupmember of this.userFamilyMembers){ 
          
           

          if("OWNER" == groupmember.groupRole && loggedinUserOwner)
             makeAdminBtn = 'revoke Admin';
          if("OWNER" != groupmember.groupRole && loggedinUserOwner)
            makeAdminBtn = 'make Admin';

          if(groupmember.id == this.user_id )
            makeAdminBtn = 'None';

          groupmember['makeAdmin'] = makeAdminBtn;
        }
    

       
      
    } else {
      // handle response
    }
  }

  deleteMember(memberParam: any) {
    if (confirm('are you sure you want to delete this member ?')) {
      this.individualService.deleteMember(memberParam).subscribe((data) => {
        if (data.status === 2000) {
          this.individualService.userFamilyListView(memberParam.groupId).subscribe((res) => {
            this.processUserFamilyListView(res);
            this.ngOnInit();
            this.toastService.showI18nToast(data.message, 'success');

          });
        }
      }, (error) => {
      });
    } else {
      // do nothing
    }

  }

  editMember(memberData) {
    //  this.individualService.setMemberData(memberData);
    // this.router.navigate(['/individual/add-user-family-member', memberData.groupId]);
    this.individualService.editUserMember({
      'userId': memberData.id,
      'userName': memberData.userName,
      'groupId': memberData.groupId,
      'relationshipName': memberData.relationshipName,
      'firstName': memberData.firstName,
      'lastName': memberData.lastName,
      'relationshipId': memberData.relationshipId,
      'age': memberData.age,
    }).subscribe(data => {
      console.log(data);
      if (data.status !== 2000) {
        this.toastService.showI18nToast(data.message, 'error');
        return;
      }
      this.individualService.userFamilyListView(memberData.groupId).subscribe((res) => {
        this.processUserFamilyListView(res);
      }, (error) => {
        // error msg
      });
      this.toastService.showI18nToast(data.message, 'success');
    }, (error) => {

    });
  }
  //Make Admin
  makeAdminToMember(memberData){
    if (confirm('Are you sure you want to Make Admin?')) {
      let query = {
        'groupId': memberData.groupId,
        'groupMemberProfilePk': memberData.id
      }
      this.individualService.MakeAdminToMember(query)
        .subscribe(data => {
          if (data.status === 2000) {
            this.ngOnInit();
          }
          this.toastService.showI18nToast('USER_GROUP_TOAST.ADMIN_GENERATED', 'success');
        }, (error) => {

        });
    }
  }
  //Revoke Admin
  revokeMember(memberData){
    if (confirm('Are you sure you want to Make Revoke?')) {
      let query = {
        'groupId': memberData.groupId,
        'groupMemberProfilePk': memberData.id
      }
      this.individualService.RevokeAdminToMember(query)
        .subscribe(data => {
          if (data.status === 2000) {
            this.ngOnInit();
          }
          this.toastService.showI18nToast('USER_GROUP_TOAST.REVOKE_DONE', 'success');
        }, (error) => {

        });
    }
  }

}
