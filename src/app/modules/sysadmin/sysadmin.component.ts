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
import { BroadcastService } from '../../core/services/broadcast.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'sys-admin',
  templateUrl: './sysadmin.component.html',
  styleUrls: ['./sysadmin.component.css']
})
export class SysAdminComponent implements OnInit {
  headerText: any;

  constructor(
    private translate: TranslateService,
    private broadcastService: BroadcastService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }




  ngOnInit() {
    this.broadcastService.getHeaderText().subscribe(headerText => {
      this.headerText = headerText;
      //console.log('inside header '+this.headerText);
    });
    this.broadcastService.setHeaderText('Welcome to MEDePAL - SYSADMIN');
  }


}
