import { Component, OnInit } from '@angular/core';
import { GetSet } from '../../../core/utils/getSet';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BroadcastService } from './../../../core/services/broadcast.service';
import { IndividualService } from '../individual.service';
import { DeliveryService } from '../../delivery/delivery.service';
import {MenuItem} from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { SBISConstants } from '../../../SBISConstants';

@Component({
  selector: 'app-my-order-details',
  templateUrl: './my-order-details.component.html',
  styleUrls: ['./my-order-details.component.css']
})
export class MyOrderDetailsComponent implements OnInit {

  activeIndex : any;
  myOrderDetails: any;
  events: any = [];
  orderStateList: MenuItem[];
  downloadOrderInvoice={
    downloadImageSrc : "",
    contentType:"",
    orderByUserName:"",
    fileName:""
  }
  downloadedFile: any = null;

  constructor(
    private individualService: IndividualService,
    private broadcastService: BroadcastService,
    private router: Router,
    private _deliveryService: DeliveryService,
    private _domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.broadcastService.setHeaderText('ORDER SUMMARY');
    this.myOrderDetails = GetSet.getMyOrderDetails();
    ///sbis-poc/app/issues/673 start
    if(this.myOrderDetails == null){
      this.myOrderDetails = JSON.parse(localStorage.getItem("myOrderDetails"));
      if(this.myOrderDetails == null){
        this.backOperation();
      }
    }
    else{
      localStorage.setItem("myOrderDetails",JSON.stringify(this.myOrderDetails));
    }
    ///sbis-poc/app/issues/673 end
    //new add for download image
    this.downloadOrderInvoice.downloadImageSrc = '';
    this.downloadOrderInvoice.contentType = '';
    this.downloadOrderInvoice.orderByUserName = this.myOrderDetails.orderByUserName;  
    this.downloadORderInvoiceReport();
    this.orderStateList = [];

    this.getDeliveryFlow(this.myOrderDetails.pharmacyOrderRefNo);

  }

  backOperation() {
    
    localStorage.setItem("clearPrevious",JSON.stringify("clearPrevious"));
    this.router.navigate(['individual/my-order']);
  }

  downloadFile(){
    const link = document.createElement('a');
    link.href =  this.downloadOrderInvoice.downloadImageSrc;
    link.download =this.downloadOrderInvoice.fileName;
    link.click();
  }//end of method

   //new add to download image
  downloadORderInvoiceReport() {
    this.downloadOrderInvoice={
      downloadImageSrc : "",
      contentType:"",
      orderByUserName:"",
      fileName:""
    }
    this.individualService.getMyOrderInvoiceReport(this.myOrderDetails.pharmacyOrderRefNo).subscribe((result) => {
      if(result.status !=2000){
        return;
      }
      this.downloadOrderInvoice.contentType=result.data.contentType;
      this.downloadOrderInvoice.downloadImageSrc = "data:"+result.data.contentType+";base64," + result.data.data;
      this.downloadOrderInvoice['fileName']= result.data.fileName;
    });
  }

  getDeliveryFlow(pharmacyOrderRefNo){
    let currDate = new Date();
    let payload = {pharmacyOrderRefNo: pharmacyOrderRefNo};
    this.activeIndex = null;
    this._deliveryService.getDeliveryFlowv2(payload).subscribe(res => {
      let label = "";
      //this.events = res['data'];
      for (let i = 0; i < res['data'].length; i++) {
        if(res['data'][i].event=="PCK" && res['data'][i].eventDateTime != null){
          this.events.pop();
        }
        if(res['data'][i].eventDateTime == null && res['data'][i].event=="ATM") continue;

        this.events.push(res['data'][i]);
      }
      
      
      for (let i = 0; i < this.events.length; i++) {
        let dt = "";
        if(this.events[i].eventDateTime!=null){
          let dtTime = this.events[i].eventDateTime.split("T");
          let date = dtTime[0].split("-");
          let time = dtTime[1];
          dt = date[2]+"-"+date[1]+"-"+date[0]+" "+time;
        }
        if(this.events[i].event == "OUT"){
          label = "Processing...";
        }
        else{
          label = this.events[i].eventDesc+"\n";
          label += this.events[i].eventDateTime!=null?dt:'';
          
        }
        
        
        this.orderStateList.push({label: label, command: (event: any) => {
          this.activeIndex = i;
        }
        })
      }
      for (let i = 0; i < this.events.length; i++) {
        if(this.events[i].eventDateTime==null){
          this.activeIndex = i-1;
          break;   
        }
        if(this.events[this.events.length-1].eventDateTime!=null){
          this.activeIndex = this.events.length-1;
        }
      }
      let packed = res.data.find(x => x.event == 'PACKED');
      (packed.refNo) ? this.downloadDocument(packed.refNo) : null;
    });  
  }

  //Call this method in the image source, it will sanitize it.
  transform(imgSrc){
    return this._domSanitizer.bypassSecurityTrustResourceUrl(imgSrc);
  }//end of method

  downloadDocument(documentRefNo) {
    this.downloadedFile = null;
    let query = {
      'downloadFor': SBISConstants.IMAGE_UPLOAD_CONST.PHARMACY_INVOICE,
      'documentRefNo': documentRefNo
    }
    this._deliveryService.downloadDocument(query).subscribe(result => {
      if (result.status == 2000) {
        let imgSrc = "data:"+((result.data.contentType)? result.data.contentType: "image/jpeg")+";base64,"+ result.data.data;
        let imgURL: any = "data:"+((result.data.contentType)? result.data.contentType: "image/jpeg")+";base64,"+ result.data.data;
        this.downloadedFile = {imgSrc: imgURL, contentType: result.data.contentType, actualSrc: imgSrc};
      }
    });
  }

  openPdf(src){
    var newTab = window.open();
    newTab.document.body.innerHTML = '<iframe width="100%" height="101%" style="padding: 0;margin:0;" src="'+src+'""></iframe>';
    newTab.document.body.style.overflow = "hidden";
    newTab.document.body.style.margin = "0";
    newTab.document.body.style.padding = "0";
  }

    //method to open image in new tab
    openImageInNewTab(imgSrc){
      var image = new Image();
      image.src = imgSrc;
      var w = window.open("");
      w.document.write(image.outerHTML);
    }//end of method


}
