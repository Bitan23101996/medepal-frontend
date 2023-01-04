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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://206.189.150.18:9090/',
  //apiUrl: 'http://localhost:9090/',
  //apiUrl: 'http://www.devsbis.co.in:9090/',
  apiUrl: 'http://172.16.1.24:9090/',
  environment_identifier: 'development',
  environment_identifier_background_color: '#4dbeac',
  GOOGLE_CLIENT_ID: '819126560466-s7qnpj677rgdfbe7u0a2ht2i2tsemuo1.apps.googleusercontent.com',
  FACEBOOK_APP_ID: '2238273849761169',
  TRANSLATION_FILE_PATH: './assets/i18n/',
  DATE_FORMAT:'DD-MM-YYYY',
  AUTO_SAVE_PRESCRIPTION_TIME: 20000,
  AUTO_SAVE_PRESCRIPTION_FLAG: true,
  GOOGLE_API_KEY: 'AIzaSyBWVyk6Tdm6Hpl_nA_IssRZFoxGMXjM1dU',
  FIREBASE_CONFIG : {
    apiKey: "AIzaSyAe4bxie3Itv1aOHJJbJyo5ULBZY1wUThw", 
    authDomain: "medepal.firebaseapp.com", 
    databaseURL: "https://medepal.firebaseio.com", 
    projectId: "medepal", 
    storageBucket: "medepal.appspot.com",
    messagingSenderId: "819126560466", 
    appId: "1:819126560466:web:af19d5b3bf080657"
  },
  firebase_FCM: {
    
     apiKey: "AIzaSyCjUM3DvyenROErADjCIb0bcmWoZ6zGqjA",
     authDomain: "medepal-d1b58.firebaseapp.com",
     databaseURL: "https://medepal-d1b58.firebaseio.com",
     projectId: "medepal-d1b58",
     storageBucket: "",
     messagingSenderId: "108721153152",
     appId: "1:108721153152:web:e2c17ba55cecdd3c"
   }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
