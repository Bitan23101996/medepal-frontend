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
import { PeerConsultingService } from '../../peer-consulting/peer-consulting.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { GetSet } from '../../../core/utils/getSet';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { SearchPipe } from '../../../../app/shared/search.pipe';

@Component({
  selector: 'app-peer-consulting-panel-list',
  templateUrl: './peer-consulting-panel-list.component.html',
  styleUrls: ['./peer-consulting-panel-list.component.css']
})
export class PeerConsultingPanelListComponent implements OnInit {

  docRefNumber: any;
  peerConsultingList: any;
  peerConsultingListToView: any = [];
  peerConsultingListFilterForMe: any = [];
  peerConsultingListFilterForOthers: any = [];
  user: any;
  peerConsultingListArr: any[] = [];
  panelVisible = false;
  loading: boolean = false;

  constructor(
    private broadcastService: BroadcastService,
    private peerConsultingService: PeerConsultingService,
    private translate: TranslateService,
    private router: Router
  ) {
    // this language will be used as a {{ 'LOGIN.LOGIN_HEADER' | translate }}llback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn{{ 'LOGIN.LOGIN_HEADER' | translate }} available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.broadcastService.setHeaderText('Peer Consulting Panel List');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.docRefNumber = this.user.refNo;
    this.getPeerConsultingList();
  }

  getPeerConsultingList() {
    this.peerConsultingService.getPeerConsultingByDoc(this.docRefNumber).subscribe((result) => {
      if (result.status == 2000) {
        this.peerConsultingList = result.data;
        this.peerConsultingListToView = result.data;
        this.peerConsultingListFilterForMe = this.peerConsultingList.filter(x => x.doctorRefNo == this.docRefNumber);
        this.peerConsultingListFilterForMe = this.peerConsultingListFilterForMe.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this.peerConsultingListFilterForOthers = this.peerConsultingList.filter(x => x.doctorRefNo != this.docRefNumber);
        this.peerConsultingListFilterForOthers = this.peerConsultingListFilterForOthers.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      }
    })
  }

  //method to filter by doctor name
  filterByInputText(event,colNameVal) {
    let typedDocName = event.target.value;
    let colName: string = colNameVal == 'doctor'? 'doctorName' : 'patientName';
    let testArrforMe: any[] = this.peerConsultingList.filter(x => x.doctorRefNo == this.docRefNumber);
    let testArrforOthers: any[] = this.peerConsultingList.filter(x => x.doctorRefNo != this.docRefNumber);
    let searchPipeVar = new SearchPipe();
    this.peerConsultingListFilterForMe = searchPipeVar.searchByFieldName(testArrforMe, colName, typedDocName);
    this.peerConsultingListFilterForOthers = searchPipeVar.searchByFieldName(testArrforOthers, colName, typedDocName);
  }//end of method

  // //method to filter by patient name
  // filterByPatientName(event) {
  //   let typedDocName = event.target.value;
  //   let testArrforMe: any[] = this.peerConsultingList.filter(x => x.doctorRefNo == this.docRefNumber);
  //   let testArrforOthers: any[] = this.peerConsultingList.filter(x => x.doctorRefNo != this.docRefNumber);
  //   let searchPipeVar = new SearchPipe();
  //   this.peerConsultingListFilterForMe = searchPipeVar.searchByFieldName(testArrforMe, 'patientName', typedDocName);
  //   this.peerConsultingListFilterForOthers = searchPipeVar.searchByFieldName(testArrforOthers, 'patientName', typedDocName);
  // }//end of method

  openPeerConsultingCaseDetails(peerConsultingList) {
    this.router.navigate(['peerconsulting/peer-consulting-case-details']);
    GetSet.setPeerConsultingCaseDetails(JSON.stringify(peerConsultingList));
	this.consultationRequest(event);
  }

  // filterForDocName(docName) {
  //   this.peerConsultingList = this.peerConsultingListForFilteration.filter(x => x['doctorName'] == docName);
  // }
  
  consultationRequest(event){
	  //let pcStatus = 'others';
	  if((event.target.classList).contains("others")){
		  localStorage.setItem('status', 'others');
	  }
  }

  resetAllFilter() {
    
  }
  
  refinePanelDisplay(){
      this.panelVisible = !this.panelVisible;
    }

    refinePanelhide(){
      this.panelVisible = false;
    }

}
