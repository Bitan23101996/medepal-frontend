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

import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PlatformLocation } from '@angular/common';

import { BroadcastService } from './../../core/services/broadcast.service';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}


@Injectable({
  providedIn: 'root'
})
export class GoBackGuardService implements CanDeactivate<ComponentCanDeactivate>, CanLoad {
  changeFromBack = false;
  stopedBack = new EventEmitter<boolean>();
  islogedin = false;
  constructor(private location: PlatformLocation, private broadcastService: BroadcastService, private router: Router) {
    //   this.location.onHashChange((e: any) => {
    //       this.changeFromBack = true;
    //             let user = JSON.parse(localStorage.getItem('user'));
    //             if(!user && window.location.href.indexOf("/auth/")==-1){
    //               this.broadcastService.setAuth(false);
    //               this.router.navigate(['/auth/login']);
    //             } 
    //   });
  }
  canLoad() {
      this.changeFromBack = false;
      return true;
  }
  canDeactivate(component: ComponentCanDeactivate, route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot, nextState: RouterStateSnapshot) {
      let temp = this.changeFromBack;
      this.changeFromBack = false;
      if (component && component.canDeactivate) {
          const can = component.canDeactivate();
          if (!can) {
              temp = false;
          }
      }
      if (temp) {
          this.stopedBack.emit();
      }
      return !temp;
  }
}