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
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PeerConsultingService } from '../../peer-consulting/peer-consulting.service';
import { ToastService } from '../../../core/services/toast.service';
import { GetSet } from '../../../core/utils/getSet';
import { TranslateService } from '@ngx-translate/core';
import { FormGroupDirective } from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-peer-consulting-request',
  templateUrl: './peer-consulting-request.component.html',
  styleUrls: ['./peer-consulting-request.component.css'],
  providers: [FormGroupDirective]
})
export class PeerConsultingRequestComponent implements OnInit {

  userRefNumber: any;
  patientDetails: any;
  mobileNo: any;
  emailId: any;
  consultingMsg: any;
  inviteMsg: any;
  inviteDocs: any = [];
  docDetailsField: any = {
    docName: "",
    mobileNo: "",
    emailId: "",
    newDocList: []
  };

  constructor(
    // private frb: FormBuilder,
    private broadcastService: BroadcastService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private peerConsultingService: PeerConsultingService,
    private router: Router,
    private translate: TranslateService,
    private _location: Location
  ) {
    // this language will be used as a {{ 'LOGIN.LOGIN_HEADER' | translate }}llback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn{{ 'LOGIN.LOGIN_HEADER' | translate }} available, it will use the current loader to get them
    translate.use('en');
   }

  ngOnInit() {
    this.broadcastService.setHeaderText('Peer Consulting Request');
    this.createSearchInputField();
    let user = JSON.parse(localStorage.getItem('user'));
    this.userRefNumber = user.refNo;
    let patient = GetSet.getPatientDetails();
    this.patientDetails = JSON.parse(patient);
  }//end of method

  createSearchInputField() {
    let newDoc = {
      docName: "",
      mobileNo: "",
      emailId: ""
    }
    this.docDetailsField.newDocList.push(newDoc);
  }//end of method

  addPeerConsulting() {
    let pathData: any;
    let lastIndex: number = this.docDetailsField.newDocList.length - 1;
    let formControl = this.docDetailsField.newDocList[lastIndex];
    
    if (!formControl.docName && !formControl.mobileNo && !formControl.emailId) {
      this.toastService.showI18nToast("PEER_CONSLT.PLEASE_FILLOUT_FIELDS", 'warning');
      return;
    } else if (formControl.docName && !formControl.mobileNo && !formControl.emailId) {
      this.toastService.showI18nToast("PEER_CONSLT.ENTER_EMAIL_MOBILE", 'warning');
      return;
    } else if(!formControl.docName) {
        this.toastService.showI18nToast("PEER_CONSLT.ENTER_DOC_NAME", 'warning');
        return;
    } else if (formControl.mobileNo && !formControl.emailId ) {
        if (formControl.mobileNo.length != 13) {
          this.toastService.showI18nToast("PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT", 'warning');
          return;
      }
      pathData = formControl.mobileNo;
    } else if (!formControl.mobileNo && formControl.emailId) {
      if (isNaN(formControl.emailId)) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(formControl.emailId) == false) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
          return;
        }
      }
      pathData = formControl.emailId;
    } else if (formControl.mobileNo && formControl.emailId) {
        if (formControl.mobileNo.length != 13) {
          this.toastService.showI18nToast("PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT", 'warning');
          return;
        }
        if (isNaN(formControl.emailId)) {
          const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          if (reg.test(formControl.emailId) == false) {
            this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
            return;
          }
        }
        pathData = formControl.mobileNo;
    }
    for(let searchUser of this.inviteDocs) {
      if(searchUser.emailAddress == pathData  || searchUser.contactNo == pathData ) {
        return;
      }
    }
    this.peerConsultingService.peerConsultingForDoc(pathData).subscribe((result) => {
      if(result.status != 2000) {
        if (formControl.docName && formControl.mobileNo && formControl.emailId) {
          let pathData = formControl.emailId;
          for(let searchUser of this.inviteDocs) {
            if(searchUser.emailAddress == pathData  || searchUser.contactNo == pathData ) {
              return;
            }
          }
          this.peerConsultingService.peerConsultingForDoc(pathData).subscribe(resp => {
            if (resp.status == 2000) {
              formControl.docName = resp.data.name;
              let queryForInviteDoc = {
                'emailAddress': resp.data ?resp.data.primaryEmailAddress: formControl.emailId,
                'contactNo': resp.data ? resp.data.primaryContactNo: formControl.mobileNo,
                'name': resp.data ? resp.data.name: formControl.docName
              }
              formControl.docName = resp.data ? resp.data.name: formControl.docName;
              this.inviteDocs.push(queryForInviteDoc);
              if(formControl.emailId == pathData) {
                formControl.mobileNo = "";
              }
              if(formControl.mobileNo == pathData) {
                formControl.emailId = "";
              }
            }
          })
        } else {
          formControl.docName = result.data ? result.data.name: formControl.docName;
          let queryForInviteDoc = {
            'emailAddress': result.data ? result.data.primaryEmailAddress: formControl.emailId,
            'contactNo': result.data ? result.data.primaryContactNo: formControl.mobileNo,
            'name': result.data ? result.data.name: formControl.docName
          }
          this.inviteDocs.push(queryForInviteDoc);
        }
      } else {
        formControl.docName = result.data ? result.data.name: formControl.docName;
        let queryForInviteDoc = {
          'emailAddress': result.data ?result.data.primaryEmailAddress: formControl.emailId,
          'contactNo': result.data ? result.data.primaryContactNo: formControl.mobileNo,
          'name': result.data ? result.data.name: formControl.docName
        }
        this.inviteDocs.push(queryForInviteDoc);
        formControl.docName = result.data ? result.data.name: formControl.docName;
        if(formControl.emailId == pathData) {
          formControl.mobileNo = "";
        }
        if(formControl.mobileNo == pathData) {
          formControl.emailId = "";
        }
        //this.toastService.showI18nToast('successfull!', 'success');
      }
    });
    //this.createSearchInputField();
  }//end of method

  sendRequest() {
    if (!this.consultingMsg) {
      this.toastService.showI18nToast("PEER_CONSLT.WRITE_DIAGNOSIS", 'warning');
      return;
    }
    let formValue = this.docDetailsField.newDocList;
    if(formValue.length == 1 && formValue[0].docName == "" && formValue[0].mobileNo == "" && formValue[0].emailId == "") {
      this.toastService.showI18nToast("PEER_CONSLT.ADD_DOC_FOR_RQST", 'warning');
      return;
    }
    if (!this.inviteMsg) {
      this.toastService.showI18nToast("PEER_CONSLT.WRITE_INVITE_MSG", 'warning');
      return;
    }
    let query = {
      'doctorRefNo': this.userRefNumber,
      'patientRefNo': this.patientDetails.ref_no,
      'consultingMessage': this.consultingMsg,
      'inviteMessage': this.inviteMsg,
      'inviteDoctors': this.inviteDocs
    }
    this.peerConsultingService.PeerConsultingCreate(query).subscribe((resp) => {
      if (resp.status == 2000) {
        this.router.navigate(['peerconsulting/peer-consulting-panel-list']);
        //do nothing
      }
    });
  }//end of method

  removeDoc(index: number) {
    this.inviteDocs.splice(index, 1);
    if(this.docDetailsField.newDocList.length == 1) {
      this.docDetailsField.newDocList[0].docName = "";
      this.docDetailsField.newDocList[0].mobileNo = "";
      this.docDetailsField.newDocList[0].emailId = "";
    } else {
      this.docDetailsField.newDocList.splice(index, 1);
    }
  }//end of method
  
  changeName(event, type , index) {
    if(type == 'doctorName') {
      this.docDetailsField.newDocList[index].docName = event;
    }
  }

  historyBack() {
    this._location.back();
  }

}
