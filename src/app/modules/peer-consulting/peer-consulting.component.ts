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
import { BroadcastService } from './../../core/services/broadcast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-peer-consulting',
  templateUrl: './peer-consulting.component.html',
  styleUrls: ['./peer-consulting.component.css']
})
export class PeerConsultingComponent implements OnInit {

  headerText:any;
  constructor(
    private broadcastService: BroadcastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.broadcastService.getHeaderText().subscribe(headerText => {
      this.headerText = headerText;
      //console.log('inside header '+this.headerText);
      const url = window.location.href.toString();
      if (url.indexOf('/peer-consulting-panel-list') > 0) {
        document.body.classList.add('prescription-screen');
      } else{
        document.body.classList.remove('prescription-screen');
      }
    });
  }

}
