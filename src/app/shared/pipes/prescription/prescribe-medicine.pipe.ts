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
// sbis-poc/app/issues/803
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'prescribeMedicine'})
export class prescribeMedicinePipe implements PipeTransform {
  transform(value: string, exponent?: string): string {

      if(value == "tabs"){
        if(Number(exponent) > 1){
          value = "tablets";
        }
        else{
          value = "tablet";
        }
      }
      return value;
  }
}