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
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit{
  constructor(private router: Router,
    private broadcastService: BroadcastService,) { 
   // this.router.navigate(['/auth/login']);
  }

  

 

  ngOnInit() {
    
    document.body.classList.remove('prescription-screen');
  }
  

}
