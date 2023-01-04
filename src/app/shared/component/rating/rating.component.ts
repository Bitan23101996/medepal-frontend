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

import { Component, OnInit, Output, EventEmitter, Input,OnChanges } from '@angular/core';
//import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html'
  //styleUrls: ['./working-schedule.component.css']
})

export class RatingComponent implements OnInit {
    @Input() rating: number;

    ngOnInit() {
      //console.log(this.rating);
    /*  if(this.rating > 5){
        this.rating = 100;
      }else{
        this.rating = (this.rating/5)*100;
      }*/



      //console.log((this.rating/5)*100);
    //this.rating = (rating/5)*100;

    }

}
