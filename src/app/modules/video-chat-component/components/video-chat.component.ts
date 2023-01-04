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
import { Component, OnInit, ChangeDetectorRef, Input,ElementRef,Output, AfterViewInit, ViewChild , Renderer2,EventEmitter,HostListener} from '@angular/core';
import * as OT from '@opentok/client';
import { VideoChatService } from '../services/video-chat.services';
import { CoreService } from 'src/app/core/core.service';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/core/services/toast.service';
import { SBISConstants } from 'src/app/SBISConstants';

@Component({
  selector: 'app-video-chat-component',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit {
  title = 'Angular Basic Video Chat';
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  windowSize:boolean = true;
  goFullScreen:boolean = true;
  closeMsg:boolean = false;
  closeVideo:boolean = true;
  @Input("appointmentRefNo") appointmentRefNo: any;
  @Input("singlePageAppObj") singlePageAppObj: any;
  @Output() onCloseClick = new EventEmitter();
  user: any;
  videoChatDivId: string = "videoChat";
  endSession:boolean = true;

  constructor(private cd: ChangeDetectorRef, private videoChatService: VideoChatService,
    private coreService: CoreService,private toastService: ToastService,private renderer: Renderer2) {
      this.user = JSON.parse(localStorage.getItem('user'));
     }

  ngOnInit() {
    if(this.appointmentRefNo==null)
      this.appointmentRefNo = localStorage.getItem("appointmentRefNo");
      //console.log(this.appointmentRefNo);
    if(this.singlePageAppObj){
      this.videoChatDivId= "videoChat-single-page";
      this.chatInitSession(this.singlePageAppObj);
      document.addEventListener('fullscreenchange', this.exitHandler);

    }  else{
      this.loadSession();
    }


  }//end of oninit




  loadSession(){
    this.coreService.getChatSession({"trigerRefNo": this.appointmentRefNo}).subscribe(res=>{
      if(res.status == 2000){
        this.chatInitSession(res);
      }else{
        if(this.user.roleName == SBISConstants.ROLE_NAMES.INDIVIDUAL)
         this.toastService.showI18nToast(res.message,"info");
      }
    },err=>{
      this.toastService.showI18nToast("Some Error Occurred. Please try again","error");
    });
  }//end of method

  chatInitSession(res: any) { //method to init chat session
    this.videoChatService.initSession(res.data.sessionId,res.data.token).then((session: OT.Session) => {
      this.session = session;
      this.session.on('streamCreated', (event) => {
        this.streams.push(event.stream);
        this.cd.detectChanges();
      });
      this.session.on('streamDestroyed', (event) => {
        const idx = this.streams.indexOf(event.stream);
        if (idx > -1) {
          this.streams.splice(idx, 1);
          this.cd.detectChanges();
        }
      });
    }).then(() => this.videoChatService.connect())
    .catch((err) => {
      console.error(err);
      alert('Unable to connect.');
    });
  }//end of method



  windowToggle(){
    const element = this.renderer.selectRootElement('.OT_subscriber',true);

    if(this.windowSize){
        element.classList.add('maximizeVideo');
    }else{
      element.classList.remove('maximizeVideo');
    }

    this.windowSize = !this.windowSize;

    //console.log(element);
  }

  fullScreen(){
  const element = this.renderer.selectRootElement('#videoChat-single-page',true);

        element.requestFullscreen();
        element.classList.add('fullScreen');


  
  }

  exitFullScreen(){
    const element = this.renderer.selectRootElement('#videoChat-single-page',true);
    document.exitFullscreen();
    element.classList.remove('fullScreen');
  }

  exitHandler(){
    //const element = this.renderer.selectRootElement('#videoChat-single-page',true);
    if (!document['webkitIsFullScreen'] && !document['mozFullScreen'] && !document['msFullscreenElement']){
      document.getElementById('videoChat-single-page').classList.remove('fullScreen');
      //this.goFullScreen = !this.goFullScreen;
    }
  }

  closeWindow(){
    this.closeMsg = true;
  }

  closeSession(){
    //this.closeVideo = false;
    this.coreService.closeChatSession({"trigerRefNo": this.appointmentRefNo, "chatSessionId":this.session.sessionId}).subscribe(res=>{
      if(res.status == 2000){
        this.videoChatService.disconetTheVideoChat();
      }else
        this.session.disconnect();

        this.onCloseClick.emit();
    },err=>{
      this.session.disconnect();
    });

    this.endSession = false;
    localStorage.removeItem("onlineDoc");

  }//end of method

  conSession(){
    this.closeMsg = false;
  }

  dragStart(event) {
    //event.dataTransfer.setData("text", ev.target.id);
    let style = window.getComputedStyle(event.target, null);

    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    //event.target.classList.remove("video-chat-pos");
  }

  drop(event) {
    let offset = event.dataTransfer.getData("text/plain").split(',');
    let dm = document.getElementById(this.videoChatDivId);//'videoChat'
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
  }

  drag_over(event) {
    event.preventDefault();
    return false;
}

@HostListener('document:drop', ['$event'])
  onDrop(event) {
    this.drop(event);
  }

@HostListener('document:dragover', ['$event'])
  onDragOver(event) {
    this.drag_over(event);
  }

//let dm = document.getElementById('videoChat');
//document.getElementById('videoChat').addEventListener('dragstart',this.drag_start.bind(this),false);
//document.body.addEventListener('dragover',this.drag_over.bind(this),false);
//document.body.addEventListener('drop',this.drop.bind(this),false);

}//end of class
