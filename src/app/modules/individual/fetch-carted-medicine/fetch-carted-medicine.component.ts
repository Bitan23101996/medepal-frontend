
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
import { ApiService } from '../../../core/services/api.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { Location } from '@angular/common';
import {Subscription} from 'rxjs/Subscription';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-fetch-carted-medicine',
  templateUrl: './fetch-carted-medicine.component.html',
  styleUrls: ['./fetch-carted-medicine.component.css']
})
export class FetchCartedMedicineComponent implements OnInit {

  user_id: any;
  cartData: any;
  abc: string;
  subscription :any;

  constructor(
    private apiService: ApiService,
    private broadcastService: BroadcastService,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscription = <Subscription>this.location.subscribe((x) =>  {
      this.router.navigate(['/individual/my-prescription']);
    });
    

    this.abc = 'asha';
    // this.getOrderCountById();
    this.broadcastService.setHeaderOrderItem();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // getOrderCountById() {
  //   let user = JSON.parse(localStorage.getItem('user'));
  //   if(user) {
  //     this.user_id = user.id;
  //     this.apiService.GetOrderById.getByPath(this.user_id).subscribe((result) => {
  //       this.cartData = result.data;
  //       this.cartData.forEach(element => {
  //         element.cartItems.forEach(cartItmEl=>{
  //           if(cartItmEl.netAmount == 0){
  //             cartItmEl.netAmount = parseInt(cartItmEl.numUnits) * parseInt(cartItmEl.price);
  //           }
  //         });
  //       });
  //       console.log("fetch carted medicine::",this.cartData);

  //     });
  //   }
  // }

}
