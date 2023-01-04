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
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { ApiService } from '../../../../core/services/api.service';
import { BroadcastService } from './../../../../core/services/broadcast.service';
import { SBISConstants } from "../../../../SBISConstants";

@Component({
  selector: 'app-group-permission',
  templateUrl: './group-permission.component.html',
  styleUrls: ['./group-permission.component.css']
})
export class GroupPermissionComponent implements OnInit {
  userFamilyMembers: any = [];
  groupMembers: any = [];
  groupId: any;
  user_id: any;
  groupOwnerName: any;
  loginUserName: any;
  leaveGroupButton : any = true;
  allDataFetched: boolean = false;
  qName: any = 'RELATION';
  relationList: any = [
    { name: 'Father', code: 'NY' },
    { name: 'Mother', code: 'RM' },
    { name: 'Wife', code: 'LDN' },
    { name: 'Friend', code: 'IST' },
    { name: 'Son', code: 'PRS' }
  ];
  user_refNo: string;
  inviteSent: string;

  constructor(
    private translate: TranslateService,
    private individualService: IndividualService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private apiService: ApiService,
    private broadcastService: BroadcastService
  ) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.loginUserName = user.userName;
    this.groupOwnerName = localStorage.getItem('groupOwnerName');
    console.log(this.groupOwnerName);
    this.inviteSent = SBISConstants.GROUP.GROUP_INVITE_SENT;
    if (this.groupOwnerName == this.loginUserName) {
      this.leaveGroupButton = false;
    }
    this.broadcastService.setHeaderText('Group Permission');
    this.groupId = this.activatedRoute.snapshot.params.id;
    this.individualService.userFamilyListView({'groupId': this.groupId}).subscribe((data) => {
      this.processUserFamilyListView(data);
      //console.log(data);
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
  }
  processUserFamilyListView(profileData: any) {
    if (profileData.status === 2000) {
      this.userFamilyMembers = profileData.data;
      this.groupMembers = profileData.data;
      this.userFamilyMembers = this.userFamilyMembers.filter(x => x['userRefNo'] != this.user_refNo);
      let loggedinUserOwner =  false;
      for(let groupmember of this.groupMembers){
        if(groupmember.userRefNo == this.user_refNo ){
          if("OWNER" == groupmember.groupRole )
             loggedinUserOwner = true;
          break;
        }
        groupmember['loggedinUserOwner'] = loggedinUserOwner;
     }
     let makeAdminBtn = 'None';  
     for(let groupmember of this.groupMembers){ 
        
         

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
    this.allDataFetched = true;
  }

  submitPermission( ) {
    let query ={
      groupId: +(this.groupId),
      userRefNo: this.user_refNo
    }
    let toBeUpdate :any= [] ;
    this.userFamilyMembers.forEach(v => {
      toBeUpdate.push(
        {
          forUserRefNo:v.groupPermission.forUserRefNo,
          editPermissionFlag:v.groupPermission.editPermissionFlag,
          viewPermissionFlag:v.groupPermission.viewPermissionFlag,
          notifyPermissionFlag: v.groupPermission.notifyPermissionFlag
        }
      );
    });

    query['permissions']= toBeUpdate;
    //console.log(toBeUpdate);
    if(toBeUpdate && toBeUpdate.length){
      this.apiService.SaveGroupUserPermission.postByQuery(query).subscribe(data => {
        if(data.result === 2000) {
          
        }
        this.toastService.showI18nToast('USER_GROUP_TOAST.SUCCESSFULL', 'success');
      });
    }
  }

  //Edit click with View:
  multipleClick( event ,groupPermission:any){
    if( event.target.checked ){
      event.target.checked = true
      groupPermission.editPermissionFlag = true
      groupPermission.viewPermissionFlag = true
    }else
   {
     event.target.checked = false
      groupPermission.editPermissionFlag = false
    }
  }

  leaveGroup() {
    if (confirm('Are you sure you want to Leave?')) {
      let query = {
        'groupId': this.groupId,
        'groupMemberRefNo': this.user_refNo
      }
      this.individualService.LeaveGroupUser(query)
        .subscribe(data => {
          if (data.status === 2000) {
            this.ngOnInit();
          }
          this.toastService.showI18nToast('USER_GROUP_TOAST.REQUEST_DONE_YOU_LEAVE', 'success');
        }, (error) => {

        });
    }
  }

  //method to make n revoke admin
  makeOrRevokeAdmin(memberData){
    if(memberData.makeAdmin == 'make Admin')
      this.makeAdminToMember(memberData);
    if(memberData.makeAdmin == 'revoke Admin')
      this.revokeMember(memberData);
  }//end of method

   //Make Admin
   makeAdminToMember(memberData){
    if (confirm('Are you sure you want to Make Admin?')) {
      let query = {
        'groupMemberRefNo': memberData.userRefNo,
        'groupId': memberData.groupId,
        //'groupMemberProfilePk': memberData.id
      }
      this.individualService.MakeAdminToMember(query)
        .subscribe(data => {
          if (data.status === 2000) {
            this.ngOnInit();
            this.toastService.showI18nToast('USER_GROUP_TOAST.ADMIN_GENERATED', 'success');
          }
        }, (error) => {

        });
    }
  }
  //Revoke Admin
  revokeMember(memberData){
    if (confirm('Are you sure you want to Make Revoke?')) {
      let query = {
        'groupId': memberData.groupId,
        'groupMemberRefNo': memberData.userRefNo,
        //'groupMemberProfilePk': memberData.id
      }
      this.individualService.RevokeAdminToMember(query)
        .subscribe(data => {
          if (data.status === 2000) {
            this.ngOnInit();
            this.toastService.showI18nToast('USER_GROUP_TOAST.REVOKE_DONE', 'success');
          }
        }, (error) => {

        });
    }
  }
  
  //Delete Member:
  deleteMember(memberParam: any) {
    if (confirm('are you sure you want to delete this member ?')) {
      let query = {
        'groupId': memberParam.groupId,
        'relationshipId': memberParam.relationshipId
      }
      this.individualService.deleteMember(query).subscribe((data) => {
        if (data.status === 2000) {
          this.individualService.userFamilyListView({'groupId': memberParam.groupId}).subscribe((res) => {
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

  //Edity member//;
  // editMember(memberData) {
  //   this.individualService.editUserMember({
  //     'userId': memberData.id,
  //     'userName': memberData.userName,
  //     'groupId': memberData.groupId,
  //     'relationshipName': memberData.relationshipName,
  //     'firstName': memberData.firstName,
  //     'lastName': memberData.lastName,
  //     'relationshipId': memberData.relationshipId,
  //     'age': memberData.age,
  //   }).subscribe(data => {
  //     console.log(data);
  //     if (data.status !== 2000) {
  //       this.toastService.showI18nToast(data.status, data.message);
  //       return;
  //     }
  //     this.individualService.userFamilyListView(memberData.groupId).subscribe((res) => {
  //       this.processUserFamilyListView(res);
  //     }, (error) => {
  //       // error msg
  //     });
  //     this.toastService.showI18nToast(data.status, data.message);
  //   }, (error) => {

  //   });
  // }

}
