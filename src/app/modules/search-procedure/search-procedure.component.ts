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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-procedure',
  templateUrl: './search-procedure.component.html',
  styleUrls: ['./search-procedure.component.css']
})
export class SearchProcedureComponent implements OnInit {
 
  constructor( private translate: TranslateService){
    translate.setDefaultLang('en');
    translate.use('en');

  }
  ngOnInit() {
    const url = window.location.href.toString();
    if (url.indexOf('/prescription') > 0) {
      document.body.classList.add('prescription-screen');
    }else{
      document.body.classList.remove('prescription-screen');
    }
  }
  


 
}
