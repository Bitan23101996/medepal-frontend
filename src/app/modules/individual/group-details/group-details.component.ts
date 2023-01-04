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

import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IndividualService } from './../individual.service';
import { ModalService } from './../../../shared/directive/modal/modal.service'
import { ToastService } from './../../../core/services/toast.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SearchPipe } from 'src/app/shared/search.pipe';
import { AuthService } from '../../../auth/auth.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { SBISConstants } from "../../../SBISConstants";
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css'],
  providers: [FormGroupDirective]
})
export class GroupDetailsComponent implements OnInit {
  @ViewChild('memberGroupModal') memberGroupModal: TemplateRef<any>;
  @ViewChild('editGroupModal') editGroupModal: TemplateRef<any>;
  @ViewChild('viewMemberModal') viewMemberModal: TemplateRef<any>;

  user_id: any;
  groupId: any;
  groupUserId: any;
  minor: boolean = false;
  UserGroups: any = [];
  UserGroupsTable: any = [];
  qName: any = 'RELATION';
  allDataFetched: boolean = false;
  leaveGroupButton: any = true;
  groupOwnerName: any;
  userPopUp: any = {
    title: "",
    groupName: "",
    searchText: "",
    userSearchResultList: [],
    selectedExistingUserList: [],
    newUserList: [],
  }

  aa: boolean = false;
  searchKey = "";
  loginUserName = "";
  items: any = [];
  modalRef: BsModalRef;
  currentSelectedGroup: any = {
    groupName: "",
    groupId: 0
  };
  bulkActionDisabled: boolean = true;
  userFamilyMembers: any = [];
  checkboxChecked: any = { allChecked: false, rowBoxVal: [] };
  user_refNo: string;
  inviteSent: string;
  inviteAccepted: string;
  groupInvitationArr: any = [];
  isInvitationOpen: boolean = true;

  constructor(
    private _location: Location,
    private translate: TranslateService,
    private modalService: ModalService,
    private toastService: ToastService,
    private router: Router,
    private individualService: IndividualService,
    private bsModalService: BsModalService,
    private authService: AuthService,
    private broadcastService: BroadcastService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    this.bulkActionDisabled = true;
    let user = JSON.parse(localStorage.getItem('user'));
    // this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.loginUserName = user.userName;
    this.inviteSent = SBISConstants.GROUP.GROUP_INVITE_SENT;
    this.inviteAccepted = SBISConstants.GROUP.ACCEPTED;
    this.bulkActionDisabled = true;
    this.checkboxChecked.allChecked = false;
    this.broadcastService.setHeaderText('Groups');
    this.loadGroupById();
    this.searchKey = '';
    this.items = [

      {
        label: '',
        icon: 'fas fa-ellipsis-v',
        items: [
          { label: '', icon: 'fas fa-trash-alt cursor' },
          { label: '', icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];
    this.retrieveGroupInvitationList();
  }

  loadGroupById() {
    this.individualService.getGroupsByUserId(this.user_refNo)
      .subscribe(data => {
        if (data.status === 2000) {
          this.UserGroups = data.data;
          this.UserGroups.map((eachUserGroups, i) => {
            if (this.loginUserName === eachUserGroups.groupOwnerName) {
              eachUserGroups.displayUserName = 'Me';
            }
            else {
              eachUserGroups.displayUserName = eachUserGroups.groupOwnerName;
            }
            eachUserGroups.checked = false;
            //eachUserGroups.totalMembers = eachUserGroups;
            eachUserGroups.last_activityon = new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDay();
          });
          this.UserGroupsTable = this.UserGroups;
          this.allDataFetched = true;
        }
      }, (error) => {

      });
  }

  backClicked() {
    this._location.back();
  }

  openCreateGroupModal(id: string) {
    this.userPopUp.groupName = "";
    this.userPopUp.title = "Add Group";

    this.clearGroupPopUp();
    this.modalRef = this.bsModalService.show(this.memberGroupModal, { class: 'modal-xl', ignoreBackdropClick: true });
  }

  closeModal(id: string) {
    this.modalRef.hide();
  }

  validateGroup(groupMemberData: any = []) {
    if (this.userPopUp.groupName == "") {
      this.toastService.showI18nToast('USER_GROUP_TOAST.ENTER_GROUP_NAME', 'warning');
      return false;
    }

    if (this.userPopUp.newUserList.length > 0) {
      for (let item of this.userPopUp.newUserList) {
        if (!item.contactNo && item.emailAddress) {
          return true;
        }
        else if (item.contactNo.length != 13) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.NUMBER_MUST_BE_BETWEEN_10', 'warning');
          return false;
        }
        else if (!this.phoneValidation(item.contactNo)) {
          return false;
        }
        if (!item.emailAddress && item.contactNo) {
          return true;
        }
        else if (!this.emailValidation(item.emailAddress)) {
          return false
        }
        else if ((this.userPopUp.selectedExistingUserList.filter(x => x["userName"] == item.userName).length) > 0) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.DUPLICATE_USER', 'warning');
          return false;
        }
      }
    }
    return true;
  }
  saveGroup() {
    //this.userPopUp.groupName = this.eventValueName;
    let groupData = this.modalRef["groupData"];
    let groupMemberData = this.modalRef["groupMemberData"];
    if (this.userPopUp.newUserList.length > 0) {
      for (let groupMember of this.userPopUp.newUserList) {
        if (!groupMember.name && !groupMember.emailAddress && !groupMember.contactNo) {
          this.toastService.showI18nToast('Please fillup the fields', 'warning');
          return;
        }
      }
    }
    if (this.validateGroup(groupMemberData)) {
      if (this.userPopUp.newUserList.length > 0) {
        for (let groupMember of this.userPopUp.newUserList) {
          if (groupMember.emailAddress) {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(groupMember.emailAddress) == false) {
              this.toastService.showI18nToast('TOAST_MSG.INVALID_EMAIL', 'error');
              return false;
            }
          }
          if (!groupMember.name && !groupMember.emailAddress && !groupMember.contactNo) {
            this.toastService.showI18nToast('Please fillup the fields', 'warning');
            return;
          } else if ((groupMember.emailAddress || groupMember.contactNo) && !groupMember.name) {
            this.toastService.showI18nToast('Please enter the group member name', 'warning');
            return;
          } else if (!groupMember.emailAddress && !groupMember.contactNo && groupMember.name) {
            this.toastService.showI18nToast('Please enter email/phone', 'warning');
            return;
          }
        }
      }
      if (groupData) {
        this.saveExistingMember(groupData.userGrops[0].groupId);//changed because now id is null 
      } else {
        this.individualService.groupCreate({
          'userRefNo': this.user_refNo,
          'groupName': this.userPopUp.groupName
        }).subscribe(data => {
          if (data.status === 2000) {
            this.saveExistingMember(data.data.id);
            this.closeModal('create-group-modal');
          }
          else if (data.status === 5009) {
            this.toastService.showI18nToast('Group exists with name ' + this.userPopUp.groupName + '. Add members to existing group or use a different group name.', 'error');
            return;
          }
          else {
            this.toastService.showI18nToast('USER_GROUP_TOAST.PROBLEM_SAVING_DATA', 'error');
          }
        }, (error) => {

        });
      }
    }
    else {
      return false;
    }
  }
  saveExistingMember(groupId) {
    let saveMemberObj = [];

    let membertoAdd = this.userPopUp.selectedExistingUserList.filter(x => (x["userRefNo"] != this.user_refNo));


    membertoAdd.forEach(element => {
      saveMemberObj.push({
        relationshipName: element.relationshipName == null ? null : element.relationshipName.displayValue,
        groupId: groupId,
        // memberId: element.id
      });
    });
    let newUserCount = 0;

    this.userPopUp.newUserList.forEach(element => {

      let filterArray = this.userPopUp.newUserList.filter(e => e.emailAddress == element.emailAddress && e.contactNo == "" || e.contactNo == element.contactNo && e.emailAddress == "");
      if (filterArray.length > 1) {
        alert("Same email/phone no. not allowed multiple times");
        return false;
      }
      let query = {
        groupId: groupId,
        emailAddress: element.emailAddress,
        contactNo: element.contactNo,
        name: element.name,
        minor: element.minor
      }

      this.individualService.AddGroupUser(query).subscribe(data => {
        if (data.status === 2000) {
          this.closeModal('create-group-modal');
          this.ngOnInit();
          newUserCount = newUserCount + 1;
        }
        if (data.status == 5058) {
          this.toastService.showI18nToast(data.message, 'error');
        }
        if (newUserCount == this.userPopUp.newUserList.length) {
          this.toastService.showI18nToast(data.message, 'success');
        }
        else if (data.status === 2103) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.EMAIL_EXIST_IN_OTHER_ROLE', 'error');
        }

      });
    });

    if (saveMemberObj.length == 0) {
      let groupData = this.modalRef["groupData"];
      if (!groupData) this.toastService.showI18nToast('USER_GROUP_TOAST.GROUP_CREATED', 'success');
      this.closeModal('create-group-modal');
      this.ngOnInit();
      return;
    }
  }
  editGroup(id: string, groupN: any) {
    this.currentSelectedGroup.groupName = groupN.groupName;
    this.modalRef = this.bsModalService.show(this.editGroupModal, { class: 'modal-md', ignoreBackdropClick: true });
    this.modalRef["currentSelectedGroup"] = groupN;
  }

  onKeyCheckUserNameLength(group: any) {
    if (group.groupName != null && group.groupName.length > 20) {
      group.groupName = group.groupName.substr(0, 20);
      this.toastService.showI18nToast('USER_GROUP_TOAST.ENTER_MAX_20', 'warning');
    }
  }

  changeGroupName() {
    let currentSelectedGroup = this.modalRef["currentSelectedGroup"];

    if (this.currentSelectedGroup && this.currentSelectedGroup.groupName !== null) {
      currentSelectedGroup.groupName = this.currentSelectedGroup.groupName;
      currentSelectedGroup.userRefNo = this.user_refNo;
      currentSelectedGroup.groupId = currentSelectedGroup.userGrops[0].groupId;//id
      this.individualService.updateGroupName(currentSelectedGroup).subscribe(data => {
        if (data.status === 2000) {
          this.closeModal('edit-group-modal');
          this.ngOnInit();
        }
        this.toastService.showI18nToast(data.message, 'success');
        this.ngOnInit();
      }, (error) => {
      });
    } else {
      this.toastService.showI18nToast('USER_GROUP_TOAST.PROVIDE_NAME', 'warning');
    }
  }
  openModalAddMembers(groupData: any) {
    this.userPopUp.title = "Add Members";
    this.userPopUp.groupName = groupData.groupName;

    this.clearGroupPopUp();
    this.addUser();
    this.modalRef = this.bsModalService.show(this.memberGroupModal, { class: 'modal-xl', ignoreBackdropClick: true });
    this.modalRef["groupData"] = groupData;
    this.individualService.userFamilyListView({ 'groupId': groupData.userGrops[0].groupId }).subscribe((data) => {
      this.modalRef["groupMemberData"] = data.data;
    }, (error) => {
      // error msg
    });
  }

  clearGroupPopUp() {
    this.userPopUp.selectedExistingUserList = [];
    this.userPopUp.newUserList = [];
    this.userPopUp.searchText = "";
    this.userPopUp.userSearchResultList = [];
  }

  addUser() {
    let newUser = {
      userId: -1,
      userName: "",
      isUserExist: false,
      groupId: -1,
      relationshipName: "",
      firstName: "",
      lastName: "",
      age: 18,
      name: null,
      contactNo: null,
      emailAddress: null,
      minor: false
    }
    this.userPopUp.newUserList.push(newUser);
  }

  removeUser(index: number) {
    this.userPopUp.newUserList.splice(index, 1);

  }

  selectedUser(user: any) {
    if ((this.userPopUp.selectedExistingUserList.filter(x => x["userRefNo"] == user.userRefNo).length) == 0) {//id
      this.userPopUp.selectedExistingUserList.push(user);
    }
  }

  removeSelectedUser(index: number) {
    this.userPopUp.selectedExistingUserList.splice(index, 1);
  }

  emailExist(rowData: any) {
    this.authService.checkEmailExist(rowData.emailAddress).subscribe(data => {
      if (data.status === 5050) {
        rowData.isUserExist = true;
        // this.toastService.showI18nToast(data.status, rowData.emailAddress + " already exist in the system");
      } else {
        rowData.isUserExist = false;
      }
    });
  }

  contactNoExist(rowData: any) {
    let phoneNo = rowData.contactNo.replace('+', '%2B');
    this.authService.checkMobileNoExist(phoneNo).subscribe(data => {
      if (data.status === 5051) {
        rowData.isUserExist = true;
        // this.toastService.showI18nToast(data.status, rowData.contactNo + " already exist in the system");
      } else {
        rowData.isUserExist = false;
      }
    });
  }

  userSearch() {
    this.userPopUp.userSearchResultList = [];
    if (this.userPopUp.searchText == '') {
      this.toastService.showI18nToast('USER_GROUP_TOAST.ENTER_SOME_TEXT', 'warning');
      return;
    }
    else {
      this.individualService.searchUser({ q: this.userPopUp.searchText, pgno: 1, size: 100 }).subscribe(data => {
        if (data.status === 2000) {
          let user = JSON.parse(localStorage.getItem('user'));
          data.data.users.forEach(item => {
            if (user.userRefNo != item.userRefNo) {//id
              this.userPopUp.userSearchResultList.push(item);
            }
          });
        } else {
          this.toastService.showI18nToast(data.message, 'success');
        }
      }, (error) => {
        // show error
      });
    }

  }

  getCheckboxVal(checkVal, place: string) {
    if (place == 'all') {
      this.UserGroupsTable.map((eachUserGroups) => {
        eachUserGroups.checked = checkVal;
      });
    }
    var count = this.UserGroupsTable.filter(x => x["checked"]).length;
    if (count == this.UserGroupsTable.length) {
      this.checkboxChecked.allChecked = true;
    }
    else {
      this.checkboxChecked.allChecked = false;
    }
    if (count > 0) {
      this.bulkActionDisabled = false;
    }
    else {
      this.bulkActionDisabled = true;
    }


  }
  resetCheckbox() {
    let searchPipeVar = new SearchPipe();
    this.UserGroupsTable = searchPipeVar.transform(this.UserGroups, this.searchKey);

    this.UserGroupsTable.map((eachUserGroups) => {
      eachUserGroups.checked = false;
    });
    this.bulkActionDisabled = true;
    this.checkboxChecked.allChecked = false;

  }

  deleteGroup(group: any) {

    if (confirm('Are you sure you want to delete?')) {
      let query = [{
        'groupId': group.userGrops[0].groupId,//id
        'userRefNo': this.user_refNo
      }]
      this.groupDeleteServiceCall(query);

    }
  }


  groupDeleteServiceCall(query: any) {

    this.individualService.deleteGroup(query)
      .subscribe(data => {
        if (data.status === 2000) {
          this.ngOnInit();
        }
        this.toastService.showI18nToast(data.message, 'success');
      }, (error) => {

      });
  }

  phoneValidation(value) {
    if (isNaN(value)) {
      const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!value.match(phoneno)) {
        this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_PHONE_NUMBER', 'error');
        return false;
      }
    }
    return true;
  }

  emailValidation(value) {
    if (isNaN(value)) {
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(value) == false) {
        this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
        return false;
      }
    }
    return true;
  }

  /** Editted by supriyo
   * start
   */

  goToAddMember(group: any) {
    //  this.router.navigate(['/individual/user-family', group.id]);
    this.userPopUp.title = 'View Members';
    this.userFamilyMembers = [];
    if (group.groupId) {
      this.individualService.userFamilyListView(group.groupId).subscribe((data) => {
        this.processUserFamilyListView(data);
      }, (error) => {
        // error msg
      });
    }
    this.clearGroupPopUp();
    this.modalRef = this.bsModalService.show(this.viewMemberModal, { class: 'modal-lg', ignoreBackdropClick: true });
    // this.individualService.userFamilyListView(groupData.id).subscribe((data) => {
    //   this.modalRef["groupMemberData"] = data.data;
    // }, (error) => {
    //   // error msg
    // });
  }

  goToViewMembers(group: any) {
    localStorage.setItem("groupOwnerName", group.groupOwnerName);
    // console.log(group.id);
    this.router.navigate(['/individual/group-view-member', { "id": group.userGrops[0].groupId }]);//id
  }

  processUserFamilyListView(profileData: any) {
    if (profileData.status === 2000) {
      this.userFamilyMembers = profileData.data;
    } else {
      // handle response
    }
  }

  editMember(memberData) {
    //  this.individualService.setMemberData(memberData);
    // this.router.navigate(['/individual/add-user-family-member', memberData.groupId]);
    this.individualService.editUserMember({
      'userId': this.user_id,
      'userName': memberData.userName,
      'groupId': memberData.groupId,
      'relationshipName': memberData.relationshipName,
      'firstName': memberData.firstName,
      'lastName': memberData.lastName,
      'relationshipId': memberData.relationshipId,
      'age': memberData.age,
    }).subscribe(data => {
      // console.log(data);
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

  // deleteMember(memberParam: any) {
  //   if (confirm('are you sure you want to delete this member ?')) {
  //     this.individualService.deleteMember(memberParam).subscribe((data) => {
  //       if (data.status === 2000) {
  //         this.individualService.userFamilyListView(memberParam.groupId).subscribe((res) => {
  //           this.processUserFamilyListView(res);
  //           this.ngOnInit();
  //           this.toastService.showI18nToast(data.status, data.message);

  //         });
  //       }
  //     }, (error) => {
  //     });
  //   } else {
  //     // do nothing
  //   }

  // }
  /** Editted by supriyo
  * End
  */
  goToGroupPermission(group: any) {
    //  console.log(group.groupOwnerName);
    // console.log(this.loginUserName);
    localStorage.setItem("groupOwnerName", group.groupOwnerName);
    this.router.navigate(['/individual/group-permission', { "id": group.userGrops[0].groupId }]);//id
  }

  //Leave Group;
  leaveGroup(group) {
    if (confirm('Are you sure you want to Leave?')) {
      // console.log(group.id);
      let query = {
        'groupId': group.userGrops[0].groupId,//id
        'groupMemberRefNo': this.user_refNo
      }
      this.individualService.LeaveGroupUser(query)
        .subscribe(data => {
          if (data.status === 2000) {
            this.ngOnInit();
            this.toastService.showI18nToast('USER_GROUP_TOAST.LEAVE_SUCCESSFULL', 'success');
          } else {
            this.toastService.showI18nToast('USER_GROUP_TOAST.CANNOT_LEAVE_YOU_ARE_ADMIN', 'error');
          }

        }, (error) => {

        });
    }
  }

  changeName(event, type, index) {
    if (type == 'groupName') {
      this.userPopUp.groupName = event;
    }
    if (type == 'memberName') {
      this.userPopUp.newUserList[index].name = event;
    }
  }

  changeNumber(event, type, i) {
    if (event) {
      if (type == 'memberNumber') {
        this.userPopUp.newUserList[i].contactNo = event.internationalNumber.replace(/\s/g, "");
      }
    }
  }

  numberField(event, index) {
    this.userPopUp.newUserList[index].contactNo = event.target.value;
    // console.log(event.target.value);
  }

  retrieveGroupInvitationList() {
    this.individualService.retrieveGroupInvitations().subscribe((resp) => {
      if (resp.status == 2000) {
        this.groupInvitationArr = resp.data;
      }
    });
  }

  acceptGroupInvitation(invitationDetails) {
    this.individualService.acceptGroupInvitation({ 'verificationCode': invitationDetails.groupMobInviteCode }).subscribe((response) => {
      if (response.status == 2011) {
        this.toastService.showI18nToast('Invitation Accepted', 'success');
        this.retrieveGroupInvitationList();
      }
    });
  }

  rejectGroupInvitation(invitationDetails) {
    this.individualService.rejectGroupInvitation({ 'verificationCode': invitationDetails.groupMobInviteCode }).subscribe((rejResp) => {
      if (rejResp.status == 2000) {
        this.toastService.showI18nToast('Invitation Rejected', 'success');
        this.retrieveGroupInvitationList();
      }
    });
  }

  hideInvitationList() {
    this.isInvitationOpen = false;
  }

  showInvitationList() {
    this.isInvitationOpen = true;
  }

}
