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
import { CoreService } from '../../core.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { BroadcastService } from '../../services/broadcast.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-video-chat-single-page-app',
  templateUrl: './video-chat-single-page-app.component.html',
  styleUrls: ['./video-chat-single-page-app.component.css']
})
export class VideoChatSinglePageAppComponent implements OnInit {

  singlePageAppObj: any;
  appointmentRefNo: string;
  showVideoChat: boolean = false;
  checkDoctor: boolean = false;
  private subscription;

  constructor(private coreService: CoreService, private toastService: ToastService, private route: ActivatedRoute,    private broadcastService: BroadcastService) { }//end of constructor

  ngOnInit() {
    this.getRouteParam();
    this.subscription = Observable.interval(10000).subscribe(x => {
        this.getRouteParam();
     });

    //this.broadcastService.setVideoConsulting("video");//to hide header
  }//end of oninit
  
  getRouteParam() {
    let onlineConsultLink= (this.route.params['value'].onlineConsultLink) ? this.route.params['value'].onlineConsultLink : '';//subscribe(params =>{params['procedureRefNo']});
    if(onlineConsultLink){
      this.onChatVerifyLinkWSCall(onlineConsultLink);
    }else
      this.toastService.showI18nToast("Sorry wrong URL","error");
  }


  onChatVerifyLinkWSCall(onlineConsultLink) {
    let query = {
      "onlineConsultLink": onlineConsultLink//"dHBaSVVsNXBPK3NnRlV3SWJhOGNzVDN6SlZLQnIvblQ0WllqUm1XZERDeUtoUzdnOVlFMUpzeHltdUdjcTFLV091dGRYWjAwQ1VjWTk4di9CTWxzbGFrQ0kxY21xNnNP"
    };
    this.coreService.chatVerifyLinkForIndividualUser(query).subscribe(res => {
      console.log(res);
      if (res.status == 2000) {
        this.subscription.unsubscribe();
        this.checkDoctor = true;
        this.singlePageAppObj =
        {
          data: {
            'sessionId': res.data.sessionId,
            'token': res.data.token
          }
        };
        this.appointmentRefNo = res.data.triggerRefNo;

        this.showVideoChat = true;
      } else {
        this.checkDoctor = false;
        //this.toastService.showI18nToast(res.message, "error");
      }
    }, err => {
      this.toastService.showI18nToast("Unable to connect", "error");
    });
  }//end of method

}//end of class
