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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { MenusComponent } from './core/components/menus/menus.component';
import { HeaderComponent } from './core/components/header/header.component';
import { environment } from '../environments/environment';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MenuComponent } from './core/components/menu/menu.component';
import { AutoCompleteModule } from 'primeng/primeng';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FeedbackComponent } from './core/components/feedback/feedback.component';
import { AngularFireDatabaseModule } from '@angular/fire/database'; //firebase
import { AngularFireModule } from '@angular/fire';//firebase
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MessagingService } from './shared/messaging.service';
import { AsyncPipe } from '../../node_modules/@angular/common';
import {TableModule} from 'primeng/table';
import { VideoChatModule } from './modules/video-chat-component/video-chat.module';


@NgModule({
  declarations: [
    AppComponent,
    MenusComponent,
    HeaderComponent,
    FeedbackComponent,
    MenuComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    MatMenuModule,
    MatIconModule,
    AutoCompleteModule,
    MenuModule,
    MenubarModule,
    NgxSpinnerModule,
    AngularFireDatabaseModule,//firebase
   // AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),//firebase,

    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase_FCM),
    TableModule,
    VideoChatModule
  ],
  providers: [MessagingService, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
