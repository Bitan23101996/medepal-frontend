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

import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BroadcastService } from './../../../core/services/broadcast.service';
import { ApiService } from './../../../core/services/api.service';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translate3d(0, 0, 0)' })),
      state('out', style({ transform: 'translate3d(-150%, 0, 0)' })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class MenusComponent implements OnInit {

  expandedState = 'out';

  profileImageSrc = "";
  domSanitizer: any;

  menu: Array<object> = [
    {id:1, title: 'Profile', link: '', icon: 'fa fa-user', privilege: false },
    {id:2,  title: 'Appoinment Details', link: '/appoinment', icon: 'fas fa-users', privilege: false },
    {id:3,  title: 'Search Details', link: '/search', icon: 'fas fa-search', privilege: false }
  ];

  menus:any;
  menuItems0:[][] = [];
  menuItems1:any = [];
  menuItems2:any = [];
  menuItems3:any = [];
  menuImgSrc:any = [];
  subMenuLevel1: any;
  subMenuLevel2: any;
  onSelectionsubMenuLevel1:any
  onSelectionsubMenuLevel2:any
  name:string;
  map1: any;
  map2: any;
  map3: any;
  //menuIdMap: any;
  mapKey:any;
  previousvalue:any;
  roleName:any;
  userName:any;
  userEmail:any;
  contactNo:any;
  parentRoleName:any;
  priceListMap : Map<number, []> = new Map<number, []>();

  /* Working on app/issues/782 */
  registrationWorkflowCompleted: boolean;
  disableMenu: boolean = false;
  /*End Working on app/issues/782 */

  //@Input() roleName = 'Doctor';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _domSanitizer: DomSanitizer,
    private broadcastService: BroadcastService,
    private apiService: ApiService,
  ) {
    this.domSanitizer = _domSanitizer;
   }

  ngOnInit() {
    const __self=this;
    document.getElementById("appContainer").addEventListener('click', function(event) {
      __self.expandedState = 'out';
	  if(document.getElementById('side-bar')!=null){
		document.getElementById('side-bar').classList.remove('slide'); 
		document.getElementById('side-bar').classList.add('slide-out'); 
	  }
    });

    this.profileImageSrc="";
    this.broadcastService.setProfileImage("");
    this.broadcastService.getProfileImage().subscribe(profileImageSrc => {
      this.profileImageSrc = profileImageSrc;
    });

    let user = JSON.parse(localStorage.getItem('user'));
    this.roleName = user.roleName;
    this.userName = user.userName;
    this.parentRoleName = user.entityName;
    //this.userEmail = user.emailAddress;
    //this.contactNo = user.contactNo;
    let path: string = user.refNo + "/" + user.roleName;//neew add to download profile pic
    this.apiService.DownloadProfilePic.getByPath(path).subscribe(result=>{
      this.profileImageSrc="";
      if (result["status"] === 2000 && result.data !=null && result.data.length>0) {
        this.profileImageSrc = "data:image/jpeg;base64," + result.data;
        this.broadcastService.setProfileImage(this.profileImageSrc);
      }
    });
    let menus =this.getMenus();
    this.onSelectionsubMenuLevel1 = [];
    this.onSelectionsubMenuLevel2 = [];
    this.mapKey = [];
    this.previousvalue = '';

    this.broadcastService.getProfileModifiedObservable().subscribe(updatedUserData=>{
      this.userName = updatedUserData.firstName;
  });

  /* Working on app/issues/782 */
  let payloadWorkflow = JSON.parse(localStorage.getItem('regw'));
  this.registrationWorkflowCompleted = payloadWorkflow.registrationWorkflowCompleted;
  this.broadcastService.getRegistrationWorkflow().subscribe(workflow=>{
    this.registrationWorkflowCompleted = workflow.registrationWorkflowCompleted;
    const url = window.location.href.toString();
    //if ((url.indexOf('doctor/profile') > 0 || url.indexOf('doctor/chamber') > 0) && !this.registrationWorkflowCompleted) {
    if (!this.registrationWorkflowCompleted) {
      this.disableMenu = true;
    }else{
      this.disableMenu = false;
    }
  });
  /*End Working on app/issues/782 */
  }
  getMenus()
  {
      this.apiService.GetMenus.getByPathQuery(this.roleName ,{'parentRoleName':this.parentRoleName, 'platform': 'WEB'}).subscribe(
        res => {
          this.menus = res;
          this.map1 = new Map();
          this.map2 = new Map();
          this.map3 = new Map();
          //this.menuIdMap = new Map();

          this.map1.clear();

          for (let i = 0 ; i < this.menus.length; i++)
          {
            //let mi0: MenuItem = {};
            this.menuItems1.push(this.menus[i].menuLabel);
            //mi0.styleClass = "profileHeader";
            // this.map1.set(this.menus[i].menuLabel, '');
            this.menuImgSrc.push(this.menus[i].iconUrl);

            this.subMenuLevel1 = this.menus[i].subMenus;


            for (let j = 0 ; j < this.subMenuLevel1.length; j++)
            {
              //let mi1: MenuItem = {};
              this.menuItems2.push(this.subMenuLevel1[j].menuLabel);
              //this.map1.set(this.menus[i].menuLabel, this.subMenuLevel1[j].menuLabel);
              this.subMenuLevel2 = this.subMenuLevel1[j].subMenus;
              if(this.subMenuLevel1[j].urlPath != null)
              {
                //this.menuItems3.push(this.subMenuLevel1[j].urlPath);
                this.map2.set(this.subMenuLevel1[j].menuLabel, this.subMenuLevel1[j].urlPath);
                //this.menuIdMap.set(this.subMenuLevel1[j].menuLabel, this.subMenuLevel1[j].menuId);
              }
              this.menuItems3 = [];
              //this.menuItems3.push(this.subMenuLevel1[j].urlPath);
              for (let k = 0 ; k < this.subMenuLevel2.length; k++) {
                this.menuItems3.push(this.subMenuLevel2[k].menuLabel);
              }
              if(this.menuItems3.length > 0)
              this.map3.set(this.subMenuLevel1[j].menuLabel, this.menuItems3);
            }
            
            if(this.menuItems2.length == 0)
            {
              this.map1.set(this.menus[i].menuLabel, '');
              this.map2.set(this.menus[i].menuLabel, this.menus[i].urlPath);
            }
            else
            this.map1.set(this.menus[i].menuLabel, this.menuItems2);
            this.menuItems2 = [];
           
          }
         
         
          this.menus = [];
          this.menus = res;
        }
      );
      
  }

  toggleViewPanel(value) {
    this.onSelectionsubMenuLevel1 = [];
    this.onSelectionsubMenuLevel1 = this.map1.get(value);
    
    if(this.expandedState == 'in' && this.previousvalue != '' && this.previousvalue != value)
    {
        //alert('JKL');
    }
    else if(this.onSelectionsubMenuLevel1.length != 0)
      this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
    if(this.onSelectionsubMenuLevel1.length == 0)
    {
      // if(this.expandedState == 'in')
      this.expandedState = 'out';
	  document.getElementById('side-bar').classList.remove('slide'); 
	  document.getElementById('side-bar').classList.add('slide-out'); 
      //this.expandedState = this.expandedState === 'in' ? 'out' : 'out';
    }  
    
    this.previousvalue = '';
    this.previousvalue = value;  
    let url = this.map2.get(value);
    if(url != null)
    {
      this.router.navigate([url]);// working on issue number -->> https://gitlab.com/sbis-poc/app/issues/853
      // let user = JSON.parse(localStorage.getItem('user'));
      // this.router.navigate([url, {userRefNo: user.refNo}]);
    }
    
    this.name = value;
    
  }


  goToScreen(selectedMenu) {
    this.onSelectionsubMenuLevel2 = [];
    let url = this.map2.get(selectedMenu);
    //let menuId = this.menuIdMap.get(selectedMenu);
    let val1 = this.map3.get(selectedMenu);
    this.onSelectionsubMenuLevel2 = val1;
    this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
	document.getElementById('side-bar').classList.remove('slide'); 
	document.getElementById('side-bar').classList.add('slide-out'); 

    if(url != null)
    {
      let user = JSON.parse(localStorage.getItem('user'));
      this.router.navigate([url]);
      //this.router.navigate([url, {menuId: menuId}]);
    }
    
    // if(this.onSelectionsubMenuLevel2.length == 0)
    // this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
  }

  goToUserAddress() {
    this.router.navigate(['/individual/tab-address']);
    this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
  }

  goToUserOccupation() {
    this.router.navigate(['/individual/tab-occupation']);
    this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
  }

  goToUserExercise() {
    this.router.navigate(['/individual/tab-exercise']);
    this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
  }

  goToMedicalHistory(){
    this.router.navigate(['/individual/medical-details']);
    this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
  }
  isAmIAlredyIn:boolean = false;
  
  goToUserProfile(){
    if(this.roleName=='INDIVIDUAL'){
      this.router.navigate(['/individual/individual-dashb']);
      this.isAmIAlredyIn = true;
    }
    else if (this.parentRoleName == 'PHARMACY') {
      this.router.navigate(['/opd/opdPharmacyView/pharmacy']);
    }
    else
    {
      this.router.navigate(['/doctor/calendar']);
    }

  }
  
  closeMenu(){
		 document.getElementById('side-bar').classList.remove('slide'); 
		 document.getElementById('side-bar').classList.add('slide-out'); 
	 //this.expandedState = this.expandedState === 'out' ? 'in' : 'out';
	 //console.log(this.expandedState);
	 if(this.expandedState === 'in'){
		 this.expandedState = "out";
	 }
	 
  }

}
