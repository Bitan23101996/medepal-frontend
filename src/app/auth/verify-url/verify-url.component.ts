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

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from './../auth.service';
import { ToastService } from './../../core/services/toast.service';
import { ModalService } from './../../shared/directive/modal/modal.service';
import { BroadcastService } from './../../core/services/broadcast.service';
import { GetSet } from '../../core/utils/getSet';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-verify-url',
  templateUrl: './verify-url.component.html',
  styleUrls: ['./verify-url.component.css']
})
export class VerifyUrlComponent implements OnInit {
  vCode: any;
  fpCode: any;
  srpcode: any;//https://gitlab.com/sbis-poc/app/issues/1008
  securityKey: any;
  grouupinvitecode: any;
  emailRes: any;
  showMsg: any = false;
  message: any;
  newPassword: any = null;
  repeatPassword: any = null;
  peerconsultinginvitecode: any;
  doctorinvitecode: any;
  @ViewChild('resetPasswordModal') resetPasswordModal: TemplateRef<any>;
  modalRef: BsModalRef;
  showeye: Boolean = false;
  showeye_repeatPassword: boolean = false;
  isPasswordMatch: boolean = false;
  onlineconsulting: any;
  
 constructor(
   private authService: AuthService,
   private router: Router,
   private activatedRoute: ActivatedRoute,
   private toastService: ToastService,
   private modalService: ModalService,
   private broadcastService: BroadcastService,
   private bsModalService: BsModalService,
   
 ) { }

 ngOnInit() {
  this.activatedRoute.queryParams.subscribe((params: Params) => {
    this.vCode = params['vpcode'];
    this.fpCode = params['fpcode'];
    this.srpcode = params['srpcode'];//https://gitlab.com/sbis-poc/app/issues/1008
    this.securityKey = params['securityKey'];
    this.grouupinvitecode = params['grouupinvitecode'];
    this.peerconsultinginvitecode = params['peerconsultinginvitecode'];
    this.doctorinvitecode = params['doctorinvitecode'];
    this.onlineconsulting = params['onlineconsulting'];//https://gitlab.com/sbis-poc/app/-/issues/2801
    if (this.vCode) {
      this.authService.verifyEmailLink({'verificationCode': this.vCode}).subscribe(result=>{
        this.processVerification(result);
        if(result.status == 2009) {
          this.toastService.showI18nToast(result.message, 'success');
        }
      })
    }
    if (this.fpCode && this.securityKey) {   
      this.authService.verifyForgetPassWordLink({
        'verificationCode': this.fpCode,
        'securityKey': this.securityKey
      }).subscribe(result=>{
        //this.toastService.showToast(result.status, result.message);
        if(result.status == 2000) {
          this.processForgotPassword(result);
        }
      });
    }

    //https://gitlab.com/sbis-poc/app/issues/1008
    if(this.srpcode){
      this.authService.verifySetResetPasswordLink({
        'verificationCode': this.srpcode
      }).subscribe(result=>{
        if(result.status == 2000) {
          this.router.navigate(['/auth/login']);
        }else{
          this.toastService.showI18nToast("Some error occured. Please try again","error");
          this.authService.logout();
        }
      });
    }//end of method

    if(this.onlineconsulting){
      //window.open('/video-consulting/'+this.onlineconsulting);
      // let  s: string= this.router.navigate(['/chat']);
      this.router.navigate(['/video-consulting/'+this.onlineconsulting]);
    }//end of if

    if (this.grouupinvitecode) {
      this.authService.acceptGroupInvitation({
        'verificationCode': this.grouupinvitecode
      }).subscribe((result) => {
        this.toastService.showToast(result.status, result.message);
      })
    }

    if(this.peerconsultinginvitecode) {
      let query = {
        "verificationCode": this.peerconsultinginvitecode
      }
      this.authService.peerConsultingInvitation(query).subscribe((result) => {
        this.processPeerConsultingInvitationLink(result);
      });
    }

    if(this.doctorinvitecode) {
      let query = {
        "verificationCode": this.doctorinvitecode
      };
      this.authService.doctorReferralInvitation(query).subscribe((resp) => {
        if(resp.status == 2011) {
          GetSet.setDocReferralInvitationAcceptDetails(resp.data);
          this.router.navigate(['/auth/landings']);///previous route -- >> auth/signUp
        }
        if(resp.status == 2012) {
          this.toastService.showI18nToast("Invitation Already Accepted","error");
          this.router.navigate(['/auth/landings']);///previous route -- >> auth/signUp
        }
        if(resp.status == 5059) {
          this.toastService.showI18nToast("User already registered, please Sign In","error");
          this.router.navigate(['/auth/landings']);///previous route -- >> auth/signUp
        }
      });
    }
  });
}//end of oninit
closeModal () {
  this.modalService.close('closeModal');
}

processPeerConsultingInvitationLink(res: any) {
  if(res.status == 2000) {
    this.toastService.showI18nToast(res.message, 'success');
    this.router.navigate(['/auth/login']);
    GetSet.setPeerConsultingInvitationLogin(res.data);
  }
}

processForgotPassword(res: any) {
  if (res.status === 2000) {
    //this.modalService.open('reset-password-modal');
    this.modalRef = this.bsModalService.show(this.resetPasswordModal, { class: 'modal-md' });
    //this.showMsg = true;
    //this.message = res.message;
  } else{

    this.toastService.showToast(res.status, res.message);
 
   if (res.status === 5018) {
    
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  } else if (res.status === 5019) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  } else if (res.status === 4001) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  } else if (res.status === 4003) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  }
}
}
resetPassword (newPassword: any) {
  if(newPassword.length<6 || newPassword.length>20){
    this.toastService.showToast(-1,"Password must be 6 to 20 characters long");
    return false;
  }
  else{
    this.authService.resetUserPassword({
      'password': newPassword,
      'securityKey': this.securityKey,
      'verificationCode': this.fpCode
    }).subscribe(result=>{
      if(result.status == 2000) {
        this.toastService.showI18nToast(result.message, 'success');
        this.modalRef.hide();
        this.processVerification(result);
      }
    });
  }
 

  // this.baseService.post(apiPath.RESET_PASSWORD,
  //   {
  //     'password': newPassword,
  //     'securityKey': this.securityKey,
  //     'code': this.fpCode
  //   }).subscribe((data) => {
  //     this.processVerification(data);
  //   }, (error) => {
  //     // show error
  //   });
}
processVerification(res: any) {
  if (res.status === 2009) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  } else if (res.status === 2010) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  }else if (res.status === 4001) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  } else if (res.status === 4003) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 5000);
  } else if (res.status === 2000) {
    this.showMsg = true;
    this.message = res.message;
    setTimeout(() => {
      this.authService.logout();
    }, 3000);
  }
}

showPassword() {
  this.showeye = !this.showeye;
}

showRepeatPassword() {
  this.showeye_repeatPassword = !this.showeye_repeatPassword;
}

passwordCheck() {
  if(this.newPassword && this.repeatPassword) {
    if(this.newPassword != this.repeatPassword) {
      this.isPasswordMatch = false;
      this.toastService.showI18nToast("New password & repeat password is not same", "error");
    } else {
      this.isPasswordMatch = true;
    }
  } else {
    this.isPasswordMatch = false;
  }
}

}
