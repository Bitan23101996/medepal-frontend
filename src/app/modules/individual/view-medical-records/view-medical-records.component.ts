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
import {Location} from '@angular/common';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'app-view-medical-records',
  templateUrl: './view-medical-records.component.html',
  styleUrls: ['./view-medical-records.component.css']
})
export class ViewMedicalRecordsComponent implements OnInit {

  userMedicalRecords:any;
  
  constructor(
    private _location: Location,
    private broadcastService: BroadcastService
  ) { }

  ngOnInit() {
    this.broadcastService.setHeaderText('Medical Records');
  }
  backClicked() {
    this._location.back();
  }

}
