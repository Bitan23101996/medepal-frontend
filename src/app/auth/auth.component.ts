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

import { Component, OnInit,OnChanges } from '@angular/core';
import { Router, Event as RouterEvent, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { BroadcastService } from './../core/services/broadcast.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnChanges {
  isvefified=false;
  constructor(private router: Router,
    private broadcastService: BroadcastService,) { 
   // this.router.navigate(['/auth/login']);
  }

  checkloggser() { 
    let user = JSON.parse(localStorage.getItem('user'));
    //console.log(user)
    if(user){
      this.broadcastService.setAuth(true);
      this.router.navigate([user.lastLoginNavigateUrl]);
      // if(user.roleName == "INDIVIDUAL"){
      //   this.router.navigate(["/individual/tab-personal"]);
      // } else {
      //   this.router.navigate(["/searchPatient"]);
      // }
    } else {
      this.router.navigate(['/auth/landing']);
    }
  }

  ngOnChanges() { 
    this.checkloggser();
  }

  ngOnInit() {
    this.checkloggser();
    let locationUrl=window.location.toString();
    let url=locationUrl.split("auth")[1];
    this.checkRout(url);
    //localStorage.removeItem("user");
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let url=event.url.split("auth")[1];
        this.checkRout(url);
      }
    });
    document.body.classList.remove('prescription-screen');
  }
  checkRout(url:string){
    if (url && (url.startsWith('/verifications') || url.startsWith('/verify'))){
      this.isvefified=true;
    }else{
      this.isvefified=false;
    }
  }

}
