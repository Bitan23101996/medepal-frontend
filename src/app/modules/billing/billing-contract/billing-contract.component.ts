import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { BillingService } from '../billing.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { MapService } from '../../../core/services/map.service';
import { GetSet } from '../../../core/utils/getSet';
import { DoctorService } from '../../doctor/doctor.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-billing-contract',
  templateUrl: './billing-contract.component.html',
  styleUrls: ['./billing-contract.component.css']
})
export class BillingContractComponent implements OnInit {

  @ViewChild('appStore') appStore: TemplateRef<any>;
  @ViewChild('download') download: TemplateRef<any>

  isRegistrationWorkflowCompleted: boolean = false;
  workflow: any;
  ipAddress: any;
  doctorName: any;
  currentDateTime: any;
  currentCity: any;
  disableAcceptBtn: boolean =true;
  redirectFlag: boolean = true;
  successMsgFor = "doctorRegistration";
  lat: any;
  long: any;
  modalRef: BsModalRef;
  mobileBrowserCheck: boolean = false;

  constructor(private _broadcastService: BroadcastService,
    private _billingService: BillingService,
    private _toastService: ToastService,
    private _router: Router,
    private _mapService: MapService,
    private _doctorService: DoctorService, 
    private bsModalService: BsModalService   
  ) { }

  ngOnInit() {
    this._broadcastService.setHeaderText('Agreement');
    let user = JSON.parse(localStorage.getItem("user"));
    let payload = {
      refNo: user.refNo
    }
    this._doctorService.getDoctorDetailsByRefNo(payload).subscribe(data => {
      this.doctorName = data["data"].doctorName;
    });
    //this.doctorName = user.userName;
    this.currentDateTime=new Date();
    this.workflow = JSON.parse(localStorage.getItem('regw'));

    if(this.workflow.registrationWorkflowCompleted){
      this.redirectFlag = false;
    }
    else{
      this.redirectFlag = true;
    }
    //this.workflowSteps = workflow.registrationWorkflowSteps;
    this._broadcastService.setRegistrationWorkflow(this.workflow);
    this.isRegistrationWorkflowCompleted = this.workflow.registrationWorkflowCompleted;

    this.getIpAddress();
    //this.getUserLocation();

  }

  getIpAddress(){
    this._billingService.getIpAddress().subscribe(data => {
      console.log(data.data);
      if(data['status']=='2000'){
        this.ipAddress = data['data'];
      }
    });
  }

  acceptAgreement(place){
     if (place == null || place.trim() == "") {
      this._toastService.showI18nToastFadeOut("Please enter place", "error");
      return;
    }
    
    if(confirm("Are you sure to accept agreement with us?")){
      let payload = {
        signedBy: this.doctorName,
        ipAddress: this.ipAddress,
        place: place
      }
      this._billingService.saveDoctorContract(payload).subscribe(data => {
        if(data.status == "2000"){
          let payloadWorkflow = JSON.parse(localStorage.getItem('regw'));
          if(payloadWorkflow.registrationWorkflowCompleted){
            this.redirectFlag = true;
          }
          else{
            this.redirectFlag = false;
          }
          
          // payloadWorkflow.hasPlan = true;
          // payloadWorkflow.hasContract = true;
          //payloadWorkflow.validProfile = true;
          // payloadWorkflow.isChabmerOrAddressExist = true;
          payloadWorkflow.registrationWorkflowCompleted = true;
          this._broadcastService.setRegistrationWorkflow(payloadWorkflow);
          localStorage.setItem('regw',JSON.stringify(payloadWorkflow));
          this._broadcastService.setHeaderText("Registration Completed");
          
          
        }
        
      });
    }
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height 
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      console.log("End");
      this.disableAcceptBtn = false;
    }
}

getUserLocation() {
  // /// locate the user
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      // console.log("position::", position);
      const long = position.coords.longitude;
      const lat = position.coords.latitude;
      this.setLatLong(long, lat);
    });
  }
}
setLatLong(long, lat) {
  this.long = long;
  this.lat = lat;
  this._mapService.getAddressByLatLong(lat, long);
  console.log("Address");
  console.log(GetSet.getCurrentAddress());
   
}

detectPlatform(){
  if (navigator.userAgent.match(/Android/i)|| navigator.userAgent.match(/webOS/i)|| navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)) {
                this.mobileBrowserCheck = true;
            } else {
                this.mobileBrowserCheck = false;
            }


}


mySignaturePage(){
  this._router.navigate(['/doctor/doctor-upload']);
}

addChamberPage(){
  this._router.navigate(['/doctor/chamber']);
}

addAssistantPage()
{
  this._router.navigate(['/doctor/assistant']);
}

openDownloadModal(ev: any) {
  this.modalRef = this.bsModalService.show(this.download, { class: 'modal-md' });
    this.detectPlatform();
}

}
