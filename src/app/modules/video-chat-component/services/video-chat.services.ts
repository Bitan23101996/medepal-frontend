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

import * as OT from '@opentok/client';
// import config from '../config';

@Injectable()
export class VideoChatService {

  session: OT.Session;
  token: string;

  config: any = {
    // SAMPLE_SERVER_BASE_URL: 'http://www.devsbis.co.in:9090/',
    // SESSION_ID: "1_MX40NjQ5MDQzMn5-MTU4NjI0NDk0MTk2Nn5lR0kxUWhCREVPL1JVVGtEZ0JJSGJiWnZ-UH4",
    API_KEY: 46490432,
    // TOKEN:  "T1==cGFydG5lcl9pZD00NjQ5MDQzMiZzaWc9MDQ4MjlmZDFlOTc3OWUwZThjMWMwM2UwMWMzYjJhNGZkN2VlMWE0MTpzZXNzaW9uX2lkPTFfTVg0ME5qUTVNRFF6TW41LU1UVTROakkwTkRrME1UazJObjVsUjBreFVXaENSRVZQTDFKVlZHdEVaMEpKU0dKaVduWi1VSDQmY3JlYXRlX3RpbWU9MTU4NjI0NDk0MiZub25jZT0tMTMzMjkwMjI5NCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNTg2ODQ5NzQyJmNvbm5lY3Rpb25fZGF0YT1JTjEwNzEwODc0NzM="
  }

  constructor() { }

  getOT() {
    return OT;
  }

  initSession(sessionId, token) {
    if (this.config.API_KEY && token && sessionId) {
      this.session = this.getOT().initSession(this.config.API_KEY, sessionId);
      this.token = token;
      return Promise.resolve(this.session);
    } else {
      return fetch(this.config.SAMPLE_SERVER_BASE_URL + '/session')
        .then((data) => data.json())
        .then((json) => {
          this.session = this.getOT().initSession(json.apiKey, json.sessionId);
          this.token = json.token;
          return this.session;
        });
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      });
    });
  }//end of method

  disconetTheVideoChat() {
    // console.log(this.session.connection.connectionId);
    if(this.session.connection){
      this.session.forceDisconnect(this.session.connection,(error)=>{
       if (error) {
         console.log(error);
       } else {
         console.log("Connection forced to disconnect: " + this.session.connection.connectionId);
       }
      }); 
    }else{
      this.session.disconnect();

    }
  }
} 