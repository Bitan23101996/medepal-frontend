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

import { Component, OnInit, AfterViewInit , HostListener,Injectable,Directive,Output,EventEmitter, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, Event as RouterEvent, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { ToastService } from './core/services/toast.service';
import { BroadcastService } from './core/services/broadcast.service';
import { ApiService } from './core/services/api.service';
import { PlatformLocation } from '@angular/common';
import { MessagingService } from "./shared/messaging.service";
import { GlobalvideoService } from './core/services/globalvideo.service';


declare var liveChat: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})





export class AppComponent implements OnInit, AfterViewInit,OnDestroy {
  subscription: Subscription;


  title = 'sbis-web';
  isAuthenticated = false;
  value: Date;
  timerSys:any;
  key:any;
  isFeedback: boolean = false;
  isChatOpen: boolean = false;
  hideHeader: boolean = false;
  childSubscription: Subscription;


  onlineDoc:boolean = false;
  doctorRefNo: any;
  loggedInUser: any;
  userRefNo: any;
  appointmentRefNo: any;
  storeStatus: string;

  constructor(private router: Router,
    private broadcastService: BroadcastService,
    private location: PlatformLocation,    
    private apiService: ApiService,
    private globalvideoservice: GlobalvideoService,
    private messagingService: MessagingService) {
    var _self = this;
    this.subscription = this.broadcastService.getAuth().subscribe(isAuthenticated => {
      _self.isAuthenticated = isAuthenticated;
      _self.callInitTokenTimer(isAuthenticated);
    });

    this.location.onHashChange((e: any) => {
      //this.checkAuth();
    });
  }
  
  
  @HostListener('document:keypress', ['$event'])
  update(event: any) { 
    this.key = event.key;
	//console.log(this.key);
	//console.log(event.target.classList);
	if(this.key=="{" || this.key=="}" || this.key=="/*" || this.key=="\\" || this.key=="!" || this.key=="--" || this.key==">" || this.key=="<" || this.key=="1=1"){
		if(event.target.classList.contains('allow-all-char')){
			//do nothing;
		}else{
			event.target.insertAdjacentHTML("afterend", "<div class='validation-error' id='invalid-char'>" + this.key + " Not Allowed</div>");
			let markup = document.getElementById('invalid-char');
			setTimeout(function () {markup.parentNode.removeChild(markup);}, 3000);
			event.preventDefault();
		}
	}
  }
  
  
  @HostListener('paste', ['$event'])
	onPaste(event: any) {
	  let clipboardData = event.clipboardData;
	  let pastedText = clipboardData.getData('text');
	  //console.log(pastedText);
	  let splChar = ["{","}","/*","\\","!","<",">","--","1=1"];
	
	  
	  if(event.target.classList.contains('allow-all-char')){
			//do nothing;
		}else{
		  for(var i=0;i<=pastedText.length;i++){
			  for(var j=0;j<splChar.length;j++){
				  if(pastedText[i]==splChar[j]){
					  event.target.insertAdjacentHTML("afterend", "<div class='validation-error' id='invalid-char'>" + splChar[j] + " Not Allowed</div>");
					  let markup = document.getElementById('invalid-char');
					  setTimeout(function () {markup.parentNode.removeChild(markup);}, 3000);
					  event.preventDefault();
				  }	
			  }
		  }
		}
	 }
  



    @HostListener('document:click', ['$event'])
    clickout(event: any) {

      if(event.target.type == "submit"){
        setTimeout(() => {
            event.target.classList.add("clicked");
            event.target.disabled = true;
        },1);



      }

    }




    @HostListener('submit', ['$event'])
     onFormSubmit(event: any) {




       if(event.target.classList.contains("ng-invalid")){
         let submitBtn = event.target.getElementsByTagName("button");

         setTimeout(() => {
           //let btn = event.srcElement.elements;
           for(let i=0;i<submitBtn.length;i++){

             if(submitBtn[i].classList.contains("clicked")){
               //console.log(submitBtn[i]);
               submitBtn[i].disabled = false;
               submitBtn[i].classList.remove("clicked");
             }
           }
         },2);


       }

     }


  ngOnInit() {
    this.messagingService.requestPermission("userId")
    this.messagingService.receiveMessage();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        //this.checkAuth();
        let snackbarDoc = document.getElementById("snackbar");
        if(snackbarDoc) snackbarDoc.innerHTML = ""
      }
    });
    let user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      this.isFeedback = true;
    } else {
      this.isFeedback = false;
    }



    //this.doctorRefNo = user.refNo;
    //this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    //this.userRefNo = localStorage.getItem('userRefNo');
    //this.appointmentRefNo = localStorage.getItem('appointmentRefNo');






    //console.log(this.onlineDoc);


    let url = window.location.toString();




    this.globalvideoservice.getValue().subscribe((value) => {
      //console.log(value);
      if("onlineDoc" in localStorage){
        this.storeStatus = localStorage.getItem("onlineDoc");

        if(value && this.storeStatus == "no"){
          localStorage.setItem("onlineDoc", "yes");
          this.storeStatus = localStorage.getItem("onlineDoc");
          console.log("onlineDoc" in localStorage);
          console.log(value);
        }


        if(this.storeStatus == "yes"){
          this.onlineDoc = true;
        }else{
          this.onlineDoc = false;
        }

        console.log(this.onlineDoc);
      }else{
        this.onlineDoc = value;

        if(this.onlineDoc){
          this.storeStatus = "yes";
        }else{
          this.storeStatus = "no";
        }

        console.log(this.onlineDoc);
        localStorage.setItem("onlineDoc", this.storeStatus);
      }

    });


    /* for page refresh */
    this.storeStatus = localStorage.getItem("onlineDoc");
    if(this.storeStatus == "yes"){
      this.onlineDoc = true;
    }else{
      this.onlineDoc = false;
    }

    console.log(this.onlineDoc);

  }



  checkUrlAndHideHeader() { //to hide header
    this.childSubscription = this.broadcastService.getVideoConsulting().subscribe(data => {
      (data)?this.hideHeader = true: this.hideHeader = false;
    });
  }//end of method

  ngOnDestroy() {
    this.childSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.checkUrlAndHideHeader();
   // let appId = '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23';
   // let channelUrl = 'sendbird_open_channel_1_5b0336cc55abf6d3464e1d2a263a8e343d3b2b42'; // channel: text_chat_test
   // liveChat.start(appId, channelUrl);
  }

  doubleClick(){
    if(!this.isChatOpen){
      document.getElementById("sb_chat").style.height = "500px";
    }else{
      document.getElementById("sb_chat").style.height = "54px";
    }
    this.isChatOpen=!this.isChatOpen;
  }

  callInitTokenTimer(isAuthenticated){
    if(isAuthenticated){
      this.callTokenTimer(); 
    }else{
      this.cancelTokenTimer();
    }
  }

  cancelTokenTimer(){
   if(this.timerSys){
    clearTimeout(this.timerSys);
   } 
  }

  callTokenTimer(){
    let user = JSON.parse(localStorage.getItem('user'));
    let tokenValidtimeInSec= user.tokenValidtimeInSec-20;
    if(tokenValidtimeInSec<0){
      tokenValidtimeInSec=1;
    }
    this.timerSys = setTimeout(()=>{ 
      this.refreshToken();
    }, 1000*tokenValidtimeInSec);
  }

  refreshToken(){
    let user = JSON.parse(localStorage.getItem('user'));
    if(user.token==null) return;

    this.apiService.Token.postByQuery({oldToken:user.token}).subscribe(result=>{
      let user = JSON.parse(localStorage.getItem('user'));
      user["token"]=result.data.token;
      user["tokenValidtimeInSec"]=result.data.tokenValidtimeInSec;
      localStorage.setItem("user", JSON.stringify(user));
      this.cancelTokenTimer();
      this.callTokenTimer();
    })
  }

  checkAuth() {
    let user = JSON.parse(localStorage.getItem('user'));
    let url = window.location.toString();
    if (url.indexOf('/search') == -1) {
      if (user && url.indexOf('/auth/') == -1) {
        this.isAuthenticated = true;
      } else if (!user && url.indexOf('/auth/') == -1) {
        this.isAuthenticated = false;
        this.router.navigate(['/auth/landing']);
      } else {
        this.isAuthenticated = false;
      }
    }
  }

}
