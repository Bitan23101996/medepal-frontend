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
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BroadcastService } from './../../core/services/broadcast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
        providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad {
        constructor(private router: Router, private broadcastService: BroadcastService, private authService:AuthService,) {
        }

        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
                // implement the logic for gaurding the route to activate or not
                if(this.authService.isLoggedIn()){
                        return true;
                }else{
                this.router.navigate(['/auth/landing']);
                return false;
               }
                // return true;
        }
        CanDeactivate() {
                return false;
        }
        canLoad(route: Route): Observable<boolean> {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                        this.broadcastService.setAuth(true);
                } else {
                        this.broadcastService.setAuth(false);                        
                }

                return Observable.create(observer => {
                        observer.next(true);
                        observer.complete();
                });

        }
}
