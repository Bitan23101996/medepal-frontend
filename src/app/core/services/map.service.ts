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

import { Injectable } from '@angular/core';
import { GetSet } from '../../../app/core/utils/getSet';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  
  constructor( ) {}

  public getAddressByLatLong(lat: string="", long: string="") {

    let geocoder = new google.maps.Geocoder;

    let latlng = {lat: parseFloat(lat), lng: parseFloat(long)};//{lat: 40.714224, lng: -73.961452};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          // console.log(results[0]);
          let address: any = results[0];
          GetSet.setCurrentAddress(address);
          // console.log(GetSet.getCurrentAddress())
        } else {
          // window.alert('No results found');
        }
      } else {
        // window.alert('Geocoder failed due to: ' + status);
      }
    });
  }


}
